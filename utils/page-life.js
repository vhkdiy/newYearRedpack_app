// 解析特殊route工具
import routeUtil from './parse-special-route-utils'
// 通用生命周期处理方法
(function() {

  var pageStartTime;
  // onshow携带的option
  var showOption;
  
  function onPageShow(e) {
    showOption = this.options;
    pageStartTime = new Date().getTime(); 
  }
  function onPageHide(e) {
    wx.hideNavigationBarLoading();
    var duration = (new Date().getTime() - pageStartTime)/1000;
    getApp().sensors.track('XMPageHide', {
      url_path: routeUtil.parseSpecialRoute(this.route,showOption) ,
      duration: duration
    })
    showOption = null
  }
  function onPageUnload(e) {
    wx.hideNavigationBarLoading();
    var duration = (new Date().getTime() - pageStartTime) / 1000;
    getApp().sensors.track('XMPageHide', {
      url_path: routeUtil.parseSpecialRoute(this.route,showOption) ,
      duration: duration
    })
    showOption = null
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

  var thisPage = Page;
  Page = function (args) {
    call(args, "onShow", onPageShow);
    call(args, "onHide", onPageHide);
    call(args, "onUnload", onPageUnload);
    thisPage(args)
  }
})();