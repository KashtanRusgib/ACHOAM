import { AchoamHead } from "./types"

export class Orchestrator {
	private heads: AchoamHead[] = []

	constructor(heads: AchoamHead[]) {
		this.heads = heads
	}

	public getActiveHeadIds(): string[] {
		return this.heads.map((h) => h.id)
	}

	public getHead(id: string): AchoamHead | undefined {
		return this.heads.find((h) => h.id === id)
	}
}
