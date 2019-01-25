
import signals from './../../../utils/signals/signals.min.js';
const Signal = signals.Signal;


export default class GuideShareSignal {
  static getPayStateDialog = new Signal();
  static notifyPaySuccess = new Signal();
}