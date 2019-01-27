import GuideShareSignal from './../../modules/guide-share-signal.js';
import requestPayState from './../../modules/request-pay-state.js';
import Conts from './../../modules/conts.js';

const max_countdown_time = 5;

Component({
  intervalFunc: null,

  properties: {

  },


  data: {
    isPayFail: false,
    requesting: false,
    countdownTime: max_countdown_time,
  },

  methods: {
    catchtouchmove() {

    },
    close() {
      GuideShareSignal.getPayStateDialog.dispatch(false);
    },

    onCloseDialogBtnClick() {
      this.close();
    },

    onRequestPayStateBtnClick() {
      this.requestState();
    },
    clearCountdown() {
      this.intervalFunc && clearInterval(this.intervalFunc);
    },

    startCountdown() {
      this.clearCountdown();
      this.setData({
        countdownTime: max_countdown_time,
      });

      this.intervalFunc = setInterval(() => {
        let countdownTime = this.data.countdownTime - 1;
        if (countdownTime < 0) {
          countdownTime = 0;
          clearInterval(this.intervalFunc);

          // this.setData({
          //   requesting: false,
          // });
        }

        this.setData({
          countdownTime: countdownTime
        });

      }, 1000);

    },

    requestState() {
      this.startCountdown();
      this.setData({
        requesting: true,
      });
      requestPayState(Conts.orderId).then((data) => {
        if (data.status == 1) {
          setTimeout(() => {
            this.close();
          }, 2000 - this.data.countdownTime);
        } else if (data.status == -2) {
          //付款失败
          this.setData({
            isPayFail: true,
          });
        }

      }).catch(() => {
      });
    },

    goBack() {
      wx.navigateBack({

      });
    },

  },
  attached: function() {
    this.requestState();
  },
  detached() {
    this.clearCountdown();
  },
})