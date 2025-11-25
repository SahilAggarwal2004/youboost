import { rateConfig } from "../constants";
import { youtube } from "./youtube";

export namespace youboost {
  export type data = {
    enabled: boolean;
    quality: youtube.VideoQuality;
    rate: number;
    seek: number;
    step: number;
  };

  export type dataKey = keyof data;

  export type extendedData = data & {
    playerType: youtube.PlayerType;
    rateConfig: typeof rateConfig;
  };

  export type partialData = Partial<data>;
}
