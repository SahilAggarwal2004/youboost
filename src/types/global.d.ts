import { source } from "../constants";
import { youboost } from "./youboost";
import { youtube } from "./youtube";

// components/Header.tsx
export type HeaderProps = { text: string };

// components/Select.tsx
export type SelectProps<T> = {
  text: string;
  options: { value: T; label: string }[];
  value: T;
  label: string;
  onChange: (value: { value: T; label: string } | null) => void;
};

// modules/functions.ts
export type QualityLabels = { [key in youtube.VideoQuality]: string };

// inject.ts
export type MessageData =
  | { type: "dataChangedKey"; payload: youboost.partialData }
  | { type: "dataChangedUI"; payload: youboost.partialData }
  | { type: "initData"; payload: youboost.extendedData };

export type MessageEventListener = (event: MessageEvent<MessageData & { source: typeof source }>) => void;

// script.ts
export type DataChangeHandler = (data: youboost.partialData) => void;

export type Key = "Control" | "<" | ">" | "," | "." | "Alt" | "ArrowLeft" | "ArrowRight" | number;

export type Player = (HTMLElement & youtube.Player) | null;
