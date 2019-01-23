// 配置文件
module.exports = {
  track: function (app, event, param) {
    param = param || {};
    var query = app.globalData.query;
    Object.assign(param, {
      utm_source: query.utm_source,
      utm_medium: query.utm_medium,
      utm_campaign: query.utm_campaign,
      utm_content: query.utm_content,
      utm_term: query.utm_term
    })
    if (app.sensors) {
      app.sensors.track(event, param);
    } else {
      setTimeout(function () {
        app.sensors.track(event, param);
      }, 3000);
    }
    app.aldstat.sendEvent(event, param);
    wx.reportAnalytics(event.toLowerCase(), param);
  }
}