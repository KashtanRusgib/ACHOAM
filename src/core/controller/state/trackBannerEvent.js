import { Empty } from "@/shared/proto/cline/common"
/**
 * Tracks a banner event (e.g., dismiss, click)
 * @param controller The controller instance
 * @param request The request containing banner ID and event type
 * @returns Empty response
 */
export async function trackBannerEvent(controller, request) {
	const { bannerId, eventType } = request
	if (bannerId && eventType) {
		await controller.trackBannerEvent(bannerId, eventType)
	}
	return Empty.create()
}
//# sourceMappingURL=trackBannerEvent.js.map
