import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { themes, type Theme } from "./Index";

const THEME_KEY = "wikiViewerTheme";

const About: React.FC = () => {
	const navigate = useNavigate();
	const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
		const stored = localStorage.getItem(THEME_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				const found = themes.find((t) => t.name === parsed.name);
				return found || themes[0];
			} catch {}
		}
		return themes[0];
	});

	const [activeFeature, setActiveFeature] = useState(0);
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/wiki/${encodeURIComponent(searchQuery.trim())}`);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveFeature((prev) => (prev + 1) % 4);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const features = [
		{
			icon: (
				<svg
					className="w-8 h-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			),
			title: "Smart Search",
			description:
				"Lightning-fast Wikipedia search with intelligent suggestions and auto-complete",
			color: currentTheme.colors.primary,
		},
		{
			icon: (
				<svg
					className="w-8 h-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
					/>
				</svg>
			),
			title: "Beautiful Themes",
			description:
				"10+ carefully crafted themes to match your reading preference",
			color: currentTheme.colors.accent,
		},
		{
			icon: (
				<svg
					className="w-8 h-8"
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
			),
			title: "Reading Experience",
			description:
				"Customizable fonts, sizes, and layouts for optimal reading comfort",
			color: currentTheme.colors.secondary,
		},
		{
			icon: (
				<svg
					className="w-8 h-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
			),
			title: "Fast & Responsive",
			description:
				"Built with modern web technologies for speed and accessibility",
			color: currentTheme.colors.primary,
		},
	];

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
			{/* Animated Background Pattern */}
			<div
				className="absolute inset-0 opacity-[0.03] pointer-events-none"
				style={{
					backgroundImage: `radial-gradient(circle at 2px 2px, ${currentTheme.colors.primary} 1px, transparent 0)`,
					backgroundSize: "64px 64px",
					animation: "float 20s ease-in-out infinite",
				}}
			/>

			{/* Floating Orbs */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div
					className="absolute w-96 h-96 rounded-full opacity-10 animate-pulse"
					style={{
						background: `radial-gradient(circle, ${currentTheme.colors.primary} 0%, transparent 70%)`,
						top: "10%",
						left: "10%",
						animation: "float 15s ease-in-out infinite",
					}}
				/>
				<div
					className="absolute w-64 h-64 rounded-full opacity-10 animate-pulse"
					style={{
						background: `radial-gradient(circle, ${currentTheme.colors.accent} 0%, transparent 70%)`,
						top: "60%",
						right: "15%",
						animation: "float 12s ease-in-out infinite reverse",
					}}
				/>
			</div>

			<div className="relative z-10">
				{/* Navigation */}
				<nav className="container mx-auto px-6 py-6">
					<div className="flex items-center justify-between">
						<Link
							to="/"
							className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-300"
						>
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
							<span
								className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
								style={{
									backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
								}}
							>
								Wiki Spark
							</span>
						</Link>
						<div className="flex space-x-4">
							<button
								onClick={() => {
									const nextTheme =
										themes[(themes.indexOf(currentTheme) + 1) % themes.length];
									setCurrentTheme(nextTheme);
									localStorage.setItem(THEME_KEY, JSON.stringify(nextTheme));
								}}
								className="px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
								style={{
									background: `linear-gradient(135deg, ${currentTheme.colors.primary}20 0%, ${currentTheme.colors.accent}20 100%)`,
									border: `1px solid ${currentTheme.colors.primary}30`,
								}}
							>
								<svg
									className="w-5 h-5 inline mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
									/>
								</svg>
								Switch Theme
							</button>
							<Link
								to="/wiki/Open_source"
								className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg text-white"
								style={{
									background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
								}}
							>
								<svg
									className="w-5 h-5 inline mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
								Try Now
							</Link>
						</div>
					</div>
				</nav>

				{/* Hero Section */}
				<section className="container mx-auto px-6 py-16 text-center">
					<div className="max-w-4xl mx-auto">
						<h1
							className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent animate-pulse"
							style={{
								backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
							}}
						>
							Wiki Spark
						</h1>
						<p
							className="text-xl md:text-2xl mb-8 leading-relaxed"
							style={{ color: currentTheme.colors.textSecondary }}
						>
							A beautiful, modern Wikipedia reader that transforms how you
							explore knowledge. Fast, elegant, and designed for the modern web.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Link
								to="/"
								className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-2xl text-white min-w-[200px]"
								style={{
									background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
									boxShadow: `0 10px 40px ${currentTheme.colors.primary}40`,
								}}
							>
								<svg
									className="w-5 h-5 inline mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
								Start Reading
							</Link>
							<a
								href="https://github.com/yourusername/wiki-spark"
								target="_blank"
								rel="noopener noreferrer"
								className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 min-w-[200px]"
								style={{
									background: `linear-gradient(135deg, ${currentTheme.colors.surface} 0%, ${currentTheme.colors.background} 100%)`,
									border: `2px solid ${currentTheme.colors.primary}40`,
									color: currentTheme.colors.text,
								}}
							>
								<svg
									className="w-5 h-5 inline mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
									/>
								</svg>
								View on GitHub
							</a>
						</div>
					</div>
				</section>

				{/* Try It Now Section with Search Bar */}
				<section className="container mx-auto px-6 py-16">
					<div
						className="max-w-4xl mx-auto p-8 rounded-3xl"
						style={{
							background: `linear-gradient(135deg, ${currentTheme.colors.surface} 0%, ${currentTheme.colors.background} 100%)`,
							border: `1px solid ${currentTheme.colors.primary}20`,
						}}
					>
						<h2
							className="text-3xl font-bold text-center mb-6 bg-gradient-to-r bg-clip-text text-transparent"
							style={{
								backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
							}}
						>
							<svg
								className="w-8 h-8 inline mr-3 mb-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							Try It Now - Search Wikipedia
						</h2>
						<p
							className="text-center mb-8 text-lg"
							style={{ color: currentTheme.colors.textSecondary }}
						>
							Start exploring knowledge instantly. Search for any topic and see
							the magic happen!
						</p>

						{/* Search Bar */}
						<form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
							<div className="relative">
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search Wikipedia... (e.g., 'Artificial Intelligence', 'Climate Change', 'History of Japan')"
									className="w-full px-6 py-4 text-lg rounded-2xl transition-all duration-300 focus:outline-none pr-16 search-input"
									style={{
										background: `linear-gradient(135deg, ${currentTheme.colors.background} 0%, ${currentTheme.colors.surface} 100%)`,
										border: `2px solid ${currentTheme.colors.primary}30`,
										color: currentTheme.colors.text,
									}}
								/>
								<button
									type="submit"
									className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-xl transition-all duration-300 hover:scale-110 text-white"
									style={{
										background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
									}}
								>
									<svg
										className="w-6 h-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</button>
							</div>
						</form>

						{/* Extension Downloads */}
						<div className="text-center">
							<h3
								className="text-xl font-semibold mb-4"
								style={{ color: currentTheme.colors.text }}
							>
								Or Install Our Browser Extension
							</h3>
							<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
								<a
									href="/extension/build/wikispark-redirector-chrome.zip"
									download
									className="flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 min-w-[200px]"
									style={{
										background: `linear-gradient(135deg, ${currentTheme.colors.primary}15 0%, ${currentTheme.colors.accent}15 100%)`,
										border: `1px solid ${currentTheme.colors.primary}30`,
										color: currentTheme.colors.text,
									}}
								>
									<svg
										className="w-6 h-6"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M12 2C13.3 2 14.3 2.3 15.3 2.9L20.6 8.2C21.2 9.2 21.5 10.2 21.5 11.5C21.5 12.8 21.2 13.8 20.6 14.8L15.3 20.1C14.3 20.7 13.3 21 12 21C10.7 21 9.7 20.7 8.7 20.1L3.4 14.8C2.8 13.8 2.5 12.8 2.5 11.5C2.5 10.2 2.8 9.2 3.4 8.2L8.7 2.9C9.7 2.3 10.7 2 12 2M12 4C11.2 4 10.5 4.2 9.8 4.6L4.5 9.9C4.1 10.6 3.9 11.1 3.9 11.5C3.9 11.9 4.1 12.4 4.5 13.1L9.8 18.4C10.5 18.8 11.2 19 12 19C12.8 19 13.5 18.8 14.2 18.4L19.5 13.1C19.9 12.4 20.1 11.9 20.1 11.5C20.1 11.1 19.9 10.6 19.5 9.9L14.2 4.6C13.5 4.2 12.8 4 12 4M12 6.5C15.6 6.5 18.5 9.4 18.5 13C18.5 16.6 15.6 19.5 12 19.5C8.4 19.5 5.5 16.6 5.5 13C5.5 9.4 8.4 6.5 12 6.5M12 8.5C9.5 8.5 7.5 10.5 7.5 13C7.5 15.5 9.5 17.5 12 17.5C14.5 17.5 16.5 15.5 16.5 13C16.5 10.5 14.5 8.5 12 8.5Z" />
									</svg>
									<span>Chrome Extension</span>
								</a>
								<a
									href="/extension/build/wikispark-redirector-firefox.zip"
									download
									className="flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 min-w-[200px]"
									style={{
										background: `linear-gradient(135deg, ${currentTheme.colors.primary}15 0%, ${currentTheme.colors.accent}15 100%)`,
										border: `1px solid ${currentTheme.colors.primary}30`,
										color: currentTheme.colors.text,
									}}
								>
									<svg
										className="w-6 h-6"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
									</svg>
									<span>Firefox Extension</span>
								</a>
							</div>
							<p
								className="text-sm mt-4"
								style={{ color: currentTheme.colors.textSecondary }}
							>
								Install our extension to redirect Wikipedia searches directly to
								Wiki Spark for a better reading experience.
							</p>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="container mx-auto px-6 py-16">
					<h2
						className="text-4xl font-bold text-center mb-16 bg-gradient-to-r bg-clip-text text-transparent"
						style={{
							backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
						}}
					>
						<svg
							className="w-10 h-10 inline mr-3 mb-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
							/>
						</svg>
						Features That Spark Joy
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className={`p-8 rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${
									activeFeature === index ? "transform scale-105" : ""
								}`}
								style={{
									background: `linear-gradient(135deg, ${currentTheme.colors.surface} 0%, ${currentTheme.colors.background} 100%)`,
									border: `2px solid ${
										activeFeature === index
											? currentTheme.colors.primary
											: currentTheme.colors.primary + "20"
									}`,
									boxShadow:
										activeFeature === index
											? `0 20px 60px ${currentTheme.colors.primary}30`
											: "none",
								}}
								onMouseEnter={() => setActiveFeature(index)}
							>
								<div
									className="text-4xl mb-4 p-4 rounded-xl inline-flex items-center justify-center"
									style={{
										background: `linear-gradient(135deg, ${feature.color}20 0%, ${currentTheme.colors.accent}20 100%)`,
										color: feature.color,
									}}
								>
									{feature.icon}
								</div>
								<h3
									className="text-xl font-bold mb-4"
									style={{ color: currentTheme.colors.text }}
								>
									{feature.title}
								</h3>
								<p style={{ color: currentTheme.colors.textSecondary }}>
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Tech Stack Section */}
				<section className="container mx-auto px-6 py-16">
					<h2
						className="text-4xl font-bold text-center mb-16 bg-gradient-to-r bg-clip-text text-transparent"
						style={{
							backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
						}}
					>
						<svg
							className="w-10 h-10 inline mr-3 mb-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						Built With Modern Tech
					</h2>
					<div className="flex flex-wrap justify-center gap-6">
						{[
							{
								name: "React",
								icon: (
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.36-.034-.47 0-.92.014-1.36.034.44-.572.895-1.096 1.36-1.564zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.866.728-.064 1.466-.099 2.21-.099zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.36.034.47 0 .92-.014 1.36-.034-.44.572-.895 1.095-1.36 1.56-.465-.467-.92-.992-1.36-1.56z" />
									</svg>
								),
								color: "#61DAFB",
							},
							{
								name: "TypeScript",
								icon: (
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.646 6.646 0 0 1 1.306.34v2.458a3.917 3.917 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
									</svg>
								),
								color: "#3178C6",
							},
							{
								name: "Vite",
								icon: (
									<svg
										className="w-6 h-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								),
								color: "#646CFF",
							},
							{
								name: "Tailwind CSS",
								icon: (
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
									</svg>
								),
								color: "#06B6D4",
							},
							{
								name: "React Router",
								icon: (
									<svg
										className="w-6 h-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
										/>
									</svg>
								),
								color: "#CA4245",
							},
							{
								name: "Tanstack Query",
								icon: (
									<svg
										className="w-6 h-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/>
									</svg>
								),
								color: "#FF4154",
							},
						].map((tech, index) => (
							<div
								key={index}
								className="flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-110"
								style={{
									background: `linear-gradient(135deg, ${currentTheme.colors.surface} 0%, ${currentTheme.colors.background} 100%)`,
									border: `1px solid ${currentTheme.colors.primary}30`,
								}}
							>
								<span className="text-2xl" style={{ color: tech.color }}>
									{tech.icon}
								</span>
								<span
									className="font-medium"
									style={{ color: currentTheme.colors.text }}
								>
									{tech.name}
								</span>
							</div>
						))}
					</div>
				</section>

				{/* Call to Action */}
				<section className="container mx-auto px-6 py-20 text-center">
					<div
						className="max-w-3xl mx-auto p-12 rounded-3xl"
						style={{
							background: `linear-gradient(135deg, ${currentTheme.colors.primary}10 0%, ${currentTheme.colors.accent}10 100%)`,
							border: `1px solid ${currentTheme.colors.primary}20`,
						}}
					>
						<h2
							className="text-4xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent"
							style={{
								backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
							}}
						>
							Ready to Explore?
						</h2>
						<p
							className="text-xl mb-8 leading-relaxed"
							style={{ color: currentTheme.colors.textSecondary }}
						>
							Join thousands of curious minds discovering knowledge in a whole
							new way. Start your journey today!
						</p>
						<Link
							to="/"
							className="inline-block px-10 py-4 rounded-xl font-bold text-xl transition-all duration-300 hover:scale-110 shadow-2xl text-white"
							style={{
								background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
								boxShadow: `0 15px 50px ${currentTheme.colors.primary}50`,
							}}
						>
							<svg
								className="w-6 h-6 inline mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
								/>
							</svg>
							Start Your Journey
						</Link>
					</div>
				</section>
			</div>

			{/* Add CSS animations */}
			<style>
				{`
				@keyframes float {
					0%, 100% { transform: translateY(0px) rotate(0deg); }
					50% { transform: translateY(-20px) rotate(180deg); }
				}
				.search-input:focus {
					box-shadow: 0 0 0 4px ${currentTheme.colors.primary}40;
				}
				`}
			</style>
		</div>
	);
};

export default About;
