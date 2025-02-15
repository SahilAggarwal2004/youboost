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

// script.ts
type Player = (HTMLElement & youtube.Player) | null;

type Key = "Control" | "<" | ">" | "," | "." | "Alt" | "ArrowLeft" | "ArrowRight" | number;
