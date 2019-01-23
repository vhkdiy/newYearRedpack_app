import {request} from '../request'
import { phead } from '../phead';
import ShareType from '../share-type';

/**
 * 处理好友关系
 */
module.exports = {
    /**
     * 添加邀请签到信息
     * 
     */
    addInviteSignReqData:function(data){
        if(!data){
            return data
        }
        let query = getApp().globalData.query;
        let { phoneid } = phead
        if (query) {
          let {openId,type} = query
          // 类型是邀请签到 且 不是本人
          if(type == ShareType.SHARE_TYPE_SIGN_INVITE
              && openId && openId !== phoneid){
            data.invite_friend_openid = openId
          }
        }
        return data
      }
}