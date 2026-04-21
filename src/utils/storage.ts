class Storage {
  // 长期存储
  static set(key: string, value: any): void {
    uni.setStorageSync(key, value);
  }

  static get<T>(key: string): T | null {
    return uni.getStorageSync(key) || null;
  }

  static remove(key: string): void {
    uni.removeStorageSync(key);
  }

  // 会话存储（页面级）
  private static sessionMap = new Map();

  static setSession(key: string, value: any): void {
    this.sessionMap.set(key, value);
  }

  static getSession<T>(key: string): T | null {
    return this.sessionMap.get(key) || null;
  }

  static removeSession(key: string): void {
    this.sessionMap.delete(key);
  }
}

export default Storage;
