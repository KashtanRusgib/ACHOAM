import { getValidOpenTelemetryConfig } from "@/shared/services/config/otel-config";
import { isPostHogConfigValid, posthogConfig } from "@/shared/services/config/posthog-config";
import { Logger } from "../logging/Logger";
import { OpenTelemetryClientProvider } from "./providers/opentelemetry/OpenTelemetryClientProvider";
import { OpenTelemetryTelemetryProvider } from "./providers/opentelemetry/OpenTelemetryTelemetryProvider";
import { PostHogClientProvider } from "./providers/posthog/PostHogClientProvider";
import { PostHogTelemetryProvider } from "./providers/posthog/PostHogTelemetryProvider";
/**
 * Factory class for creating telemetry providers
 * Allows easy switching between different analytics providers
 */
export class TelemetryProviderFactory {
    /**
     * Creates multiple telemetry providers based on configuration
     * Supports dual tracking during transition period
     */
    static async createProviders() {
        const configs = TelemetryProviderFactory.getDefaultConfigs();
        const providers = [];
        for (const config of configs) {
            try {
                const provider = await TelemetryProviderFactory.createProvider(config);
                providers.push(provider);
            }
            catch (error) {
                Logger.error(`Failed to create telemetry provider: ${config.type}`, error);
            }
        }
        // Always have at least a no-op provider
        if (providers.length === 0) {
            providers.push(new NoOpTelemetryProvider());
        }
        Logger.info("TelemetryProviderFactory: Created providers - " + providers.map((p) => p.name()).join(", "));
        return providers;
    }
    /**
     * Creates a single telemetry provider based on the provided configuration
     * @param config Configuration for the telemetry provider
     * @returns ITelemetryProvider instance
     */
    static async createProvider(config) {
        switch (config.type) {
            case "posthog": {
                const sharedClient = PostHogClientProvider.getClient();
                if (sharedClient) {
                    return await new PostHogTelemetryProvider(sharedClient).initialize();
                }
                return new NoOpTelemetryProvider();
            }
            case "opentelemetry": {
                const meterProvider = OpenTelemetryClientProvider.getMeterProvider();
                const loggerProvider = OpenTelemetryClientProvider.getLoggerProvider();
                if (meterProvider || loggerProvider) {
                    return await new OpenTelemetryTelemetryProvider().initialize();
                }
                Logger.info("TelemetryProviderFactory: OpenTelemetry providers not available");
                return new NoOpTelemetryProvider();
            }
            case "no-op":
                return new NoOpTelemetryProvider();
            default:
                Logger.error(`Unsupported telemetry provider type: ${config.type ?? "unknown"}`);
                return new NoOpTelemetryProvider();
        }
    }
    /**
     * Gets the default telemetry provider configuration
     * @returns Default configuration using available providers
     */
    static getDefaultConfigs() {
        const configs = [];
        if (isPostHogConfigValid(posthogConfig)) {
            configs.push({ type: "posthog", ...posthogConfig });
        }
        const otelConfig = getValidOpenTelemetryConfig();
        if (otelConfig) {
            configs.push({ type: "opentelemetry", ...otelConfig });
        }
        return configs.length > 0 ? configs : [{ type: "no-op" }];
    }
}
/**
 * No-operation telemetry provider for when telemetry is disabled
 * or for testing purposes
 */
export class NoOpTelemetryProvider {
    name() {
        return "NoOpTelemetryProvider";
    }
    isOptIn = true;
    log(_event, _properties) {
        Logger.log(`[NoOpTelemetryProvider] ${_event}: ${JSON.stringify(_properties)}`);
    }
    logRequired(_event, _properties) {
        Logger.log(`[NoOpTelemetryProvider] REQUIRED ${_event}: ${JSON.stringify(_properties)}`);
    }
    identifyUser(_userInfo, _properties) {
        Logger.info(`[NoOpTelemetryProvider] identifyUser - ${JSON.stringify(_userInfo)} - ${JSON.stringify(_properties)}`);
    }
    setOptIn(_optIn) {
        Logger.info(`[NoOpTelemetryProvider] setOptIn(${_optIn})`);
        this.isOptIn = _optIn;
    }
    isEnabled() {
        return false;
    }
    getSettings() {
        return {
            extensionEnabled: false,
            hostEnabled: false,
            level: "off",
        };
    }
    recordCounter(_name, _value, _attributes, _description, _required = false) {
        // no-op
    }
    recordHistogram(_name, _value, _attributes, _description, _required = false) {
        // no-op
    }
    recordGauge(_name, _value, _attributes, _description, _required = false) {
        // no-op
    }
    async dispose() {
        Logger.info(`[NoOpTelemetryProvider] Disposing (optIn=${this.isOptIn})`);
    }
}
//# sourceMappingURL=TelemetryProviderFactory.js.map