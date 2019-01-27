import {request} from './../../../utils/request.js';
import Conts from './conts.js';
import GuideShareSignal from './guide-share-signal.js';

const requestPayState = (orderId) =>{
  return new Promise((r, j) => {
    request({
      url: `/pay/payResult/${orderId}`,
      method: "GET",
      success: (data) =>{
        if (data.status == 1) {
          Conts.isPaySuccess = true;
          GuideShareSignal.notifyPaySuccess.dispatch();
        }

        r(data);
      },
      fail: (e) => {
        j();
      }
    });
  });
}

export default requestPayState;