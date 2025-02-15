import ReactSelect from "react-select";
import { SelectProps } from "../types/global";

export default function Select<T>({ text, options, value, label, onChange }: SelectProps<T>) {
  return (
    <>
      <span>{text}</span>
      <ReactSelect
        options={options}
        value={{ value, label }}
        onChange={onChange}
        isSearchable={false}
        menuPlacement="top"
        maxMenuHeight={150}
        styles={{
          control: (base, { isFocused }) => ({
            ...base,
            border: "none",
            outline: isFocused ? "1.5px solid red" : "none",
            ":hover": { border: "none", outline: isFocused ? "1.5px solid red" : "none" },
          }),
          menu: (base) => ({ ...base, border: "1px solid white", borderRadius: "5px" }),
          menuList: (base) => ({ ...base, backgroundColor: "black", borderRadius: "5px" }),
          option: (base, { isSelected, isFocused }) => ({ ...base, backgroundColor: isSelected ? "red" : isFocused ? "rgba(255,0,0,0.6)" : "black" }),
        }}
      />
    </>
  );
}
