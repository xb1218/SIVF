/* eslint-disable react/react-in-jsx-scope */
import { observable, action } from "mobx"
import moment from "moment"
import api from "@/app/utils/apis"

export default class Schedule {
  @observable date = moment(new Date(), "YYYY-MM-DD")
  @observable checkedList = ""
  //下拉选框的数据
  @observable selectList = []
  //合并数组单元格
  @action createNewArr = (data, param) => {
    return data
      .reduce((result, item) => {
        //首先将dataTime字段作为新数组result取出
        if (result.indexOf(item[param]) < 0) {
          result.push(item[param])
        }
        return result
      }, [])
      .reduce((result, items) => {
        //将dataTime相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
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
  // 调用后台时，判断获取哪个数据
  @action selectData = (data, getdata) => {
    let arry = []
    getdata.forEach((item, index) => {
      if (item.group === data.groups) {
        item.sortedList.filter((item, index) => {
          item.number = index + 1
          item.index = index
          return null
        })
        arry = item.sortedList
      }
    })
    return arry
  }
  // 调用后台接口拉取下拉框
  @action getSelectOption = () => {
    api.Schedule.optionsSelect().then((res) => {
      this.selectList = res.data
    })
  }
  // 将所有组的数据放在一个数组中
  @action oneList = (data) => {
    let arry = []
    data.forEach((item, index) => {
      item.sortedList.forEach((items, indexs) => {
        arry.push(items)
      })
    })
    return arry
  }
  @action handleOrder = (data) => {
    data.forEach((item, index) => {
      item.orderIndex = Number(index + 1)
    })
    return data
  }
}
