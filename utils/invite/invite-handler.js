//步步升金首页
const { request } = require('../request.js');
import messageCenter from './../messagecenter/message_center.js';
import msgKey from './../msg-key.js';

let invateCheck = function () {
  //判断是不是分享进入的用户,是的话请求3接口,菊花二维码识别进来的sceneObj中获取邀请人的userid
  let app = getApp();
  let sceneObj = app.globalData.sceneObj;
  let query = app.globalData.query;
  if ((query && query.openId) || (sceneObj && sceneObj.userid)) {
    getSharemessage()
  } else {
    getApp().globalData.isFinishBindInviteRelations = true;
    messageCenter.sendMessage(msgKey.NO_NEED_INVATE_CHECK);
  }
}

let getSharemessage = function (){
  let shareId = '';
  let shareIv = '';
  let app = getApp();
  let query = app.globalData.query;
  console.log("getSharemessage");
  // wx.getShareInfo({
  //   shareTicket: app.globalData.shareTicket || '',
  //   success(res) {
  //     shareId = res.encryptedData;
  //     shareIv = res.iv;
  //   },
  //   fail(res) {
  //   },
  //   complete(res) {
  //     request({
  //       funid: 1005,
  //       data: {
  //         invitePhoneId: query && query.openId,
  //         encryptedData: shareId,
  //         iv: shareIv,
  //         share_content: query && query.share_content,
  //         share_content_id: query && query.share_id,
  //         event: 'invite_success',
  //         properties: app.sensors.getPresetProperties(),
  //         share_type: query && query.type,
  //         product_id: query.productId || '',
  //         invite_userid: (app.globalData.sceneObj && app.globalData.sceneObj.userid)
  //       },
  //       success: (res) => { 
  //         getApp().globalData.isFinishBindInviteRelations = true;
  //         messageCenter.sendMessage(msgKey.BIND_INVITE_RELATIONS_SUCCESS);
  //       }
  //     })
  //   }
  // });
  }

export default {
  invateCheck: invateCheck,
}