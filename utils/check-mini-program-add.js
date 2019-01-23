//验证关注公众号
const { request } = require('./request.js')
const { storage_key } = require('./utils.js')
const checkMiniProgramAdd = (scene) => {
  //微信聊天主界面下拉，“最近使用”栏（基础库2.2.4版本起将包含“我的小程序”栏）
  if (scene == 1089) {
    try {
      var res = wx.getSystemInfoSync();
      if (res.SDKVersion >= "2.2.4") {
        console.error("场景验证成功,版本验证成功,版本号：" + res.SDKVersion);
        request({
          funid: 61,
          data: { type: 2 },

          success(res) {
            //如果成功，后端自动给用户加金币。
            console.log("请求接口成功");
          },
          fail(err) {
            console.log("请求接口失败");
          }
        })
      } else {
        console.error("场景验证成功,版本验证失败,版本号：" + res.SDKVersion);
      }
    } catch (e) {
      console.error("catch");
    }
  } else {
    console.error("场景验证失败,场景值：" + scene);
  }

}


module.exports = {
  checkMiniProgramAdd: checkMiniProgramAdd
}