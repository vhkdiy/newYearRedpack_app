// pages/redPackageEnter/renPackageEnter.js
import request from './../../utils/request.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userImg:'',
    contentImg:'',
    contentText:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('index--load')
    request.request({
      url:'/index',
      success:function(result){
        console.log(result);
      }
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

  },

  //登录成功
  onLoginSuccess(){
    request({
      url:""
    })
  },


  //底部按钮点击
  handleClickBtn(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }


})