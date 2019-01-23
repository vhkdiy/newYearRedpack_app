import { phead } from './phead.js';

/**
 * 图像工具类
 */
const imgUtils = {
  //七牛图片格式化，带透明度
  getFormatImg(src, param = '0') {
    if (!src || typeof src !== 'string') {
      return '';
    }

    src = this.completeImgUrl(src);

    if (!src.includes('imageView2') && !src.includes('.gif')) {
      if (this.isSupportWebp()) {
        src += '?imageView2/' + param + '/format/webp';
      } else if (src.includes('.png') || src.includes('.tmp')) {
        src += '?imageView2/' + param + '/format/png';
      } else {
        src += '?imageView2/' + param + '/format/jpg';
      }
    }
    return src;
  },
  //七牛图片格式化，极致压缩，会去掉图片的透明度
  getTinyImg(src, param = '0') {
    if (!src || typeof src !== 'string') {
      return '';
    }

    src = this.completeImgUrl(src);

    if (!src.includes('imageView2') && !src.includes('.gif')) {
      if (this.isSupportWebp()) {
        src += '?imageView2/' + param + '/format/webp';
      } else {
        src += '?imageView2/' + param + '/format/jpg';
      }
    }
    return src;
  },
  isSupportWebp() {
    const isAndroid = phead.platform == 'android';
    const sys = phead.sys;
    const phoneModel = phead.phone && phead.phone.toUpperCase();
    const isHuawei = phoneModel && phoneModel.includes('HUAWEI');
    if (isAndroid && (sys && sys > '4.1') && !isHuawei) {
      return true;
    }

    return false;
  },
  /**
   * 小程序只支持https://的链接，服务器胡乱下发一些乱七八遭开头的图片链接，这里把图片的链接改成https://开头的
   */
  completeImgUrl(originImgUrl) {
    if (!originImgUrl) {
      return originImgUrl;
    }

    originImgUrl = originImgUrl.replace(/(?:(?:^\s*)?(?:http:|https:)?(?:\/\/)?)(.*?)(\s*$)/, 'https://$1');
    return originImgUrl;
  },

  /**
  * 极致压缩，去掉图片透明度 
  * 生成wxml可以使用图像对象
  * formatPageImgList(this, {'imgBg1':'http://imgBg.com','imgBg2':'http://imgBg.com'}, param)
  * 页面使用 <image src="{{imgBg1}}" /> <image src="{{imgBg2}}" />
  */
  formatPageImgs(page, list, param = '0') {
    return this.handlePageImgs(page, list, param, 0)
  },
  /**
   * 极致压缩，去掉图片透明度 
   * 生成wxml可以使用图像对象
   * tinyPageImg(this, {'imgBg1':'http://imgBg.com','imgBg2':'http://imgBg.com'}, param)
   * 页面使用 <image src="{{imgBg1}}" />  <image src="{{imgBg2}}" />
   */
  tinyPageImgs(page, list, param = '0') {
    return this.handlePageImgs(page, list, param, 1)
  },
  handlePageImgs(page, obj, param, type = 0) {
    if (!page || !obj) {
      return
    }
    if (Object.keys(obj).length < 1) {
      console.error('img-utils -- img对象必须含有一个属性')
      return
    }
    let temp = {};
    // 便利对象获取图片数据
    for (let key in obj) {
      let src
      if (type === 0) {
        src = this.getFormatImg(obj[key], param)
      } else {
        src = this.getTinyImg(obj[key], param)
      }
      temp[key] = src
    }
    page.setData(temp)
    return temp
  },
  /**
   * 将图片对象解析成src数组,方便预加载图片
   */
  getSrcsFromImgs(obj) {
    if (!obj) {
      return
    }
    let srcList = []
    for (let key in obj) {
      srcList.push(obj[key])
    }
    return srcList
  }
};

export default imgUtils;