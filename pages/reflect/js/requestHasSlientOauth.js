import {request} from './../../../utils/request.js'
import { phead } from './../../../utils/phead.js'

const requestHasSlientOauth = (that,url,data) => {
  return new Promise((resolve,reject)=>{
    request({
      url: url,
      method : 'POST',
      data : data,
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
  requestHasSlientOauth: requestHasSlientOauth
}