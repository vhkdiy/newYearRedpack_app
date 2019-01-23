

const { request } = require('./../request.js');
const { phead } = require('./../phead.js');
const app = getApp();
const key = "AdDetailId";
const inviteRedPackKey = "inviteRedPackKey";

const local_update_time = "loacalUploadTime";

// const statistics = require('./../../../utils/statistics.js');


//耗时回调
const returnTime = (time,sensors_ad_page_return_url, properties) => {
  if (!sensors_ad_page_return_url) return;
  //神策点击埋点
  for (let return_url of sensors_ad_page_return_url) {
    wx.request({
      url: return_url,
      data: {
        data: {
          phead: phead,
          distinct_id: app.sensors.store.getDistinctId(),
          properties: {
            ...app.sensors.getPresetProperties(),
            ...properties,
            return_costtime : time,
            // is_first_day : app.sensors.store.getIsFirstDay()
          }
        }
      },
    })
  }
}

//非任务中心

//标记耗时开始
/**
 * 传递额外的参数，标识
 *extraData:{
     from:'googsInviteDialog',           
  }
*/
const signUploadTime = (data) => {
  console.log(typeof data);
  try {
    if (typeof data == 'object' && data.time && data.sensors_ad_page_return_url) {
      wx.setStorageSync(local_update_time, JSON.stringify(data));
    } else {
      console.log("signUploadTime 传入参数存在问题！");
    }
  } catch (e) {
    console.log("catch signUploadTime 传入参数存在问题！");
  }
}

const signUploadTimeByKey = (key, data) => {
  console.log(typeof data);
  try {
    if (typeof data == 'object' && data.time && data.sensors_ad_page_return_url) {
      wx.setStorageSync(key, JSON.stringify(data));
    } else {
      console.log("signUploadTime 传入参数存在问题！");
    }
  } catch (e) {
    console.log("catch signUploadTime 传入参数存在问题！");
  }
}


//上传耗时
const uploadTime = (callBack) => {
  try{
    let json = JSON.parse(wx.getStorageSync(local_update_time));
    console.log(json);
    let saveTime = json.time;
    let time = parseInt(Date.parse(new Date()) / 1000) - saveTime;

    let properties = Object.assign({...json});
    delete properties["time"];
    delete properties["sensors_ad_page_return_url"];
    delete properties["extraData"];
    console.log(properties);

    returnTime(time, json.sensors_ad_page_return_url, properties);
    //删除已经回调的数据
    wx.removeStorageSync(local_update_time);    

    callBack && callBack(time >= 20 , json);

  }catch(e){
    console.log("catch uploadTime");
  }
}

const uploadTimeByKey = (key, callBack) => {
  try{
    let json = JSON.parse(wx.getStorageSync(key));
    console.log(json);
    let saveTime = json.time;
    let time = parseInt(Date.parse(new Date()) / 1000) - saveTime;

    let properties = Object.assign({...json});
    delete properties["time"];
    delete properties["sensors_ad_page_return_url"];
    delete properties["extraData"];
    console.log(properties);

    returnTime(time, json.sensors_ad_page_return_url, properties);
    //删除已经回调的数据
    wx.removeStorageSync(key);    

    callBack && callBack(time >= 20 , json);

  }catch(e){
    console.log("catch uploadTime");
  }
}

const uploadTimeByKeyAndAdTime = (key, adTime = 20, callBack) => {
  try{
    let json = JSON.parse(wx.getStorageSync(key));
    console.log(json);
    let saveTime = json.time;
    let time = parseInt(Date.parse(new Date()) / 1000) - saveTime;

    let properties = Object.assign({...json});
    delete properties["time"];
    delete properties["sensors_ad_page_return_url"];
    delete properties["extraData"];
    console.log(properties);

    returnTime(time, json.sensors_ad_page_return_url, properties);
    //删除已经回调的数据
    wx.removeStorageSync(key);    

    callBack && callBack(time >= adTime , json);

  }catch(e){
    console.log("catch uploadTime");
  }
}


