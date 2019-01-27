import {
  request
} from './../../../utils/request.js';
import UploadFileManager from './../../../utils/upload/UploadFileManager.js';

const UploadImg = {
  //上传用户的模板
  uploadTempUrl(tempPath) {
    UploadFileManager.uploadImgToQiniu(tempPath).then((imgUrl) => {
      request({
        url: "/img",
        data: {
          imgUrl: imgUrl,
          type: 1,
        }
      });
    }).catch(() => {

    });
  },


  // greeting(string, optional): 类别2有效, 祝福语,
  // imgUrl(string, optional): 图片地址,
  // redPackIndex(integer, optional): 类别2有效, 红包位置,
  // type(integer, optional): 图片类别: 1 - 模板, 2 - 合成红包分享图

  uploadComplete(tempPath, greeting, redPackIndex) {
    return new Promise((r, j) => {
      UploadFileManager.uploadImgToQiniu(tempPath).then((imgUrl) => {
        request({
          url: "/img",
          loading: true,
          data: {
            imgUrl: imgUrl,
            greeting: greeting,
            redPackIndex: redPackIndex,
            type: 2,
          },
          success: (data) => {
            r(data);
          },
          fail: (e) => {
            wx.hideLoading();
            wx.showToast({
              title: e && e.msg,
              icon: "none",
              mask: true,
            });
            
            j();
          }
        });
      }).catch(() => {
        wx.hideLoading();

        wx.showToast({
          title: '上传图片失败了， 请稍后重试',
          icon: "none",
        });

        j();

      });
    });
  }
}

export default UploadImg;