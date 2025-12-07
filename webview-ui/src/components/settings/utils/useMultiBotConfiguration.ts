import { ApiConfiguration, BotConfiguration, MultiBotConfiguration } from "@shared/api"
import {
	getBotConfigurationById,
	normalizeApiConfigurations,
	removeBotConfiguration,
	upsertBotConfiguration,
} from "@shared/apiConfigurationMigration"
import { useExtensionState } from "@/context/ExtensionStateContext"

/**
 * Hook for managing multi-bot configurations
 * Handles state mutations and GRPC updates for The Council
 */
export const useMultiBotConfiguration = () => {
	const { apiConfiguration, apiConfigurations } = useExtensionState()

	/**
	 * Get the current normalized configuration array
	 * Handles migration from legacy single config if needed
	 */
	const getConfigurations = (): MultiBotConfiguration => {
		return normalizeApiConfigurations(apiConfiguration, apiConfigurations)
	}

	/**
	 * Predefined color palette for auto-assignment to new bots
	 * Cycles through distinct colors to ensure visual differentiation
	 */
	const COLOR_PALETTE = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#33FFF5", "#FFD700", "#FF69B4", "#00CED1"]

	/**
	 * Get the next available color for a new bot
	 * Cycles through the palette based on existing bot count
	 */
	const getNextAvailableColor = (): string => {
		const configs = getConfigurations()
		const colorIndex = configs.length % COLOR_PALETTE.length
		return COLOR_PALETTE[colorIndex]
	}

	/**
	 * Create a new bot configuration with default values
	 */
	const createNewBotConfiguration = (): BotConfiguration => {
		const configs = getConfigurations()
		const botNumber = configs.length + 1
		return {
			id: `bot-${Date.now()}`, // Use timestamp to ensure uniqueness
			name: `Bot ${botNumber}`,
			color: getNextAvailableColor(),
			config: {} as ApiConfiguration,
		}
	}

	/**
	 * Update a specific field in a bot's configuration
	 * Returns the updated configurations array
	 */
	const updateBotField = <K extends keyof ApiConfiguration>(
		botId: string,
		field: K,
		value: ApiConfiguration[K],
	): MultiBotConfiguration => {
		const configs = getConfigurations()
		const bot = getBotConfigurationById(configs, botId)

		if (!bot) {
			console.warn(`Bot with id ${botId} not found`)
			return configs
		}

		const updatedBot: BotConfiguration = {
			...bot,
			config: {
				...bot.config,
				[field]: value,
			},
		}

		return upsertBotConfiguration(configs, updatedBot)
	}

	/**
	 * Update multiple fields in a bot's configuration at once
	 * Returns the updated configurations array
	 */
	const updateBotFields = (botId: string, updates: Partial<ApiConfiguration>): MultiBotConfiguration => {
		const configs = getConfigurations()
		const bot = getBotConfigurationById(configs, botId)

		if (!bot) {
			console.warn(`Bot with id ${botId} not found`)
			return configs
		}

		const updatedBot: BotConfiguration = {
			...bot,
			config: {
				...bot.config,
				...updates,
			},
		}

		return upsertBotConfiguration(configs, updatedBot)
	}

	/**
	 * Update bot metadata (name, color)
	 */
	const updateBotMetadata = (botId: string, metadata: Partial<Omit<BotConfiguration, "config">>): MultiBotConfiguration => {
		const configs = getConfigurations()
		const bot = getBotConfigurationById(configs, botId)

		if (!bot) {
			console.warn(`Bot with id ${botId} not found`)
			return configs
		}

		const updatedBot: BotConfiguration = {
			...bot,
			...metadata,
			config: bot.config, // Preserve config
		}

		return upsertBotConfiguration(configs, updatedBot)
	}

	/**
	 * Remove a bot from the configuration
	 * Prevents removal if it's the last bot
	 * Returns the updated configurations array (or original if removal was prevented)
	 */
	const removeBotConfig = (botId: string): { configs: MultiBotConfiguration; wasRemoved: boolean } => {
		const configs = getConfigurations()

		// Prevent removing the last bot
		if (configs.length <= 1) {
			console.warn("Cannot remove the last bot configuration")
			return { configs, wasRemoved: false }
		}

		const updatedConfigs = removeBotConfiguration(configs, botId)
		return { configs: updatedConfigs, wasRemoved: true }
	}

	/**
	 * Add a new bot with auto-generated color
	 */
	const addNewBot = (): MultiBotConfiguration => {
		const configs = getConfigurations()
		const newBot = createNewBotConfiguration()
		return [...configs, newBot]
	}

	return {
		getConfigurations,
		getNextAvailableColor,
		createNewBotConfiguration,
		updateBotField,
		updateBotFields,
		updateBotMetadata,
		removeBotConfig,
		addNewBot,
		COLOR_PALETTE,
	}
}
