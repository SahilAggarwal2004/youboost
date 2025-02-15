// const script = document.createElement("script");
// script.src = chrome.runtime.getURL("src/script.js");
// (document.head || document.documentElement).appendChild(script);

import { qualityConfig, rateConfig, seekConfig, stepConfig } from "./constants";
import { getStorage, setData } from "./modules/storage";
import scriptSrc from "./script?script&module";
import { youboost } from "./types/youboost";
import { youtube } from "./types/youtube";

const script = document.createElement("script");
script.src = chrome.runtime.getURL(scriptSrc);
script.type = "module";
document.head.prepend(script);

console.log("YouBoost activated");

window.addEventListener("yt-navigate-finish", async () => {
  let type: youtube.PlayerType | undefined;
  if (window.location.pathname.startsWith("/watch")) type = "movie_player";
  else if (window.location.pathname.startsWith("/shorts")) type = "shorts-player";
  if (!type) return;
  const quality = await getStorage("quality", qualityConfig.default);
  const rate = await getStorage("rate", rateConfig.default);
  const seek = await getStorage("seek", seekConfig.default);
  const step = await getStorage("step", stepConfig.default);
  window.dispatchEvent(new CustomEvent<youboost.extendedData>("initData", { detail: { quality, rate, seek, step, type } }));
});

window.addEventListener("dataChangedKey", (({ detail }: CustomEvent<youboost.partialData>) => {
  chrome.runtime.sendMessage<youboost.partialData>(detail);
  setData(detail);
}) as EventListener);

chrome.runtime.onMessage.addListener((detail: youboost.partialData) => {
  window.dispatchEvent(new CustomEvent<youboost.partialData>("dataChangedUI", { detail }));
});
