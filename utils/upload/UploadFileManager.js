import qiniuUploader from './../qiniu/qiniuUploader';
import {
  request
} from './../../utils/request.js';

const UploadFileManager = {
  domain: "https://img.xmiles.cn",
  commonPath: "newyear_redpack",

  /**
   * 上传图片到七牛
   */
  uploadImgToQiniu(tempFilePath) {
    const stringList = tempFilePath.split('/');
    const KEY = `${this.commonPath}/${stringList[stringList.length - 1]}`;
    const imgUrl = `${this.domain}/${KEY}`;

    return new Promise((resolve, reject) => {
      if (!tempFilePath) {
        reject("路径为空不合法");
        return;
      }

      this.getUploadToken().then((token) => {

        let delayNotifySuccussFunc = null;
        let isUploadToQiniuSuccess = false;

        qiniuUploader.upload(tempFilePath, (res) => {
          if (!isUploadToQiniuSuccess) {
            console.log("图片上传成功： " + imgUrl);
            isUploadToQiniuSuccess = true;
            delayNotifySuccussFunc && clearTimeout(delayNotifySuccussFunc);
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

          if (res.progress >= 100) {
            console.log("图片上传进度100%： " + imgUrl);

            delayNotifySuccussFunc && clearTimeout(delayNotifySuccussFunc);

            !isUploadToQiniuSuccess && (delayNotifySuccussFunc = setTimeout(() =>{
              isUploadToQiniuSuccess = true;

              resolve(imgUrl);
            }, 6000));
          }
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