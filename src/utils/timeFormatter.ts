import { ValidationResult } from '../types/timer';

/**
 * 秒数をMM:SS形式の文字列に変換する
 * @param totalSeconds 総秒数
 * @returns MM:SS形式の文字列
 */
export const formatTime = (totalSeconds: number): string => {
  // 負の値は0として扱う
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * 分の入力値をバリデーションする
 * @param value 入力値
 * @returns バリデーション結果
 */
export const validateMinutes = (value: string | number): ValidationResult => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
  
  // 空文字の場合は0として扱う
  if (value === '' || value === null || value === undefined) {
    return { isValid: true };
  }
  
  // 数値でない場合
  if (isNaN(numValue)) {
    return { 
      isValid: false, 
      errorMessage: '分は数値で入力してください' 
    };
  }
  
  // 負の数の場合
  if (numValue < 0) {
    return { 
      isValid: false, 
      errorMessage: '分は0以上の値を入力してください' 
    };
  }
  
  // 59を超える場合
  if (numValue > 59) {
    return { 
      isValid: false, 
      errorMessage: '分は59以下の値を入力してください' 
    };
  }
  
  return { isValid: true };
};

/**
 * 秒の入力値をバリデーションする
 * @param value 入力値
 * @returns バリデーション結果
 */
export const validateSeconds = (value: string | number): ValidationResult => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
  
  // 空文字の場合は0として扱う
  if (value === '' || value === null || value === undefined) {
    return { isValid: true };
  }
  
  // 数値でない場合
  if (isNaN(numValue)) {
    return { 
      isValid: false, 
      errorMessage: '秒は数値で入力してください' 
    };
  }
  
  // 負の数の場合
  if (numValue < 0) {
    return { 
      isValid: false, 
      errorMessage: '秒は0以上の値を入力してください' 
    };
  }
  
  // 59を超える場合
  if (numValue > 59) {
    return { 
      isValid: false, 
      errorMessage: '秒は59以下の値を入力してください' 
    };
  }
  
  return { isValid: true };
};

/**
 * 入力値を安全な数値に変換する（空文字は0として扱う）
 * @param value 入力値
 * @returns 数値
 */
export const parseTimeValue = (value: string | number): number => {
  if (value === '' || value === null || value === undefined) {
    return 0;
  }
  
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
  return isNaN(numValue) ? 0 : Math.max(0, Math.min(59, numValue));
};

/**
 * 分と秒から総秒数を計算する
 * @param minutes 分
 * @param seconds 秒
 * @returns 総秒数
 */
export const calculateTotalSeconds = (minutes: number, seconds: number): number => {
  return minutes * 60 + seconds;
};