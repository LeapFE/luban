"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_ipc_1 = __importDefault(require("node-ipc"));
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
class IpcMessenger {
    constructor(options = {}) {
        options = Object.assign({}, DEFAULT_OPTIONS, options);
        node_ipc_1.default.config.id = this.id = options.networkId || "";
        node_ipc_1.default.config.retry = 1500;
        node_ipc_1.default.config.silent = true;
        this.connected = false;
        this.connecting = false;
        this.disconnecting = false;
        this.queue = null;
        this.options = options;
        this.listeners = [];
        this.disconnectTimeout = 15000;
        this.idleTimer = null;
        process.exit = (code) => {
            process.exitCode = code;
        };
        this._reset();
    }
    checkConnection() {
        if (!node_ipc_1.default.of[this.id]) {
            this.connected = false;
        }
    }
    send(data, type = "message") {
        this.checkConnection();
        if (this.connected) {
            if (this.options.namespaceOnProject && PROJECT_ID) {
                data = {
                    _projectId: PROJECT_ID,
                    _data: data,
                };
            }
            node_ipc_1.default.of[this.id].emit(type, data);
            if (this.idleTimer) {
                clearTimeout(this.idleTimer);
            }
            if (this.options.disconnectOnIdle) {
                this.idleTimer = setTimeout(() => {
                    this.disconnect();
                }, this.options.idleTimeout || DEFAULT_IDLE_TIMEOUT);
            }
        }
        else {
            if (Array.isArray(this.queue)) {
                this.queue.push(data);
            }
            if (this.options.autoConnect && !this.connecting) {
                this.connect();
            }
        }
    }
    connect() {
        this.checkConnection();
        if (this.connected || this.connecting)
            return;
        this.connecting = true;
        this.disconnecting = false;
        node_ipc_1.default.connectTo(this.id, () => {
            this.connected = true;
            this.connecting = false;
            this.queue && this.queue.forEach((data) => this.send(data));
            this.queue = null;
            node_ipc_1.default.of[this.id].on("message", this._onMessage);
        });
    }
    disconnect() {
        this.checkConnection();
        if (!this.connected || this.disconnecting)
            return;
        this.disconnecting = true;
        this.connecting = false;
        const ipcTimer = setTimeout(() => {
            this._disconnect();
        }, this.disconnectTimeout);
        this.send({ done: true }, "ack");
        node_ipc_1.default.of[this.id].on("ack", (data) => {
            if (data.ok) {
                clearTimeout(ipcTimer);
                this._disconnect();
            }
        });
    }
    on(listener) {
        this.listeners.push(listener);
    }
    off(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1)
            this.listeners.splice(index, 1);
    }
    _reset() {
        this.queue = [];
        this.connected = false;
    }
    _disconnect() {
        this.connected = false;
        this.disconnecting = false;
        node_ipc_1.default.disconnect(this.id);
        this._reset();
    }
    _onMessage(data) {
        this.listeners.forEach((fn) => {
            if (this.options.namespaceOnProject && data._projectId) {
                if (data._projectId === PROJECT_ID) {
                    data = data._data;
                }
                else {
                    return;
                }
            }
            fn(data);
        });
    }
}
exports.IpcMessenger = IpcMessenger;
