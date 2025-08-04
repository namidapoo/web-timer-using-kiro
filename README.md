# Web タイマー

React 19 と TypeScript で構築されたモダンな Web タイマーアプリケーションです。直感的なユーザーインターフェースと豊富な機能を提供します。

![Web Timer Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=Web+Timer+App)

## ✨ 機能

### 🕐 タイマー機能

- **時間設定**: 分と秒を指定してタイマーを設定
- **制御**: 開始・停止・リセット機能
- **高精度**: `performance.now()` を使用した正確なカウントダウン

### 🎨 ユーザーインターフェース

- **リアルタイム表示**: MM:SS 形式での残り時間表示
- **状態表示**: 実行中、警告（10 秒以下）、完了状態の視覚的フィードバック
- **滑らかなアニメーション**: CSS アニメーションによる美しい表示

### 🔔 通知機能

- **音声アラート**: Web Audio API による自動生成ビープ音
- **ブラウザ通知**: Notification API によるデスクトップ通知
- **視覚的通知**: 完了メッセージとアニメーション

### ♿ アクセシビリティ

- **ARIA 対応**: スクリーンリーダー完全対応
- **キーボードナビゲーション**: Tab キーによる操作
- **ハイコントラストモード**: 視覚障害者向け表示
- **動きを減らす設定**: `prefers-reduced-motion` 対応

### 📱 レスポンシブデザイン

- **デスクトップ**: 大画面での快適な操作
- **タブレット**: 中画面での最適化されたレイアウト
- **モバイル**: タッチフレンドリーなインターフェース
- **ダークモード**: システム設定に応じた自動切り替え

## 🚀 クイックスタート

### 前提条件

- Node.js 18+ または Bun
- モダンな Web ブラウザ（Chrome, Firefox, Safari, Edge）

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/web-timer-using-kiro.git
cd web-timer-using-kiro

# 依存関係をインストール
bun install
# または
npm install
```

### 開発サーバーの起動

```bash
# 開発サーバーを起動
bun dev
# または
npm run dev
```

ブラウザで `http://localhost:5173` を開いてアプリケーションにアクセスできます。

### ビルド

```bash
# 本番用ビルド
bun build
# または
npm run build
```

### テスト

```bash
# 全テストを実行
bun test
# または
npm test

# テストを監視モードで実行
bun test:watch
# または
npm run test:watch
```

## 🏗️ 技術スタック

### コア技術

- **React 19.1.0** - 最新機能を備えた UI ライブラリ
- **TypeScript 5.8.3** - 型安全な JavaScript
- **Vite 7.0.4** - 高速ビルドツールと開発サーバー

### 開発ツール

- **Vitest** - 高速テストフレームワーク
- **React Testing Library** - コンポーネントテスト
- **ESLint** - コードリンティング
- **CSS Modules** - スコープ化されたスタイリング

### Web API

- **Web Audio API** - プログラム的音声生成
- **Notification API** - ブラウザ通知
- **Page Visibility API** - タブの状態管理

## 📁 プロジェクト構造

```
src/
├── components/           # Reactコンポーネント
│   ├── Timer/           # メインタイマーコンポーネント
│   ├── TimeInput/       # 時間入力コンポーネント
│   └── TimerDisplay/    # 時間表示コンポーネント
├── hooks/               # カスタムフック
│   └── useTimer.ts      # タイマーロジック
├── types/               # TypeScript型定義
│   └── timer.ts         # タイマー関連の型
├── utils/               # ユーティリティ関数
│   ├── audioAlert.ts    # 音声アラート機能
│   ├── browserNotification.ts # ブラウザ通知機能
│   ├── timeFormatter.ts # 時間フォーマット関数
│   └── timerNotifications.ts # 通知統合
└── __tests__/           # 統合テスト
```

## 🧪 テスト

このプロジェクトは包括的なテストカバレッジを提供しています：

- **単体テスト**: 各コンポーネントとユーティリティ関数
- **統合テスト**: アプリケーション全体のフロー
- **アクセシビリティテスト**: ARIA 属性とキーボードナビゲーション

```bash
# テスト統計
✅ 78 テスト全て通過
📊 5 テストファイル
🎯 100% 機能カバレッジ
```

## 🎯 使用方法

### 基本的な使い方

1. **時間設定**: 分と秒の入力フィールドに希望の時間を入力
2. **開始**: 「開始」ボタンをクリックしてタイマーを開始
3. **制御**: 実行中は「停止」ボタンで一時停止、「リセット」ボタンで初期化
4. **完了**: タイマー終了時に音声アラートとブラウザ通知を受信

### キーボードショートカット

- `Tab`: 次の要素にフォーカス移動
- `Shift + Tab`: 前の要素にフォーカス移動
- `Enter` / `Space`: ボタンの実行
- `数字キー`: 入力フィールドでの数値入力

### 通知設定

初回使用時にブラウザから通知の許可を求められます。より良い体験のために許可することをお勧めします。

## 🔧 カスタマイズ

### 通知設定の変更

`src/utils/timerNotifications.ts` で通知設定をカスタマイズできます：

```typescript
export const defaultNotificationSettings: NotificationSettings = {
  enableAudio: true, // 音声アラート
  enableBrowserNotification: true, // ブラウザ通知
  enableVisualNotification: true, // 視覚的通知
};
```

### スタイルのカスタマイズ

各コンポーネントの CSS Modules ファイルを編集してスタイルをカスタマイズできます：

- `src/components/Timer/Timer.module.css` - メインレイアウト
- `src/components/TimerDisplay/TimerDisplay.module.css` - タイマー表示
- `src/components/TimeInput/TimeInput.module.css` - 入力フィールド

## 🌐 ブラウザサポート

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### 必要な Web API

- Web Audio API（音声アラート用）
- Notification API（ブラウザ通知用）
- CSS Grid & Flexbox（レイアウト用）

## 🤝 コントリビューション

コントリビューションを歓迎します！以下の手順でご参加ください：

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発ガイドライン

- TypeScript の型安全性を維持
- 新機能にはテストを追加
- アクセシビリティ基準を遵守
- レスポンシブデザインを考慮

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## 🙏 謝辞

- [React](https://react.dev/) - UI ライブラリ
- [Vite](https://vitejs.dev/) - ビルドツール
- [Vitest](https://vitest.dev/) - テストフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型システム

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/namidapoo/web-timer-using-kiro/issues) でお知らせください。

---

**Web タイマー** - シンプルで美しく、アクセシブルなタイマーアプリケーション 🕐✨
