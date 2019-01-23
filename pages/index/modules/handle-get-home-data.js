
import requestHomeData from './request-home-data.js';
const {
  ad_statistics_show,
  ad_statistics_click
} = require('./../../../utils/ad-statistics.js');

const handleGetHomeData = (page) => {

  requestHomeData().then((data) => {
    const robots = data.robots && data.robots[0];
    const adData1 = (data.ads && data.ads.ad_list && data.ads.ad_list[0]) || null;
    page.setData({
      robots: robots,
      adData1: adData1,
      isHomeDataSuccess: true,
      title_picture_url: robots.title_picture_url,
      dialogue_icon: robots.dialogue_icon,
    });
    if (adData1) {
      ad_statistics_show(adData1.impr_url, adData1.sensors_ad_show_url, page.data.properties);
    }
  }, (e) => {

  });
}

export default handleGetHomeData;