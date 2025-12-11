import { status } from "@grpc/grpc-js"
import { HostProvider } from "@/hosts/host-provider"
import { DiffViewProvider } from "@/integrations/editor/DiffViewProvider"
export class ExternalDiffViewProvider extends DiffViewProvider {
	activeDiffEditorId
	async openDiffEditor() {
		if (!this.absolutePath) {
			return
		}
		const response = await HostProvider.diff.openDiff({
			path: this.absolutePath,
			content: this.originalContent ?? "",
		})
		this.activeDiffEditorId = response.diffId
	}
	async replaceText(content, rangeToReplace, _currentLine) {
		if (!this.activeDiffEditorId) {
			return
		}
		await HostProvider.diff.replaceText({
			diffId: this.activeDiffEditorId,
			content: content,
			startLine: rangeToReplace.startLine,
			endLine: rangeToReplace.endLine,
		})
	}
	async truncateDocument(lineNumber) {
		if (!this.activeDiffEditorId) {
			return
		}
		await HostProvider.diff.truncateDocument({
			diffId: this.activeDiffEditorId,
			endLine: lineNumber,
		})
	}
	async saveDocument() {
		if (!this.activeDiffEditorId) {
			return false
		}
		try {
			await HostProvider.diff.saveDocument({ diffId: this.activeDiffEditorId })
			return true
		} catch (err) {
			if (err.code === status.NOT_FOUND) {
				// This can happen when the task is reloaded or the diff editor is closed. So, don't
				// consider it a real error.
				console.log("Diff not found:", this.activeDiffEditorId)
				return false
			} else {
				throw err
			}
		}
	}
	async scrollEditorToLine(line) {
		if (!this.activeDiffEditorId) {
			return
		}
		await HostProvider.diff.scrollDiff({ diffId: this.activeDiffEditorId, line: line })
	}
	async scrollAnimation(_startLine, _endLine) {}
	async getDocumentText() {
		if (!this.activeDiffEditorId) {
			return undefined
		}
		try {
			return (await HostProvider.diff.getDocumentText({ diffId: this.activeDiffEditorId })).content
		} catch (err) {
			console.log("Error getting contents of diff editor", err)
			return undefined
		}
	}
	async closeAllDiffViews() {
		await HostProvider.diff.closeAllDiffs({})
		this.activeDiffEditorId = undefined
	}
	async resetDiffView() {
		this.activeDiffEditorId = undefined
	}
}
//# sourceMappingURL=ExternalDiffviewProvider.js.map
