import UploadFileManager from "../../utils/upload/UploadFileManager";
import CanvasPalette from './modules/canvas-palette.js';
import wxPromisify from './../../utils/wx-promisify/wx-promisify.js';
const wxSaveImageToPhotosAlbum = wxPromisify(wx.saveImageToPhotosAlbum);

Page({

  

  /**
   * 页面的初始数据
   */
  data: {
    imagePath: null,
    template: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.careteImg();
  },

  choseImg(e) {
    wx.chooseImage({
      success: (e) => {
        console.log(e)
        UploadFileManager.uploadImgToQiniu(e.tempFilePaths[0]).then((imgUrl) => {
          console.log("imgUrl:" + imgUrl);
        });
      },
    });
  },

  careteImg() {
    wx.showLoading({
      title: '图片生成中',
      mask: true,
    })

    // Promise.all([
    //   requestQrcode(this.sence, this.gzhSceneStr)
    // ]).then((datas) => {
    //   this.setData({
    //     template: new CanvasPalette({

    //       userIcon: "",
    //       qrCodeImg: datas[0],

    //     }).palette(),
    //   });
    // }).catch((errMsg) => {

    //   console.error("获取菊花二维码失败了：" + JSON.stringify(errMsg));
    //   this.handleError();

    // });

    this.setData({
      template: new CanvasPalette({
        userName: "faknvafdn",
        contentImg: "https://img.xmiles.cn//choose_bid_for_friends/banner.png",
        userIcon: "https://img.xmiles.cn//choose_bid_for_friends/banner.png",
        qrCodeImg: "https://img.xmiles.cn//choose_bid_for_friends/banner.png",
      }).palette(),
    });
  },

  onImgOK(e) {
    //生成图片成功的回调
    this.imagePath = e.detail.path;
    wx.hideLoading();
  },

  imgErr() {
    this.handleError();
  },

  handleError() {
    wx.hideLoading();
    wx.showToast({
      title: '失败了，请重试',
      icon: 'none',
    })
  },

  saveImgBtnClick() {
    const imagePath = this.imagePath;

    wxSaveImageToPhotosAlbum({
      filePath: this.imagePath,
    })
      .then(() => {
        wx.showToast({
          title: '保存图片成功！',
          icon: "none",
        });
      })
      .catch((res) => {
        console.log('保存图片失败了');
        console.log(res);
        if (res.errMsg.indexOf('auth') != -1) {
          //授权没有成功的
          wx.previewImage({
            urls: [imagePath],
          });
        }
      });
  },
});