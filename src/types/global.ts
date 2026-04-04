import { actionKeys, modifierKeys, source } from "../constants";
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

// lib/functions.ts
export type GenerateLabel = (item: number) => string;

export type QualityLabels = { [key in youtube.VideoQuality]: string };

// lib/storage.ts
export type Listener<T = unknown> = (value: T) => unknown;

// inject.ts
export type MessageData =
  | { type: "dataChangedKey"; payload: youboost.partialData }
  | { type: "dataChangedUI"; payload: youboost.partialData }
  | { type: "initData"; payload: youboost.extendedData };

export type MessageEventListener = (event: MessageEvent<MessageData & { source: typeof source }>) => void;

// script.ts
export type ActionKey = (typeof actionKeys)[number];

export type DataChangeHandler = (data: youboost.partialData) => void;

export type Key = ActionKey | ModifierKey;

export type ModifierKey = (typeof modifierKeys)[number];

export type Player = (HTMLElement & youtube.Player) | null;
