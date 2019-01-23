import {request} from './../../utils/request.js';
import {phead} from './../../utils/phead.js';

/**
 * 获取公众号的二维码
 */
const requestGzhQr = function(ex, sceneStr) {
  const openid = phead.phoneid;
  if (openid) {
    sceneStr += `&openId=${openid}`;
  }

  if (sceneStr && sceneStr.indexOf('&') == 0) {
    sceneStr = sceneStr.slice(1, sceneStr.length);
  }

  return new Promise((r, j) => {
    request({
      funid: 66,
      loading: false,
      data: {
        "scene": {
          "ex": ex,
          "param": sceneStr,
        },
      },
      success: (data) => {
        r(data.codeUrl);
      },
      fail: (e) => {
        j(e);
      }
    });
  });
}

export default requestGzhQr;