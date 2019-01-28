// pages/index/index.js
import handleShare from './modules/handle-share.js';
import config from './../../utils/config.js';
import loginUtils from './../../utils/login/login-utils.js';
import updateWxUserinfo from './../../utils/user/update-wx-userinfo.js';
import { request } from './../../utils/request.js';
import { requestPayment} from './modules/pay.js';
import messageCenter from './../../utils/messagecenter/message_center.js';
import shareType from './../../utils/share-type.js';


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


    userImg:'',        //头像
    compositePicture:'',  //分享图

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
  onLoad: function (options) {
    if (config.testServer) {
      wx.setNavigationBarTitle({
        title: `${config.appName}（测试版）`,
      })
    }

    //判断是否授权
    wx.getSetting({
      success: res => {
        this.setData({
          scopeUserInfo: res.authSetting['scope.userInfo'] ? true : false
        })
      }
    })

    //注册消息
    messageCenter.registerCallback('compositePictureInfo', this.getCompositePictureInfo);
    loginUtils.waitToLogin(this.onLoginSuccess, this.onLoginFail);
  }, 
  
  //请求页面数据
  requestPageData(orderId){
    request({
      url:`/share/index${orderId?"?orderId="+orderId:""}`, 
      method:'get',
      success:(data)=>{
        console.log('pageIndexdata----',data);
        if(data.order){
          let money = data.order.redPackMoney;
          let serviceRate = data.order.serviceRate;
          this.setData({
            userImg: data.user.avatarUrl,
            compositePicture: data.order.imgUrl,
            orderId: data.order.id,
            money: data.order.redPackMoney,
            number: data.order.redPackCount,
            serviceRate: data.serviceCharge,
            serviceMoney: Math.ceil((money * parseFloat(serviceRate)/100) * 100) / 100
          })
        }else{
          this.setData({
            userImg: data.user.avatarUrl,
            compositePicture: data.templateImgUrl,
            serviceRate: data.serviceCharge
          })
        }

      }
    })
  },

  //登录成功
  onLoginSuccess(){
    let options = getApp().globalData.query;


    console.log("onLoginSuccess  options: ", options);
    let showOldData = false;

    if (options.orderId) {
      if ((options.openId || options.userId) && (options.type == shareType.RED_PACK || options.type == shareType.RED_PACK_WITH_IMG)){
        //开红包页
        wx.navigateTo({
          url: `/pages/redpack/redpack?orderId=${options.orderId}&openId=${options.openId}&userId=${options.userId}`,
        })
        wx.setStorageSync("newUserGuidPage", true)
      }else{
        //数据回显
        showOldData = true;
      }
    }else{
      //判断是否是新用户
      if(!wx.getStorageSync("newUserGuidPage")){
        console.log('guid---------------')
        wx.navigateTo({
          url: '/pages/redPackageEnter/renPackageEnter',
        })
        wx.setStorageSync("newUserGuidPage",true)
      }
    }

    this.requestPageData( showOldData?options.orderId:'')
  },



  onReady: function() {
    
  },


  onShow: function(e) {
    //领红包页面授权后返回这个页面要更新用户显示
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] && !this.data.money){
          wx.getUserInfo({
            success:res=>{
              this.setData({
                userImg: JSON.parse(res.rawData).avatarUrl
              })
            }
          })
        }
      }
    })
  },

  onUnload(){
    //返注册
    messageCenter.unRegisterCallback('compositePictureInfo', this.getCompositePictureInfo);
    loginUtils.unWaitToLogin(this.onLoginSuccess);
    loginUtils.unWaitToLogin(this.goInstacne);
  },

  onShareAppMessage: function() {
    return handleShare();
  },

  //获取orderId
  getCompositePictureInfo(data){
    this.setData({
      orderId : data.id,
      compositePicture : data.imgUrl
    })
    console.log('compositePictureInfo',compositePictureInfo)
  },


  //查看案例
  handleInstance(){
    loginUtils.waitToLogin(this.goInstacne);
  },
  goInstacne(){
    //开红包页
    let openId = wx.getStorageSync(loginUtils.getOpenIdKey());
    let userId = wx.getStorageSync(loginUtils.getUserIdKey());
    wx.navigateTo({
      url: `/pages/redpack/redpack?orderId=1&openId=${openId}&userId=${userId}`,
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
  handleMoneyChange(e){
    console.log(e.detail.value)
    let value = e.detail.value;
    if((value.match(/^([0-9]+)(\.[0-9]{0,2})?$/) || value == '') && value.length<=8){
      let money = parseFloat(value) || 0
      this.setData({
        money: value,
        serviceMoney: Math.ceil((money * parseFloat(this.data.serviceRate)/100) * 100) / 100
      }, () => {
        if(value != ''){
          this.formCheckMoney();
          if(parseInt(this.data.number)){
            this.formCheckNumber();
          }
        }
      })
    }else{
      this.setData({
        money: this.data.money
      })
    }

  },

  //数量失去焦点
  handleNumberChange(e) {
    let value = e.detail.value;
    this.setData({
      number: e.detail.value
    }, () => {
      if (value != '') {
        this.formCheckNumber()
      }
    })
  },

  //提交表单
  handleSubmit(e){
    if (this.formCheckMoney(true) && this.formCheckNumber(true) && this.formCheckOrderId()){ 
      //支付 1获取支付信息，2调用支付接口
      requestPayment({
        orderId:this.data.orderId,
        money:this.data.money,
        number:this.data.number,
        success:(e)=>{
          console.log('success---',e);
          this.paySuccess();
          //支付成功埋点
          getApp().sensors.track('recharge', {
            recharge_money:this.data.money,
            is_success:true,
            recharge_fee:this.serviceMoney,
          })
        },  
        fail:(e)=>{
          console.log('fail---',e);
          this.showErrorMsg(e.msg);
          //失败埋点
          getApp().sensors.track('recharge', {
            recharge_money: this.data.money,
            is_success: false,
            recharge_fee: this.serviceMoney,
          })
        }
      });
    }
  },

  //支付成功回调
  paySuccess(){
    request({
      url: '/pay/paySuccess',
      data: {
        orderId: this.data.orderId
      },
      success:(result) => {
        console.log('paysuccess------------------callback', result);


        //跳分享页
        wx.navigateTo({
          url: `/pages/guide-share/guide-share?orderId=${this.data.orderId}`,
        });

        //清空数据
        this.setData({
          orderId:'',
          money:'',
          number:''
        })

      }
    })
  },

  //获取用户信息
  handleGetUserInfo(obj){
    if(obj.detail.userInfo){
      console.log('updateUserInfo')
      updateWxUserinfo({
        success:(userData)=>{
          this.setData({
            userImg:JSON.parse(userData).avatarUrl
          })
        }
      });
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
  },

  formCheckMoney(checkNull){
    let flag = false;
    //赏金判断
    let money = this.data.money;
    if (checkNull && !money){
      this.showErrorMsg('请输入赏金');
      return flag;
    }
    if(money>=1){
      if(money<=50000){
        flag = true;
      }else{
        this.showErrorMsg('打赏金额不能超过50000');
      }
    } else {
      this.showErrorMsg('红包金额不能小于1元');
    }
    return flag;
  },
  formCheckNumber(checkNull){
    let flag = false;
    //数量
    let money = this.data.money;
    let number = this.data.number;
    number = parseInt(number);

    if (checkNull && !number) {
      this.showErrorMsg('请输入数量');
      return flag;
    }
    if (money / number >= 1) {
      flag = true
    } else {
      this.showErrorMsg('单个红包金额不能小于1元');
    }
    return flag;
  },
  formCheckOrderId(){
    let flag = false;
    //判断orderid
    let orderId = this.data.orderId;
    if (orderId) {
      flag = true;
    } else {
      this.showErrorMsg('点击扮演财神选择红包');
    }
    return flag
  }


})