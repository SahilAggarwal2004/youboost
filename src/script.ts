/* eslint-disable prefer-const */
import { interactiveElements, modifierKeys, qualityConfig, rateConfig, source, volumeConfig } from "./constants";
import { postMessage, rateToLabel, round } from "./lib/functions";
import { DataChangeHandler, Key, MessageEventListener, ModifierKey, Player } from "./types/global";
import { youboost } from "./types/youboost";
import { youtube } from "./types/youtube";

let onDataChange: DataChangeHandler;

window.addEventListener("message", ((message) => {
  if (message.source !== window) return;

  const { data } = message;
  if (data.source !== source) return;

  const { type, payload } = data;
  if (type === "dataChangedUI") onDataChange?.(payload);
  else if (type === "initData") {
    let { enabled, playbackStep, playerType, quality, rate, seekStep, volumeStep } = payload;
    let qualityIndex = qualityConfig.values.indexOf(quality);
    const player = document.getElementById(playerType) as Player;
    if (!player) return;

    const availableQualities = player.getAvailableQualityLevels();
    const video = player.querySelector("video")!;
    const textElement = player.querySelector(".ytp-bezel-text") as HTMLDivElement;
    const textWrapper = textElement.parentElement!.parentElement as HTMLDivElement;
    const icon = document.querySelector(".ytp-bezel") as HTMLDivElement;

    const activeModifierKeys: Record<ModifierKey, boolean> = { control: false, alt: false };

    function applySettings(targetQuality = quality, targetRate = rate) {
      player!.setPlaybackQualityRange(targetQuality, targetQuality);
      video.playbackRate = targetRate;
    }

    function changeQuality(quality: youtube.VideoQuality | undefined): void;
    function changeQuality(step: number): void;
    function changeQuality(quality: youtube.VideoQuality | number | undefined) {
      if (!enabled || quality == null) return;

      const { default: defaultQuality, labels, total, values } = qualityConfig;
      if (typeof quality === "string") qualityIndex = values.indexOf(quality);
      else if (typeof quality === "number") {
        qualityIndex = (qualityIndex + quality + total) % total;
        quality = values[qualityIndex]!;
      }
      postMessage({ type: "dataChangedKey", payload: { quality } });
      displayText(labels[quality]!);
      if (!availableQualities.includes(quality)) quality = defaultQuality!;
      player!.setPlaybackQualityRange(quality, quality);
    }

    function changeRate(diff: number) {
      if (!enabled) return;

      const oldRate = video.playbackRate;
      rate = Math.min(Math.max(round(rate + diff), rateConfig.min), rateConfig.max);
      postMessage({ type: "dataChangedKey", payload: { rate } });
      displayText(rateToLabel(rate));
      if (rate !== oldRate) video.playbackRate = rate;
    }

    function changeVolume(diff: number) {
      if (!enabled) return;

      const oldVolume = player!.getVolume();
      const volume = Math.min(Math.max(oldVolume + diff, volumeConfig.min), volumeConfig.max);
      displayText(`${volume}%`);
      if (volume !== oldVolume) player!.setVolume(volume);
    }

    function displayText(text: string) {
      textWrapper.style.display = "none";
      icon.style.display = "block";
      setTimeout(() => {
        textElement.innerText = text;
        textWrapper.classList.remove("ytp-bezel-text-hide");
        textWrapper.style.display = "block";
        icon.style.display = "none";
      }, 0);
    }

    function handleKeyPress(event: KeyboardEvent) {
      if (!enabled) return;

      const target = event.target as HTMLElement;
      if (target.isContentEditable || interactiveElements.includes(target.tagName)) return;

      const key = event.key.toLowerCase() as Key;
      const isKeyDown = event.type === "keydown";
      if (modifierKeys.includes(key as ModifierKey)) activeModifierKeys[key as ModifierKey] = isKeyDown;
      if (!isKeyDown) return;

      if (activeModifierKeys["control"]) {
        if (key === ",") changeQuality(-1);
        else if (key === ".") changeQuality(1);
        else if (key === "<") changeRate(-playbackStep);
        else if (key === ">") changeRate(playbackStep);
      } else if (activeModifierKeys["alt"]) {
        if (key >= "0" && key <= "9") changeQuality(qualityConfig.values[+key]);
      } else {
        const isShortsPlayer = playerType === "shorts-player";
        if (key === "w") changeVolume(volumeStep);
        else if (key === "s") changeVolume(-volumeStep);
        else if (key === "a" || (isShortsPlayer && key === "arrowleft")) player!.seekBy(-seekStep);
        else if (key === "d" || (isShortsPlayer && key === "arrowright")) player!.seekBy(seekStep);
      }
    }

    const isShowingAd = () => player!.classList.contains("ad-showing");

    function observeAdFinish() {
      let wasShowingAd = isShowingAd();
      const adObserver = new MutationObserver(() => {
        if (wasShowingAd && !isShowingAd()) applySettings();
        wasShowingAd = isShowingAd();
      });
      adObserver.observe(player!, { attributes: true, attributeFilter: ["class"] });
      return adObserver;
    }

    function observePlayerRemoval(cleanup: VoidCallback) {
      const removalObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === player) {
              cleanup();
              removalObserver.disconnect();
            }
          });
        });
      });
      removalObserver.observe(player!.parentElement!, { childList: true });
    }

    onDataChange = (data: youboost.partialData) => {
      if (data.enabled !== undefined) {
        enabled = data.enabled;
        if (enabled) {
          displayText("YouBoost Enabled");
          return applySettings();
        }
        displayText("YouBoost Disabled");
        return applySettings(qualityConfig.default, rateConfig.default);
      }

      if (!enabled) return;

      if (data.playbackStep) playbackStep = data.playbackStep;
      if (data.quality) {
        quality = data.quality;
        qualityIndex = qualityConfig.values.indexOf(quality);
        player!.setPlaybackQualityRange(quality, quality);
      }
      if (data.rate) {
        rate = data.rate;
        video.playbackRate = rate;
      }
      if (data.seekStep) seekStep = data.seekStep;
      if (data.volumeStep) volumeStep = data.volumeStep;
    };

    function resetKeys() {
      modifierKeys.forEach((key) => (activeModifierKeys[key] = false));
    }

    const adObserver = observeAdFinish();
    player.onblur = resetKeys;
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyPress);
    observePlayerRemoval(() => {
      adObserver.disconnect();
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyPress);
    });

    if (enabled && !isShowingAd()) applySettings();
  }
}) as MessageEventListener);
