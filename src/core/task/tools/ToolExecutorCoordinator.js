import { CLINE_MCP_TOOL_IDENTIFIER } from "@/shared/mcp";
import { ClineDefaultTool } from "@/shared/tools";
/**
 * A wrapper class that allows a single tool handler to be registered under multiple names.
 * This provides proper typing for tools that share the same implementation logic.
 */
export class SharedToolHandler {
    name;
    baseHandler;
    constructor(name, baseHandler) {
        this.name = name;
        this.baseHandler = baseHandler;
    }
    getDescription(block) {
        return this.baseHandler.getDescription(block);
    }
    async execute(config, block) {
        return this.baseHandler.execute(config, block);
    }
    async handlePartialBlock(block, uiHelpers) {
        return this.baseHandler.handlePartialBlock(block, uiHelpers);
    }
}
/**
 * Coordinates tool execution by routing to registered handlers.
 * Falls back to legacy switch for unregistered tools.
 */
export class ToolExecutorCoordinator {
    handlers = new Map();
    /**
     * Register a tool handler
     */
    register(handler) {
        this.handlers.set(handler.name, handler);
    }
    /**
     * Check if a handler is registered for the given tool
     */
    has(toolName) {
        return this.handlers.has(toolName);
    }
    /**
     * Get a handler for the given tool name
     */
    getHandler(toolName) {
        // HACK: Normalize MCP tool names to the standard handler
        if (toolName.includes(CLINE_MCP_TOOL_IDENTIFIER)) {
            toolName = ClineDefaultTool.MCP_USE;
        }
        return this.handlers.get(toolName);
    }
    /**
     * Execute a tool through its registered handler
     */
    async execute(config, block) {
        const handler = this.handlers.get(block.name);
        if (!handler) {
            throw new Error(`No handler registered for tool: ${block.name}`);
        }
        return handler.execute(config, block);
    }
}
//# sourceMappingURL=ToolExecutorCoordinator.js.map