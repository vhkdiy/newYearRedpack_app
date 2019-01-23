import * as qiniuUploader from './../qiniu/qiniuUploader';
export default class UploadFileManager {
  static domain = "https://img.xmiles.cn";

  /**
   * 上传图片到七牛
   */
  static uploadImgToQiniu(tempFilePath) {
    return new Promise((resolve, reject) => {
      if (!tempFilePath) {
        reject("路径为空不合法");
        return;
      }

      const stringList = tempFilePath.split('/');
      const KEY = stringList[stringList.length - 1];

      qiniuUploader.upload(tempFilePath, (res) => {

        const imgUrl = `${UploadFileManager.domain}/${KEY}`;

        resolve(imgUrl);

      }, (error) => {
        
        console.log('error: ' + error);

        reject(error);

      }, {
        region: 'ECN',
        domain: UploadFileManager.domain,
        uptoken: 'mQZtLtjTBAgV1nXoqHDmOMck2XGC99kyMgprem9W:e7uShn8_hlJE2ezN-JGHVkP4AaQ=:eyJzY29wZSI6InN0YXJiYWJhIiwiY2FsbGJhY2tVcmwiOiJodHRwOi8vdGVzdC54bWlsZXMuY24vL3V0aWxzX3NlcnZpY2UvcWluaXVjYWxsYmFjaz9yZD0xNTQ4MjMzMjI5ODI0IiwiY2FsbGJhY2tCb2R5IjoibmFtZT0kKGZuYW1lKSZrZXk9JChrZXkpJmN1c3RvbT0iLCJkZWFkbGluZSI6MTU0ODIzNjgyOX0=', // 由其他程序生成七牛 uptoken
        key: KEY,
      }, (res) => {
        
      });
    });
  }
}