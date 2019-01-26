import {request} from './../../../utils/request.js'
import { phead } from './../../../utils/phead.js'

const requestAppreciate = (that,url) => {
  return new Promise((resolve,reject)=>{
    request({
      url: url,
      method : 'GET',
      success: function (res) {
        console.error(res);
        resolve(res);
      },
      fail: function (e) {
        reject();
      }
    });
  });

}
module.exports = {
  requestAppreciate: requestAppreciate
}