import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimerDisplay } from '../TimerDisplay';
import styles from '../TimerDisplay.module.css';

describe('TimerDisplay', () => {
  const defaultProps = {
    remainingSeconds: 0,
    isRunning: false,
    isCompleted: false,
    isWarning: false,
  };

  describe('時間表示', () => {
    it('残り時間をMM:SS形式で表示する', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={125} />);
      
      expect(screen.getByText('02:05')).toBeInTheDocument();
    });

    it('0秒の場合は00:00で表示する', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={0} />);
      
      expect(screen.getByText('00:00')).toBeInTheDocument();
    });

    it('1桁の数値を0埋めして表示する', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={65} />);
      
      expect(screen.getByText('01:05')).toBeInTheDocument();
    });

    it('大きな値も正しく表示する', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={3661} />);
      
      expect(screen.getByText('61:01')).toBeInTheDocument();
    });
  });

  describe('状態表示', () => {
    it('通常状態では基本的な表示のみ', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={30} />);
      
      expect(screen.getByText('00:30')).toBeInTheDocument();
      expect(screen.queryByText('タイマー完了！')).not.toBeInTheDocument();
      expect(screen.queryByText('まもなく終了')).not.toBeInTheDocument();
    });

    it('実行中状態を表示する', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={30} isRunning={true} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveClass(styles.running);
    });

    it('警告状態を表示する', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={5} isWarning={true} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveClass(styles.warning);
      expect(screen.getByText('まもなく終了')).toBeInTheDocument();
    });

    it('完了状態を表示する', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={0} isCompleted={true} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveClass(styles.completed);
      expect(screen.getByText('タイマー完了！')).toBeInTheDocument();
    });

    it('警告状態と完了状態が同時の場合、完了メッセージのみ表示', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={0} isWarning={true} isCompleted={true} />);
      
      expect(screen.getByText('タイマー完了！')).toBeInTheDocument();
      expect(screen.queryByText('まもなく終了')).not.toBeInTheDocument();
    });
  });

  describe('CSSクラス', () => {
    it('基本的なCSSクラスが適用される', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={30} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveClass(styles.display);
    });

    it('実行中の場合、runningクラスが適用される', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={30} isRunning={true} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveClass(styles.display, styles.running);
    });

    it('警告状態の場合、warningクラスが適用される', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={5} isWarning={true} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveClass(styles.display, styles.warning);
    });

    it('完了状態の場合、completedクラスが適用される', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={0} isCompleted={true} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveClass(styles.display, styles.completed);
    });

    it('複数の状態が同時に適用される', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={5} isRunning={true} isWarning={true} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveClass(styles.display, styles.running, styles.warning);
    });
  });

  describe('アクセシビリティ', () => {
    it('適切なrole属性が設定されている', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={30} />);
      
      const display = screen.getByRole('timer');
      expect(display).toBeInTheDocument();
    });

    it('aria-live属性が設定されている', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={30} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveAttribute('aria-live', 'polite');
    });

    it('aria-label属性が正しく設定されている', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={125} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveAttribute('aria-label', '残り時間 02:05');
    });

    it('完了メッセージにrole="alert"が設定されている', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={0} isCompleted={true} />);
      
      const completionMessage = screen.getByText('タイマー完了！');
      expect(completionMessage).toHaveAttribute('role', 'alert');
      expect(completionMessage).toHaveAttribute('aria-live', 'assertive');
    });

    it('警告メッセージにrole="status"が設定されている', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={5} isWarning={true} />);
      
      const warningMessage = screen.getByText('まもなく終了');
      expect(warningMessage).toHaveAttribute('role', 'status');
      expect(warningMessage).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('エッジケース', () => {
    it('負の値の場合は00:00で表示する', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={-10} />);
      
      expect(screen.getByText('00:00')).toBeInTheDocument();
    });

    it('非常に大きな値も正しく処理する', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={7200} />);
      
      expect(screen.getByText('120:00')).toBeInTheDocument();
    });

    it('小数点を含む値は整数として処理する', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={65.7} />);
      
      expect(screen.getByText('01:05')).toBeInTheDocument();
    });
  });

  describe('状態の組み合わせ', () => {
    it('実行中かつ警告状態', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={8} isRunning={true} isWarning={true} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveClass(styles.display, styles.running, styles.warning);
      expect(screen.getByText('00:08')).toBeInTheDocument();
      expect(screen.getByText('まもなく終了')).toBeInTheDocument();
    });

    it('実行中かつ完了状態（理論的には起こらないが）', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={0} isRunning={true} isCompleted={true} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveClass(styles.display, styles.running, styles.completed);
      expect(screen.getByText('00:00')).toBeInTheDocument();
      expect(screen.getByText('タイマー完了！')).toBeInTheDocument();
    });

    it('すべての状態が同時に有効', () => {
      render(<TimerDisplay {...defaultProps} remainingSeconds={0} isRunning={true} isWarning={true} isCompleted={true} />);
      
      const display = screen.getByRole('timer');
      expect(display).toHaveClass(styles.display, styles.running, styles.warning, styles.completed);
      expect(screen.getByText('タイマー完了！')).toBeInTheDocument();
      expect(screen.queryByText('まもなく終了')).not.toBeInTheDocument(); // 完了時は警告メッセージを表示しない
    });
  });
});