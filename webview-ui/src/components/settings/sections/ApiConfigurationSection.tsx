import { UpdateSettingsRequest } from "@shared/proto/cline/state"
import { Mode } from "@shared/storage/types"
import { ApiConfiguration } from "@shared/api"
import { VSCodeButton, VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react"
import { useState, useEffect } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { StateServiceClient } from "@/services/grpc-client"
import { TabButton } from "../../mcp/configuration/McpConfigurationView"
import ApiOptions from "../ApiOptions"
import Section from "../Section"
import { syncModeConfigurations } from "../utils/providerUtils"
import { useApiConfigurationHandlers } from "../utils/useApiConfigurationHandlers"

interface ApiConfigurationSectionProps {
	renderSectionHeader?: (tabId: string) => JSX.Element | null
}

const ApiConfigurationSection = ({ renderSectionHeader }: ApiConfigurationSectionProps) => {
	const { planActSeparateModelsSetting, mode, apiConfiguration } = useExtensionState()
	const [currentTab, setCurrentTab] = useState<Mode>(mode)
	const { handleFieldsChange } = useApiConfigurationHandlers()
	
	// State for The Council
	const [enableTheCouncil, setEnableTheCouncil] = useState(false)
	const [secondaryProfiles, setSecondaryProfiles] = useState<ApiConfiguration[]>([])

	// Load secondaryProfiles from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem("cline_secondary_profiles")
		if (saved) {
			try {
				const parsed = JSON.parse(saved)
				setSecondaryProfiles(parsed)
			} catch (e) {
				console.error("Failed to parse saved secondary profiles:", e)
			}
		}
		const savedEnabled = localStorage.getItem("cline_enable_the_council")
		if (savedEnabled) {
			setEnableTheCouncil(savedEnabled === "true")
		}
	}, [])

	// Save secondaryProfiles to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("cline_secondary_profiles", JSON.stringify(secondaryProfiles))
	}, [secondaryProfiles])

	// Save enableTheCouncil to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("cline_enable_the_council", String(enableTheCouncil))
	}, [enableTheCouncil])

	const handleAddProfile = () => {
		setSecondaryProfiles([
			...secondaryProfiles,
			{
				planModeApiProvider: "openrouter",
				planModeApiModelId: "anthropic/claude-3.5-sonnet",
			} as ApiConfiguration,
		])
	}

	const removeProfile = (index: number) => {
		setSecondaryProfiles(secondaryProfiles.filter((_, i) => i !== index))
	}
	return (
		<div>
			{renderSectionHeader?.("api-config")}
			<Section>
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

				{/* The Council Section */}
				<div className="mb-[5px] mt-5">
					<VSCodeCheckbox
						checked={enableTheCouncil}
						className="mb-[5px]"
						onChange={(e: any) => {
							const checked = e.target.checked === true
							setEnableTheCouncil(checked)
						}}>
						Enable The Council
					</VSCodeCheckbox>
					<p className="text-xs mt-[5px] text-(--vscode-descriptionForeground)">
						Enable multiple AI agents to collaborate on tasks. Each agent can have its own provider and model
						configuration.
					</p>

					{enableTheCouncil && (
						<div className="mt-4 space-y-2">
							{/* Main Agent (Always visible) */}
							<div
								className="p-2 rounded flex justify-between"
								style={{
									backgroundColor: "rgba(255, 255, 255, 0.05)",
									border: "1px solid rgba(255, 255, 255, 0.1)",
								}}>
								<span>
									Bot #1 (Main): {apiConfiguration?.planModeApiProvider || "Not configured"}
								</span>
							</div>

							{/* Secondary Agents */}
							{secondaryProfiles.map((profile, index) => (
								<div
									key={index}
									className="p-2 rounded flex justify-between items-center"
									style={{
										backgroundColor: "rgba(255, 255, 255, 0.05)",
										border: "1px solid rgba(255, 255, 255, 0.1)",
									}}>
									<span>
										Bot #{index + 2}: {profile.planModeApiProvider || "Not configured"}
									</span>
									<VSCodeButton appearance="icon" onClick={() => removeProfile(index)} title="Remove">
										<span className="codicon codicon-trash"></span>
									</VSCodeButton>
								</div>
							))}

							{/* Add Another Chatbot API Button */}
							<VSCodeButton appearance="secondary" onClick={handleAddProfile} style={{ marginTop: "8px" }}>
								Add Another Chatbot API
							</VSCodeButton>
						</div>
					)}
				</div>
			</Section>
		</div>
	)
}

export default ApiConfigurationSection
