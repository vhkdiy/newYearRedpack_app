/**
 * 消息中心
 * 不需要的回掉要及时反注册
 */
class MessageCenter {

  constructor() {
    this.callbacks = {};
  }
  /**
   * 注册消息回调通知， message：注册的事件名称， callback：回掉执行的方法
   */
  registerCallback(message, callback) {
    if ((!message || !callback) || (typeof callback != 'function')) {
      return;
    }

    if (!this.callbacks[message]) {
      this.callbacks[message] = [];
    }

    if (this.callbacks[message].indexOf(callback) == -1) {
      this.callbacks[message].push(callback);
    }
  }

  /**
   * 反注册消息回调通知， message：注册的事件名称， callback：回掉执行的方法
   */
  unRegisterCallback(message, callback) {
    if (!message || !callback) {
      return;
    }
    const callbacksWithType = this.callbacks[message];
    if (callbacksWithType) {
      const index = callbacksWithType.indexOf(callback);
      callbacksWithType.splice(index, 1);
    }
  }

  /**
   * 删除同一消息下的所有回调通知
   */
  removeAllCallbackWithMessage(message) {
    if (!message) {
      return;
    }

    delete this.callbacks[message];
  }


  /**
   * 发送消息
   */
  sendMessage(message, value) {
    if (!message) {
      return;
    }

    const callbacksWithType = this.callbacks[message];

    if (callbacksWithType && callbacksWithType.length > 0) {
      for (var i = 0; i < callbacksWithType.length; i++) {
        try {
          const callbackFun = callbacksWithType[i];
          callbackFun && callbackFun(value);
        } catch (e) {}
      }
    }
  }
}

let messageCenter = new MessageCenter();

export default messageCenter;