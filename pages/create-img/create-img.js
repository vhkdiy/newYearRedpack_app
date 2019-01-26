import UploadFileManager from "../../utils/upload/UploadFileManager";
import CanvasPalette from './modules/canvas-palette.js';
import wxPromisify from './../../utils/wx-promisify/wx-promisify.js';
const wxSaveImageToPhotosAlbum = wxPromisify(wx.saveImageToPhotosAlbum);

import shareType from './../../utils/share-type.js';
import sceneUtil from './../../utils/share/scene-util.js';
import requestQrcode from './../../utils/share/request-qrcode.js';
import getUserInfo from './../../utils/user/get-user-info.js';


Page({
  shareSceneStr: '',
  /**
   * 页面的初始数据
   */
  data: {
    extraData: {},
    imagePath: null,
    template: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const extraData = JSON.parse(decodeURIComponent(options.data));
    this.setData({
      extraData : JSON.parse(decodeURIComponent(options.data)),
    });

    this.shareSceneStr = sceneUtil.creatQrShareScene({
      "o": extraData.id,
      "t": shareType.RED_PACK,
    });

    console.log("this.shareSceneStr: " + this.shareSceneStr);

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
    });

    Promise.all([
      requestQrcode('', this.shareSceneStr),
      getUserInfo(),
    ]).then((datas) => {

      this.setData({
        template: new CanvasPalette({
          userName: datas[1].nickName,
          userIcon: datas[1].avatarUrl,
          contentImg: extraData.imgUrl,
          qrCodeImg: datas[0],
        }).palette(),
      });

    }).catch((errMsg) => {
      console.error("获取菊花二维码失败了：" + JSON.stringify(errMsg));
      this.handleError();
    });

    const extraData = this.data.extraData;



    this.setData({
      template: new CanvasPalette({
        userName: extraData.nickName,
        userIcon: extraData.avatarUrl,
        contentImg: extraData.imgUrl,
        qrCodeImg: "https://img.xmiles.cn//discovery_service_toutiao_videoprize.png",
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

    if (!imagePath) {
      return;
    }

    wxSaveImageToPhotosAlbum({
      filePath: imagePath,
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