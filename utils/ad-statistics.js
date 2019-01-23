
const { request } = require('./request.js')
const { phead } = require('./phead.js');
const app = getApp();

//可以传入 String Object Array
const requestStatistics = (requestUrlArray, properties) => {
  console.log(app.sensors.getPresetProperties());
  if (requestUrlArray.length > 0){
    for (let url of requestUrlArray) {
      wx.request({
        url: url,
        data: {
          data: {
            phead: phead,
            distinct_id: app.sensors.store.getDistinctId(),
            properties: {
              ...app.sensors.getPresetProperties(),
              ...properties,
              // app_title: '365步步赚',
              // $title: '365步步赚',
              // url: 'page/makeActiveCoin/makeActiveCoin',
              // is_first_day: app.sensors.store.getIsFirstDay()
            },
          },
          handle: 0,
          shandle: 0
        },
      })
    }
  }
}


const ad_statistics_show = (impr_urls, sensors_ad_show_urls, properties) => {

  //非神策埋点
  try{
    let statistics = [];
    if (impr_urls instanceof String) {
      statistics.push(impr_urls);
    } else if ((impr_urls instanceof Object) && impr_urls.impr_url) {
      statistics.push(impr_urls.impr_url);
    } else if (impr_urls instanceof Array) {
      statistics = impr_urls;
    }

    statistics.map((item) => {
      wx.request({
        url: item
      })
    });

  }catch(e){
    console.error("注意文件:ad-statistics statistics catch");
  }



  //神策埋点
  try{
    let sensorsStatistics = [];
    if ((sensors_ad_show_urls instanceof String)) {
      sensorsStatistics.push( sensors_ad_show_urls );
    } else if ((sensors_ad_show_urls instanceof Object) && sensors_ad_show_urls.sensors_ad_show_url) {
      sensorsStatistics.push(sensors_ad_show_urls.sensors_ad_show_url);
    } else if ((sensors_ad_show_urls instanceof Array) && sensors_ad_show_urls.length != 0) {
      sensorsStatistics = sensors_ad_show_urls;
    }
    requestStatistics(sensorsStatistics, properties)
  }catch(e){
    console.error("注意文件:ad-statistics sensorsStatistics catch");
  }
}


const ad_statistics_click = (click_urls, sensors_ad_click_urls, properties) => {

  //非神策埋点
  try {
    let statistics = [];
    if ((click_urls instanceof String) && click_urls.length != 0) {
      statistics.push(click_urls);
    } else if ((click_urls instanceof Object) && click_urls.click_url) {
      statistics.push(click_urls.click_url);
    } else if ((click_urls instanceof Array) && click_urls.length != 0) {
      statistics = click_urls;
    }

    statistics.map((item) => {
      wx.request({
        url: item
      })
    });

  } catch (e) {
    console.error("注意文件:ad-statistics statistics catch");
  }



  //神策埋点
  try {
    let sensorsStatistics = [];
    if ((sensors_ad_click_urls instanceof String) && sensors_ad_click_urls.length != 0) {
      sensorsStatistics.push(sensors_ad_click_urls);
    } else if ((sensors_ad_click_urls instanceof Object) && sensors_ad_click_urls.sensors_ad_click_url) {
      sensorsStatistics.push(sensors_ad_click_urls);
    } else if ((sensors_ad_click_urls instanceof Array)) {
      sensorsStatistics = sensors_ad_click_urls;
    }
    requestStatistics(sensorsStatistics, properties)
  } catch (e) {
    console.error("注意文件:ad-statistics sensorsStatistics catch");
  }
}



module.exports = {
  ad_statistics_show  : ad_statistics_show,
  ad_statistics_click : ad_statistics_click
}