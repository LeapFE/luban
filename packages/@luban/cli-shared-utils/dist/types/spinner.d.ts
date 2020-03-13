declare class Spinner {
    private spinner;
    private lastMsg;
    private isPaused;
    constructor();
    logWithSpinner(symbol: string, msg?: string): void;
    stopSpinner(persist?: boolean): void;
    pauseSpinner(): void;
    resumeSpinner(): void;
    failSpinner(text?: string): void;
}
export { Spinner };
