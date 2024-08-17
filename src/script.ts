import { defaultQuality, numberOfQualities, qualities, qualityLabels } from "./constants";
import { rateToLabel, round } from "./modules/functions";

type Player = (HTMLElement & youtube.Player) | null;
type Key = "Control" | "<" | ">" | "," | "." | "Alt" | "ArrowLeft" | "ArrowRight" | number;

let timeout = 0;
let onDataChange: EventListener = () => {};

window.addEventListener("initData", (({ detail: { quality, rate, step, seek, type } }: CustomEvent<extendedYoutuneData>) => {
  let qualityIndex = qualities.indexOf(quality);

  const observer = new MutationObserver(async () => {
    const player = document.getElementById(type) as Player;
    if (!player) return;

    observer.disconnect();

    const availableQualities = player.getAvailableQualityLevels();
    const video = player.querySelector("video")!;
    const textElement: HTMLDivElement = player.querySelector(".ytp-bezel-text")!;
    const textWrapper = textElement.parentElement!.parentElement!;
    const icon = document.querySelector(".ytp-bezel")! as HTMLDivElement;
    const keys: { [key in Key]?: boolean } = {};

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

    function changeRate(difference: number) {
      rate += difference;
      rate = Math.min(Math.max(round(rate), 0.25), 3);
      window.dispatchEvent(new CustomEvent<partialYoutuneData>("dataChangedKey", { detail: { rate } }));
      displayText(rateToLabel(rate));
      video.playbackRate = rate;
    }

    function changeQuality(quality: youtube.VideoQuality): void;
    function changeQuality(step: number): void;
    function changeQuality(quality: youtube.VideoQuality | number) {
      if (typeof quality === "string") {
        qualityIndex = qualities.indexOf(quality);
      } else if (typeof quality === "number") {
        qualityIndex = (qualityIndex + quality + numberOfQualities) % numberOfQualities;
        quality = qualities[qualityIndex];
      }
      window.dispatchEvent(new CustomEvent<partialYoutuneData>("dataChangedKey", { detail: { quality } }));
      displayText(qualityLabels[quality]);
      if (!availableQualities.includes(quality)) quality = defaultQuality;
      player!.setPlaybackQualityRange(quality, quality);
    }

    function handleKeyPress(event: KeyboardEvent) {
      keys[event.key as Key] = event.type === "keydown";
      if (keys["Control"]) {
        if (keys["."]) changeQuality(-1);
        else if (keys[","]) changeQuality(1);
        else if (keys["<"]) changeRate(-step);
        else if (keys[">"]) changeRate(step);
      } else if (keys["Alt"]) {
        const key = +event.key;
        if (key) changeQuality(qualities[key]);
      } else if (type === "shorts-player") {
        if (keys["ArrowLeft"]) player!.seekBy(-seek);
        else if (keys["ArrowRight"]) player!.seekBy(seek);
      }
    }

    onDataChange = (({ detail }: CustomEvent<partialYoutuneData>) => {
      if (detail.quality) {
        quality = detail.quality;
        qualityIndex = qualities.indexOf(quality);
        player!.setPlaybackQualityRange(quality, quality);
      }
      if (detail.rate) {
        rate = detail.rate;
        video.playbackRate = rate;
      }
      if (detail.step) step = detail.step;
      if (detail.seek) seek = detail.seek;
    }) as EventListener;

    window.addEventListener("dataChangedUI", onDataChange);
    player.onkeydown = handleKeyPress;
    player.onkeyup = handleKeyPress;
    video.playbackRate = rate;
    player.setPlaybackQualityRange(quality, quality);
  });

  observer.observe(document.body, { childList: true, attributes: true, subtree: true, characterData: true });
}) as EventListener);

window.addEventListener("yt-navigate-start", () => window.removeEventListener("dataChangedUI", onDataChange));
