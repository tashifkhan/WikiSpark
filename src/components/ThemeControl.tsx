import type { Theme, FontSettings } from "../pages/Index";

interface ThemeControlsProps {
	currentTheme: Theme;
	themes: Theme[];
	onThemeChange: (theme: Theme) => void;
	fontSettings: FontSettings;
	onFontSettingsChange: (settings: FontSettings) => void;
}

export const ThemeControls = ({
	currentTheme,
	themes,
	onThemeChange,
	fontSettings,
	onFontSettingsChange,
}: ThemeControlsProps) => {
	return (
		<div
			className="p-6 rounded-2xl border backdrop-blur-sm"
			style={{
				backgroundColor: `${currentTheme.colors.surface}ee`,
				borderColor: `${currentTheme.colors.secondary}30`,
			}}
		>
			<h3
				className="text-lg font-semibold mb-4"
				style={{ color: currentTheme.colors.text }}
			>
				Customize Reading Experience
			</h3>

			{/* Theme Selection */}
			<div className="mb-6">
				<label
					className="block text-sm font-medium mb-2"
					style={{ color: currentTheme.colors.textSecondary }}
				>
					Theme
				</label>
				<div className="flex flex-wrap gap-2">
					{themes.map((theme) => (
						<button
							key={theme.name}
							onClick={() => onThemeChange(theme)}
							className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
								currentTheme.name === theme.name ? "ring-2 ring-opacity-50" : ""
							}`}
							style={
								{
									backgroundColor: theme.colors.surface,
									borderColor:
										currentTheme.name === theme.name
											? theme.colors.primary
											: `${theme.colors.secondary}40`,
									color: theme.colors.text,
									"--tw-ring-color": theme.colors.primary,
								} as React.CSSProperties
							}
						>
							{theme.name}
						</button>
					))}
				</div>
			</div>

			{/* Font Controls */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label
						className="block text-sm font-medium mb-2"
						style={{ color: currentTheme.colors.textSecondary }}
					>
						Font Family
					</label>
					<select
						value={fontSettings.family}
						onChange={(e) =>
							onFontSettingsChange({
								...fontSettings,
								family: e.target.value as any,
							})
						}
						className="w-full p-2 rounded-lg border"
						style={{
							backgroundColor: currentTheme.colors.background,
							borderColor: `${currentTheme.colors.secondary}40`,
							color: currentTheme.colors.text,
						}}
					>
						<option value="serif">Serif</option>
						<option value="sans-serif">Sans Serif</option>
						<option value="monospace">Monospace</option>
						<option value="open-dyslexic">OpenDyslexic</option>
						<option value="comfortaa">Comfortaa</option>
					</select>
				</div>

				<div>
					<label
						className="block text-sm font-medium mb-2"
						style={{ color: currentTheme.colors.textSecondary }}
					>
						Font Size: {fontSettings.size}px
					</label>
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
						className="w-full"
						style={{ accentColor: currentTheme.colors.primary }}
					/>
				</div>
			</div>
		</div>
	);
};
