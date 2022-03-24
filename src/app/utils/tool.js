import React from "react"
import { Select } from "antd"
import moment from "moment"

//筛选条件存入缓存
export const setlocalQuery = (queryobj, page) => {
  let str = JSON.stringify(queryobj)
  localStorage.setItem(page, str)
}
//筛选条件取出缓存
export const getlocalQuery = (itmeName) => {
  return JSON.parse(localStorage.getItem(itmeName))
}
//判断数组是否为空
export const checkArrisEmpty = (arr) => {
  let flag = Array.isArray(arr)
  if (flag) {
    return arr === null || arr.length === 0 ? true : false
  } else {
    return arr === null || arr === undefined ? true : false
  }
}

//校验请求数据，如果为空，取前端初始化数据
export const checkDataisEmpty = (resdata, initdata) => {
  return resdata ? resdata : initdata
}

//计算表格合并行
export const getRowSpan = (data, param) => {
  return data
    .reduce((result, item) => {
      //首先将dataTime字段作为新数组result取出
      if (result.indexOf(item[param]) < 0) {
        result.push(item[param])
      }
      return result
    }, [])
    .reduce((result, items) => {
      //将[param]相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
      const children = data.filter((item) => item[param] === items)
      result = result.concat(
        children.map((item, index) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0, //将第一行数据添加rowSpan字段
        }))
      )
      return result
    }, [])
}

//给数组加key属性
export const putKeys = (data) => {
  data.forEach((item, i) => {
    item.key = i
  })
}

//下拉框选项赋值
export const renderOptions = (arr, id) => {
  const options = arr.map((item) => {
    if (item.itemCod === id) {
      return item.ontopts.map((items) => {
        return (
          <Select.Option key={items.id} value={items.optVal}>
            {items.optVal}
          </Select.Option>
        )
      })
    } else {
      return null
    }
  })

  return options
}

//_tmp和result是相互独立的，没有任何联系，有各自的存储空间。
export const deepClone = function (obj) {
  let _tmp = JSON.stringify(obj) //将对象转换为json字符串形式
  let result = JSON.parse(_tmp) //将转换而来的字符串转换为原生js对象
  return result
}
// 转化为字符串
export const toStringValue = function (obj) {
  if (obj instanceof Array) {
    var arr = []
    for (var i = 0; i < obj.length; i++) {
      arr[i] = this.toStringValue(obj[i])
    }
    return arr
  } else if (typeof obj == "object") {
    for (var p in obj) {
      obj[p] = this.toStringValue(obj[p])
    }
  } else if (typeof obj == "number") {
    obj = obj + ""
  }
  return obj
}
// 深拷贝对象数组
export const depObj = function (obj, data) {
  for (var item in data) {
    obj[item] = data[item]
  }
}
// 设置key和新增一行
export const handleData = function (data, obj) {
  let arr = data.map((item, index) => {
    item.key = index
    item.action = true
    return item
  })
  arr.push(obj)
  obj.key = arr.length
  return arr
}
// 给数组加序列
export const handlOrderNumber = function (data, listName, parm) {
  data[listName].forEach((item, index) => {
    if (data.pageNum === 1) {
      item[parm] = index + 1
    } else {
      item[parm] = (data.pageNum - 1) * data.pageSize + (index + 1)
    }
  })
}
// 默认值
export const handleDefault = function (oldObj, newObj) {
  let data = null
  for (let key in oldObj) {
    if (oldObj[key] === null && newObj[key] !== null) {
      oldObj[key] = newObj[key]
    }
  }
  data = { ...oldObj }
  return data
}

export const setDefaultData = function (oldObj, newObj) {
  let data = null
  for (let key in oldObj) {
    if (oldObj[key] === null && newObj[key]) {
      oldObj[key] = newObj[key]
    }
  }
  data = { ...oldObj }
  return data
}
export const defaultOperate = function (oldObj, newObj) {
  let data = null
  for (let key in oldObj) {
    if (oldObj[key] === null && newObj[key] !== null) {
      oldObj[key] = newObj[key]
    }
  }
  data = { ...newObj, ...oldObj }
  return data
}
// 防抖方法,只执行最后一个
export const debounce = function (fn, wait) {
  let timeout // 创建一个标记用来存放定时器的返回值
  return function () {
    clearTimeout(timeout) // 每当用户输入的时候把前一个 setTimeout clear 掉
    timeout = setTimeout(
      () => {
        // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval
        // 间隔内如果还有字符输入的话，就不会执行 fn 函数
        fn.apply(this, arguments)
      },
      wait ? wait : 500
    )
  }
}
// 节流方法，在n秒内只执行一次
export const throttle = function (fn, wait) {
  let canRun = true // 通过闭包保存一个标记
  return function () {
    if (!canRun) return // 在函数开头判断标记是否为true，不为true则return
    canRun = false // 立即设置为false
    setTimeout(
      () => {
        // 将外部传入的函数的执行放在setTimeout中
        fn.apply(this, arguments)
        // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。
        // 当定时器没有执行的时候标记永远是false，在开头被return掉
        canRun = true
      },
      wait ? wait : 500
    )
  }
}
// 不可选择今天以及今天之前的日期
export const disabledDate = function (current) {
  return current && current < moment().endOf("day") //当天之前的不可选，包括当天
}
//  不可选择今天之前的日期
export const disabledDateBarring = function (current) {
  return current && current < moment().subtract(1, "days") //当天之前的不可选，不包括当天
}
