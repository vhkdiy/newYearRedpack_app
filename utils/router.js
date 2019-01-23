import messageCenter from './messagecenter/message_center.js';
import msgKey from './msg-key.js';
const app = getApp();

const navigateTo = (url) => {
  wx.navigateTo({
    url: url,
    fail: function(res) {
      console.log(res);

      switchTab(url);

      // wx.showToast({
      //   title: '找不到页面',
      // })
    }
  })
}

const redirectTo = (url) => {
  wx.redirectTo({
    url: url,
    fail: function (res) {
      console.log(res);
      wx.showToast({
        title: '找不到页面',
      })
    }
  })
}

const home = () => {
  navigateTo('/pages/index/index');
}

/**
 * @title 标题
 * @url 网页链接
 * @eg
 * webview('标题', 'https://xmiles.cn')
 * webview('https://xmiles.cn')
 */
const webview = (title, url) => {
  if (isURL(title)) {
    url = title;
    title = '';
  }
  navigateTo('/pages/webview/index?title=' + title + '&url=' + encodeURIComponent(url));
}

const isURL = (str_url) => {// 验证url
  var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
    + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
    + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
    + "|" // 允许IP和DOMAIN（域名）
    + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
    + "[a-z]{2,6})" // first level domain- .com or .museum
    + "(:[0-9]{1,4})?" // 端口- :80
    + "((/?)|" // a slash isn't required if there is no file name
    + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
  var re = new RegExp(strRegex);
  return re.test(str_url);
}
/**
 * 微信跳转小程序
 */
const navigateToMiniProgram = (appId, path, success, fail) => {
  // console.log(app.sensors.store.getDistinctId());
  wx.navigateToMiniProgram({
    appId: appId,
    path: path,
    // envVersion: "trial",
    extraData:{
      userid: app.sensors.store.getDistinctId()
    },
    success(res) {
      success && success(res);
    },
    fail(){
      fail && fail();
    }
  })
}

const switchTab = (url) => {
  wx.switchTab({
    url: url,
    fail: function (res) {
      console.log(res);
      wx.showToast({
        title: '找不到页面',
      })
    }
  })
}

/**
 * 二跳导航，普通导航不行就尝试切换tab
 */
const secondaryNavi = (url) => {
  wx.navigateTo({
    url: url,
    fail: function(res) {
      wx.switchTab({
        url: url,
        fail: function (res) {
          console.log(res);
          wx.showToast({
            title: '找不到页面',
          })
        }
      })
    }
  })
}

const ADroute = (_type, jump_url) => {
  switch (_type) {
    case 'redirect':
      webview('', jump_url)
      break;
    case 'launch':
      let appid = JSON.parse(jump_url).launchParams.appid
      let path = JSON.parse(jump_url).launchParams.path
      navigateToMiniProgram(appid, path,function(res){

      });
      break;
    case 'image':
    wx.previewImage({
      urls : [jump_url],
      current : jump_url
    })
      // webview('', jump_url)
      break;
    case 'innerpage':
      navigateTo(jump_url)
      break;
    case 'switchtab':
      switchTab(jump_url)
      break;
    case 'index_product_invite_dialog': {
      try{
        const data = JSON.parse(jump_url);
        if (data) {
          messageCenter.sendMessage(msgKey.MSG_INDEX_PRODUCT_INVITE_DIALOG, data);
        }
      } catch(e){}
    }
    break;

    default: 
      break;
  }
}


module.exports = {
  home: home,
  webview: webview,
  redirectTo: redirectTo,
  navigateTo: navigateTo,
  switchTab: switchTab,
  secondaryNavi: secondaryNavi,
  navigateToMiniProgram: navigateToMiniProgram,
  ADroute: ADroute,
}
