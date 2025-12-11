var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { azureOpenAiDefaultApiVersion, openAiModelInfoSaneDefaults } from "@shared/api";
import OpenAI, { AzureOpenAI } from "openai";
import { fetch } from "@/shared/net";
import { withRetry } from "../retry";
import { convertToOpenAiMessages } from "../transform/openai-format";
import { convertToR1Format } from "../transform/r1-format";
import { getOpenAIToolParams, ToolCallProcessor } from "../transform/tool-call-processor";
export class OpenAiHandler {
    options;
    client;
    constructor(options) {
        this.options = options;
    }
    ensureClient() {
        if (!this.client) {
            if (!this.options.openAiApiKey) {
                throw new Error("OpenAI API key is required");
            }
            try {
                // Azure API shape slightly differs from the core API shape: https://github.com/openai/openai-node?tab=readme-ov-file#microsoft-azure-openai
                // Use azureApiVersion to determine if this is an Azure endpoint, since the URL may not always contain 'azure.com'
                if (this.options.azureApiVersion ||
                    ((this.options.openAiBaseUrl?.toLowerCase().includes("azure.com") ||
                        this.options.openAiBaseUrl?.toLowerCase().includes("azure.us")) &&
                        !this.options.openAiModelId?.toLowerCase().includes("deepseek"))) {
                    this.client = new AzureOpenAI({
                        baseURL: this.options.openAiBaseUrl,
                        apiKey: this.options.openAiApiKey,
                        apiVersion: this.options.azureApiVersion || azureOpenAiDefaultApiVersion,
                        defaultHeaders: this.options.openAiHeaders,
                        fetch, // Use configured fetch with proxy support
                    });
                }
                else {
                    this.client = new OpenAI({
                        baseURL: this.options.openAiBaseUrl,
                        apiKey: this.options.openAiApiKey,
                        defaultHeaders: this.options.openAiHeaders,
                        fetch, // Use configured fetch with proxy support
                    });
                }
            }
            catch (error) {
                throw new Error(`Error creating OpenAI client: ${error.message}`);
            }
        }
        return this.client;
    }
    async *createMessage(systemPrompt, messages, tools) {
        const client = this.ensureClient();
        const modelId = this.options.openAiModelId ?? "";
        const isDeepseekReasoner = modelId.includes("deepseek-reasoner");
        const isR1FormatRequired = this.options.openAiModelInfo?.isR1FormatRequired ?? false;
        const isReasoningModelFamily = ["o1", "o3", "o4", "gpt-5"].some((prefix) => modelId.includes(prefix)) && !modelId.includes("chat");
        let openAiMessages = [
            { role: "system", content: systemPrompt },
            ...convertToOpenAiMessages(messages),
        ];
        let temperature;
        if (this.options.openAiModelInfo?.temperature !== undefined) {
            const tempValue = Number(this.options.openAiModelInfo.temperature);
            temperature = tempValue === 0 ? undefined : tempValue;
        }
        else {
            temperature = openAiModelInfoSaneDefaults.temperature;
        }
        let reasoningEffort;
        let maxTokens;
        if (this.options.openAiModelInfo?.maxTokens && this.options.openAiModelInfo.maxTokens > 0) {
            maxTokens = Number(this.options.openAiModelInfo.maxTokens);
        }
        else {
            maxTokens = undefined;
        }
        if (isDeepseekReasoner || isR1FormatRequired) {
            openAiMessages = convertToR1Format([{ role: "user", content: systemPrompt }, ...messages]);
        }
        if (isReasoningModelFamily) {
            openAiMessages = [{ role: "developer", content: systemPrompt }, ...convertToOpenAiMessages(messages)];
            temperature = undefined; // does not support temperature
            reasoningEffort = this.options.reasoningEffort || "medium";
        }
        const stream = await client.chat.completions.create({
            model: modelId,
            messages: openAiMessages,
            temperature,
            max_tokens: maxTokens,
            reasoning_effort: reasoningEffort,
            stream: true,
            stream_options: { include_usage: true },
            ...getOpenAIToolParams(tools),
        });
        const toolCallProcessor = new ToolCallProcessor();
        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta;
            if (delta?.content) {
                yield {
                    type: "text",
                    text: delta.content,
                };
            }
            if (delta && "reasoning_content" in delta && delta.reasoning_content) {
                yield {
                    type: "reasoning",
                    reasoning: delta.reasoning_content || "",
                };
            }
            if (delta?.tool_calls) {
                yield* toolCallProcessor.processToolCallDeltas(delta.tool_calls);
            }
            if (chunk.usage) {
                yield {
                    type: "usage",
                    inputTokens: chunk.usage.prompt_tokens || 0,
                    outputTokens: chunk.usage.completion_tokens || 0,
                    cacheReadTokens: chunk.usage.prompt_tokens_details?.cached_tokens || 0,
                    // @ts-ignore-next-line
                    cacheWriteTokens: chunk.usage.prompt_cache_miss_tokens || 0,
                };
            }
        }
    }
    getModel() {
        return {
            id: this.options.openAiModelId ?? "",
            info: this.options.openAiModelInfo ?? openAiModelInfoSaneDefaults,
        };
    }
}
__decorate([
    withRetry()
], OpenAiHandler.prototype, "createMessage", null);
//# sourceMappingURL=openai.js.map