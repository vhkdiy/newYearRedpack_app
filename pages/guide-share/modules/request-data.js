import {
  request
} from './../../../utils/request.js';

const requestData = (orderId) => {
  return new Promise((r, j) => {
    request({
      url: `/share/detail/${orderId}`,
      method: "GET",
      loading: true,
      success: (data) => {
        r(data);
      },
      fail: (e) => {
        j(e);
        wx.showToast({
          title: e && e.msg || "服务器异常，请稍后重试",
          icon: "none",
          mask: true,
        })
      }
    });
  });
}

export default requestData;