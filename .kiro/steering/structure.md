# プロジェクト構造

## ルートディレクトリ

```
├── src/                 # ソースコード
├── public/              # Viteが提供する静的アセット
├── node_modules/        # 依存関係
├── .kiro/              # Kiro AIアシスタント設定
├── .git/               # Gitリポジトリ
├── index.html          # メインHTMLテンプレート
├── package.json        # プロジェクト設定と依存関係
├── bun.lock           # Bunロックファイル
├── vite.config.ts     # Vite設定
├── eslint.config.js   # ESLint設定
├── tsconfig.json      # TypeScriptプロジェクト参照
├── tsconfig.app.json  # アプリ固有のTypeScript設定
├── tsconfig.node.json # Node固有のTypeScript設定
└── README.md          # プロジェクトドキュメント
```

## ソースディレクトリ（`src/`）

```
src/
├── App.tsx            # メインアプリケーションコンポーネント
├── App.css           # アプリ固有のスタイル
├── main.tsx          # アプリケーションエントリーポイント
├── index.css         # グローバルスタイル
├── vite-env.d.ts     # Vite型定義
└── assets/           # 静的アセット（画像、アイコン）
    └── react.svg     # Reactロゴ
```

## ファイル命名規則

- **コンポーネント**: PascalCase で`.tsx`拡張子（例：`App.tsx`）
- **スタイル**: コンポーネントと同名で`.css`拡張子（例：`App.css`）
- **エントリーポイント**: 小文字で`.tsx`拡張子（例：`main.tsx`）
- **型定義**: kebab-case で`.d.ts`拡張子（例：`vite-env.d.ts`）

## インポート規則

- ローカルファイルには相対インポートを使用（例：`'./App.tsx'`）
- public ディレクトリからは絶対インポートを使用（例：`'/vite.svg'`）
- CSS インポートはコンポーネントインポートの後に記述
- アセットは適切な型付きで ES モジュールとしてインポート

## アーキテクチャパターン

- シングルページアプリケーション（SPA）構造
- React 関数コンポーネントによるコンポーネントベースアーキテクチャ
- コンポーネントごとの CSS モジュールまたは併置スタイル
- 適切な型定義による厳格な TypeScript
- モダンな React パターン（フック、関数コンポーネント、StrictMode）
