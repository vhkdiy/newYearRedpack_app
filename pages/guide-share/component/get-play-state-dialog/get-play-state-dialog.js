import GuideShareSignal from './../../modules/guide-share-signal.js';

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

    onCloseDialogBtnClick() {
      GuideShareSignal.getPayStateDialog.dispatch(false);
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
  },
  detached() {
    this.clearCountdown();
  },
})