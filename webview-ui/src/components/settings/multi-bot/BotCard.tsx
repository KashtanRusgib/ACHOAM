import { ApiConfiguration, BotConfiguration } from "@shared/api"
import { Mode } from "@shared/storage/types"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { Trash2 } from "lucide-react"
import styled from "styled-components"
import ApiOptions from "../ApiOptions"

interface BotCardProps {
	bot: BotConfiguration
	currentMode: Mode
	isLast: boolean // true if this is the only bot (disable delete)
	onNameChange: (newName: string) => void
	onColorChange: (newColor: string) => void
	onDelete: () => void
	onConfigChange: (updates: Partial<ApiConfiguration>) => void
}

const CardContainer = styled.div<{ $botColor: string }>`
	border: 1px solid var(--vscode-panel-border);
	border-left: 4px solid ${(props) => props.$botColor};
	border-radius: 6px;
	padding: 16px;
	margin-bottom: 12px;
	background-color: var(--vscode-editor-background);
	transition: all 0.2s ease;

	&:hover {
		border-color: var(--vscode-focusBorder);
		border-left-color: ${(props) => props.$botColor};
		box-shadow: 0 0 0 1px var(--vscode-focusBorder);
	}
`

const CardHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 16px;
`

const ColorPickerContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`

const ColorDot = styled.input`
	width: 32px;
	height: 32px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	padding: 0;

	&:hover {
		outline: 2px solid var(--vscode-focusBorder);
	}
`

const NameField = styled(VSCodeTextField)`
	flex: 1;
`

const DeleteButton = styled.button`
	background: transparent;
	border: 1px solid var(--vscode-button-border);
	color: var(--vscode-button-foreground);
	cursor: pointer;
	padding: 6px 10px;
	border-radius: 4px;
	display: flex;
	align-items: center;
	gap: 6px;
	transition: all 0.2s ease;

	&:hover:not(:disabled) {
		background: var(--vscode-button-hoverBackground);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`

const BotInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 12px;
	font-size: 12px;
	color: var(--vscode-descriptionForeground);
	padding: 8px 12px;
	background-color: var(--vscode-sideBar-background);
	border-radius: 4px;
`

const BotInfoLabel = styled.span`
	font-weight: 600;
	color: var(--vscode-foreground);
`

const BotInfoDivider = styled.span`
	color: var(--vscode-descriptionForeground);
`

const ConfigContainer = styled.div`
	margin-top: 12px;
	padding-top: 12px;
	border-top: 1px solid var(--vscode-panel-border);
`

/**
 * Component representing a single bot's configuration card
 * Displays bot metadata (name, color) and API configuration options
 */
const BotCard = ({ bot, currentMode, isLast, onNameChange, onColorChange, onDelete, onConfigChange }: BotCardProps) => {
	const handleNameChange = (newName: string) => {
		if (newName.trim()) {
			onNameChange(newName)
		}
	}

	// Extract provider and model info for display based on current mode
	// Use generic apiProvider first, fall back to mode-specific providers
	const provider =
		bot.config?.apiProvider ||
		(currentMode === "plan" ? bot.config?.planModeApiProvider : bot.config?.actModeApiProvider) ||
		"Not configured"

	// Use generic apiModelId first, fall back to mode-specific or common model IDs
	const modelId =
		bot.config?.apiModelId ||
		(currentMode === "plan" ? bot.config?.planModeApiModelId : bot.config?.actModeApiModelId) ||
		bot.config?.hicapModelId ||
		"No model selected"

	return (
		<CardContainer $botColor={bot.color}>
			<CardHeader>
				<ColorPickerContainer>
					<ColorDot
						onChange={(e) => onColorChange(e.target.value)}
						title="Click to change bot color"
						type="color"
						value={bot.color}
					/>
				</ColorPickerContainer>

				<NameField
					onInput={(e: any) => handleNameChange(e.target.value)}
					placeholder="Bot Name"
					value={bot.name || `Bot ${bot.id}`}
				/>

				<DeleteButton
					disabled={isLast}
					onClick={onDelete}
					title={isLast ? "Cannot delete the last bot" : "Delete this bot"}>
					<Trash2 size={16} />
				</DeleteButton>
			</CardHeader>

			{/* Display Make (Provider) and Model */}
			<BotInfo>
				<BotInfoLabel>{provider}</BotInfoLabel>
				<BotInfoDivider>|</BotInfoDivider>
				<span>{modelId}</span>
			</BotInfo>

			<ConfigContainer>
				<ApiOptions
					botConfig={bot.config}
					currentMode={currentMode}
					onConfigChange={onConfigChange}
					// Pass a wrapper callback that routes config changes to our handler
					showModelOptions={true}
				/>
			</ConfigContainer>
		</CardContainer>
	)
}

export default BotCard
