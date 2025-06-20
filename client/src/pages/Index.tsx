import { useState, useEffect } from "react";
import { WikipediaService } from "..//services/wikipediaService";
import { ArticleViewer } from "../components/ArticleViewer";
import { SearchBar } from "../components/Searchbar";
import { Sidebar } from "../components/Sidebar";
import { useToast } from "../hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";

export interface Theme {
	name: string;
	colors: {
		primary: string;
		secondary: string;
		background: string;
		surface: string;
		text: string;
		textSecondary: string;
		accent: string;
	};
}

export interface FontSettings {
	family: "serif" | "sans-serif" | "monospace" | "open-dyslexic" | "comfortaa";
	size: number;
	lineHeight: number;
	maxWidth: number;
}

interface IndexProps {
	initialArticle?: string;
}

const themes: Theme[] = [
	{
		name: "Classic",
		colors: {
			primary: "#3b82f6",
			secondary: "#64748b",
			background: "#ffffff",
			surface: "#f8fafc",
			text: "#1e293b",
			textSecondary: "#64748b",
			accent: "#3b82f6",
		},
	},
	{
		name: "Dark",
		colors: {
			primary: "#60a5fa",
			secondary: "#94a3b8",
			background: "#0f172a",
			surface: "#1e293b",
			text: "#f1f5f9",
			textSecondary: "#94a3b8",
			accent: "#60a5fa",
		},
	},
	{
		name: "Dark Blue",
		colors: {
			primary: "#3b82f6",
			secondary: "#64748b",
			background: "#0c1426",
			surface: "#1e2a3a",
			text: "#e2e8f0",
			textSecondary: "#94a3b8",
			accent: "#60a5fa",
		},
	},
	{
		name: "Midnight",
		colors: {
			primary: "#a855f7",
			secondary: "#6b7280",
			background: "#111827",
			surface: "#1f2937",
			text: "#f9fafb",
			textSecondary: "#9ca3af",
			accent: "#c084fc",
		},
	},
	{
		name: "Charcoal",
		colors: {
			primary: "#10b981",
			secondary: "#6b7280",
			background: "#1c1c1e",
			surface: "#2c2c2e",
			text: "#ffffff",
			textSecondary: "#8e8e93",
			accent: "#34d399",
		},
	},
	{
		name: "Aqua",
		colors: {
			primary: "#22d3ee",
			secondary: "#06b6d4",
			background: "#0c1821",
			surface: "#164e63",
			text: "#e0f7fa",
			textSecondary: "#67e8f9",
			accent: "#06b6d4",
		},
	},
	{
		name: "Forest",
		colors: {
			primary: "#22c55e",
			secondary: "#84cc16",
			background: "#fafafa",
			surface: "#f0fdf4",
			text: "#14532d",
			textSecondary: "#16a34a",
			accent: "#22c55e",
		},
	},
	{
		name: "Ocean",
		colors: {
			primary: "#06b6d4",
			secondary: "#0891b2",
			background: "#fcfeff",
			surface: "#f0fdff",
			text: "#164e63",
			textSecondary: "#0891b2",
			accent: "#06b6d4",
		},
	},
];

const THEME_KEY = "wikiViewerTheme";
const FONT_SETTINGS_KEY = "wikiViewerFontSettings";

