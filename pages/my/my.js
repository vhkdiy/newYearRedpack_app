// pages/my/my.js
import getUserInfo from './../../utils/user/get-user-info.js';
import router from './../../utils/router.js';
import share from './../../utils/share.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    unitId:'adunit-0a31082281042761'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getUserInfo().then((data)=>{
      this.setData({
        userImg:data.avatarUrl,
        userName: data.nickName
      })
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
      page: '我的',
      share_module: "右上角分享"
    });
  },


  //点击事件
  handleClick(e){
    let value = e.currentTarget.dataset.value;
    if(value == "wallet"){
      wx.navigateTo({
        url: '/pages/reflect/reflect',
      })
    }
    if (value == "record") {
      wx.navigateTo({
        url: '/pages/myrecord/myrecord',
      })
    }
    if (value == "question") {
      router.webview(
        "常见问题",
        "https://ibestfanli.com/frontend_step_service/views/step/normalQuestion1/normalQuestion1.html?v=" +
        new Date().getTime()
      );
    }
  }

})