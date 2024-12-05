import { useEffect, useMemo, useState } from "react";
import { getStorage, setData } from "./modules/storage";
import { defaultQuality, defaultRate, defaultSeek, defaultStep, maxRate, minRate, qualityLabels, qualityOptions, seekOptions, stepOptions } from "./constants";
import Select from "./components/Select";
import { arrToOptions, rateToLabel, round, timeToLabel } from "./modules/functions";
import Header from "./components/Header";

export default function App() {
  const [quality, setQuality] = useState<youtube.VideoQuality>(defaultQuality);
  const [rate, setRate] = useState(defaultRate);
  const [step, setStep] = useState(defaultStep);
  const [seek, setSeek] = useState(defaultSeek);

  const rates = useMemo(() => {
    const rates = [rate];
    let currentRate = rate;
    while ((currentRate = round(currentRate + step)) < maxRate) rates.unshift(currentRate);
    currentRate = rate;
    while ((currentRate = round(currentRate - step)) > minRate) rates.push(currentRate);
    return [maxRate, ...rates, minRate];
  }, [rate, step]);
  const rateOptions = useMemo(() => arrToOptions(rates, rateToLabel), [rates]);

  function setState({ quality, rate, step, seek }: partialYouboostData) {
    if (quality) setQuality(quality);
    if (rate) setRate(rate);
    if (step) setStep(step);
    if (seek) setSeek(seek);
  }

  function updateData(data: partialYouboostData) {
    setData(data);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const { id } = tabs[0];
      if (id) chrome.tabs.sendMessage<partialYouboostData>(id, data);
    });
    setState(data);
  }

  useEffect(() => {
    getStorage<youtube.VideoQuality>("quality", defaultQuality).then(setQuality);
    getStorage("rate", defaultRate).then(setRate);
    getStorage("step", defaultStep).then(setStep);
    getStorage("seek", defaultSeek).then(setSeek);
    chrome.runtime.onMessage.addListener(setState);
    return () => chrome.runtime.onMessage.removeListener(setState);
  }, []);

  return (
    <div className="p-3 pb-4 space-y-5 text-white text-sm">
      <div className="grid grid-cols-4 items-center px-2">
        <img src="logo.png" alt="YouBoost logo" className="self" />
        <div className="col-span-3 text-center space-y-0.5">
          <h2 className="text-2xl">YouBoost</h2>
          <h4 className="text-xs">Boost Your YouTube Experience</h4>
        </div>
      </div>
      <Header text="Settings" />
      <div className="grid grid-cols-2 items-center gap-x-2 gap-y-3">
        <Select text="Video Quality" options={qualityOptions} value={quality} label={qualityLabels[quality]} onChange={(quality) => updateData({ quality: quality!.value })} />
        <Select text="Playback Speed" options={rateOptions} value={rate} label={rateToLabel(rate)} onChange={(rate) => updateData({ rate: rate!.value })} />
        <Select text="Playback Step" options={stepOptions} value={step} label={rateToLabel(step)} onChange={(step) => updateData({ step: step!.value })} />
        <Select text="Seek Interval" options={seekOptions} value={seek} label={timeToLabel(seek)} onChange={(seek) => updateData({ seek: seek!.value })} />
      </div>
      <Header text="Controls" />
      <div className="text-sm text-center space-y-0.5">
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
      </div>
      <button className="block mx-auto bg-[red] py-1 px-2.5 rounded-sm border border-white hover:bg-[rgba(255,0,0,0.6)]" onClick={() => updateData({ quality: defaultQuality, rate: defaultRate, step: defaultStep, seek: defaultSeek })}>
        Reset
      </button>
    </div>
  );
}
