import React, { useState, useCallback, useEffect } from 'react';
import { TimeInputProps } from '../../types/timer';
import { validateMinutes, validateSeconds, parseTimeValue } from '../../utils/timeFormatter';
import styles from './TimeInput.module.css';

export const TimeInput: React.FC<TimeInputProps> = ({
  minutes,
  seconds,
  onMinutesChange,
  onSecondsChange,
  disabled,
}) => {
  const [minutesError, setMinutesError] = useState<string>('');
  const [secondsError, setSecondsError] = useState<string>('');
  const [minutesValue, setMinutesValue] = useState<string>(minutes.toString());
  const [secondsValue, setSecondsValue] = useState<string>(seconds.toString());

  // propsが変更された時に内部状態を更新
  useEffect(() => {
    setMinutesValue(minutes.toString());
  }, [minutes]);

  useEffect(() => {
    setSecondsValue(seconds.toString());
  }, [seconds]);

  // 分の入力ハンドラー
  const handleMinutesChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMinutesValue(value);
    
    const validation = validateMinutes(value);
    
    if (validation.isValid) {
      setMinutesError('');
    } else {
      setMinutesError(validation.errorMessage || '');
    }
    
    // 常に親に値を通知（parseTimeValueで安全な値に変換）
    const numValue = parseTimeValue(value);
    onMinutesChange(numValue);
  }, [onMinutesChange]);

  // 秒の入力ハンドラー
  const handleSecondsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSecondsValue(value);
    
    const validation = validateSeconds(value);
    
    if (validation.isValid) {
      setSecondsError('');
    } else {
      setSecondsError(validation.errorMessage || '');
    }
    
    // 常に親に値を通知（parseTimeValueで安全な値に変換）
    const numValue = parseTimeValue(value);
    onSecondsChange(numValue);
  }, [onSecondsChange]);

  // キーボードナビゲーション用のハンドラー
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    // 数字、バックスペース、削除、タブ、矢印キーのみ許可
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];
    
    // 許可されたキーの場合は通す
    if (allowedKeys.includes(event.key)) {
      return;
    }
    
    // 数字キーの場合は通す
    if (/^[0-9]$/.test(event.key)) {
      return;
    }
    
    // それ以外のキーは阻止
    event.preventDefault();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
          <label htmlFor="minutes-input" className={styles.label}>
            分
          </label>
          <input
            id="minutes-input"
            type="text"
            inputMode="numeric"
            value={minutesValue}
            onChange={handleMinutesChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`${styles.input} ${minutesError ? styles.inputError : ''}`}
            placeholder="0"
            min="0"
            max="59"
            aria-label="分を入力"
            aria-describedby={minutesError ? 'minutes-error' : undefined}
            aria-invalid={!!minutesError}
          />
          {minutesError && (
            <div id="minutes-error" className={styles.errorMessage} role="alert">
              {minutesError}
            </div>
          )}
        </div>

        <div className={styles.separator}>:</div>

        <div className={styles.inputWrapper}>
          <label htmlFor="seconds-input" className={styles.label}>
            秒
          </label>
          <input
            id="seconds-input"
            type="text"
            inputMode="numeric"
            value={secondsValue}
            onChange={handleSecondsChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`${styles.input} ${secondsError ? styles.inputError : ''}`}
            placeholder="0"
            min="0"
            max="59"
            aria-label="秒を入力"
            aria-describedby={secondsError ? 'seconds-error' : undefined}
            aria-invalid={!!secondsError}
          />
          {secondsError && (
            <div id="seconds-error" className={styles.errorMessage} role="alert">
              {secondsError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};