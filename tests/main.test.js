import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// テスト対象の関数をインポート
import {
  searchAddressByPostcode,
  validatePostcode,
  openInGoogleMaps,
  confirmAndOpenGoogleMaps
} from '../src/main.js';

describe('郵便番号検索機能', () => {
  describe('validatePostcode', () => {
    it('7桁の数字の郵便番号は有効である', () => {
      expect(validatePostcode('1234567')).toBe(true);
    });

    it('6桁以下の郵便番号は無効である', () => {
      expect(validatePostcode('123456')).toBe(false);
    });

    it('8桁以上の郵便番号は無効である', () => {
      expect(validatePostcode('12345678')).toBe(false);
    });

    it('数字以外が含まれる郵便番号は無効である', () => {
      expect(validatePostcode('123-4567')).toBe(false);
      expect(validatePostcode('123456a')).toBe(false);
    });

    it('空文字列は無効である', () => {
      expect(validatePostcode('')).toBe(false);
    });
  });

  describe('searchAddressByPostcode', () => {
    it('有効な郵便番号で住所を検索できる', async () => {
      // 東京の郵便番号（例：1000001）
      const result = await searchAddressByPostcode('1000001');

      expect(result.success).toBe(true);
      expect(result.address).toContain('東京都');
      expect(result.address).toContain('千代田区');
    });

    it('存在しない郵便番号の場合はエラーを返す', async () => {
      const result = await searchAddressByPostcode('9999999');

      expect(result.success).toBe(false);
      expect(result.error).toBe('該当する住所が見つかりませんでした');
    });

    it('無効な郵便番号の場合はエラーを返す', async () => {
      const result = await searchAddressByPostcode('123456');

      expect(result.success).toBe(false);
      expect(result.error).toBe('無効な郵便番号です');
    });

    it('ネットワークエラーの場合は適切なエラーメッセージを返す', async () => {
      // fetchをモックしてネットワークエラーをシミュレート
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await searchAddressByPostcode('1000001');

      expect(result.success).toBe(false);
      expect(result.error).toBe('通信に失敗しました');

      // モックをリセット
      global.fetch.mockRestore();
    });
  });

  describe('Google Maps連携機能', () => {
    beforeEach(() => {
      // window.openをモック
      global.window.open = vi.fn();
      // confirmをモック
      global.confirm = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('openInGoogleMaps関数でGoogle Mapsが開かれる', () => {
      const address = '東京都千代田区千代田';
      openInGoogleMaps(address);

      expect(window.open).toHaveBeenCalledWith(
        'https://www.google.com/maps/search/?api=1&query=%E6%9D%B1%E4%BA%AC%E9%83%BD%E5%8D%83%E4%BB%A3%E7%94%B0%E5%8C%BA%E5%8D%83%E4%BB%A3%E7%94%B0',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('confirmAndOpenGoogleMaps関数で確認ダイアログが表示される', () => {
      const address = '東京都千代田区千代田';

      // confirmがtrueを返すように設定
      global.confirm.mockReturnValue(true);

      confirmAndOpenGoogleMaps(address);

      expect(confirm).toHaveBeenCalledWith(
        'Google Mapsで「東京都千代田区千代田」の位置を表示しますか？\n\n新しいタブでGoogle Mapsが開きます。'
      );
      expect(window.open).toHaveBeenCalled();
    });

    it('confirmAndOpenGoogleMaps関数でユーザーがキャンセルした場合はGoogle Mapsが開かれない', () => {
      const address = '東京都千代田区千代田';

      // confirmがfalseを返すように設定
      global.confirm.mockReturnValue(false);

      confirmAndOpenGoogleMaps(address);

      expect(confirm).toHaveBeenCalled();
      expect(window.open).not.toHaveBeenCalled();
    });

    it('特殊文字を含む住所でも正しくエンコードされる', () => {
      const address = '大阪府大阪市北区梅田1-1-1';
      openInGoogleMaps(address);

      expect(window.open).toHaveBeenCalledWith(
        'https://www.google.com/maps/search/?api=1&query=%E5%A4%A7%E9%98%AA%E5%BA%9C%E5%A4%A7%E9%98%AA%E5%B8%82%E5%8C%97%E5%8C%BA%E6%A2%85%E7%94%B01-1-1',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });
});
