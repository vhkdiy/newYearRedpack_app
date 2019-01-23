import {request} from './../request'
import { phead } from './../phead';

/**
 * 处理好友关系
 */
module.exports = {
    /**
     * 上传openId,生产好友关系
     */
    handleRelation: function () {
        let { query } = getApp().globalData;
        if (!query) {
            return
        }
        let { openId } = query
        let { phoneid } = phead
        // 含有被邀请的openid 及 不是本人点击
        if (openId && phoneid && phoneid !== openId) {
            request({
                funid: 71,
                data: {
                    "inviteOpenId": openId,
                    "acceptOpenId": phoneid
                },
                success: res => {
                    
                },
                fail: res => {
                   
                }
            })
        }
    }
}