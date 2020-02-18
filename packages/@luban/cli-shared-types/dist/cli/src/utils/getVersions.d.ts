declare function getVersions(): Promise<{
    current: string;
    latest: string;
    latestMinor: string;
}>;
export { getVersions };
