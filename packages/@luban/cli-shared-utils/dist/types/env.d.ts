export declare const hasGit: () => boolean;
export declare const hasProjectGit: (cwd: string) => boolean;
export declare const isWindows: boolean;
export declare const isMacintosh: boolean;
export declare const isLinux: boolean;
export declare const installedBrowsers: () => {
    chrome?: string | null | undefined;
    firefox?: string | null | undefined;
};
