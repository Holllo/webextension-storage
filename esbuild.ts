import process from "node:process";
import {build} from "esbuild";
import {cmd} from "web-ext";

const test = process.env.TEST === "true";

const relative = (input: string) => new URL(input, import.meta.url).pathname;

await build({
  bundle: true,
  entryPoints: test
    ? ["tests/background.ts", "tests/example.ts", "tests/tests.ts"]
    : ["source/index.ts"],
  external: test ? undefined : ["webextension-polyfill"],
  format: "esm",
  logLevel: "info",
  minify: true,
  outdir: relative(test ? "tests/web-ext" : "build"),
  platform: "browser",
  splitting: false,
  target: ["es2022"],
  treeShaking: true,
});

if (test) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await cmd.run({
    firefoxProfile: relative("firefox/"),
    keepProfileChanges: true,
    profileCreateIfMissing: true,
    sourceDir: relative("tests/web-ext/"),
    startUrl: ["about:debugging#/runtime/this-firefox"],
    target: "firefox-desktop",
    verbose: true,
  });
}
