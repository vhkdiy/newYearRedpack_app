import {phead} from './phead.js';

const storage_key = { 
  isFirstEnterWeRunData: 'isFirstEnterWeRunData', //是否首次进入微信授权步数弹窗
  showPopCount : "showPopCount",                   //调用面膜弹窗次数
  isShowGuidanceTip: "isShowGuidanceTip",           //是否显示首页引导到任务中心的提示
  isFirstAddGroup: "isFirstAddGroup",               //是否首次点击添加群
  isShowAddMiniProgamTip: "isShowAddMiniProgamTip"  //是否显示添加小程序的提示
}

/*
 *  判断是否首次进入某页面
 *  传入一个唯一的storage_key 就可以
 */
const isfirstEnterPage = (storage_key,hasWriteFlag=true) => {
  const storage_value = "__enter_page__";
  var value = wx.getStorageSync(storage_key);
  if (value != storage_value){    
    if (hasWriteFlag){                  //表示第一次进入
      wx.setStorageSync(storage_key, storage_value);  //标记非第一次进入
    }
    return true;
  }else{
    return false;
  }
}
/**
 *  判断用户进来次数是否不超过N次
 *  传入一个唯一的storage_key  传入一个次数N  
 *  当触发函数次数小于N返回true 否则返回false
 */
const isEnterPageLessthanN = (storage_key,N) => {
  try{
  if(typeof(N) != 'number' || N < 0 || parseInt(N) != N){
    console.log("请确认传入的类型是否是number,N是否大于0，N是否是整数");
    return;
  }
  let n = (wx.getStorageSync(storage_key) ? parseInt(wx.getStorageSync(storage_key)) : 0) + 1;
  wx.setStorageSync(storage_key, String(n));
  if(n <= N) 
    return n;
  return false;
  }catch(e){

  }
}
/**
 * 本地缓存调用的次数，每次调用，就自动 +1
 * 0开始
 */
const enterPageCount = (storage_key) => {
  try {
    let n = (wx.getStorageSync(storage_key) ? parseInt(wx.getStorageSync(storage_key)) : 0);
    wx.setStorageSync(storage_key, String(n + 1));
    return n;
  } catch (e) {

  }
}

/*
 *  获取当前时间戳
 *  默认参数和分隔符如下   参数1是是否返回带时间的字符串默认true   参数2 表示日期的分隔符   参数3 表示时间分隔符
 *  getDateString(true,"-",":");  
 */
const getDateString = (fullString = true, separate = '-', separateTime = ':') => {
  let currentDate = new Date();//获取系统当前时间
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1; 
  let date = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();
  let dateString = year + separate + month + separate + date;
  
  let hours =      currentDate.getHours()   < 10 ? '0' + currentDate.getHours()   : currentDate.getHours();
  let minutes =    currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
  let seconds = currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds();
  let timeString = hours + separateTime + minutes + separateTime + seconds;

  return dateString + (fullString ? (" " + timeString) : '');
}

/*
 *  判断是否当天首次进入
 */
const isfirstEnterToday = (storage_key) => {
  const storage_value = getDateString(false);   //只是日期字符串
  var value = wx.getStorageSync(storage_key);
  if (value != storage_value) {                      //表示当天第一次进入
      wx.setStorageSync(storage_key, storage_value);   //标记当天非第一次进入
    return true;
  } else {
    return false;
  }
}
/*
  判断是否是记录时间的当天
 */
const isTodaySaveFlag = (storage_key, hasWriteFlag = true) => {
  const storage_value = getDateString(false);   //只是日期字符串
  var value = wx.getStorageSync(storage_key);
  if (!value){  //如果value 没有值
    if (hasWriteFlag){
      wx.setStorageSync(storage_key, storage_value);   //第一次需要写入标记时间
    }
    return true;
  } else if (storage_value === value){
    return true;
  }else{
    return false;
  }
}

/**
 * 是不是自己打开自己的分享链接
 */
const isSelfOpenInivteUrl = function() {

  const globalData = getApp().globalData;
  const query = globalData.query;

  if (phead.phoneid && (query.openId == phead.phoneid)) {
    return true;
  }

  const userid = globalData.bbz_userid;
  const inviteUserid = globalData.sceneObj && globalData.sceneObj.userid;
  if (userid && (userid == inviteUserid)) {
    return true;
  }

  return false;
};

module.exports = {
  storage_key: storage_key,
  isfirstEnterPage: isfirstEnterPage,
  isfirstEnterToday: isfirstEnterToday,
  getDateString: getDateString,
  isEnterPageLessthanN: isEnterPageLessthanN,
  isSelfOpenInivteUrl: isSelfOpenInivteUrl,
  enterPageCount : enterPageCount,
  isTodaySaveFlag: isTodaySaveFlag
}