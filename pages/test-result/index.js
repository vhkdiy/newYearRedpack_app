const downloader = new Downloader();
// 使用
// downloader.download('https://img.xmiles.cn/shuanmin/mian_page_title.png').then((localUrl) => {
//   console.log("用这个 localUrl去画");
//   console.log(localUrl);
// });
const app = getApp();
import {requestData} from './js/requestData.js';
import {phead} from './../../utils/phead.js'
import  sceneUtil  from './../../utils/share/scene-util.js';
import share from './../../utils/share.js';
import Downloader from './../../component/painter/lib/downloader.js';

//全局配置
const bgPath = "./img/img.jpg";
const multipleConst = 130; //配置六边形放大倍数
const verticalConst = 162;  //六边形上下偏移量

//标准六边形
const hexagonDrawLineWidth = 1; //配置六边形线宽度
const hexagonDrawLineColor = "rgba(0, 0, 0, 1)"; //配置六边形线颜色
const hexagonDrawArc = true; //是否在连接处画圆圈
const hexagonDrawArcRaduis = 3; //圆的半径
const hexagonDrawArcColor = "#FBCC0E";  //圆的填充颜色
const hexagonImaginaryLineWidth = 0.3;   //虚线的宽度
const hexagonImaginaryLineColor = "rgba(0, 0, 0, 0.3)";   //虚线的颜色

//数据得出六边形
const self_hexagonDrawLineWidth = 1; //配置六边形线宽度
const self_hexagonDrawLineColor = "#FBCC0E"; //配置六边形线颜色
const self_hexagonFill = true; //是否填充
const self_hexagonFillColor = "#FBCC0E"; //配置六边填充颜色

//动画配置
const animation = true; //是否启用动画
const animationDelay = 200; //动画开始前延迟多少毫秒
const frames = 25; //动画帧数
const framesTime = 40; //每一帧间隔时间多少ms

//配置文字
const fontSizeExcursion = 22; //配置文字距离点的偏移量
const luckFontSize = 15       //配置幸运文字大小
const luckFontColor = "#2B2B52"; //配置文字颜色
const fontSize = 12;        //配置普通文字大小
const fontColor = "rgba(43,43,82,0.7)";    //配置文字颜色


var luckItem = 0;           //该选项配置无效的
var screenHeight = null;
var screenWidth  = null;
var screenWidth_2 = null;
var imgHeight = null;
var rate = 0; //比率

var multiple = 120;
var vertical = 162;

