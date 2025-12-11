import { ANTHROPIC_MIN_THINKING_BUDGET, fireworksDefaultModelId } from "@shared/api";
import { getHooksEnabledSafe } from "@/core/hooks/hooks-utils";
import { DEFAULT_AUTO_APPROVAL_SETTINGS } from "@/shared/AutoApprovalSettings";
import { DEFAULT_BROWSER_SETTINGS } from "@/shared/BrowserSettings";
import { DEFAULT_DICTATION_SETTINGS } from "@/shared/DictationSettings";
import { DEFAULT_FOCUS_CHAIN_SETTINGS } from "@/shared/FocusChainSettings";
import { DEFAULT_MCP_DISPLAY_MODE } from "@/shared/McpDisplayMode";
import { readTaskHistoryFromState } from "../disk";
export async function readSecretsFromDisk(context) {
    const [apiKey, openRouterApiKey, firebaseClineAccountId, clineAccountId, awsAccessKey, awsSecretKey, awsSessionToken, awsBedrockApiKey, openAiApiKey, geminiApiKey, openAiNativeApiKey, deepSeekApiKey, requestyApiKey, togetherApiKey, qwenApiKey, doubaoApiKey, mistralApiKey, fireworksApiKey, liteLlmApiKey, asksageApiKey, xaiApiKey, sambanovaApiKey, cerebrasApiKey, groqApiKey, moonshotApiKey, nebiusApiKey, huggingFaceApiKey, sapAiCoreClientId, sapAiCoreClientSecret, huaweiCloudMaasApiKey, basetenApiKey, zaiApiKey, ollamaApiKey, vercelAiGatewayApiKey, difyApiKey, authNonce, ocaApiKey, ocaRefreshToken, minimaxApiKey, hicapApiKey, aihubmixApiKey, mcpOAuthSecrets, nousResearchApiKey,] = await Promise.all([
        context.secrets.get("apiKey"),
        context.secrets.get("openRouterApiKey"),
        context.secrets.get("clineAccountId"),
        context.secrets.get("cline:clineAccountId"),
        context.secrets.get("awsAccessKey"),
        context.secrets.get("awsSecretKey"),
        context.secrets.get("awsSessionToken"),
        context.secrets.get("awsBedrockApiKey"),
        context.secrets.get("openAiApiKey"),
        context.secrets.get("geminiApiKey"),
        context.secrets.get("openAiNativeApiKey"),
        context.secrets.get("deepSeekApiKey"),
        context.secrets.get("requestyApiKey"),
        context.secrets.get("togetherApiKey"),
        context.secrets.get("qwenApiKey"),
        context.secrets.get("doubaoApiKey"),
        context.secrets.get("mistralApiKey"),
        context.secrets.get("fireworksApiKey"),
        context.secrets.get("liteLlmApiKey"),
        context.secrets.get("asksageApiKey"),
        context.secrets.get("xaiApiKey"),
        context.secrets.get("sambanovaApiKey"),
        context.secrets.get("cerebrasApiKey"),
        context.secrets.get("groqApiKey"),
        context.secrets.get("moonshotApiKey"),
        context.secrets.get("nebiusApiKey"),
        context.secrets.get("huggingFaceApiKey"),
        context.secrets.get("sapAiCoreClientId"),
        context.secrets.get("sapAiCoreClientSecret"),
        context.secrets.get("huaweiCloudMaasApiKey"),
        context.secrets.get("basetenApiKey"),
        context.secrets.get("zaiApiKey"),
        context.secrets.get("ollamaApiKey"),
        context.secrets.get("vercelAiGatewayApiKey"),
        context.secrets.get("difyApiKey"),
        context.secrets.get("authNonce"),
        context.secrets.get("ocaApiKey"),
        context.secrets.get("ocaRefreshToken"),
        context.secrets.get("minimaxApiKey"),
        context.secrets.get("hicapApiKey"),
        context.secrets.get("aihubmixApiKey"),
        context.secrets.get("mcpOAuthSecrets"),
        context.secrets.get("nousResearchApiKey"),
    ]);
    return {
        authNonce,
        apiKey,
        openRouterApiKey,
        clineAccountId: firebaseClineAccountId,
        "cline:clineAccountId": clineAccountId,
        huggingFaceApiKey,
        huaweiCloudMaasApiKey,
        basetenApiKey,
        zaiApiKey,
        ollamaApiKey,
        vercelAiGatewayApiKey,
        difyApiKey,
        sapAiCoreClientId,
        sapAiCoreClientSecret,
        xaiApiKey,
        sambanovaApiKey,
        cerebrasApiKey,
        groqApiKey,
        moonshotApiKey,
        nebiusApiKey,
        asksageApiKey,
        fireworksApiKey,
        liteLlmApiKey,
        doubaoApiKey,
        mistralApiKey,
        openAiNativeApiKey,
        deepSeekApiKey,
        requestyApiKey,
        togetherApiKey,
        qwenApiKey,
        geminiApiKey,
        openAiApiKey,
        awsBedrockApiKey,
        awsAccessKey,
        awsSecretKey,
        awsSessionToken,
        ocaApiKey,
        ocaRefreshToken,
        minimaxApiKey,
        hicapApiKey,
        aihubmixApiKey,
        mcpOAuthSecrets,
        nousResearchApiKey,
    };
}
export async function readWorkspaceStateFromDisk(context) {
    const localClineRulesToggles = context.workspaceState.get("localClineRulesToggles");
    const localWindsurfRulesToggles = context.workspaceState.get("localWindsurfRulesToggles");
    const localCursorRulesToggles = context.workspaceState.get("localCursorRulesToggles");
    const localAgentsRulesToggles = context.workspaceState.get("localAgentsRulesToggles");
    const localWorkflowToggles = context.workspaceState.get("workflowToggles");
    return {
        localClineRulesToggles: localClineRulesToggles || {},
        localWindsurfRulesToggles: localWindsurfRulesToggles || {},
        localCursorRulesToggles: localCursorRulesToggles || {},
        localAgentsRulesToggles: localAgentsRulesToggles || {},
        workflowToggles: localWorkflowToggles || {},
    };
}
export async function readGlobalStateFromDisk(context) {
    try {
        // Get all global state values
        const strictPlanModeEnabled = context.globalState.get("strictPlanModeEnabled");
        const yoloModeToggled = context.globalState.get("yoloModeToggled");
        const useAutoCondense = context.globalState.get("useAutoCondense");
        const clineWebToolsEnabled = context.globalState.get("clineWebToolsEnabled");
        const isNewUser = context.globalState.get("isNewUser");
        const welcomeViewCompleted = context.globalState.get("welcomeViewCompleted");
        const awsRegion = context.globalState.get("awsRegion");
        const awsUseCrossRegionInference = context.globalState.get("awsUseCrossRegionInference");
        const awsUseGlobalInference = context.globalState.get("awsUseGlobalInference");
        const awsBedrockUsePromptCache = context.globalState.get("awsBedrockUsePromptCache");
        const awsBedrockEndpoint = context.globalState.get("awsBedrockEndpoint");
        const awsProfile = context.globalState.get("awsProfile");
        const awsUseProfile = context.globalState.get("awsUseProfile");
        const awsAuthentication = context.globalState.get("awsAuthentication");
        const vertexProjectId = context.globalState.get("vertexProjectId");
        const vertexRegion = context.globalState.get("vertexRegion");
        const openAiBaseUrl = context.globalState.get("openAiBaseUrl");
        const requestyBaseUrl = context.globalState.get("requestyBaseUrl");
        const openAiHeaders = context.globalState.get("openAiHeaders");
        const ollamaBaseUrl = context.globalState.get("ollamaBaseUrl");
        const ollamaApiOptionsCtxNum = context.globalState.get("ollamaApiOptionsCtxNum");
        const lmStudioBaseUrl = context.globalState.get("lmStudioBaseUrl");
        const lmStudioMaxTokens = context.globalState.get("lmStudioMaxTokens");
        const anthropicBaseUrl = context.globalState.get("anthropicBaseUrl");
        const geminiBaseUrl = context.globalState.get("geminiBaseUrl");
        const azureApiVersion = context.globalState.get("azureApiVersion");
        const openRouterProviderSorting = context.globalState.get("openRouterProviderSorting");
        const lastShownAnnouncementId = context.globalState.get("lastShownAnnouncementId");
        const autoApprovalSettings = context.globalState.get("autoApprovalSettings");
        const browserSettings = context.globalState.get("browserSettings");
        const liteLlmBaseUrl = context.globalState.get("liteLlmBaseUrl");
        const liteLlmUsePromptCache = context.globalState.get("liteLlmUsePromptCache");
        const fireworksModelMaxCompletionTokens = context.globalState.get("fireworksModelMaxCompletionTokens");
        const fireworksModelMaxTokens = context.globalState.get("fireworksModelMaxTokens");
        const userInfo = context.globalState.get("userInfo");
        const qwenApiLine = context.globalState.get("qwenApiLine");
        const moonshotApiLine = context.globalState.get("moonshotApiLine");
        const zaiApiLine = context.globalState.get("zaiApiLine");
        const minimaxApiLine = context.globalState.get("minimaxApiLine");
        const telemetrySetting = context.globalState.get("telemetrySetting");
        const asksageApiUrl = context.globalState.get("asksageApiUrl");
        const planActSeparateModelsSettingRaw = context.globalState.get("planActSeparateModelsSetting");
        const favoritedModelIds = context.globalState.get("favoritedModelIds");
        const globalClineRulesToggles = context.globalState.get("globalClineRulesToggles");
        const requestTimeoutMs = context.globalState.get("requestTimeoutMs");
        const shellIntegrationTimeout = context.globalState.get("shellIntegrationTimeout");
        const enableCheckpointsSettingRaw = context.globalState.get("enableCheckpointsSetting");
        const mcpMarketplaceEnabledRaw = context.globalState.get("mcpMarketplaceEnabled");
        const mcpDisplayMode = context.globalState.get("mcpDisplayMode");
        const mcpResponsesCollapsedRaw = context.globalState.get("mcpResponsesCollapsed");
        const globalWorkflowToggles = context.globalState.get("globalWorkflowToggles");
        const terminalReuseEnabled = context.globalState.get("terminalReuseEnabled");
        const vscodeTerminalExecutionMode = context.globalState.get("vscodeTerminalExecutionMode");
        const terminalOutputLineLimit = context.globalState.get("terminalOutputLineLimit");
        const maxConsecutiveMistakes = context.globalState.get("maxConsecutiveMistakes");
        const subagentTerminalOutputLineLimit = context.globalState.get("subagentTerminalOutputLineLimit");
        const defaultTerminalProfile = context.globalState.get("defaultTerminalProfile");
        const sapAiCoreBaseUrl = context.globalState.get("sapAiCoreBaseUrl");
        const sapAiCoreTokenUrl = context.globalState.get("sapAiCoreTokenUrl");
        const sapAiResourceGroup = context.globalState.get("sapAiResourceGroup");
        const claudeCodePath = context.globalState.get("claudeCodePath");
        const difyBaseUrl = context.globalState.get("difyBaseUrl");
        const ocaBaseUrl = context.globalState.get("ocaBaseUrl");
        const ocaMode = context.globalState.get("ocaMode");
        const openaiReasoningEffort = context.globalState.get("openaiReasoningEffort");
        const preferredLanguage = context.globalState.get("preferredLanguage");
        const focusChainSettings = context.globalState.get("focusChainSettings");
        const dictationSettings = context.globalState.get("dictationSettings");
        const lastDismissedInfoBannerVersion = context.globalState.get("lastDismissedInfoBannerVersion");
        const lastDismissedModelBannerVersion = context.globalState.get("lastDismissedModelBannerVersion");
        const lastDismissedCliBannerVersion = context.globalState.get("lastDismissedCliBannerVersion");
        const dismissedBanners = context.globalState.get("dismissedBanners");
        const qwenCodeOauthPath = context.globalState.get("qwenCodeOauthPath");
        const customPrompt = context.globalState.get("customPrompt");
        const autoCondenseThreshold = context.globalState.get("autoCondenseThreshold"); // number from 0 to 1
        const hooksEnabled = context.globalState.get("hooksEnabled");
        const hicapModelId = context.globalState.get("hicapModelId");
        const aihubmixBaseUrl = context.globalState.get("aihubmixBaseUrl");
        const aihubmixAppCode = context.globalState.get("aihubmixAppCode");
        // OpenTelemetry configuration
        const openTelemetryEnabled = context.globalState.get("openTelemetryEnabled");
        const openTelemetryMetricsExporter = context.globalState.get("openTelemetryMetricsExporter");
        const openTelemetryLogsExporter = context.globalState.get("openTelemetryLogsExporter");
        const openTelemetryOtlpProtocol = context.globalState.get("openTelemetryOtlpProtocol");
        const openTelemetryOtlpEndpoint = context.globalState.get("openTelemetryOtlpEndpoint");
        const openTelemetryOtlpMetricsProtocol = context.globalState.get("openTelemetryOtlpMetricsProtocol");
        const openTelemetryOtlpMetricsEndpoint = context.globalState.get("openTelemetryOtlpMetricsEndpoint");
        const openTelemetryOtlpLogsProtocol = context.globalState.get("openTelemetryOtlpLogsProtocol");
        const openTelemetryOtlpLogsEndpoint = context.globalState.get("openTelemetryOtlpLogsEndpoint");
        const openTelemetryMetricExportInterval = context.globalState.get("openTelemetryMetricExportInterval");
        const openTelemetryOtlpInsecure = context.globalState.get("openTelemetryOtlpInsecure");
        const openTelemetryLogBatchSize = context.globalState.get("openTelemetryLogBatchSize");
        const openTelemetryLogBatchTimeout = context.globalState.get("openTelemetryLogBatchTimeout");
        const openTelemetryLogMaxQueueSize = context.globalState.get("openTelemetryLogMaxQueueSize");
        const subagentsEnabled = context.globalState.get("subagentsEnabled");
        // Get mode-related configurations
        const mode = context.globalState.get("mode");
        // Plan mode configurations
        const planModeApiProvider = context.globalState.get("planModeApiProvider");
        const planModeApiModelId = context.globalState.get("planModeApiModelId");
        const planModeThinkingBudgetTokens = context.globalState.get("planModeThinkingBudgetTokens");
        const geminiPlanModeThinkingLevel = context.globalState.get("geminiPlanModeThinkingLevel");
        const planModeReasoningEffort = context.globalState.get("planModeReasoningEffort");
        const planModeVsCodeLmModelSelector = context.globalState.get("planModeVsCodeLmModelSelector");
        const planModeAwsBedrockCustomSelected = context.globalState.get("planModeAwsBedrockCustomSelected");
        const planModeAwsBedrockCustomModelBaseId = context.globalState.get("planModeAwsBedrockCustomModelBaseId");
        const planModeOpenRouterModelId = context.globalState.get("planModeOpenRouterModelId");
        const planModeOpenRouterModelInfo = context.globalState.get("planModeOpenRouterModelInfo");
        const planModeOpenAiModelId = context.globalState.get("planModeOpenAiModelId");
        const planModeOpenAiModelInfo = context.globalState.get("planModeOpenAiModelInfo");
        const planModeOllamaModelId = context.globalState.get("planModeOllamaModelId");
        const planModeLmStudioModelId = context.globalState.get("planModeLmStudioModelId");
        const planModeLiteLlmModelId = context.globalState.get("planModeLiteLlmModelId");
        const planModeLiteLlmModelInfo = context.globalState.get("planModeLiteLlmModelInfo");
        const planModeRequestyModelId = context.globalState.get("planModeRequestyModelId");
        const planModeRequestyModelInfo = context.globalState.get("planModeRequestyModelInfo");
        const planModeTogetherModelId = context.globalState.get("planModeTogetherModelId");
        const planModeFireworksModelId = context.globalState.get("planModeFireworksModelId");
        const planModeSapAiCoreModelId = context.globalState.get("planModeSapAiCoreModelId");
        const planModeSapAiCoreDeploymentId = context.globalState.get("planModeSapAiCoreDeploymentId");
        const planModeGroqModelId = context.globalState.get("planModeGroqModelId");
        const planModeGroqModelInfo = context.globalState.get("planModeGroqModelInfo");
        const planModeHuggingFaceModelId = context.globalState.get("planModeHuggingFaceModelId");
        const planModeHuggingFaceModelInfo = context.globalState.get("planModeHuggingFaceModelInfo");
        const planModeHuaweiCloudMaasModelId = context.globalState.get("planModeHuaweiCloudMaasModelId");
        const planModeHuaweiCloudMaasModelInfo = context.globalState.get("planModeHuaweiCloudMaasModelInfo");
        const planModeBasetenModelId = context.globalState.get("planModeBasetenModelId");
        const planModeBasetenModelInfo = context.globalState.get("planModeBasetenModelInfo");
        const planModeOcaModelId = context.globalState.get("planModeOcaModelId");
        const planModeOcaModelInfo = context.globalState.get("planModeOcaModelInfo");
        const planModeHicapModelId = context.globalState.get("planModeHicapModelId");
        const planModeHicapModelInfo = context.globalState.get("planModeHicapModelInfo");
        const planModeAihubmixModelId = context.globalState.get("planModeAihubmixModelId");
        const planModeAihubmixModelInfo = context.globalState.get("planModeAihubmixModelInfo");
        const planModeNousResearchModelId = context.globalState.get("planModeNousResearchModelId");
        // Act mode configurations
        const actModeApiProvider = context.globalState.get("actModeApiProvider");
        const actModeApiModelId = context.globalState.get("actModeApiModelId");
        const actModeThinkingBudgetTokens = context.globalState.get("actModeThinkingBudgetTokens");
        const geminiActModeThinkingLevel = context.globalState.get("geminiActModeThinkingLevel");
        const actModeReasoningEffort = context.globalState.get("actModeReasoningEffort");
        const actModeVsCodeLmModelSelector = context.globalState.get("actModeVsCodeLmModelSelector");
        const actModeAwsBedrockCustomSelected = context.globalState.get("actModeAwsBedrockCustomSelected");
        const actModeAwsBedrockCustomModelBaseId = context.globalState.get("actModeAwsBedrockCustomModelBaseId");
        const actModeOpenRouterModelId = context.globalState.get("actModeOpenRouterModelId");
        const actModeOpenRouterModelInfo = context.globalState.get("actModeOpenRouterModelInfo");
        const actModeOpenAiModelId = context.globalState.get("actModeOpenAiModelId");
        const actModeOpenAiModelInfo = context.globalState.get("actModeOpenAiModelInfo");
        const actModeOllamaModelId = context.globalState.get("actModeOllamaModelId");
        const actModeLmStudioModelId = context.globalState.get("actModeLmStudioModelId");
        const actModeLiteLlmModelId = context.globalState.get("actModeLiteLlmModelId");
        const actModeLiteLlmModelInfo = context.globalState.get("actModeLiteLlmModelInfo");
        const actModeRequestyModelId = context.globalState.get("actModeRequestyModelId");
        const actModeRequestyModelInfo = context.globalState.get("actModeRequestyModelInfo");
        const actModeTogetherModelId = context.globalState.get("actModeTogetherModelId");
        const actModeFireworksModelId = context.globalState.get("actModeFireworksModelId");
        const actModeSapAiCoreModelId = context.globalState.get("actModeSapAiCoreModelId");
        const actModeSapAiCoreDeploymentId = context.globalState.get("actModeSapAiCoreDeploymentId");
        const actModeGroqModelId = context.globalState.get("actModeGroqModelId");
        const actModeGroqModelInfo = context.globalState.get("actModeGroqModelInfo");
        const actModeHuggingFaceModelId = context.globalState.get("actModeHuggingFaceModelId");
        const actModeHuggingFaceModelInfo = context.globalState.get("actModeHuggingFaceModelInfo");
        const actModeHuaweiCloudMaasModelId = context.globalState.get("actModeHuaweiCloudMaasModelId");
        const actModeHuaweiCloudMaasModelInfo = context.globalState.get("actModeHuaweiCloudMaasModelInfo");
        const actModeBasetenModelId = context.globalState.get("actModeBasetenModelId");
        const actModeBasetenModelInfo = context.globalState.get("actModeBasetenModelInfo");
        const actModeOcaModelId = context.globalState.get("actModeOcaModelId");
        const actModeOcaModelInfo = context.globalState.get("actModeOcaModelInfo");
        const actModeNousResearchModelId = context.globalState.get("actModeNousResearchModelId");
        const sapAiCoreUseOrchestrationMode = context.globalState.get("sapAiCoreUseOrchestrationMode");
        const actModeHicapModelId = context.globalState.get("actModeHicapModelId");
        const actModeHicapModelInfo = context.globalState.get("actModeHicapModelInfo");
        const actModeAihubmixModelId = context.globalState.get("actModeAihubmixModelId");
        const actModeAihubmixModelInfo = context.globalState.get("actModeAihubmixModelInfo");
        let apiProvider;
        if (planModeApiProvider) {
            apiProvider = planModeApiProvider;
        }
        else {
            // New users should default to openrouter, since they've opted to use an API key instead of signing in
            apiProvider = "openrouter";
        }
        const mcpResponsesCollapsed = mcpResponsesCollapsedRaw ?? false;
        // Plan/Act separate models setting is a boolean indicating whether the user wants to use different models for plan and act.
        // Default to true so Plan and Act modes are independent by default (no "one bot controls all" behavior).
        // On win11 state sometimes initializes as empty string instead of undefined
        let planActSeparateModelsSetting;
        if (planActSeparateModelsSettingRaw === true || planActSeparateModelsSettingRaw === false) {
            planActSeparateModelsSetting = planActSeparateModelsSettingRaw;
        }
        else {
            // default to true - each mode gets independent provider/model selection
            planActSeparateModelsSetting = true;
        }
        // Read task history from disk
        // Note: If this throws (e.g., filesystem I/O error), StateManager initialization will fail
        // and the extension will not start. This is intentional to prevent data loss - better to
        // fail visibly than silently wipe history. The readTaskHistoryFromState function handles:
        // - File doesn't exist → returns []
        // - Parse errors → attempts reconstruction, returns [] only if reconstruction fails
        // - I/O errors → throws (caught here, causing initialization to fail)
        // So, any errors thrown here are true IO errors, which should be exceptionally rare.
        // The state manager tries once more to start on any failure. So if there is truly an I/O error happening twice that is not due to the file not existing or being corrupted, then something is truly wrong and it is correct to not start the application.
        const taskHistory = await readTaskHistoryFromState();
        // Multi-root workspace support
        const workspaceRoots = context.globalState.get("workspaceRoots");
        /**
         * Get primary root index from global state.
         * The primary root is the main workspace folder that Cline focuses on when dealing with
         * multi-root workspaces. In VS Code, you can have multiple folders open in one workspace,
         * and the primary root index indicates which folder (by its position in the array, 0-based)
         * should be treated as the main/default working directory for operations.
         */
        const primaryRootIndex = context.globalState.get("primaryRootIndex");
        const multiRootEnabled = context.globalState.get("multiRootEnabled");
        const nativeToolCallEnabled = context.globalState.get("nativeToolCallEnabled");
        const remoteRulesToggles = context.globalState.get("remoteRulesToggles");
        const remoteWorkflowToggles = context.globalState.get("remoteWorkflowToggles");
        const botConfigurations = context.globalState.get("botConfigurations");
        return {
            // api configuration fields
            claudeCodePath,
            awsRegion,
            awsUseCrossRegionInference,
            awsUseGlobalInference,
            awsBedrockUsePromptCache,
            awsBedrockEndpoint,
            awsProfile,
            awsUseProfile,
            awsAuthentication,
            vertexProjectId,
            vertexRegion,
            openAiBaseUrl,
            requestyBaseUrl,
            openAiHeaders: openAiHeaders || {},
            ollamaBaseUrl,
            ollamaApiOptionsCtxNum,
            lmStudioBaseUrl,
            lmStudioMaxTokens,
            anthropicBaseUrl,
            geminiBaseUrl,
            qwenApiLine,
            moonshotApiLine,
            zaiApiLine,
            azureApiVersion,
            openRouterProviderSorting,
            liteLlmBaseUrl,
            liteLlmUsePromptCache,
            fireworksModelMaxCompletionTokens,
            fireworksModelMaxTokens,
            asksageApiUrl,
            favoritedModelIds: favoritedModelIds || [],
            requestTimeoutMs,
            sapAiCoreBaseUrl,
            sapAiCoreTokenUrl,
            sapAiResourceGroup,
            difyBaseUrl,
            sapAiCoreUseOrchestrationMode: sapAiCoreUseOrchestrationMode ?? true,
            ocaBaseUrl,
            minimaxApiLine,
            ocaMode: ocaMode || "internal",
            hicapModelId,
            aihubmixBaseUrl,
            aihubmixAppCode,
            // Plan mode configurations
            planModeApiProvider: planModeApiProvider || apiProvider,
            planModeApiModelId,
            // undefined means it was never modified, 0 means it was turned off
            // (having this on by default ensures that <thinking> text does not pollute the user's chat and is instead rendered as reasoning)
            planModeThinkingBudgetTokens: planModeThinkingBudgetTokens ?? ANTHROPIC_MIN_THINKING_BUDGET,
            planModeReasoningEffort,
            planModeVsCodeLmModelSelector,
            planModeAwsBedrockCustomSelected,
            planModeAwsBedrockCustomModelBaseId,
            planModeOpenRouterModelId,
            planModeOpenRouterModelInfo,
            planModeOpenAiModelId,
            planModeOpenAiModelInfo,
            planModeOllamaModelId,
            planModeLmStudioModelId,
            planModeLiteLlmModelId,
            planModeLiteLlmModelInfo,
            planModeRequestyModelId,
            planModeRequestyModelInfo,
            planModeTogetherModelId,
            planModeFireworksModelId: planModeFireworksModelId || fireworksDefaultModelId,
            planModeSapAiCoreModelId,
            planModeSapAiCoreDeploymentId,
            planModeGroqModelId,
            planModeGroqModelInfo,
            planModeHuggingFaceModelId,
            planModeHuggingFaceModelInfo,
            planModeHuaweiCloudMaasModelId,
            planModeHuaweiCloudMaasModelInfo,
            planModeBasetenModelId,
            planModeBasetenModelInfo,
            planModeOcaModelId,
            planModeOcaModelInfo,
            planModeHicapModelId,
            planModeHicapModelInfo,
            planModeAihubmixModelId,
            planModeAihubmixModelInfo,
            planModeNousResearchModelId,
            geminiPlanModeThinkingLevel,
            // Act mode configurations
            actModeApiProvider: actModeApiProvider || apiProvider,
            actModeApiModelId,
            actModeThinkingBudgetTokens: actModeThinkingBudgetTokens ?? ANTHROPIC_MIN_THINKING_BUDGET,
            actModeReasoningEffort,
            actModeVsCodeLmModelSelector,
            actModeAwsBedrockCustomSelected,
            actModeAwsBedrockCustomModelBaseId,
            actModeOpenRouterModelId,
            actModeOpenRouterModelInfo,
            actModeOpenAiModelId,
            actModeOpenAiModelInfo,
            actModeOllamaModelId,
            actModeLmStudioModelId,
            actModeLiteLlmModelId,
            actModeLiteLlmModelInfo,
            actModeRequestyModelId,
            actModeRequestyModelInfo,
            actModeTogetherModelId,
            actModeFireworksModelId: actModeFireworksModelId || fireworksDefaultModelId,
            actModeSapAiCoreModelId,
            actModeSapAiCoreDeploymentId,
            actModeGroqModelId,
            actModeGroqModelInfo,
            actModeHuggingFaceModelId,
            actModeHuggingFaceModelInfo,
            actModeHuaweiCloudMaasModelId,
            actModeHuaweiCloudMaasModelInfo,
            actModeBasetenModelId,
            actModeBasetenModelInfo,
            actModeOcaModelId,
            actModeOcaModelInfo,
            actModeHicapModelId,
            actModeHicapModelInfo,
            actModeAihubmixModelId,
            actModeAihubmixModelInfo,
            actModeNousResearchModelId,
            geminiActModeThinkingLevel,
            // Other global fields
            focusChainSettings: focusChainSettings || DEFAULT_FOCUS_CHAIN_SETTINGS,
            dictationSettings: { ...DEFAULT_DICTATION_SETTINGS, ...dictationSettings },
            strictPlanModeEnabled: strictPlanModeEnabled ?? true,
            yoloModeToggled: yoloModeToggled ?? false,
            useAutoCondense: useAutoCondense ?? false,
            clineWebToolsEnabled: clineWebToolsEnabled ?? true,
            isNewUser: isNewUser ?? true,
            welcomeViewCompleted,
            lastShownAnnouncementId,
            taskHistory: taskHistory || [],
            autoApprovalSettings: autoApprovalSettings || DEFAULT_AUTO_APPROVAL_SETTINGS, // default value can be 0 or empty string
            globalClineRulesToggles: globalClineRulesToggles || {},
            browserSettings: { ...DEFAULT_BROWSER_SETTINGS, ...browserSettings }, // this will ensure that older versions of browserSettings (e.g. before remoteBrowserEnabled was added) are merged with the default values (false for remoteBrowserEnabled)
            preferredLanguage: preferredLanguage || "English",
            openaiReasoningEffort: openaiReasoningEffort || "medium",
            mode: mode || "act",
            userInfo,
            mcpMarketplaceEnabled: mcpMarketplaceEnabledRaw ?? true,
            mcpDisplayMode: mcpDisplayMode ?? DEFAULT_MCP_DISPLAY_MODE,
            mcpResponsesCollapsed: mcpResponsesCollapsed,
            telemetrySetting: telemetrySetting || "unset",
            planActSeparateModelsSetting: planActSeparateModelsSetting ?? true,
            enableCheckpointsSetting: enableCheckpointsSettingRaw ?? true,
            shellIntegrationTimeout: shellIntegrationTimeout || 4000,
            terminalReuseEnabled: terminalReuseEnabled ?? true,
            vscodeTerminalExecutionMode: vscodeTerminalExecutionMode ?? "vscodeTerminal",
            terminalOutputLineLimit: terminalOutputLineLimit ?? 500,
            maxConsecutiveMistakes: maxConsecutiveMistakes ?? 3,
            subagentTerminalOutputLineLimit: subagentTerminalOutputLineLimit ?? 2000,
            defaultTerminalProfile: defaultTerminalProfile ?? "default",
            globalWorkflowToggles: globalWorkflowToggles || {},
            qwenCodeOauthPath,
            customPrompt,
            autoCondenseThreshold: autoCondenseThreshold || 0.75, // default to 0.75 if not set
            // Hooks require explicit user opt-in and are only supported on macOS/Linux
            hooksEnabled: getHooksEnabledSafe(hooksEnabled),
            subagentsEnabled: subagentsEnabled ?? false,
            lastDismissedInfoBannerVersion: lastDismissedInfoBannerVersion ?? 0,
            lastDismissedModelBannerVersion: lastDismissedModelBannerVersion ?? 0,
            lastDismissedCliBannerVersion: lastDismissedCliBannerVersion ?? 0,
            dismissedBanners: dismissedBanners || [],
            nativeToolCallEnabled: nativeToolCallEnabled ?? true,
            // Multi-root workspace support
            workspaceRoots,
            primaryRootIndex: primaryRootIndex ?? 0,
            // Feature flag - defaults to false
            // For now, always return false to disable multi-root support by default
            multiRootEnabled: !!multiRootEnabled,
            // OpenTelemetry configuration
            openTelemetryEnabled: openTelemetryEnabled ?? true,
            openTelemetryMetricsExporter,
            openTelemetryLogsExporter,
            openTelemetryOtlpProtocol: openTelemetryOtlpProtocol ?? "http/json",
            openTelemetryOtlpEndpoint: openTelemetryOtlpEndpoint ?? "http://localhost:4318",
            openTelemetryOtlpMetricsProtocol,
            openTelemetryOtlpMetricsEndpoint,
            openTelemetryOtlpLogsProtocol,
            openTelemetryOtlpLogsEndpoint,
            openTelemetryMetricExportInterval: openTelemetryMetricExportInterval ?? 60000,
            openTelemetryOtlpInsecure: openTelemetryOtlpInsecure ?? false,
            openTelemetryLogBatchSize: openTelemetryLogBatchSize ?? 512,
            openTelemetryLogBatchTimeout: openTelemetryLogBatchTimeout ?? 5000,
            openTelemetryLogMaxQueueSize: openTelemetryLogMaxQueueSize ?? 2048,
            remoteRulesToggles: remoteRulesToggles || {},
            remoteWorkflowToggles: remoteWorkflowToggles || {},
            botConfigurations,
        };
    }
    catch (error) {
        console.error("[StateHelpers] Failed to read global state:", error);
        throw error;
    }
}
export async function resetWorkspaceState(controller) {
    const context = controller.context;
    await Promise.all(context.workspaceState.keys().map((key) => controller.context.workspaceState.update(key, undefined)));
    await controller.stateManager.reInitialize();
}
export async function resetGlobalState(controller) {
    // TODO: Reset all workspace states?
    const context = controller.context;
    await Promise.all(context.globalState.keys().map((key) => context.globalState.update(key, undefined)));
    const secretKeys = [
        "apiKey",
        "openRouterApiKey",
        "awsAccessKey",
        "awsSecretKey",
        "awsSessionToken",
        "awsBedrockApiKey",
        "openAiApiKey",
        "ollamaApiKey",
        "geminiApiKey",
        "openAiNativeApiKey",
        "deepSeekApiKey",
        "requestyApiKey",
        "togetherApiKey",
        "qwenApiKey",
        "doubaoApiKey",
        "mistralApiKey",
        "clineAccountId",
        "liteLlmApiKey",
        "fireworksApiKey",
        "asksageApiKey",
        "xaiApiKey",
        "sambanovaApiKey",
        "cerebrasApiKey",
        "groqApiKey",
        "basetenApiKey",
        "moonshotApiKey",
        "nebiusApiKey",
        "huggingFaceApiKey",
        "huaweiCloudMaasApiKey",
        "vercelAiGatewayApiKey",
        "zaiApiKey",
        "difyApiKey",
        "ocaApiKey",
        "ocaRefreshToken",
        "minimaxApiKey",
        "hicapApiKey",
        "aihubmixApiKey",
        "mcpOAuthSecrets",
        "nousResearchApiKey",
    ];
    await Promise.all(secretKeys.map((key) => context.secrets.delete(key)));
    await controller.stateManager.reInitialize();
}
//# sourceMappingURL=state-helpers.js.map