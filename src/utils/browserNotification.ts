/**
 * ブラウザ通知機能を提供するユーティリティ
 */

/**
 * 通知の許可状態を表す型
 */
export type NotificationPermissionState = 'granted' | 'denied' | 'default';

/**
 * 通知オプションの型
 */
export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
}

/**
 * ブラウザ通知がサポートされているかチェックする
 * @returns boolean
 */
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

/**
 * 現在の通知許可状態を取得する
 * @returns NotificationPermissionState
 */
export const getNotificationPermission = (): NotificationPermissionState => {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission as NotificationPermissionState;
};

/**
 * 通知の許可を要求する
 * @returns Promise<NotificationPermissionState>
 */
export const requestNotificationPermission = async (): Promise<NotificationPermissionState> => {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission as NotificationPermissionState;
  } catch (error) {
    console.warn('Notification permission request failed:', error);
    return 'denied';
  }
};

/**
 * ブラウザ通知を表示する
 * @param options 通知オプション
 * @returns Promise<Notification | null>
 */
export const showNotification = async (options: NotificationOptions): Promise<Notification | null> => {
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported');
    return null;
  }

  const permission = getNotificationPermission();
  if (permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon,
      tag: options.tag,
      requireInteraction: options.requireInteraction,
      silent: options.silent,
    });

    // 通知をクリックした時にウィンドウにフォーカスする
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // 一定時間後に自動的に閉じる（requireInteractionがfalseの場合）
    if (!options.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    return notification;
  } catch (error) {
    console.warn('Failed to show notification:', error);
    return null;
  }
};

/**
 * タイマー完了通知を表示する
 * @param remainingTime 残り時間（表示用）
 * @returns Promise<Notification | null>
 */
export const showTimerCompletedNotification = async (remainingTime?: string): Promise<Notification | null> => {
  return showNotification({
    title: 'タイマー完了！',
    body: 'タイマーが終了しました。',
    icon: '/favicon.ico', // アプリのアイコンを使用
    tag: 'timer-completed',
    requireInteraction: true, // ユーザーが明示的に閉じるまで表示
    silent: false,
  });
};

/**
 * タイマー警告通知を表示する（10秒以下の場合）
 * @param remainingSeconds 残り秒数
 * @returns Promise<Notification | null>
 */
export const showTimerWarningNotification = async (remainingSeconds: number): Promise<Notification | null> => {
  return showNotification({
    title: 'タイマー警告',
    body: `残り${remainingSeconds}秒です`,
    icon: '/favicon.ico',
    tag: 'timer-warning',
    requireInteraction: false,
    silent: true, // 音声アラートと重複しないようにサイレント
  });
};

/**
 * 通知の許可状態をチェックし、必要に応じて許可を要求する
 * @param showPrompt ユーザーにプロンプトを表示するかどうか
 * @returns Promise<boolean> 通知が利用可能かどうか
 */
export const ensureNotificationPermission = async (showPrompt: boolean = true): Promise<boolean> => {
  if (!isNotificationSupported()) {
    return false;
  }

  const currentPermission = getNotificationPermission();
  
  if (currentPermission === 'granted') {
    return true;
  }
  
  if (currentPermission === 'denied') {
    return false;
  }
  
  // 'default' の場合、ユーザーに許可を求める
  if (showPrompt) {
    const permission = await requestNotificationPermission();
    return permission === 'granted';
  }
  
  return false;
};

/**
 * 既存の通知をすべて閉じる
 * @param tag 特定のタグの通知のみ閉じる場合
 */
export const closeNotifications = (tag?: string): void => {
  // Service Workerを使用している場合の処理
  if ('serviceWorker' in navigator && 'getNotifications' in ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then(registration => {
      registration.getNotifications({ tag }).then(notifications => {
        notifications.forEach(notification => notification.close());
      });
    }).catch(error => {
      console.warn('Failed to close service worker notifications:', error);
    });
  }
  
  // 通常のNotification APIでは個別の通知を追跡する必要があるため、
  // タグベースでの一括削除は制限される
  console.info('Notification close requested for tag:', tag);
};