import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../useTimer';

// タイマーをモック化
vi.useFakeTimers();

describe('useTimer', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  describe('初期状態', () => {
    it('デフォルトの初期状態を持つ', () => {
      const { result } = renderHook(() => useTimer());
      
      expect(result.current.state).toEqual({
        minutes: 0,
        seconds: 0,
        isRunning: false,
        isCompleted: false,
        totalSeconds: 0,
        remainingSeconds: 0,
      });
    });

    it('初期値を設定できる', () => {
      const { result } = renderHook(() => useTimer(5, 30));
      
      expect(result.current.state).toEqual({
        minutes: 5,
        seconds: 30,
        isRunning: false,
        isCompleted: false,
        totalSeconds: 330,
        remainingSeconds: 330,
      });
    });
  });

  describe('setTime アクション', () => {
    it('時間を設定できる', () => {
      const { result } = renderHook(() => useTimer());
      
      act(() => {
        result.current.actions.setTime(2, 45);
      });
      
      expect(result.current.state.minutes).toBe(2);
      expect(result.current.state.seconds).toBe(45);
      expect(result.current.state.totalSeconds).toBe(165);
      expect(result.current.state.remainingSeconds).toBe(165);
      expect(result.current.state.isCompleted).toBe(false);
    });
  });

  describe('start アクション', () => {
    it('時間が設定されている場合にタイマーを開始できる', () => {
      const { result } = renderHook(() => useTimer(1, 0));
      
      act(() => {
        result.current.actions.start();
      });
      
      expect(result.current.state.isRunning).toBe(true);
      expect(result.current.state.isCompleted).toBe(false);
    });

    it('時間が設定されていない場合は開始しない', () => {
      const { result } = renderHook(() => useTimer());
      
      act(() => {
        result.current.actions.start();
      });
      
      expect(result.current.state.isRunning).toBe(false);
    });
  });

  describe('pause アクション', () => {
    it('実行中のタイマーを一時停止できる', () => {
      const { result } = renderHook(() => useTimer(1, 0));
      
      act(() => {
        result.current.actions.start();
      });
      
      expect(result.current.state.isRunning).toBe(true);
      
      act(() => {
        result.current.actions.pause();
      });
      
      expect(result.current.state.isRunning).toBe(false);
    });
  });

  describe('reset アクション', () => {
    it('タイマーを初期状態にリセットできる', () => {
      const { result } = renderHook(() => useTimer(2, 30));
      
      // タイマーを開始して少し進める
      act(() => {
        result.current.actions.start();
      });
      
      act(() => {
        result.current._internal?.tick();
      });
      
      expect(result.current.state.remainingSeconds).toBe(149);
      
      // リセット
      act(() => {
        result.current.actions.reset();
      });
      
      expect(result.current.state.isRunning).toBe(false);
      expect(result.current.state.isCompleted).toBe(false);
      expect(result.current.state.remainingSeconds).toBe(150);
    });
  });

  describe('tick アクション', () => {
    it('残り時間を1秒減らす', () => {
      const { result } = renderHook(() => useTimer(0, 10));
      
      act(() => {
        result.current.actions.start();
      });
      
      act(() => {
        result.current._internal?.tick();
      });
      
      expect(result.current.state.remainingSeconds).toBe(9);
    });

    it('残り時間が0になったら完了状態になる', () => {
      const { result } = renderHook(() => useTimer(0, 1));
      
      act(() => {
        result.current.actions.start();
      });
      
      act(() => {
        result.current._internal?.tick();
      });
      
      expect(result.current.state.remainingSeconds).toBe(0);
      expect(result.current.state.isRunning).toBe(false);
      expect(result.current.state.isCompleted).toBe(true);
    });

    it('残り時間が負の値にならない', () => {
      const { result } = renderHook(() => useTimer(0, 0));
      
      act(() => {
        result.current._internal?.tick();
      });
      
      expect(result.current.state.remainingSeconds).toBe(0);
    });
  });

  describe('complete アクション', () => {
    it('タイマーを完了状態にする', () => {
      const { result } = renderHook(() => useTimer(1, 0));
      
      act(() => {
        result.current.actions.start();
      });
      
      act(() => {
        result.current._internal?.complete();
      });
      
      expect(result.current.state.isRunning).toBe(false);
      expect(result.current.state.isCompleted).toBe(true);
      expect(result.current.state.remainingSeconds).toBe(0);
    });
  });

  describe('onComplete コールバック', () => {
    it('タイマー完了時にコールバックが呼ばれる', () => {
      const onComplete = vi.fn();
      const { result } = renderHook(() => useTimer(0, 1, onComplete));
      
      act(() => {
        result.current.actions.start();
      });
      
      act(() => {
        result.current._internal?.tick();
      });
      
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('自動カウントダウン', () => {
    it('開始後に自動的にカウントダウンする', () => {
      const { result } = renderHook(() => useTimer(0, 3));
      
      act(() => {
        result.current.actions.start();
      });
      
      expect(result.current.state.isRunning).toBe(true);
      expect(result.current.state.remainingSeconds).toBe(3);
      
      // 1秒経過
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      expect(result.current.state.remainingSeconds).toBe(2);
      
      // さらに2秒経過
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      expect(result.current.state.remainingSeconds).toBe(0);
      expect(result.current.state.isRunning).toBe(false);
      expect(result.current.state.isCompleted).toBe(true);
    });

    it('一時停止後に再開できる', () => {
      const { result } = renderHook(() => useTimer(0, 5));
      
      act(() => {
        result.current.actions.start();
      });
      
      // 2秒経過
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      expect(result.current.state.remainingSeconds).toBe(3);
      
      // 一時停止
      act(() => {
        result.current.actions.pause();
      });
      
      expect(result.current.state.isRunning).toBe(false);
      
      // 再開
      act(() => {
        result.current.actions.start();
      });
      
      expect(result.current.state.isRunning).toBe(true);
      
      // さらに3秒経過
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      expect(result.current.state.remainingSeconds).toBe(0);
      expect(result.current.state.isCompleted).toBe(true);
    });
  });
});