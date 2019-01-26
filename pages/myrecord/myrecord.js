// pages/myrecord/myrecord.js
import { requestData } from './js/requestData.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollViewHeight: 0,  //scroll列表高度
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
    this.setData({
      selectIndex: e.detail.current,
      monry: e.detail.current ? this.data.requestData.gainTotalMoney : this.data.requestData.sendTotalMoney,
      count: e.detail.current ? this.data.requestData.gainTotalNum : this.data.requestData.sendTotalNum,
      statusString : e.detail.current ? "共收到" : "共发出"
    })
  },
  btnClick: function (e) {
    this.setData({
      selectIndex: e.currentTarget.id
    })
  }
})