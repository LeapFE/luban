import ipc from "node-ipc";

const DEFAULT_ID = process.env.LUBAN_CLI_IPC || "@luban/cli";
const DEFAULT_IDLE_TIMEOUT = 3000;
const DEFAULT_OPTIONS = {
  networkId: DEFAULT_ID,
  autoConnect: true,
  disconnectOnIdle: false,
  idleTimeout: DEFAULT_IDLE_TIMEOUT,
  namespaceOnProject: true,
};

const PROJECT_ID = process.env.LUBAN_CLI_PROJECT_ID;

type Data = {
  _projectId?: string;
  ok?: boolean;
  done?: boolean;
  _data?: Data;
  [key: string]: unknown;
};

class IpcMessenger {
  private id: string;
  private connected: boolean;
  private connecting: boolean;
  private disconnecting: boolean;
  private options: Partial<typeof DEFAULT_OPTIONS>;
  private queue: null | Data[];
  private listeners: Array<(data: Data) => void>;
  private disconnectTimeout: number;
  private idleTimer: NodeJS.Timeout | null;

  constructor(options: Partial<typeof DEFAULT_OPTIONS> = {}) {
    options = Object.assign({}, DEFAULT_OPTIONS, options);
    ipc.config.id = this.id = options.networkId || "";
    ipc.config.retry = 1500;
    ipc.config.silent = true;

    this.connected = false;
    this.connecting = false;
    this.disconnecting = false;
    this.queue = null;
    this.options = options;

    this.listeners = [];

    this.disconnectTimeout = 15000;
    this.idleTimer = null;

    // override process.exit
    // Prevent forced process exit
    // (or else ipc messages may not be sent before kill)
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    process.exit = (code: number): void => {
      process.exitCode = code;
    };

    this._reset();
  }

  public checkConnection(): void {
    if (!ipc.of[this.id]) {
      this.connected = false;
    }
  }

  public send(data: Data, type = "message"): void {
    this.checkConnection();

    if (this.connected) {
      if (this.options.namespaceOnProject && PROJECT_ID) {
        data = {
          _projectId: PROJECT_ID,
          _data: data,
        };
      }

      ipc.of[this.id].emit(type, data);

      if (this.idleTimer) {
        clearTimeout(this.idleTimer);
      }

      if (this.options.disconnectOnIdle) {
        this.idleTimer = setTimeout(() => {
          this.disconnect();
        }, this.options.idleTimeout || DEFAULT_IDLE_TIMEOUT);
      }
    } else {
      if (Array.isArray(this.queue)) {
        this.queue.push(data);
      }

      if (this.options.autoConnect && !this.connecting) {
        this.connect();
      }
    }
  }

  public connect(): void {
    this.checkConnection();

    if (this.connected || this.connecting) return;
    this.connecting = true;
    this.disconnecting = false;
    ipc.connectTo(this.id, () => {
      this.connected = true;
      this.connecting = false;
      this.queue && this.queue.forEach((data) => this.send(data));
      this.queue = null;

      ipc.of[this.id].on("message", this._onMessage);
    });
  }

  public disconnect(): void {
    this.checkConnection();

    if (!this.connected || this.disconnecting) return;
    this.disconnecting = true;
    this.connecting = false;

    const ipcTimer = setTimeout(() => {
      this._disconnect();
    }, this.disconnectTimeout);

    this.send({ done: true }, "ack");

    ipc.of[this.id].on("ack", (data: Data) => {
      if (data.ok) {
        clearTimeout(ipcTimer);
        this._disconnect();
      }
    });
  }

  public on(listener: (data: Data) => void): void {
    this.listeners.push(listener);
  }

  public off(listener: (data: Data) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) this.listeners.splice(index, 1);
  }

  private _reset(): void {
    this.queue = [];
    this.connected = false;
  }

  private _disconnect(): void {
    this.connected = false;
    this.disconnecting = false;
    ipc.disconnect(this.id);
    this._reset();
  }

  private _onMessage(data: Data): void {
    this.listeners.forEach((fn) => {
      if (this.options.namespaceOnProject && data._projectId) {
        if (data._projectId === PROJECT_ID && data._data) {
          data = data._data;
        } else {
          return;
        }
      }
      fn(data);
    });
  }
}

export { IpcMessenger };
