import browser from "webextension-polyfill";

browser.browserAction.onClicked.addListener(async () => {
  await browser.runtime.openOptionsPage();
});

browser.runtime.onInstalled.addListener(async () => {
  await browser.runtime.openOptionsPage();
});
