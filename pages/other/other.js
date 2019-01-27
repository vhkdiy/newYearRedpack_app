// pages/other/other.js
import {request} from './../../utils/request.js'
import share from './../../utils/share.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    properties: {
      app_title: '拜年红包',
      $title: '拜年红包',
      url: 'page/other/other'
    },
    adArr:[],
    unitId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request({
      url:'/ad',
      success:(result)=>{
        this.setData({
          adArr: result.adJson && result.adJson.ad_list,
          unitId: result.gdtId
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