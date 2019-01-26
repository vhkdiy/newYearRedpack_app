const { request } = require('./../../../utils/request.js')

module.exports = {
  requestPayment: function (option) {
    console.log(option)
    request({
      url: `/pay/payParam/${option.orderId}?redPackMoney=${option.money}&redPackCount=${option.number}`,
      method:'get',
      success: (res) => {
        console.log('requestPayInfo',res)
        // var payParam = res.payParam;
        // if (payParam) {
        //   wx.requestPayment({
        //     timeStamp: payParam.timestamp.toString(),
        //     nonceStr: payParam.nonceStr,
        //     package: payParam.prepayId,
        //     signType: payParam.signType,
        //     paySign: payParam.paySign,
        //     success: function (res) {
        //       console.log('requestPayment:' + JSON.stringify(res));
        //       success && success(res);
        //     },
        //     fail: function (res) {
        //       console.log('requestPayment:' + JSON.stringify(res));
        //       fail && fail(res);
        //     }
        //   })
        // } else {
        //   fail && fail(res);
        // }
      },
      fail: (res) => {
        option.fail && option.fail(res);
      }
    })
  }
}