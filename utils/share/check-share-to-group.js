import {phead} from './../phead.js';
/**
 * 检查是不是成功分享到群
 */
const checkShareToGroup = function(res) {
  return new Promise((r, j) => {
    const isIOS = phead.platform == 'ios';
    if (!res.shareTickets) {
      j(res.shareTickets);
    } else {
      wx.getShareInfo({ //获取群详细信息
        shareTicket: res.shareTickets,
        success: function(res) {
          /**
           * res:{"encryptedData":"", "iv":""}
           */
          r(res);
        },
        fail: function(e) {
          j(e);
        }
      })
    }
  });
}

export default checkShareToGroup;