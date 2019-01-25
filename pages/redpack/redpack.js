// pages/redpack/redpack.js
import { requestData } from './js/requestData.js';
import { requestRedPack } from './js/requestRedPack.js';

import { phead } from './../../utils/phead.js'
import loginUtils  from './../../utils/login/login-utils.js'

import  UpdateUserInfo  from './../../utils/user/update-user-info.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //请求必须参数
    orderId : "",
    userId : "",
    openId : "",

    authorized : false,
    avatarUrl : "",
    title : "",
    subTitle : "",
    status: "",      //状态: 1-过期状态, 2-领完状态, 3-领过状态, 4-没机会不可分享状态, 5-没机会可分享状态, 6-正常状态,
    receiveCount: "",  //红包已领取的个数
    redPackCount : "", //红包总个数
    receiveMoney : "", //红包已领取的金额
    redPackMoney : "",  //红包总金额
    vieRecords : "",    //领取记录
    imgUrl :     "",     //背景图片


    isShowType : 0,       //显示弹窗状态
    isShowData : null,    //红包数据

    isShowBottomDialogType : 0


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId : options.orderId || 1,
      userId: options.userId || wx.getStorageSync(loginUtils.getUserIdKey()),
      openId: options.openId || phead.phoneid

    })
    
    
    this.requestData();
  },
  shareclick: function () {
    this.requestData();
  },
  requestData : function(){
    setTimeout(() => {
      let url = `/redPack/${this.data.orderId}?openId=${this.data.openId}&userId=${this.data.userId}`;
      console.error(url);
      requestData(this, url).then((data) => {
        console.log(data);
        this.setData({
          title: data.title,
          subTitle: data.subTitle,
          avatarUrl: data.user.avatarUrl,
          status: data.status,
          receiveCount: data.receiveCount,
          redPackCount: data.redPackCount,
          receiveMoney: data.receiveMoney,
          redPackMoney: data.redPackMoney,
          vieRecords: data.vieRecords,
          imgUrl: data.order.imgUrl,
          authorized: data.user.authorized 
        })
      }).catch(e => {
        console.error("catch");
      });
    }, 300);
  },
  onGotUserInfo : function(e){
    UpdateUserInfo(e,()=>{
      this.requestData();
    });

  },
  //点击红包
  clickRedPack : function(e){
    if (this.data.authorized){
      console.log(e.currentTarget.id);
      let orderId = 1;
      let that = this;
      if (this.data.status == 6) {
        requestRedPack(that, "/redPack", { "orderId": orderId, "redPackIndex": e.currentTarget.id }).then(data => {
          if (data.status == 1) {
            wx.showToast({
              title: '没猜中，请继续',
              icon: 'none'
            })
          } else if (data.status == 2) {
            //没猜中还可以分享，调起微信分享
            this.setData({
              isShowType: 2
            })
          } else if (data.status == 3) {
            //没猜中不可分享
            this.setData({
              isShowType: 3
            })
          } else if (data.status == 4) {
            //猜中了
            this.setData({
              isShowType: 4,
              isShowData: data.record
            })
          } else {
            wx.showToast({
              title: '领取失败',
              icon: 'none'
            })
          }
          this.requestData();

        }).catch(e => {
        })
      } else if (this.data.status == 5) {
        this.setData({
          isShowType: 2
        })
      }
    }else{

    }
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
    wx.switchTab({
      url: '/pages/reflect/reflect',
    })
  },
  //去发红包
  gotoSendRedPack : function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //去赞赏
  gotoAdmire : function(){
    this.setData({
      isShowBottomDialogType : 1
    })
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