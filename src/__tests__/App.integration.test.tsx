import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Web Audio APIをモック化
const mockAudioContext = {
  createOscillator: vi.fn(() => ({
    type: 'sine',
    frequency: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null,
  })),
  createGain: vi.fn(() => ({
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  })),
  destination: {},
  currentTime: 0,
  close: vi.fn(() => Promise.resolve()),
};

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: vi.fn(() => mockAudioContext),
});

// Notification APIをモック化
const mockNotification = vi.fn();
Object.defineProperty(window, 'Notification', {
  writable: true,
  value: mockNotification,
});

Object.defineProperty(Notification, 'permission', {
  writable: true,
  value: 'granted',
});

Object.defineProperty(Notification, 'requestPermission', {
  writable: true,
  value: vi.fn(() => Promise.resolve('granted')),
});

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本的なレンダリング', () => {
    it('アプリケーションが正しくレンダリングされる', () => {
      render(<App />);

      // 基本要素の確認
      expect(screen.getByText('Webタイマー')).toBeInTheDocument();
      expect(screen.getByText('00:00')).toBeInTheDocument();
      expect(screen.getByLabelText('分を入力')).toBeInTheDocument();
      expect(screen.getByLabelText('秒を入力')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '開始' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'リセット' })).toBeInTheDocument();
    });

    it('時間設定が動作する', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // 時間を設定
      const minutesInput = screen.getByLabelText('分を入力');
      const secondsInput = screen.getByLabelText('秒を入力');
      
      await user.clear(minutesInput);
      await user.type(minutesInput, '5');
      await user.clear(secondsInput);
      await user.type(secondsInput, '30');

      // 設定された時間が表示されることを確認
      expect(screen.getByText('05:30')).toBeInTheDocument();
    });

    it('タイマーの開始・停止が動作する', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // 時間を設定
      const secondsInput = screen.getByLabelText('秒を入力');
      await user.clear(secondsInput);
      await user.type(secondsInput, '10');

      // タイマーを開始
      const startButton = screen.getByRole('button', { name: '開始' });
      await user.click(startButton);

      // 実行中状態の確認
      expect(screen.getByRole('button', { name: '停止' })).toBeInTheDocument();
      expect(screen.getByLabelText('分を入力')).toBeDisabled();
      expect(screen.getByLabelText('秒を入力')).toBeDisabled();

      // タイマーを停止
      const stopButton = screen.getByRole('button', { name: '停止' });
      await user.click(stopButton);

      // 停止状態の確認
      expect(screen.getByRole('button', { name: '開始' })).toBeInTheDocument();
      expect(screen.getByLabelText('分を入力')).toBeEnabled();
      expect(screen.getByLabelText('秒を入力')).toBeEnabled();
    });
  });

  describe('エラーハンドリング', () => {
    it('無効な入力値でもアプリケーションが動作する', () => {
      render(<App />);

      const minutesInput = screen.getByLabelText('分を入力');
      
      // 無効な値を直接設定
      fireEvent.change(minutesInput, { target: { value: '99' } });
      
      // エラーメッセージが表示される
      expect(screen.getByText('分は59以下の値を入力してください')).toBeInTheDocument();
      
      // アプリケーションは引き続き動作する
      expect(screen.getByText('Webタイマー')).toBeInTheDocument();
    });
  });

  describe('アクセシビリティ', () => {
    it('フォーカス可能な要素が存在する', () => {
      render(<App />);

      const minutesInput = screen.getByLabelText('分を入力');
      const secondsInput = screen.getByLabelText('秒を入力');
      const startButton = screen.getByRole('button', { name: '開始' });
      const resetButton = screen.getByRole('button', { name: 'リセット' });

      // 要素がフォーカス可能であることを確認
      expect(minutesInput).not.toHaveAttribute('tabindex', '-1');
      expect(secondsInput).not.toHaveAttribute('tabindex', '-1');
      expect(startButton).not.toHaveAttribute('tabindex', '-1');
      expect(resetButton).not.toHaveAttribute('tabindex', '-1');
    });

    it('適切なARIA属性が設定されている', () => {
      render(<App />);

      // タイマー表示
      const timerDisplay = screen.getByRole('timer');
      expect(timerDisplay).toHaveAttribute('aria-live', 'polite');
      expect(timerDisplay).toHaveAttribute('aria-label');

      // 入力フィールド
      const minutesInput = screen.getByLabelText('分を入力');
      const secondsInput = screen.getByLabelText('秒を入力');
      expect(minutesInput).toHaveAttribute('aria-label', '分を入力');
      expect(secondsInput).toHaveAttribute('aria-label', '秒を入力');

      // ボタン
      const startButton = screen.getByRole('button', { name: '開始' });
      const resetButton = screen.getByRole('button', { name: 'リセット' });
      expect(startButton).toHaveAttribute('aria-label', '開始');
      expect(resetButton).toHaveAttribute('aria-label', 'リセット');
    });
  });

  describe('レスポンシブ動作', () => {
    it('モバイルサイズでも正しく表示される', () => {
      // ビューポートサイズを変更
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });

      render(<App />);

      // 基本要素が表示されることを確認
      expect(screen.getByText('Webタイマー')).toBeInTheDocument();
      expect(screen.getByLabelText('分を入力')).toBeInTheDocument();
      expect(screen.getByLabelText('秒を入力')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '開始' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'リセット' })).toBeInTheDocument();
    });
  });
});