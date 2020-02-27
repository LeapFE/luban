import { RootOptions, Preset } from "./definitions";
export declare const defaultPreset: Required<Preset>;
export declare const defaultPresetNameMap: Record<keyof Omit<Preset, "plugins">, string>;
export declare const defaultPromptModule: Array<keyof Preset>;
export declare const defaultRootOptions: Required<RootOptions>;
export declare const confirmUseDefaultPresetMsg: string;
