// 配置文件
let time
let wasteTime
let openLog = false
let events = []

let PREFIX = 'TIME LOG -- '

module.exports = {
  openAnalysis: function() {
    openLog = true
  },
  closeAnalysis: function() {
    openLog = false
  },
  /**
   * 统计消耗时间
   */
  analysisTime: function(msg) {
    if (!openLog) {
      return
    }
    if (!time) {
      time = new Date().getTime()
      console.log(PREFIX + 'LAUNCH START -- ' + msg)
    } else {
      console.log(PREFIX + 'LAUNCH WASTE TIME -- ' + msg + ' spent : ' + (new Date().getTime() - time) + "ms")
    }
  },
  /**
   * 统计时间开始
   */
  analysisEventStart(key) {
    if (!openLog) {
      return
    }
    let hasKey = events.some(function(item) {
      return item.key === key
    })
    if (!hasKey) {
      console.log(PREFIX + 'TIME EVENT START -- ' + key)
      events.push({
        key,
        time: new Date().getTime()
      })
    }
  },
  /**
   * 统计时间结束
   */
  analysisEventEnd(key) {
    if (!openLog) {
      return
    }
    let keyObj = events.find(function(item) {
      return item.key === key
    })
    if (keyObj) {
      console.log(PREFIX + 'TIME EVENT END -- ' + key + ' spent : ' + (new Date().getTime() - keyObj.time) + "ms")
      let index = events.indexOf(keyObj)
      events.splice(index, 1)
    }
  }
}