import { Empty } from "@shared/proto/cline/common"
import { telemetryService } from "../../../services/telemetry"
/**
 * Captures the onboarding progress step
 * @param controller The controller instance
 * @param request The request containing the step number
 * @returns Empty response
 */
export async function captureOnboardingProgress(_controller, request) {
	try {
		telemetryService.captureOnboardingProgress({
			step: Number(request.step),
			model: request.modelSelected,
			action: request.action,
			completed: !!request.completed,
		})
		return Empty.create({})
	} catch (error) {
		console.error("Failed to set welcome view completed:", error)
		throw error
	}
}
//# sourceMappingURL=captureOnboardingProgress.js.map
