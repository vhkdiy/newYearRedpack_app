import qiniuUploader from './../qiniu/qiniuUploader';
import {
  request
} from './../../utils/request.js';

const UploadFileManager = {
  domain: "https://img.xmiles.cn",

  /**
   * 上传图片到七牛
   */
  uploadImgToQiniu(tempFilePath) {
    return new Promise((resolve, reject) => {
      if (!tempFilePath) {
        reject("路径为空不合法");
        return;
      }

      this.getUploadToken().then((token) => {

        const stringList = tempFilePath.split('/');
        const KEY = stringList[stringList.length - 1];

        qiniuUploader.upload(tempFilePath, (res) => {
          if (res.error) {
            reject(res.error);
          } else {
            const imgUrl = `${this.domain}/${KEY}`;
            console.log("图片上传成功： " + imgUrl);
            
            resolve(imgUrl);
          }

        }, (error) => {

          console.log('error: ' + error);
          reject(error);

        }, {
          region: 'ECN',
          domain: this.domain,
          uptoken: token,
          key: KEY,

        }, (res) => {
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        });

      }).catch((e) => {
        console.error(e);
        reject(e);
      });
    });
  },

  getUploadToken() {
    return new Promise((r, j) => {
      request({
        url: "/img/token?num=1",
        method: "GET",
        withoutLogin: true,

        success: (res) => {
          if (res.uploads && res.uploads.length > 0) {
            r(res.uploads[0].token);
          } else {
            r();
          }
        },
        fail: () => {
          r();
        }
      });
    });
  }
}

export default UploadFileManager;