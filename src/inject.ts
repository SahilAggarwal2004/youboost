// const script = document.createElement("script");
// script.src = chrome.runtime.getURL("src/script.js");
// (document.head || document.documentElement).appendChild(script);

import { enableConfig, qualityConfig, rateConfig, seekConfig, source, stepConfig } from "./constants";
import { postMessage } from "./modules/functions";
import { getStorage, setData } from "./modules/storage";
import scriptSrc from "./script?script&module";
import { MessageEventListener } from "./types/global";
import { youboost } from "./types/youboost";
import { youtube } from "./types/youtube";

const script = document.createElement("script");
script.src = chrome.runtime.getURL(scriptSrc);
script.type = "module";
document.head.prepend(script);

console.log("YouBoost activated");

async function dispatchInitData() {
  let type: youtube.PlayerType | undefined;
  if (window.location.pathname.startsWith("/watch")) type = "movie_player";
  else if (window.location.pathname.startsWith("/shorts")) type = "shorts-player";
  if (type)
    postMessage({
      type: "initData",
      payload: {
        enabled: await getStorage("enabled", enableConfig.default),
        quality: await getStorage("quality", qualityConfig.default),
        rate: await getStorage("rate", rateConfig.default),
        rateConfig,
        seek: await getStorage("seek", seekConfig.default),
        step: await getStorage("step", stepConfig.default),
        type,
      },
    });
}

if (document.readyState === "complete" || document.readyState === "interactive") dispatchInitData();
window.addEventListener("yt-navigate-finish", dispatchInitData);

window.addEventListener("message", ((message) => {
  if (message.source !== window) return;

  const { data } = message;
  if (data.source !== source) return;

  const { type, payload } = data;
  if (type !== "dataChangedKey") return;

  chrome.runtime.sendMessage<youboost.partialData>(payload);
  setData(payload);
}) as MessageEventListener);

chrome.runtime.onMessage.addListener((detail: youboost.partialData) => postMessage({ type: "dataChangedUI", payload: detail }));
