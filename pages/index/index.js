// pages/index/index.js
import handleShare from './modules/handle-share.js';
import config from './../../utils/config.js';
import loginUtils from './../../utils/login/login-utils.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    properties: {
      app_title: '拜年红包',
      $title: '拜年红包',
      url: 'page/index/index'
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (config.testServer) {
      wx.setNavigationBarTitle({
        title: `${config.appName}（测试版）`,
      })
    }

    //等待登录
    loginUtils.waitToLogin(this.onLoginSuccess, this.onLoginFail);
  },

  onLoginSuccess() {
    console.log("onLoginSuccess");
  },

  onLoginFail() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  onUnload(){
    //停止监听登录
    loginUtils.unWaitToLogin(this.onLoginSuccess, this.onLoginFail);
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return handleShare();
  }

})