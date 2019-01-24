// pages/index/index.js
import handleShare from './modules/handle-share.js';
import config from './../../utils/config.js';
import loginUtils from './../../utils/login/login-utils.js';

let isRightMoney = false;
let isRightNumber = false;

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


    userImg:'https://img.xmiles.cn//cheated-register/top_banner.png',
    redPackageImg:'https://img.xmiles.cn//cheated-register/top_banner.png',

    inputErrorMsg:'',

    money:'',
    number:''
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


  onReady: function() {
    
  },


  onShow: function() {
  },

  onUnload(){
    //停止监听登录
    loginUtils.unWaitToLogin(this.onLoginSuccess, this.onLoginFail);
  },

  onShareAppMessage: function() {
    return handleShare();
  },

  handleClick(e){
    console.log(e)
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
      }else{
        this.setData({
          money: value
        })
        isRightMoney = true;
      }
    }else{
      this.showErrorMsg('红包金额不能小于1元');
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
      console.log('aabb')
      this.showErrorMsg('单个红包金额不能小于1元');
    }
  },

  //提交表单
  handleSubmit(e){
    if(isRightMoney && isRightNumber){
      console.log('授权，支付')
      //1授权
      //2支付
    }else{
      this.showErrorMsg('请输入金额，数量');
    }
  },


  //显示错误信息
  showErrorMsg(msg){
    this.setData({
      inputErrorMsg:msg
    },()=>{
      setTimeout(()=>{
        this.setData({
          inputErrorMsg:''
        })
      },2000)
    })
  }

})