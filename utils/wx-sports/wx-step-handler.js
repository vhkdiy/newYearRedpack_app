import messageCenter from '../messagecenter/message_center.js';
import WX_STEP_MESSAGE from './wx-step-message.js';

const {request} = require('../request.js');

//是否正在打开微信权限设置界面
let is_open_wxrun_settings = false;

//最后一次打开开启微信运动的界面的时间
let last_open_wxrun_open_time = null;

/**
 * 获取微信运动的方法
 * invokeValue 调用者需要携带的信息，最终会通知到消息接收者
 * options 控制信息： noAutoOpenSetting：不自动跳转到设置界面
 */
let getWechatStep = function(invokeValue, options){

    //根据返回的信息，判断用户没有开启微信运动，为了防止某些手机不停打开开启微信运动界面，这里做个限制
    if (last_open_wxrun_open_time) {
        let now = new Date().getTime();
        if ((now - last_open_wxrun_open_time) < 500) {
           return;
        } else {
           last_open_wxrun_open_time = null;
        }
    }

    let value = {
      invokeValue : invokeValue
    };
    //获取运动步数开始
    messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_START, value);
    wx.getWeRunData({
      success(res) {
        //获取运动步数成功
        messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_SUCCESS, value);
        request({
          funid:42,
          data: {
            encryptedData: res.encryptedData,
            iv: res.iv
          },
          success: (res) => {
            //上传服务器成功
            value.result = res;
            messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_UPLOAD_SUCCESS, value);
          },
          fail: (result) => {
            //上传服务器失败
            value.result = result;
            messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_UPLOAD_FAIL, value);
          }
        });
        //获取可兑换活力币的步数
        request({
          funid: 93,
          data: {
            encryptedData: res.encryptedData,
            iv: res.iv
          },
          success: (res) => {
            value.result = res;
            messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_STEPCOIN_SUCCESS, value);
          },
          fail: (result) => {
            console.log(result)
          }
        });
      },
      fail(res){
        //获取微信运动步数失败
        messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_FAIL, value);

        // if (res && res.errMsg && res.errMsg == "getWeRunData:fail cancel") {
        //   //根据返回的信息，判断用户没有开启微信运动，为了防止某些手机不停打开开启微信运动界面，这里做个限制
        //   last_open_wxrun_open_time = new Date().getTime();
        // }

        // wx.getSetting({
        //     success: (res) => {
        //       const scope = res.authSetting['scope.werun'];
        //       if (typeof scope !== 'undefined' && !scope) {
        //         //打开设置获取授权成功
        //         messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_OPEN_SETTINGS, value);
                
        //         if (is_open_wxrun_settings) {
        //             //如果正在打开，返回
        //             return;
        //         }

        //         if (!options || !options.noAutoOpenSetting) {
        //           //标识打开
        //           is_open_wxrun_settings = true;

        //           wx.openSetting({
        //             success: (res) => {
        //               //拿到结果就标志关闭
        //               is_open_wxrun_settings = false;

        //               if (res.authSetting['scope.werun']) {
        //                 //打开设置获取授权成功
        //                 messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_GET_WXRUN_SUCCESS, value);
        //               } else {
        //                 //打开设置获取授权失败
        //                 messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_GET_WXRUN_FAIL, value);
        //               }
        //             }
        //           });
        //         }
        //       } else {
        //         //打开设置获取授权失败
        //         messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_GET_WXRUN_FAIL, value);
        //       }
        //     }
        // });
      },
      complete: (res) => {
        //获取微信运动步数结束
        messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_COMPLETE, value);
      }
    })
  }

  export default {
    getWechatStep : getWechatStep
  }

