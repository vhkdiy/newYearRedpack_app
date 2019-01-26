// pages/redpack/component/bottom_dialog/bottom_dialog.js
import { requestAppreciate } from './js/requestAppreciate.js';
import { appreciate } from './js/appreciate.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowType : {
        type : Number,
        observer : function(newVal,oldVal){
          this.setData({
            isShowType : newVal
          })
          //外面没有传递参数进来，里面自己请求刷新
          if (newVal == 1 && this.data.orderId && !this.data.isShowData){
            this.getAppreciate();
          }
      }
    },
    isShowData : {
      type : Object,
      observer : function(newVal,oldVal){
          this.setData({
            isShowData : newVal
          })
      }
    },
    orderId : {
      type : String,
      observer : function(newVal,oldVal){
        this.setData({
          orderId : newVal
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
    orderId : null,
    isEnterMonry : false,
    inputValue : ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //只有在外面没法获取数据的时候，才需要调用
    getAppreciate: function () {
      let url = `/like/${this.data.orderId}`;
      console.error(url);
      requestAppreciate(this, url).then((data) => {
        this.setData({
          isShowData: data
        })
      }).catch(e => {
        console.error("catch");
      });
    },
    //设置输入还是选择模式
    setEnterMonry : function(){
      this.setData({
        isEnterMonry : !this.data.isEnterMonry
      })
    },
    //用户输入的
    sendAction : function(){
      this.requestData(this.data.inputValue);
    },
    //用户选择的
    selectAction : function(e){
      this.requestData(e.currentTarget.id);
    },
    //请求赞赏
    requestData: function (money){
      // let actualMoney = parseFloat(money) +  Math.ceil((parseFloat(money) * parseFloat(this.data.isShowData.serviceCharge)) * 100) / 100;
      let url = `/like/payParam/${this.data.orderId}?money=${money}`;
      console.error(url);
      appreciate(this, url).then((data) => {
        if (data.status == 1) {
          let payParam = data.payParam;
          wx.requestPayment({
            timeStamp: JSON.stringify(payParam.timestamp),
            nonceStr: payParam.nonceStr,
            package: payParam.prepayId,
            signType: payParam.signType,
            paySign: payParam.paySign,
            success(res) {
              this.closePop();
              wx.showToast({
                title: '赞赏成功',
                icon: 'none'
              });
            },
            fail(res) {
              console.error(res);
              wx.showToast({
                title: '赞赏失败',
                icon: 'none'
              })
            }
          })
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
        }
      }).catch(e => {
        console.log(e);
        console.error("catch");
      });
    },
    //changeInput
    changeInput : function(e){
      this.setData({
        inputValue: e.detail.value
      })
    },
    closePop : function(){
      this.setData({
        isShowType : 0
      })
    }
    
  }
})