const Index: React.FC<IndexProps> = ({ initialArticle }) => {
	const { title } = useParams();
	const articleToLoad = initialArticle ?? title ?? "Wikipedia";
	const navigate = useNavigate();
	// Load theme from localStorage if available
	const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
		const stored = localStorage.getItem(THEME_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				// Find theme by name to ensure reference equality
				const found = themes.find((t) => t.name === parsed.name);
				return found || themes[0];
			} catch {}
		}
		return themes[0];
	});
	const [fontSettings, setFontSettings] = useState<FontSettings>(() => {
		const stored = localStorage.getItem(FONT_SETTINGS_KEY);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {}
		}
		return {
			family: "serif",
			size: 18,
			lineHeight: 1.7,
			maxWidth: 1000,
		};
	});
	const [article, setArticle] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { toast } = useToast();

	const handleSearch = async (query: string) => {
		if (!query.trim()) return;
		// Only update the URL, let the effect handle fetching
		navigate(`/wiki/${encodeURIComponent(query)}`);
	};

	// Fetch article when articleToLoad changes
	useEffect(() => {
		const fetchArticle = async () => {
			setIsLoading(true);
			try {
				const articleData = await WikipediaService.fetchArticle(articleToLoad);
				if (articleData) {
					setArticle(articleData);
					toast({
						title: "Article loaded",
						description: `Successfully loaded "${articleData.title}"`,
					});
				}
				// If articleData is null, it means we're redirecting to Wikipedia
				// The service will handle the redirect, so we don't need to do anything
			} catch (error) {
				console.error("Error fetching article:", error);
				toast({
					title: "Error",
					description: "Failed to fetch the article. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchArticle();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [articleToLoad]);

	// Persist fontSettings to localStorage on change
	useEffect(() => {
		localStorage.setItem(FONT_SETTINGS_KEY, JSON.stringify(fontSettings));
	}, [fontSettings]);

	// Persist currentTheme to localStorage on change
	useEffect(() => {
		localStorage.setItem(THEME_KEY, JSON.stringify(currentTheme));
	}, [currentTheme]);

	const themeStyles = {
		"--theme-primary": currentTheme.colors.primary,
		"--theme-secondary": currentTheme.colors.secondary,
		"--theme-background": currentTheme.colors.background,
		"--theme-surface": currentTheme.colors.surface,
		"--theme-text": currentTheme.colors.text,
		"--theme-text-secondary": currentTheme.colors.textSecondary,
		"--theme-accent": currentTheme.colors.accent,
	} as React.CSSProperties;

	return (
		<div
			className="min-h-screen transition-all duration-500 relative overflow-hidden"
			style={{
				background: `linear-gradient(135deg, ${currentTheme.colors.background} 0%, ${currentTheme.colors.surface} 100%)`,
				color: currentTheme.colors.text,
				...themeStyles,
			}}
		>
			{/* Background Pattern */}
			<div
				className="absolute inset-0 opacity-[0.02] pointer-events-none"
				style={{
					backgroundImage: `radial-gradient(circle at 2px 2px, ${currentTheme.colors.primary} 1px, transparent 0)`,
					backgroundSize: "32px 32px",
				}}
			/>

			<Sidebar
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				currentTheme={currentTheme}
				themes={themes}
				onThemeChange={setCurrentTheme}
				fontSettings={fontSettings}
				onFontSettingsChange={setFontSettings}
			/>

			<div className="flex flex-col relative z-10">
				<header
					className="sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 shadow-lg"
					style={{
						background: `linear-gradient(135deg, ${currentTheme.colors.surface}f0 0%, ${currentTheme.colors.background}f0 100%)`,
						borderColor: `${currentTheme.colors.secondary}20`,
					}}
				>
					<div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
						{/* Mobile Layout - Stacked */}
						<div className="flex flex-col gap-4 md:hidden">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<button
										onClick={() => setSidebarOpen(true)}
										className="p-3 rounded-xl hover:scale-105 transition-all duration-200 group"
										style={{
											background: `linear-gradient(135deg, ${currentTheme.colors.primary}15 0%, ${currentTheme.colors.accent}15 100%)`,
											border: `1px solid ${currentTheme.colors.primary}30`,
										}}
									>
										<svg
											className="w-6 h-6 transition-transform group-hover:rotate-180 duration-300"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 6h16M4 12h16M4 18h16"
											/>
										</svg>
									</button>
									<div className="flex items-center space-x-2">
										<div
											className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
											style={{
												background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
											}}
										>
											<svg
												className="w-5 h-5 text-white"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
												/>
											</svg>
										</div>
										<h1
											className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
											style={{
												backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
											}}
										>
											Wiki Spark
										</h1>
									</div>
								</div>
							</div>
							<div className="w-full">
								<SearchBar
									onSearch={handleSearch}
									isLoading={isLoading}
									theme={currentTheme}
								/>
							</div>
						</div>

						{/* Desktop Layout - Side by Side */}
						<div className="hidden md:flex items-center justify-between">
							<div className="flex items-center space-x-6">
								<button
									onClick={() => setSidebarOpen(true)}
									className="p-3 rounded-xl hover:scale-105 transition-all duration-200 group"
									style={{
										background: `linear-gradient(135deg, ${currentTheme.colors.primary}15 0%, ${currentTheme.colors.accent}15 100%)`,
										border: `1px solid ${currentTheme.colors.primary}30`,
									}}
								>
									<svg
										className="w-6 h-6 transition-transform group-hover:rotate-180 duration-300"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								</button>
								<div className="flex items-center space-x-3">
									<div
										className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
										style={{
											background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
										}}
									>
										<svg
											className="w-6 h-6 text-white"
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
									<h1
										className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
										style={{
											backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
										}}
									>
										Wiki Spark
									</h1>
								</div>
							</div>
							<div className="flex-1 max-w-2xl ml-12">
								<SearchBar
									onSearch={handleSearch}
									isLoading={isLoading}
									theme={currentTheme}
								/>
							</div>
						</div>
					</div>
				</header>

				<main className="flex-1 container mx-auto px-2 sm:px-6 py-6 sm:py-12">
					<ArticleViewer
						article={article}
						isLoading={isLoading}
						theme={currentTheme}
						fontSettings={fontSettings}
					/>
				</main>
			</div>

			{/* Persistent Theme Button - Always Visible */}
			<button
				onClick={() => setSidebarOpen(true)}
				className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-30 p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group"
				style={{
					background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
					boxShadow: `0 8px 32px ${currentTheme.colors.primary}40`,
				}}
				title="Open Theme Settings"
			>
				<svg
					className="w-6 h-6 text-white transition-transform group-hover:rotate-180 duration-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
					/>
				</svg>
			</button>
		</div>
	);
};

export default Index;
