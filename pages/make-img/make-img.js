// pages/make-img/make-img.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ratio: 1 / 1,
    originUrl: null,
    topImg: "https://img.xmiles.cn/caiziwanzhe/_/pic.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  choseLocalImg() {
    wx.chooseImage({
      count: 1, //只能选择一张
      success: (res) => {
        this.setData({
          originUrl: res.tempFilePaths[0],
        });
      },
    });
  },

  getCropperImg(e) {
    const createImg = e.detail.url;

    wx.previewImage({
      urls: [createImg],
    });
  },

  createNewImg(){
    const cropper = this.selectComponent("#cropper");
    if (cropper) {
      cropper.cropperImg();
    }
  }

})