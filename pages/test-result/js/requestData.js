import {request} from './../../../utils/request.js'
import sceneUtil from './../../../utils/share/scene-util.js';
import imgUtils from './../../../utils/img-utils.js';
import shareType from './../../../utils/share-type.js'
const requestData = (that) => {
  return new Promise((resolve,reject)=>{

    let scene = sceneUtil.creatQrShareScene({
      t: shareType.GROUP
    });
    request({
      funid: 1012,
      loading: false,
      data : {
        scene: scene,
        open_id: that.data.openId,
        paper_id: that.data.paper_id,
        answer_id: that.data.answer_id
      },
      success: function (res) {
        console.log(res);
        that.setData({
          data: res.calc_result,
          name: res.calc_result.user_name,
          dataList: res.calc_result.calc_result_array,
          result_list: res.calc_result.result_list,
          desc: res.calc_result.calc_result_desc,
          avator: res.calc_result.avator ? imgUtils.completeImgUrl(res.calc_result.avator) : null,
          calc_desc_url: res.calc_result.calc_desc_url ? imgUtils.completeImgUrl(res.calc_result.calc_desc_url ) : null,
          adData: res.ads && res.ads.ad_list ? res.ads.ad_list[0] : null,
          qr_code_url: res.qr_code_url ? imgUtils.completeImgUrl(res.qr_code_url) : null,
          answer_id: res.calc_result.answer_id
          
        })
        resolve();
      },
      fail: function (e) {
        reject();
      }
    });
  });

}
module.exports = {
  requestData : requestData
}