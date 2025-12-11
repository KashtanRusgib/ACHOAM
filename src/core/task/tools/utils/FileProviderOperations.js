/**
 * Utility class for file operations via a DiffViewProvider
 */
export class FileProviderOperations {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    async createFile(path, content) {
        this.provider.editType = "create";
        await this.provider.open(path);
        await this.provider.update(content, true);
        const result = await this.provider.saveChanges();
        await this.provider.reset();
        return result;
    }
    async modifyFile(path, content) {
        this.provider.editType = "modify";
        await this.provider.open(path);
        await this.provider.update(content, true);
        const result = await this.provider.saveChanges();
        await this.provider.reset();
        return result;
    }
    async deleteFile(path) {
        this.provider.editType = "delete";
        await this.provider.open(path);
        await this.provider.deleteFile(path);
    }
    async moveFile(oldPath, newPath, content) {
        const result = await this.createFile(newPath, content);
        await this.deleteFile(oldPath);
        return result;
    }
    async getFileContent() {
        return this.provider.originalContent;
    }
}
//# sourceMappingURL=FileProviderOperations.js.map