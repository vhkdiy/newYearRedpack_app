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
    },
    requestData : {
      type : Object,
      observer: function (newVal, oldVal) {
        this.setData({
          requestData: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowType : 0,
    isShowData : null,
    requestData : null
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
      console.error(this.data.requestData);
      let that = this;
      request({
        url: "/share",
        data: this.data.requestData,
        method: 'POST',
        success: function (res) {
          console.log(res);
          that.triggerEvent('shareclick');
          that.closePOP();
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
