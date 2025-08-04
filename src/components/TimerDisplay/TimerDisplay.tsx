import React from 'react';
import { TimerDisplayProps } from '../../types/timer';
import { formatTime } from '../../utils/timeFormatter';
import styles from './TimerDisplay.module.css';

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  remainingSeconds,
  isRunning,
  isCompleted,
  isWarning,
}) => {
  const formattedTime = formatTime(remainingSeconds);

  // CSSクラスを動的に決定
  const displayClasses = [
    styles.display,
    isRunning && styles.running,
    isCompleted && styles.completed,
    isWarning && styles.warning,
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.container}>
      <div 
        className={displayClasses}
        role="timer"
        aria-live="polite"
        aria-label={`残り時間 ${formattedTime}`}
      >
        {formattedTime}
      </div>
      
      {isCompleted && (
        <div 
          className={styles.completionMessage}
          role="alert"
          aria-live="assertive"
        >
          タイマー完了！
        </div>
      )}
      
      {isWarning && !isCompleted && (
        <div 
          className={styles.warningMessage}
          role="status"
          aria-live="polite"
        >
          まもなく終了
        </div>
      )}
    </div>
  );
};