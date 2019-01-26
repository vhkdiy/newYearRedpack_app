import {request} from './../../../utils/request.js'
import { phead } from './../../../utils/phead.js'

const requestGetMoney = (that,url) => {
  return new Promise((resolve,reject)=>{
    request({
      url: url,
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
  requestGetMoney: requestGetMoney
}