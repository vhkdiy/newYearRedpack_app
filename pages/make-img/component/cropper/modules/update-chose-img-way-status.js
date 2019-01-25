const handleShow = (_this) => {
  // 显示遮罩层
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  _this.animation = animation;
  animation.translateY(300).step()

  var animationPop = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  _this.animationPop = animationPop;
  animationPop.backgroundColor('rgba(0, 0, 0, 0)').step()

  _this.setData({
    animationData: animation.export(),
    animationPop: animationPop.export(),
    isShowAcceleratePop: true
  })


  setTimeout(function() {
    animation.translateY(0).step();
    animationPop.backgroundColor('rgba(0, 0, 0, 0.4)').step();
    _this.setData({
      animationData: animation.export(),
      animationPop: animationPop.export()
    })
  }.bind(_this), 200)
}


const handleHideHide = function(_this) {
  // 隐藏遮罩层
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  _this.animation = animation;
  animation.translateY(300).step();


  var animationPop = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  _this.animationPop = animationPop;
  animationPop.backgroundColor("rgba(0, 0, 0, 0)").step();

  _this.setData({
    animationData: animation.export(),
    animationPop: animationPop.export(),
  })
  setTimeout(function() {
    animation.translateY(0).step();
    animationPop.backgroundColor("rgba(0, 0, 0, 0.4)").step()

    _this.setData({
      animationData: animation.export(),
      animationPop: animationPop.export(),
      isShowAcceleratePop: false
    })
  }.bind(_this), 200)
}



export default {
  show: handleShow,
  hide: handleHideHide,
};