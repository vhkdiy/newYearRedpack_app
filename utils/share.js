const { request } = require('./request.js');
const { phead } = require('./phead.js');
import getUserInfo from './../utils/user/get-user-info.js';

//分享类型
import shareType from './share-type.js';

var username = "好友";   //默认

var shareId = '';
var utm_source, utm_medium, utm_campaign, utm_content, utm_term;

var title = '[新年红包] $userName给你发了一个红包';
var imageUrl = 'https://img.xmiles.cn/caiziwanzhe/paba/1c5825f9b5925cb07c062616d2ef6a2.png';

var title1 = '[新年红包] $userName给你发了一个红包【$redpackTitle】';
var imageUrl1 = 'https://img.xmiles.cn/caiziwanzhe/paba/1c5825f9b5925cb07c062616d2ef6a2.png';


var getPath = function (path_url,param, type, shareId, title, button) {
  let sufix = '?';
  if (path_url.includes("?")) {
    sufix = "&"
  }
  var path = path_url + `${sufix}openId=${phead.phoneid}&userId=${phead.userId}`;

  if (utm_source) {
    path += '&utm_source=' + utm_source;
  }
  if (utm_medium) {
    path += '&utm_medium=' + utm_medium;
  }
  if (utm_campaign) {
    path += '&utm_campaign=' + utm_campaign;
  }
  if (utm_content) {
    path += '&utm_content=' + utm_content;
  }
  if (utm_term) {
    path += '&utm_term=' + utm_term;
  }
  if (param) {
    path += '&' + param;
  }
  if (type) {
    path += '&type=' + type;
  }
  if (shareId) {
    path += '&share_id=' + shareId;
  }
  if (title) {
    path += '&share_content=' + title;
  }
  if (button) {
    path += '&share_button=' + button;
  }
  console.log(path);
  return path;
}

module.exports = {
  update: function() {
    // request({
    //   funid: 1006,
    //   success: (res) => {
    //     console.log(res);
    //     shareId = res.shareId || shareId;
        
    //     utm_source = res.utm_source;
    //     utm_medium = res.utm_medium;
    //     utm_campaign = res.utm_campaign;
    //     utm_content = res.utm_content;
    //     utm_term = res.utm_term;

    //     if (res.shareVos) {
    //       for(let item of res.shareVos){
    //         //普通分享
    //         if (item.share_type == parseInt(shareType.SHARE_TYPE_NORMAL0)){
    //           title = item.tip || title;
    //           imageUrl = item.image || imageUrl;
    //         } 
    //       }
    //     }
    //   },
    //   fail: () => {

    //   }
    // })

    getUserInfo().then((data)=>{
      if (data.authorized){
        username = data.nickName || username;
      }
    }).catch(()=>{
    });
  },

  get: function (path_url = "/pages/index/index", param, app, shareContent, innerImageUrl, goodLuck) {
    //只是执行了name的替换
    title = title.replace(/\$userName/g,username);
    title = title.replace(/\$goodLuck/g, goodLuck || "");
    if (app) {
      app.sensors.track('Share', Object.assign({
        share_content_id: shareId,
        share_content: title,
        ...shareContent
      }));
    }
    wx.showShareMenu({
      withShareTicket: true
    })
    let params = { imageUrl: innerImageUrl || imageUrl };
    if (!params.imageUrl || innerImageUrl == "undefined") {   //如果imageUrl是undefined 就删掉 默认采用截图
      delete (params.imageUrl);
    }
    return {
      ...params,
      title: title,
      path: getPath(path_url,param, shareType.SHARE_TYPE_NORMAL0, shareId, title, shareContent.page + '-' + shareContent.share_module)
    }
  },


  //红包
  getRedpack: function (path_url = "/pages/index/index", param, shareContent, redpackTitle, shareImg) {
    //只是执行了name的替换
    let title = title1.replace(/\$userName/g, username);
    title = title.replace(/\$redpackTitle/g, redpackTitle || "恭喜发财");

    const app = getApp();
    if (app) {
      app.sensors.track('Share', Object.assign({
        share_content_id: shareId,
        share_content: "",
        ...shareContent
      }));
    }

    let params = { imageUrl: shareImg || imageUrl1 };
    if (!params.imageUrl) {   //如果imageUrl是undefined 就删掉 默认采用截图
      delete (params.imageUrl);
    }

    const page = (shareContent && shareContent.page) || "";
    const share_module = (shareContent && shareContent.share_module) || "";

    wx.showShareMenu({
      withShareTicket: true,
    });

    return {
      ...params,
      title: title,
      path: getPath(path_url, param, shareType.RED_PACK, shareId, title, page + '-' + share_module)
    }
  },
  getRedpackShare: function (path_url = "/pages/index/index", param, shareContent, redpackTitle, shareImg) {
    //只是执行了name的替换
    let title = title1.replace(/\$userName/g, username);
    title = title.replace(/\$redpackTitle/g, redpackTitle || "恭喜发财");

    const app = getApp();
    if (app) {
      app.sensors.track('Share', Object.assign({
        share_content_id: shareId,
        share_content: "",
        ...shareContent
      }));
    }

    let params = { imageUrl: shareImg || imageUrl1 };
    if (!params.imageUrl) {   //如果imageUrl是undefined 就删掉 默认采用截图
      delete (params.imageUrl);
    }

    const page = (shareContent && shareContent.page) || "";
    const share_module = (shareContent && shareContent.share_module) || "";

    wx.showShareMenu({
      withShareTicket: true,
    });

    return {
      ...params,
      title: title,
      path: getPath(path_url, param, shareType.GET_NEW_CHANCE, shareId, title, page + '-' + share_module)
    }
  },

}