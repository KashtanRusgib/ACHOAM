import { Empty } from "@shared/proto/cline/common"
import { getRequestRegistry } from "../grpc-handler"
// Keep track of active focus chat input subscriptions
const focusChatInputSubscriptions = new Set()
/**
 * Subscribe to focus chat input events
 * @param controller The controller instance
 * @param request The empty request
 * @param responseStream The streaming response handler
 * @param requestId The ID of the request
 */
export async function subscribeToFocusChatInput(_controller, _request, responseStream, requestId) {
	// Add this subscription to the active subscriptions
	focusChatInputSubscriptions.add(responseStream)
	// Register cleanup when the connection is closed
	const cleanup = () => {
		focusChatInputSubscriptions.delete(responseStream)
	}
	// Register the cleanup function with the request registry if we have a requestId
	if (requestId) {
		getRequestRegistry().registerRequest(requestId, cleanup, { type: "focus_chat_input_subscription" }, responseStream)
	}
}
/**
 * Send a focus chat input event to all active subscribers
 */
export async function sendFocusChatInputEvent() {
	// Send the event to all active subscribers
	const promises = Array.from(focusChatInputSubscriptions).map(async (responseStream) => {
		try {
			const event = Empty.create({})
			await responseStream(event, false)
		} catch (error) {
			console.error("Error sending focus chat input event:", error)
			// Remove the subscription if there was an error
			focusChatInputSubscriptions.delete(responseStream)
		}
	})
	await Promise.all(promises)
}
//# sourceMappingURL=subscribeToFocusChatInput.js.map
