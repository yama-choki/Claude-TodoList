/** Todo アイテムの型定義 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

/** フィルターの種類 */
export type FilterType = 'all' | 'active' | 'completed';
