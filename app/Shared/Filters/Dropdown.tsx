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
    <label className="grid gap-1 text-sm text-slate-600">
      {label ? <span className="font-medium text-slate-700">{label}</span> : null}
      <select
        name={name}
        defaultValue={defaultValue}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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
