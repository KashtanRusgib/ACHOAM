export var FeatureFlag;
(function (FeatureFlag) {
    FeatureFlag["CUSTOM_INSTRUCTIONS"] = "custom-instructions";
    FeatureFlag["DICTATION"] = "dictation";
    FeatureFlag["FOCUS_CHAIN_CHECKLIST"] = "focus_chain_checklist";
    FeatureFlag["DO_NOTHING"] = "do_nothing";
    FeatureFlag["HOOKS"] = "hooks";
    // Feature flag for showing the new onboarding flow or old welcome view.
    FeatureFlag["ONBOARDING_MODELS"] = "onboarding_models";
})(FeatureFlag || (FeatureFlag = {}));
export const FeatureFlagDefaultValue = {
    [FeatureFlag.DO_NOTHING]: false,
    [FeatureFlag.HOOKS]: false,
    [FeatureFlag.ONBOARDING_MODELS]: process.env.E2E_TEST === "true" ? { models: {} } : undefined,
};
export const FEATURE_FLAGS = Object.values(FeatureFlag);
//# sourceMappingURL=feature-flags.js.map