// pages/index/index.js
import handleShare from './modules/handle-share.js';
import config from './../../utils/config.js';
import loginUtils from './../../utils/login/login-utils.js';
import updateWxUserinfo from './../../utils/user/update-wx-userinfo.js';
import { request } from './../../utils/request.js';
import { requestPayment} from './modules/pay.js';
import messageCenter from './../../utils/messagecenter/message_center.js';

let isRightMoney = false;
let isRightNumber = false;
let timeOut = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    properties: {
      app_title: '拜年红包',
      $title: '拜年红包',
      url: 'page/index/index'
    },


    userImg:'//img.xmiles.cn//cheated-register/top_banner.png',        //头像
    redPackageImg:'//img.xmiles.cn//cheated-register/top_banner.png',  //分享图

    orderId:'', 

    inputErrorMsg:'',   //错误提示

    money:'',     //金额
    number:'',    //数量

    serviceMoney:'0.00',   //服务费
    serviceRate: '0',     //费率

    scopeUserInfo:false   //是否授权获取用户信息
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //注册消息用于获取orderId
    messageCenter.registerCallback('compositePictureInfo',this.getOrderId)

    if (config.testServer) {
      wx.setNavigationBarTitle({
        title: `${config.appName}（测试版）`,
      })
    }

    //请求获取服务费率
    request({
      url:'/pay/serviceCharge',
      method:'get',
      success:(result)=>{
        console.log('------result',result)
        this.setData({
          serviceRate:  .02 //result.serviceCharge
        })
      },
      fali:(e)=>{

      }
    })

    //判断是否授权
    wx.getSetting({
      success: res => {
        this.setData({
          scopeUserInfo : res.authSetting['scope.userInfo'] ? true : false
        })
      }
    })
  },

  onReady: function() {
    
  },


  onShow: function(e) {
    
  },

  onUnload(){
    //返注册
    messageCenter.unRegisterCallback('compositePictureInfo', this.getOrderId)
  },

  onShareAppMessage: function() {
    return handleShare();
  },

  //获取orderId
  getOrderId(compositePictureInfo){
    // this.setData({
    //   orderId
    // })
    console.log('compositePictureInfo',compositePictureInfo)
  },


  //查看案例
  handleInstance(){
    wx.navigateTo({
      url: '/pages/redPackageEnter/renPackageEnter',
    })
  },

  
  //点击扮演财神按钮
  handleWealthBtn(){
    //跳生成图片页面
    wx.navigateTo({
      url: '/pages/make-img/make-img'
    })
  },



  //金额失去焦点
  handleMoneyBlur(e){
    isRightMoney = false;
    console.log(e)
    let value = e.detail.value;
    value = parseFloat(value);
    if(value >= 1){
      value = parseFloat(value.toFixed(2));
      if (value > 50000) {
        this.showErrorMsg('打赏金额不能超过50000');
        this.setData({ serviceMoney: '0.00' })
      }else{
        this.setData({
          money: value,
          serviceMoney:  Math.ceil((value*parseFloat(this.data.serviceRate))*100)/100
        })
        isRightMoney = true;
        if(this.data.money/this.data.number<1){
          isRightNumber = false;
          this.showErrorMsg('单个红包金额不能小于1元');
          this.setData({serviceMoney: '0.00'})
        }
      }
    }else{
      this.showErrorMsg('红包金额不能小于1元');
      this.setData({ serviceMoney: '0.00' })
    }
  },

  //数量失去焦点
  handleNumberBlur(e) {
    console.log(e)
    isRightNumber = false;
    let value = e.detail.value;
    if(this.data.money/value >= 1){
      this.setData({
        number: value
      })
      isRightNumber = true;
    } else {
      this.showErrorMsg('单个红包金额不能小于1元');
    }
  },

  //提交表单
  handleSubmit(e){
    if(isRightMoney && isRightNumber){
      //支付 1获取支付信息，2调用支付接口
      this.pay();
    }else{
      !isRightMoney && this.showErrorMsg('红包金额不能小于1元');
      !isRightNumber && this.showErrorMsg('单个红包金额不能小于1元');
    }
  },


  //支付生成红包
  pay(){
    console.log('aa', requestPayment)
  },


  //获取用户信息
  handleGetUserInfo(obj){
    if(obj.detail.userInfo){
      console.log('updateUserInfo')
      updateWxUserinfo();
      this.setData({
        scopeUserInfo:true
      })
    }
  },


  //显示错误信息
  showErrorMsg(msg){
    clearTimeout(timeOut);
    this.setData({
      inputErrorMsg:msg
    },()=>{
      timeOut = setTimeout(()=>{
        this.setData({
          inputErrorMsg:''
        })
      },2000)
    })
  }

})