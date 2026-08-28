import { Listener } from "../types/global";
import { yttuner } from "../types/yttuner";

let storageChangeListeners: Record<string, Listener> = {};

const storageChangeListener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
  for (const key in changes) storageChangeListeners[key as yttuner.dataKey]?.(changes[key]!.newValue);
};

chrome.storage.local.onChanged.addListener(storageChangeListener);

export async function getStorage<K extends yttuner.dataKey>(key: K, fallbackValue?: yttuner.data[K]) {
  return new Promise<yttuner.data[K]>((resolve) => chrome.storage.local.get(key, (result) => resolve((result[key] ?? fallbackValue) as yttuner.data[K])));
}

export function registerChangeListener<K extends yttuner.dataKey>(key: K, listener: Listener<yttuner.data[K]>) {
  storageChangeListeners[key] = listener as Listener;
}

export const resetStorage = () => chrome.storage.local.clear();

export function revokeChangeListeners() {
  storageChangeListeners = {};
  chrome.storage.local.onChanged.removeListener(storageChangeListener);
}

export async function setData({ enabled, playbackStep, quality, rate, seekStep, volumeStep }: yttuner.partialData) {
  if (enabled !== undefined) setStorage("enabled", enabled);
  if (playbackStep) setStorage("playbackStep", playbackStep);
  if (quality) setStorage("quality", quality);
  if (rate) setStorage("rate", rate);
  if (seekStep) setStorage("seekStep", seekStep);
  if (volumeStep) setStorage("volumeStep", volumeStep);
}

export function setStorage<K extends yttuner.dataKey>(key: K, value: yttuner.data[K]) {
  return chrome.storage.local.set({ [key]: value });
}
