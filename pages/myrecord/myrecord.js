// pages/myrecord/myrecord.js
import { requestData } from './js/requestData.js';
import { phead } from './../../utils/phead.js'
import loginUtils from './../../utils/login/login-utils.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollViewHeight: 0,  //scroll列表高度
    animationCss: 'scrollBlock',
    selectIndex: 0,       //按钮选中的

    avatarUrl  : '',
    nickName  : '',
    statusString: '共发出',

    monry : '',
    count : '',

    requestData : null,
    currentShowList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    requestData().then((data) => {
      console.error(data);
      this.setData({
        requestData : data,
        avatarUrl: data.avatarUrl,
        nickName: data.nickName,
        monry: data.sendTotalMoney,
        count: data.sendTotalNum
      })
      this.setListHeight();
      console.error(data);
    }).catch(e => {
      console.error("catch");
      console.error(e);
    });

  },
  //设置列表的高度
  setListHeight : function(){
    let count = this.data.requestData.sendRedPackList.length > this.data.requestData.redPackVieRecordList.length ? this.data.requestData.sendRedPackList.length : this.data.requestData.redPackVieRecordList.length;
    this.setData({
      scrollViewHeight: count * 140 + 85
    });
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

  swiperChange: function (e) {
    console.log(e.detail.current);
    this.setCurrentData(e.detail.current);
  },
  btnClick: function (e) {
    console.log(e.currentTarget.id);
    this.setCurrentData(e.currentTarget.id);
  },
  setCurrentData : function(index){
    this.setData({
      selectIndex: index,
      animationCss: `scrollBlock${index}`,
      monry: index == 1 ? this.data.requestData.gainTotalMoney : this.data.requestData.sendTotalMoney,
      count: index == 1 ? this.data.requestData.gainTotalNum : this.data.requestData.sendTotalNum,
      statusString: index==1 ? "共收到" : "共发出"
    })
  },
  //点击我自己发送出去的纪录
  sendItemClick : function(e){
    let data = e.currentTarget.dataset.data;
    console.log(`/pages/redpack/redpack?orderId=${data.id}&openid=${phead.phoneid}&userId=${wx.getStorageSync(loginUtils.getUserIdKey())}`);
    wx.navigateTo({
      url: `/pages/redpack/redpack?orderId=${data.id}&openid=${phead.phoneid}&userId=${wx.getStorageSync(loginUtils.getUserIdKey())}`,
    })
  },
  //点击我收到的记录
  receiveItemClick : function(e){
    let data = e.currentTarget.dataset.data;
    console.log(data);
    console.log(`/pages/redpack/redpack?orderId=${data.orderId}&openid=${data.redPackSendOrder.user.openId}&userId=${data.userId}`);
    wx.navigateTo({
      url: `/pages/redpack/redpack?orderId=${data.redPackSendOrder.id}&openid=${data.redPackSendOrder.user.openId}&userId=${data.userId}`,
    })
  }
})