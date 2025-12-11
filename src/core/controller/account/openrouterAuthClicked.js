import { HostProvider } from "@/hosts/host-provider"
import { openExternal } from "@/utils/env"
/**
 * Initiates OpenRouter auth
 */
export async function openrouterAuthClicked(_, __) {
	const callbackUrl = await HostProvider.get().getCallbackUrl()
	const authUrl = `https://openrouter.ai/auth?callback_url=${callbackUrl}/openrouter`
	await openExternal(authUrl)
	return {}
}
//# sourceMappingURL=openrouterAuthClicked.js.map
