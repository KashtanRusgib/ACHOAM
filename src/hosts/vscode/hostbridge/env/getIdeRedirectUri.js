import * as vscode from "vscode"
export async function getIdeRedirectUri(_) {
	const uriScheme = vscode.env.uriScheme || "vscode"
	const url = `${uriScheme}://saoudrizwan.claude-dev`
	return { value: url }
}
//# sourceMappingURL=getIdeRedirectUri.js.map
