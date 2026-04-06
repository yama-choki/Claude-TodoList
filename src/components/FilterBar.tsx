import { FilterType } from '../types';
import styles from './FilterBar.module.css';

interface Props {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  total: number;
  completed: number;
}

interface FilterOption {
  value: FilterType;
  label: string;
}

/**
 * フィルター切り替えバーとタスク統計コンポーネント
 */
export function FilterBar({ filter, onFilterChange, total, completed }: Props) {
  const FILTERS: FilterOption[] = [
    { value: 'all', label: 'すべて' },
    { value: 'active', label: '未完了' },
    { value: 'completed', label: '完了済み' },
  ];

  return (
    <div className={styles.bar}>
      <span className={styles.stats}>
        {completed}/{total} 完了
      </span>
      <div className={styles.filters} role="group" aria-label="フィルター">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`${styles.filterBtn} ${filter === f.value ? styles.active : ''}`}
            onClick={() => onFilterChange(f.value)}
            aria-pressed={filter === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
