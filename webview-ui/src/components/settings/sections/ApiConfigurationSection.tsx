import { normalizeApiConfigurations } from "@shared/apiConfigurationMigration"
import { UpdateSettingsRequest } from "@shared/proto/cline/state"
import { Mode } from "@shared/storage/types"
import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react"
import { useEffect, useState } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { StateServiceClient } from "@/services/grpc-client"
import { TabButton } from "../../mcp/configuration/McpConfigurationView"
import ApiOptions from "../ApiOptions"
import BotConfigurationList from "../multi-bot/BotConfigurationList"
import Section from "../Section"
import { syncModeConfigurations } from "../utils/providerUtils"
import { useApiConfigurationHandlers } from "../utils/useApiConfigurationHandlers"

interface ApiConfigurationSectionProps {
	renderSectionHeader?: (tabId: string) => JSX.Element | null
}

const ApiConfigurationSection = ({ renderSectionHeader }: ApiConfigurationSectionProps) => {
	const { planActSeparateModelsSetting, mode, apiConfiguration, apiConfigurations } = useExtensionState()
	const [currentTab, setCurrentTab] = useState<Mode>(mode)
	const { handleFieldsChange } = useApiConfigurationHandlers()
	const [useBotCouncil, setUseBotCouncil] = useState(false) // Toggle to show new multi-bot UI

	// Maintain local state for bot configurations
	const [localBotConfigs, setLocalBotConfigs] = useState(() => normalizeApiConfigurations(apiConfiguration, apiConfigurations))

	// Sync local state when external state changes (but don't reset user changes)
	// This useEffect only runs when the external config changes from backend
	// It won't override user's local changes while they're editing
	useEffect(() => {
		// Only sync if useBotCouncil is disabled (legacy mode)
		if (!useBotCouncil) {
			setLocalBotConfigs(normalizeApiConfigurations(apiConfiguration, apiConfigurations))
		}
	}, [apiConfiguration, apiConfigurations, useBotCouncil])

	const handleBotConfigurationsChange = async (updatedConfigs: any[]) => {
		// Update local state immediately to trigger re-render
		setLocalBotConfigs(updatedConfigs)

		// Persist to backend via vscode.postMessage
		console.log("Updated bot configurations:", updatedConfigs)
		try {
			// Send message to extension to persist bot configurations
			const vscode = (window as any).vscode || (window as any).acquireVsCodeApi?.()
			if (vscode) {
				vscode.postMessage({
					type: "updateBotConfigurations",
					botConfigurations: updatedConfigs,
				})
			}
		} catch (error) {
			console.error("Failed to persist bot configurations:", error)
		}
	}

	return (
		<div>
			{renderSectionHeader?.("api-config")}
			<Section>
				{/* TODO: Remove this once multi-bot is fully integrated and becomes default */}
				<div className="mb-4">
					<VSCodeCheckbox checked={useBotCouncil} onChange={(e: any) => setUseBotCouncil(e.target.checked)}>
						<span className="text-sm">Enable The Council (Multiple Chatbot APIs)</span>
					</VSCodeCheckbox>
					<p className="text-xs mt-2 text-(--vscode-descriptionForeground)">
						Use multiple API providers simultaneously by creating a council of chatbots
					</p>
				</div>

				{useBotCouncil ? (
					// Multi-bot configuration UI
					<>
						{planActSeparateModelsSetting ? (
							<div className="rounded-md mb-5">
								<div className="flex gap-px mb-[10px] -mt-2 border-0 border-b border-solid border-(--vscode-panel-border)">
									<TabButton
										disabled={currentTab === "plan"}
										isActive={currentTab === "plan"}
										onClick={() => setCurrentTab("plan")}
										style={{
											opacity: 1,
											cursor: "pointer",
										}}>
										Plan Mode
									</TabButton>
									<TabButton
										disabled={currentTab === "act"}
										isActive={currentTab === "act"}
										onClick={() => setCurrentTab("act")}
										style={{
											opacity: 1,
											cursor: "pointer",
										}}>
										Act Mode
									</TabButton>
								</div>

								<div className="-mb-3">
									<BotConfigurationList
										configurations={localBotConfigs}
										currentMode={currentTab}
										onConfigurationsChange={handleBotConfigurationsChange}
									/>
								</div>
							</div>
						) : (
							<BotConfigurationList
								configurations={localBotConfigs}
								currentMode={mode}
								onConfigurationsChange={handleBotConfigurationsChange}
							/>
						)}
					</>
				) : (
					// Legacy single configuration UI
					<>
						{/* Tabs container */}
						{planActSeparateModelsSetting ? (
							<div className="rounded-md mb-5">
								<div className="flex gap-px mb-[10px] -mt-2 border-0 border-b border-solid border-(--vscode-panel-border)">
									<TabButton
										disabled={currentTab === "plan"}
										isActive={currentTab === "plan"}
										onClick={() => setCurrentTab("plan")}
										style={{
											opacity: 1,
											cursor: "pointer",
										}}>
										Plan Mode
									</TabButton>
									<TabButton
										disabled={currentTab === "act"}
										isActive={currentTab === "act"}
										onClick={() => setCurrentTab("act")}
										style={{
											opacity: 1,
											cursor: "pointer",
										}}>
										Act Mode
									</TabButton>
								</div>

								{/* Content container */}
								<div className="-mb-3">
									<ApiOptions currentMode={currentTab} showModelOptions={true} />
								</div>
							</div>
						) : (
							<ApiOptions currentMode={mode} showModelOptions={true} />
						)}
					</>
				)}

				<div className="mb-[5px]">
					<VSCodeCheckbox
						checked={planActSeparateModelsSetting}
						className="mb-[5px]"
						onChange={async (e: any) => {
							const checked = e.target.checked === true
							try {
								// If unchecking the toggle, wait a bit for state to update, then sync configurations
								if (!checked) {
									await syncModeConfigurations(apiConfiguration, currentTab, handleFieldsChange)
								}
								await StateServiceClient.updateSettings(
									UpdateSettingsRequest.create({
										planActSeparateModelsSetting: checked,
									}),
								)
							} catch (error) {
								console.error("Failed to update separate models setting:", error)
							}
						}}>
						Use different models for Plan and Act modes
					</VSCodeCheckbox>
					<p className="text-xs mt-[5px] text-(--vscode-descriptionForeground)">
						Switching between Plan and Act mode will persist the API and model used in the previous mode. This may be
						helpful e.g. when using a strong reasoning model to architect a plan for a cheaper coding model to act on.
					</p>
				</div>
			</Section>
		</div>
	)
}

export default ApiConfigurationSection
