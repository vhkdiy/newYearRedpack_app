/**
 * 预加载控件
 */
let loadList = []

Component({
  properties: {
    list: Array,
  },
  data: {
    loading: true,
    imglist: []
  },
  attached: function() {
    // 数组去重
    let list = Array.from(new Set(this.properties.list))
    if (list && list.length <= 0) {
      this.setData({
        loading: false
      })
    }
    loadList = list.map((item) => {
      return {
        src: item,
        finishLoad: false
      }
    })
    this.setData({
      imglist: loadList
    })
  },
  methods: {
    bindLoad(e) {
      this.handleLoad(e)
    },
    bindError(e) {
      this.handleLoad(e)
    },
    /**
     * 处理加载成功或者失败回调
     * 
     */
    handleLoad(e) {
      let src = e.currentTarget.dataset.src
      let item = loadList.find((item) => {
        return item.src === src
      })
      if (item) {
        item.finishLoad = true
      }
      let needLoad = loadList.some((item) => {
        return item.finishLoad === false
      })
      if (!needLoad) {
        this.setData({
          loading: false
        })
      }
    }
  },
})