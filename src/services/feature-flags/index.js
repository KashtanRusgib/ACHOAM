export { FeatureFlagsProviderFactory, } from "./FeatureFlagsProviderFactory";
export { FeatureFlagsService } from "./FeatureFlagsService";
export { PostHogFeatureFlagsProvider } from "./providers/PostHogFeatureFlagsProvider";
import { FeatureFlagsProviderFactory } from "./FeatureFlagsProviderFactory";
import { FeatureFlagsService } from "./FeatureFlagsService";
let _featureFlagsServiceInstance = null;
/**
 * Get the singleton feature flags service instance
 * @param distinctId Optional distinct ID for the feature flags provider
 * @returns FeatureFlagsService instance
 */
export function getFeatureFlagsService() {
    if (!_featureFlagsServiceInstance) {
        const provider = FeatureFlagsProviderFactory.createProvider({
            type: "posthog",
        });
        _featureFlagsServiceInstance = new FeatureFlagsService(provider);
    }
    return _featureFlagsServiceInstance;
}
/**
 * Reset the feature flags service instance (useful for testing)
 */
export function resetFeatureFlagsService() {
    _featureFlagsServiceInstance = null;
}
export const featureFlagsService = new Proxy({}, {
    get(_target, prop, _receiver) {
        const service = getFeatureFlagsService();
        return Reflect.get(service, prop, service);
    },
});
//# sourceMappingURL=index.js.map