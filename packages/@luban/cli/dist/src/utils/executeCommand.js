"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const events_1 = require("events");
const cli_shared_utils_1 = require("@luban/cli-shared-utils");
class InstallProgress extends events_1.EventEmitter {
    constructor() {
        super();
        this._progress = -1;
    }
    get progress() {
        return this._progress;
    }
    set progress(value) {
        this._progress = value;
    }
    get enabled() {
        return this._progress !== -1;
    }
    set enabled(value) {
        this.progress = value ? 0 : -1;
    }
    log(value) {
        this.emit("log", value);
    }
}
const progress = new InstallProgress();
exports.executeCommand = function executeCommand(command, args, cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        progress.enabled = false;
        try {
            yield execa_1.default(command, args, {
                cwd,
                stdio: ["inherit", "inherit", "inherit"],
            }).on("close", (code) => {
                if (code !== 0) {
                    cli_shared_utils_1.log(`command failed: ${command} ${args.join(" ")}`);
                    return;
                }
            });
        }
        catch (error) {
            cli_shared_utils_1.log(`command failed: ${command} ${args.join(" ")}`);
        }
    });
};
//# sourceMappingURL=executeCommand.js.map