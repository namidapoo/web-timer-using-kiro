// タイマーの状態を表すインターフェース
export interface TimerState {
  minutes: number;           // 設定分数 (0-59)
  seconds: number;           // 設定秒数 (0-59)
  isRunning: boolean;        // 実行中フラグ
  isCompleted: boolean;      // 完了フラグ
  totalSeconds: number;      // 総秒数
  remainingSeconds: number;  // 残り秒数
}

// タイマーのアクション型
export type TimerAction = 
  | { type: 'SET_TIME'; payload: { minutes: number; seconds: number } }
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'COMPLETE' };

// useTimerフックの戻り値型
export interface UseTimerReturn {
  state: TimerState;
  actions: {
    start: () => void;
    pause: () => void;
    reset: () => void;
    setTime: (minutes: number, seconds: number) => void;
  };
  // テスト用の内部アクション
  _internal?: {
    tick: () => void;
    complete: () => void;
  };
}

// useTimerフックのオプション型
export interface UseTimerOptions {
  initialMinutes?: number;
  initialSeconds?: number;
  onComplete?: () => void;
}

// Timerコンポーネントのプロパティ型
export interface TimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
  onComplete?: () => void;
}

// TimeInputコンポーネントのプロパティ型
export interface TimeInputProps {
  minutes: number;
  seconds: number;
  onMinutesChange: (minutes: number) => void;
  onSecondsChange: (seconds: number) => void;
  disabled: boolean;
}

// TimerDisplayコンポーネントのプロパティ型
export interface TimerDisplayProps {
  remainingSeconds: number;
  isRunning: boolean;
  isCompleted: boolean;
  isWarning: boolean; // 10秒以下の場合
}

// エラー状態を表すインターフェース
export interface ErrorState {
  hasError: boolean;
  message: string;
  type: 'validation' | 'runtime' | 'permission';
}

// バリデーション結果型
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}