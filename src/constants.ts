import { arrToOptions, rateToLabel, timeToLabel } from "./modules/functions";

export const qualityLabels: { [key in youtube.VideoQuality]: string } = { auto: "Auto", hd4320: "4320p (8K)", hd2160: "2160p (4K)", hd1440: "1440p", hd1080: "1080p", hd720: "720p", large: "480p", medium: "360p", small: "240p", tiny: "144p" } as const;

export const qualities = Object.keys(qualityLabels) as youtube.VideoQuality[];

export const qualityOptions = Object.entries(qualityLabels).map(([value, label]) => ({ value: value as youtube.VideoQuality, label }));

export const numberOfQualities = qualities.length;

export const defaultQuality = qualities[0];

export const rates = [3, 2.75, 2.5, 2.25, 2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25];

export const maxRate = 3;

export const minRate = 0.25;

export const defaultRate = 1;

export const steps = [0.5, 0.25, 0.1];

export const stepOptions = arrToOptions(steps, rateToLabel);

export const defaultStep = 0.25;

export const seeks = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export const seekOptions = arrToOptions(seeks, timeToLabel);

export const defaultSeek = 2;
