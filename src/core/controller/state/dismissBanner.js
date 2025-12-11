import { Empty } from "@/shared/proto/cline/common"
/**
 * Dismisses a banner by ID
 * @param controller The controller instance
 * @param request The request containing the banner ID to dismiss
 * @returns Empty response
 */
export async function dismissBanner(controller, request) {
	const bannerId = request.value
	if (bannerId) {
		await controller.dismissBanner(bannerId)
	}
	return Empty.create()
}
//# sourceMappingURL=dismissBanner.js.map
