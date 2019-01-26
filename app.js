var aldstat = require("./utils/ald-stat.js");
const config = require('./utils/config.js')
var sensors = require('./utils/sensorsdata.js');
sensors.registerApp({
  $app_version: config.cversion,
  app_version: config.cversion,
  b_channel: config.prdid,
  s_channel: config.channel
});
require('./utils/commit-formid.js');
require('./utils/page-life.js');
const { request } = require('./utils/request.js')
const phead = require('./utils/phead.js')
const share = require('./utils/share.js')

const SMSdk = require('./libs/fp.min.js');
SMSdk.initConf({
  organization: 'kIVwpvbKoJSnoKEMN5oJ',//传入 organization，不要传入 accessKey
  channel: 'step2gift' //作为区分来源的，可以自定义
});
phead.phead.shumeiid = SMSdk.getDeviceId();

const statistics = require('./utils/statistics.js');

//时间分析引入
const timeAnalysis = require('./utils/time-analysis');

//登录工具
import loginUtils from './utils/login/login-utils.js';

//scene信息工具
import sceneUtil from './utils/share/scene-util.js';

//邀请处理
import inviteHandler from './utils/invite/invite-handler.js';

//更新处理
import updateHandler from './utils/update/update-handler.js';

//更新微信用户信息
import updateWxUserInfo from './utils/user/update-wx-userinfo.js';

//处理好友关系
// import friendInviteHandler from './utils/friends-system/friend-invite-handler';

// 添加神策公共属性
App({

  /**
   * 全局数据
   */
  globalData: {
    appOnHideRequest : null,
    isNewbie: false,
    formIdList: [],
    commitFormId1: false,        //每天提交三次formid，保证formid及时提交，以及限制formid提交次数
    commitFormId3: false,
    commitFormId7: false,
    isIphoneX: false,
    isIphone: false,
    shareTicket: '',
    query: [],
    userid: null,
    isFinishBindInviteRelations:false,
    sceneObj: {
      userid: null,//邀请者的userid
      type: null,//邀请类型
    },
  },

  /**
   * 注入数美 SMSdk 方法，后续页面可以引入
   */
  SMSdk: SMSdk,

  /**
   * 加载
   */
  onLaunch: function (res) {
    console.log("App -- onLaunch :" + JSON.stringify(res));

    //测试环境，开启时间分析工具
    if (config.testServer) {
      timeAnalysis.openAnalysis();
    }
    timeAnalysis.analysisTime('App -- onLaunch');

    //检查更新
    updateHandler.checkVersionUpdate();

    //检查本地登录信息
    loginUtils.checkLocalLoginInfo();

    //初始化全局数据
    this.initGlobalData(res);

    //注册监听
    loginUtils.waitToLogin(this.onLoginSuccess, this.onLoginFail);

    //开始登录
    loginUtils.startlogin();

    statistics.track(this, 'XMLaunch', {});
  },

  /**
   * 初始化全局数据
   */
  initGlobalData: function(res) {
    //带shareTicket的分享，保存shareTicket以便后续获取解释出群信息
    if (res.scene == 1044) {
      this.globalData.shareTicket = res.shareTicket
    }

    //保存query到全局变量，同时使用query的信息，初始化phead
    if (res.query) {
      this.globalData.query = res.query;
      this.replaceQuery(res.query);
      phead.initUtm(res.query);
    }
    //全局保存一下options
    this.globalData.options = res;
    //保存scene值到全局变量
    this.globalData.scene = res.scene;

    //判断iphonex
    let that = this;
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          that.globalData.isIphoneX = true
        }
        if (modelmes.search('iPhone') != -1) {
          that.globalData.isIphone = true
        }
      }
    });
  },
  
  /**
   * 显示
   */
  onShow:function(res){
    console.log("App -- onShow :" + JSON.stringify(res));
    //更新query
    if (res.query) {
      this.globalData.query = res.query;
      this.replaceQuery(res.query);
    }

    //更新分享控制信息
    share.update();

    //如果已经登录，就尝试更新微信用户信息
    if (loginUtils.isLogin()) {
      updateWxUserInfo();
      // 处理好友关系
      // friendInviteHandler.handleRelation()
    }

    statistics.track(this, 'XMShow', {});

    this.globalData.appOnHideRequest = null;
  },

  /**
   * 如果是生成二维码进来，要使用二维码的信息
   */
  replaceQuery(query) {
    if (query && query.scene) {
      const globeQuery = this.globalData.query;
      const sceneObj = sceneUtil.parseQrShareScene(query.scene);
      if (sceneObj) {
        this.globalData.sceneObj = sceneObj;
        //由菊花二维码进入的参数由这里获取，query里面有的参数不要替换， 没有的参数才替换
        if (!globeQuery.type && sceneObj.type) {
          //菊花二维码进来的邀请类型在sceneObj中获取 的分享类型
          globeQuery.type = sceneObj.type;
        }

        if (!globeQuery.orderId && sceneObj.orderId) {
          globeQuery.orderId = sceneObj.orderId;
        }

        if (!globeQuery.userId && sceneObj.userId) {
          globeQuery.userId = sceneObj.userId;
        }

      }
    }
  },

  /**
   * 登录成功
   */
  onLoginSuccess: function() {
    //登录成功，检查邀请
    //判断是不是分享进入的用户,是的话请求3接口,菊花二维码识别进来的sceneObj中获取邀请人的userid
    //本来可以直接请求，这里延迟1秒是为了等神策sdk初始化完成，否则有些属性获取不了
    setTimeout(function(){
      inviteHandler.invateCheck();
    }, 500);

    // 处理好友关系
    // friendInviteHandler.handleRelation()

    //如果已经授权用户信息，更新微信用户信息
    updateWxUserInfo();
  },

  /**
   * 登录失败
   */
  onLoginFail: function() {
    wx.showToast({
      title: '登录失败，下拉刷新',
      icon: 'none'
    });
  },
  onHide: function () {
    if (typeof (this.globalData.appOnHideRequest) === "function"){
      console.error("app onHide");
      this.globalData.appOnHideRequest();
    }
  }
})