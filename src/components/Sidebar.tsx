import type { Theme, FontSettings } from "../pages/Index";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	currentTheme: Theme;
	themes: Theme[];
	onThemeChange: (theme: Theme) => void;
	fontSettings: FontSettings;
	onFontSettingsChange: (settings: FontSettings) => void;
}

export const Sidebar = ({
	isOpen,
	onClose,
	currentTheme,
	themes,
	onThemeChange,
	fontSettings,
	onFontSettingsChange,
}: SidebarProps) => {
	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 backdrop-blur-sm z-40 transition-all duration-300"
					style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed left-0 top-0 h-full w-96 z-50 transform transition-all duration-500 overflow-y-auto shadow-2xl ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
				style={{
					background: `linear-gradient(135deg, ${currentTheme.colors.surface} 0%, ${currentTheme.colors.background} 100%)`,
					borderRight: `1px solid ${currentTheme.colors.secondary}20`,
				}}
			>
				<div className="p-8">
					{/* Header */}
					<div className="flex items-center justify-between mb-10">
						<div className="flex items-center space-x-3">
							<div
								className="w-8 h-8 rounded-lg flex items-center justify-center"
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
							<h2
								className="text-2xl font-bold"
								style={{ color: currentTheme.colors.text }}
							>
								Customize
							</h2>
						</div>
						<button
							onClick={onClose}
							className="p-2 rounded-xl hover:scale-105 transition-all duration-200 group"
							style={{ backgroundColor: `${currentTheme.colors.primary}15` }}
						>
							<svg
								className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Theme Selection */}
					<div className="mb-10">
						<h3
							className="text-xl font-semibold mb-6 flex items-center space-x-2"
							style={{ color: currentTheme.colors.text }}
						>
							<div
								className="w-5 h-5 rounded-full"
								style={{
									background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.accent} 100%)`,
								}}
							/>
							<span>Theme</span>
						</h3>
						<div className="grid grid-cols-2 gap-4">
							{themes.map((theme) => (
								<button
									key={theme.name}
									onClick={() => onThemeChange(theme)}
									className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 group ${
										currentTheme.name === theme.name
											? "ring-2 ring-opacity-60 shadow-lg"
											: "hover:shadow-md"
									}`}
									style={
										{
											background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.background} 100%)`,
											borderColor:
												currentTheme.name === theme.name
													? theme.colors.primary
													: `${theme.colors.secondary}30`,
											"--tw-ring-color": theme.colors.primary,
										} as React.CSSProperties
									}
								>
									<div className="flex items-center space-x-3 mb-2">
										<div
											className="w-5 h-5 rounded-full shadow-sm"
											style={{ backgroundColor: theme.colors.primary }}
										/>
										<span
											className="font-medium"
											style={{ color: theme.colors.text }}
										>
											{theme.name}
										</span>
									</div>
									<div className="flex space-x-1">
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: theme.colors.primary }}
										/>
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: theme.colors.accent }}
										/>
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: theme.colors.surface }}
										/>
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Font Family */}
					<div className="mb-8">
						<h3
							className="text-xl font-semibold mb-6 flex items-center space-x-2"
							style={{ color: currentTheme.colors.text }}
						>
							<svg
								className="w-5 h-5"
								style={{ color: currentTheme.colors.primary }}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 21h10M12 21V3M5 7h14"
								/>
							</svg>
							<span>Font Family</span>
						</h3>
						<div className="space-y-3">
							{[
								{ value: "serif", label: "Serif", example: "Times New Roman" },
								{
									value: "sans-serif",
									label: "Sans Serif",
									example: "Helvetica",
								},
								{ value: "monospace", label: "Monospace", example: "Monaco" },
								{
									value: "open-dyslexic",
									label: "OpenDyslexic",
									example: "Dyslexia-friendly",
								},
								{
									value: "comfortaa",
									label: "Comfortaa",
									example: "Modern rounded",
								},
							].map((font) => (
								<button
									key={font.value}
									onClick={() =>
										onFontSettingsChange({
											...fontSettings,
											family: font.value as any,
										})
									}
									className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
										fontSettings.family === font.value
											? "ring-2 ring-opacity-50 shadow-md"
											: "hover:shadow-sm"
									}`}
									style={
										{
											backgroundColor:
												fontSettings.family === font.value
													? `${currentTheme.colors.primary}20`
													: currentTheme.colors.background,
											borderColor:
												fontSettings.family === font.value
													? currentTheme.colors.primary
													: `${currentTheme.colors.secondary}30`,
											"--tw-ring-color": currentTheme.colors.primary,
										} as React.CSSProperties
									}
								>
									<div style={{ color: currentTheme.colors.text }}>
										<div className="font-semibold text-lg">{font.label}</div>
										<div
											className="text-sm mt-1"
											style={{ color: currentTheme.colors.textSecondary }}
										>
											{font.example}
										</div>
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Font Size */}
					<div className="mb-8">
						<h3
							className="text-lg font-semibold mb-4 flex items-center justify-between"
							style={{ color: currentTheme.colors.text }}
						>
							<span>Font Size</span>
							<span
								className="text-sm px-3 py-1 rounded-lg"
								style={{
									backgroundColor: `${currentTheme.colors.primary}20`,
									color: currentTheme.colors.primary,
								}}
							>
								{fontSettings.size}px
							</span>
						</h3>
						<input
							type="range"
							min="14"
							max="24"
							value={fontSettings.size}
							onChange={(e) =>
								onFontSettingsChange({
									...fontSettings,
									size: parseInt(e.target.value),
								})
							}
							className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
							style={{ accentColor: currentTheme.colors.primary }}
						/>
					</div>

					{/* Line Height */}
					<div className="mb-8">
						<h3
							className="text-lg font-semibold mb-4 flex items-center justify-between"
							style={{ color: currentTheme.colors.text }}
						>
							<span>Line Height</span>
							<span
								className="text-sm px-3 py-1 rounded-lg"
								style={{
									backgroundColor: `${currentTheme.colors.primary}20`,
									color: currentTheme.colors.primary,
								}}
							>
								{fontSettings.lineHeight}
							</span>
						</h3>
						<input
							type="range"
							min="1.2"
							max="2.0"
							step="0.1"
							value={fontSettings.lineHeight}
							onChange={(e) =>
								onFontSettingsChange({
									...fontSettings,
									lineHeight: parseFloat(e.target.value),
								})
							}
							className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
							style={{ accentColor: currentTheme.colors.primary }}
						/>
					</div>

					{/* Reading Width */}
					<div className="mb-8">
						<h3
							className="text-lg font-semibold mb-4 flex items-center justify-between"
							style={{ color: currentTheme.colors.text }}
						>
							<span>Reading Width</span>
							<span
								className="text-sm px-3 py-1 rounded-lg"
								style={{
									backgroundColor: `${currentTheme.colors.primary}20`,
									color: currentTheme.colors.primary,
								}}
							>
								{fontSettings.maxWidth}px
							</span>
						</h3>
						<input
							type="range"
							min="600"
							max="1200"
							step="50"
							value={fontSettings.maxWidth}
							onChange={(e) =>
								onFontSettingsChange({
									...fontSettings,
									maxWidth: parseInt(e.target.value),
								})
							}
							className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
							style={{ accentColor: currentTheme.colors.primary }}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
