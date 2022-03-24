// 1.邮箱

export const isEmail = (s) => {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
    s
  )
}
// 2.手机号码

export const isMobile = (s) => {
  return /^1(3|4|5|6|7|8|9)\d{9}$/.test(s)
}
// 3.电话号码

export const isPhone = (s) => {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}
// 4.是否url地址

export const isURL = (s) => {
  return /^http[s]?:\/\/.*/.test(s)
}
// 5.是否字符串

export const isString = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "String"
}
// 6.是否数字

export const isNumber = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Number"
}
// 7.是否boolean

export const isBoolean = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Boolean"
}
// 8.是否函数

export const isFunction = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Function"
}
// 9.是否为null

export const isNull = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Null"
}
// 10.是否undefined

export const isUndefined = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Undefined"
}
// 11.是否对象

export const isObj = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Object"
}
// 12.是否数组

export const isArray = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Array"
}
// 13.是否时间

export const isDate = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "Date"
}
// 14.是否正则

export const isRegExp = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === "RegExp"
}
// 15.截取文件名后缀

export const lastName = (o) => {
  // let fileName = o.lastIndexOf(".") //取到文件名开始到最后一个点的长度
  // let fileNameLength = o.length //取到文件名长度
  // let fileFormat = o.substring(fileName + 1, fileNameLength) //截
  return Object.prototype.toString.call(o).slice(8, -1) === "RegExp"
}

//16.身份证号码
export const idNumber = (s) => {
  return /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/.test(
    s
  )
}
//验证护照号码
export const checkPassport = (code) => {
  return /^((1[45]\d{7})|(G\d{8})|(E\d{8})|(P\d{7})|(S\d{7,8}))?$/.test(code)
}
//验证军官证号码
export const checkOfficers = (code) => {
  return /^[a-zA-Z0-9]{7,21}$/.test(code)
}
