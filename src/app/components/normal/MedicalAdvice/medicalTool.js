import { message } from "antd"
import moment from "moment"
// 取出字符串中所有的数字
export const selectNmbers = (string) => {
  var num = parseFloat(string)
  return num
}
// 取出除了数字以外的字符
export const selectStrings = (string) => {
  var numStrinng = string.replace(/[^\d.]/g, "")
  return string.split(numStrinng)[1]
}
// 拼过针的药不可修改这行数据
export const notModifiable = (record) => {
  let modifyDefault = null
  if (record.canDel) {
    message.destroy()
    message.warning("已拼针，不可修改")
    modifyDefault = false
  } else {
    modifyDefault = true
  }
  return modifyDefault
}
// 是否显示拟行
export const defaultKey = (embryoType, blastulaType) => {
  if (!embryoType || !blastulaType) {
    return false
  } else {
    return true
  }
}
// 判断两个日期的前后
export const compareDate = (d1, d2) => {
  if (!d1) {
    return true
  } else {
    return new Date(d1.replace(/-/g, "/")) > new Date(d2.replace(/-/g, "/"))
  }
}
// 将频次进行转换
export const conversionFrequency = (frequency) => {
  let value = null
  let str = frequency.toUpperCase() //转换成大写
  const arry = [
    { type: "QD", value: 1 }, //一天一次
    { type: "ST", value: 1 }, //立刻执行
    { type: "QOD", value: "隔日一次" },
    { type: "TID", value: 3 }, //每天三次
    { type: "BID", value: 2 }, //一天两次
  ]
  arry.forEach((item, index) => {
    if (str === item.type) {
      value = item.value
    }
  })
  return value
}
// 隔日一次的处理
export const handleIsolateOnce = (days) => {
  let val = null
  val = days - parseInt(days / 2)
  return val
}
// 处理余量
export const handleRemain = (remain) => {
  let remainNumber = 0
  if (remain === "" || remain === null) {
    remainNumber = 0
  } else {
    remainNumber = selectNmbers(remain)
  }
  return remainNumber
}
// 计算余量
export const calculationMargin = (record) => {
  // 余量 = 规格*数量-频次*天数*用量
  // 规格 record.speciNumber,数量 record.amount ,
  // 频次 record.frequency ,天数 days ， 用量 doseNumber
  let sum1 = null //有余量的总量
  let sum2 = null //没有余量的总量
  let freNumber = conversionFrequency(record.frequency) //将频次进行转换
  if (record.allowance) {
    sum1 = record.speciNumber * parseInt(record.amount) + record.initialMargin
  } else {
    sum1 = record.speciNumber * parseInt(record.amount)
  }
  if (freNumber === "隔日一次") {
    sum2 = handleIsolateOnce(record.days) * record.doseNumber
  } else {
    sum2 = freNumber * record.days * record.doseNumber
  }
  let remainMiddle = sum1 - sum2
  record.remain = remainMiddle + record.sepciCompany
}
// 处理计算方式
export const handleCal = (value, record) => {
  if (value && (value === "" || value === null || value === "0")) {
    record.initialMargin = 0 //初始余量
    record.allowance = false //是否有余量
    if (record.speciNumber !== undefined && record.amount !== undefined) {
      calculationMargin(record)
    }
  } else {
    record.initialMargin = handleRemain(value) //初始余量
    record.allowance = true //是否有余量
    if (
      record.speciNumber !== undefined &&
      record.amount !== undefined &&
      record.initialMargin !== undefined
    ) {
      calculationMargin(record)
    }
  }
}
// 医嘱处理数据(添加option)
export const adddrugeOption = (arry) => {
  arry.forEach((item, index) => {
    if (!item.drugeOption) {
      item.drugeOption = [] //用药下拉框
      item.specificationOption = [] //规格下拉框
      item.doseNumber = null //用量数字
      item.speciNumber = null //规格数字
      item.sepciCompany = null //规格单位
      item.initialMargin = 0 //初始余量
      item.allowance = null //是否有余量
      item.id = item.id ? item.id : null //药品的id
      item.spellUid = item.spellUid ? item.spellUid : null //拼针药品的uid
    }
  })
}
// 不可选择今天之前的日期
export const disabledDate = (current) => {
  return current && current < moment().subtract(1, "days") //当天之前的不可选，不包括当天
  //return current && current < moment().endOf(‘day’);当天之前的不可选，包括当天
}
// 获取医嘱日期中最大的日期
export const maxDate = (arry) => {
  return (
    arry.sort((a, b) => {
      return new Date(b.replace(/-/g, "/")) - new Date(a.replace(/-/g, "/")) //从大到小排序
    })[0] ?? ""
  )
}
// 获取医嘱日期中最小的日期
export const minDate = (arry) => {
  return (
    arry.sort((a, b) => {
      return new Date(a.replace(/-/g, "/")) - new Date(b.replace(/-/g, "/")) //从小到大排序
    })[0] ?? ""
  )
}
// 判断当前的移植日应该是哪一天
export const getEtDate = (arry) => {
  let nowDate = moment(new Date()).format("YYYY-MM-DD")
  arry.push(nowDate)
  let res = arry.sort((a, b) => {
    return new Date(a.replace(/-/g, "/")) - new Date(b.replace(/-/g, "/")) //从小到大排序
  })
  if (res.length === 1) return res[0]
  let index = res.findIndex((value, index, arr) => {
    return value === nowDate
  })
  return res[index + 1] === nowDate
    ? res[index + 2] ?? ""
    : res[index + 1] ?? ""
}
// 判断数组中是否有相同的值
export const isSameHave = (arry) => {
  let res = [...new Set(arry)]
  return res.length === arry.length
}
// 找出两个数组中不相同的元素
export const differentItem = (arry) => {
  let res = [...new Set(arry)]
  let arr
  if (!isSameHave(arry)) {
    arr = arry.filter((item1) => !res.includes(item1))
  }
  return arr.join(",") ?? ""
}
