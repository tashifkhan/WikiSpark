// Signed clearance cookie for the Turnstile gate.
//
// Format: v1.<expiresAtSeconds>.<uaHash>.<signature>
// - uaHash binds the cookie to the browser's user agent so a cookie lifted
//   from one client can't be replayed by a different crawler build.
// - signature is HMAC-SHA256(secret, "v1.<exp>.<uaHash>"), base64url.
// It is intentionally not bound to the IP address: phones and laptops change
// networks all the time, and that would re-challenge real readers.

export const CLEARANCE_COOKIE = "ws_clearance";
export const CLEARANCE_TTL_SECONDS = 60 * 60 * 24; // ~24h

const VERSION = "v1";
const encoder = new TextEncoder();

function toBase64Url(bytes: ArrayBuffer): string {
	let binary = "";
	for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(secret: string, data: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

export async function hashUserAgent(userAgent: string): Promise<string> {
	const digest = await crypto.subtle.digest("SHA-256", encoder.encode(userAgent));
	return toBase64Url(digest).slice(0, 16);
}

// Constant-time string comparison.
function safeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

export async function createClearance(
	secret: string,
	userAgent: string,
	nowMs: number = Date.now(),
): Promise<string> {
	const exp = Math.floor(nowMs / 1000) + CLEARANCE_TTL_SECONDS;
	const payload = `${VERSION}.${exp}.${await hashUserAgent(userAgent)}`;
	return `${payload}.${await hmac(secret, payload)}`;
}

export async function verifyClearance(
	secret: string,
	value: string | undefined,
	userAgent: string,
	nowMs: number = Date.now(),
): Promise<boolean> {
	if (!value) return false;
	const parts = value.split(".");
	if (parts.length !== 4 || parts[0] !== VERSION) return false;
	const [version, expRaw, uaHash, signature] = parts;
	const exp = Number(expRaw);
	if (!Number.isInteger(exp) || exp * 1000 < nowMs) return false;
	// Reject cookies claiming a lifetime longer than we ever issue.
	if (exp * 1000 > nowMs + (CLEARANCE_TTL_SECONDS + 300) * 1000) return false;
	if (!safeEqual(uaHash, await hashUserAgent(userAgent))) return false;
	const expected = await hmac(secret, `${version}.${expRaw}.${uaHash}`);
	return safeEqual(signature, expected);
}

export function readCookie(header: string | null, name: string): string | undefined {
	if (!header) return undefined;
	for (const part of header.split(";")) {
		const idx = part.indexOf("=");
		if (idx === -1) continue;
		if (part.slice(0, idx).trim() === name) return part.slice(idx + 1).trim();
	}
	return undefined;
}

export function clearanceCookieHeader(value: string): string {
	return [
		`${CLEARANCE_COOKIE}=${value}`,
		"Path=/",
		`Max-Age=${CLEARANCE_TTL_SECONDS}`,
		"HttpOnly",
		"Secure",
		"SameSite=Lax",
	].join("; ");
}
