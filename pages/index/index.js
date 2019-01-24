// pages/index/index.js
import handleShare from './modules/handle-share.js';
import config from './../../utils/config.js';
import loginUtils from './../../utils/login/login-utils.js';
import updateWxUserinfo from './../../utils/user/update-wx-userinfo.js';

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


    userImg:'//img.xmiles.cn//cheated-register/top_banner.png',        //头像
    redPackageImg:'//img.xmiles.cn//cheated-register/top_banner.png',  //分享图

    inputErrorMsg:'',   //错误提示

    money:'',     //金额
    number:'',    //数量

    scopeUserInfo:false   //是否授权获取用户信息
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

    //判断是否授权
    wx.getSetting({
      success: res => {
        this.setData({
          scopeUserInfo : res.authSetting['scope.userInfo'] ? true : false
        })
      }
    })
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

  
  //点击扮演财神按钮
  handleWealthBtn(){
    //跳生成图片页面
    
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
        if(this.data.money/this.data.number<1){
          isRightNumber = false;
          this.showErrorMsg('单个红包金额不能小于1元');
        }
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
      //支付 1获取支付信息，2调用支付接口
      this.getPayInfo().then(()=>{
        wx.requestPayment({

        })
      }).catch(()=>{

      })
    }else{
      this.showErrorMsg('请输入正确的金额或数量');
    }
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