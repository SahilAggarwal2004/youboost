import { HeaderProps } from "../types/global";

export default function Header({ text }: HeaderProps) {
  return (
    <div className="flex items-center justify-center pb-2">
      <div className="w-full border-t border-white"></div>
      <span className="px-2 text-center">{text}</span>
      <div className="w-full border-t border-white"></div>
    </div>
  );
}
