// component/tab/tab.js
import homeSignals from './../../pages/index/modules/home-signals.js';

const TAB_TYPE = {
  NORMAL: 0,
  JUMP_WXAPP: 1,
};

const tabList = [{
    name: "首页",
    image_normal: "./../../images/home_icon.png",
    image_selected: "./../../images/home_icon_down.png",
    type: TAB_TYPE.NORMAL,
    path: "/pages/index/index",
  },
  {
    name: "免费拿好礼",
    image_normal: "./../../images/gift.png",
    image_selected: "./../../images/gift_selected.png",
    type: TAB_TYPE.JUMP_WXAPP,
    appid: "wxb13b8f52473658ca",
    path: "pages/index/index?utm_source=caiyunzhibei&utm_medium=xiaochengxv&utm_term=tab& utm_content=neibu& utm_campaign=60205",
    show_red_point: 1,
    animation : true
  }
];

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentIndex: {
      type: Number,
      value: -1,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: getApp().globalData.isIphoneX,
    tabList: tabList,
    currentIndex: -1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabClick(e) {
      const tabData = e.currentTarget.dataset.data;
      const HOME_PATH = "/pages/index/index";
      if (tabData.type == TAB_TYPE.NORMAL) {
        const path = tabData.path;

        const pages = getCurrentPages();
        // console.log(pages);
        if (pages.length > 0) {
          if ((`/${pages[0].route}` != path) && (path != HOME_PATH)) {
            wx: wx.navigateTo({
              url: path,
            });
            return;
          } else if (path == HOME_PATH) {
            let includeHome = false;
            for (let i = 0, len = pages.length; i < len; i++) {
              const page = '/' + pages[0].route;
              if (page == HOME_PATH) {
                includeHome = true;
                break;
              }
            }

            if (includeHome) {
              wx.navigateBack({
                url:path,
                success:()=> {
                  homeSignals.reset.dispatch();
                }
              })
            } else {
              wx.redirectTo({
                url: path,
              })
            }
          }
        }
      }
    },
  }
})