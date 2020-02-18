import { render as EJSRenderFunction } from "ejs";
import { ResolvedPlugin, BasePkgFields, RootOptions } from "../definitions";
declare type RestParams = {
    pkg?: BasePkgFields;
    plugins: ResolvedPlugin[];
    files?: Record<string, string>;
};
export declare type fileMiddlewareCallback = (files: Record<string, string>, render: typeof EJSRenderFunction) => Promise<void> | void;
export declare class Generator {
    readonly context: string;
    readonly plugins: ResolvedPlugin[];
    pkg: BasePkgFields;
    private readonly pm;
    readonly rootOptions: Required<RootOptions>;
    private readonly files;
    readonly fileMiddlewares: Array<fileMiddlewareCallback>;
    postProcessFilesCbs: Array<(files: Record<string, string>) => void>;
    private readonly allPluginIds;
    readonly exitLogs: Array<{
        id: string;
        msg: string;
        type: string;
    }>;
    constructor(context: string, { pkg, plugins, files }: RestParams);
    initPlugins(): Promise<void>;
    generate(): Promise<void>;
    sortPkg(): void;
    resolveFiles(): Promise<void>;
    hasPlugin(_id: string, _version: string): boolean;
    printExitLogs(): void;
}
export {};
