// The interstitial shown to traffic that needs a Turnstile check.
// Matches the site's "Classic" amber theme and Comfortaa type.

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

export const CHALLENGE_CSS = `/* Hallmark · scope: component · brand: WikiSpark Classic theme (src/pages/Index.tsx) · genre: editorial · posture: restrained · signature: the Turnstile check itself, nothing else on the screen · modes: light+dark */
/* critique: one job, one screen; amber accent carries only the wordmark and the action, everything else is ink on paper. */
:root {
	--color-paper: #fefcf9;
	--color-surface: #fef5e7;
	--color-ink: #78350f;
	--color-ink-soft: #92400e;
	--color-accent: #d97706;
	--color-accent-ink: #fffaf0;
	--color-rule: #f3dfbf;
	--color-focus: #b45309;
	--color-action: #b45309;
	--color-action-hover: #92400e;
	--font-body: "Comfortaa", ui-rounded, "Segoe UI", system-ui, sans-serif;
	--measure: 26rem;
	--space-1: 0.5rem;
	--space-2: 1rem;
	--space-3: 1.5rem;
	--space-4: 2.5rem;
	--radius: 0.75rem;
}
@media (prefers-color-scheme: dark) {
	:root {
		--color-paper: #1c1408;
		--color-surface: #261b0c;
		--color-ink: #fdebc8;
		--color-ink-soft: #f1c98a;
		--color-accent: #f59e0b;
		--color-accent-ink: #1c1408;
		--color-rule: #3a2a12;
		--color-focus: #fbbf24;
		--color-action: #f59e0b;
		--color-action-hover: #fbbf24;
	}
}
*, *::before, *::after { box-sizing: border-box; }
html, body { overflow-x: clip; margin: 0; }
body {
	min-height: 100dvh;
	display: grid;
	place-items: center;
	padding: var(--space-3);
	background: var(--color-paper);
	color: var(--color-ink);
	font-family: var(--font-body);
	line-height: 1.6;
}
main { width: 100%; max-width: var(--measure); }
.wordmark { margin: 0 0 var(--space-4); font-size: 1.125rem; font-weight: 700; color: var(--color-accent); }
h1 { margin: 0 0 var(--space-1); font-size: 1.75rem; line-height: 1.25; font-weight: 700; overflow-wrap: break-word; min-width: 0; text-wrap: balance; }
p { margin: 0 0 var(--space-3); color: var(--color-ink-soft); text-wrap: pretty; }
.check { min-height: 70px; margin-bottom: var(--space-3); }
button {
	font: inherit;
	font-weight: 600;
	min-height: 48px;
	padding: var(--space-1) var(--space-3);
	border: 1px solid var(--color-action);
	border-radius: var(--radius);
	background: var(--color-action);
	color: var(--color-accent-ink);
	cursor: pointer;
	transition: background-color 150ms ease-out, color 150ms ease-out;
}
button:hover:not(:disabled) { background: var(--color-action-hover); border-color: var(--color-action-hover); }
button:active:not(:disabled) { background: var(--color-ink-soft); border-color: var(--color-ink-soft); }
button:disabled { background: var(--color-surface); color: var(--color-ink-soft); border-color: var(--color-rule); cursor: progress; }
:focus-visible, button:focus-visible, .check:focus-within { outline: 3px solid var(--color-focus); outline-offset: 3px; transition: none; }
.note { margin-top: var(--space-3); padding-top: var(--space-2); border-top: 1px solid var(--color-rule); font-size: 0.875rem; }
@media (prefers-reduced-motion: reduce) { button { transition: none; } }
`;

export function renderChallengePage(opts: {
	siteKey: string;
	verifyPath: string;
	next: string;
	error?: boolean;
}): string {
	const siteKey = escapeHtml(opts.siteKey);
	const next = escapeHtml(opts.next);
	const verifyPath = escapeHtml(opts.verifyPath);
	const message = opts.error
		? "That check didn't go through. Give it one more try."
		: "A one-time check keeps automated scrapers out. It usually passes on its own.";
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="A quick automated-traffic check before reading on Wiki Spark.">
<title>Wiki Spark: quick check</title>
<link rel="icon" type="image/png" href="/favicon-v2.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap">
<style>${CHALLENGE_CSS}</style>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</head>
<body>
<main>
	<p class="wordmark">Wiki Spark</p>
	<h1>Quick check before you read</h1>
	<p>${message}</p>
	<form method="POST" action="${verifyPath}" id="gate">
		<input type="hidden" name="next" value="${next}">
		<div class="check cf-turnstile" data-sitekey="${siteKey}" data-action="wikispark-gate" data-callback="wsGatePassed" data-theme="auto"></div>
		<button type="submit" id="go" disabled>Continue to Wiki Spark</button>
	</form>
	<noscript><p class="note">This check needs JavaScript. Turn it on and reload the page.</p></noscript>
</main>
<script>
function wsGatePassed() {
	var go = document.getElementById("go");
	go.disabled = false;
	document.getElementById("gate").requestSubmit ? document.getElementById("gate").requestSubmit() : document.getElementById("gate").submit();
}
</script>
</body>
</html>`;
}
