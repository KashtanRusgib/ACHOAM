var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { openRouterDefaultModelId, openRouterDefaultModelInfo } from "@shared/api";
import OpenAI from "openai";
import { fetch } from "@/shared/net";
import { withRetry } from "../retry";
import { ToolCallProcessor } from "../transform/tool-call-processor";
import { createVercelAIGatewayStream } from "../transform/vercel-ai-gateway-stream";
export class VercelAIGatewayHandler {
    options;
    client;
    constructor(options) {
        this.options = options;
    }
    ensureClient() {
        if (!this.client) {
            if (!this.options.vercelAiGatewayApiKey) {
                throw new Error("Vercel AI Gateway API key is required");
            }
            try {
                this.client = new OpenAI({
                    baseURL: "https://ai-gateway.vercel.sh/v1",
                    apiKey: this.options.vercelAiGatewayApiKey,
                    defaultHeaders: {
                        "http-referer": "https://cline.bot",
                        "x-title": "Cline",
                    },
                    fetch, // Use configured fetch with proxy support
                });
            }
            catch (error) {
                throw new Error(`Error creating Vercel AI Gateway client: ${error.message}`);
            }
        }
        return this.client;
    }
    async *createMessage(systemPrompt, messages, tools) {
        const client = this.ensureClient();
        const modelId = this.getModel().id;
        const modelInfo = this.getModel().info;
        try {
            const stream = await createVercelAIGatewayStream(client, systemPrompt, messages, { id: modelId, info: modelInfo }, this.options.thinkingBudgetTokens, tools);
            let didOutputUsage = false;
            const toolCallProcessor = new ToolCallProcessor();
            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta;
                if (delta?.content) {
                    yield {
                        type: "text",
                        text: delta.content,
                    };
                }
                if (delta?.tool_calls) {
                    yield* toolCallProcessor.processToolCallDeltas(delta.tool_calls);
                }
                // Reasoning tokens are returned separately from the content
                if ("reasoning" in delta && delta.reasoning) {
                    yield {
                        type: "reasoning",
                        reasoning: typeof delta.reasoning === "string" ? delta.reasoning : JSON.stringify(delta.reasoning),
                    };
                }
                // Reasoning details that can be passed back in API requests to preserve reasoning traces
                if ("reasoning_details" in delta &&
                    delta.reasoning_details &&
                    // @ts-ignore-next-line
                    delta.reasoning_details.length // exists and non-0
                ) {
                    yield {
                        type: "reasoning",
                        reasoning: "",
                        details: delta.reasoning_details,
                    };
                }
                if (!didOutputUsage && chunk.usage) {
                    // @ts-ignore - Vercel AI Gateway extends OpenAI types
                    const totalCost = (chunk.usage.cost || 0) + (chunk.usage.cost_details?.upstream_inference_cost || 0);
                    yield {
                        type: "usage",
                        cacheWriteTokens: 0,
                        cacheReadTokens: chunk.usage.prompt_tokens_details?.cached_tokens || 0,
                        inputTokens: (chunk.usage.prompt_tokens || 0) - (chunk.usage.prompt_tokens_details?.cached_tokens || 0),
                        outputTokens: chunk.usage.completion_tokens || 0,
                        totalCost,
                    };
                    didOutputUsage = true;
                }
            }
            if (!didOutputUsage) {
                console.warn("Vercel AI Gateway did not provide usage information in stream");
            }
        }
        catch (error) {
            console.error("Vercel AI Gateway error details:", error);
            console.error("Error stack:", error.stack);
            throw new Error(`Vercel AI Gateway error: ${error.message}`);
        }
    }
    getModel() {
        const modelId = this.options.openRouterModelId;
        const modelInfo = this.options.openRouterModelInfo;
        if (modelId && modelInfo) {
            return { id: modelId, info: modelInfo };
        }
        return { id: openRouterDefaultModelId, info: openRouterDefaultModelInfo };
    }
}
__decorate([
    withRetry()
], VercelAIGatewayHandler.prototype, "createMessage", null);
//# sourceMappingURL=vercel-ai-gateway.js.map