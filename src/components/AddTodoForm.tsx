import { useState, FormEvent } from 'react';
import styles from './AddTodoForm.module.css';

interface Props {
  onAdd: (text: string) => void;
}

/**
 * 新しい Todo を追加するフォームコンポーネント
 */
export function AddTodoForm({ onAdd }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しいタスクを入力..."
        maxLength={200}
        aria-label="新しいタスク"
      />
      <button
        className={styles.addBtn}
        type="submit"
        disabled={!text.trim()}
        aria-label="タスクを追加"
      >
        追加
      </button>
    </form>
  );
}
