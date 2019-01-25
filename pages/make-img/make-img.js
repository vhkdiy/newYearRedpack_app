import UploadImg from './modules/uploadTempUrl.js';
import ChoseRedpackData from './modules/ChoseRedpackData.js';
import requestData from './modules/requestData.js';
//消息中心
import messageCenter from './../../utils/messagecenter/message_center.js';

let marqueeInterval = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ratio: 1 / 1,
    originUrl: null,
    topImg: "",
    choseRedpackData: ChoseRedpackData,
    choseRedpackIndex: -1,
    marqueeIndex: -1,
    templates: [],
    avatarUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.refreshPageData();

    this.startChoseMarquee();
  },

  refreshPageData() {
    requestData().then((data) => {
      const avatarUrl = data.user && data.user.avatarUrl;
      if (data.templates.length > 0) {

        this.setData({
          templates: data.templates,
          topImg: data.templates[0].imgUrl,
          avatarUrl: avatarUrl
        });

      }

    }).catch((e) => {});
  },

  //没有选择红包前，先开启跑马灯动画
  startChoseMarquee() {
    this.clearChoseMarquee();
    const choseRedpackDataLen = this.data.choseRedpackData.length;

    if (choseRedpackDataLen <= 0) {
      return;
    }

    this.marqueeInterval = setInterval(() => {
      const curIndex = ++this.data.marqueeIndex % choseRedpackDataLen;
      this.setData({
        marqueeIndex: curIndex,
      });
    }, 400);
  },

  clearChoseMarquee() {
    this.marqueeInterval && clearInterval(this.marqueeInterval);
  },

  choseRedpack(e) {
    const choseRedpackIndex = e.currentTarget.dataset.index;
    this.setData({
      choseRedpackIndex: choseRedpackIndex
    });
  },

  choseLocalImg() {

    wx.chooseImage({
      count: 1, //只能选择一张
      success: (res) => {
        const filePath = res.tempFilePaths[0];
        const templates = this.data.templates;

        for (let i = 0, len = templates.length; i < len; i++) {
          if (templates[i].imgUrl == filePath) {
            return;
          }
        }

        templates.push({
          imgUrl: filePath,
          isDefault: 0,
          status: 1,
        });

        this.setData({
          templates: templates,
        });

        UploadImg.uploadTempUrl(filePath);
      },
    });
  },

  getCropperImg(e) {
    wx.showLoading({
      title: '正在加载...',
      mask: true,
    });
    const createImg = e.detail.url;
    UploadImg.uploadComplete(createImg, "", this.data.choseRedpackIndex).then((data) => {

      messageCenter.sendMessage("compositePictureInfo", data.order);
      wx.navigateBack({
        
      });

    }).catch(() =>{

      wx.hideLoading();
    });
  },

  createNewImg() {
    if (this.data.choseRedpackIndex < 0) {
      //没有选择红包的位置的
      wx.showToast({
        title: '请先选择红包藏在哪里哦',
        mask: true,
        icon: "none",
      });

      return;
    }

    const cropper = this.selectComponent("#cropper");
    if (cropper) {
      cropper.cropperImg();
    }
  },

  zhutiItemClick(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      topImg: this.data.templates[index].imgUrl,
    });
  }


})