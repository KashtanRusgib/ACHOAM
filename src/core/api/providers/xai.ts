import { ModelInfo, XAIModelId, xaiDefaultModelId, xaiModels } from "@shared/api"
import { shouldSkipReasoningForModel } from "@utils/model-utils"
import OpenAI from "openai"
import type { ChatCompletionTool as OpenAITool } from "openai/resources/chat/completions"
import { ChatCompletionReasoningEffort } from "openai/resources/chat/completions"
import { ClineStorageMessage } from "@/shared/messages/content"
import { fetch } from "@/shared/net"
import { ApiHandler, CommonApiHandlerOptions } from "../"
import { withRetry } from "../retry"
import { convertToOpenAiMessages } from "../transform/openai-format"
import { ApiStream } from "../transform/stream"
import { getOpenAIToolParams, ToolCallProcessor } from "../transform/tool-call-processor"

interface XAIHandlerOptions extends CommonApiHandlerOptions {
	xaiApiKey?: string
	reasoningEffort?: string
	apiModelId?: string
}

/**
 * Sanitize text to remove characters that can't be converted to ByteString by xAI API.
 * Characters with values > 255 that aren't properly handled need to be replaced or removed.
 * This is a comprehensive fix that handles ALL non-ASCII characters that could cause issues.
 */
function sanitizeForXAI(text: string): string {
	if (!text) {
		return text
	}

	// First pass: replace known problematic characters with ASCII equivalents
	const knownReplacements: [string, string][] = [
		["➜", "->"],
		["→", "->"],
		["←", "<-"],
		["↑", "^"],
		["↓", "v"],
		["✓", "[x]"],
		["✔", "[x]"],
		["✗", "[ ]"],
		["✘", "[ ]"],
		["•", "*"],
		["●", "*"],
		["○", "o"],
		["◆", "*"],
		["◇", "*"],
		["■", "#"],
		["□", "[ ]"],
		["▪", "*"],
		["▫", "*"],
		["★", "*"],
		["☆", "*"],
		["♠", "spade"],
		["♣", "club"],
		["♥", "heart"],
		["♦", "diamond"],
		["—", "-"],
		["–", "-"],
		["\u2018", "'"], // left single quote
		["\u2019", "'"], // right single quote
		["\u201C", '"'], // left double quote
		["\u201D", '"'], // right double quote
		["…", "..."],
		["€", "EUR"],
		["£", "GBP"],
		["¥", "JPY"],
		["©", "(c)"],
		["®", "(R)"],
		["™", "(TM)"],
		["°", " degrees"],
		["±", "+/-"],
		["×", "x"],
		["÷", "/"],
		["≠", "!="],
		["≤", "<="],
		["≥", ">="],
		["∞", "infinity"],
		["µ", "u"],
		["α", "alpha"],
		["β", "beta"],
		["γ", "gamma"],
		["δ", "delta"],
		["π", "pi"],
		["σ", "sigma"],
		["Ω", "omega"],
	]

	let result = text
	for (const [char, replacement] of knownReplacements) {
		result = result.split(char).join(replacement)
	}

	// Second pass: remove any remaining characters > 255 that could cause ByteString errors
	// Keep basic ASCII (0-127) and extended ASCII (128-255) that are safe
	result = result.replace(/[^\x00-\xFF]/g, "")

	return result
}

export class XAIHandler implements ApiHandler {
	private options: XAIHandlerOptions
	private client: OpenAI | undefined

	constructor(options: XAIHandlerOptions) {
		this.options = options
	}

	private ensureClient(): OpenAI {
		if (!this.client) {
			if (!this.options.xaiApiKey) {
				throw new Error("xAI API key is required")
			}
			try {
				this.client = new OpenAI({
					baseURL: "https://api.x.ai/v1",
					apiKey: this.options.xaiApiKey,
					fetch, // Use configured fetch with proxy support
				})
			} catch (error: any) {
				throw new Error(`Error creating xAI client: ${error.message}`)
			}
		}
		return this.client
	}

	@withRetry()
	async *createMessage(systemPrompt: string, messages: ClineStorageMessage[], tools?: OpenAITool[]): ApiStream {
		const client = this.ensureClient()
		const modelId = this.getModel().id
		// ensure reasoning effort is either "low" or "high" for grok-3-mini
		let reasoningEffort: ChatCompletionReasoningEffort | undefined
		if (modelId.includes("3-mini")) {
			let reasoningEffort = this.options.reasoningEffort
			if (reasoningEffort && !["low", "high"].includes(reasoningEffort)) {
				reasoningEffort = undefined
			}
		}

		// Sanitize system prompt to avoid ByteString conversion errors with special Unicode characters
		const sanitizedSystemPrompt = sanitizeForXAI(systemPrompt)

		// Convert and sanitize messages
		const openAiMessages = convertToOpenAiMessages(messages).map((msg) => {
			if (typeof msg.content === "string") {
				return { ...msg, content: sanitizeForXAI(msg.content) }
			} else if (Array.isArray(msg.content)) {
				return {
					...msg,
					content: msg.content.map((part: any) => {
						if (part.type === "text" && typeof part.text === "string") {
							return { ...part, text: sanitizeForXAI(part.text) }
						}
						return part
					}),
				}
			}
			return msg
		})

		const stream = await client.chat.completions.create({
			model: modelId,
			max_completion_tokens: this.getModel().info.maxTokens,
			temperature: 0,
			messages: [{ role: "system", content: sanitizedSystemPrompt }, ...openAiMessages] as any,
			stream: true,
			stream_options: { include_usage: true },
			reasoning_effort: reasoningEffort,
			...getOpenAIToolParams(tools),
		})

		const toolCallProcessor = new ToolCallProcessor()

		for await (const chunk of stream) {
			const delta = chunk.choices[0]?.delta
			if (delta?.content) {
				yield {
					type: "text",
					text: delta.content,
				}
			}

			if (delta?.tool_calls) {
				yield* toolCallProcessor.processToolCallDeltas(delta.tool_calls)
			}

			if (delta && "reasoning_content" in delta && delta.reasoning_content) {
				// Skip reasoning content for Grok 4 models since it only displays "thinking" without providing useful information
				if (!shouldSkipReasoningForModel(modelId)) {
					yield {
						type: "reasoning",
						// @ts-ignore-next-line
						reasoning: delta.reasoning_content,
					}
				}
			}

			if (chunk.usage) {
				yield {
					type: "usage",
					inputTokens: chunk.usage.prompt_tokens || 0,
					outputTokens: chunk.usage.completion_tokens || 0,
					// @ts-ignore-next-line
					cacheReadTokens: chunk.usage.prompt_tokens_details?.cached_tokens || 0,
					// @ts-ignore-next-line
					cacheWriteTokens: chunk.usage.prompt_cache_miss_tokens || 0,
				}
			}
		}
	}

	getModel(): { id: XAIModelId; info: ModelInfo } {
		const modelId = this.options.apiModelId
		if (modelId && modelId in xaiModels) {
			const id = modelId as XAIModelId
			return { id, info: xaiModels[id] }
		}
		return {
			id: xaiDefaultModelId,
			info: xaiModels[xaiDefaultModelId],
		}
	}
}
