# 設計文書

## 概要

Web タイマーアプリケーションは React 19 と TypeScript を使用したシングルページアプリケーションです。ユーザーが時間を設定し、カウントダウンを実行できる直感的なインターフェースを提供します。モダンな React パターンとフックを活用し、型安全性とパフォーマンスを重視した設計となっています。

## アーキテクチャ

### 全体構成

```
src/
├── components/
│   ├── Timer/
│   │   ├── Timer.tsx          # メインタイマーコンポーネント
│   │   ├── Timer.module.css   # タイマー専用スタイル
│   │   └── index.ts           # エクスポート
│   ├── TimeInput/
│   │   ├── TimeInput.tsx      # 時間入力コンポーネント
│   │   ├── TimeInput.module.css
│   │   └── index.ts
│   └── TimerDisplay/
│       ├── TimerDisplay.tsx   # 時間表示コンポーネント
│       ├── TimerDisplay.module.css
│       └── index.ts
├── hooks/
│   └── useTimer.ts            # タイマーロジックカスタムフック
├── types/
│   └── timer.ts               # タイマー関連の型定義
├── utils/
│   └── timeFormatter.ts       # 時間フォーマット関数
└── assets/
    └── sounds/
        └── alarm.mp3          # アラート音声ファイル
```

### 設計原則

- **単一責任の原則**: 各コンポーネントは特定の機能に集中
- **関心の分離**: UI ロジックとビジネスロジックを分離
- **再利用性**: 汎用的なコンポーネント設計
- **型安全性**: 厳格な TypeScript 型定義

## コンポーネントとインターフェース

### Timer コンポーネント

メインのタイマーコンポーネントで、全体の状態管理と子コンポーネントの統合を担当します。

```typescript
interface TimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
  onComplete?: () => void;
}

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isCompleted: boolean;
  totalSeconds: number;
  remainingSeconds: number;
}
```

### TimeInput コンポーネント

時間入力フィールドを提供し、バリデーション機能を含みます。

```typescript
interface TimeInputProps {
  minutes: number;
  seconds: number;
  onMinutesChange: (minutes: number) => void;
  onSecondsChange: (seconds: number) => void;
  disabled: boolean;
}
```

### TimerDisplay コンポーネント

残り時間の表示と視覚的フィードバックを提供します。

```typescript
interface TimerDisplayProps {
  remainingSeconds: number;
  isRunning: boolean;
  isCompleted: boolean;
  isWarning: boolean; // 10秒以下の場合
}
```

### useTimer カスタムフック

タイマーのビジネスロジックを管理するカスタムフックです。

```typescript
interface UseTimerReturn {
  state: TimerState;
  actions: {
    start: () => void;
    pause: () => void;
    reset: () => void;
    setTime: (minutes: number, seconds: number) => void;
  };
}
```

## データモデル

### TimerState 型

```typescript
interface TimerState {
  minutes: number; // 設定分数 (0-59)
  seconds: number; // 設定秒数 (0-59)
  isRunning: boolean; // 実行中フラグ
  isCompleted: boolean; // 完了フラグ
  totalSeconds: number; // 総秒数
  remainingSeconds: number; // 残り秒数
}
```

### TimerAction 型

```typescript
type TimerAction =
  | { type: "SET_TIME"; payload: { minutes: number; seconds: number } }
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET" }
  | { type: "TICK" }
  | { type: "COMPLETE" };
```

## エラーハンドリング

### 入力バリデーション

- **範囲チェック**: 分・秒は 0-59 の範囲内
- **型チェック**: 数値以外の入力を拒否
- **境界値処理**: 空文字は 0 として扱う

### タイマー実行エラー

- **setInterval 失敗**: フォールバック機能を提供
- **音声再生失敗**: サイレントフォールバック
- **通知許可拒否**: 視覚的通知のみ表示

### エラー表示

```typescript
interface ErrorState {
  hasError: boolean;
  message: string;
  type: "validation" | "runtime" | "permission";
}
```

## テスト戦略

### 単体テスト

- **useTimer フック**: タイマーロジックの全パターンをテスト
- **コンポーネント**: React Testing Library を使用したレンダリングテスト
- **ユーティリティ関数**: 時間フォーマット関数のテスト

### 統合テスト

- **ユーザーフロー**: 設定 → 開始 → 停止 → リセットの完全フロー
- **エラーハンドリング**: 無効入力時の動作確認
- **通知機能**: 音声・ブラウザ通知の動作確認

### E2E テスト

- **クロスブラウザ**: Chrome、Firefox、Safari での動作確認
- **レスポンシブ**: デスクトップ・モバイルでの表示確認
- **アクセシビリティ**: キーボードナビゲーションとスクリーンリーダー対応

## パフォーマンス最適化

### レンダリング最適化

- **React.memo**: 不要な再レンダリングを防止
- **useCallback**: イベントハンドラーのメモ化
- **useMemo**: 計算結果のキャッシュ

### タイマー精度

- **高精度タイマー**: performance.now()を使用した正確な時間計測
- **ブラウザタブ非アクティブ対応**: Page Visibility API を使用

### バンドルサイズ

- **Tree Shaking**: 未使用コードの除去
- **音声ファイル**: 軽量な MP3 形式を使用
- **CSS 最適化**: CSS Modules によるスコープ化
