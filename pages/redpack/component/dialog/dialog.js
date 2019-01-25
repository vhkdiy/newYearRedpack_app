// pages/redpack/component/dialog.js
import { request } from './../../../../utils/request.js'
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
    },
    isShowData : {
      type: Object,
      observer: function (newVal, oldVal) {
        this.setData({
          isShowData: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowType : 0,
    isShowData : null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closePOP : function(){
      this.setData({
        isShowType : 0
      })
    },
    shareclick : function(){
      let that = this;
      request({
        url: "/share",
        method: 'POST',
        success: function (res) {
          console.log(res);
          that.triggerEvent('shareclick')
        },
        fail: function (e) {
        }
      });
    },
    sendRedPack : function(){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})
