// pages/redpack/component/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowType : {
      type : Number,
      observer : function(newVal,oldVal){
        this.setData({
          isShowType: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowType : 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
