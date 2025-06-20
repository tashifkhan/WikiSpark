import type { Theme, FontSettings } from "../pages/Index";

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
				className="mb-8 pb-8 border-b"
				style={{ borderColor: `${theme.colors.secondary}30` }}
			>
				<div className="flex items-start space-x-6">
					{article.thumbnail && (
						<div className="flex-shrink-0">
							<img
								src={article.thumbnail.source}
								alt={article.title}
								className="rounded-xl shadow-lg w-32 h-32 object-cover"
								style={{ border: `2px solid ${theme.colors.primary}30` }}
							/>
						</div>
					)}
					<div className="flex-1">
						<h1
							className="text-4xl font-bold mb-4 leading-tight"
							style={{ color: theme.colors.text }}
						>
							{article.title}
						</h1>
						{article.description && (
							<p
								className="text-xl mb-4"
								style={{ color: theme.colors.textSecondary }}
							>
								{article.description}
							</p>
						)}
						<div
							className="flex items-center space-x-4 text-sm"
							style={{ color: theme.colors.textSecondary }}
						>
							<span>Last modified: {article.lastModified}</span>
							<a
								href={article.url}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline transition-colors"
								style={{ color: theme.colors.primary }}
							>
								View on Wikipedia →
							</a>
						</div>
					</div>
				</div>
			</header>

			{/* Article Content */}
			<div className="wikipedia-content">
				<style>{`
          .wikipedia-content {
            color: ${theme.colors.text};
            font-size: ${fontSettings.size}px;
            line-height: ${fontSettings.lineHeight};
            text-align: justify;
          }
          .wikipedia-content a {
            color: ${theme.colors.primary};
            text-decoration: none;
          }
          .wikipedia-content a:hover {
            color: ${theme.colors.accent};
            text-decoration: underline;
          }
          .wikipedia-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            border: 1px solid ${theme.colors.secondary}40;
          }
          .wikipedia-content th,
          .wikipedia-content td {
            padding: 0.75rem;
            text-align: left;
            border: 1px solid ${theme.colors.secondary}40;
          }
          .wikipedia-content th {
            background-color: ${theme.colors.surface};
            font-weight: 600;
          }
          .wikipedia-content tr:hover {
            background-color: ${theme.colors.primary}10;
          }
          .wikipedia-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1rem 0;
          }
          .wikipedia-content blockquote {
            border-left: 4px solid ${theme.colors.primary};
            background-color: ${theme.colors.surface}80;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
          }
          .wikipedia-content h1,
          .wikipedia-content h2,
          .wikipedia-content h3,
          .wikipedia-content h4,
          .wikipedia-content h5,
          .wikipedia-content h6 {
            color: ${theme.colors.text};
            margin: 1.5rem 0 1rem 0;
            font-weight: 600;
          }
          .wikipedia-content h2 {
            font-size: 1.5em;
            border-bottom: 2px solid ${theme.colors.secondary}30;
            padding-bottom: 0.5rem;
          }
          .wikipedia-content h3 {
            font-size: 1.25em;
          }
          .wikipedia-content p {
            margin: 1rem 0;
            text-align: justify;
          }
          .wikipedia-content ul,
          .wikipedia-content ol {
            margin: 1rem 0;
            padding-left: 2rem;
          }
          .wikipedia-content li {
            margin: 0.5rem 0;
          }
          .wikipedia-content .infobox {
            float: right;
            margin: 0 0 1rem 1rem;
            width: 300px;
            background-color: ${theme.colors.surface};
            border: 1px solid ${theme.colors.secondary}40;
            border-radius: 0.5rem;
            padding: 1rem;
          }
          .wikipedia-content .thumbinner {
            background-color: ${theme.colors.surface};
            border: 1px solid ${theme.colors.secondary}40;
            border-radius: 0.5rem;
            padding: 0.5rem;
            margin: 1rem 0;
          }
          .wikipedia-content .thumbcaption {
            font-size: 0.875em;
            color: ${theme.colors.textSecondary};
            margin-top: 0.5rem;
          }
          .wikipedia-content sup {
            color: ${theme.colors.primary};
          }
        `}</style>

				{article.fullHtmlContent ? (
					<div
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
		</article>
	);
};
