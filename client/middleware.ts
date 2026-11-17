// Turnstile bot gate for WikiSpark (Vercel Routing Middleware).
//
// Visitors without a valid signed clearance cookie that look automated get a
// Cloudflare Turnstile check. Passing it sets an HMAC-signed cookie for ~24h.
// Static assets never reach this file (see `config.matcher`).
//
// Env vars:
//   TURNSTILE_SITE_KEY (or NEXT_PUBLIC_TURNSTILE_SITE_KEY / VITE_TURNSTILE_SITE_KEY)
//   TURNSTILE_SECRET_KEY
//   GATE_COOKIE_SECRET   random string, >= 32 chars, used to sign the cookie
//   TURNSTILE_MODE       "suspicious" (default) | "always" | "off"
// If the keys are missing the gate fails open and logs a warning, so a deploy
// without them still serves the site.
import { next } from "@vercel/functions";
import {
	CLEARANCE_COOKIE,
	clearanceCookieHeader,
	createClearance,
	readCookie,
	verifyClearance,
} from "./gate/clearance.ts";
import { isAllowedBot, parseMode, suspicionReason } from "./gate/classify.ts";
import { renderChallengePage } from "./gate/challengePage.ts";
import { verifyTurnstileToken } from "./gate/turnstile.ts";

export const config = {
	matcher: ["/", "/about", "/wiki", "/wiki/:path*", "/_gate/verify"],
};

const VERIFY_PATH = "/_gate/verify";

declare const process: { env: Record<string, string | undefined> };

interface GateEnv {
	siteKey: string;
	secretKey: string;
	cookieSecret: string;
}

let warnedMissing = false;

function readEnv(): GateEnv | null {
	const env = process.env;
	const siteKey =
		env.TURNSTILE_SITE_KEY || env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || env.VITE_TURNSTILE_SITE_KEY;
	const secretKey = env.TURNSTILE_SECRET_KEY;
	const cookieSecret = env.GATE_COOKIE_SECRET;
	if (!siteKey || !secretKey || !cookieSecret) {
		if (!warnedMissing) {
			warnedMissing = true;
			console.warn(
				"[gate] Turnstile gate disabled (fail-open): set TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY and GATE_COOKIE_SECRET",
			);
		}
		return null;
	}
	return { siteKey, secretKey, cookieSecret };
}

function clientIp(headers: Headers): string | undefined {
	return (
		headers.get("cf-connecting-ip") ||
		headers.get("x-real-ip") ||
		headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		undefined
	);
}

// Only allow same-site relative paths as the post-check destination.
function safeNext(raw: string | null | undefined): string {
	if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/";
	if (raw.startsWith(VERIFY_PATH)) return "/";
	return raw.slice(0, 2048);
}

function challengeResponse(env: GateEnv, nextPath: string, error = false): Response {
	return new Response(
		renderChallengePage({ siteKey: env.siteKey, verifyPath: VERIFY_PATH, next: nextPath, error }),
		{
			status: 403,
			headers: {
				"content-type": "text/html; charset=utf-8",
				"cache-control": "private, no-store",
				"x-robots-tag": "noindex, nofollow",
				"x-wikispark-gate": "challenge",
			},
		},
	);
}

async function handleVerify(request: Request, env: GateEnv): Promise<Response> {
	if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return new Response("Bad Request", { status: 400 });
	}
	const token = String(form.get("cf-turnstile-response") ?? "");
	const nextPath = safeNext(String(form.get("next") ?? "/"));
	if (!token || token.length > 2048) return challengeResponse(env, nextPath, true);

	let ok = false;
	try {
		const result = await verifyTurnstileToken({
			secret: env.secretKey,
			token,
			remoteIp: clientIp(request.headers),
		});
		// Real keys echo the widget action; Cloudflare's test keys return none.
		ok = result.success && (!result.action || result.action === "wikispark-gate");
		if (!ok) console.warn("[gate] siteverify rejected", result["error-codes"] ?? []);
	} catch (err) {
		console.error("[gate] siteverify failed", err);
	}
	if (!ok) return challengeResponse(env, nextPath, true);

	const cookie = await createClearance(env.cookieSecret, request.headers.get("user-agent") ?? "");
	return new Response(null, {
		status: 303,
		headers: {
			location: nextPath,
			"set-cookie": clearanceCookieHeader(cookie),
			"cache-control": "private, no-store",
		},
	});
}

export default async function middleware(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const mode = parseMode(process.env.TURNSTILE_MODE);
	if (mode === "off") return next();

	const env = readEnv();
	if (!env) return next();

	if (url.pathname === VERIFY_PATH) return handleVerify(request, env);
	if (request.method !== "GET" && request.method !== "HEAD") return next();

	const ua = request.headers.get("user-agent") ?? "";
	if (isAllowedBot(ua)) return next();

	const cookie = readCookie(request.headers.get("cookie"), CLEARANCE_COOKIE);
	if (await verifyClearance(env.cookieSecret, cookie, ua)) return next();

	if (mode === "suspicious") {
		const reason = suspicionReason(request.headers);
		if (!reason) return next();
		console.log(`[gate] challenge reason=${reason} path=${url.pathname}`);
	}
	return challengeResponse(env, url.pathname + url.search);
}
