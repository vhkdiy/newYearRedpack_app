
/**
 * 操作storage
 * 二级缓存
 */

const storageUtils = {

  getStorageCache() {
    let storageCache = getApp().storageCache;
    if (!storageCache) {
      getApp().storageCache = storageCache = {};
    }

    return storageCache;
  },

  getStorageSync(key) {
    const storageCache = this.getStorageCache();
    let cacheData = storageCache[key];
    if (!cacheData) {
      cacheData = storageCache[key] = wx.getStorageSync(key);
    }
    return cacheData;
  },

  setStorageSync(key, data){
    wx.setStorageSync(key, data);
    getStorageCache()[key] = data;
  },

  setStorage(key, data){
    return new Promise((r, j ) => {
      wx.setStorage({
        key: key,
        data: data,
        success:(res) => {
          this.getStorageCache()[key] = data;
          r(data);
        },
        fail:(e) => {
          j(e);
        }
      });
    });
  },

  getStorage(key){
    return new Promise((r, j) => {
      if (this.getStorageCache()[key]) {
        r(this.getStorageCache()[key]);
      } else {
        wx.getStorage({
          key: key,
          success: (res) => {
            const data =  res.data;
            this.getStorageCache()[key] = data;
            r(data);
          },
          fail: (e) => {
            j(e);
          }
        })
      }
    });
  },

  removeStorage(key) {
    return new Promise((r, j) => {
      wx.removeStorage({
        key: key,
        success: (res) => { 
          delete this.getStorageCache()[key];
          r();
        },
        fail: (e) => {
          j(e);
        }
      })
    });
  },

  removeStorageSync(key){
    wx.removeStorageSync(key);
    delete this.getStorageCache()[key];
  }
}

export default storageUtils;