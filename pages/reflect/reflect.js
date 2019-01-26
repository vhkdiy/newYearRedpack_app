// pages/reflect/reflect.js
import { requestHasSlientOauth } from './js/requestHasSlientOauth.js';
import { webview } from './../../utils/router.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMoney : "37.21",      //表示当前有多少余额
    inputValue : "",        //输入金额
    hasSlientOauth : false, //是否授权
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.error(options);
    // if (options.accessToken && options.response_type && options.scope && options.state){
    //     //上传授权参数
    //   }else{
    //     // webview("授权", "https://xmiles.cn/frontend_step_service/common?funid=2005&appid=2&service=static_pages&accessToken=123&response_type=456&scope=789&state=123#wechat_redirect");
    //   }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  //输入金额
  bindInput : function(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  //全部体现
  allMoneyInput : function(){
    this.setData({
      inputValue : this.data.currentMoney
    })
  },
  //体现
  submitData : function(){
    requestHasSlientOauth(this, "/user/hasSlientOauth").then((data) => {
      console.error(data);
      if (data.hasSlientOauth == 0) {
        webview("授权", data.slientOauthUrl);
      }else{
        //提交金额
      }
    }).catch(e => {
      console.error("catch");
    });
  }
})