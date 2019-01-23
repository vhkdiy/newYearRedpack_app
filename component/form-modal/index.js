//弹窗
Component({
  //组件的属性列表
  options: {
    multipleSlots: false
  },
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function(newVal, oldVal) {
        if (newVal) {
          this.setData({
            innerShow: newVal
          });
          setTimeout(() => {
            this.setData({
              showing: true
            });
          }, 50);
        } else {
          this.setData({
            showing: false
          });
          setTimeout(() => {
            this.setData({
              innerShow: false
            });
          }, 350);
        }
      }
    },
    position: {
      type: String,
      value: 'center',
      observer: function (newVal, oldVal) {
        this.setData({
          position: newVal
        })
      }
    }
  },
  //组件的初始数据
  data: {
    position: 'center',
    innerShow: false,
    showing : false
  },
  //组件的方法列表
  methods: {
    onTapMask: function(e) {
      this.triggerEvent('onHide', e, {});
    }
  }
})
