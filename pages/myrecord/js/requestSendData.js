import {request} from './../../../utils/request.js'
import { phead } from './../../../utils/phead.js'

const requestSendData = () => {
  return new Promise((resolve,reject)=>{
    request({
      url: "/myRecord/user/sendRed",
      method: 'POST',
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
  requestSendData: requestSendData
}