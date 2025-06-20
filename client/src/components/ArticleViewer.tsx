import type { Theme, FontSettings } from "../pages/Index";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface ArticleViewerProps {
	article: any;
	isLoading: boolean;
	theme: Theme;
	fontSettings: FontSettings;
}

export const ArticleViewer = ({
	article,
	isLoading,
	theme,
	fontSettings,
}: ArticleViewerProps) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	// Check if a title should redirect to Wikipedia instead of being displayed
	const shouldRedirectToWikipedia = (title: string) => {
		// Check for non-article namespaces that should redirect to Wikipedia
		const nonArticleNamespaces = [
			"File:",
			"Image:",
			"Media:",
			"Category:",
			"Template:",
			"Help:",
			"Portal:",
			"User:",
			"Wikipedia:",
			"Special:",
			"Talk:",
			"User_talk:",
			"Wikipedia_talk:",
			"File_talk:",
			"MediaWiki:",
			"MediaWiki_talk:",
			"Template_talk:",
			"Help_talk:",
			"Category_talk:",
			"Portal_talk:",
			"Module:",
			"Module_talk:",
			"TimedText:",
			"TimedText_talk:",
		];

		return nonArticleNamespaces.some(
			(namespace) =>
				title.startsWith(namespace) ||
				title.includes(":" + namespace.replace(":", ""))
		);
	};

	// Intercept Wikipedia links
	useEffect(() => {
		const container = contentRef.current;
		if (!container) return;
		const anchors = container.querySelectorAll("a[href]");
		anchors.forEach((a) => {
			const anchor = a as HTMLAnchorElement;
			const href = anchor.getAttribute("href") || "";

			// Internal Wikipedia links (e.g. /wiki/Article)
			if (/^\/wiki\//.test(href)) {
				const articleTitle = decodeURIComponent(href.replace(/^\/wiki\//, ""));

				// Check if this should redirect to Wikipedia
				if (shouldRedirectToWikipedia(articleTitle)) {
					anchor.onclick = (e: MouseEvent) => {
						e.preventDefault();
						window.open(
							`https://en.wikipedia.org/wiki/${encodeURIComponent(
								articleTitle
							)}`,
							"_blank"
						);
					};
					anchor.setAttribute(
						"href",
						`https://en.wikipedia.org/wiki/${encodeURIComponent(articleTitle)}`
					);
					anchor.setAttribute("target", "_blank");
					anchor.setAttribute("rel", "noopener noreferrer");
				} else {
					anchor.onclick = (e: MouseEvent) => {
						e.preventDefault();
						navigate(`/wiki/${encodeURIComponent(articleTitle)}`);
					};
					anchor.setAttribute(
						"href",
						`/wiki/${encodeURIComponent(articleTitle)}`
					);
				}
			}
			// Full Wikipedia links (e.g. https://en.wikipedia.org/wiki/Article)
			else if (/^https?:\/\/([a-z]+\.)?wikipedia\.org\/wiki\//.test(href)) {
				const articleTitle = decodeURIComponent(href.split("/wiki/")[1] || "");

				// Check if this should redirect to Wikipedia
				if (shouldRedirectToWikipedia(articleTitle)) {
					anchor.onclick = (e: MouseEvent) => {
						e.preventDefault();
						window.open(href, "_blank");
					};
					anchor.setAttribute("target", "_blank");
					anchor.setAttribute("rel", "noopener noreferrer");
				} else {
					anchor.onclick = (e: MouseEvent) => {
						e.preventDefault();
						navigate(`/wiki/${encodeURIComponent(articleTitle)}`);
					};
					anchor.setAttribute(
						"href",
						`/wiki/${encodeURIComponent(articleTitle)}`
					);
				}
			}
			// Handle other Wikipedia URLs (like images, files, etc.)
			else if (/^https?:\/\/([a-z]+\.)?wikipedia\.org/.test(href)) {
				anchor.onclick = (e: MouseEvent) => {
					e.preventDefault();
					window.open(href, "_blank");
				};
				anchor.setAttribute("target", "_blank");
				anchor.setAttribute("rel", "noopener noreferrer");
			}
			// Handle Wikimedia Commons and other Wikimedia URLs
			else if (
				/^https?:\/\/commons\.wikimedia\.org/.test(href) ||
				/^https?:\/\/upload\.wikimedia\.org/.test(href)
			) {
				anchor.onclick = (e: MouseEvent) => {
					e.preventDefault();
					window.open(href, "_blank");
				};
				anchor.setAttribute("target", "_blank");
				anchor.setAttribute("rel", "noopener noreferrer");
			}
		});
	}, [article, navigate]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-20">
				<div
					className="animate-spin rounded-full h-12 w-12 border-b-2"
					style={{ borderColor: theme.colors.primary }}
				></div>
			</div>
		);
	}

	if (!article) {
		return (
			<div
				className="text-center py-20 rounded-2xl border-2 border-dashed"
				style={{
					borderColor: `${theme.colors.secondary}40`,
					backgroundColor: `${theme.colors.surface}80`,
				}}
			>
				<div className="space-y-4">
					<div
						className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
						style={{ backgroundColor: `${theme.colors.primary}20` }}
					>
						<svg
							className="w-8 h-8"
							style={{ color: theme.colors.primary }}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
					</div>
					<h3
						className="text-xl font-semibold"
						style={{ color: theme.colors.text }}
					>
						Search for an article
					</h3>
					<p style={{ color: theme.colors.textSecondary }}>
						Enter a topic in the search bar to begin reading
					</p>
				</div>
			</div>
		);
	}

	const getFontFamilyClass = (family: FontSettings["family"]) => {
		switch (family) {
			case "serif":
				return "font-serif";
			case "sans-serif":
				return "font-sans";
			case "monospace":
				return "font-mono";
			case "open-dyslexic":
				return "font-open-dyslexic";
			case "comfortaa":
				return "font-comfortaa";
			default:
				return "font-serif";
		}
	};

	const fontFamilyClass = getFontFamilyClass(fontSettings.family);

	// Create custom CSS for Wikipedia content styling
	const createWikipediaStyles = () => {
		return {
			color: theme.colors.text,
			fontSize: `${fontSettings.size}px`,
			lineHeight: fontSettings.lineHeight,
			"--link-color": theme.colors.primary,
			"--link-hover-color": theme.colors.accent,
			"--table-border-color": `${theme.colors.secondary}40`,
			"--table-header-bg": `${theme.colors.surface}`,
			"--table-row-hover": `${theme.colors.primary}10`,
			"--blockquote-border": theme.colors.primary,
			"--blockquote-bg": `${theme.colors.surface}80`,
		} as React.CSSProperties;
	};

	return (
		<article
			className={`mx-auto transition-all duration-300 ${fontFamilyClass} px-6 lg:px-8`}
			style={{
				maxWidth: `${fontSettings.maxWidth}px`,
			}}
		>
			{/* Article Header */}
			<header
				className="mb-12 pb-10 border-b-2"
				style={{ borderColor: `${theme.colors.secondary}20` }}
			>
				<div className="flex flex-col lg:flex-row items-center lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
					{article.thumbnail && (
						<div className="flex-shrink-0 mx-auto lg:mx-0">
							<div className="relative group">
								<img
									src={article.thumbnail.source}
									alt={article.title}
									className="rounded-2xl shadow-2xl"
									style={{
										maxWidth: "12rem",
										maxHeight: "12rem",
										width: "auto",
										height: "auto",
										display: "block",
									}}
								/>
							</div>
						</div>
					)}
					<div className="flex-1 text-center lg:text-left">
						<h1
							className="pl-0 lg:pl-3 text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-current to-current bg-clip-text"
							style={{ color: theme.colors.text }}
						>
							{article.title}
						</h1>
						{article.description && (
							<p
								className="pl-0 lg:pl-3 text-lg sm:text-xl lg:text-2xl mb-6 leading-relaxed font-light"
								style={{ color: theme.colors.textSecondary }}
							>
								{article.description}
							</p>
						)}
						<div
							className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-6 text-sm"
							style={{ color: theme.colors.textSecondary }}
						>
							<div className="flex items-center space-x-2">
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
										clipRule="evenodd"
									/>
								</svg>
								<span>Last modified: {article.lastModified}</span>
							</div>
							<a
								href={article.url}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline transition-all duration-200 flex items-center space-x-2 px-4 py-2 rounded-full border hover:shadow-lg"
								style={{
									color: theme.colors.primary,
									borderColor: `${theme.colors.primary}30`,
									backgroundColor: `${theme.colors.primary}10`,
								}}
							>
								<span>View on Wikipedia</span>
								<svg
									className="w-4 h-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</header>

			{/* Article Content */}
			<div className="wikipedia-content relative">
				<div
					className="absolute top-0 left-0 w-1 h-full rounded-full opacity-30 hidden md:block"
					style={{ backgroundColor: theme.colors.primary }}
				></div>
				<div className="pl-0 md:pl-8">
					<style>{`
          .wikipedia-content {
            color: ${theme.colors.text};
            font-size: ${fontSettings.size}px;
            line-height: ${fontSettings.lineHeight};
            text-align: justify;
            position: relative;
          }
          .wikipedia-content a {
            color: ${theme.colors.primary};
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: all 0.2s ease;
          }
          .wikipedia-content a:hover {
            color: ${theme.colors.accent};
            border-bottom-color: ${theme.colors.accent};
          }
          .wikipedia-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
            border: 1px solid ${theme.colors.secondary}30;
            border-radius: 0.75rem;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px ${theme.colors.secondary}20;
            background-color: ${theme.colors.surface};
          }
          .wikipedia-content th,
          .wikipedia-content td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid ${theme.colors.secondary}20;
            vertical-align: top;
          }
          .wikipedia-content th {
            background: linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.primary}08 100%);
            font-weight: 600;
            color: ${theme.colors.text};
            border-bottom: 2px solid ${theme.colors.primary}30;
          }
          .wikipedia-content tr:nth-child(even) {
            background-color: ${theme.colors.surface}50;
          }
          .wikipedia-content tr:hover {
            background-color: ${theme.colors.primary}05;
          }
          .wikipedia-content tbody tr:last-child td {
            border-bottom: none;
          }
          .wikipedia-content img {
            display: block !important;
            margin: 2rem auto !important;
            max-width: 100%;
            height: auto;
            border-radius: 1rem;
            box-shadow: none !important;
            transition: transform 0.3s ease;
          }
          .wikipedia-content img:hover {
            transform: scale(1.02);
          }
          .wikipedia-content blockquote {
            border-left: 4px solid ${theme.colors.primary};
            background: linear-gradient(135deg, ${theme.colors.surface}60 0%, ${theme.colors.primary}10 100%);
            padding: 1.5rem;
            margin: 2rem 0;
            border-radius: 0 0.75rem 0.75rem 0;
            position: relative;
            font-style: italic;
          }
          .wikipedia-content blockquote::before {
            content: '"';
            font-size: 4rem;
            color: ${theme.colors.primary}40;
            position: absolute;
            top: -10px;
            left: 10px;
            font-family: serif;
          }
          .wikipedia-content h1,
          .wikipedia-content h2,
          .wikipedia-content h3,
          .wikipedia-content h4,
          .wikipedia-content h5,
          .wikipedia-content h6 {
            color: ${theme.colors.text};
            margin: 2.5rem 0 1.5rem 0;
            font-weight: 700;
            position: relative;
          }
          .wikipedia-content h2 {
            font-size: 1.75em;
            border-bottom: 3px solid ${theme.colors.primary}30;
            padding-bottom: 0.75rem;
            margin-bottom: 2rem;
          }
          .wikipedia-content h2::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 60px;
            height: 3px;
            background: ${theme.colors.primary};
            border-radius: 2px;
          }
          .wikipedia-content h3 {
            font-size: 1.5em;
            color: ${theme.colors.primary};
          }
          .wikipedia-content h4 {
            font-size: 1.25em;
            color: ${theme.colors.accent};
          }
          .wikipedia-content p {
            margin: 1.5rem 0;
            text-align: justify;
            font-weight: 400;
          }
          .wikipedia-content ul,
          .wikipedia-content ol {
            margin: 1.5rem 0;
            padding-left: 2.5rem;
          }
          .wikipedia-content li {
            margin: 0.75rem 0;
            position: relative;
          }
          .wikipedia-content ul li::marker {
            color: ${theme.colors.primary};
          }
          .wikipedia-content ol li::marker {
            color: ${theme.colors.primary};
            font-weight: 600;
          }
          .wikipedia-content .infobox, .wikipedia-content .sidebox, .wikipedia-content .sidebar, .wikipedia-content .sidetable {
            float: right !important;
            margin-left: 3rem !important;
            margin-bottom: 2.5rem !important;
            margin-top: 0.5rem !important;
            padding: 1.5rem 1.25rem !important;
            background: ${theme.colors.surface} !important;
            color: ${theme.colors.text} !important;
            border: 2px solid ${theme.colors.primary}30 !important;
            border-radius: 1.25rem !important;
            box-shadow: 0 4px 24px -4px ${theme.colors.primary}15 !important;
            min-width: 280px !important;
            max-width: 350px !important;
            width: auto !important;
            clear: right !important;
            display: table !important;
          }
          .wikipedia-content .infobox caption, .wikipedia-content .sidebox caption, .wikipedia-content .sidebar caption, .wikipedia-content .sidetable caption {
            color: ${theme.colors.primary} !important;
            font-weight: 700 !important;
            font-size: 1.1em !important;
            padding-bottom: 0.5em !important;
          }
          .wikipedia-content .infobox th, .wikipedia-content .sidebox th, .wikipedia-content .sidebar th, .wikipedia-content .sidetable th {
            background: ${theme.colors.surface} !important;
            color: ${theme.colors.primary} !important;
            font-weight: 700 !important;
            border-bottom: 1.5px solid ${theme.colors.primary}20 !important;
            padding: 0.75em 1em !important;
            text-align: left !important;
          }
          .wikipedia-content .infobox td, .wikipedia-content .sidebox td, .wikipedia-content .sidebar td, .wikipedia-content .sidetable td {
            background: ${theme.colors.surface} !important;
            color: ${theme.colors.text} !important;
            border-bottom: 1px solid ${theme.colors.secondary}20 !important;
            padding: 0.75em 1em !important;
          }
          .wikipedia-content .infobox tr, .wikipedia-content .sidebox tr, .wikipedia-content .sidebar tr, .wikipedia-content .sidetable tr {
            background: ${theme.colors.surface} !important;
          }
          .wikipedia-content .infobox a, .wikipedia-content .sidebox a, .wikipedia-content .sidebar a, .wikipedia-content .sidetable a {
            color: ${theme.colors.primary} !important;
            text-decoration: underline !important;
            font-weight: 500 !important;
          }
          .wikipedia-content .thumbinner {
            background: linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.primary}05 100%);
            border: 1px solid ${theme.colors.secondary}20;
            border-radius: 1rem;
            padding: 1rem;
            margin: 2rem 0;
            box-shadow: 0 4px 12px -2px ${theme.colors.secondary}25;
          }
          .wikipedia-content .thumbcaption {
            font-size: 0.9em;
            color: ${theme.colors.textSecondary};
            margin-top: 0.75rem;
            font-style: italic;
          }
          .wikipedia-content sup {
            color: ${theme.colors.primary};
            font-weight: 600;
          }
          .wikipedia-content code {
            background-color: ${theme.colors.surface};
            color: ${theme.colors.accent};
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 0.875em;
          }
          .wikipedia-content pre {
            background-color: ${theme.colors.surface};
            border: 1px solid ${theme.colors.secondary}20;
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin: 2rem 0;
            overflow-x: auto;
            box-shadow: inset 0 2px 4px ${theme.colors.secondary}20;
          }
          
          /* Mobile responsive styles */
          @media (max-width: 768px) {
            .wikipedia-content .infobox, .wikipedia-content .sidebox, .wikipedia-content .sidebar, .wikipedia-content .sidetable {
              float: none !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
              max-width: 100% !important;
              width: 100% !important;
              display: block !important;
            }
            .wikipedia-content table {
              font-size: 0.875em;
            }
            .wikipedia-content th,
            .wikipedia-content td {
              padding: 0.75rem 0.5rem;
            }
          }
          
          /* Fix for Wikipedia-specific elements */
          .wikipedia-content .navbox,
          .wikipedia-content .vertical-navbox {
            clear: both;
            margin: 2rem 0;
            border: 1px solid ${theme.colors.secondary}20;
            border-radius: 0.5rem;
            overflow: hidden;
          }
          
          .wikipedia-content .mw-parser-output > p:first-child {
            margin-top: 0;
          }
          /* Wikipedia message/notice/ambox improvements */
          .wikipedia-content .ambox, .wikipedia-content .mbox, .wikipedia-content .tmbox, .wikipedia-content .cmbox, .wikipedia-content .fmbox, .wikipedia-content .imbox {
            background: linear-gradient(135deg, ${theme.colors.surface} 80%, ${theme.colors.background} 100%);
            color: ${theme.colors.text};
            border: 1.5px solid ${theme.colors.primary}40;
            border-radius: 1.25rem;
            box-shadow: 0 2px 12px -2px ${theme.colors.primary}10;
            padding: 1.5rem 2rem;
            margin: 2rem 0;
            font-size: 1.1em;
            font-weight: 500;
            opacity: 0.98;
            filter: none;
          }
          .wikipedia-content .ambox a, .wikipedia-content .mbox a, .wikipedia-content .tmbox a, .wikipedia-content .cmbox a, .wikipedia-content .fmbox a, .wikipedia-content .imbox a {
            color: ${theme.colors.primary};
            text-decoration: underline;
            font-weight: 600;
          }
          .wikipedia-content .ambox .ambox-image img {
            margin: 0 1.5rem 0 0;
            max-width: 48px;
            max-height: 48px;
            vertical-align: middle;
          }
          .wikipedia-content .ambox .ambox-text {
            color: ${theme.colors.text};
            font-size: 1em;
            font-weight: 400;
          }
          /* End Wikipedia message/notice/ambox improvements */

          /* Wikipedia navbox, infobox, and metadata table improvements */
          .wikipedia-content .navbox, .wikipedia-content .vertical-navbox, .wikipedia-content .metadata, .wikipedia-content .infobox {
            background: ${theme.colors.surface} !important;
            color: ${theme.colors.text} !important;
            border: 2px solid ${theme.colors.primary}30 !important;
            border-radius: 1.25rem !important;
            box-shadow: 0 2px 12px -2px ${theme.colors.primary}10 !important;
            margin: 2.5rem 0 2.5rem 2.5rem !important;
            font-size: 1em !important;
            overflow: hidden !important;
          }
          .wikipedia-content .navbox th, .wikipedia-content .vertical-navbox th, .wikipedia-content .infobox th {
            background: ${theme.colors.surface} !important;
            color: ${theme.colors.primary} !important;
            font-weight: 700 !important;
            border-bottom: 1.5px solid ${theme.colors.primary}20 !important;
            padding: 0.75em 1em !important;
            text-align: left !important;
          }
          .wikipedia-content .navbox td, .wikipedia-content .vertical-navbox td, .wikipedia-content .infobox td {
            background: ${theme.colors.surface} !important;
            color: ${theme.colors.text} !important;
            border-bottom: 1px solid ${theme.colors.secondary}20 !important;
            padding: 0.75em 1em !important;
          }
          .wikipedia-content .navbox tr, .wikipedia-content .vertical-navbox tr, .wikipedia-content .infobox tr {
            background: ${theme.colors.surface} !important;
          }
          .wikipedia-content .navbox a, .wikipedia-content .vertical-navbox a, .wikipedia-content .infobox a {
            color: ${theme.colors.primary} !important;
            text-decoration: underline !important;
            font-weight: 500 !important;
          }
          .wikipedia-content .navbox .navbox-title, .wikipedia-content .vertical-navbox .navbox-title {
            background: ${theme.colors.primary}15 !important;
            color: ${theme.colors.primary} !important;
            font-size: 1.1em !important;
            font-weight: 700 !important;
            padding: 1em !important;
            border-bottom: 2px solid ${theme.colors.primary}30 !important;
          }
          .wikipedia-content .metadata {
            font-size: 0.95em !important;
            color: ${theme.colors.textSecondary} !important;
            background: ${theme.colors.surface}CC !important;
            border: 1px dashed ${theme.colors.secondary}40 !important;
            border-radius: 0.75rem !important;
            margin: 1.5rem 0 !important;
            padding: 0.75em 1em !important;
          }
          /* Remove Wikipedia's inline background colors for navbox/infobox */
          .wikipedia-content .navbox [style*="background"],
          .wikipedia-content .vertical-navbox [style*="background"],
          .wikipedia-content .infobox [style*="background"] {
            background: unset !important;
            background-color: unset !important;
            color: ${theme.colors.text} !important;
          }
          /* End navbox/infobox table overrides */
        `}</style>

					{article.fullHtmlContent ? (
						<div
							ref={contentRef}
							dangerouslySetInnerHTML={{ __html: article.fullHtmlContent }}
							style={createWikipediaStyles()}
						/>
					) : (
						<div style={createWikipediaStyles()}>
							<p className="mb-6">{article.extract}</p>
						</div>
					)}

					<div
						className="mt-12 pt-8 border-t text-center"
						style={{ borderColor: `${theme.colors.secondary}30` }}
					>
						<p style={{ color: theme.colors.textSecondary }}>
							Content sourced from{" "}
							<a
								href={article.url}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline font-semibold"
								style={{ color: theme.colors.primary }}
							>
								Wikipedia
							</a>
						</p>
					</div>
				</div>
			</div>
		</article>
	);
};
