import { createQualityConfig, createStepConfig, rateToLabel, timeToLabel, volumeToLabel } from "./lib/functions";
import { QualityLabels } from "./types/global";

export const actionKeys = ["<", ">", ",", ".", "w", "s", "a", "d", "arrowleft", "arrowright", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export const enableConfig = { default: true };

export const interactiveElements = ["INPUT", "TEXTAREA"];

export const matchPatterns = ["*://www.youtube.com/*"];

export const modifierKeys = ["control", "alt"] as const;

export const playbackStepConfig = createStepConfig([0.1, 0.25, 0.5], 0.25, rateToLabel);

const qualityLabels: QualityLabels = {
  auto: "Auto",
  tiny: "144p",
  small: "240p",
  medium: "360p",
  large: "480p",
  hd720: "720p",
  hd1080: "1080p",
  hd1440: "1440p",
  hd2160: "2160p (4K)",
  hd4320: "4320p (8K)",
};

export const qualityConfig = createQualityConfig(qualityLabels);

export const rateConfig = { default: 1, max: 4, min: 0.25 };

export const seekStepConfig = createStepConfig([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], 2, timeToLabel);

export const source = "youboost";

export const volumeConfig = { max: 100, min: 0 };

export const volumeStepConfig = createStepConfig([1, 2, 5, 10], 5, volumeToLabel);
