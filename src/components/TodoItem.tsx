import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '../types';
import styles from './TodoItem.module.css';

interface Props {
  todo: Todo;
  onToggle: (id: string, checkboxRect?: DOMRect) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

/**
 * 個別の Todo アイテムコンポーネント
 */
export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleEditStart = () => {
    setEditText(todo.text);
    setIsEditing(true);
  };

  const handleEditSave = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleEditSave();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`${styles.item} ${todo.completed ? styles.completed : ''} ${isDragging ? styles.dragging : ''}`}
    >
      {/* ドラッグハンドル */}
      <button
        className={styles.dragHandle}
        {...attributes}
        {...listeners}
        aria-label="並び替え"
        tabIndex={0}
      >
        <span className={styles.dragIcon}>⠿</span>
      </button>

      {/* チェックボックス */}
      <button
        className={styles.checkbox}
        onClick={(e) => onToggle(todo.id, e.currentTarget.getBoundingClientRect())}
        aria-label={todo.completed ? 'タスクを未完了にする' : 'タスクを完了にする'}
        aria-pressed={todo.completed}
      >
        {todo.completed && <span className={styles.checkmark}>✓</span>}
      </button>

      {/* テキスト（編集モード切替） */}
      {isEditing ? (
        <input
          ref={inputRef}
          className={styles.editInput}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEditSave}
          onKeyDown={handleKeyDown}
          maxLength={200}
          aria-label="タスクを編集"
        />
      ) : (
        <span
          className={styles.text}
          onDoubleClick={handleEditStart}
          title="ダブルクリックで編集"
        >
          {todo.text}
        </span>
      )}

      {/* アクションボタン */}
      <div className={styles.actions}>
        {!isEditing && (
          <button
            className={styles.editBtn}
            onClick={handleEditStart}
            aria-label="タスクを編集"
          >
            ✎
          </button>
        )}
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(todo.id)}
          aria-label="タスクを削除"
        >
          ✕
        </button>
      </div>
    </li>
  );
}
