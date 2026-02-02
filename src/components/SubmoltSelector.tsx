import { useSubmolts } from '../hooks/useSubmolts';
import { Select } from './common/Select';

interface SubmoltSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SubmoltSelector({ value, onChange }: SubmoltSelectorProps) {
  const { submolts, isLoading } = useSubmolts();

  const options = submolts.map((submolt) => ({
    value: submolt.name,
    label: submolt.name,
  }));

  return (
    <Select
      label="Community"
      options={options}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={isLoading ? 'Loading communities...' : 'Select a community'}
      disabled={isLoading}
    />
  );
}
