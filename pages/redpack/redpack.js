// pages/redpack/redpack.js
import share from './../../utils/share.js';
import { requestData } from './js/requestData.js';
import { requestRedPackFunc } from './js/requestRedPack.js';
import { requestAppreciate } from './js/requestAppreciate.js';

import { phead } from './../../utils/phead.js'
import loginUtils  from './../../utils/login/login-utils.js'

import  UpdateUserInfo  from './../../utils/user/update-user-info.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //请求必须参数
    orderId : "",
    userId : "",
    openId : "",

    authorized : false,
    avatarUrl : "",
    title : "",
    subTitle : "",
    status: "",      //状态: 1-过期状态, 2-领完状态, 3-领过状态, 4-没机会不可分享状态, 5-没机会可分享状态, 6-正常状态,
    receiveCount: "",  //红包已领取的个数
    redPackCount : "", //红包总个数
    receiveMoney : "", //红包已领取的金额
    redPackMoney : "",  //红包总金额
    vieRecords : "",    //领取记录
    imgUrl :     "",     //背景图片

    isSelf : true,
    isShowType : 0,       //显示弹窗状态
    isShowData : null,    //红包数据

    isShowBottomDialogType : 0,
    isShowBottomData : null, //弹窗数据
    redPackTemplates : [],   //红包下发的图片

    isFirstEnter : false //是否首次进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.error("onLoad");
    
    this.setData({
      orderId : options.orderId,
      userId: options.userId,
      openId: options.openId,
      isFirstEnter: wx.getStorageSync("isFirstEnter") !== 'false',
      requestData : {
        orderId: options.orderId,
        openId: options.openId,
        phead: phead
      }
    })
  },
  onShow: function () {
    this.reloadData();
  },
  reloadData : function(){
    this.requestData();
    this.getAppreciate();
    //判断是否是自己 和 示例页
    this.judgeSelf();
  },
  //请求获取赞赏数据
  getAppreciate : function(){
    let url = `/like/${this.data.orderId}`;
    console.error(url);
    requestAppreciate(this, url).then((data) => {
      this.setData({
        isShowBottomData: data
      })
    }).catch(e => {
      console.error("catch");
    });
  },
  shareclick: function () {
    this.requestData();
  },
  requestData : function(callback){
    setTimeout(() => {
      let url = `/redPack/${this.data.orderId}?openId=${this.data.openId}&userId=${this.data.userId}`;
      console.error(url);
      requestData(this, url).then((data) => {
        console.log("红包数据");
        console.error(data);
        this.setData({
          title: data.title,
          subTitle: data.subTitle,
          avatarUrl: data.sendUser.avatarUrl,
          status: data.status,
          receiveCount: data.receiveCount,
          redPackCount: data.redPackCount,
          receiveMoney: data.receiveMoney,
          redPackMoney: data.redPackMoney,
          vieRecords: data.vieRecords,
          imgUrl: data.order.imgUrl,
          authorized: data.user.authorized,
          redPackTemplates: data.redPackTemplates

        })
        callback && callback();
      }).catch(e => {
        console.error("catch");
      });
    }, 300);
  },
  onGotUserInfo : function(e){
    console.log("授权");
    console.error(e);
    let that = this;
    let id = e.target.id;
    console.error("id"+id);
    UpdateUserInfo(e,{
      success : ()=>{
      console.error("上传授权信息");
        that.requestData(()=>{
          console.log("请求成功");
        that.clickRedPack(null,id);
      });
      
    }});

  },
  requestRedPack : function(id){
    let that = this;
    console.log("请求红包");
    console.log(id);
    requestRedPackFunc(that, "/redPack", { "orderId": this.data.orderId, "redPackIndex": id }).then(data => {
      console.error("requestRedPack");
      console.error(data);
      if (data.status == 1) {
        this.setData({
          isShowType: 1
        })
      } else if (data.status == 2) {
        //没猜中还可以分享，调起微信分享
        this.setData({
          isShowType: 2
        })
      } else if (data.status == 3) {
        //没猜中不可分享
        this.setData({
          isShowType: 3
        })
      } else if (data.status == 4) {
        //猜中了
        this.setData({
          isShowType: 4,
          isShowData: data.record
        })
        try {
          getApp().sensors.track('get_redpack', {
            "redpack_id": this.data.orderId,
            "get_redpack_money": data.record.redPackMoney,
            "redpack_order_user_id": this.data.userId || this.data.openId || "链接上没有带"
          });
        } catch (e) {

        }
      } else {
        wx.showToast({
          title: '红包已领完',
          icon: 'none'
        })
      }
      console.error("请求刷新刷新了");
      this.requestData();

    }).catch(e => {
      console.error("catch");
      console.error(e);
    })
  },
  //点击红包
  clickRedPack: function (e, idString){
    var idString = idString ? idString : e.currentTarget.id;

    if (this.data.authorized){
      console.log(idString);
      let that = this;
      if (this.data.status == 6) {
        console.error("点击红包");
        console.error(idString);
        this.requestRedPack(idString);
      } else if (this.data.status == 5) {
        this.setData({
          isShowType: 2
        })
      } else if (this.data.status == 4) {
        this.setData({
          isShowType: 3
        })
      }

    }else{

    }
  },
  //去提现
  gotoReflect : function(){
    wx.navigateTo({
      url: '/pages/reflect/reflect',
    });
  },
  //去发红包
  gotoSendRedPack : function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //去赞赏
  gotoAdmire : function(){
    this.setData({
      isShowBottomDialogType : 1
    })
  },
  //去投诉
  gotoComplain : function(){

  },
  //查看我的记录
  seeRecord : function(){
    wx.navigateTo({
      url: '/pages/myrecord/myrecord',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.error(e);
    if (e && e.target && e.target.id == "share"){
      if (!this.data.isSelf) {
        return share.getRedpackShare(`/pages/index/index?orderId=${this.data.orderId}`, null, {
          page: "红包分享页",
          share_module: "红包页面分享"
        }, "恭喜发财", this.data.imgUrl);
      } else {
        return share.getRedpackShare(`/pages/index/index?orderId=1`, null, {
          page: "红包分享页",
          share_module: "红包页面分享"
        }, "恭喜发财", this.data.imgUrl);
      }
    }else{
      if (!this.data.isSelf) {
        return share.getRedpack(`/pages/index/index?orderId=${this.data.orderId}`, null, {
          page: "红包分享页",
          share_module: "红包页面分享"
        }, "恭喜发财", this.data.imgUrl);
      } else {
        return share.getRedpack(`/pages/index/index?orderId=1`, null, {
          page: "红包分享页",
          share_module: "红包页面分享"
        }, "恭喜发财", this.data.imgUrl);
      }
    }
  },

  //判断是不是自己进来
  judgeSelf : function(){
    console.error(this.data.openId);
    console.error(phead.phoneid);
    console.error(this.data.userId);
    console.error(wx.getStorageSync(loginUtils.getUserIdKey()));
    console.error(this.data.orderId);
    console.error(this.data.orderId !== '1' );
    if (this.data.orderId == '1'){ //示例页
        //去分享
      this.setData({
        isSelf: false
      })
    } else if (this.data.openId == phead.phoneid || this.data.userId == wx.getStorageSync(loginUtils.getUserIdKey())){
        //去分享
      this.setData({
        isSelf: false
      })
    } else {
      //去回赠
      this.setData({
        isSelf: true
      })
    }
  },
  firstClick : function(){
    this.setData({
      isFirstEnter : false
    })
    wx.setStorageSync("isFirstEnter", "false");
  },
  //跳转到分享页面
  gotoShare : function(){
    wx.navigateTo({
      url: `/pages/guide-share/guide-share?orderId=${this.data.orderId}`,
    })
  }
  //   if (this.data.orderId !== '1' && 
  //   ((this.data.openId == phead.phoneid) || (this.data.userId == wx.getStorageSync(loginUtils.getUserIdKey())))){

  //     console.log("true");
  //     this.setData({
  //       isSelf : true
  //     })
  //   }else{
  //     console.log("false");
  //     this.setData({
  //       isSelf: false
  //     })
  //   }
  // }

})