import { useState, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useConfetti } from './hooks/useConfetti';
import { TodoItem } from './components/TodoItem';
import { AddTodoForm } from './components/AddTodoForm';
import { FilterBar } from './components/FilterBar';
import { Todo, FilterType } from './types';
import styles from './App.module.css';

export default function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [filter, setFilter] = useState<FilterType>('all');
  const { fire: fireConfetti } = useConfetti();

  // ドラッグセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // フィルター適用済みの Todo リスト
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);

  // 統計
  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );

  // 進捗バーの割合
  const progress = todos.length === 0 ? 0 : (completedCount / todos.length) * 100;

  const handleAdd = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggle = (id: string, checkboxRect?: DOMRect) => {
    const target = todos.find((t) => t.id === id);
    if (target && !target.completed && checkboxRect) {
      // 未完了 → 完了 になるときだけ紙吹雪を発火
      const x = (checkboxRect.left + checkboxRect.width / 2) / window.innerWidth;
      const y = (checkboxRect.top + checkboxRect.height / 2) / window.innerHeight;
      fireConfetti(x, y);
    }
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEdit = (id: string, newText: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // フィルター中でも todos 全体の順序に反映させる
    setTodos((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  return (
    <div className={styles.page}>
      <main className={styles.card} role="main">
        {/* ヘッダー */}
        <header className={styles.header}>
          <h1 className={styles.title}>タスク管理</h1>
          {completedCount > 0 && (
            <button
              className={styles.clearBtn}
              onClick={handleClearCompleted}
              aria-label="完了済みタスクをすべて削除"
            >
              完了済みを削除
            </button>
          )}
        </header>

        {/* 進捗バー */}
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`進捗: ${Math.round(progress)}%`}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 入力フォーム */}
        <AddTodoForm onAdd={handleAdd} />

        {/* フィルターバー */}
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          total={todos.length}
          completed={completedCount}
        />

        {/* タスクリスト */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={filteredTodos.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className={styles.list} aria-label="タスクリスト">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        {/* 空状態 */}
        {filteredTodos.length === 0 && (
          <div className={styles.empty} aria-live="polite">
            {filter === 'all'
              ? 'タスクがありません。上のフォームから追加してください。'
              : filter === 'active'
              ? '未完了のタスクはありません。'
              : '完了済みのタスクはありません。'}
          </div>
        )}
      </main>
    </div>
  );
}
