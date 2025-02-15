import { youboost } from "../types/youboost";

export function setStorage<T>(key: string, value: T) {
  chrome.storage.local.set({ [key]: value });
}

export async function getStorage<T>(key: string, fallbackValue?: T) {
  return new Promise<T>((resolve) => {
    chrome.storage.local.get(key, (result) => resolve(result[key] ?? fallbackValue));
  });
}

export async function resetStorage() {
  chrome.storage.local.clear();
}

export async function setData({ quality, rate, seek, step }: youboost.partialData) {
  if (quality) setStorage("quality", quality);
  if (rate) setStorage("rate", rate);
  if (seek) setStorage("seek", seek);
  if (step) setStorage("step", step);
}
