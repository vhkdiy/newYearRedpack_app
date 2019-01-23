/**
 * 解析特殊router工具
 */
export default {
  parseSpecialRoute(route, option) {
    try {
      if (!option) {
        return route
      }
      switch (route) {
        // 1.拉新 2.普通兑换 3.凑步数
        case 'pages/newUsersGoodsDetail/index':
        case 'pages/goodsDetail/index':
        case 'pages/stepGoodsDetail/index':
          {
            let {
              productId
            } = option
            if (productId) {
              route += `?productId=${option.productId}`
            }
          }
          break;
        default:
          break
      }
    } catch (error) {
      return route
    }
    return route
  }
}