import { PostHog } from "posthog-node";
import * as vscode from "vscode";
import { HostProvider } from "@/hosts/host-provider";
import { getDistinctId, setDistinctId } from "@/services/logging/distinctId";
import { Setting } from "@/shared/proto/index.host";
import { posthogConfig } from "../../../../shared/services/config/posthog-config";
/**
 * PostHog implementation of the telemetry provider interface
 * Handles PostHog-specific analytics tracking
 */
export class PostHogTelemetryProvider {
    client;
    telemetrySettings;
    isSharedClient;
    constructor(sharedClient) {
        this.isSharedClient = !!sharedClient;
        // Use shared PostHog client if provided, otherwise create a new one
        if (sharedClient) {
            this.client = sharedClient;
        }
        else {
            // Only create a new client if we have an API key
            if (!posthogConfig.apiKey) {
                throw new Error("PostHog API key is required to create a new client");
            }
            this.client = new PostHog(posthogConfig.apiKey, {
                host: posthogConfig.host,
            });
        }
        // Initialize telemetry settings
        this.telemetrySettings = {
            extensionEnabled: true,
            hostEnabled: true,
            level: "all",
        };
    }
    async initialize() {
        // Listen for host telemetry changes
        HostProvider.env.subscribeToTelemetrySettings({}, {
            onResponse: (event) => {
                const hostEnabled = event.isEnabled === Setting.ENABLED || event.isEnabled === Setting.UNSUPPORTED;
                this.telemetrySettings.hostEnabled = hostEnabled;
            },
        });
        // Check host-specific telemetry setting (e.g. VS Code setting)
        const hostSettings = await HostProvider.env.getTelemetrySettings({});
        if (hostSettings.isEnabled === Setting.DISABLED) {
            this.telemetrySettings.hostEnabled = false;
        }
        this.telemetrySettings.level = await this.getTelemetryLevel();
        return this;
    }
    name() {
        return "PostHogTelemetryProvider";
    }
    log(event, properties) {
        if (!this.isEnabled() || this.telemetrySettings.level === "off") {
            return;
        }
        // Filter events based on telemetry level
        if (this.telemetrySettings.level === "error") {
            if (!event.includes("error")) {
                return;
            }
        }
        this.client.capture({
            distinctId: getDistinctId(),
            event,
            properties,
        });
    }
    logRequired(event, properties) {
        this.client.capture({
            distinctId: getDistinctId(),
            event,
            properties: {
                ...properties,
                _required: true, // Mark as required event
            },
        });
    }
    identifyUser(userInfo, properties = {}) {
        const distinctId = getDistinctId();
        // Only identify user if telemetry is enabled and user ID is different than the currently set distinct ID
        if (this.isEnabled() && userInfo && userInfo?.id !== distinctId) {
            this.client.identify({
                distinctId: userInfo.id,
                properties: {
                    uuid: userInfo.id,
                    name: userInfo.displayName,
                    ...properties,
                    alias: distinctId,
                },
            });
            // Ensure distinct ID is updated so that we will not identify the user again
            setDistinctId(userInfo.id);
        }
    }
    // Set extension-specific telemetry setting - opt-in/opt-out via UI
    setOptIn(optIn) {
        if (optIn && !this.telemetrySettings.extensionEnabled) {
            this.client.optIn();
        }
        if (!optIn && this.telemetrySettings.extensionEnabled) {
            this.client.optOut();
        }
        this.telemetrySettings.extensionEnabled = optIn;
    }
    isEnabled() {
        return this.telemetrySettings.extensionEnabled && this.telemetrySettings.hostEnabled;
    }
    getSettings() {
        return { ...this.telemetrySettings };
    }
    /**
     * Record a counter metric by converting to equivalent PostHog event
     * This maintains backward compatibility with existing dashboards
     */
    recordCounter(name, value, attributes, _description, required = false) {
        if (!this.isEnabled() && !required)
            return;
        // Convert metric to event format for PostHog
        // Most counters don't need individual events - they're aggregated in OpenTelemetry
        // Only log significant counter events that have dashboard equivalents
        if (name === "cline.tokens.input.total" || name === "cline.tokens.output.total") {
            // These will be batched and emitted as a single "task.tokens" event
            // Implementation will be added when we update captureTokenUsage
        }
    }
    /**
     * Record a histogram metric by converting to equivalent PostHog event
     * Histograms track distributions, but PostHog events capture individual values
     */
    recordHistogram(_name, _value, _attributes, _description, _required = false) {
        // Histograms are for distribution analysis in OpenTelemetry
        // PostHog gets the raw values through existing event capture methods
        // No action needed here - events already capture these values
    }
    /**
     * Record a gauge metric by converting to equivalent PostHog event
     * Gauges track current state, which we can log as state change events
     */
    recordGauge(name, value, attributes, _description, required = false) {
        if ((!this.isEnabled() && !required) || value === null)
            return;
        // Convert gauge updates to state change events
        if (name === "cline.workspace.active_roots") {
            this.log("workspace.roots_changed", {
                count: value,
                ...attributes,
            });
        }
    }
    async dispose() {
        // Only shut down the client if it's not shared (we own it)
        if (!this.isSharedClient) {
            try {
                await this.client.shutdown();
            }
            catch (error) {
                console.error("Error shutting down PostHog client:", error);
            }
        }
    }
    /**
     * Get the current telemetry level from VS Code settings
     */
    async getTelemetryLevel() {
        const hostSettings = await HostProvider.env.getTelemetrySettings({});
        if (hostSettings.isEnabled === Setting.DISABLED) {
            return "off";
        }
        const config = vscode.workspace.getConfiguration("telemetry");
        return config?.get("telemetryLevel") || "all";
    }
}
//# sourceMappingURL=PostHogTelemetryProvider.js.map