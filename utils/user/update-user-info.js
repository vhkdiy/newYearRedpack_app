import {
  request
} from '../request.js';
const app = getApp()

/**
 * 更新用户信息
 * @param {*} e 回调的事件
 * @param {*} success 成功回调 
 * @param {*} fail 失败回调 
 * @param {*} complete 完成回调 
 */
const updateUserInfo = function (e, { success, complete, fail } = callback) {
  if (e.detail && e.detail.userInfo) {
    // 神策统计 上传用户信息
    app.sensors.track('accredit_wx_info', {
      nick_name: e.detail.userInfo.nickName
    });
    // 请求更新用户信息的接口
    request({
      funid: 1003,
      data: {
        rawData: e.detail.rawData,
        signature: e.detail.signature,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: (res) => {
        success && success(res)
      },
      complete: (res) => {
        complete && complete(res)
      },
      fail: (res) => {
        fail && fail(res)
      }
    });
  }
}
module.exports = updateUserInfo;