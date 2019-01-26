//通用网页
import { submitAuth } from './js/submitAuth.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title,
    })
    var url = options.url;
    if (url) {
      url = decodeURIComponent(url);
      console.log("url " + url)
      this.setData({
        url: url
      })
    }
  },
  bindmessage : function(e){
    console.log("收到网页数据了");
    console.error(e);
    let data = e.detail.data[0];
    console.log(data); 
    let url = `/wxWebPageOauth2CallBack?accessToken=${data.accessToken}&code=${data.code}&state=${data.state}`;
    console.error(url);
    submitAuth(this, url).then((data) => {
      if (data.state  == 1) {
        console.log("成功");
        console.error(url);
      }else{
        wx.showToast({
          title: '授权失败，请进行授权后才能完成提现',
        })
      }
    }).catch(e => {
      console.error("catch");
    });
  }
})