import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Select from "./components/Select";
import { enableConfig, playbackStepConfig, qualityConfig, rateConfig, seekStepConfig, volumeStepConfig } from "./constants";
import { arrToOptions, rateToLabel, round, timeToLabel, volumeToLabel } from "./lib/functions";
import { getStorage, registerChangeListener, revokeChangeListeners, setData } from "./lib/storage";
import { youboost } from "./types/youboost";

export default function App() {
  const [enabled, setEnabled] = useState(enableConfig.default);
  const [playbackStep, setPlaybackStep] = useState(playbackStepConfig.default);
  const [quality, setQuality] = useState(qualityConfig.default);
  const [rate, setRate] = useState(rateConfig.default);
  const [seekStep, setSeekStep] = useState(seekStepConfig.default);
  const [volumeStep, setVolumeStep] = useState(volumeStepConfig.default);

  const rates = useMemo(() => {
    const { max, min } = rateConfig;
    const rates = [rate];
    let currentRate = rate;
    while ((currentRate = round(currentRate - playbackStep)) >= min) rates.unshift(currentRate);
    currentRate = rate;
    while ((currentRate = round(currentRate + playbackStep)) <= max) rates.push(currentRate);
    return rates;
  }, [rate, playbackStep]);
  const rateOptions = useMemo(() => arrToOptions(rates, rateToLabel), [rates]);

  function setState({ enabled, playbackStep, quality, rate, seekStep, volumeStep }: youboost.partialData) {
    if (enabled !== undefined) setEnabled(enabled);
    if (playbackStep) setPlaybackStep(playbackStep);
    if (quality) setQuality(quality);
    if (rate) setRate(rate);
    if (seekStep) setSeekStep(seekStep);
    if (volumeStep) setVolumeStep(volumeStep);
  }

  function updateData(data: youboost.partialData) {
    setData(data);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const { id } = tabs[0] ?? {};
      if (id) chrome.tabs.sendMessage<youboost.partialData>(id, data);
    });
    setState(data);
  }

  useEffect(() => {
    getStorage("enabled", enableConfig.default).then(setEnabled);
    getStorage("playbackStep", playbackStepConfig.default).then(setPlaybackStep);
    getStorage("quality", qualityConfig.default).then(setQuality);
    getStorage("rate", rateConfig.default).then(setRate);
    getStorage("seekStep", seekStepConfig.default).then(setSeekStep);
    getStorage("volumeStep", volumeStepConfig.default).then(setVolumeStep);

    registerChangeListener("enabled", (enabled: boolean) => setEnabled(enabled));
    chrome.runtime.onMessage.addListener(setState);

    return () => {
      revokeChangeListeners();
      chrome.runtime.onMessage.removeListener(setState);
    };
  }, []);

  return (
    <div className="p-3 pb-2 space-y-3 text-white text-sm">
      <div className="grid grid-cols-4 items-center px-2">
        <img src="logo.webp" alt="YouBoost logo" width={60} />
        <div className="col-span-3 text-center">
          <h2 className="text-lg">YouBoost</h2>
          <h4 className="text-xs">Boost Your YouTube Experience</h4>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-3">
        <span className={`text-sm ${!enabled ? "text-gray-400" : ""}`}>Disabled</span>
        <label className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer scale-90">
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
          label={qualityConfig.labels[quality]!}
          onChange={(quality) => updateData({ quality: quality!.value })}
        />
        <Select text="Playback Speed" options={rateOptions} value={rate} label={rateToLabel(rate)} onChange={(rate) => updateData({ rate: rate!.value })} />
        <Select
          text="Playback Step"
          options={playbackStepConfig.options}
          value={playbackStep}
          label={rateToLabel(playbackStep)}
          onChange={(playbackStep) => updateData({ playbackStep: playbackStep!.value })}
        />
        <Select
          text="Seek Interval"
          options={seekStepConfig.options}
          value={seekStep}
          label={timeToLabel(seekStep)}
          onChange={(seekStep) => updateData({ seekStep: seekStep!.value })}
        />
        <Select
          text="Volume Step"
          options={volumeStepConfig.options}
          value={volumeStep}
          label={volumeToLabel(volumeStep)}
          onChange={(volumeStep) => updateData({ volumeStep: volumeStep!.value })}
        />
      </div>
      <button
        className={`block mx-auto bg-[red] py-1 px-2.5 text-sm rounded-xs border border-white hover:bg-[rgba(255,0,0,0.6)] ${!enabled ? "opacity-50 pointer-events-none" : ""}`}
        onClick={() =>
          updateData({
            quality: qualityConfig.default,
            playbackStep: playbackStepConfig.default,
            rate: rateConfig.default,
            seekStep: seekStepConfig.default,
            volumeStep: volumeStepConfig.default,
          })
        }
      >
        Reset
      </button>

      <Header text="Controls" />
      <div className={`text-xs place-self-center space-y-1 ${!enabled ? "opacity-50" : ""}`}>
        <div>
          Press <span className="font-semibold">{"Ctrl + Y"}</span> to toggle the extension on or off.
        </div>
        <div>
          Press <span className="font-semibold">{"Alt + (0-9)"}</span> to select video quality.
        </div>
        <div>
          Press <span className="font-semibold">{"Ctrl + ,/."}</span> to decrease or increase video quality.
        </div>
        <div>
          Press <span className="font-semibold">{"Ctrl + </>"}</span> to decrease or increase playback speed.
        </div>
        <div>
          Press <span className="font-semibold">{"</>"}</span> to temporarily adjust playback speed.
        </div>
        <div>
          Press <span className="font-semibold">W/S</span> to increase or decrease volume.
        </div>
        <div>
          Press <span className="font-semibold">A/D</span> to seek backward or forward.
        </div>
      </div>
    </div>
  );
}
