const { request } = require('./request.js')
const { phead } = require('./phead.js')

//分享类型
import shareType from './share-type.js';

var username = "好友";   //默认

var shareId = '';
var utm_source, utm_medium, utm_campaign, utm_content, utm_term;

var title = '[财神@我]2019年看看你的财运在哪里，一夜暴富的机会别错过了';
var imageUrl = 'https://img.xmiles.cn/fortune_telling/shareImage.png';

var title1 = '2019年我将靠$goodLuck腰缠万贯，来看看你的暴富机会在哪里？';
var imageUrl1 = 'https://img.xmiles.cn/wechat/shareicon.png';


var getPath = function (path_url,param, type, shareId, title, button) {
  var path = path_url + '?openId=' + phead.phoneid;
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

const getUserInfo = () => {
  return new Promise((resolve,reject)=>{
      request({
        // funid: 9,
        url : '/user',
        method : 'GET',
        data: {},
        success: (res) => {
          resolve(res)
        },
        fail : () => {
          reject();
        }
      })
  })
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
      if(data.authorizedUserInfo){
        username = data.userInfo.nick_name || username;
      }
    }).catch(()=>{

    });

  },
  get: function (path_url = "/pages/index/index", param, app, shareContent, innerImageUrl, goodLuck) {
    //只是执行了name的替换
    title = title.replace(/\$name/g,username);
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
  //分享画布
  getShare: function (path_url = "/pages/index/index", param, app, shareContent, innerImageUrl, goodLuck) {
    //只是执行了name的替换
    title1 = title1.replace(/\$name/g, username);
    let replaceTitle = title1.replace(/\$goodLuck/g, goodLuck || "");
    if (app) {
      app.sensors.track('Share', Object.assign({
        share_content_id: shareId,
        share_content: replaceTitle,
        ...shareContent
      }));
    }
    wx.showShareMenu({
      withShareTicket: true
    })
    let params = { imageUrl: innerImageUrl || imageUrl1 };
    if (!params.imageUrl || innerImageUrl == "undefined") {   //如果imageUrl是undefined 就删掉 默认采用截图
      delete (params.imageUrl);
    }
    return {
      ...params,
      title: replaceTitle,
      path: getPath(path_url, param, shareType.SHARE_TYPE_NORMAL0, shareId, replaceTitle, shareContent.page + '-' + shareContent.share_module)
    }
  }
}