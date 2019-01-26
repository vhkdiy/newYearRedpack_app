import PageSignal from './../../modules/page-signal.js';

const GuideDatas = [{
    width: 202,
    height: 202,
    left: 277,
    top: 60,
    radius: 2500,
    guideImg: "./images/guide_1.png",
    guideImgTop: 290,
    guideImgLeft: 34,
    guideImgHeight: 99,
  },
  {
    width: 417,
    height: 111,
    left: 163,
    top: 350,
    radius: 0,
    guideImg: "./images/guide_2.png",
    guideImgTop: 470,
    guideImgLeft: 34,
    guideImgHeight: 95,

  },
  {
    width: 726,
    height: 337,
    left: 12,
    top: 500,
    radius: 1000,
    guideImg: "./images/guide_3.png",
    guideImgTop: 338,
    guideImgLeft: 46,
    guideImgHeight: 128,

  }
]


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    maxWidth: 2000,
    guideData: GuideDatas[0],
    guideIndex: 0,
    isLast: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    catchtouchmove() {

    },

    onCoverLayerClick() {
      let guideIndex = this.data.guideIndex;
      if (guideIndex >= GuideDatas.length - 1) {
        return;
      }
      ++guideIndex;

      this.setData({
        guideData: GuideDatas[guideIndex],
        guideIndex: guideIndex,
        isLast: guideIndex >= GuideDatas.length - 1
      });
    },

    closePop() {
      PageSignal.guideSignal.dispatch(false);
    },

    seeAgain() {
      this.setData({
        guideData: GuideDatas[0],
        guideIndex: 0,
        isLast: 0 >= GuideDatas.length - 1
      });
    }

  }
})