//任务中心
//successCallback 是给 任务中心处理后续状态用的，首页不需要传递
//参数1 是否需要显示提示弹窗    参数2 是神策埋点   参数3 是成功回调，如果后续需要操作，就传递回调进来
const checkAdTime = (showModal = false,properties,successCallback) => {
  let that = this;
  //执行非任务中心耗时统计回调
  // uploadTime();

  //任务中心耗时统计回调
  try {
    let json = JSON.parse(wx.getStorageSync(key));
    let saveTime = json.time;
    let time = parseInt(Date.parse(new Date()) / 1000) - saveTime;
    //耗时回调
    returnTime(time,json.sensors_ad_page_return_url, properties);
    json.type = 1;
    request({
      funid: 46,
      data: json,
      success: (res) => {
        // task_status     0表示任务未完成   1表示任务完成
        // task_keep_time  表示需要多少时间才可以
        //待领取 
        let hasShow = json.task_type == 1 && res.taskStatus == 0 && res.taskKeepTime;
        hasShow && showModal && wx.showModal({
          title: '温馨提示',
          content: `需要试用${res.taskKeepTime}秒以上并授权，才可以获得奖励哦！`,
          showCancel: false,
          success: function (res) { }
        })
        successCallback && successCallback(res, json, hasShow);
        wx.removeStorageSync(key);
      },
      fail: (e) => { 
        console.log(e);
      }
    })
  } catch (e) {
    console.log(e);
  }
}

//标记邀请红包广告
const signInviteRedPackCheck = (data) => {
  try {
    if (typeof data == 'object' && data.adId && data.time && data.sensors_ad_page_return_url) {
      request({
        funid: 82,
        data: {
          "adId": data.adId,
          "type": 1
        },
        success: (res) => {
          wx.setStorageSync(inviteRedPackKey, JSON.stringify(data));
        }
      });
      console.log("signInviteRedPackCheck 成功");
    } else {
      console.log("signInviteRedPackCheck 传入参数存在问题！");
    }
  } catch (e) {
    console.log("catch signInviteRedPackCheck 传入参数存在问题！");
  }
}

//邀请红包广告耗时
const inviteRedPackCheck = (that,showModal = false, properties, successCallback) => {
  //任务中心耗时统计回调
  try {
    let json = JSON.parse(wx.getStorageSync(inviteRedPackKey));
    let saveTime = json.time;
    let time = parseInt(Date.parse(new Date()) / 1000) - saveTime;
    //耗时回调
    returnTime(time, json.sensors_ad_page_return_url, properties);
    request({
      funid: 82,
      data: {
        "adId": json.adId,
        "type": 2
      },
      success: (res) => {
        successCallback && successCallback(res, json);
        reloadInviteRedPack(that)
        that.setData({
          isShowMiniProgramPop: false
        })
      },
      fail: (e) => {
        //显示小程序提示弹窗
        if(showModal){
          that.setData({
            isShowMiniProgramPop: true
          })
          try {
            // statistics.track(that, 'XMShow', {
            //   "show_contentid": json.title,
            //   "show_module": "广告20s弹框",
            //   "page": "/pages/index/index"
            // });
            app.sensors.track('XMShow', {
              "show_contentid": json.title,
              "show_module" : "广告20s弹框",
              "page" : "/pages/index/index"
            });
          } catch (e) {

          }
        }
      },
      complete: function () {
        wx.removeStorageSync(inviteRedPackKey);
      }
    })
  } catch (e) {
  }
}
//调用红包刷新按钮
const reloadInviteRedPack = function(that){
  request({
    funid: 53,
    loading: true,
    success: (res) => {
      that.setData({
        inviteRedPackList: res.redpackVos,
        remainBalance: res.remainBalance,
        inviteRedPackAd: res.adVo && res.adVo.ad_list && res.adVo.ad_list.length > 0 ? res.adVo.ad_list[0] : {}
      })
    },
    fail: (e) => {
    }
  })
}


module.exports = {
  key : key,
  inviteRedPackKey: inviteRedPackKey,
  checkAdTime: checkAdTime,
  signUploadTime: signUploadTime,
  uploadTime: uploadTime,
  signUploadTimeByKey: signUploadTimeByKey,
  uploadTimeByKey: uploadTimeByKey,
  uploadTimeByKeyAndAdTime: uploadTimeByKeyAndAdTime,
  signInviteRedPackCheck: signInviteRedPackCheck,
  inviteRedPackCheck: inviteRedPackCheck
}