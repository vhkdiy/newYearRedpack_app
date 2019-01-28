import UploadImg from './modules/uploadTempUrl.js';
import requestData from './modules/requestData.js';
//消息中心
import messageCenter from './../../utils/messagecenter/message_center.js';
import storageUtils from './../../utils/storage/storage-utils.js';
import PageSignal from './modules/page-signal.js';

let marqueeInterval = null;

const Key_IsFirstIn = "make_img_page_Key_IsFirstIn";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ratio: 1 / 1,
    originUrl: null,
    topImg: "",
    choseRedpackData: [],
    choseRedpackIndex: -1,
    marqueeIndex: -1,
    templates: [],
    avatarUrl: "",
    isShowNewUserGuide: false,
    isShowChoseRedpackTip: false,
    selectTempIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    PageSignal.guideSignal.add(this.updateNewUserGuideDialog);
    this.refreshPageData();

  },
  onUnload: function () {
    this.saveStateData();
    const cropper = this.selectComponent("#cropper");
    if (cropper) {
      cropper.saveStateData();
    }
  },

  saveStateData() {
    const selectTempIndex = this.data.selectTempIndex;
    const choseRedpackIndex = this.data.choseRedpackIndex;
    const lastMakeImgData = {};
    lastMakeImgData.selectTempIndex = selectTempIndex;
    lastMakeImgData.choseRedpackIndex = choseRedpackIndex;
    const app = getApp();
    app.lastMakeImgData = lastMakeImgData;
  },

  restoreSateData() {
    const app = getApp();
    const lastMakeImgData = app.lastMakeImgData;
    const data = this.data;
    if (lastMakeImgData) {

      this.setData({
        ...lastMakeImgData
      });

      const selectTempIndex = lastMakeImgData.selectTempIndex;
      if (selectTempIndex > -1) {
        const topImg = data.templates && data.templates[selectTempIndex] && data.templates[selectTempIndex].imgUrl;

        this.setData({
          topImg: topImg
        });
      }
    }
  },

  refreshPageData() {
    requestData().then((data) => {
      const avatarUrl = data.user && data.user.avatarUrl;

      this.setData({
        templates: data.templates || [],
        topImg: data.templates && data.templates[0] && data.templates[0].imgUrl,
        avatarUrl: avatarUrl,
        choseRedpackData: data.redPackTemplates,
      });


      this.startChoseMarquee();

      this.checkShowNewUserGuide();

      const cropper = this.selectComponent("#cropper");
      if (cropper) {
        cropper.restoreStateData();
      }
      this.restoreSateData();


    }).catch((e) => {});
  },

  updateNewUserGuideDialog(isShow) {
    this.setData({
      isShowNewUserGuide: isShow,
    });
  },

  checkShowNewUserGuide() {
    const value = storageUtils.getStorageSync(Key_IsFirstIn);
    if (value != 1) {
      this.updateNewUserGuideDialog(true);
      storageUtils.setStorageSync(Key_IsFirstIn, 1);
    }
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

        if (filePath.includes('.gif')) {
          wx.showToast({
            title: '不支持gif图片',
            icon: "none",
          });
          return;
        }

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

    let inputString = "";
    const cropper = this.selectComponent("#cropper");
    if (cropper) {
      inputString = cropper.getInputString();
    }

    UploadImg.uploadComplete(createImg, inputString, this.data.choseRedpackIndex).then((data) => {
      messageCenter.sendMessage("compositePictureInfo", data.order);
      wx.navigateBack({});
    }).catch(() => {

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

      this.setData({
        isShowChoseRedpackTip: true,
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
      selectTempIndex: index,
      topImg: this.data.templates[index].imgUrl,
    });
  }


})