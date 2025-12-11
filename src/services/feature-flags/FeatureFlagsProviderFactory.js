import { isPostHogConfigValid, posthogConfig } from "@/shared/services/config/posthog-config";
import { Logger } from "../logging/Logger";
import { PostHogClientProvider } from "../telemetry/providers/posthog/PostHogClientProvider";
import { PostHogFeatureFlagsProvider } from "./providers/PostHogFeatureFlagsProvider";
/**
 * Factory class for creating feature flags providers
 * Allows easy switching between different feature flag providers
 */
export class FeatureFlagsProviderFactory {
    /**
     * Creates a feature flags provider based on the provided configuration
     * @param config Configuration for the feature flags provider
     * @returns IFeatureFlagsProvider instance
     */
    static createProvider(config) {
        switch (config.type) {
            case "posthog": {
                // Get the shared PostHog client from PostHogClientProvider
                const sharedClient = PostHogClientProvider.getClient();
                if (sharedClient) {
                    return new PostHogFeatureFlagsProvider(sharedClient);
                }
                // Fall back to NoOp provider if no client is available
                return new NoOpFeatureFlagsProvider();
            }
            default:
                return new NoOpFeatureFlagsProvider();
        }
    }
    /**
     * Gets the default feature flags provider configuration
     * @returns Default configuration using PostHog
     */
    static getDefaultConfig() {
        const hasValidConfig = isPostHogConfigValid(posthogConfig);
        return {
            type: hasValidConfig ? "posthog" : "no-op",
        };
    }
}
/**
 * No-operation feature flags provider for when feature flags are disabled
 * or for testing purposes
 */
class NoOpFeatureFlagsProvider {
    async getFeatureFlag(flagName) {
        Logger.info(`[NoOpFeatureFlagsProvider] getFeatureFlag called with flagName=${flagName}`);
        return undefined;
    }
    async getFeatureFlagPayload(flagName) {
        Logger.info(`[NoOpFeatureFlagsProvider] getFeatureFlagPayload called with flagName=${flagName}`);
        return null;
    }
    isEnabled() {
        return true;
    }
    getSettings() {
        return {
            enabled: true,
            timeout: 1000,
        };
    }
    async dispose() {
        Logger.info("[NoOpFeatureFlagsProvider] Disposing");
    }
}
//# sourceMappingURL=FeatureFlagsProviderFactory.js.map