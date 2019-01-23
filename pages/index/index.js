// pages/index/index.js

import updateUserInfo from './../../utils/user/update-user-info.js';
import requestProblemData from './modules/request-problem-data.js';
import handleCommit from './modules/handle-commit.js';
import handleShare from './modules/handle-share.js';
const {
  ad_statistics_show,
  ad_statistics_click
} = require('../../utils/ad-statistics.js');

import tongJiAnswer from './modules/tongJi-answer.js';
import constValue from './modules/const-value.js';
import handleJumpToNextQuestion from './modules/handle-jump-to-next-question.js';
import config from './../../utils/config.js';
import handleGetHomeData from './modules/handle-get-home-data.js';

//登录消息
import loginUtils from './../../utils/login/login-utils.js';
import homeSignals from './modules/home-signals.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    properties: {
      app_title: '幸运指北',
      $title: '幸运指北',
      url: 'page/index/index'
    },
    robots: {
      avator: null,
      name: '',
      dialogue: '',
    },
    isHomeDataSuccess: false,
    adData1: null,
    isStart: false,
    question_list: [],
    isAnswerAll: false,
    paper_id: '',
    is_authorized: 0,
    QUESTION_INDEX_BASE_ID: constValue.QUESTION_INDEX_BASE_ID,
    TOP_ANCHOR_POINT: constValue.TOP_ANCHOR_POINT,
    maxQuestionIndex: 1,
    title_picture_url: '',
    dialogue_icon:'',
  },
  reset(){
    this.setData({
      isStart: false,
      maxQuestionIndex: 1,
      isAnswerAll:false,
      question_list: [],
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (config.testServer) {
      wx.setNavigationBarTitle({
        title: `${config.appName}（测试版）`,
      })
    }

    //等待登录
    loginUtils.waitToLogin(this.onLoginSuccess, this.onLoginFail);
  },

  onLoginSuccess() {
    handleGetHomeData(this);
  },

  onLoginFail() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    homeSignals.reset.add(this.reset);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  onUnload(){
    //停止监听登录
    loginUtils.unWaitToLogin(this.onLoginSuccess, this.onLoginFail);
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return handleShare();
  },
  bindGetUserInfo(e) {
    const that = this;
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '请求中...',
        mask: true,
      });

      updateUserInfo(e, {
        success: () => {

          this.setData({
            is_authorized: 1,
          });

          handleCommit(this.data.question_list, this.data.paper_id);
        },
        fail: (e) => {
          wx.hideLoading();

          wx.showToast({
            title: e && e.msg || "网络错误，请重试",
            icon: "none",
          });
        }
      });
    }
  },
  // 广告点击
  adClick(e) {
    const adData = this.data.adData1;
    if (adData) {
      ad_statistics_click(adData.click_url, adData.sensors_ad_click_url, this.data.properties);
    }
  },
  handleStartBtnClick() {
    wx.showLoading({
      icon: 'none',
      title: '加载中',
      mask: true,
    });

    requestProblemData().then((data) => {
      this.setData({
        question_list: data.question_list,
        isStart: true,
        paper_id: data.paper_id,
        is_authorized: data.is_authorized,
        maxQuestionIndex: 0,
      });
      wx.hideLoading();

    }, (e) => {
      wx.hideLoading();
    });
  },
  handleSelect(e) {
    const question_index = e.target.dataset.question_index;
    const selectVaule = e.detail.value;

    const question_list = this.data.question_list;
    const questionData = question_list[question_index];
    questionData.selected = selectVaule;

    this.setData({
      question_list: question_list
    });

    const isAnswerAll = this.checkAnswerAll();
    if (this.data.isAnswerAll != isAnswerAll) {
      this.setData({
        isAnswerAll: isAnswerAll
      });
    }

  },
  /**
   * 检查是不是回答了所有问题
   */
  checkAnswerAll() {
    const question_list = this.data.question_list;
    for (let i = 0, questionNum = question_list.length; i < questionNum; i++) {
      const questionData = question_list[i];
      if (!questionData.selected) {
        return false;
      }
    }
    return true;
  },
  radioChange(e) {
    this.handleSelect(e);

    tongJiAnswer(e, this.data.question_list);

    handleJumpToNextQuestion(this, e.target.dataset.question_index);
  },
  bindDateChange(e) {
    this.handleSelect(e);

    tongJiAnswer(e, this.data.question_list);

    handleJumpToNextQuestion(this, e.target.dataset.question_index);

  },

  bindKeyInput(e) {
    // this.handleSelect(e);
  },
  bindblur(e) {
    this.handleSelect(e);
    tongJiAnswer(e, this.data.question_list);

    handleJumpToNextQuestion(this, e.target.dataset.question_index);
  },
  handleCommitBtnClick() {
    handleCommit(this.data.question_list, this.data.paper_id);
  },

})