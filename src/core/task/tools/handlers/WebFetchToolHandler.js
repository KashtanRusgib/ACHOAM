import { ClineDefaultTool } from "@shared/tools";
import { telemetryService } from "@/services/telemetry";
import { formatResponse } from "../../../prompts/responses";
import { showNotificationForApproval } from "../../utils";
import { ToolResultUtils } from "../utils/ToolResultUtils";
export class WebFetchToolHandler {
    name = ClineDefaultTool.WEB_FETCH;
    getDescription(block) {
        return `[${block.name} for '${block.params.url}']`;
    }
    async handlePartialBlock(block, uiHelpers) {
        const url = block.params.url || "";
        const sharedMessageProps = {
            tool: "webFetch",
            path: uiHelpers.removeClosingTag(block, "url", url),
            content: `Fetching URL: ${uiHelpers.removeClosingTag(block, "url", url)}`,
            operationIsLocatedInWorkspace: false, // web_fetch is always external
        };
        const partialMessage = JSON.stringify(sharedMessageProps);
        // For partial blocks, we'll let the ToolExecutor handle auto-approval logic
        // Just stream the UI update for now
        await uiHelpers.removeLastPartialMessageIfExistsWithType("say", "tool");
        await uiHelpers.ask("tool", partialMessage, block.partial).catch(() => { });
    }
    async execute(config, block) {
        try {
            const url = block.params.url;
            // Extract provider information for telemetry
            const apiConfig = config.services.stateManager.getApiConfiguration();
            const currentMode = config.services.stateManager.getGlobalSettingsKey("mode");
            const provider = (currentMode === "plan" ? apiConfig.planModeApiProvider : apiConfig.actModeApiProvider);
            // Validate required parameter
            if (!url) {
                config.taskState.consecutiveMistakeCount++;
                return await config.callbacks.sayAndCreateMissingParamError(this.name, "url");
            }
            config.taskState.consecutiveMistakeCount = 0;
            // Create message for approval
            const sharedMessageProps = {
                tool: "webFetch",
                path: url,
                content: `Fetching URL: ${url}`,
                operationIsLocatedInWorkspace: false,
            };
            const completeMessage = JSON.stringify(sharedMessageProps);
            if (config.callbacks.shouldAutoApproveTool(this.name)) {
                // Auto-approve flow
                await config.callbacks.removeLastPartialMessageIfExistsWithType("ask", "tool");
                await config.callbacks.say("tool", completeMessage, undefined, undefined, false);
                telemetryService.captureToolUsage(config.ulid, "web_fetch", config.api.getModel().id, provider, true, true, undefined, block.isNativeToolCall);
            }
            else {
                // Manual approval flow
                showNotificationForApproval(`Cline wants to fetch content from ${url}`, config.autoApprovalSettings.enableNotifications);
                await config.callbacks.removeLastPartialMessageIfExistsWithType("say", "tool");
                const didApprove = await ToolResultUtils.askApprovalAndPushFeedback("tool", completeMessage, config);
                if (!didApprove) {
                    telemetryService.captureToolUsage(config.ulid, block.name, config.api.getModel().id, provider, false, false, undefined, block.isNativeToolCall);
                    return formatResponse.toolDenied();
                }
                else {
                    telemetryService.captureToolUsage(config.ulid, block.name, config.api.getModel().id, provider, false, true, undefined, block.isNativeToolCall);
                }
            }
            // Run PreToolUse hook after approval but before execution
            try {
                const { ToolHookUtils } = await import("../utils/ToolHookUtils");
                await ToolHookUtils.runPreToolUseIfEnabled(config, block);
            }
            catch (error) {
                const { PreToolUseHookCancellationError } = await import("@core/hooks/PreToolUseHookCancellationError");
                if (error instanceof PreToolUseHookCancellationError) {
                    return formatResponse.toolDenied();
                }
                throw error;
            }
            // Execute the actual fetch
            const urlContentFetcher = config.services?.urlContentFetcher;
            await urlContentFetcher.launchBrowser();
            try {
                // Fetch Markdown content
                const markdownContent = await urlContentFetcher.urlToMarkdown(url);
                // TODO: Implement secondary AI call to process markdownContent with prompt
                // For now, returning markdown directly.
                // This will be a significant sub-task.
                // Placeholder for processed summary:
                const processedSummary = `Fetched Markdown for ${url}:\n\n${markdownContent}`;
                return formatResponse.toolResult(processedSummary);
            }
            finally {
                // Ensure browser is closed even on error
                await urlContentFetcher.closeBrowser();
            }
        }
        catch (error) {
            return `Error fetching web content: ${error.message}`;
        }
    }
}
//# sourceMappingURL=WebFetchToolHandler.js.map