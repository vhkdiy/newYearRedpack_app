import {request} from './../../../utils/request.js'
import { phead } from './../../../utils/phead.js'

const requestRedPack = (that,url,data) => {
  return new Promise((resolve,reject)=>{
    console.error(that);
    console.error(url);
    console.error(data);
    request({
      url: url,
      data : data,
      method : 'POST',
      success: function (res) {
        console.error("success");
        console.error(res);
        resolve(res);
      },
      fail: function (e) {
        console.error("fail");
        console.error(e);
        reject();
      }
    });
  });

}
module.exports = {
  requestRedPackFunc: requestRedPack
}