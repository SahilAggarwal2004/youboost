import { useEffect, useMemo, useState } from "react";
import { getStorage, setData } from "./modules/storage";
import { enableConfig, qualityConfig, rateConfig, seekConfig, stepConfig } from "./constants";
import Select from "./components/Select";
import { arrToOptions, rateToLabel, round, timeToLabel } from "./modules/functions";
import Header from "./components/Header";
import { youboost } from "./types/youboost";

export default function App() {
  const [enabled, setEnabled] = useState(enableConfig.default);
  const [quality, setQuality] = useState(qualityConfig.default);
  const [rate, setRate] = useState(rateConfig.default);
  const [seek, setSeek] = useState(seekConfig.default);
  const [step, setStep] = useState(stepConfig.default);

  const rates = useMemo(() => {
    const { max, min } = rateConfig;
    const rates = [rate];
    let currentRate = rate;
    while ((currentRate = round(currentRate + step)) <= max) rates.unshift(currentRate);
    currentRate = rate;
    while ((currentRate = round(currentRate - step)) >= min) rates.push(currentRate);
    return rates;
  }, [rate, step]);
  const rateOptions = useMemo(() => arrToOptions(rates, rateToLabel), [rates]);

  function setState({ enabled, quality, rate, seek, step }: youboost.partialData) {
    if (enabled !== undefined) setEnabled(enabled);
    if (quality) setQuality(quality);
    if (rate) setRate(rate);
    if (seek) setSeek(seek);
    if (step) setStep(step);
  }

  function updateData(data: youboost.partialData) {
    setData(data);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const { id } = tabs[0];
      if (id) chrome.tabs.sendMessage<youboost.partialData>(id, data);
    });
    setState(data);
  }

  useEffect(() => {
    getStorage("enabled", enableConfig.default).then(setEnabled);
    getStorage("quality", qualityConfig.default).then(setQuality);
    getStorage("rate", rateConfig.default).then(setRate);
    getStorage("seek", seekConfig.default).then(setSeek);
    getStorage("step", stepConfig.default).then(setStep);
    chrome.runtime.onMessage.addListener(setState);
    return () => chrome.runtime.onMessage.removeListener(setState);
  }, []);

  return (
    <div className="p-3 pb-3 space-y-4 text-white text-sm">
      <div className="grid grid-cols-4 items-center px-2">
        <img src="logo.png" alt="YouBoost logo" className="self" />
        <div className="col-span-3 text-center">
          <h2 className="text-xl">YouBoost</h2>
          <h4 className="text-xs">Boost Your YouTube Experience</h4>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-3 py-1.5">
        <span className={`text-sm ${!enabled ? "text-gray-400" : ""}`}>Disabled</span>
        <label className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={() => updateData({ enabled: !enabled })} className="peer sr-only" />
          <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-600 peer-checked:bg-blue-600" />
          <span className="absolute inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 translate-x-1 peer-checked:translate-x-6" />
        </label>
        <span className={`text-sm ${!enabled ? "text-gray-400" : ""}`}>Enabled</span>
      </div>

      <Header text="Settings" />
      <div className={`grid grid-cols-2 items-center gap-x-2 gap-y-2.5 ${!enabled ? "opacity-50 pointer-events-none" : ""}`}>
        <Select
          text="Video Quality"
          options={qualityConfig.options}
          value={quality}
          label={qualityConfig.labels[quality]}
          onChange={(quality) => updateData({ quality: quality!.value })}
        />
        <Select text="Playback Speed" options={rateOptions} value={rate} label={rateToLabel(rate)} onChange={(rate) => updateData({ rate: rate!.value })} />
        <Select text="Playback Step" options={stepConfig.options} value={step} label={rateToLabel(step)} onChange={(step) => updateData({ step: step!.value })} />
        <Select text="Seek Interval" options={seekConfig.options} value={seek} label={timeToLabel(seek)} onChange={(seek) => updateData({ seek: seek!.value })} />
      </div>

      <Header text="Controls" />
      <div className={`text-xs text-center space-y-1 ${!enabled ? "opacity-50" : ""}`}>
        <div>
          Press <span className="font-semibold">{"Alt + (0-9)"}</span> to select video quality.
        </div>
        <div>
          Press <span className="font-semibold">{"Ctrl + ,/."}</span> to adjust video quality.
        </div>
        <div>
          Press <span className="font-semibold">{"Ctrl + </>"}</span> to change playback speed.
        </div>
        <div>
          Press <span className="font-semibold">{"</>"}</span> to change playback speed temporarily.
        </div>
        <div>
          Press <span className="font-semibold">←/→</span> to seek in YouTube Shorts.
        </div>
        <div>
          Press <span className="font-semibold">{"Ctrl + Shift + Y"}</span> to toggle extension on/off.
        </div>
      </div>

      <button
        className={`block mx-auto bg-[red] py-1 px-2.5 text-sm rounded-xs border border-white hover:bg-[rgba(255,0,0,0.6)] ${!enabled ? "opacity-50 pointer-events-none" : ""}`}
        onClick={() => updateData({ quality: qualityConfig.default, rate: rateConfig.default, seek: seekConfig.default, step: stepConfig.default })}
      >
        Reset
      </button>
    </div>
  );
}
