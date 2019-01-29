// pages/other/other.js
import {request} from './../../utils/request.js'
import share from './../../utils/share.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    properties: {
      app_title: '财神赐福',
      $title: '财神赐福',
      url: 'page/other/other'
    },
    adArr:[],
    unitId:'',
    isCloseAd:1,
    questionsUrl:'https://ibestfanli.com/frontend_step_service/views/step/normalQuestion1/normalQuestion1.html?t='+Date.now()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request({
      url:'/ad',
      success:(result)=>{
        console.log('ad----------data',result);
        this.setData({
          adArr: result.adJson && result.adJson.ad_list,
          unitId: result.gdtId,
          isCloseAd: result.openAd
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return share.get("/pages/index/index", "", getApp(), {
      page: '更多好玩',
      share_module: "右上角分享"
    });
  }
})