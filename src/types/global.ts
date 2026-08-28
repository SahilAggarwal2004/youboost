import { actionKeys, modifierKeys, source } from "../constants";
import { yttuner } from "./yttuner";
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

// lib/functions.ts
export type GenerateLabel = (item: number) => string;

export type QualityLabels = { [key in youtube.VideoQuality]: string };

// lib/storage.ts
export type Listener<T = unknown> = (value: T) => unknown;

// inject.ts
export type MessageData =
  | { type: "dataChangedKey"; payload: yttuner.partialData }
  | { type: "dataChangedUI"; payload: yttuner.partialData }
  | { type: "initData"; payload: yttuner.extendedData };

export type MessageEventListener = (event: MessageEvent<MessageData & { source: typeof source }>) => void;

// script.ts
export type ActionKey = (typeof actionKeys)[number];

export type DataChangeHandler = (data: yttuner.partialData) => void;

export type Key = ActionKey | ModifierKey;

export type ModifierKey = (typeof modifierKeys)[number];

export type Player = (HTMLElement & youtube.Player) | null;
