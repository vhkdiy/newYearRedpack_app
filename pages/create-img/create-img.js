import UploadFileManager from "../../utils/upload/UploadFileManager";
import cax from './../../component/cax/index.js'


Page({
  startX : 0,
  startY : 0,
  curX: 100,
  curY: 100,

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const info = wx.getSystemInfoSync()
    const stage = new cax.Stage(info.windowWidth * 0.75, info.windowHeight / 2, 'myCanvas', this)
    stage.disableMoveDetection = false;

    const rect = new cax.Rect(100, 100, {
      fillStyle: 'black'
    })

    rect.originX = 50
    rect.originY = 50
    rect.x = this.curX
    rect.y = this.curY
    rect.rotation = 30

    rect.on('touchstart', () => {
      console.log('rect touchstart')
    })

    rect.on('touchmove', () => {
      console.log('rect touchmove')
    })

    rect.on('touchend', () => {
      console.log('rect touchend')
    })

    // rect.on('tap', () => {
    //   console.log('rect tap')
    // })


    stage.add(rect)

    const button = new cax.Button({ width: 100, height: 40, text: "I am button!" })
    button.y = 170
    button.x = 20
    stage.add(button)




    const bitmap = new cax.Bitmap('https://img.xmiles.cn//Users/apple/Desktop/%E5%B0%8F%E8%BF%88/workdata/%E4%B8%96%E7%95%8C%E6%9D%AF%E4%B8%93%E9%A2%98/WechatIMG188.png');

    bitmap.x = 0;
    bitmap.y = 0;




    rect.on('touchstart', (e) => {
      console.log('bitmap touchstart', e.pureEvent.changedTouches[0].x)

      const position = e.pureEvent.changedTouches[0];
      this.startX = position.x;
      this.startY = position.y;

    });

    rect.on('touchmove', (e) => {
      console.log('bitmap touchmove', e.pureEvent.changedTouches[0].x)

      const position = e.pureEvent.changedTouches[0];
      const moveX = position.x - this.startX;
      const moveY = position.y - this.startY;

      this.curX += moveX;
      this.curY += moveY;

      console.log(" this.curX: " + this.curX);
      console.log(" this.curY: " + this.curY);


      this.startX = position.x;
      this.startY = position.y;

      rect.x = this.curX;
      rect.y = this.curY;
      stage.update();

    });

    // stage.add(bitmap);


    const sprite = new cax.Sprite({
      framerate: 7,
      imgs: ['https://r.photo.store.qq.com/psb?/V137Nysk1nVBJS/09YJstVgoLEi0niIWFcOJCyGmkyDaYLq.tlpDE62Zdc!/r/dDMBAAAAAAAA'],
      frames: [
        // x, y, width, height, originX, originY ,imageIndex
        [0, 0, 32, 32],
        [32 * 1, 0, 32, 32],
        [32 * 2, 0, 32, 32],
        [32 * 3, 0, 32, 32],
        [32 * 4, 0, 32, 32],
        [32 * 5, 0, 32, 32],
        [32 * 6, 0, 32, 32],
        [32 * 7, 0, 32, 32],
        [32 * 8, 0, 32, 32],
        [32 * 9, 0, 32, 32],
        [32 * 10, 0, 32, 32],
        [32 * 11, 0, 32, 32],
        [32 * 12, 0, 32, 32],
        [32 * 13, 0, 32, 32],
        [32 * 14, 0, 32, 32]
      ],
      animations: {
        walk: {
          frames: [0, 1]
        },
        happy: {
          frames: [11, 12, 13, 14]
        },
        win: {
          frames: [7, 8, 9, 10]
        }
      },
      currentAnimation: 'walk',
      animationEnd: function () {
      }
    })

    sprite.x = 100
    sprite.y = 100
    stage.add(sprite)


    // setInterval( () => {
    //   rect.rotation++;
    //   rect.x = this.curX;
    //   rect.y = this.curY;
    //   stage.update();
    // }, 16)

    stage.update()

    // stage.disableMoveDetection = false;

  },

  choseImg(e){
      wx.chooseImage({
        success: (e) =>{
          console.log(e)
          UploadFileManager.uploadImgToQiniu(e.tempFilePaths[0]).then((imgUrl) =>{
            console.log("imgUrl:" + imgUrl);
          });
        },
      });
  }
});