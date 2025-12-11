/**
 * Utility functions for migrating ApiConfiguration to MultiBotConfiguration (The Council)
 * Ensures backward compatibility when users upgrade from single config to multi-config setup
 */
/**
 * Migrates a legacy single ApiConfiguration to the new MultiBotConfiguration format
 * Used when loading state from old versions that only had one config
 *
 * @param legacyConfig - The old single ApiConfiguration object
 * @returns A MultiBotConfiguration array with a single bot
 */
export function migrateFromLegacyConfig(legacyConfig) {
    const defaultBot = {
        id: "default-head",
        name: "Main Agent",
        color: "#FFFFFF", // White as default
        config: legacyConfig,
    };
    return [defaultBot];
}
/**
 * Ensures that apiConfigurations is always populated
 * If both are undefined, returns empty array
 * If only legacyConfig exists, migrates it
 * If apiConfigurations exists, returns it as-is
 *
 * @param legacyConfig - The old single ApiConfiguration (for backward compat)
 * @param newConfigs - The new MultiBotConfiguration array
 * @returns Guaranteed non-undefined MultiBotConfiguration
 */
export function normalizeApiConfigurations(legacyConfig, newConfigs) {
    // Prefer the new format if it exists
    if (newConfigs && newConfigs.length > 0) {
        return newConfigs;
    }
    // Fall back to migrating the legacy config
    if (legacyConfig) {
        return migrateFromLegacyConfig(legacyConfig);
    }
    // If both are undefined, return empty array
    return [];
}
/**
 * Gets the active/primary bot configuration from the council
 * Returns the first bot by default, or a bot with specific id if found
 *
 * @param configs - The MultiBotConfiguration array
 * @param preferredBotId - Optional preferred bot id to retrieve
 * @returns The selected BotConfiguration, or undefined if array is empty
 */
export function getActiveBotConfiguration(configs, preferredBotId) {
    if (!configs || configs.length === 0) {
        return undefined;
    }
    if (preferredBotId) {
        const preferred = configs.find((bot) => bot.id === preferredBotId);
        if (preferred) {
            return preferred;
        }
    }
    // Default to first bot
    return configs[0];
}
/**
 * Retrieves a specific bot configuration by id
 *
 * @param configs - The MultiBotConfiguration array
 * @param botId - The id of the bot to retrieve
 * @returns The BotConfiguration or undefined if not found
 */
export function getBotConfigurationById(configs, botId) {
    return configs.find((bot) => bot.id === botId);
}
/**
 * Adds or updates a bot configuration in the council
 * If a bot with the same id exists, replaces it; otherwise adds new
 *
 * @param configs - The current MultiBotConfiguration array
 * @param bot - The BotConfiguration to add or update
 * @returns A new MultiBotConfiguration array with the change
 */
export function upsertBotConfiguration(configs, bot) {
    const filtered = configs.filter((b) => b.id !== bot.id);
    return [...filtered, bot];
}
/**
 * Removes a bot configuration from the council by id
 *
 * @param configs - The current MultiBotConfiguration array
 * @param botId - The id of the bot to remove
 * @returns A new MultiBotConfiguration array without the bot
 */
export function removeBotConfiguration(configs, botId) {
    return configs.filter((bot) => bot.id !== botId);
}
/**
 * Converts a MultiBotConfiguration back to a legacy ApiConfiguration
 * Takes the primary bot's config for backward compatibility
 * Useful when interfacing with legacy code
 *
 * @param configs - The MultiBotConfiguration array
 * @returns The config from the first bot, or empty object if array is empty
 */
export function toLegacyApiConfiguration(configs) {
    if (!configs || configs.length === 0) {
        return {};
    }
    return configs[0].config;
}
//# sourceMappingURL=apiConfigurationMigration.js.map