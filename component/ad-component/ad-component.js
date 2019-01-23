import {ad_statistics_show,ad_statistics_click} from '../../utils/ad-statistics.js'
import  router  from './js/router.js'
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
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
    },
    //埋点
    properties:{
      type : Object,
      observer : function(newVal,oldVal){
        this.setData({
          properties : newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {  
    jumpType  : "",          //跳转类型
    adData : {},          //广告数据
    essentialData : {},   //必要数据   解析出来后的数据 各种跳转类型，参数不一样
    extraData : {},        //关联数据,
    properties : {}        //神策参数
  },

  //显示和消失生命周期
  pageLifetimes: {
    show: function () {
      console.log("请注意：监听事件，实现耗时统计");
    },
    hide: function () {
      console.log("请注意：监听事件，实现耗时统计");
    }
  },
  attached: function () {
    //展示埋点
    console.log("展示埋点统计");
    let data = this.data.adData;
    if (this.data.properties && typeof (this.data.properties) === 'object' && data.impr_url && data.sensors_ad_show_url){
      ad_statistics_show(data.impr_url, data.sensors_ad_show_url, { ...this.data.properties })
    }else{
      console.log("请确认是否缺少神策埋点，如果非开放平台标准广告，请自己实现埋点");
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initData: function (adData){
      // console.log("------------------")
      // console.error(adData)

      //私有数据解析设置
      let adtype = adData.adtype;
      console.log(adtype);
      if (adData.use_cs_transfer == 1){                       //跳转客服
        adtype = "contact"; //客服类型判断比较特殊，
        this.setData({
          essentialData: {
            session_from: adData.session_from,
          }
        })
      } else if (adtype === "launch"){                        //跳转小程序
        let appid = JSON.parse(adData.jump_url).launchParams.appid
        let path = JSON.parse(adData.jump_url).launchParams.path
        this.setData({
           essentialData : {
             appid : appid,
             path  : path
           }
        })
      }else if (adtype === "image" || adtype === "innerpage" || adtype === "switchtab" || adtype === "redirect"){
        this.setData({
          essentialData: {
            jump_url: adData.jump_url ? adData.jump_url : ''
          }
        })
      }

      //公共数据设置 设置和盒子关联的数据
      this.setData({
        jumpType: adtype ? adtype : '',   //如果不是开放平台的数据,可能没有adtype
        adData: adData,
        extraData: { userid: app.sensors.store.getDistinctId() }
      })



    },
    adComponentClick : function(){

      //点击埋点
      console.log("点击埋点统计");
      let data = this.data.adData;

      if (this.data.properties && typeof (this.data.properties) === 'object' && data.click_url && data.sensors_ad_click_url) {
        ad_statistics_click(data.click_url, data.sensors_ad_click_url, { ...this.data.properties });
      } else {
        console.log("请确认是否缺少神策埋点，如果非开放平台标准广告，请自己实现埋点");
      }

      let imageUrl = this.data.essentialData.jump_url


      //如果是图片和网页处理 还是通过函数处理
      if (this.data.jumpType === "image" || this.data.jumpType === "redirect") {
        router.jump(this.data.jumpType, imageUrl);
      } 


      //点击事件外传  
      this.triggerEvent('clickpop', {})
    }
  }
})
