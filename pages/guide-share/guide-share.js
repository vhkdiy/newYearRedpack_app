import share from './../../utils/share.js';
import GuideShareSignal from './modules/guide-share-signal.js';
import Conts from './modules/conts.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowGetPayStateDialog: false,
    isPaySuccess: false,
  },

  onLoad: function(options) {
    Conts.orderId = options.orderId;

    GuideShareSignal.getPayStateDialog.add(this.updateGetPayStateConfig);
    GuideShareSignal.notifyPaySuccess.add(this.notifyPaySuccess);


    //屏蔽右上角分享按钮
    wx.hideShareMenu();
    console.log(" Conts.orderId : " + Conts.orderId);

    this.setData({
      isShowGetPayStateDialog: true,
    });
  },

  updateGetPayStateConfig(isShow) {
    if (this.data.isShowGetPayStateDialog != isShow) {
      this.setData({
        isShowGetPayStateDialog: isShow,
      });
    }
  },

  notifyPaySuccess() {
    this.setData({
      isPaySuccess: true,
    });
  },

  onShareBtnClick(){
    this.checkPaySuccess();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return share.getRedpack();
  },

  createImgClick() {

    if (!this.checkPaySuccess()) {
      return;
    }
   

    wx.navigateTo({
      url: '/pages/create-img/create-img?',
    });
  },

  checkPaySuccess(){
    if (this.data.isPaySuccess) {
      return true;
    }

    GuideShareSignal.getPayStateDialog.dispatch(true);
    return false;
  },

  //我也领一个按钮点击了
  onGetOneBtnClick() {
    wx.redirectTo({
      url: '',
    });
  },

})