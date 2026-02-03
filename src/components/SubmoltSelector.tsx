import { useSubmolts } from '../hooks/useSubmolts';
import { Select } from './common/Select';
import { Input } from './common/Input';
import './SubmoltSelector.css';

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
    <div className="submolt-selector">
      <Select
        label="Community"
        options={options}
        value={options.some(opt => opt.value === value) ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isLoading ? 'Loading communities...' : 'Select a community'}
        disabled={isLoading}
      />
      <span className="submolt-selector-or">or</span>
      <Input
        label="Custom submolt"
        placeholder="Enter submolt name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
