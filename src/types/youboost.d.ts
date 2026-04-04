import { youtube } from "./youtube";

export namespace youboost {
  export type data = {
    enabled: boolean;
    playbackStep: number;
    quality: youtube.VideoQuality;
    rate: number;
    seekStep: number;
    volumeStep: number;
  };

  export type dataKey = keyof data;

  export type extendedData = data & { playerType: youtube.PlayerType };

  export type partialData = Partial<data>;
}
