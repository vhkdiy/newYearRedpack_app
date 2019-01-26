// pages/reflect/reflect.js
import { requestHasSlientOauth } from './js/requestHasSlientOauth.js';
import { webview } from './../../utils/router.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMoney : "",      //表示当前有多少余额
    inputValue : "",        //输入金额
    hasSlientOauth : false, //是否授权
    slientOauthUrl : ""     //授权链接
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    requestHasSlientOauth(this, "/user/hasSlientOauth").then((data) => {
      console.log(data);
      if(data.hasSlientOauth == 0){
        webview("授权", data.slientOauthUrl);
      }
    }).catch(e => {
      console.error("catch");
    });
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
  //输入金额
  bindInput : function(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  //全部体现
  allMoneyInput : function(){
    this.setData({
      inputValue : this.data.currentMoney
    })
  },
  //体现
  submitData : function(){
    console.log(this.data.inputValue);
  }
})