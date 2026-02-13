import { Listener } from "../types/global";
import { youboost } from "../types/youboost";

let storageChangeListeners: Record<string, Listener> = {};

const storageChangeListener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
  for (const key in changes) {
    storageChangeListeners[key as youboost.dataKey]?.(changes[key].newValue);
  }
};

chrome.storage.local.onChanged.addListener(storageChangeListener);

export async function getStorage<K extends youboost.dataKey>(key: K, fallbackValue?: youboost.data[K]) {
  return new Promise<youboost.data[K]>((resolve) => {
    chrome.storage.local.get(key, (result) => resolve((result[key] ?? fallbackValue) as youboost.data[K]));
  });
}

export function registerChangeListener<K extends youboost.dataKey>(key: K, listener: Listener<youboost.data[K]>) {
  storageChangeListeners[key] = listener as Listener;
}

export const resetStorage = () => chrome.storage.local.clear();

export function revokeChangeListeners() {
  storageChangeListeners = {};
  chrome.storage.local.onChanged.removeListener(storageChangeListener);
}

export async function setData({ enabled, quality, rate, seek, step }: youboost.partialData) {
  if (enabled !== undefined) setStorage("enabled", enabled);
  if (quality) setStorage("quality", quality);
  if (rate) setStorage("rate", rate);
  if (seek) setStorage("seek", seek);
  if (step) setStorage("step", step);
}

export function setStorage<K extends youboost.dataKey>(key: K, value: youboost.data[K]) {
  return chrome.storage.local.set({ [key]: value });
}
