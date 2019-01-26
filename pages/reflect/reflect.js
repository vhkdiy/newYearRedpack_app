// pages/reflect/reflect.js
import { requestHasSlientOauth } from './js/requestHasSlientOauth.js';
import { requestData } from './js/requestData.js';
import { requestGetMoney } from './js/requestGetMoney.js';
import { webview } from './../../utils/router.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMoney : "",      //表示当前有多少余额
    inputValue : "",        //输入金额
    hasSlientOauth : false, //是否授权
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    requestData(this, "/balance/getUserBalance").then((data) => {
        if (data.state == 1) {
          this.setData({
            currentMoney: data.userBalance
          })
        } else {
          wx.showToast({
            title: data.message,
            icon : 'none'
          })
        }
      }).catch(e => {
        console.error("catch");
      });
    
  },
  //提现
  txFunc : function(monry){
    requestData(this, "/balance/withdrawBalance").then((data) => {
      if (data.state == 1) {
        this.setData({
          currentMoney: data.userBalance
        })
        wx.showToast({
          title: "提现成功",
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    }).catch(e => {
      console.error("catch");
    });
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
        this.txFunc();
        
      }
    }).catch(e => {
      console.error("catch");
    });
  }
})