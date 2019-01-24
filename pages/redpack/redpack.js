// pages/redpack/redpack.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  //去体现
  gotoReflect : function(){

  },
  //去发红包
  gotoSendRedPack : function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //去赞赏
  gotoAdmire : function(){

  },
  //去投诉
  gotoComplain : function(){

  },
  //查看我的记录
  seeRecord : function(){
    wx.navigateTo({
      url: '/pages/myrecord/myrecord',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})