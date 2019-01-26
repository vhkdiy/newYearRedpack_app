import {phead} from './../../utils/phead.js';
import scenekeyUtils from './scene-key-utils.js';

const sceneUtil = {
  /**
   * 生成微信二维码分享的 额外参数,字符串不能太长了，
   * 默认拼上 userid：用u代替； channel用c代替；from使用f代替； 页面所需的额外参数自己写，不能太长，最好用一个字符就可以了
   * 如传入{key1:value1,key2:value2,key2:value2}
   * 生成的格式： key1+value1#key2+value2#key3+value3
   */
  creatQrShareScene: function(originShareObj) {
    const app = getApp();

    let finalShareObj = {};
    if (phead.userId) {
      finalShareObj['u'] = phead.userId;
    }

    if (phead.channel) {
      finalShareObj['c'] = phead.channel;
    }

    Object.assign(finalShareObj, originShareObj);

    if (finalShareObj["from"]) {
      finalShareObj["f"] = finalShareObj["from"];
      delete finalShareObj["from"];
    }


    finalShareObj = this.checkAndCreateNewSenceObj(finalShareObj);

    let shareStr = "";
    for (var key in finalShareObj) {
      shareStr += `#${key}+${finalShareObj[key]}`;
    }

    if (shareStr.indexOf("#") == 0) {
      shareStr = shareStr.replace("#", "");
    }

    //默认传一个‘#’过去，防止微信接口报错
    return shareStr || "#";
  },
  checkAndCreateNewSenceObj: function(originSenceObj) {
    if (!originSenceObj) {
      return originSenceObj;
    }

    let totalLen = 0;
    for (let key in originSenceObj) {
      const value = originSenceObj[key];
      const keyLen = (key && String(key).length) || 0;
      const valueLen = (value && String(value).length) || 0;

      totalLen += keyLen + valueLen + 2;
    }

    //生成的sence字符串不能超过32个可见字符，超了，依次删除from、channel、userid
    if (totalLen > 32) {
      if (originSenceObj.hasOwnProperty('f')) {
        delete originSenceObj['f'];
        return this.checkAndCreateNewSenceObj(originSenceObj);
      } else if (originSenceObj.hasOwnProperty('c')) {
        delete originSenceObj['c'];
        return this.checkAndCreateNewSenceObj(originSenceObj);
      } else if (originSenceObj.hasOwnProperty('u')) {
        delete originSenceObj['u'];
        return this.checkAndCreateNewSenceObj(originSenceObj);
      } else {
        return originSenceObj;
      }
    }

    return originSenceObj;
  },

  /**
   * 解析 由 微信由菊花二维码 打开小程序 带过来的额外参数
   */
  parseQrShareScene: function(scene) {
    if (!scene) {
      return null;
    }
    scene = decodeURIComponent(scene);
    const sceneStrs = scene.split("#");
    const sceneObj = {};
    sceneStrs.map(sceneStr => {
      if (sceneStr) {
        const keyValue = sceneStr.split("+");
        let key = keyValue[0];
        const value = keyValue[1];
        if (key && value) {

          key = scenekeyUtils.shortToCompleteKey(key);

          sceneObj[key] = value;
        }
      }
    });

    return sceneObj;
  }
};

export default sceneUtil;