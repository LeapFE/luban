"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SimpleMapPolyfill {
    constructor(init) {
        this._keys = [];
        this._values = [];
        if (init) {
            init.forEach((elm) => {
                this._keys.push(elm[0]);
                this._values.push(elm[1]);
            });
        }
    }
    has(key) {
        return this._keys.indexOf(key) > -1;
    }
    get(key) {
        const keyIndex = this._keys.indexOf(key);
        return this._values[keyIndex];
    }
    set(key, value) {
        if (!this.has(key)) {
            this._keys.push(key);
            this._values.push(value);
        }
        else {
            const targetKeyIndex = this._keys.findIndex((k) => k === key);
            this._keys.splice(targetKeyIndex, 1, key);
            this._values.splice(targetKeyIndex, 1, value);
        }
        return this;
    }
    delete(key) {
        const exists = this.has(key);
        if (exists) {
            const keyIndex = this._keys.indexOf(key);
            this._keys.splice(keyIndex, 1);
            this._values.splice(keyIndex, 1);
        }
        return exists;
    }
    keys() {
        return this._keys;
    }
    values() {
        return this._values;
    }
    toPlainObject() {
        const result = {};
        this._keys.forEach((key) => {
            const value = this.get(key);
            if (value) {
                result[key] = value;
            }
        });
        return result;
    }
    clear() {
        this._keys = [];
        this._values = [];
    }
}
exports.SimpleMapPolyfill = SimpleMapPolyfill;
