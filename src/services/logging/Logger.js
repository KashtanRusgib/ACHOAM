import { HostProvider } from "@/hosts/host-provider";
import { ErrorService } from "../error";
/**
 * Simple logging utility for the extension's backend code.
 */
export class Logger {
    channelName = "Cline Dev Logger";
    static error(message, error) {
        Logger.#output("ERROR", message, error);
        ErrorService.get().logMessage(message, "error");
        error && ErrorService.get().logException(error);
    }
    static warn(message) {
        Logger.#output("WARN", message);
        ErrorService.get().logMessage(message, "warning");
    }
    static log(message) {
        Logger.#output("LOG", message);
    }
    static debug(message) {
        Logger.#output("DEBUG", message);
    }
    static info(message) {
        Logger.#output("INFO", message);
    }
    static trace(message) {
        Logger.#output("TRACE", message);
    }
    static #output(level, message, error) {
        let fullMessage = message;
        if (error?.message) {
            fullMessage += ` ${error.message}`;
        }
        HostProvider.get().logToChannel(`${level} ${fullMessage}`);
        if (error?.stack) {
            console.log(`Stack trace:\n${error.stack}`);
        }
    }
}
//# sourceMappingURL=Logger.js.map