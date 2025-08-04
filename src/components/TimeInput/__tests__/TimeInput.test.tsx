import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimeInput } from '../TimeInput';

describe('TimeInput', () => {
  const defaultProps = {
    minutes: 0,
    seconds: 0,
    onMinutesChange: vi.fn(),
    onSecondsChange: vi.fn(),
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('レンダリング', () => {
    it('分と秒の入力フィールドが表示される', () => {
      render(<TimeInput {...defaultProps} />);
      
      expect(screen.getByLabelText('分を入力')).toBeInTheDocument();
      expect(screen.getByLabelText('秒を入力')).toBeInTheDocument();
      expect(screen.getByText(':')).toBeInTheDocument();
    });

    it('初期値が正しく表示される', () => {
      render(<TimeInput {...defaultProps} minutes={5} seconds={30} />);
      
      expect(screen.getByDisplayValue('5')).toBeInTheDocument();
      expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    });

    it('0の場合は"0"で表示される', () => {
      render(<TimeInput {...defaultProps} minutes={0} seconds={0} />);
      
      const minutesInput = screen.getByLabelText('分を入力') as HTMLInputElement;
      const secondsInput = screen.getByLabelText('秒を入力') as HTMLInputElement;
      
      expect(minutesInput.value).toBe('0');
      expect(secondsInput.value).toBe('0');
    });
  });

  describe('入力処理', () => {
    it('有効な分の値を入力できる', async () => {
      const user = userEvent.setup();
      const onMinutesChange = vi.fn();
      
      render(<TimeInput {...defaultProps} onMinutesChange={onMinutesChange} />);
      
      const minutesInput = screen.getByLabelText('分を入力');
      await user.clear(minutesInput);
      await user.type(minutesInput, '25');
      
      expect(onMinutesChange).toHaveBeenCalledWith(25);
    });

    it('有効な秒の値を入力できる', async () => {
      const user = userEvent.setup();
      const onSecondsChange = vi.fn();
      
      render(<TimeInput {...defaultProps} onSecondsChange={onSecondsChange} />);
      
      const secondsInput = screen.getByLabelText('秒を入力');
      await user.clear(secondsInput);
      await user.type(secondsInput, '45');
      
      expect(onSecondsChange).toHaveBeenCalledWith(45);
    });
  });

  describe('バリデーション', () => {
    it('無効な分の値でエラーメッセージを表示する', async () => {
      const user = userEvent.setup();
      
      render(<TimeInput {...defaultProps} />);
      
      const minutesInput = screen.getByLabelText('分を入力');
      await user.clear(minutesInput);
      await user.type(minutesInput, '60');
      
      expect(screen.getByText('分は59以下の値を入力してください')).toBeInTheDocument();
    });

    it('無効な秒の値でエラーメッセージを表示する', async () => {
      const user = userEvent.setup();
      
      render(<TimeInput {...defaultProps} />);
      
      const secondsInput = screen.getByLabelText('秒を入力');
      await user.clear(secondsInput);
      await user.type(secondsInput, '70');
      
      expect(screen.getByText('秒は59以下の値を入力してください')).toBeInTheDocument();
    });

    it('負の値でエラーメッセージを表示する', async () => {
      const user = userEvent.setup();
      
      render(<TimeInput {...defaultProps} />);
      
      const minutesInput = screen.getByLabelText('分を入力');
      
      // 直接changeイベントを発火してバリデーションをテスト
      fireEvent.change(minutesInput, { target: { value: '-5' } });
      
      expect(screen.getByText('分は0以上の値を入力してください')).toBeInTheDocument();
    });

    it('文字列でエラーメッセージを表示する', async () => {
      const user = userEvent.setup();
      
      render(<TimeInput {...defaultProps} />);
      
      const minutesInput = screen.getByLabelText('分を入力');
      
      // 直接changeイベントを発火してバリデーションをテスト
      fireEvent.change(minutesInput, { target: { value: 'abc' } });
      
      expect(screen.getByText('分は数値で入力してください')).toBeInTheDocument();
    });
  });

  describe('キーボードナビゲーション', () => {
    it('数字キーを受け入れる', () => {
      render(<TimeInput {...defaultProps} />);
      
      const minutesInput = screen.getByLabelText('分を入力');
      const keyEvent = new KeyboardEvent('keydown', { key: '5' });
      
      fireEvent.keyDown(minutesInput, keyEvent);
      
      expect(keyEvent.defaultPrevented).toBe(false);
    });

    it('文字キーを拒否する', () => {
      render(<TimeInput {...defaultProps} />);
      
      const minutesInput = screen.getByLabelText('分を入力');
      
      const keyEvent = fireEvent.keyDown(minutesInput, { key: 'a' });
      
      expect(keyEvent).toBe(false); // preventDefault が呼ばれた場合は false が返される
    });

    it('制御キーを受け入れる', () => {
      render(<TimeInput {...defaultProps} />);
      
      const minutesInput = screen.getByLabelText('分を入力');
      
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
      
      allowedKeys.forEach(key => {
        const keyEvent = new KeyboardEvent('keydown', { key });
        fireEvent.keyDown(minutesInput, keyEvent);
        expect(keyEvent.defaultPrevented).toBe(false);
      });
    });
  });

  describe('無効化状態', () => {
    it('disabled=trueの場合、入力フィールドが無効化される', () => {
      render(<TimeInput {...defaultProps} disabled={true} />);
      
      const minutesInput = screen.getByLabelText('分を入力') as HTMLInputElement;
      const secondsInput = screen.getByLabelText('秒を入力') as HTMLInputElement;
      
      expect(minutesInput.disabled).toBe(true);
      expect(secondsInput.disabled).toBe(true);
    });

    it('disabled=falseの場合、入力フィールドが有効化される', () => {
      render(<TimeInput {...defaultProps} disabled={false} />);
      
      const minutesInput = screen.getByLabelText('分を入力') as HTMLInputElement;
      const secondsInput = screen.getByLabelText('秒を入力') as HTMLInputElement;
      
      expect(minutesInput.disabled).toBe(false);
      expect(secondsInput.disabled).toBe(false);
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なaria属性が設定されている', () => {
      render(<TimeInput {...defaultProps} />);
      
      const minutesInput = screen.getByLabelText('分を入力');
      const secondsInput = screen.getByLabelText('秒を入力');
      
      expect(minutesInput).toHaveAttribute('aria-label', '分を入力');
      expect(secondsInput).toHaveAttribute('aria-label', '秒を入力');
      expect(minutesInput).toHaveAttribute('aria-invalid', 'false');
      expect(secondsInput).toHaveAttribute('aria-invalid', 'false');
    });

    it('エラー時にaria-invalid属性が更新される', async () => {
      const user = userEvent.setup();
      
      render(<TimeInput {...defaultProps} />);
      
      const minutesInput = screen.getByLabelText('分を入力');
      await user.clear(minutesInput);
      await user.type(minutesInput, '60');
      
      expect(minutesInput).toHaveAttribute('aria-invalid', 'true');
      expect(minutesInput).toHaveAttribute('aria-describedby', 'minutes-error');
    });

    it('エラーメッセージにrole="alert"が設定されている', async () => {
      const user = userEvent.setup();
      
      render(<TimeInput {...defaultProps} />);
      
      const minutesInput = screen.getByLabelText('分を入力');
      await user.clear(minutesInput);
      await user.type(minutesInput, '60');
      
      const errorMessage = screen.getByText('分は59以下の値を入力してください');
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });
  });

  describe('境界値テスト', () => {
    it('最大値（59）を受け入れる', async () => {
      const user = userEvent.setup();
      const onMinutesChange = vi.fn();
      
      render(<TimeInput {...defaultProps} onMinutesChange={onMinutesChange} />);
      
      const minutesInput = screen.getByLabelText('分を入力');
      await user.clear(minutesInput);
      await user.type(minutesInput, '59');
      
      expect(onMinutesChange).toHaveBeenCalledWith(59);
      expect(screen.queryByText('分は59以下の値を入力してください')).not.toBeInTheDocument();
    });

    it('最小値（0）を受け入れる', async () => {
      const user = userEvent.setup();
      const onMinutesChange = vi.fn();
      
      render(<TimeInput {...defaultProps} onMinutesChange={onMinutesChange} />);
      
      const minutesInput = screen.getByLabelText('分を入力');
      await user.clear(minutesInput);
      await user.type(minutesInput, '0');
      
      expect(onMinutesChange).toHaveBeenCalledWith(0);
      expect(screen.queryByText('分は0以上の値を入力してください')).not.toBeInTheDocument();
    });
  });
});