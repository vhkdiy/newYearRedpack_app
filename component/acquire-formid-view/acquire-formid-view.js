import {
  request
} from './../../utils/request'

const UPLOAD_FORMID_KEY = "upload_formid_key"

/**
 * 获取formid组件 
 * 点击时会fromid会请求保存在服务器上
 */
Component({
  properties: {

  },
  data: {
    finishUploadToday: false
  },
  methods: {
    formSubmit: function(e) {
      if (this.data.finishUploadToday) {
        return
      }
      let formId = e.detail.formId;
      // 不存在 或者 为测试机子
      if (!formId || formId === 'the formId is a mock one') {
        //
        return
      }
      wx.getStorage({
        key: UPLOAD_FORMID_KEY,
        success: (res) => {
          let uploadObj = res.data;
          let uploadCount = uploadObj.count;
          let today = new Date().getDate();

          // 新的一天,清除更新次数
          if (uploadObj.day !== today) {
            uploadCount = 0
          }
          // 默认一天传formid为7次
          if (uploadCount < 7) {
            this.requestUploadFormId(formId)
            this.saveFormIdData({
              day: today,
              count: uploadCount + 1
            })
          } else if (uploadCount >= 3) {
            this.setData({
              finishUploadToday: true
            })
          }
        },
        fail: (res) => {
          this.requestUploadFormId(formId)
          let uploadObj = {
            day: new Date().getDate(),
            count: 1
          }
          this.saveFormIdData(uploadObj)
        }
      })
    },
    saveFormIdData(uploadObj) {
      wx.setStorage({
        key: UPLOAD_FORMID_KEY,
        data: uploadObj,
      })
    },
    /**
     * 请求更新formid
     */
    requestUploadFormId(formId) {
      console.log("请求更新formid: " + formId);
      request({
        url:"/wx/formId/save",
        data: {
          formId: formId
        },
        success: res => {

        },
        fail: (e) => {

        }
      })
    }
  }
})