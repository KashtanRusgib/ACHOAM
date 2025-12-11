import { ApiConfiguration, BotConfiguration, MultiBotConfiguration } from "@shared/api"
import { Mode } from "@shared/storage/types"
import { Plus } from "lucide-react"
import { useEffect } from "react"
import styled from "styled-components"
import { getBotColor } from "@/utils/botColors"
import BotCard from "./BotCard"

// Get VS Code API once at module level
const vscode = (window as any).acquireVsCodeApi ? (window as any).acquireVsCodeApi() : (window as any).vscode

interface BotConfigurationListProps {
	configurations: MultiBotConfiguration
	currentMode: Mode
	onConfigurationsChange: (configs: MultiBotConfiguration) => void
}

const Container = styled.div`
	width: 100%;
`

const BotsList = styled.div`
	margin-bottom: 16px;
`

const AddButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 16px;
`

const AddButton = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 16px;
	background-color: var(--vscode-button-background);
	color: var(--vscode-button-foreground);
	border: 1px solid var(--vscode-button-border);
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 500;
	transition: all 0.2s ease;

	&:hover {
		background-color: var(--vscode-button-hoverBackground);
	}

	&:active {
		transform: scale(0.98);
	}
`

const EmptyState = styled.div`
	padding: 24px;
	text-align: center;
	color: var(--vscode-descriptionForeground);
	border: 1px dashed var(--vscode-panel-border);
	border-radius: 6px;
	background-color: var(--vscode-editor-background);

	p {
		margin: 0 0 12px 0;
	}
`

/**
 * Component for managing multiple bot configurations
 * Displays a list of BotCards and provides UI for adding/removing bots
 */
const BotConfigurationList = ({ configurations, currentMode, onConfigurationsChange }: BotConfigurationListProps) => {
	const handleAddBot = () => {
		const newBot: BotConfiguration = {
			id: crypto.randomUUID(),
			name: `Bot ${configurations.length + 1}`,
			color: getBotColor(configurations.length),
			config: {
				// 100% clean defaults - OpenRouter with all fields empty
				apiProvider: "openrouter",
				planModeApiProvider: "openrouter",
				actModeApiProvider: "openrouter",
				openRouterApiKey: "",
				openRouterModelId: "",
				planModeOpenRouterModelId: "",
				actModeOpenRouterModelId: "",
				hicapModelId: "",
				planModeHicapModelId: "",
				actModeHicapModelId: "",
				anthropicApiKey: "",
				googleApiKey: "",
			} as ApiConfiguration,
		}

		const updated = [...configurations, newBot]
		onConfigurationsChange(updated)

		// Immediate persistence across webview destroy/recreate
		if (vscode?.setState) {
			vscode.setState({ botConfigurations: updated })
		}
	}

	// Load persisted state on mount, create default bot if none exist
	useEffect(() => {
		if (vscode?.getState) {
			const saved = vscode.getState()?.botConfigurations as BotConfiguration[] | undefined
			if (saved && saved.length > 0) {
				onConfigurationsChange(saved)
			} else if (configurations.length === 0) {
				handleAddBot()
			}
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const handleBotNameChange = (botId: string, newName: string) => {
		const updatedConfigs = configurations.map((bot) => (bot.id === botId ? { ...bot, name: newName } : bot))
		onConfigurationsChange(updatedConfigs)
	}

	const handleBotColorChange = (botId: string, newColor: string) => {
		const updatedConfigs = configurations.map((bot) => (bot.id === botId ? { ...bot, color: newColor } : bot))
		onConfigurationsChange(updatedConfigs)
	}

	const handleBotDelete = (botId: string) => {
		// Prevent deletion of the last bot
		if (configurations.length <= 1) {
			return
		}
		const updatedConfigs = configurations.filter((bot) => bot.id !== botId)
		onConfigurationsChange(updatedConfigs)
	}

	const handleBotConfigChange = (botId: string, updates: Partial<ApiConfiguration>) => {
		const updatedConfigs = configurations.map((bot) =>
			bot.id === botId
				? {
						...bot,
						config: {
							...bot.config,
							...updates,
						},
					}
				: bot,
		)
		onConfigurationsChange(updatedConfigs)
	}

	if (!configurations || configurations.length === 0) {
		return (
			<Container>
				<EmptyState>
					<p>No bot configurations yet.</p>
					<AddButton onClick={handleAddBot}>
						<Plus size={18} />
						Add Your First Chatbot API
					</AddButton>
				</EmptyState>
			</Container>
		)
	}

	return (
		<Container>
			<BotsList>
				{configurations.map((bot) => (
					<BotCard
						bot={bot}
						currentMode={currentMode}
						isLast={configurations.length === 1}
						key={bot.id}
						onColorChange={(newColor) => handleBotColorChange(bot.id, newColor)}
						onConfigChange={(updates) => handleBotConfigChange(bot.id, updates)}
						onDelete={() => handleBotDelete(bot.id)}
						onNameChange={(newName) => handleBotNameChange(bot.id, newName)}
					/>
				))}
			</BotsList>

			<AddButtonContainer>
				<AddButton onClick={handleAddBot}>
					<Plus size={18} />+ Add Another Chatbot API
				</AddButton>
			</AddButtonContainer>
		</Container>
	)
}

export default BotConfigurationList
