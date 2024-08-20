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

export async function setData({ quality, rate, step, seek }: partialYouboostData) {
  if (quality) setStorage("quality", quality);
  if (rate) setStorage("rate", rate);
  if (step) setStorage("step", step);
  if (seek) setStorage("seek", seek);
}
