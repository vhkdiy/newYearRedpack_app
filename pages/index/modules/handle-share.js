import share from './../../../utils/share.js';

const handleShare = () => {
  return share.get("/pages/index/index", "", getApp(), {
    page: '首页',
    share_module: "右上角分享"
  });
}

export default handleShare;