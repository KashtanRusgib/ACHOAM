import * as vscode from "vscode"
import { ExtensionRegistryInfo } from "@/registry"
export async function getHostVersion(_) {
	return {
		platform: vscode.env.appName,
		version: vscode.version,
		clineType: "VSCode Extension",
		clineVersion: ExtensionRegistryInfo.version,
	}
}
//# sourceMappingURL=getHostVersion.js.map
