export namespace youtube {
  export interface Player {
    getAvailableQualityLevels(): VideoQuality[];
    setPlaybackQualityRange(qualityLow: VideoQuality, qualityHigh: VideoQuality): void;
    seekBy(seconds: number): void;
  }

  export type PlayerType = "movie_player" | "shorts-player";

  export type VideoQuality =
    | VideoQualityAuto
    | VideoQualityTiny
    | VideoQualitySmall
    | VideoQualityMedium
    | VideoQualityLarge
    | VideoQualityHD720
    | VideoQualityHD1080
    | VideoQualityHD1440
    | VideoQuality4K2160
    | VideoQuality8K4320;

  type VideoQualityAuto = "auto";

  type VideoQualityTiny = "tiny";

  type VideoQualitySmall = "small";

  type VideoQualityMedium = "medium";

  type VideoQualityLarge = "large";

  type VideoQualityHD720 = "hd720";

  type VideoQualityHD1080 = "hd1080";

  type VideoQualityHD1440 = "hd1440";

  type VideoQuality4K2160 = "hd2160";

  type VideoQuality8K4320 = "hd4320";
}
