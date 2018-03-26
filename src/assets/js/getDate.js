function timeForMat (count) {
  // 拼接时间
  let time1 = new Date()
  time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000 * count))
  let Y1 = time1.getFullYear()
  let M1 = ((time1.getMonth() + 1) > 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
  let D1 = (time1.getDate() > 10 ? time1.getDate() : '0' + time1.getDate())
  let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间
  let time2 = new Date()
  time2.setTime(time2.getTime())
  let Y2 = time2.getFullYear()
  let M2 = ((time2.getMonth() + 1) > 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
  let D2 = (time2.getDate() > 10 ? time2.getDate() : '0' + time2.getDate())
  let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
  let t1 = StrToGMT(timer1)
  let t2 = StrToGMT(timer2)
  return {
    t1: t1,
    t2: t2
  }
}
// 获取今天
function today () {
  let time1 = new Date()
  time1.setTime(time1.getTime())
  let Y1 = time1.getFullYear()
  let M1 = ((time1.getMonth() + 1) > 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
  let D1 = (time1.getDate() > 10 ? time1.getDate() : '0' + time1.getDate())
  let timer1 = Y1 + '-' + M1 + '-' + D1 
  let time2 = new Date()
  time2.setTime(time2.getTime())
  let Y2 = time2.getFullYear()
  let M2 = ((time2.getMonth() + 1) > 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
  let D2 = (time2.getDate() > 10 ? time2.getDate() : '0' + time2.getDate())
  let timer2 = Y2 + '-' + M2 + '-' + D2 
  let t1 = StrToGMT(timer1)
  let t2 = StrToGMT(timer2)
  return {
    t1: t1,
    t2: t2
  }
}
function StrToGMT(time){
    let GMT = new Date(time)
    return GMT
}
// 获取最近7天
function sevenDays () {
  let timer = timeForMat(6)
  return timer
}
// 获取最近30天
function thirtyDays () {
  let timer = timeForMat(29)
  return timer
}

export {
  today,
  sevenDays,
  thirtyDays
}