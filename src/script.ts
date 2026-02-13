/* eslint-disable prefer-const */
import { qualityConfig, source } from "./constants";
import { postMessage, rateToLabel, round } from "./modules/functions";
import { DataChangeHandler, Key, MessageEventListener, Player } from "./types/global";
import { youboost } from "./types/youboost";
import { youtube } from "./types/youtube";

let timeout: NodeJS.Timeout;
let onDataChange: DataChangeHandler;

window.addEventListener("message", ((message) => {
  if (message.source !== window) return;

  const { data } = message;
  if (data.source !== source) return;

  const { type, payload } = data;
  if (type === "dataChangedUI") onDataChange?.(payload);
  else if (type === "initData") {
    let { enabled, playerType, quality, rate, rateConfig, seek, step } = payload;
    const player = document.getElementById(playerType) as Player;
    if (!player) return;

    const availableQualities = player.getAvailableQualityLevels();
    const video = player.querySelector("video")!;
    const textElement: HTMLDivElement = player.querySelector(".ytp-bezel-text")!;
    const textWrapper = textElement.parentElement!.parentElement!;
    const icon = document.querySelector(".ytp-bezel")! as HTMLDivElement;
    const keys: { [key in Key]?: boolean } = {};
    let qualityIndex = qualityConfig.values.indexOf(quality);

    function applySettings(initial = false) {
      if (!initial || video.playbackRate === rateConfig.default) video.playbackRate = rate;
      player!.setPlaybackQualityRange(quality, quality);
    }

    function changeQuality(quality: youtube.VideoQuality): void;
    function changeQuality(step: number): void;
    function changeQuality(quality: youtube.VideoQuality | number) {
      if (!enabled) return;

      const { default: defaultQuality, labels, total, values } = qualityConfig;
      if (typeof quality === "string") {
        qualityIndex = values.indexOf(quality);
      } else if (typeof quality === "number") {
        qualityIndex = (qualityIndex + quality + total) % total;
        quality = values[qualityIndex];
      }
      postMessage({ type: "dataChangedKey", payload: { quality } });
      displayText(labels[quality]);
      if (!availableQualities.includes(quality)) quality = defaultQuality;
      player!.setPlaybackQualityRange(quality, quality);
    }

    function changeRate(difference: number) {
      if (!enabled) return;

      rate += difference;
      rate = Math.min(Math.max(round(rate), rateConfig.min), rateConfig.max);
      postMessage({ type: "dataChangedKey", payload: { rate } });
      displayText(rateToLabel(rate));
      video.playbackRate = rate;
    }

    function displayText(text: string) {
      textElement.innerText = text;
      textWrapper.classList.remove("ytp-bezel-text-hide");
      textWrapper.style.display = "block";
      icon.style.display = "none";
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        textWrapper.style.display = "none";
        icon.style.display = "block";
      }, 1000);
    }

    function handleKeyPress(event: KeyboardEvent) {
      keys[event.key as Key] = event.type === "keydown";

      if (!enabled) return;

      if (keys["Control"]) {
        if (keys["."]) changeQuality(-1);
        else if (keys[","]) changeQuality(1);
        else if (keys["<"]) changeRate(-step);
        else if (keys[">"]) changeRate(step);
      } else if (keys["Alt"]) {
        const key = +event.key;
        if (key) changeQuality(qualityConfig.values[key]);
      } else if (playerType === "shorts-player") {
        if (keys["ArrowLeft"]) player!.seekBy(-seek);
        else if (keys["ArrowRight"]) player!.seekBy(seek);
      }
    }

    const isShowingAd = () => player!.classList.contains("ad-showing");

    function observeAdFinish() {
      let wasShowingAd = isShowingAd();

      new MutationObserver(() => {
        if (wasShowingAd && !isShowingAd()) applySettings();
        wasShowingAd = isShowingAd();
      }).observe(player!, { attributes: true, attributeFilter: ["class"] });
    }

    onDataChange = (data: youboost.partialData) => {
      if (data.enabled !== undefined) {
        enabled = data.enabled;
        if (enabled) {
          displayText("YouBoost Enabled");
          return applySettings();
        }
        displayText("YouBoost Disabled");
        return restoreDefaults();
      }

      if (!enabled) return;

      if (data.quality) {
        quality = data.quality;
        qualityIndex = qualityConfig.values.indexOf(quality);
        player!.setPlaybackQualityRange(quality, quality);
      }
      if (data.rate) {
        rate = data.rate;
        video.playbackRate = rate;
      }
      if (data.seek) seek = data.seek;
      if (data.step) step = data.step;
    };

    function restoreDefaults() {
      video.playbackRate = rateConfig.default;
      player!.setPlaybackQualityRange(qualityConfig.default, qualityConfig.default);
    }

    observeAdFinish();
    player.onkeydown = handleKeyPress;
    player.onkeyup = handleKeyPress;

    if (enabled && !isShowingAd()) applySettings(true);

    video.focus();
  }
}) as MessageEventListener);
