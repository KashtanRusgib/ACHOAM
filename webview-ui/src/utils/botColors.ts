/**
 * Official 9-Bot Color Palette for CHOAM Multi-Bot Council
 * Colors are designed to be visually distinct and pleasant in both light and dark themes
 */
export const BOT_COLORS = [
	"#8ABEB7", // 1 – Soft Teal
	"#A2C880", // 2 – Muted Green
	"#C397D8", // 3 – Soft Lavender
	"#FFD780", // 4 – Warm Gold
	"#FFC880", // 5 – Soft Orange
	"#EC8B8B", // 6 – Muted Rose
	"#80A0C8", // 7 – Soft Blue
	"#5E9C91", // 8 – Deep Teal
	"#F8F2A8", // 9 – Pastel Yellow
] as const

// Legacy alias for backward compatibility
export const BOT_COLOR_PALETTE = BOT_COLORS

/**
 * Get a color from the palette by index
 * Automatically cycles through colors if index exceeds palette length
 */
export function getBotColor(index: number): string {
	return BOT_COLORS[index % BOT_COLORS.length]
}

/**
 * Get the next available color for a new bot based on the number of existing bots
 */
export function getNextBotColor(existingBotCount: number): string {
	return getBotColor(existingBotCount)
}
