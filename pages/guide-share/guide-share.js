import share from './../../utils/share.js';
import GuideShareSignal from './modules/guide-share-signal.js';
import Conts from './modules/conts.js';
import requestData from './modules/request-data.js';
import {
  phead
} from './../../utils/phead.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowGetPayStateDialog: false,
    isPaySuccess: false,
    order: {},
  },

  onLoad: function(options) {
    Conts.orderId = options.orderId;

    GuideShareSignal.getPayStateDialog.add(this.updateGetPayStateConfig);
    GuideShareSignal.notifyPaySuccess.add(this.notifyPaySuccess);


    //屏蔽右上角分享按钮
    wx.hideShareMenu();

    requestData(Conts.orderId).then((data) => {
      const isPaySuccess = data.order.status > 0;
      
      data.order.notice = data.notice;

      this.setData({
        order: data.order,
        isShowGetPayStateDialog: isPaySuccess
      });
    }).catch(() => {

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

  onShareBtnClick() {
    this.checkPaySuccess();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return share.getRedpack(`/pages/redpack/redpack?orderId=${Conts.orderId}`);
  },

  createImgClick() {

    if (!this.checkPaySuccess()) {
      return;
    }

    const order = this.data.order;

    wx.navigateTo({
      url: `/pages/create-img/create-img?data=${encodeURIComponent(JSON.stringify(order))}`,
    });
  },

  checkPaySuccess() {
    if (this.data.isPaySuccess) {
      return true;
    }

    GuideShareSignal.getPayStateDialog.dispatch(true);
    return false;
  },

  //我也领一个按钮点击了
  onGetOneBtnClick() {
    const userId = this.data.order.userId;
    if (!userId) {
      return;
    }

    const path = `/pages/redpack/redpack?orderId=${Conts.orderId}&userId=${userId}&openid=&openId=${phead.phoneid}`;

    wx.redirectTo({
      url: path,
    });
    
  },

})