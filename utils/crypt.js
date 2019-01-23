// 车主、微信的解密模块
var Crypto = require('cryptojs/cryptojs.js').Crypto;

const decryptXmiles = (encryptedData) => {
  encryptedData = encryptedData.substring(encryptedData.indexOf(',') + 1);
  encryptedData = Crypto.util.base64ToBytes(encryptedData)
  const key = Crypto.charenc.UTF8.stringToBytes('8e5071a0ba0d06cc214b1e668f30a447');
  const mode = new Crypto.mode.ECB(Crypto.pad.pkcs7)
  var ub2 = Crypto.DES.decrypt(encryptedData, key, { asBytes: true, mode: mode })
  var us2 = Crypto.charenc.UTF8.bytesToString(ub2)
  return us2;
}

const decryptWechat = (sessionKey, encryptedData, iv) => {
  // base64 decode
  sessionKey = new Buffer(sessionKey, 'base64')
  encryptedData = new Buffer(encryptedData, 'base64')
  iv = new Buffer(iv, 'base64')

  try {
    // 解密
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')

    decoded = JSON.parse(decoded)

  } catch (err) {
    throw new Error('Illegal Buffer')
  }

  if (decoded.watermark.appid !== 'wx3417d7c3de96245d') {
    throw new Error('Illegal Buffer')
  }

  return decoded
}

module.exports = {
  decryptXmiles: decryptXmiles
}