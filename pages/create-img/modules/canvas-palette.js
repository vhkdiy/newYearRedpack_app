const bmpWidth = 750,
  btmHeight = 1030,
  centerX = bmpWidth / 2,
  contentTop = 217,
  contentLeft = 100;

export default class CanvasPalette {
  constructor(data) {
    this.userIcon = data.userIcon;
    this.qrCodeImg = data.qrCodeImg;
    this.userName = data.userName;
    this.userInviteTip = (this.userName || '').replace(/(.{10})(?:.*)/, "$1...") + '发了一个拜年红包';
    this.contentImg = data.contentImg;
  }

  palette() {
    return ({
      width: `${bmpWidth}rpx`,
      height: `${btmHeight}rpx`,
      background: 'rgba(255,255,255,0)',
      views: [{
          //画背景
          type: 'rect',
          css: {
            top: '-3rpx',
            left: '0rpx',
            color: "#F35543",
            width: `${bmpWidth + 3}rpx`,
            height: `${btmHeight + 3}rpx`,
          },
        },
        {
          //画用户头像
          type: 'image',
          url: this.userIcon,
          css: {
            top: '25rpx',
            left: '321rpx',
            width: '108rpx',
            height: '108rpx',
            borderRadius: '108rpx',
            borderWidth: "4rpx",
            borderColor: "#FFE4AE",
          },
        },
        {
          //用户名
          type: 'text',
          text: this.userInviteTip,
          css: {
            top: '149rpx',
            left: `${centerX}rpx`,
            align: 'center',
            maxLines: 1,
            color: "#F3DEAD",
            fontSize: '34rpx',
          },
        },
        {
          //画图片的背景框
          type: 'rect',
          css: {
            top: `${contentTop}rpx`,
            left: '100rpx',
            color: "#ffffff",
            width: `550rpx`,
            height: `740rpx`,
            borderWidth: "6rpx",
            borderColor: "#FFE4AE",
          },
        },
        {
          //画主图片
          type: 'image',
          url: this.contentImg,
          css: {
            top: `${25 + contentTop}rpx`,
            left: `${contentLeft + 25}rpx`,
            width: '500rpx',
            height: '500rpx',
            borderRadius: '6rpx',
            mode: "aspectFill",
          },
        },
        {
          //画 二维码
          type: 'image',
          url: this.qrCodeImg,
          css: {
            top: `${contentTop + 561}rpx`,
            left: `${87 + contentLeft}rpx`,
            width: '143rpx',
            height: '143rpx',
          },
        },
        {
          //分享提示
          type: 'text',
          text: "长按识别小程序",
          css: {
            top: `${contentTop + 595}rpx`,
            left: `${contentLeft + 257}rpx`,
            align: 'left',
            maxLines: 1,
            color: "#333333",
            fontSize: '24rpx',
          },
        },
        {
          //分享提示
          type: 'text',
          text: "领取好友拜年红包",
          css: {
            top: `${contentTop + 635}rpx`,
            left: `${contentLeft + 257}rpx`,
            align: 'left',
            maxLines: 1,
            color: "#333333",
            fontSize: '24rpx',
          },
        },
      ],
    });
  }
}