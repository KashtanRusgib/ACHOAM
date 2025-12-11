import { isPostHogConfigValid, posthogConfig } from "@/shared/services/config/posthog-config";
import { PostHogErrorProvider } from "./providers/PostHogErrorProvider";
/**
 * Factory class for creating error providers
 * Allows easy switching between different error tracking providers
 */
export class ErrorProviderFactory {
    /**
     * Creates an error provider based on the provided configuration
     * @param config Configuration for the error provider
     * @returns IErrorProvider instance
     */
    static async createProvider(config) {
        switch (config.type) {
            case "posthog": {
                const hasValidPostHogConfig = isPostHogConfigValid(config.config);
                const errorTrackingApiKey = config.config.errorTrackingApiKey;
                return hasValidPostHogConfig && errorTrackingApiKey
                    ? await new PostHogErrorProvider({
                        apiKey: errorTrackingApiKey,
                        errorTrackingApiKey: errorTrackingApiKey,
                        host: config.config.host,
                        uiHost: config.config.uiHost,
                    }).initialize()
                    : new NoOpErrorProvider(); // Fallback to no-op provider
            }
            default:
                return new NoOpErrorProvider();
        }
    }
    /**
     * Gets the default error provider configuration
     * @returns Default configuration using PostHog
     */
    static getDefaultConfig() {
        return {
            type: "posthog",
            config: posthogConfig,
        };
    }
}
/**
 * No-operation error provider for when error logging is disabled
 * or for testing purposes
 */
class NoOpErrorProvider {
    logException(error, _properties) {
        // Use console.error directly to avoid potential infinite recursion through Logger
        console.error("[NoOpErrorProvider]", error.message || String(error));
    }
    logMessage(message, level, properties) {
        console.log("[NoOpErrorProvider]", { message, level, properties });
    }
    isEnabled() {
        return true;
    }
    getSettings() {
        return {
            enabled: true,
            hostEnabled: true,
            level: "all",
        };
    }
    async dispose() {
        console.info("[NoOpErrorProvider] Disposing");
    }
}
//# sourceMappingURL=ErrorProviderFactory.js.map