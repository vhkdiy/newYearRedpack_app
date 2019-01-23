/**
 * 检查更新的方法
 */
let checkVersionUpdate = function() {
  // 解决版本兼容问题 1.9.90 才支持
  if (!wx.getUpdateManager) {
    return
  }
  const updateManager = wx.getUpdateManager();
  updateManager.onUpdateReady(function() {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好了，点击确定体验精彩新功能',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  });
}

export default {
  checkVersionUpdate: checkVersionUpdate
};