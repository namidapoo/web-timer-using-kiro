/**
 * タイマー通知機能を統合するユーティリティ
 */

import { playTimerAlert, playWarningBeep } from './audioAlert';
import { showTimerCompletedNotification, showTimerWarningNotification, ensureNotificationPermission } from './browserNotification';

/**
 * 通知設定オプション
 */
export interface NotificationSettings {
  enableAudio: boolean;
  enableBrowserNotification: boolean;
  enableVisualNotification: boolean;
}

/**
 * デフォルトの通知設定
 */
export const defaultNotificationSettings: NotificationSettings = {
  enableAudio: true,
  enableBrowserNotification: true,
  enableVisualNotification: true,
};

/**
 * タイマー完了時の通知を実行する
 * @param settings 通知設定
 * @returns Promise<void>
 */
export const notifyTimerCompleted = async (settings: NotificationSettings = defaultNotificationSettings): Promise<void> => {
  const promises: Promise<any>[] = [];

  // 音声アラート
  if (settings.enableAudio) {
    promises.push(playTimerAlert());
  }

  // ブラウザ通知
  if (settings.enableBrowserNotification) {
    promises.push(showTimerCompletedNotification());
  }

  // すべての通知を並行実行
  try {
    await Promise.allSettled(promises);
  } catch (error) {
    console.warn('Some notifications failed:', error);
  }
};

/**
 * タイマー警告時の通知を実行する（10秒以下の場合）
 * @param remainingSeconds 残り秒数
 * @param settings 通知設定
 * @returns Promise<void>
 */
export const notifyTimerWarning = async (
  remainingSeconds: number,
  settings: NotificationSettings = defaultNotificationSettings
): Promise<void> => {
  const promises: Promise<any>[] = [];

  // 音声アラート（控えめに）
  if (settings.enableAudio) {
    promises.push(playWarningBeep());
  }

  // ブラウザ通知（10秒の時のみ）
  if (settings.enableBrowserNotification && remainingSeconds === 10) {
    promises.push(showTimerWarningNotification(remainingSeconds));
  }

  // すべての通知を並行実行
  try {
    await Promise.allSettled(promises);
  } catch (error) {
    console.warn('Some warning notifications failed:', error);
  }
};

/**
 * 通知の初期化を行う
 * ユーザーの操作時に呼び出して、必要な許可を取得する
 * @returns Promise<NotificationSettings> 利用可能な通知機能
 */
export const initializeNotifications = async (): Promise<NotificationSettings> => {
  const settings: NotificationSettings = {
    enableAudio: true, // Web Audio APIは通常利用可能
    enableBrowserNotification: false,
    enableVisualNotification: true, // 常に利用可能
  };

  try {
    // ブラウザ通知の許可を確認・要求
    const notificationPermission = await ensureNotificationPermission(true);
    settings.enableBrowserNotification = notificationPermission;
  } catch (error) {
    console.warn('Failed to initialize browser notifications:', error);
  }

  return settings;
};

/**
 * 通知設定をローカルストレージに保存する
 * @param settings 通知設定
 */
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  try {
    localStorage.setItem('timerNotificationSettings', JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save notification settings:', error);
  }
};

/**
 * ローカルストレージから通知設定を読み込む
 * @returns NotificationSettings
 */
export const loadNotificationSettings = (): NotificationSettings => {
  try {
    const saved = localStorage.getItem('timerNotificationSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultNotificationSettings,
        ...parsed,
      };
    }
  } catch (error) {
    console.warn('Failed to load notification settings:', error);
  }
  
  return defaultNotificationSettings;
};