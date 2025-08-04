import { describe, it, expect } from 'vitest';
import {
  formatTime,
  validateMinutes,
  validateSeconds,
  parseTimeValue,
  calculateTotalSeconds
} from '../timeFormatter';

describe('timeFormatter', () => {
  describe('formatTime', () => {
    it('正しくMM:SS形式にフォーマットする', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(30)).toBe('00:30');
      expect(formatTime(60)).toBe('01:00');
      expect(formatTime(90)).toBe('01:30');
      expect(formatTime(3661)).toBe('61:01');
    });

    it('1桁の数値を0埋めする', () => {
      expect(formatTime(5)).toBe('00:05');
      expect(formatTime(65)).toBe('01:05');
    });
  });

  describe('validateMinutes', () => {
    it('有効な分の値を受け入れる', () => {
      expect(validateMinutes(0)).toEqual({ isValid: true });
      expect(validateMinutes(30)).toEqual({ isValid: true });
      expect(validateMinutes(59)).toEqual({ isValid: true });
      expect(validateMinutes('0')).toEqual({ isValid: true });
      expect(validateMinutes('30')).toEqual({ isValid: true });
      expect(validateMinutes('59')).toEqual({ isValid: true });
    });

    it('空文字を有効として扱う', () => {
      expect(validateMinutes('')).toEqual({ isValid: true });
      expect(validateMinutes(null as any)).toEqual({ isValid: true });
      expect(validateMinutes(undefined as any)).toEqual({ isValid: true });
    });

    it('無効な分の値を拒否する', () => {
      expect(validateMinutes(-1)).toEqual({
        isValid: false,
        errorMessage: '分は0以上の値を入力してください'
      });
      expect(validateMinutes(60)).toEqual({
        isValid: false,
        errorMessage: '分は59以下の値を入力してください'
      });
      expect(validateMinutes('abc')).toEqual({
        isValid: false,
        errorMessage: '分は数値で入力してください'
      });
    });
  });

  describe('validateSeconds', () => {
    it('有効な秒の値を受け入れる', () => {
      expect(validateSeconds(0)).toEqual({ isValid: true });
      expect(validateSeconds(30)).toEqual({ isValid: true });
      expect(validateSeconds(59)).toEqual({ isValid: true });
      expect(validateSeconds('0')).toEqual({ isValid: true });
      expect(validateSeconds('30')).toEqual({ isValid: true });
      expect(validateSeconds('59')).toEqual({ isValid: true });
    });

    it('空文字を有効として扱う', () => {
      expect(validateSeconds('')).toEqual({ isValid: true });
      expect(validateSeconds(null as any)).toEqual({ isValid: true });
      expect(validateSeconds(undefined as any)).toEqual({ isValid: true });
    });

    it('無効な秒の値を拒否する', () => {
      expect(validateSeconds(-1)).toEqual({
        isValid: false,
        errorMessage: '秒は0以上の値を入力してください'
      });
      expect(validateSeconds(60)).toEqual({
        isValid: false,
        errorMessage: '秒は59以下の値を入力してください'
      });
      expect(validateSeconds('xyz')).toEqual({
        isValid: false,
        errorMessage: '秒は数値で入力してください'
      });
    });
  });

  describe('parseTimeValue', () => {
    it('有効な数値を正しく変換する', () => {
      expect(parseTimeValue(0)).toBe(0);
      expect(parseTimeValue(30)).toBe(30);
      expect(parseTimeValue(59)).toBe(59);
      expect(parseTimeValue('0')).toBe(0);
      expect(parseTimeValue('30')).toBe(30);
      expect(parseTimeValue('59')).toBe(59);
    });

    it('空文字を0に変換する', () => {
      expect(parseTimeValue('')).toBe(0);
      expect(parseTimeValue(null as any)).toBe(0);
      expect(parseTimeValue(undefined as any)).toBe(0);
    });

    it('無効な値を0に変換する', () => {
      expect(parseTimeValue('abc')).toBe(0);
      expect(parseTimeValue(NaN)).toBe(0);
    });

    it('範囲外の値を制限する', () => {
      expect(parseTimeValue(-5)).toBe(0);
      expect(parseTimeValue(65)).toBe(59);
      expect(parseTimeValue('-5')).toBe(0);
      expect(parseTimeValue('65')).toBe(59);
    });
  });

  describe('calculateTotalSeconds', () => {
    it('分と秒から総秒数を正しく計算する', () => {
      expect(calculateTotalSeconds(0, 0)).toBe(0);
      expect(calculateTotalSeconds(0, 30)).toBe(30);
      expect(calculateTotalSeconds(1, 0)).toBe(60);
      expect(calculateTotalSeconds(1, 30)).toBe(90);
      expect(calculateTotalSeconds(5, 45)).toBe(345);
    });
  });
});