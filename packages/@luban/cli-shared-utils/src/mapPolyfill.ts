class SimpleMapPolyfill<K extends string, V> {
  private _keys: K[];
  private _values: V[];

  constructor(init?: Array<Array<K | V>>) {
    this._keys = [];
    this._values = [];

    if (init) {
      init.forEach((elm) => {
        this._keys.push(elm[0] as K);
        this._values.push(elm[1] as V);
      });
    }
  }

  has(key: K): boolean {
    return this._keys.indexOf(key) > -1;
  }

  get(key: K): V | undefined {
    const keyIndex = this._keys.indexOf(key);

    return this._values[keyIndex];
  }

  set(key: K, value: V): this {
    if (!this.has(key)) {
      this._keys.push(key);
      this._values.push(value);
    } else {
      const targetKeyIndex = this._keys.findIndex((k) => k === key);

      this._keys.splice(targetKeyIndex, 1, key);
      this._values.splice(targetKeyIndex, 1, value);
    }

    return this;
  }

  delete(key: K): boolean {
    const exists = this.has(key);

    if (exists) {
      const keyIndex = this._keys.indexOf(key);

      this._keys.splice(keyIndex, 1);
      this._values.splice(keyIndex, 1);
    }

    return exists;
  }

  keys(): K[] {
    return this._keys;
  }

  values(): V[] {
    return this._values;
  }

  toPlainObject(): Record<K, V> {
    const result: Record<K, V> = {} as Record<K, V>;

    this._keys.forEach((key: K) => {
      const value = this.get(key);
      if (value) {
        result[key] = value;
      }
    });

    return result;
  }

  clear(): void {
    this._keys = [];
    this._values = [];
  }
}

export { SimpleMapPolyfill };
