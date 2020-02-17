"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
const chalk_1 = __importDefault(require("chalk"));
const address_1 = __importDefault(require("address"));
const default_gateway_1 = __importDefault(require("default-gateway"));
function prepareUrls(protocol, host, port, pathname = "/") {
    const formatUrl = (hostname) => url_1.default.format({
        protocol,
        hostname,
        port,
        pathname,
    });
    const prettyPrintUrl = (hostname) => url_1.default.format({
        protocol,
        hostname,
        port: chalk_1.default.bold(port.toString()),
        pathname,
    });
    const isUnspecifiedHost = host === "0.0.0.0" || host === "::";
    let prettyHost;
    let lanUrlForConfig;
    let lanUrlForTerminal = chalk_1.default.gray("unavailable");
    if (isUnspecifiedHost) {
        prettyHost = "localhost";
        try {
            const result = default_gateway_1.default.v4.sync();
            lanUrlForConfig = address_1.default.ip((result && result.interface) || undefined);
            if (lanUrlForConfig) {
                if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lanUrlForConfig)) {
                    lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
                }
                else {
                    lanUrlForConfig = undefined;
                }
            }
        }
        catch (_e) {
        }
    }
    else {
        prettyHost = host;
        lanUrlForConfig = host;
        lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
    }
    const localUrlForTerminal = prettyPrintUrl(prettyHost);
    const localUrlForBrowser = formatUrl(prettyHost);
    return {
        lanUrlForConfig,
        lanUrlForTerminal,
        localUrlForTerminal,
        localUrlForBrowser,
    };
}
exports.prepareUrls = prepareUrls;
//# sourceMappingURL=prepareURLs.js.map