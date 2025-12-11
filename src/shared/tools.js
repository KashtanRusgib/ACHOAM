// Define available tool ids
export var ClineDefaultTool;
(function (ClineDefaultTool) {
    ClineDefaultTool["ASK"] = "ask_followup_question";
    ClineDefaultTool["ATTEMPT"] = "attempt_completion";
    ClineDefaultTool["BASH"] = "execute_command";
    ClineDefaultTool["FILE_EDIT"] = "replace_in_file";
    ClineDefaultTool["FILE_READ"] = "read_file";
    ClineDefaultTool["FILE_NEW"] = "write_to_file";
    ClineDefaultTool["SEARCH"] = "search_files";
    ClineDefaultTool["LIST_FILES"] = "list_files";
    ClineDefaultTool["LIST_CODE_DEF"] = "list_code_definition_names";
    ClineDefaultTool["BROWSER"] = "browser_action";
    ClineDefaultTool["MCP_USE"] = "use_mcp_tool";
    ClineDefaultTool["MCP_ACCESS"] = "access_mcp_resource";
    ClineDefaultTool["MCP_DOCS"] = "load_mcp_documentation";
    ClineDefaultTool["NEW_TASK"] = "new_task";
    ClineDefaultTool["PLAN_MODE"] = "plan_mode_respond";
    ClineDefaultTool["ACT_MODE"] = "act_mode_respond";
    ClineDefaultTool["TODO"] = "focus_chain";
    ClineDefaultTool["WEB_FETCH"] = "web_fetch";
    ClineDefaultTool["CONDENSE"] = "condense";
    ClineDefaultTool["SUMMARIZE_TASK"] = "summarize_task";
    ClineDefaultTool["REPORT_BUG"] = "report_bug";
    ClineDefaultTool["NEW_RULE"] = "new_rule";
    ClineDefaultTool["APPLY_PATCH"] = "apply_patch";
    ClineDefaultTool["GENERATE_EXPLANATION"] = "generate_explanation";
})(ClineDefaultTool || (ClineDefaultTool = {}));
// Array of all tool names for compatibility
// Automatically generated from the enum values
export const toolUseNames = Object.values(ClineDefaultTool);
//# sourceMappingURL=tools.js.map