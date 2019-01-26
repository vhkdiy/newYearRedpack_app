import {request} from './../../../utils/request.js'
import { phead } from './../../../utils/phead.js'

const requestData = () => {
  return new Promise((resolve,reject)=>{
    request({
      url: "/myRecord/user/redPack",
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
  requestData: requestData
}