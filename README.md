# タスク管理アプリ

React で構築したシングルページの Todo アプリです。

## 機能

| 機能 | 説明 |
|------|------|
| タスク追加 | テキスト入力 → 「追加」ボタンまたは Enter キー |
| タスク完了 | チェックボックスをクリックして完了/未完了を切り替え |
| タスク編集 | 編集ボタン（✎）またはテキストのダブルクリック。Enter で保存、Escape でキャンセル |
| タスク削除 | 削除ボタン（✕）をクリック |
| 並び替え | ドラッグハンドル（⠿）をドラッグして順序を変更 |
| フィルター | すべて / 未完了 / 完了済み で表示切替 |
| 完了済み一括削除 | 「完了済みを削除」ボタンで完了タスクをまとめて削除 |
| データ永続化 | `localStorage` に自動保存。ページをリロードしてもデータが保持される |
| 進捗バー | 完了数 / 全体数をバーで可視化 |

## 技術スタック

- **React 18** — UI ライブラリ
- **Vite 4** — ビルドツール
- **@dnd-kit** — ドラッグ&ドロップ並び替え
- **CSS Modules** — スコープ付きスタイリング
- データベース不使用（`localStorage` のみ）

## UI/UX の工夫

- ライト / ダークモード自動切替（`prefers-color-scheme` 対応）
- レスポンシブデザイン（モバイル〜デスクトップ対応）
- アクションボタンはホバー時に表示（視覚的なノイズを低減）
- `aria-*` 属性によるアクセシビリティ対応
- キーボードでのドラッグ操作をサポート
- 進捗バーのトランジションアニメーション
- Core Web Vitals を意識した軽量な実装（JS 約 194 KB）

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開いてください。

## ビルド

```bash
npm run build
```

`dist/` フォルダに成果物が出力されます。

## ファイル構成

```
src/
├── hooks/
│   └── useLocalStorage.js   # localStorage を使ったカスタムフック
├── components/
│   ├── TodoItem.jsx          # 個別タスクコンポーネント
│   ├── TodoItem.module.css
│   ├── AddTodoForm.jsx       # タスク追加フォーム
│   ├── AddTodoForm.module.css
│   ├── FilterBar.jsx         # フィルター切り替えバー
│   └── FilterBar.module.css
├── App.jsx                   # メインコンポーネント
├── App.module.css
└── index.css                 # グローバルスタイル・デザイントークン
```
# Claude-TodoList
