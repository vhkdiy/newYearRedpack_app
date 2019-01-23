const { request } = require('./request.js');

(function() {

  function commitFormId() {
    request({
      funid: 1004,
      data: {
        formid: getApp().globalData.formIdList
      },
      success: result => {
        getApp().globalData.formIdList = [];
      },
      fail: (e) => {
        console.log('send formid fail' + e);
      }
    })
  }
  function onPageShow(e) {
    if (!getApp().globalData.commitFormId1 && getApp().globalData.formIdList.length >= 1) {
      commitFormId();
      getApp().globalData.commitFormId1 = true;
      wx.setStorage({
        key: 'commit_formid_1',
        data: Date.now(),
      })
    } else if (!getApp().globalData.commitFormId3 && getApp().globalData.formIdList.length >= 3) {
      commitFormId();
      getApp().globalData.commitFormId3 = true;
      wx.setStorage({
        key: 'commit_formid_3',
        data: Date.now(),
      })
    } else if (!getApp().globalData.commitFormId7 && getApp().globalData.formIdList.length >= 7) {
      commitFormId();
      getApp().globalData.commitFormId7 = true;
      wx.setStorage({
        key: 'commit_formid_7',
        data: Date.now(),
      })
    }
  }

  function call(object, functionName, injectFunction) {
    if (object[functionName]) {
      var i = object[functionName];
      object[functionName] = function (e) {
        injectFunction.call(this, e, functionName);
        return i.call.apply(i, [this].concat(Array.prototype.slice.call(arguments)))
      }
    } else {
      object[functionName] = function (e) {
        injectFunction.call(this, e, functionName)
      }
    }
  }

  function isToday(timeInMillisecond) {
    return new Date().toDateString() === new Date(timeInMillisecond).toDateString();
  }

  function onAppLaunch(e) {
    wx.getStorage({
      key: 'commit_formid_1',
      success: (res) => {
        this.globalData.commitFormId1 = isToday(res.data);
      }
    });
    wx.getStorage({
      key: 'commit_formid_3',
      success: (res) => {
        this.globalData.commitFormId3 = isToday(res.data);
      }
    });
    wx.getStorage({
      key: 'commit_formid_7',
      success: (res) => {
        this.globalData.commitFormId7 = isToday(res.data);
      }
    });
  }

  var thisApp = App;
  App = function (args) {
    call(args, "onLaunch", onAppLaunch);
    thisApp(args)
  }

  var thisPage = Page;
  Page = function (args) {
    call(args, "onShow", onPageShow);
    thisPage(args)
  }
})();