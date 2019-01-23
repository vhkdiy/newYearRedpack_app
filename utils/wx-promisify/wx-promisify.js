const wxPromisify = function (wxFunction) {
  return function(paramsObj = {}) {
    return new Promise((resolve, reject) => {
      paramsObj.success = function(res) {
        resolve(res);
      }

      paramsObj.fail = function(res) {
        reject(res);
      }

      wxFunction(paramsObj) //执行函数，paramsObj为传入函数的参数
    })
  }
}

export default wxPromisify;