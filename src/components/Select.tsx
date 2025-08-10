import ReactSelect from "react-select";
import { SelectProps } from "../types/global";

export default function Select<T>({ text, options, value, label, onChange }: SelectProps<T>) {
  return (
    <>
      <span className="text-sm">{text}</span>
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
            minHeight: "32px",
            height: "32px",
            ":hover": { border: "none", outline: isFocused ? "1.5px solid red" : "none" },
          }),
          valueContainer: (base) => ({
            ...base,
            height: "32px",
            padding: "0 6px",
          }),
          input: (base) => ({
            ...base,
            margin: "0px",
          }),
          indicatorsContainer: (base) => ({
            ...base,
            height: "32px",
          }),
          menu: (base) => ({ ...base, border: "1px solid white", borderRadius: "5px" }),
          menuList: (base) => ({ ...base, backgroundColor: "black", borderRadius: "5px" }),
          option: (base, { isSelected, isFocused }) => ({
            ...base,
            backgroundColor: isSelected ? "red" : isFocused ? "rgba(255,0,0,0.6)" : "black",
            minHeight: "28px",
          }),
        }}
      />
    </>
  );
}
