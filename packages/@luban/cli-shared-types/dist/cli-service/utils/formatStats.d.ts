import { Stats } from "webpack";
import { PluginAPI } from "../lib/PluginAPI";
export declare function formatStats(stats: Stats, dir: string, api: PluginAPI): string;
export declare function logStatsErrorsAndWarnings(stats: Stats): void;
