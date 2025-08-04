# 技術スタック

## コア技術

- **React 19.1.0** - 最新機能を備えた UI ライブラリ
- **TypeScript 5.8.3** - 厳格な設定による型安全な JavaScript
- **Vite 7.0.4** - 高速ビルドツールと開発サーバー
- **SWC** - @vitejs/plugin-react-swc 経由の高速 TypeScript/JSX コンパイラ

## 開発ツール

- **ESLint 9.30.1** - TypeScript と React ルールによるコードリンティング
- **Bun** - パッケージマネージャー（bun.lock が存在）

## TypeScript 設定

- ターゲット: ES2022
- 厳格モード有効
- JSX: react-jsx（新しい JSX 変換）
- モジュール解決: bundler モード
- 出力なし（Vite がコンパイルを処理）

## よく使うコマンド

### 開発

```bash
bun dev          # HMR付き開発サーバーを起動
bun build        # 本番用ビルド（TypeScriptチェック + Viteビルド）
bun preview      # 本番ビルドをローカルでプレビュー
bun lint         # 全ファイルでESLintを実行
```

### パッケージ管理

```bash
bun install      # 依存関係をインストール
bun add <pkg>    # 新しい依存関係を追加
bun add -d <pkg> # 開発依存関係を追加
```

## コード品質

- TypeScript、React Hooks、React Refresh ルールで設定された ESLint
- 未使用変数検出付きの厳格な TypeScript 設定
- StrictMode 有効の React 19
