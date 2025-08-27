import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from "@mui/material";

interface SimpleMultiSelectProps {
  label: string;
  options: { id: number; name: string }[];
  value: number[];
  onChange: (ids: number[]) => void;
}

export const SimpleMultiSelect: React.FC<SimpleMultiSelectProps> = ({ label, options, value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(e) => onChange(e.target.value as number[])}
        input={<OutlinedInput label={label} />}
      >
        {options.map((opt) => (
          <MenuItem key={opt.id} value={opt.id}>
            {opt.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
