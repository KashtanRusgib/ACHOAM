import { Boolean } from "@shared/proto/cline/common"
import { isClineCliInstalled } from "@/utils/cli-detector"
/**
 * Check if the Cline CLI is installed
 * @param controller The controller instance
 * @returns Boolean indicating if CLI is installed
 */
export async function checkCliInstallation(_controller) {
	try {
		const isInstalled = await isClineCliInstalled()
		return Boolean.create({ value: isInstalled })
	} catch (error) {
		console.error("Failed to check CLI installation:", error)
		return Boolean.create({ value: false })
	}
}
//# sourceMappingURL=checkCliInstallation.js.map
