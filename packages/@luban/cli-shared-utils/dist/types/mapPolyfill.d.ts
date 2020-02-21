declare class SimpleMapPolyfill<K extends string, V> {
    private _keys;
    private _values;
    constructor(init?: Array<Array<K | V>>);
    has(key: K): boolean;
    get(key: K): V | undefined;
    set(key: K, value: V): this;
    delete(key: K): boolean;
    keys(): K[];
    values(): V[];
    toPlainObject(): Record<K, V>;
    clear(): void;
}
export { SimpleMapPolyfill };
