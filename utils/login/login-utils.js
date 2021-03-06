const config = require('../config.js');
const phead = require('../phead.js');
const sensors = require('../sensorsdata.js');
const { request } = require('../request.js');

//消息中心
import messageCenter from '../messagecenter/message_center.js';

//登录消息
import LOGIN_MESSAGE from './login_message.js';

let getOpenIdKey = function (test = config.testServer) {
  return test ? 'openid_test' : 'openid';
}

let getUserIdKey = function (test = config.testServer) {
  return test ? 'userid_test' : 'userid';
}

let getAccessTokenKey = function (test = config.testServer) {
  return test ? 'access_token_test' : 'access_token';
}

/**
 * 检查本地登录信息 
 */
let checkLocalLoginInfo = function () {
  try {
    //正式、测试环境切换，清除本地的缓存数据
    wx.removeStorageSync(getOpenIdKey(!config.testServer));
    wx.removeStorageSync(getUserIdKey(!config.testServer));
    wx.removeStorageSync(getAccessTokenKey(!config.testServer));
  } catch (e) {
    // Do something when catch error
  }
}

/**
 * 开始登录
 */
let startlogin = function(){
  //检查session是否过期
  wx.checkSession({
    success: () => {
      //session_key 未过期，并且在本生命周期一直有效
      this.loginLocal();
    },
    fail: () => {
      // session_key 已经失效，需要重新执行登录流程
      this.login();
    }
  });
}

/**
 * 微信登录
 */
let login = function (forceUpdate) {
  let app = getApp();
  let globalData = app.globalData;
  let query = globalData.query;
  wx.login({
    success: (res) => {
      if (!res || !res.code) {
        //登录失败
        LOGIN_MESSAGE.notifyLoginFail();
        return;
      }
      request({
        url: "/user",
        method : 'POST',
        data: {
          code: res.code,
          sharePathway : globalData.scene,
          shareType: query && query.type,
          investOpenid: query && query.openId,
          // query: query,
          queryStr: JSON.stringify(query),
          investUserId: globalData.sceneObj && globalData.sceneObj.userId,//菊花二维码进来的传userid
        },
        withoutLogin: true,
        success: res => {
          const openid = res.openId;
          const userId = res.userId;
          const access_token = res.accessToken;
          if (userId) {
            sensors.login(userId, {
              b_channel: config.prdid,
              s_channel: config.channel
            });
            sensors.init();
          } else if (openid) {
            sensors.setOpenid(openid);
            sensors.init();
          }
          if (openid) {
            //todo 调整为userId
            phead.init(openid, access_token);
            //当前是新用户 也就是 true 才设置，否则默认就是false
            if (res.isNewbie) {
              app.globalData.isNewbie = res.isNewbie;
              try {
                wx.setStorageSync('isNewbie', 'true')
                wx.setStorageSync('isnewuser', 'true')
              } catch (e) {
              }
            }
            wx.setStorage({
              key: getOpenIdKey(),
              data: openid,
            })
            
            if (userId) {
              phead.phead.userId = userId;
              wx.setStorage({
                key: getUserIdKey(),
                data: userId,
              });
            }

            access_token && wx.setStorage({
              key: getAccessTokenKey(),
              data: access_token,
            })
            //登录成功，发送消息
            LOGIN_MESSAGE.notifyLoginSuccess();
          } else {
            console.error('fail to login');
            //登录失败
            LOGIN_MESSAGE.notifyLoginFail();
          }

          forceUpdate === true && wx.reLaunch({
            url: '/pages/index/index',
          })
        },
        fail: () => {
          //登录失败
          LOGIN_MESSAGE.notifyLoginFail();
        }
      })
    },
    fail: () => {
      //登录失败
      LOGIN_MESSAGE.notifyLoginFail();
    }
  });
}

/**
 * 本地登录
 */
let loginLocal = function() {
  let fail = this.login;
  wx.getStorage({
    key: getOpenIdKey(),
    success: function (res) {
      const openid = res.data;
      const userId = wx.getStorageSync(getUserIdKey());

      //openid与userId同时存在本地，才不用重新登陆
      if (openid && userId) {
        wx.getStorage({
          key: getAccessTokenKey(),
          success: function (res) {
            const access_token = res.data;

            phead.init(openid, access_token);
            phead.phead.userId = userId;

            if (!access_token) {
              fail();
            } else {
              //本地登录成功，发送消息
              LOGIN_MESSAGE.notifyLoginSuccess();
            }
          },
          fail: fail
        })


      } else {
        fail();
      }

      wx.getStorage({
        key: getUserIdKey(),
        success: function (res) {
          const userId = res.data;
          if (userId) {
            
            sensors.login(userId, {
              b_channel: config.prdid,
              s_channel: config.channel
            });
            sensors.init();
          } else if (openid) {
            sensors.setOpenid(openid);
            sensors.init();
          }
        },
      });
    },
    fail: fail
  })
}

/**
 * 判断是否登录的方法
 */
let isLogin = function() {
  return phead && phead.phead && phead.phead.phoneid;
}

/**
 * 如果已经登录，直接回掉
 * 否则，注册监听
 */
let waitToLogin = function(successCallback, failCallback) {
  if (this.isLogin()) {
    successCallback && successCallback();
  } else {
    messageCenter.registerCallback(LOGIN_MESSAGE.MESSAGE_LOGIN_SUCCESS, successCallback);
    messageCenter.registerCallback(LOGIN_MESSAGE.MESSAGE_LOGIN_FAIL, failCallback);
  }
}

/**
 * 反注册监听
 */
let unWaitToLogin = function (successCallback, failCallback) {
  messageCenter.unRegisterCallback(LOGIN_MESSAGE.MESSAGE_LOGIN_SUCCESS, successCallback);
  messageCenter.unRegisterCallback(LOGIN_MESSAGE.MESSAGE_LOGIN_FAIL, failCallback);
}

export default {
  checkLocalLoginInfo: checkLocalLoginInfo,
  startlogin : startlogin,
  login: login,
  loginLocal: loginLocal,
  isLogin: isLogin,
  waitToLogin: waitToLogin,
  unWaitToLogin: unWaitToLogin,
  getOpenIdKey: getOpenIdKey,
  getUserIdKey: getUserIdKey,
  getAccessTokenKey: getAccessTokenKey
}