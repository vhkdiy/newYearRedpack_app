//通用网页

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
  }
})