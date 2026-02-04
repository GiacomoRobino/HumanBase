import './SortSelector.css';

interface SortSelectorProps {
  value: string;
  onChange: (sort: string) => void;
}

const sortOptions = [
  { label: 'Date', value: 'new' },
  { label: 'Votes', value: 'top' },
  { label: 'Random', value: 'random' },
];

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <div className="sort-selector">
      <span className="sort-selector-label">Sort by:</span>
      {sortOptions.map((option) => (
        <button
          key={option.value}
          className={`sort-selector-btn ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
