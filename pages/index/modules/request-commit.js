import {request} from './../../../utils/request.js';

const requestCommit = (answer_array, paper_id) => {
  return new Promise((resolve, reject) => {


    request({
      funid: 1011,
      loading: false,
      data: {
        answer_array: answer_array,
        paper_id: paper_id,
      },
      success: (data) => {
        resolve(data);
      },
      fail: (e) => {
        reject(e);
      }
    })
  });
}

export default requestCommit;