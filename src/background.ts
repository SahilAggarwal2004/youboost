import { matchPatterns } from "./constants";

chrome.runtime.onInstalled.addListener(() =>
  chrome.tabs.query({ url: matchPatterns }, (tabs) => {
    for (const { id } of tabs) {
      if (id === undefined) return;
      chrome.scripting.executeScript({
        target: { tabId: id },
        files: ["./assets/inject.ts-loader.js"],
      });
    }
  })
);
