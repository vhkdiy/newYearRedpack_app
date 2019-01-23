import messageCenter from './../../utils/messagecenter/message_center.js';
import WX_STEP_MESSAGE from './../../utils/wx-sports/wx-step-message.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //  默认获取步数授权  step 表示获取步数授权   address 表示获取地址授权    image 表示获取图片授权
    type : {
      type : String,
      observer : function(newVal,oldVal){
        this.setData({
          type : newVal
        })
      }
    },
    // 默认不显示弹窗     false表示不显示弹窗   true表示显示弹窗
    isShow : {
      type  : Boolean,
      observer: function (newVal, oldVal) {
        this.setData({
          isShow: newVal
        })
      }
    },
    //invokeValue 调用者需要携带的信息，最终会通知到消息接收者
    invokeValue : {
      type : Object,
      observer : function(newVal, oldVal){
        console.error(newVal);
        this.setData({
          invokeValue : newVal
        })
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    type: "step",
    isShow : false,
    invokeValue : null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close : function(){
      this.setData({
        isShow : false
      })
    },
    openSettingCallback : function(e){
        let authString = e.currentTarget.dataset.auth
        if (authString === "scope.werun"){
          let flag = e.detail.authSetting[authString]
          if (flag) {
            //打开设置获取授权成功
            messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_GET_WXRUN_SUCCESS, this.data.invokeValue);
            this.setData({
              isShow: false
            })
          } else {
            //打开设置获取授权失败
            messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_GET_WXRUN_FAIL, this.data.invokeValue);
          }
        } else if (authString === "scope.address") {

        } else if (authString === "scope.writePhotosAlbum") {

        }

    },
    clickBtn : function(e){
        let authString = e.currentTarget.dataset.auth
        if (authString === "scope.werun") {
          messageCenter.sendMessage(WX_STEP_MESSAGE.MESSAGE_GET_WX_STEP_OPEN_SETTINGS, this.data.invokeValue);
        } else if (authString === "scope.address") {
          this.close();
        } else if (authString === "scope.writePhotosAlbum") {
          this.close();
        }
    }
  }
})
