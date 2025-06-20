import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { WikipediaService } from "../services/wikipediaService";
import { ArticleViewer } from "../components/ArticleViewer";
import { useToast } from "../hooks/use-toast";
import { Sidebar } from "../components/Sidebar";
import type { Theme, FontSettings } from "./Index";

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

const WikipediaPage = () => {
	const { title } = useParams<{ title?: string }>();
	const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
	const [fontSettings, setFontSettings] = useState<FontSettings>({
		family: "serif",
		size: 18,
		lineHeight: 1.7,
		maxWidth: 800,
	});
	const [article, setArticle] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		const fetch = async () => {
			setIsLoading(true);
			try {
				const articleData = await WikipediaService.fetchArticle(
					title || "Wikipedia"
				);
				setArticle(articleData);
				toast({
					title: "Article loaded",
					description: `Successfully loaded \"${articleData.title}\"`,
				});
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to fetch the article. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [title]);

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
					<div className="container mx-auto px-6 py-6">
						<div className="flex items-center justify-between">
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
								<h1 className="text-2xl font-bold">Wikipedia Article</h1>
							</div>
						</div>
					</div>
				</header>
				<main className="container mx-auto px-6 py-8 flex-1">
					<ArticleViewer
						article={article}
						isLoading={isLoading}
						fontSettings={fontSettings}
						theme={currentTheme}
					/>
				</main>
			</div>
			<button
				onClick={() => setSidebarOpen(true)}
				className="fixed bottom-8 right-8 z-30 p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group"
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

export default WikipediaPage;
