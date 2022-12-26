import {setup, type TestContext} from "@holllo/test";
import browser from "webextension-polyfill";

import {createValue, type Value} from "../source/index.js";

const create = async <T>(
  key: string,
  expected: T,
): Promise<[string, T, Value<T>]> => {
  return [
    key,
    expected,
    await createValue<T>({
      deserialize: JSON.parse,
      key,
      serialize: JSON.stringify,
      value: expected,
    }),
  ];
};

const isStored = async (test: TestContext, key: string, exist: boolean) => {
  const stored = await browser.storage.local.get(key);
  test.equals(typeof stored[key], exist ? "string" : "undefined");
};

type SampleObject = {
  name: string;
  status: "failed" | "passed";
};

const sampleObject: SampleObject = {
  name: "Sample Object",
  status: "passed",
};

const group = await setup("Value<T>", async (group) => {
  const samples = [
    ["number", "testNumber", Math.PI],
    ["string", "testString", "A string to test with!" as string],
    ["SampleObject", "testSampleObject", sampleObject],
  ] as const;

  for (const sample of samples) {
    group.test(`T = ${sample[0]}`, async (test) => {
      const [key, expected, value] = await create(sample[1], sample[2]);
      if (sample[0] === "SampleObject") {
        const _expected = expected as SampleObject;
        const _value = value.value as SampleObject;
        test.equals(_value.name, _expected.name);
        test.equals(_value.status, _expected.status);
      } else {
        test.equals(value.value, expected);
      }

      await isStored(test, key, false);
      await value.save();
      await isStored(test, key, true);
      await value.remove();
      await isStored(test, key, false);
    });
  }

  group.test(`T = Date`, async (test) => {
    const expectedString = "2022-12-31T12:34:56.789Z";
    const expected = new Date(expectedString);
    const value = await createValue<Date>({
      deserialize: (input) => new Date(input),
      key: "testDate",
      serialize: (input) => input.toISOString(),
      value: expected,
    });
    test.equals(value.value instanceof Date, true);
    await value.save();
    const stored = await browser.storage.local.get(value.key);
    test.equals(stored[value.key], expectedString);
  });
});
