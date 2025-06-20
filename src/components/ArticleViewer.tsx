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
				className="mb-12 pb-10 border-b-2"
				style={{ borderColor: `${theme.colors.secondary}20` }}
			>
				<div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
					{article.thumbnail && (
						<div className="flex-shrink-0 mx-auto lg:mx-0">
							<div className="relative group">
								<img
									src={article.thumbnail.source}
									alt={article.title}
									className="rounded-2xl shadow-2xl w-40 h-40 lg:w-48 lg:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
									style={{ 
										border: `3px solid ${theme.colors.primary}30`,
										boxShadow: `0 20px 40px ${theme.colors.primary}20`
									}}
								/>
								<div 
									className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
									style={{ backgroundColor: theme.colors.primary }}
								></div>
							</div>
						</div>
					)}
					<div className="flex-1 text-center lg:text-left">
						<h1
							className="text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-current to-current bg-clip-text"
							style={{ color: theme.colors.text }}
						>
							{article.title}
						</h1>
						{article.description && (
							<p
								className="text-xl lg:text-2xl mb-6 leading-relaxed font-light"
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
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
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
									backgroundColor: `${theme.colors.primary}10`
								}}
							>
								<span>View on Wikipedia</span>
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</header>

			{/* Article Content */}
			<div className="wikipedia-content relative">
				<div className="absolute top-0 left-0 w-1 h-full rounded-full opacity-30" style={{ backgroundColor: theme.colors.primary }}></div>
				<div className="pl-8">
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
            border: 1px solid ${theme.colors.secondary}20;
            border-radius: 0.75rem;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px ${theme.colors.secondary}20;
          }
          .wikipedia-content th,
          .wikipedia-content td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid ${theme.colors.secondary}20;
          }
          .wikipedia-content th {
            background: linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.primary}10 100%);
            font-weight: 600;
            color: ${theme.colors.text};
          }
          .wikipedia-content tr:hover {
            background-color: ${theme.colors.primary}08;
          }
          .wikipedia-content img {
            max-width: 100%;
            height: auto;
            border-radius: 1rem;
            margin: 2rem 0;
            box-shadow: 0 10px 25px -5px ${theme.colors.secondary}40;
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
          .wikipedia-content .infobox {
            float: right;
            margin: 0 0 2rem 2rem;
            width: 320px;
            background: linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.primary}08 100%);
            border: 1px solid ${theme.colors.secondary}20;
            border-radius: 1rem;
            padding: 1.5rem;
            box-shadow: 0 8px 25px -5px ${theme.colors.secondary}30;
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
			</div>
		</article>
	);
};
