// 配置文件
const isLocal = false;
const testServer = false;
const appName = "包你当财神";

module.exports = {
  testServer: testServer,
  host: !testServer ? 'https://ibestfanli.com/' : isLocal ? 'http://localhost:8080/' : 'https://test.ibestfanli.com/',
  pversion: '1',
  cversion: 1,
  cversionname: '1.0',
  channel: '1000',
  prdid: '17303',
  appName: appName,

  shareContent: {
    title: '[财神@我]2019年看看你的财运在哪里，一夜暴富的机会别错过了',
    imageUrl: 'https://img.xmiles.cn/fortune_telling/shareImage.png',
    path: '/pages/index/index'
  }
}
