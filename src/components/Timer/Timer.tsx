import React, { useState, useCallback, useEffect } from 'react';
import { TimerProps } from '../../types/timer';
import { useTimer } from '../../hooks/useTimer';
import { TimeInput } from '../TimeInput';
import { TimerDisplay } from '../TimerDisplay';
import { notifyTimerCompleted, notifyTimerWarning, initializeNotifications, loadNotificationSettings, saveNotificationSettings, NotificationSettings } from '../../utils/timerNotifications';
import styles from './Timer.module.css';

export const Timer: React.FC<TimerProps> = ({
  initialMinutes = 0,
  initialSeconds = 0,
  onComplete,
}) => {
  // 通知設定の状態管理
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => 
    loadNotificationSettings()
  );
  const [isNotificationInitialized, setIsNotificationInitialized] = useState(false);

  // タイマー完了時のコールバック
  const handleTimerComplete = useCallback(async () => {
    // 通知を実行
    await notifyTimerCompleted(notificationSettings);
    
    // 外部のコールバックを呼び出し
    onComplete?.();
  }, [notificationSettings, onComplete]);

  // useTimerフックを使用
  const { state, actions } = useTimer(initialMinutes, initialSeconds, handleTimerComplete);

  // 警告状態の判定（10秒以下）
  const isWarning = state.remainingSeconds <= 10 && state.remainingSeconds > 0 && state.isRunning;

  // 警告通知の処理
  useEffect(() => {
    if (isWarning && state.remainingSeconds === 10) {
      notifyTimerWarning(state.remainingSeconds, notificationSettings);
    }
  }, [isWarning, state.remainingSeconds, notificationSettings]);

  // 通知設定の変更ハンドラー
  const handleNotificationSettingsChange = useCallback((newSettings: NotificationSettings) => {
    setNotificationSettings(newSettings);
    saveNotificationSettings(newSettings);
  }, []);

  // 通知の初期化
  const handleInitializeNotifications = useCallback(async () => {
    if (!isNotificationInitialized) {
      const availableSettings = await initializeNotifications();
      handleNotificationSettingsChange(availableSettings);
      setIsNotificationInitialized(true);
    }
  }, [isNotificationInitialized, handleNotificationSettingsChange]);

  // 時間設定のハンドラー
  const handleMinutesChange = useCallback((minutes: number) => {
    actions.setTime(minutes, state.seconds);
  }, [actions, state.seconds]);

  const handleSecondsChange = useCallback((seconds: number) => {
    actions.setTime(state.minutes, seconds);
  }, [actions, state.minutes]);

  // ボタンのクリックハンドラー
  const handleStartPause = useCallback(async () => {
    // 初回クリック時に通知を初期化
    await handleInitializeNotifications();
    
    if (state.isRunning) {
      actions.pause();
    } else {
      actions.start();
    }
  }, [state.isRunning, actions, handleInitializeNotifications]);

  const handleReset = useCallback(() => {
    actions.reset();
  }, [actions]);

  // ボタンの表示テキストを決定
  const getStartPauseButtonText = () => {
    if (state.isCompleted) {
      return '開始';
    }
    return state.isRunning ? '停止' : '開始';
  };

  // ボタンの無効状態を決定
  const isStartDisabled = state.totalSeconds === 0 && !state.isRunning;
  const isResetDisabled = state.totalSeconds === 0 && state.remainingSeconds === 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Webタイマー</h1>
      </div>

      <div className={styles.content}>
        {/* 時間入力 */}
        <div className={styles.inputSection}>
          <TimeInput
            minutes={state.minutes}
            seconds={state.seconds}
            onMinutesChange={handleMinutesChange}
            onSecondsChange={handleSecondsChange}
            disabled={state.isRunning}
          />
        </div>

        {/* タイマー表示 */}
        <div className={styles.displaySection}>
          <TimerDisplay
            remainingSeconds={state.remainingSeconds}
            isRunning={state.isRunning}
            isCompleted={state.isCompleted}
            isWarning={isWarning}
          />
        </div>

        {/* 制御ボタン */}
        <div className={styles.controlSection}>
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={handleStartPause}
            disabled={isStartDisabled}
            aria-label={getStartPauseButtonText()}
          >
            {getStartPauseButtonText()}
          </button>
          
          <button
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={handleReset}
            disabled={isResetDisabled}
            aria-label="リセット"
          >
            リセット
          </button>
        </div>

        {/* 通知設定（開発時のデバッグ用、後で設定パネルに移動可能） */}
        {process.env.NODE_ENV === 'development' && (
          <div className={styles.debugSection}>
            <h3>通知設定 (開発用)</h3>
            <label>
              <input
                type="checkbox"
                checked={notificationSettings.enableAudio}
                onChange={(e) => handleNotificationSettingsChange({
                  ...notificationSettings,
                  enableAudio: e.target.checked
                })}
              />
              音声アラート
            </label>
            <label>
              <input
                type="checkbox"
                checked={notificationSettings.enableBrowserNotification}
                onChange={(e) => handleNotificationSettingsChange({
                  ...notificationSettings,
                  enableBrowserNotification: e.target.checked
                })}
              />
              ブラウザ通知
            </label>
          </div>
        )}
      </div>
    </div>
  );
};