export { PostHogTelemetryProvider } from "./providers/posthog/PostHogTelemetryProvider";
export { TelemetryProviderFactory, } from "./TelemetryProviderFactory";
// Export the enums for terminal telemetry
export { TerminalHangStage, TerminalOutputFailureReason, TerminalUserInterventionAction, } from "./TelemetryService";
// Create a singleton instance for easy access throughout the application
import { TelemetryService } from "./TelemetryService";
let _telemetryServiceInstance = null;
/**
 * Get the singleton telemetry service instance
 * @param distinctId Optional distinct ID for the telemetry provider
 * @returns TelemetryService instance
 */
export async function getTelemetryService() {
    if (!_telemetryServiceInstance) {
        _telemetryServiceInstance = await TelemetryService.create();
    }
    return _telemetryServiceInstance;
}
/**
 * Reset the telemetry service instance (useful for testing)
 */
export function resetTelemetryService() {
    _telemetryServiceInstance = null;
}
export const telemetryService = new Proxy({}, {
    get(_target, prop, _receiver) {
        // Return a function that will call the method on the actual service
        return async (...args) => {
            const service = await getTelemetryService();
            const method = Reflect.get(service, prop, service);
            if (typeof method === "function") {
                return method.apply(service, args);
            }
            return method;
        };
    },
});
//# sourceMappingURL=index.js.map