Page({
  data: {
    properties: {
      app_title: '幸运指北',
      $title: '幸运指北',
      url: 'page/test-result/index'
    },
    canvasHeight : 0,       //canvas高度

    data : null,            //网络获取的数据
    name : null,            //用户名
    dataList : null,        //每一项的值
    result_list : null,     //每一项名称
    desc : null,            //财运解释
    avator : null,          //头像
    calc_desc_url : null,   //称号
    paper_id : null,        //传递过来的参数
    qr_code_url : null,     //二维码
    openId : null,          //用户带过来的openId
    adData : null,          //广告数据
    answer_id : null,

    isShowOpensettingDialog : false,
    dialogType : 'image'
  },
  gotoHome : function () {
    wx.redirectTo({
      url: '/pages/index/index',
    });
  },
  //数据初始化
  initData : function(){
    const systemInfo = wx.getSystemInfoSync();
    screenWidth = systemInfo.screenWidth;
    screenHeight = systemInfo.screenHeight;

    screenWidth_2 = screenWidth / 2;
    rate = screenWidth / 750
    imgHeight = 826 * rate;

    //设置canvas 高度
    this.setData({canvasHeight: imgHeight});

    vertical = this.rpxChagePx(verticalConst) + this.rpxChagePx(multipleConst/1.1);
    multiple = this.rpxChagePx(multipleConst);
  },
  
  onLoad : function(options){
    console.error("onLoadOptions");
    console.error(options);
    this.setData({
      paper_id: options.paper_id,
      openId: options.openId && options.openId !== phead.phoneid ? options.openId : null,
      answer_id: options.answer_id ? options.answer_id : null
    })
  },
  onReady: function(options) {
    let that = this;
    this.initData();
    requestData(this).then(() => {
      Promise.all([downloader.download(that.data.avator), 
                   downloader.download(that.data.calc_desc_url),
                   downloader.download(that.data.qr_code_url)]
      ).then(result => {
        that.setData({
          avator : result[0],
          calc_desc_url: result[1],
          qr_code_url : result[2]
        })
        that.getluckItem(that.data.data.calc_result_array);
        that.animationDrawSelfChart(that.data.data.calc_result_array);
      })

    }).catch(e => {
      console.error("catch");
    });
  },
  animationDrawSelfChart: function(percentage) {
    let that = this;
    let hexagonData = this.getHexagonData();
    let fontPosition = this.getFontPosition();
    let delayTimeout = setTimeout(() => {
      clearTimeout(delayTimeout);
      if (animation) {
        for (let i = 0; i <= frames; i++) {
          let timeout = setTimeout(() => {
            clearTimeout(timeout);
            let currentPercentage = that.animationPercentage(percentage, i);
            let selfHexagonData = that.getSelfHexagonData(currentPercentage);
            that.drawChart(hexagonData, selfHexagonData, fontPosition);
          }, framesTime * i);
        }
      } else {
        let selfHexagonData = that.getSelfHexagonData(percentage);
        that.drawChart(hexagonData, selfHexagonData, fontPosition);
      }
    }, animationDelay);

  },
  drawChart: function(hexagon, self_hexagon, fontArr) {

    var context = wx.createCanvasContext('canvas')
    context.clearRect(0, 0, screenWidth, imgHeight);

    //画背景
    context.drawImage(bgPath, 0, 0, screenWidth, imgHeight);

    //画二维码
    let codeImageExcursion = this.rpxChagePx(188);
    let codeImageSize = this.rpxChagePx(102);
    let code_url = this.data.openId ? './img/arrow.png' : this.data.qr_code_url;
    context.drawImage(code_url, screenWidth - codeImageExcursion, imgHeight - codeImageExcursion, codeImageSize, codeImageSize); 

    //二维码文案
    let codeTextX = screenWidth - this.rpxChagePx(221);
    context.setTextAlign("right");
    context.setFillStyle(fontColor);
    context.font = `normal normal 12px sans-serif`;
    let txt = this.data.openId ? "点击下方按钮" : "长按识别二维码";
    context.fillText(txt, codeTextX, imgHeight - this.rpxChagePx(145));
    let txt1 = this.data.openId ?  "测试你2019年的财运" : "测测你的2019年财富指数"
    context.fillText(txt1, codeTextX, imgHeight - this.rpxChagePx(110));


    //画六边形
    //偏移到中间
    context.translate(screenWidth_2, 0);
    context.beginPath();
    context.setStrokeStyle(hexagonDrawLineColor)
    context.setLineWidth(hexagonDrawLineWidth);

    for (let i = 0; i < hexagon.length; i++) {
      let item = hexagon[i];
      if(i == 0){
        context.moveTo(item.x, item.y + vertical);
      }else{
        context.lineTo(item.x, item.y + vertical);
      }
    }
    context.closePath();
    context.stroke();
    
    //画虚线
    context.beginPath();
    context.setStrokeStyle(hexagonImaginaryLineColor)
    context.setLineWidth(hexagonImaginaryLineWidth);
    for (let i = 0; i < hexagon.length; i++) {
      let item = hexagon[i];
      context.moveTo(0, 0 + vertical);
      context.lineTo(item.x, item.y + vertical);
    }
    context.closePath();
    context.stroke();

    //画链接圆
    if (hexagonDrawArc){
      context.beginPath();
      context.setStrokeStyle(hexagonDrawArcColor);
      context.setFillStyle(hexagonDrawArcColor);
      for (let i = 0; i < hexagon.length; i++) {
        let item = hexagon[i];
        context.moveTo(item.x, item.y + vertical);
        context.arc(item.x, item.y + vertical, hexagonDrawArcRaduis, 0, Math.PI * 2, true);
        context.fill();
        
      }
      context.closePath();
      context.stroke();
    }


    //画自己六边形
    context.beginPath();
    context.setStrokeStyle(self_hexagonDrawLineColor)
    context.setLineWidth(self_hexagonDrawLineWidth);
    context.setFillStyle(self_hexagonFillColor);
    for (let i = 0; i < self_hexagon.length; i++) {
      let item = self_hexagon[i];
      i == 0 ? context.moveTo(item.x, item.y + vertical) : context.lineTo(item.x, item.y + vertical);
    }
    self_hexagonFill && context.fill();
    context.closePath();
    context.stroke();


    //画每一项
    context.setTextAlign("center");
    context.setTextBaseline("middle");
    for (let i = 0; i < fontArr.length; i++) {
      let item = fontArr[i];
      if (i == luckItem){
        context.setFillStyle(luckFontColor)
        context.font = `normal bold ${luckFontSize}px sans-serif`;
      }else{
        context.setFillStyle(fontColor);
        context.font = `normal 100 ${fontSize}px sans-serif`;
      }
      context.fillText(item.text, item.x, item.y + vertical);
    }
    context.stroke();



    //画头像
    let iconPath = this.data.avator;
    let iconSize = this.rpxChagePx(80);
    let iconExcursion = -iconSize / 2;
    context.beginPath();
    context.save();
    context.arc(0, 0 + vertical, this.rpxChagePx(40), 0, 2 * Math.PI);
    context.clip();
    context.drawImage(iconPath, iconExcursion, iconExcursion + vertical, iconSize, iconSize);
    context.restore();
    context.stroke();

    //画文案
    context.setTextAlign("center");
    context.setTextBaseline("top");
    context.setFillStyle(luckFontColor);
    context.font = `normal bold 16px PingFangSC-Semibold`;
    context.fillText(`${this.data.name.substring(0, 8)} 2019年财运如下`, 0 , this.rpxChagePx(76));

    //画称号
    let path1 = this.data.calc_desc_url;
    context.drawImage(path1, -screenWidth_2 + this.rpxChagePx(90), this.rpxChagePx(410), screenWidth - this.rpxChagePx(180), this.rpxChagePx(120));

    //画解释
    let text = this.data.desc;
    let txtWidth = context.measureText(text).width / screenWidth;
    let lineNumber =  parseInt(txtWidth) == txtWidth ? parseInt(txtWidth) : parseInt(txtWidth) + 1;
    let textNum = parseInt( text.length / lineNumber );
    context.font = `normal normal 12px sans-serif`;
    for (let index = 0; index < lineNumber ; index ++){
      if (index == lineNumber - 1){
        context.fillText(text.substr(index * textNum, text.length - 1), 0, this.rpxChagePx( 530 + (33 * index) ) );
      }else{
        context.fillText(text.substr(index * textNum, textNum), 0, this.rpxChagePx( 530 + (33 * index) ) );
      }
    }

    context.draw();
  },
  //获取六边形的坐标
  getHexagonData() {
    let value_sqrt = Math.sqrt(3) / 2 * multiple;
    let base = multiple;
    let aHalf = multiple / 2;
    let A = { x: -base, y: 0};
    let B = {x: -aHalf,y: -value_sqrt};
    let C = {x: aHalf,y: -value_sqrt};
    let D = {x: base,y: 0};
    let E = {x: aHalf,y: value_sqrt};
    let F = {x: -aHalf,y: value_sqrt};
    return [A, B, C, D, E, F];
  },
  //获取文案坐标
  getFontPosition: function() {
    let hexagonData = this.getHexagonData();
    let excursionArr = [
      { x: -fontSizeExcursion, y: 0 },
      { x: -fontSizeExcursion, y: 0 },
      { x:  fontSizeExcursion, y: 0 },
      { x:  fontSizeExcursion, y: 0 },
      { x:  fontSizeExcursion, y: 0 },
      { x: -fontSizeExcursion, y: 0 }
    ];
    //写入文案
    for (let i = 0; i < excursionArr.length ; i ++){
      excursionArr[i].text = this.data.result_list[i]
    }
    let fontPositionArr = [];
    for (let i = 0; i < hexagonData.length; i++) {
      fontPositionArr.push(this.positionAdd(excursionArr[i], hexagonData[i]));
    }
    return fontPositionArr;
  },
  //获取自己的六边形
  getSelfHexagonData(percentage) {
    let hexagonData = this.getHexagonData();
    let selfHexagonData = [];
    for (let i = 0; i < hexagonData.length; i++) {
      selfHexagonData.push(this.positionScale(hexagonData[i], percentage[i]));
    }
    return selfHexagonData;
  },
  //坐标相加函数
  positionAdd: function(value1, value2) {
    value1.x += value2.x;
    value1.y += value2.y;
    return value1;
  },
  //坐标缩放函数
  positionScale: function(value, scale) {
    value.x *= scale;
    value.y *= scale;
    return value;
  },
  //动画百分比计算
  animationPercentage: function(percentage, frame) {
    let currentPercentage = [];
    for (let item of percentage) {
      currentPercentage.push(item * frame / frames);
    }
    return currentPercentage;
  },
  //获取最佳选项
  getluckItem: function (percentage){
    let max = percentage[0];
    let index = 0;
    for (let i = 1; i < percentage.length ; i++){
      if( percentage[i] > max ) {
         max = percentage[i];
         index = i;
      }
    }
    luckItem = index;
  },
  //单位转化px转化为rpx
  rpxChagePx : function(rpx){
    return  rpx * rate;
  },
  shareImage : function(){
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: screenWidth,
      height: imgHeight,
      canvasId: 'canvas',
      success: function (res) {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(res) {
                  wx.showToast({
                    title: '成功保存到相册了。',
                  })
                },
                fail(res){
                    that.setData({
                      isShowOpensettingDialog: true,
                      dialogType: 'image'
                    })
                }
              })
          }
    });
    app.sensors.track('XMClick', {
      "contentid": "分享到朋友圈",
      "ck_module": "分享到朋友圈",
      "page": "/pages/test-result/index"
    });
  },
  onShareAppMessage: function (res) {
    let luckName = this.data.result_list[luckItem];
    return share.getShare("/pages/test-result/index", `paper_id=${this.data.paper_id}&answer_id=${this.data.answer_id}`, app, {
        page: '测试结果',
        share_module: '推荐给好友'
    }, "undefined", luckName );
    }
  

})