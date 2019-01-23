import UploadFileManager from "../../utils/upload/UploadFileManager";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  choseImg(e){
      wx.chooseImage({
        success: (e) =>{
          console.log(e)
          UploadFileManager.uploadImgToQiniu(e.tempFilePaths[0]).then((imgUrl) =>{
            console.log("imgUrl:" + imgUrl);
          });
        },
      });
  }
});