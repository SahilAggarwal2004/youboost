import { qualityConfig } from "./constants";
import { rateToLabel, round } from "./modules/functions";
import { Key, Player } from "./types/global";
import { youboost } from "./types/youboost";
import { youtube } from "./types/youtube";

let timeout: NodeJS.Timeout;
let onDataChange: EventListener = () => {};

window.addEventListener("initData", (({ detail: { enabled, quality, rate, rateConfig, seek, step, type } }: CustomEvent<youboost.extendedData>) => {
  const player = document.getElementById(type) as Player;
  if (!player) return;

  const availableQualities = player.getAvailableQualityLevels();
  const video = player.querySelector("video")!;
  const textElement: HTMLDivElement = player.querySelector(".ytp-bezel-text")!;
  const textWrapper = textElement.parentElement!.parentElement!;
  const icon = document.querySelector(".ytp-bezel")! as HTMLDivElement;
  const keys: { [key in Key]?: boolean } = {};
  let qualityIndex = qualityConfig.values.indexOf(quality);

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

  function restoreDefaults() {
    video.playbackRate = rateConfig.default;
    player.setPlaybackQualityRange(qualityConfig.default, qualityConfig.default);
  }

  function applySettings(initial = false) {
    if (!initial || video.playbackRate === rateConfig.default) video.playbackRate = rate;
    player.setPlaybackQualityRange(quality, quality);
  }

  function changeRate(difference: number) {
    if (!enabled) return;

    rate += difference;
    rate = Math.min(Math.max(round(rate), rateConfig.min), rateConfig.max);
    window.dispatchEvent(new CustomEvent<youboost.partialData>("dataChangedKey", { detail: { rate } }));
    displayText(rateToLabel(rate));
    video.playbackRate = rate;
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
    window.dispatchEvent(new CustomEvent<youboost.partialData>("dataChangedKey", { detail: { quality } }));
    displayText(labels[quality]);
    if (!availableQualities.includes(quality)) quality = defaultQuality;
    player!.setPlaybackQualityRange(quality, quality);
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
    } else if (type === "shorts-player") {
      if (keys["ArrowLeft"]) player!.seekBy(-seek);
      else if (keys["ArrowRight"]) player!.seekBy(seek);
    }
  }

  onDataChange = (({ detail }: CustomEvent<youboost.partialData>) => {
    if (detail.enabled !== undefined) {
      enabled = detail.enabled;
      if (enabled) {
        displayText("YouBoost Enabled");
        return applySettings();
      }
      displayText("YouBoost Disabled");
      return restoreDefaults();
    }

    if (!enabled) return;

    if (detail.quality) {
      quality = detail.quality;
      qualityIndex = qualityConfig.values.indexOf(quality);
      player!.setPlaybackQualityRange(quality, quality);
    }
    if (detail.rate) {
      rate = detail.rate;
      video.playbackRate = rate;
    }
    if (detail.seek) seek = detail.seek;
    if (detail.step) step = detail.step;
  }) as EventListener;

  window.addEventListener("dataChangedUI", onDataChange);
  player.onkeydown = handleKeyPress;
  player.onkeyup = handleKeyPress;

  if (enabled) applySettings(true);

  video.focus();
}) as EventListener);

window.addEventListener("yt-navigate-start", () => window.removeEventListener("dataChangedUI", onDataChange));
