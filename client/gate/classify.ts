// Request classification for the Turnstile gate.
//
// "suspicious" mode only challenges requests that don't look like a real
// browser navigation. Real readers on current Chrome/Edge/Firefox/Safari send
// Sec-Fetch-* headers, an Accept-Language, and (Chromium) Sec-CH-UA client
// hints; the crawler hitting /wiki/* sends a bare "Chrome/1xx" user agent.

// Search engines and link-preview fetchers we always let through so SEO and
// shared-link cards keep working. UA strings can be spoofed; the platform
// firewall (Cloudflare / Vercel) handles spoofers by network and rate.
const ALLOWED_BOTS =
	/(googlebot|google-inspectiontool|bingbot|duckduckbot|applebot|yandexbot|baiduspider|slurp|twitterbot|facebookexternalhit|facebookcatalog|linkedinbot|slackbot|discordbot|telegrambot|whatsapp|pinterestbot|redditbot|embedly|iframely|skypeuripreview|mastodon|bluesky|cardyb)/i;

const AUTOMATION =
	/(curl|wget|python|aiohttp|httpx|scrapy|go-http-client|java\/|okhttp|axios|node-fetch|undici|libwww|httpclient|headless|phantomjs|selenium|puppeteer|playwright|crawler|spider|scraper|gptbot|claudebot|bytespider|ccbot|perplexitybot|amazonbot|shapbot|meta-externalagent)/i;

export type GateMode = "off" | "suspicious" | "always";

export function parseMode(raw: string | undefined): GateMode {
	const value = (raw ?? "").trim().toLowerCase();
	return value === "off" || value === "always" ? value : "suspicious";
}

export function isAllowedBot(userAgent: string): boolean {
	return ALLOWED_BOTS.test(userAgent);
}

export function suspicionReason(headers: Headers): string | null {
	const ua = headers.get("user-agent") ?? "";
	if (!ua.trim()) return "empty-ua";
	if (AUTOMATION.test(ua)) return "automation-ua";
	if (!/^Mozilla\/5\.0 /.test(ua)) return "non-browser-ua";

	const accept = headers.get("accept") ?? "";
	if (!accept.includes("text/html") && !accept.includes("*/*")) return "no-html-accept";
	if (!headers.get("accept-language")) return "no-accept-language";

	// Every evergreen browser sends Sec-Fetch-Mode on navigations.
	if (!headers.get("sec-fetch-mode")) return "no-sec-fetch";

	// Desktop/Android Chromium sends client hints over HTTPS. iOS "CriOS" is
	// WebKit and Android WebViews ("; wv)") vary, so skip those.
	const claimsChromium = /(Chrome|Chromium|Edg)\/\d+/.test(ua) && !/CriOS|; wv\)/.test(ua);
	if (claimsChromium && !headers.get("sec-ch-ua")) return "chromium-without-client-hints";

	return null;
}
