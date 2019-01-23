import messageCenter from '../messagecenter/message_center.js';

/**
 * 获取微信运动步数相关的消息定义
 * MESSAGE_GET_WX_STEP_START : 获取微信运动步数开始
 * MESSAGE_GET_WX_STEP_SUCCESS : 获取微信运动步数成功
 * MESSAGE_GET_WX_STEP_FAIL : 获取微信运动步数失败
 * MESSAGE_GET_WX_STEP_COMPLETE : 获取微信运动步数完成
 * MESSAGE_GET_WX_STEP_UPLOAD_SUCCESS : 获取微信运动步数上传服务器成功
 * MESSAGE_GET_WX_STEP_UPLOAD_FAIL : 获取微信运动步数上传服务器失败
 * MESSAGE_GET_WX_STEP_OPEN_SETTINGS : 打开授权设置界面
 * MESSAGE_GET_WX_STEP_GET_WXRUN_SUCCESS : 打开设置获取授权成功
 * MESSAGE_GET_WX_STEP_GET_WXRUN_FAIL : 打开设置获取授权失败
 *
 */
const WX_STEP_MESSAGE = {
  MESSAGE_GET_WX_STEP_START: "MESSAGE_GET_WX_STEP_START",
  MESSAGE_GET_WX_STEP_SUCCESS: "MESSAGE_GET_WX_STEP_SUCCESS",
  MESSAGE_GET_WX_STEP_FAIL: "MESSAGE_GET_WX_STEP_FAIL",
  MESSAGE_GET_WX_STEP_COMPLETE: "MESSAGE_GET_WX_STEP_COMPLETE",
  MESSAGE_GET_WX_STEP_UPLOAD_SUCCESS: "MESSAGE_GET_WX_STEP_UPLOAD_SUCCESS",
  MESSAGE_GET_WX_STEP_UPLOAD_FAIL: "MESSAGE_GET_WX_STEP_UPLOAD_FAIL",
  MESSAGE_GET_WX_STEP_OPEN_SETTINGS: "MESSAGE_GET_WX_STEP_OPEN_SETTINGS",
  MESSAGE_GET_WX_STEP_GET_WXRUN_SUCCESS: "MESSAGE_GET_WX_STEP_GET_WXRUN_SUCCESS",
  MESSAGE_GET_WX_STEP_GET_WXRUN_FAIL: "MESSAGE_GET_WX_STEP_GET_WXRUN_FAIL",
  MESSAGE_GET_STEPCOIN_SUCCESS: "MESSAGE_GET_STEPCOIN_SUCCESS"
};
export default WX_STEP_MESSAGE;
