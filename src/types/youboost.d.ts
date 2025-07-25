import { rateConfig } from "../constants";
import { youtube } from "./youtube";

export namespace youboost {
  export type data = {
    quality: youtube.VideoQuality;
    rate: number;
    seek: number;
    step: number;
  };

  export type extendedData = data & {
    rateConfig: typeof rateConfig;
    type: youtube.PlayerType;
  };

  export type partialData = Partial<data>;
}
