import { useReducer, useCallback, useEffect, useRef } from 'react';
import { TimerState, TimerAction, UseTimerReturn } from '../types/timer';
import { calculateTotalSeconds } from '../utils/timeFormatter';

// 初期状態
const initialState: TimerState = {
  minutes: 0,
  seconds: 0,
  isRunning: false,
  isCompleted: false,
  totalSeconds: 0,
  remainingSeconds: 0,
};

// リデューサー関数
const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'SET_TIME': {
      const { minutes, seconds } = action.payload;
      const totalSeconds = calculateTotalSeconds(minutes, seconds);
      
      return {
        ...state,
        minutes,
        seconds,
        totalSeconds,
        remainingSeconds: totalSeconds,
        isCompleted: false,
      };
    }
    
    case 'START': {
      // 時間が設定されていない場合は開始しない
      if (state.totalSeconds === 0) {
        return state;
      }
      
      return {
        ...state,
        isRunning: true,
        isCompleted: false,
      };
    }
    
    case 'PAUSE': {
      return {
        ...state,
        isRunning: false,
      };
    }
    
    case 'RESET': {
      return {
        ...state,
        isRunning: false,
        isCompleted: false,
        remainingSeconds: state.totalSeconds,
      };
    }
    
    case 'TICK': {
      const newRemainingSeconds = Math.max(0, state.remainingSeconds - 1);
      
      return {
        ...state,
        remainingSeconds: newRemainingSeconds,
        // 時間が0になった場合は完了状態にする
        isRunning: newRemainingSeconds > 0 ? state.isRunning : false,
        isCompleted: newRemainingSeconds === 0 ? true : state.isCompleted,
      };
    }
    
    case 'COMPLETE': {
      return {
        ...state,
        isRunning: false,
        isCompleted: true,
        remainingSeconds: 0,
      };
    }
    
    default:
      return state;
  }
};

/**
 * タイマーのカスタムフック
 * @param initialMinutes 初期分数
 * @param initialSeconds 初期秒数
 * @param onComplete 完了時のコールバック
 * @returns タイマーの状態とアクション
 */
export const useTimer = (
  initialMinutes: number = 0,
  initialSeconds: number = 0,
  onComplete?: () => void
): UseTimerReturn => {
  const [state, dispatch] = useReducer(timerReducer, {
    ...initialState,
    minutes: initialMinutes,
    seconds: initialSeconds,
    totalSeconds: calculateTotalSeconds(initialMinutes, initialSeconds),
    remainingSeconds: calculateTotalSeconds(initialMinutes, initialSeconds),
  });

  // タイマーのインターバルIDを保持
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // 高精度時間計測用
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // 内部で使用するアクション
  const tick = useCallback(() => {
    dispatch({ type: 'TICK' });
  }, []);

  const complete = useCallback(() => {
    dispatch({ type: 'COMPLETE' });
    onComplete?.();
  }, [onComplete]);

  // タイマーの開始/停止を管理するエフェクト
  useEffect(() => {
    if (state.isRunning && state.remainingSeconds > 0) {
      // タイマー開始時の時刻を記録
      if (startTimeRef.current === 0) {
        startTimeRef.current = performance.now();
        pausedTimeRef.current = 0;
      } else {
        // 一時停止から再開の場合、一時停止時間を調整
        const pausedDuration = performance.now() - pausedTimeRef.current;
        startTimeRef.current += pausedDuration;
      }

      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      // タイマー停止
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // 一時停止時の時刻を記録
      if (!state.isRunning && state.remainingSeconds > 0 && !state.isCompleted) {
        pausedTimeRef.current = performance.now();
      }
    }

    // クリーンアップ
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isRunning, state.remainingSeconds, state.isCompleted, tick]);

  // タイマー完了時の処理
  useEffect(() => {
    if (state.isCompleted && state.remainingSeconds === 0) {
      // タイマーをリセット
      startTimeRef.current = 0;
      pausedTimeRef.current = 0;
      
      // 完了コールバックを呼び出し
      onComplete?.();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [state.isCompleted, state.remainingSeconds, onComplete]);

  // アクション関数
  const start = useCallback(() => {
    dispatch({ type: 'START' });
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    // タイマー関連の参照をリセット
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setTime = useCallback((minutes: number, seconds: number) => {
    dispatch({ type: 'SET_TIME', payload: { minutes, seconds } });
    // 時間設定時にタイマー関連の参照をリセット
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
  }, []);

  return {
    state,
    actions: {
      start,
      pause,
      reset,
      setTime,
    },
    // 内部アクション（テスト用に公開）
    _internal: {
      tick,
      complete,
    },
  };
};