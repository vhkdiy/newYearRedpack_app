const { request } = require('./request.js')

module.exports = {
  requestPayment: function (orderId, success, fail) {
    request({
      funid: 27,
      data: {
        orderId: orderId
      },
      success: (res) => {
        var payParam = res.payParam;
        if (payParam) {
          wx.requestPayment({
            timeStamp: payParam.timestamp.toString(),
            nonceStr: payParam.nonceStr,
            package: payParam.prepayId,
            signType: payParam.signType,
            paySign: payParam.paySign,
            success: function (res) {
              console.log('requestPayment:' + JSON.stringify(res));
              success && success(res);
            },
            fail: function (res) {
              console.log('requestPayment:' + JSON.stringify(res));
              fail && fail(res);
            }
          })
        } else {
          fail && fail(res);
        }
      },
      fail: (res) => {
        fail && fail(res);
      }
    })
  }
}