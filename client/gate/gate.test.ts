// Run with: node --test gate/
import { test } from "node:test";
import assert from "node:assert/strict";
import { createClearance, readCookie, verifyClearance } from "./clearance.ts";
import { isAllowedBot, parseMode, suspicionReason } from "./classify.ts";
import { renderChallengePage } from "./challengePage.ts";

const SECRET = "test-secret-test-secret-test-secret";
const UA =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36";

test("clearance round-trips and binds to the user agent", async () => {
	const cookie = await createClearance(SECRET, UA);
	assert.equal(await verifyClearance(SECRET, cookie, UA), true);
	assert.equal(await verifyClearance(SECRET, cookie, UA + " x"), false);
	assert.equal(await verifyClearance("other-secret", cookie, UA), false);
});

test("clearance rejects expired, tampered and malformed values", async () => {
	const old = await createClearance(SECRET, UA, Date.now() - 2 * 86400 * 1000);
	assert.equal(await verifyClearance(SECRET, old, UA), false);
	const cookie = await createClearance(SECRET, UA);
	const [v, exp, ua, sig] = cookie.split(".");
	assert.equal(await verifyClearance(SECRET, `${v}.${Number(exp) + 60}.${ua}.${sig}`, UA), false);
	assert.equal(await verifyClearance(SECRET, "garbage", UA), false);
	assert.equal(await verifyClearance(SECRET, undefined, UA), false);
});

test("readCookie finds the named cookie", () => {
	assert.equal(readCookie("a=1; ws_clearance=abc.def; b=2", "ws_clearance"), "abc.def");
	assert.equal(readCookie(null, "ws_clearance"), undefined);
});

const browserHeaders = () =>
	new Headers({
		"user-agent": UA,
		accept: "text/html,application/xhtml+xml,*/*;q=0.8",
		"accept-language": "en-IN,en;q=0.9",
		"sec-fetch-mode": "navigate",
		"sec-ch-ua": '"Chromium";v="146", "Google Chrome";v="146"',
	});

test("real browser navigations are not suspicious", () => {
	assert.equal(suspicionReason(browserHeaders()), null);
	const firefox = new Headers({
		"user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:151.0) Gecko/20100101 Firefox/151.0",
		accept: "text/html,*/*;q=0.8",
		"accept-language": "en-US",
		"sec-fetch-mode": "navigate",
	});
	assert.equal(suspicionReason(firefox), null);
});

test("bare crawler requests are suspicious", () => {
	const h = browserHeaders();
	h.delete("sec-ch-ua");
	assert.equal(suspicionReason(h), "chromium-without-client-hints");
	assert.equal(suspicionReason(new Headers({ "user-agent": "python-requests/2.32" })), "automation-ua");
	assert.equal(suspicionReason(new Headers({})), "empty-ua");
	const noLang = browserHeaders();
	noLang.delete("accept-language");
	assert.equal(suspicionReason(noLang), "no-accept-language");
});

test("search engines and link previewers are allowed", () => {
	assert.equal(isAllowedBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"), true);
	assert.equal(isAllowedBot("WhatsApp/2.23.20.0"), true);
	assert.equal(isAllowedBot(UA), false);
});

test("mode parsing defaults to suspicious", () => {
	assert.equal(parseMode(undefined), "suspicious");
	assert.equal(parseMode("ALWAYS"), "always");
	assert.equal(parseMode("off"), "off");
});

test("challenge page escapes values", () => {
	const html = renderChallengePage({ siteKey: "k", verifyPath: "/_gate/verify", next: '/wiki/"><script>' });
	assert.ok(!html.includes('"><script>'));
});
