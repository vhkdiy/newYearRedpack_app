const { request } = require('../../utils/request.js')
const { phead } = require('../../utils/phead.js')

//专门处理点击后获取formId的组件
Component({
  //组件的属性列表
  options: {
    multipleSlots: false
  },
  properties: {
    clickId: {
      type: String,
      value: '',
      observer: function(newVal, oldVal) {
        this.setData({
          clickId: newVal
        })
      }
    }
  },
  //组件的初始数据
  data: {
    clickId: ''
  },
  //组件的方法列表
  methods: {
    formSubmit: function (e) {
      if (phead.platform != "devtools") {
        const formId = e.detail.formId;
        const list = getApp().globalData.formIdList;
        if (list.length >= 7) {
          list.shift();
        }
        list.push(formId);
      }
      this.triggerEvent('tapForm', e.detail, {});
    }
  }
})
