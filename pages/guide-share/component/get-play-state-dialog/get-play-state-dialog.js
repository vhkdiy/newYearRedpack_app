import GuideShareSignal from './../../modules/guide-share-signal.js';

Component({

  properties: {

  },


  data: {
    requesting: false,
  },

  methods: {
    catchtouchmove() {

    },

    onCloseDialogBtnClick(){
      GuideShareSignal.getPayStateDialog.dispatch(false);
    },

    onRequestPayStateBtnClick(){
        
    }

  }
})