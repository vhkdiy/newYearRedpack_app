import {ad_statistics_show,ad_statistics_click} from '../../utils/ad-statistics.js'
import  router  from './js/router.js'
import {phead} from './../../utils/phead.js'
const app = getApp();
Component({
  properties: {
    //广告数据
    adData:{
      type : null,
      observer : function(newVal,oldVal){
        if(typeof newVal === 'array' && newVal.length > 0){
          this.initData(newVal[0]);
        }else{
          this.initData(newVal);
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {  
    screenHeight: "",
    jumpType  : "",       //跳转类型
    adData : {},          //广告数据
    essentialData : {},   //必要数据   解析出来后的数据 各种跳转类型，参数不一样
    isShowPop : false    //是否显示弹窗
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initData: function (adData){

      let that = this;
      wx.getSystemInfo({
        success:function (res) {
          //console.log(res.windowHeight) // 获取可使用窗口高度
          let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
          //console.log(windowHeight) //最后获得转化后得rpx单位的窗口高度
          that.setData({
            screenHeight: windowHeight
          })
        }
      }) 


      //私有数据解析设置
      let action = JSON.parse(adData.action);                   
      let adtype = action.adtype;                              //跳转类型
      if (adtype === "contact"){                               //弹窗 跳转客服
        this.setData({
          essentialData: {
            session_from: adtype.session_from,
          }
        })
      } else if (adtype === "launch"){                        //跳转小程序 可以
        let appid = action.app_id
        let path = action.jump_url
        this.setData({
           essentialData : {
             appid : appid,
             path  : path
           }
        })
      }else if(adtype === "pop"){
        let pop_action = JSON.parse(action.pop_action);
        if (pop_action.pop_adtype === "contact"){
          this.setData({
            essentialData: {
              pop_image: pop_action.pop_image,
              session_from: pop_action.pop_url
            }
          })
        }

      }else if (adtype === "image" || adtype === "innerpage" || adtype === "switchtab" || adtype === "redirect" || adtype === 'index_product_invite_dialog'){
        this.setData({
          essentialData: {
            jump_url: action.jump_url ? action.jump_url : ''
          }
        })
      }

      //公共数据设置 设置和盒子关联的数据
      this.setData({
        jumpType: adtype ? adtype : '',   //如果不是开放平台的数据,可能没有adtype
        adData: adData,
      })



    },
    adComponentClick : function(){

      console.log(this.data.adData);
      let data = this.data.adData;
      let imageUrl = this.data.essentialData.jump_url

      //如果是图片和网页处理 还是通过函数处理
      if (this.data.jumpType === "image" || this.data.jumpType === "redirect" || this.data.jumpType === "index_product_invite_dialog") {
        router.jump(this.data.jumpType, imageUrl);
      } 

      //点击事件外传 非小程序和非弹窗直接传递 小程序需要等待成功才传递
      if (this.data.jumpType !== "launch"){
        this.triggerEvent('clickpop', this.data.adData)
      }
    },
    //小程序跳转成功才pop时间
    jumpMiniProgramSuccess : function(){
      //点击事件外传  小程序需要调整成功传递
      this.triggerEvent('clickpop', this.data.adData)
    },


    //打开小程序
    popClick:function(){
      this.setData({
        isShowPop : true
      })
    },
    //关闭小程序
    close_pop : function(){
      this.setData({
        isShowPop: false
      })
    },

    noneMove : function(){

    }
  }
})
