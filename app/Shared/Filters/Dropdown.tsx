type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  name: string;
  label?: string;
  defaultValue?: string;
  options: DropdownOption[];
  placeholder?: string;
};

export default function Dropdown({
  name,
  label,
  defaultValue = "",
  options,
  placeholder = "All",
}: DropdownProps) {
  return (
    <label className="grid gap-1 text-sm text-[#4b2f22]">
      {label ? <span className="font-medium text-[#4b2f22]">{label}</span> : null}
      <select
        name={name}
        defaultValue={defaultValue}
        className="coffee-focus rounded-2xl border border-[#d8bf9f] bg-white/80 px-3 py-2 text-sm text-[#2c1810]"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
