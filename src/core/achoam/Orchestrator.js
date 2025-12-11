export class Orchestrator {
    heads = [];
    constructor(heads) {
        this.heads = heads;
    }
    getActiveHeadIds() {
        return this.heads.map((h) => h.id);
    }
    getHead(id) {
        return this.heads.find((h) => h.id === id);
    }
}
//# sourceMappingURL=Orchestrator.js.map