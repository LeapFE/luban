declare const DEFAULT_OPTIONS: {
    networkId: string;
    autoConnect: boolean;
    disconnectOnIdle: boolean;
    idleTimeout: number;
    namespaceOnProject: boolean;
};
declare class IpcMessenger {
    private id;
    private connected;
    private connecting;
    private disconnecting;
    private options;
    private queue;
    private listeners;
    private disconnectTimeout;
    private idleTimer;
    constructor(options?: Partial<typeof DEFAULT_OPTIONS>);
    checkConnection(): void;
    send(data: any, type?: string): void;
    connect(): void;
    disconnect(): void;
    on(listener: (data: any) => void): void;
    off(listener: (data: any) => void): void;
    private _reset;
    private _disconnect;
    private _onMessage;
}
export { IpcMessenger };
