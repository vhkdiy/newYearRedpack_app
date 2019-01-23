import {
  request
} from './../request.js';

const getUserInfo = function(success, fail) {
  return new Promise((resolve, reject) => {
    request({
      funid: 9,
      loading: false,
      success: (data) => {
        resolve(data);
      },
      fail: (e) => {
        reject(e);
      }
    });
  });
}


export default getUserInfo;