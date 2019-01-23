const { phead } = require('./phead.js');
const app = getApp();
/**
  * 广告回调
  */
let adcallback = function (LoaclUrl, ScUrl,ProUrl) {
  wx.request({
    url: LoaclUrl,
  })
  wx.request({
    url: ScUrl,
    data: {
      data: {
        phead: phead,
        distinct_id: app.sensors.store.getDistinctId(),
        properties: {
          app_title: '365步步赚',
          $title: '365步步赚',
          url: ProUrl
        }
      },
      handle: 0,
      shandle: 0
    },
  })
}

export default adcallback;