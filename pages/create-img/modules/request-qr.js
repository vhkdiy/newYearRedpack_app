import requestJHQrcode from './../../../utils/share/request-qrcode.js';
import requestGzhQr from './../../../utils/share/request-gzh-qr.js';

const requestQr = function (jhSceneStr, gzhSceneStr) {
  if (gzhSceneStr) {
    return requestGzhQr('365步步赚52手机壳邀请码', gzhSceneStr);
  } else {
    return requestJHQrcode(null, jhSceneStr);
  }
}

export default requestQr;