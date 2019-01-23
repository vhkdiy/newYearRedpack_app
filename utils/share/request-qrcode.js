import imgUtils from './../img-utils.js';
import sceneUtils from './scene-util.js';

import {request} from './../request.js';

const requestQrcode = function (path, scene = sceneUtils.creatQrShareScene(), width = 130) {
  if (!path) {
    path = 'pages/index/index';
  }
  return new Promise((resolve, reject) => {
    request({
      funid: 48,
      loading: false,
      data: {
        "page": path,
        "scene": scene,
        "width": width,
      },
      success: (data) => {
        resolve(imgUtils.getTinyImg(data.url));
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}


export default requestQrcode;