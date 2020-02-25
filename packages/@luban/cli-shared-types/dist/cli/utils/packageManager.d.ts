import { SemVer } from "semver";
import { SUPPORTED_PACKAGE_MANAGER } from "../definitions";
declare class PackageManager {
    private readonly context;
    private readonly bin;
    private _registry;
    constructor({ context, forcePackageManager, }: {
        context: string;
        forcePackageManager?: SUPPORTED_PACKAGE_MANAGER;
    });
    getRegistry(): Promise<string>;
    addRegistryToArgs(args: string[]): Promise<string[]>;
    getMetadata(packageName: string, { field }?: {
        field?: string | undefined;
    }): Promise<any>;
    getRemoteVersion(packageName: string, versionRange?: string): Promise<string | SemVer | null>;
    getInstalledVersion(packageName: string): string;
    install(): Promise<void>;
    add(packageName: string, isDev?: boolean): Promise<void>;
    upgrade(packageName: string): Promise<void>;
    remove(packageName: string): Promise<void>;
}
export { PackageManager };
