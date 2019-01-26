// component/cropper/cropper.js
import updateChoseImgWayStatus from './modules/update-chose-img-way-status.js';

const device = wx.getSystemInfoSync();
const K = (device.windowWidth / 750) || 0.5;

var twoPoint = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0
};

Component({
  startTouchTime: 0,
  /**
   * 组件的属性列表
   */
  properties: {
    ratio: {
      type: Number,
      observer: function(newVal, oldVal) {
        this.setData({
          width: 473 * K,
          height: 473 * K,
        })
      }
    },
    url: {
      type: String,
      observer(newVal, oldVal) {
        this.initImg(newVal)
      }
    },
    topImg: {
      type: String,
      observer(newVal, oldVal) {
        this.setData({
          topImg: newVal
        });
      }
    },
    avatarUrl: {
      type: String,
      observer(newVal, oldVal) {
        this.setData({
          avatarUrl: newVal
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    canvasScale: 2, //canvas缩放的比
    template: null,
    isTouching: false,
    width: 473 * K, //剪裁框的宽度
    height: 473 * K, //剪裁框的长度
    originImg: null, //存放原图信息
    topImg: null,
    avatarUrl: null,
    stv: {
      offsetX: 0, //剪裁图片左上角坐标x
      offsetY: 0, //剪裁图片左上角坐标y
      zoom: false, //是否缩放状态
      distance: 0, //两指距离
      scale: 1, //缩放倍数
      rotate: 0 //旋转角度
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    rotate() {
      let _this = this;
      _this.setData({
        'stv.rotate': _this.data.stv.rotate % 90 == 0 ? _this.data.stv.rotate = _this.data.stv.rotate + 90 : _this.data.stv.rotate = 0
      })
    },

    onImgOK(e) {
      wx.hideLoading();

      //生成图片成功的回调
      const imagePath = e.detail.path;

      this.triggerEvent("getCropperImg", {
        url: imagePath
      });
    },

    imgErr() {
      this.handleError();
    },

    handleError() {
      wx.hideLoading();
      wx.showToast({
        title: '失败了，请重试',
        icon: 'none',
      })
    },

    // canvas剪裁图片
    cropperImg() {
      wx.showLoading({
        title: '图片生成中',
        mask: true,
      });

      let _this = this;
      let ctx = wx.createCanvasContext('imgcrop', this);
      let cropData = _this.data.stv;

      const SCALE = this.data.canvasScale;
      let x = 0;
      let y = 0;
      let movex = 0;
      let movey = 0;

      const originImg = _this.data.originImg;
      let originImgWidth = 0;
      let originImgHeight = 0;

      if (originImg) {
        originImgWidth = originImg.width;
        originImgHeight = originImg.height;

        // 缩放偏移值
        x = (originImgWidth - originImgWidth * cropData.scale) / 2;
        y = (originImgHeight - originImgHeight * cropData.scale) / 2;

        //画布中点坐标转移到图片中心
        movex = (cropData.offsetX + x) * SCALE + originImgWidth * cropData.scale;
        movey = (cropData.offsetY + y) * SCALE + originImgHeight * cropData.scale;

      }

      this.setData({
        template: {
          width: `${this.data.width}px`,
          height: `${this.data.height}px`,
          views: [
            {
              //镂空出来的那个图片  
              type: 'rect',
              css: {
                width: `${this.data.width * SCALE}px`,
                height: `${this.data.height * SCALE}px`,
                left: `0px`,
                top: `0px`,
                color: "#F9F7FA",
              },
            },
            {
              //镂空出来的那个图片  
              type: 'image',
              url: (originImg && originImg.url) || "",
              css: {
                left: `${(cropData.offsetX + x) * SCALE}px`,
                top: `${(cropData.offsetY + y) * SCALE}px`,
                width: `${originImgWidth * SCALE * cropData.scale}px`,
                height: `${originImgHeight * SCALE * cropData.scale}px`,
                mode: "aspectFill",
                rotate: `${cropData.rotate}`,
              },
            },
            {
              //上层展示的图片 
              type: 'image',
              url: _this.data.topImg,
              css: {
                width: `${this.data.width * SCALE}px`,
                height: `${this.data.height * SCALE}px`,
                left: `0px`,
                top: `0px`,
                mode: "aspectFill",
              },
            }

          ],
        },
      });

    },

    initImg(url) {
      let _this = this;
      wx.getImageInfo({
        src: url,
        success(resopne) {
          console.log(resopne);
          let innerAspectRadio = resopne.width / resopne.height;

          if (innerAspectRadio < _this.data.width / _this.data.height) {
            _this.setData({
              originImg: {
                url: url,
                width: _this.data.width,
                height: _this.data.width / innerAspectRadio
              },
              stv: {
                offsetX: 0,
                offsetY: 0 - Math.abs((_this.data.height - _this.data.width / innerAspectRadio) / 2),
                zoom: false, //是否缩放状态
                distance: 0, //两指距离
                scale: 1, //缩放倍数
                rotate: 0
              },
            })
          } else {
            _this.setData({
              originImg: {
                url: url,
                height: _this.data.height,
                width: _this.data.height * innerAspectRadio
              },
              stv: {
                offsetX: 0 - Math.abs((_this.data.width - _this.data.height * innerAspectRadio) / 2),
                offsetY: 0,
                zoom: false, //是否缩放状态
                distance: 0, //两指距离
                scale: 1, //缩放倍数
                rotate: 0
              }
            })
          }
        }
      })
    },
    //事件处理函数
    touchstartCallback: function(e) {
      this.startTouchTime = Date.now();

      if (e.touches.length === 1) {
        let {
          clientX,
          clientY
        } = e.touches[0];
        this.startX = clientX;
        this.startY = clientY;
        this.touchStartEvent = e.touches;
      } else {
        let xMove = e.touches[1].clientX - e.touches[0].clientX;
        let yMove = e.touches[1].clientY - e.touches[0].clientY;
        let distance = Math.sqrt(xMove * xMove + yMove * yMove);
        twoPoint.x1 = e.touches[0].pageX * 2
        twoPoint.y1 = e.touches[0].pageY * 2
        twoPoint.x2 = e.touches[1].pageX * 2
        twoPoint.y2 = e.touches[1].pageY * 2
        this.setData({
          'stv.distance': distance,
          'stv.zoom': true, //缩放状态
        })
      }

      this.setData({
        isTouching: this.data.originImg && true,
      });

    },
    //图片手势动态缩放
    touchmoveCallback: function(e) {
      let _this = this
      fn(_this, e)
    },
    touchendCallback: function(e) {
      //触摸结束
      if (e.touches.length === 0) {
        this.setData({
          'stv.zoom': false, //重置缩放状态
        })
      }

      if (e.changedTouches.length === 1 && (Date.now() - this.startTouchTime < 200)) {
        const { clientX, clientY} = e.changedTouches[0];
        const d = Math.sqrt(Math.pow(clientX - this.startX, 2) + Math.pow(clientY - this.startY, 2));
        if (d < 10) {
          this.choseImg();
        }
      }


      this.setData({
        isTouching: false,
      });
    },

    choseImg() {
      // if (this.data.originImg) {
      //   return;
      // }
      updateChoseImgWayStatus.show(this);
      
    },

    hideChoseImgWayPop() {
      updateChoseImgWayStatus.hide(this);
    },

    choseImgFromAlbum() {
      wx.chooseImage({
        count: 1, //只能选择一张
        success: (res) => {
          const filePath = res.tempFilePaths[0];
          this.setData({
            url: filePath,
          });
        },
      });
    },

    onUseUserIconBtnClick() {
      this.setData({
        url: this.data.avatarUrl,
      });
    },

  }
});

/**
 * fn:延时调用函数
 * delay:延迟多长时间
 * mustRun:至少多长时间触发一次
 */
var throttle = function(fn, delay, mustRun) {
  var timer = null,
    previous = null;

  return function() {
    var now = +new Date(),
      context = this,
      args = arguments;
    if (!previous) previous = now;
    var remaining = now - previous;
    if (mustRun && remaining >= mustRun) {
      fn.apply(context, args);
      previous = now;
    } else {
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);

    }
  }
}

var touchMove = function(_this, e) {
  //触摸移动中
  if (e.touches.length === 1) {
    //单指移动
    if (_this.data.stv.zoom) {
      //缩放状态，不处理单指
      return;
    }
    let {
      clientX,
      clientY
    } = e.touches[0];
    let offsetX = clientX - _this.startX;
    let offsetY = clientY - _this.startY;
    _this.startX = clientX;
    _this.startY = clientY;
    let {
      stv
    } = _this.data;
    stv.offsetX += offsetX;
    stv.offsetY += offsetY;
    stv.offsetLeftX = -stv.offsetX;
    stv.offsetLeftY = -stv.offsetLeftY;
    _this.setData({
      stv: stv
    });

  } else if (e.touches.length === 2) {
    //计算旋转
    let preTwoPoint = JSON.parse(JSON.stringify(twoPoint))
    twoPoint.x1 = e.touches[0].pageX * 2
    twoPoint.y1 = e.touches[0].pageY * 2
    twoPoint.x2 = e.touches[1].pageX * 2

    function vector(x1, y1, x2, y2) {
      this.x = x2 - x1;
      this.y = y2 - y1;
    };

    //计算点乘
    function calculateVM(vector1, vector2) {
      return (vector1.x * vector2.x + vector1.y * vector2.y) / (Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y) * Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y));

    }
    //计算叉乘
    function calculateVC(vector1, vector2) {
      return (vector1.x * vector2.y - vector2.x * vector1.y) > 0 ? 1 : -1;
    }

    let vector1 = new vector(preTwoPoint.x1, preTwoPoint.y1, preTwoPoint.x2, preTwoPoint.y2);
    let vector2 = new vector(twoPoint.x1, twoPoint.y1, twoPoint.x2, twoPoint.y2);
    let cos = calculateVM(vector1, vector2);
    let angle = Math.acos(cos) * 180 / Math.PI;

    let direction = calculateVC(vector1, vector2);
    let _allDeg = direction * angle;


    // 双指缩放
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);

    let distanceDiff = distance - _this.data.stv.distance;
    let newScale = _this.data.stv.scale + 0.005 * distanceDiff;

    if (Math.abs(_allDeg) > 1) {
      _this.setData({
        'stv.rotate': _this.data.stv.rotate + _allDeg
      })
    } else {
      //双指缩放
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);

      let distanceDiff = distance - _this.data.stv.distance;
      let newScale = _this.data.stv.scale + 0.005 * distanceDiff;
      if (newScale < 0.2 || newScale > 2.5) {
        return;
      }
      _this.setData({
        'stv.distance': distance,
        'stv.scale': newScale,
      })
    }
  } else {
    return;
  }
}

//为touchMove函数节流
const fn = throttle(touchMove, 10, 10);