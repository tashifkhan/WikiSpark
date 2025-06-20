import { useState } from "react";
import type { Theme } from "../pages/Index";

interface SearchBarProps {
	onSearch: (query: string) => void;
	isLoading: boolean;
	theme: Theme;
}

export const SearchBar = ({ onSearch, isLoading, theme }: SearchBarProps) => {
	const [query, setQuery] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			onSearch(query.trim());
		}
	};

	return (
		<form onSubmit={handleSubmit} className="relative group">
			<div className="relative">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search Wikipedia articles..."
					disabled={isLoading}
					className="w-full px-6 py-4 pl-14 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 shadow-lg backdrop-blur-sm group-hover:shadow-xl"
					style={{
						background: `linear-gradient(135deg, ${theme.colors.surface}f0 0%, ${theme.colors.background}f0 100%)`,
						borderColor: `${theme.colors.secondary}30`,
						color: theme.colors.text,
					}}
					onFocus={(e) => {
						e.target.style.borderColor = theme.colors.primary;
						e.target.style.boxShadow = `0 0 0 4px ${theme.colors.primary}20, 0 20px 25px -5px ${theme.colors.primary}10`;
						e.target.style.transform = "translateY(-2px)";
					}}
					onBlur={(e) => {
						e.target.style.borderColor = `${theme.colors.secondary}30`;
						e.target.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
						e.target.style.transform = "translateY(0)";
					}}
				/>
				<div className="absolute left-5 top-1/2 transform -translate-y-1/2">
					{isLoading ? (
						<div
							className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent"
							style={{ borderColor: theme.colors.primary }}
						/>
					) : (
						<div
							className="p-1 rounded-lg"
							style={{ backgroundColor: `${theme.colors.primary}20` }}
						>
							<svg
								className="w-4 h-4"
								style={{ color: theme.colors.primary }}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2.5}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
					)}
				</div>
				<button
					type="submit"
					disabled={isLoading || !query.trim()}
					className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
					style={{
						background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
						color: "white",
					}}
				>
					Search
				</button>
			</div>
		</form>
	);
};
