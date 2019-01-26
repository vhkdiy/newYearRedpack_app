const { pversion, cversion, cversionname, channel, prdid } = require('./config.js')

const phead = {
  pversion: pversion,
  cversion: cversion,
  cversionname: cversionname,
  channel: channel,
  prdid: prdid,
  phoneid:'',
  userId: '',
}

const init = (openid, access_token) => {
  phead.phoneid = openid;
  phead.access_token = access_token;
  wx.getSystemInfo({
    success: function(res) {
      phead.lang = res.language;
      phead.dpi = res.screenWidth * res.pixelRatio + '*' + res.screenHeight * res.pixelRatio;
      phead.platform = res.platform;
      phead.sys = res.system.split(' ')[1];
      phead.phone = res.model;
      phead.screenWidth = res.screenWidth;
      phead.screenHeight = res.screenHeight;
    },
  })

  wx.getNetworkType({
    success: function(res) {
      phead.net = res.networkType.toUpperCase();
    },
  })
}

const initUtm = (query) => {
  phead.latest_utm_source = query.utm_source;
  phead.latest_utm_medium = query.utm_medium;
  phead.latest_utm_campaign = query.utm_campaign;
  phead.latest_utm_content = query.utm_content;
  phead.latest_utm_term = query.utm_term;
}

module.exports = {
  init: init,
  initUtm: initUtm,
  phead: phead
}
