import {request} from './../../../utils/request.js';

const requestHomeData = () => {
  return new Promise((resolve, reject) => {
    request({
      funid: 1001,
      loading: true,
      success: (data) => {
        resolve(data);
      },
      fail: (e) => {
        reject(e);
      }
    })
  });
}

export default requestHomeData;