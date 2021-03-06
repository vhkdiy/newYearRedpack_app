const { request } = require('../request.js');
/**
 * 更新微信用户信息
 */
let update_wx_userinfo = function(config) {
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            request({
              url: "/user",
              method : 'PUT',
              loading: false,
              data: {
                rawData: res.rawData,
                signature: res.signature,
                encryptedData: res.encryptedData,
                iv: res.iv
              },
              success: () => { 
                config && config.success && config.success(res.rawData)
               },
              fail: (e) => {
              },
              complete: () => {
              }
            });
          }
        })
      }
    }
  })
}

export default update_wx_userinfo;