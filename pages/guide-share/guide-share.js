import share from './../../utils/share.js';
import GuideShareSignal from './modules/guide-share-signal.js';
import signals from './../../utils/signals/signals.min.js';
const Signal = signals.Signal;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowGetPayStateDialog: true,
  },

  onLoad: function(options) {
    GuideShareSignal.getPayStateDialog = new Signal(),
      GuideShareSignal.getPayStateDialog.add(this.updateGetPayStateConfig);
    //屏蔽右上角分享按钮
    wx.hideShareMenu();
  },

  updateGetPayStateConfig(isShow) {
    if (this.data.isShowGetPayStateDialog != isShow) {
      this.setData({
        isShowGetPayStateDialog: isShow,
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return share.getRedpack();

  },

  createImgClick() {
    wx.navigateTo({
      url: '/pages/create-img/create-img?',
    });
  }

})