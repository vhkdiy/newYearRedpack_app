import {request} from './../../../utils/request.js'
import { phead } from './../../../utils/phead.js'

const requestGainData = () => {
  return new Promise((resolve,reject)=>{
    request({
      url: "/myRecord/user/gainRed",
      method : 'POST',
      success: function (res) {
        resolve(res);
      },
      fail: function (e) {
        reject();
      }
    });
  });

}
module.exports = {
  requestGainData: requestGainData
}