const { request } = require('./../../../utils/request.js')

module.exports = {
  requestPayment: function (option) {
    console.log(option)
    request({
      url: `/pay/payParam/${option.orderId}?redPackMoney=${option.money}&redPackCount=${option.number}`,
      method:'get',
      success: (res) => {
        console.log('requestPayInfo',res)
        var payParam = res.payParam;
        if (payParam) {
          wx.requestPayment({
            timeStamp: payParam.timestamp.toString(),
            nonceStr: payParam.nonceStr,
            package: payParam.prepayId,
            signType: payParam.signType,
            paySign: payParam.paySign,
            success: function (res) {
              console.log('requestPayment--success:' + JSON.stringify(res));
              option.success && option.success(res);

              //支付成功埋点
              getApp().sensors.track('recharge', {
                recharge_money: option.money,
                is_succuess: true,
                recharge_fee: option.serviceMoney,
              })
            },
            fail: function (res) {
              console.log('requestPayment--fail:' + JSON.stringify(res));
              option.fail && option.fail(res);

              //失败埋点
              getApp().sensors.track('recharge', {
                recharge_money: option.money,
                is_succuess: false,
                recharge_fee: option.serviceMoney,
              })
            }
          })
        } else {
          option.fail && option.fail(res);
        }
      },
      fail: (res) => {
        option.fail && option.fail(res);
      }
    })
  }
}