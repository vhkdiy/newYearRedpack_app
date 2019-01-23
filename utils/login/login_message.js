import messageCenter from '../messagecenter/message_center.js';

/**
 * 登录相关的消息定义
 * MESSAGE_LOGIN_SUCCESS：登录成功的消息
 * MESSAGE_LOGIN_FAIL : 登录失败的消息
 *
 */
const LOGIN_MESSAGE = {
  MESSAGE_LOGIN_SUCCESS: "USER_MESSAGE_LOGIN_SUCCESS",
  MESSAGE_LOGIN_FAIL: "USER_MESSAGE_LOGIN_FAIL",

  /**
   * 通知登录成功
   */
  notifyLoginSuccess() {
    messageCenter.sendMessage(this.MESSAGE_LOGIN_SUCCESS, null);
  },

  /**
   * 通知登录失败
   */
  notifyLoginFail() {
    messageCenter.sendMessage(this.MESSAGE_LOGIN_FAIL, null);
  },

  destroy() {
    messageCenter.removeAllCallbackWithMessage(this.MESSAGE_LOGIN_SUCCESS);
    messageCenter.removeAllCallbackWithMessage(this.MESSAGE_LOGIN_FAIL);
  }
};
export default LOGIN_MESSAGE;
