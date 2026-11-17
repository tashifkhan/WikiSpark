// Server-side Turnstile token verification (Siteverify API).
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface SiteverifyResult {
	success: boolean;
	hostname?: string;
	action?: string;
	"error-codes"?: string[];
}

export async function verifyTurnstileToken(opts: {
	secret: string;
	token: string;
	remoteIp?: string;
	fetchImpl?: typeof fetch;
}): Promise<SiteverifyResult> {
	const body = new URLSearchParams({ secret: opts.secret, response: opts.token });
	if (opts.remoteIp) body.set("remoteip", opts.remoteIp);
	body.set("idempotency_key", crypto.randomUUID());
	const res = await (opts.fetchImpl ?? fetch)(SITEVERIFY_URL, {
		method: "POST",
		body,
		signal: AbortSignal.timeout(5000),
	});
	if (!res.ok) return { success: false, "error-codes": [`http-${res.status}`] };
	return (await res.json()) as SiteverifyResult;
}
