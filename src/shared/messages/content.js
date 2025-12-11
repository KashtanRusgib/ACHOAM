export const REASONING_DETAILS_PROVIDERS = ["cline", "openrouter"];
/**
 * Converts ClineStorageMessage to Anthropic.MessageParam by removing Cline-specific fields
 * Cline-specific fields (like modelInfo, reasoning_details) are properly omitted.
 */
export function convertClineStorageToAnthropicMessage(clineMessage, provider = "anthropic") {
    const { role, content } = clineMessage;
    // Handle string content - fast path
    if (typeof content === "string") {
        return { role, content };
    }
    // Handle array content - strip Cline-specific fields for non-reasoning_details providers
    const shouldCleanContent = !REASONING_DETAILS_PROVIDERS.includes(provider);
    const cleanedContent = shouldCleanContent ? content.map(cleanContentBlock) : content;
    return { role, content: cleanedContent };
}
/**
 * Clean a content block by removing Cline-specific fields and returning only Anthropic-compatible fields
 */
export function cleanContentBlock(block) {
    // Fast path: if no Cline-specific fields exist, return as-is
    const hasClineFields = "reasoning_details" in block ||
        "call_id" in block ||
        "summary" in block ||
        (block.type === "tool_use" && "signature" in block);
    if (!hasClineFields) {
        return block;
    }
    // Remove Cline-specific fields (signature only for tool_use blocks)
    // biome-ignore lint/correctness/noUnusedVariables: intentional destructuring to remove properties
    const { reasoning_details, call_id, summary, ...rest } = block;
    // Remove signature only from tool_use blocks (used by Gemini)
    if (rest.type === "tool_use" && "signature" in rest) {
        // biome-ignore lint/correctness/noUnusedVariables: intentional destructuring to remove properties
        const { signature, ...cleanBlock } = rest;
        return cleanBlock;
    }
    return rest;
}
//# sourceMappingURL=content.js.map