/**
 * Pleasant VS Code-friendly color palette for Multi-Bot Council visual identity
 * Colors are designed to be visually distinct and pleasant in both light and dark themes
 */
export const BOT_COLOR_PALETTE = [
	"#58A6FF", // Soft Blue - "Most Pleasant"
	"#3FB950", // Soft Green
	"#D29922", // Soft Orange
	"#A371F7", // Soft Purple
	"#F0883E", // Darker Orange/Red
	"#2EA043", // Forest Green
] as const

/**
 * Get a color from the palette by index
 * Automatically cycles through colors if index exceeds palette length
 */
export function getBotColor(index: number): string {
	return BOT_COLOR_PALETTE[index % BOT_COLOR_PALETTE.length]
}

/**
 * Get the next available color for a new bot based on the number of existing bots
 */
export function getNextBotColor(existingBotCount: number): string {
	return getBotColor(existingBotCount)
}
