import {
  request
} from './../../../utils/request.js';

const requestData = () => {
  return new Promise((r, j) => {
    request({
      url: "/img",
      method: "GET",
      loading: true,
      success: (res) => {
        r(res);
      },
      fail: (res) => {
        j(res);
        wx.showToast({
          title: res && res.msg,
          icon: 'none',
        });
      }
    });
  });
}

export default requestData;