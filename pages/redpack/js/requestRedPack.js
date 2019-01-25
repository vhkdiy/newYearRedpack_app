import {request} from './../../../utils/request.js'
import { phead } from './../../../utils/phead.js'

const requestRedPack = (that,url,data) => {
  return new Promise((resolve,reject)=>{
    request({
      url: url,
      data : data,
      method : 'POST',
      success: function (res) {
        console.log(res);
        resolve(res);
      },
      fail: function (e) {
        reject();
      }
    });
  });

}
module.exports = {
  requestRedPack: requestRedPack
}