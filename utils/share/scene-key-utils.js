/**
 * 菊花二维码里面的拼接参数，字符串不能太长， 简写的键 完整的键的对应关系
 */

const shortToCompleteJSON = {
  "u": "userId", //userid
  "c": "channel", //渠道号
  "f": "from", //from
  "t": "type", //分享的类型，参考shareType.js
  "o": "orderId",//
};

/**
 * 简写转完整的键
 */
const shortToCompleteKey = function(shortKey) {
  if (!shortKey) {
    return shortKey;
  }

  return shortToCompleteJSON[shortKey] || shortKey;
}

/**
 * 完整的键转成简写的
 */

const completeToShortKey = function(key) {
  if (!key) {
    return key;
  }

  for (let shortKey in shortToCompleteJSON) {
    if (shortToCompleteJSON[shortKey] == key) {
      return shortKey;
    }
  }

  return key;
}

export default {
  shortToCompleteKey: shortToCompleteKey,
  completeToShortKey: completeToShortKey
}