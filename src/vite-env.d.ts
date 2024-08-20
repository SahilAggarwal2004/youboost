/// <reference types="vite/client" />

declare module "*?script&module";

declare type youboostData = {
  quality: youtube.VideoQuality;
  rate: number;
  step: number;
  seek: number;
};

declare type partialYouboostData = Partial<youboostData>;

declare type extendedYouboostData = youboostData & { type: youtube.PlayerType };

declare namespace youtube {
  export type VideoQuality = VideoQualityAuto | VideoQualityTiny | VideoQualitySmall | VideoQualityMedium | VideoQualityLarge | VideoQualityHD720 | VideoQualityHD1080 | VideoQualityHD1440 | VideoQuality4K2160 | VideoQuality8K4320;

  export type VideoQualityAuto = "auto";

  export type VideoQualityTiny = "tiny";

  export type VideoQualitySmall = "small";

  export type VideoQualityMedium = "medium";

  export type VideoQualityLarge = "large";

  export type VideoQualityHD720 = "hd720";

  export type VideoQualityHD1080 = "hd1080";

  export type VideoQualityHD1440 = "hd1440";

  export type VideoQuality4K2160 = "hd2160";

  export type VideoQuality8K4320 = "hd4320";

  export interface Player {
    getAvailableQualityLevels(): VideoQuality[];
    setPlaybackQualityRange(qualityLow: VideoQuality, qualityHigh: VideoQuality): void;
    seekBy(seconds: number): void;
  }

  export type PlayerType = "movie_player" | "shorts-player";
}
