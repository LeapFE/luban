"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const Service_1 = require("./Service");
const service = new Service_1.Service(process.cwd(), {});
const rawArgv = process.argv.slice(2);
const args = minimist_1.default(rawArgv);
const command = args._[0];
service.run(command, args, rawArgv).catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map