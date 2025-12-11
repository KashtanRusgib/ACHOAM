import { Empty } from "@shared/proto/cline/common"
import { getRequestRegistry } from "../grpc-handler"
// Keep track of active didBecomeVisible subscriptions
const activeDidBecomeVisibleSubscriptions = new Set()
/**
 * Subscribe to didBecomeVisible events
 * @param controller The controller instance
 * @param request The empty request
 * @param responseStream The streaming response handler
 * @param requestId The ID of the request (passed by the gRPC handler)
 */
export async function subscribeToDidBecomeVisible(_controller, _request, responseStream, requestId) {
	console.log(`[DEBUG] set up didBecomeVisible subscription`)
	// Add this subscription to the active subscriptions
	activeDidBecomeVisibleSubscriptions.add(responseStream)
	// Register cleanup when the connection is closed
	const cleanup = () => {
		activeDidBecomeVisibleSubscriptions.delete(responseStream)
	}
	// Register the cleanup function with the request registry if we have a requestId
	if (requestId) {
		getRequestRegistry().registerRequest(requestId, cleanup, { type: "didBecomeVisible_subscription" }, responseStream)
	}
}
/**
 * Send a didBecomeVisible event to all active subscribers
 */
export async function sendDidBecomeVisibleEvent() {
	// Send the event to all active subscribers
	const promises = Array.from(activeDidBecomeVisibleSubscriptions).map(async (responseStream) => {
		try {
			const event = Empty.create({})
			await responseStream(event, false)
		} catch (error) {
			console.error("Error sending didBecomeVisible event:", error)
			// Remove the subscription if there was an error
			activeDidBecomeVisibleSubscriptions.delete(responseStream)
		}
	})
	await Promise.all(promises)
}
//# sourceMappingURL=subscribeToDidBecomeVisible.js.map
