import { action, observable } from "mobx"
import request from "@/app/utils/request"
import config from "@/app/config"
import { message } from "antd"
export default class Store {
  @observable reservationModal = false
  @observable reservationData = [] //轮播图数据
  @observable reservationVOList = [] //sort by Day table列表
  @observable OptionsData = []
  @observable overviewData = {} //概览table列表
  @observable submitPatientData = observable.map({}) //新建患者

  @observable reservationDTOList = [] //已预约项目

  /////// sort by day start ///////

  @observable queryMaps = {
    date: "2021-03-02",
  }
  @observable tablequeryMaps = {
    date: "2021-03-02",
    projectType: "卵泡监测",
    pageNum: 1,
    pageSize: 10,
  }
  @observable overviewQueryMaps = {
    num: null,
    name: "",
    pageNum: 1,
    pageSize: 10,
  }
  @observable pendingQueryMaps = {
    num: null,
    name: "",
    pageNum: 1,
    pageSize: 10,
  }
  @action updateQueryMap = (data) => {
    for (const key in data) {
      this.queryMaps[key] = data[key]
    }
  }
  @action updateTbaleQueryMap = (data) => {
    for (const key in data) {
      this.tablequeryMaps[key] = data[key]
    }
  }
  // pending表的分页查询
  @action updatePendingQueryMap = (data) => {
    for (const key in data) {
      this.pendingQueryMaps[key] = data[key]
    }
  }
  //预约统计轮播图
  @action getReservationCount = () => {
    return request
      .get(`${config.backend}/reservation/count`)
      .query(this.queryMaps)
      .checkToken()
      .commonDispose()
      .then(
        (res) => {
          this.reservationData = res.data
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }
  //预约table列表
  @action getReservationList = () => {
    return request
      .get(`${config.backend}/reservation/list`)
      .query(this.tablequeryMaps)
      .checkToken()
      .commonDispose()
      .then(
        (res) => {
          this.putKeys(res.data.list)
          this.reservationVOList = res.data
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  /////// sort by day end ///////

  /////// sort by week start ///////

  //概览table列表
  @action getReservationOverview = (url) => {
    return request
      .get(`${config.backend}/reservation/${url}`)
      .query(this.overviewQueryMaps)
      .checkToken()
      .commonDispose()
      .then(
        (res) => {
          this.putKeys(res.data.pageInfo.list)
          this.overviewData = res.data
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }
  @action updateOverviewQueryMap = (data) => {
    for (const key in data) {
      this.overviewQueryMaps[key] = data[key]
    }
  }
  /////// sort by week end ///////

  //初始化预约项目下拉框
  @action initOptionData = () => {
    return request
      .get(`${config.backend}/reservation`)
      .checkToken()
      .commonDispose()
      .then(
        (res) => {
          res.data.forEach((item) => {
            let children = []
            if (item.ontopts !== null) {
              item.ontopts.forEach((i) =>
                children.push({
                  value: i.optVal,
                  label: i.optVal,
                })
              )
            }
            this.OptionsData.push({
              value: item.optVal,
              label: item.optVal,
              children: children,
            })
          })
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  //新增患者
  @action createPatient = () => {
    return request
      .post(`${config.backend}/reservation/patient`)
      .checkToken()
      .send(this.submitPatientData.toJSON())
      .commonDispose()
      .then(
        (res) => {
          return Promise.resolve(res)
        },
        (err) => {
          message.destroy()
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  @action setSubmitReservationData = (record, key, value, that) => {
    if (Array.isArray(value)) {
      record["reservationType"] = value[0]
      record["reservationProject"] = value[1] ? value[1] : ""
    } else {
      record[key] = value
    }
    that.forceUpdate()
  }

  //--- utils ---
  @action //给数据加key
  putKeys = (data) => {
    data.forEach((item, i) => {
      item.key = i
    })
  }

  @action // 判断数组是否为空
  checkArrisEmpty = (arr) => {
    let flag = Array.isArray(arr)
    if (flag) {
      return arr === null || arr.length === 0 ? true : false
    } else {
      return arr === null ? true : false
    }
  }

  static fromJS() {
    const store = new Store()
    return store
  }
}
