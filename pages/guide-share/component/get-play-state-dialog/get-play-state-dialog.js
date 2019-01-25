import GuideShareSignal from './../../modules/guide-share-signal.js';
import requestPayState from './../../modules/request-pay-state.js';
import Conts from './../../modules/conts.js';

const max_countdown_time = 5;

Component({
  intervalFunc: null,

  properties: {

  },


  data: {
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
      this.setData({
        requesting: true,
      });
      this.startCountdown();

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

          this.setData({
            requesting: false,
          });
        }

        this.setData({
          countdownTime: countdownTime
        });

      }, 1000);

    },

  },
  attached: function() {
    this.startCountdown();
    this.setData({
      requesting: true,
    });

    requestPayState(Conts.orderId).then(() => {
      setTimeout(() => {
        this.close();
      }, 2000 - this.data.countdownTime);

    }).catch(() => {

    });
  },
  detached() {
    this.clearCountdown();
  },
})