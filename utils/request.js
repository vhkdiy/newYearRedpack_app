const { phead } = require("./phead.js");
const crypt = require("./crypt.js");
const { host } = require("./config.js");
import pako from "../utils/pako.min.js";

const IS_SHANDLE = false; //是否启用压缩

const COMMON_FAIL_DATA = {
  status: 0,
  errorcode: 0,
  msg: "网络异常，请重试"
};

const request = config => {
  if (!config.withoutLogin && !phead.access_token) {
    config.retry = config.retry | 0;
    if (config.retry < 15) {
      setTimeout(function() {
        config.retry += 1;
        request(config);
      }, 1000);
      return;
    } else {
      try {
        config.fail && config.fail({ status: -6, msg: "登录超时" });
        return;
      } catch (e) {}
    }
  }
  const data = {
    data: Object.assign(
      {
        phead: phead,
        ispage: 1
      },
      config.data
    ),
    shandle: IS_SHANDLE ? 1 : 0,
    // shandle: 0,
    handle: 0
  };
  // console.log(JSON.stringify(data.data.phead));
  config.service = config.service ? config.service : "newYearRedpack_service";
  config.loading &&
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
  wx.showNavigationBarLoading();

  let url = host +
    config.service +
    config.url + "?rd=" + Date.now();
  if(config.url.indexOf('http') == 0){
    url = config.url
  }
  wx.request({
    url: url,
    data: data,
    header: {"Authorization" : JSON.stringify(phead)},
    method: config.method || 'POST',
    responseType: IS_SHANDLE ? "arraybuffer" : "text",
    success: function(res) {
      if (true) {
        console.log("==========request============:");
        console.log("url: " + url);
        console.log("data: ", data);
        console.log("res: ", res);
      }

      config.loading && wx.hideLoading();
      wx.hideNavigationBarLoading();
      if (res.statusCode >= 400) {
        if (config.fail) {
          config.fail(res.data || COMMON_FAIL_DATA);
        } else {
          wx.showToast({
            title: "网络异常" + res.statusCode,
            icon: "none"
          });
        }
      } else {
        let data = res.data;
        if (IS_SHANDLE) {
          const dataStr = pako.inflate(res.data, { to: "string" });
          data = JSON.parse(dataStr);
        }

        if (res.statusCode == 200) {
          config.success && config.success(data);
        } else {
          if (config.fail) {
            config.fail(data && data.result);
          } else {
            wx.showToast({
              title:(data && data.msg) || "网络异常，请重试",
              icon: "none"
            });
          }
        }
      }
    },
    fail: function() {
      config.loading && wx.hideLoading();

      wx.hideNavigationBarLoading();
      if (config.fail) {
        config.fail(COMMON_FAIL_DATA);
      } else {
        // wx.showToast({
        //   title: '网络异常',
        //   icon: 'none'
        // })
      }
    },
    complete: function() {
      config.complete && config.complete();
    }
  });
};

module.exports = {
  request: request
};
