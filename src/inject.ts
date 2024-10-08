// const script = document.createElement("script");
// script.src = chrome.runtime.getURL("src/script.js");
// (document.head || document.documentElement).appendChild(script);

import { defaultQuality, defaultRate, defaultSeek, defaultStep } from "./constants";
import { getStorage, setData } from "./modules/storage";
import scriptSrc from "./script?script&module";

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
  const quality = await getStorage("quality", defaultQuality);
  const rate = await getStorage("rate", defaultRate);
  const step = await getStorage("step", defaultStep);
  const seek = await getStorage("seek", defaultSeek);
  window.dispatchEvent(new CustomEvent<extendedYouboostData>("initData", { detail: { quality, rate, step, seek, type } }));
});

window.addEventListener("dataChangedKey", (({ detail }: CustomEvent<partialYouboostData>) => {
  chrome.runtime.sendMessage<partialYouboostData>(detail);
  setData(detail);
}) as EventListener);

chrome.runtime.onMessage.addListener((detail: partialYouboostData) => {
  window.dispatchEvent(new CustomEvent<partialYouboostData>("dataChangedUI", { detail }));
});
