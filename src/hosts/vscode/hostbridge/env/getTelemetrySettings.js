import * as vscode from "vscode"
import { Setting } from "@/shared/proto/index.host"
export async function getTelemetrySettings(_) {
	if (vscode.env.isTelemetryEnabled) {
		return { isEnabled: Setting.ENABLED }
	} else {
		return { isEnabled: Setting.DISABLED }
	}
}
//# sourceMappingURL=getTelemetrySettings.js.map
