import { matchPatterns } from "./constants";
import { getStorage, setData } from "./modules/storage";

chrome.runtime.onInstalled.addListener(async () => {
  const tabs = await chrome.tabs.query({ url: matchPatterns });
  for (const { id } of tabs) {
    if (id === undefined) continue;
    chrome.scripting.executeScript({ target: { tabId: id }, files: ["./assets/inject.ts-loader.js"] });
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "toggle-extension": {
      const enabled = await getStorage("enabled", true);
      await setData({ enabled: !enabled });
      const tabs = await chrome.tabs.query({ url: matchPatterns });
      for (const { id } of tabs) {
        if (id === undefined) continue;
        chrome.tabs.sendMessage(id, { enabled: !enabled });
      }
      break;
    }
  }
});
