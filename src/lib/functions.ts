import { source } from "../constants";
import { GenerateLabel, MessageData, QualityLabels } from "../types/global";
import { youtube } from "../types/youtube";

export const arrToOptions = (arr: number[], generateLabel: GenerateLabel) => arr.map((item) => ({ value: item, label: generateLabel(item) }));

export function createQualityConfig(labels: QualityLabels) {
  const values = Object.keys(labels) as youtube.VideoQuality[];
  return {
    default: values[0]!,
    labels,
    options: Object.entries(labels).map(([value, label]) => ({ value: value as youtube.VideoQuality, label })),
    total: values.length,
    values,
  };
}

export const createStepConfig = (values: number[], defaultValue: number, generateLabel: GenerateLabel) => ({
  default: defaultValue,
  options: arrToOptions(values, generateLabel),
  values,
});

export function postMessage(data: MessageData) {
  window.postMessage({ source, ...data }, window.location.origin);
}

export const rateToLabel = (rate: number) => `${rate}x`;

export const round = (number: number, digits = 2) => (digits ? +number.toFixed(digits) : Math.floor(number));

export const timeToLabel = (time: number) => `${time}s`;

export const volumeToLabel = (volume: number) => `${volume}%`;
