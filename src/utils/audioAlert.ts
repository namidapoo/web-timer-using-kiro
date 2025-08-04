/**
 * 音声アラート機能を提供するユーティリティ
 */

// AudioContextの型定義（ブラウザ互換性のため）
type AudioContextType = AudioContext | webkitAudioContext;

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

/**
 * Web Audio APIを使用してビープ音を生成・再生する
 * @param frequency 周波数（Hz）
 * @param duration 持続時間（ミリ秒）
 * @param volume 音量（0-1）
 * @returns Promise<void>
 */
export const playBeep = async (
  frequency: number = 800,
  duration: number = 500,
  volume: number = 0.3
): Promise<void> => {
  try {
    // AudioContextを作成（ブラウザ互換性を考慮）
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('Web Audio API is not supported');
    }

    const audioContext: AudioContextType = new AudioContextClass();
    
    // オシレーター（音の波形を生成）を作成
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // オシレーターの設定
    oscillator.type = 'sine'; // サイン波（滑らかな音）
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // 音量の設定
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
    
    // ノードを接続
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 音を開始
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
    
    // 音の再生が完了するまで待機
    return new Promise((resolve) => {
      oscillator.onended = () => {
        audioContext.close();
        resolve();
      };
    });
  } catch (error) {
    console.warn('Audio playback failed:', error);
    // 音声再生に失敗した場合はサイレントに処理
    return Promise.resolve();
  }
};

/**
 * タイマー完了時のアラート音を再生する
 * 複数回のビープ音を再生してより目立つようにする
 * @returns Promise<void>
 */
export const playTimerAlert = async (): Promise<void> => {
  try {
    // 3回のビープ音を再生
    await playBeep(800, 200, 0.3);
    await new Promise(resolve => setTimeout(resolve, 100));
    await playBeep(1000, 200, 0.3);
    await new Promise(resolve => setTimeout(resolve, 100));
    await playBeep(800, 300, 0.3);
  } catch (error) {
    console.warn('Timer alert playback failed:', error);
  }
};

/**
 * 警告音を再生する（10秒以下の場合）
 * @returns Promise<void>
 */
export const playWarningBeep = async (): Promise<void> => {
  try {
    await playBeep(600, 150, 0.2);
  } catch (error) {
    console.warn('Warning beep playback failed:', error);
  }
};

/**
 * ユーザーのオーディオ許可を要求する
 * 多くのブラウザでは、ユーザーの操作なしに音声を再生できないため
 * @returns Promise<boolean> 許可されたかどうか
 */
export const requestAudioPermission = async (): Promise<boolean> => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return false;
    }

    const audioContext = new AudioContextClass();
    
    // 短い無音を再生してオーディオコンテキストを初期化
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.001);
    
    await audioContext.close();
    return true;
  } catch (error) {
    console.warn('Audio permission request failed:', error);
    return false;
  }
};

/**
 * オーディオがサポートされているかチェックする
 * @returns boolean
 */
export const isAudioSupported = (): boolean => {
  return !!(window.AudioContext || window.webkitAudioContext);
};