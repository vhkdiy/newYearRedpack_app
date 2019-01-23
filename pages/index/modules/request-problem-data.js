import {request} from './../../../utils/request.js';

const requestProblemData = () => {
  return new Promise((resolve, reject) => {
    request({
      funid: 1010,
      loading: false,
      success: (data) => {
        resolve(data);
      },
      fail: (e) => {
        reject(e);
      }
    })
  });
}

export default requestProblemData;