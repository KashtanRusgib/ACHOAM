import { workspaceResolver } from "@core/workspace";
export class DifyIntegration {
    handler;
    onConversationChange;
    onFileUploaded;
    onFeedbackSubmitted;
    constructor(options) {
        this.handler = options.difyHandler;
        this.onConversationChange = options.onConversationChange;
        this.onFileUploaded = options.onFileUploaded;
        this.onFeedbackSubmitted = options.onFeedbackSubmitted;
    }
    /**
     * Upload multiple files and return their IDs for use in conversations
     * @param files Array of file data with name and content
     * @param user User identifier (defaults to "cline-user")
     * @returns Array of uploaded file IDs
     */
    async uploadFiles(files, user) {
        const uploadedFileIds = [];
        for (const file of files) {
            try {
                const response = await this.handler.uploadFile(file.content, file.name, user);
                uploadedFileIds.push(response.id);
                // Notify about successful upload
                if (this.onFileUploaded) {
                    this.onFileUploaded(response.id, file.name);
                }
            }
            catch (error) {
                console.error(`Failed to upload file ${file.name}:`, error);
                throw new Error(`File upload failed for ${file.name}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        return uploadedFileIds;
    }
    /**
     * Enhanced conversation management with callbacks
     * @param conversationId Conversation ID to switch to
     */
    async switchToConversation(conversationId) {
        this.handler.setConversationId(conversationId);
        if (this.onConversationChange) {
            this.onConversationChange(conversationId);
        }
    }
    /**
     * Start a new conversation and notify listeners
     */
    async startNewConversation() {
        this.handler.resetConversation();
        if (this.onConversationChange) {
            this.onConversationChange("new");
        }
    }
    /**
     * Get conversation history with error handling and formatting
     * @param conversationId Conversation ID (uses current if not provided)
     * @param user User identifier
     * @param limit Number of messages to fetch
     * @returns Formatted conversation history
     */
    async getFormattedConversationHistory(conversationId, user, limit = 20) {
        const currentConversationId = conversationId || this.handler.getCurrentConversationId();
        if (!currentConversationId) {
            throw new Error("No conversation ID available");
        }
        try {
            const history = await this.handler.getConversationHistory(currentConversationId, user, undefined, limit);
            return history.data
                .map((message) => ({
                role: "user", // Dify messages are typically user queries
                content: message.query || message.answer || "",
                timestamp: message.created_at,
                id: message.id,
            }))
                .reverse(); // Reverse to get chronological order
        }
        catch (error) {
            console.error("Failed to get conversation history:", error);
            throw new Error(`Failed to retrieve conversation history: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Submit feedback with enhanced error handling
     * @param messageId Message ID to provide feedback for
     * @param rating Rating: "like" or "dislike"
     * @param content Optional feedback content
     * @param user User identifier
     */
    async submitFeedback(messageId, rating, content, user) {
        try {
            await this.handler.submitMessageFeedback(messageId, rating, content, user);
            if (this.onFeedbackSubmitted) {
                this.onFeedbackSubmitted(messageId, rating);
            }
        }
        catch (error) {
            console.error("Failed to submit feedback:", error);
            throw new Error(`Failed to submit feedback: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get all conversations for the user with enhanced formatting
     * @param user User identifier
     * @param limit Number of conversations to fetch
     * @returns Formatted conversation list
     */
    async getConversationList(user, limit = 20) {
        try {
            const conversations = await this.handler.getConversations(user, undefined, limit);
            return conversations.data.map((conv) => ({
                id: conv.id,
                name: conv.name || "Untitled Conversation",
                lastUpdated: conv.updated_at,
                status: conv.status,
            }));
        }
        catch (error) {
            console.error("Failed to get conversation list:", error);
            throw new Error(`Failed to retrieve conversations: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Auto-rename conversation based on content
     * @param conversationId Conversation ID to rename
     * @param user User identifier
     * @returns New conversation name
     */
    async autoRenameConversation(conversationId, user) {
        const targetConversationId = conversationId || this.handler.getCurrentConversationId();
        if (!targetConversationId) {
            throw new Error("No conversation ID available for renaming");
        }
        try {
            const result = await this.handler.renameConversation(targetConversationId, user, undefined, true);
            return result.name;
        }
        catch (error) {
            console.error("Failed to auto-rename conversation:", error);
            throw new Error(`Failed to rename conversation: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Delete conversation with confirmation
     * @param conversationId Conversation ID to delete
     * @param user User identifier
     */
    async deleteConversation(conversationId, user) {
        try {
            await this.handler.deleteConversation(conversationId, user);
        }
        catch (error) {
            console.error("Failed to delete conversation:", error);
            throw new Error(`Failed to delete conversation: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Stop current generation if task ID is available
     * @param taskId Task ID to stop
     * @param user User identifier
     */
    async stopCurrentGeneration(taskId, user) {
        try {
            await this.handler.stopGeneration(taskId, user);
        }
        catch (error) {
            console.error("Failed to stop generation:", error);
            throw new Error(`Failed to stop generation: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get the underlying Dify handler for direct access
     * @returns DifyHandler instance
     */
    getHandler() {
        return this.handler;
    }
}
/**
 * Helper function to create a Dify integration instance
 * @param handler DifyHandler instance
 * @param callbacks Optional callback functions
 * @returns DifyIntegration instance
 */
export function createDifyIntegration(handler, callbacks) {
    return new DifyIntegration({
        difyHandler: handler,
        ...callbacks,
    });
}
/**
 * Utility function to convert Cline file objects to Dify upload format
 * @param files Array of file paths or file objects from Cline
 * @returns Promise with array of file data ready for upload
 */
export async function prepareClineFilesForDify(files) {
    const fs = await import("fs");
    const fileData = [];
    for (const filePath of files) {
        try {
            const content = fs.readFileSync(filePath);
            const name = workspaceResolver.getBasename(filePath, "DifyIntegration.prepareClineFilesForDify");
            fileData.push({ name, content });
        }
        catch (error) {
            console.error(`Failed to read file ${filePath}:`, error);
            throw new Error(`Failed to read file ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    return fileData;
}
//# sourceMappingURL=dify-integration.js.map