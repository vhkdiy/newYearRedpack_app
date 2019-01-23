// component/open-setting-dialog/open-setting-dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 弹窗的提示打开授权的类型， step：获取运动步数； image：保存图片授权； 
     */
    requestAuthType: {
      type: String,
      value: 0,
      observer: function(newVal, oldVal) {
        if (newVal != oldVal) {
          this.setOpenSettingTip();
        }
      }
    },
    isShow : {
      type : Number,
      value : false,
      observer : function(newVal,oldVal){
        this.setData({
          isShow: newVal
        })
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    openSettingTip: null,
    isShow : false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClick(e) {
      this.setData({
        isShow: false
      })
    },
    setOpenSettingTip() {
      const requestAuthType = this.data.requestAuthType;
      let _openSettingTip = null;

      switch (requestAuthType) {
        case 'step': {
          _openSettingTip = "财运指北需要您的授权才能获取步数哦，快点击授权吧！";
        }
          break;
        case "image": {
          _openSettingTip = "财运指北需要您的授权才能保存哦，快点击授权吧！";
          }
          break;
      }

      if (this.data.openSettingTip != _openSettingTip) {
        this.setData({
          openSettingTip: _openSettingTip,
        });
      }
    },
  },
  attached: function() {
    this.setOpenSettingTip();
  },
})