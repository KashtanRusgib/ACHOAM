export var Environment;
(function (Environment) {
    Environment["production"] = "production";
    Environment["staging"] = "staging";
    Environment["local"] = "local";
})(Environment || (Environment = {}));
class ClineEndpoint {
    static instance = new ClineEndpoint();
    static get config() {
        return ClineEndpoint.instance.config();
    }
    environment = Environment.production;
    constructor() {
        // Set environment at module load. Use override if provided.
        const _env = process?.env?.CLINE_ENVIRONMENT_OVERRIDE || process?.env?.CLINE_ENVIRONMENT;
        if (_env && Object.values(Environment).includes(_env)) {
            this.environment = _env;
            return;
        }
    }
    config() {
        return this.getEnvironment();
    }
    setEnvironment(env) {
        switch (env.toLowerCase()) {
            case "staging":
                this.environment = Environment.staging;
                break;
            case "local":
                this.environment = Environment.local;
                break;
            default:
                this.environment = Environment.production;
                break;
        }
        console.info("Cline environment updated: ", this.environment);
    }
    getEnvironment() {
        switch (this.environment) {
            case Environment.staging:
                return {
                    environment: Environment.staging,
                    appBaseUrl: "https://staging-app.cline.bot",
                    apiBaseUrl: "https://core-api.staging.int.cline.bot",
                    mcpBaseUrl: "https://core-api.staging.int.cline.bot/v1/mcp",
                };
            case Environment.local:
                return {
                    environment: Environment.local,
                    appBaseUrl: "http://localhost:3000",
                    apiBaseUrl: "http://localhost:7777",
                    mcpBaseUrl: "https://api.cline.bot/v1/mcp",
                };
            default:
                return {
                    environment: Environment.production,
                    appBaseUrl: "https://app.cline.bot",
                    apiBaseUrl: "https://api.cline.bot",
                    mcpBaseUrl: "https://api.cline.bot/v1/mcp",
                };
        }
    }
}
/**
 * Singleton instance to access the current environment configuration.
 * Usage:
 * - ClineEnv.config() to get the current config.
 * - ClineEnv.setEnvironment(Environment.local) to change the environment.
 */
export const ClineEnv = ClineEndpoint.instance;
//# sourceMappingURL=config.js.map