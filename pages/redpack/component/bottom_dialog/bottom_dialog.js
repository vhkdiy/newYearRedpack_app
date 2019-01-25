// pages/redpack/component/bottom_dialog/bottom_dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isEnterMonry : false,
    inputValue : ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //设置输入还是选择模式
    setEnterMonry : function(){
      this.setData({
        isEnterMonry : !this.data.isEnterMonry
      })
    },
    //用户输入的
    sendAction : function(){
      console.log(this.data.inputValue);
    },
    //用户选择的
    selectAction : function(e){
      console.log(e.currentTarget.id);
    },
    //changeInput
    changeInput : function(e){
      this.setData({
        inputValue: e.detail.value
      })
    }
    
  }
})
