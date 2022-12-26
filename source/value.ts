import browser from "webextension-polyfill";

export type StorageArea = browser.Storage.StorageArea;

type ValueOptions<T> = {
  /** A function to convert a string to the type `T`. */
  deserialize: (input: string) => T;
  /** The key to use for storage. */
  key: string;
  /** A function convert the type `T` to a string, defaults to `JSON.stringify`. */
  serialize?: (input: T) => string;
  /** The storage area to use, defaults to local. */
  storage?: StorageArea;
  /** The default value to use if none exists in storage. */
  value: T;
};

export async function createValue<T>(
  options: ValueOptions<T>,
): Promise<Value<T>> {
  const storage = options.storage ?? browser.storage.local;

  const value = await storage.get(options.key);
  const stored = value[options.key] as string | undefined;

  return new Value({
    key: options.key,
    deserialize: options.deserialize,
    serialize: options.serialize ?? JSON.stringify,
    storage,
    value: stored === undefined ? options.value : options.deserialize(stored),
  });
}

type Props<T> = Required<ValueOptions<T>>;

export class Value<T> implements Props<T> {
  public readonly deserialize: Props<T>["deserialize"];
  public readonly key: Props<T>["key"];
  public readonly serialize: Props<T>["serialize"];
  public readonly storage: Props<T>["storage"];

  private inner: Props<T>["value"];

  constructor(options: Required<ValueOptions<T>>) {
    this.deserialize = options.deserialize;
    this.key = options.key;
    this.serialize = options.serialize;
    this.storage = options.storage;

    this.inner = options.value;
  }

  get value(): T {
    return this.inner;
  }

  set value(value: T) {
    this.inner = value;
  }

  /** Remove the value from storage. */
  public async remove(): Promise<void> {
    await this.storage.remove(this.key);
  }

  /** Save the value to storage. */
  public async save(): Promise<void> {
    await this.storage.set({
      [this.key]: this.serialize(this.inner),
    });
  }
}
