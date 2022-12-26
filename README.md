# @holllo/webextension-storage 🗃

> **Ergonomic WebExtension storage helper.**

## Example

```ts
import {createValue} from "@holllo/webextension-storage";

const updatedDate = await createValue<Date>({
  // A function that deserializes a string from storage to convert to the wanted
  // type.
  deserialize: (value) => new Date(value),

  // A function that serializes the type to a string to be set in storage.
  serialize: (date) => date.toISOString(),

  // The key to get from storage.
  key: "updatedDate",

  // The StorageArea to use, defaults to local.
  storage: browser.storage.sync,

  // The value to use if there is none in storage.
  value: new Date(),
});

// Get the inner value.
console.log(updatedDate.value);

// Set the inner value.
updatedDate.value = new Date();

// Save the value to storage.
await updatedDate.save();

// Remove the value from storage.
await updatedDate.remove();
```

## License

Distributed under the [AGPL-3.0-or-later](https://spdx.org/licenses/AGPL-3.0-or-later.html) license, see [LICENSE](https://git.bauke.xyz/Holllo/webextension-storage/src/branch/main/LICENSE) for more information.
