import { createQualityConfig, createSeekConfig, createStepConfig } from "./modules/functions";
import { QualityLabels } from "./types/global";

export const matchPatterns = ["*://www.youtube.com/*"];

const qualityLabels: QualityLabels = {
  auto: "Auto",
  hd4320: "4320p (8K)",
  hd2160: "2160p (4K)",
  hd1440: "1440p",
  hd1080: "1080p",
  hd720: "720p",
  large: "480p",
  medium: "360p",
  small: "240p",
  tiny: "144p",
};

export const enableConfig = { default: true };

export const qualityConfig = createQualityConfig(qualityLabels);

export const rateConfig = { default: 1, max: 4, min: 0.25 };

export const seekConfig = createSeekConfig([5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5], 2);

export const source = "youboost";

export const stepConfig = createStepConfig([0.5, 0.25, 0.1], 0.25);
