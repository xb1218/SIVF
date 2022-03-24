import React from "react"
import { action, observable, computed } from "mobx"
import request from "@/app/utils/request"
import config from "@/app/config"
import { message, Select } from "antd"
import moment from "moment"
import { setDefaultData } from "@/app/utils/tool.js"
import {
  twentyFemaleParam,
  defaultPhysicalData,
  defaultMalePhysicalData,
  defaultSecondarySex,
} from "@/app/utils/const.js"
import apis from "@/app/utils/apis.js"
import qs from "qs"
const { Option } = Select
const formdate = "YYYY-MM-DD"
export default class Follow {
  @observable Biochemicalfather = null
  @observable selectRow = null //基本信息
  @observable operationDate = null //手术日期
  @observable frontDate = 0 //转化后的手术日期
  // 患者移植日期以及怀孕总天数
  @observable etDate = null //移植日
  @observable pregnancyTotal = "" //怀孕天数
  @observable etType = "" //移植类型
  @observable preWeek = "" //孕周
  @observable preDay = "" //孕天
  @observable followList = "" //随访列表
  @observable totalCount = "" //随访列表

  @observable detailData = {
    complicationDTOs: [],
    pregnancyTestRecordParam: {
      followUpBloodHormoneParams: [],
    },
    ultrasoundChartPregnancyParams: [],
    clinicalPeriodParam: {},
    parturitionParam: {
      newbornConditionDTOs: [],
    },
  }

  @observable productionDetailData = {
    earlyPregnancyParam: {
      earlyUltrasoundPregnancyParams: [],
    },
    midPregnancyParam: {
      midUltrasoundPregnancyParams: [],
    },
    antenatalScreeningParam: {
      antenatalScreeningAmniocentesisParams: [{}],
    },
    complicationDTOs: [],
  }

  @observable afterbirthDetailData = []

  //初始化的查询条件
  @observable queryMaps = {
    stageType: {},
    cycleType: "",
    surgeryStartDate: moment(new Date()).format("YYYY-MM-DD"),
    followFlags: "",
    followStage: "",
    nameNumber: "",
    pageNum: 1,
    pageSize: 10,
  }
  //姓名查询条件
  @observable nameNumber = ""
  //出生后的下拉框
  @observable afterbirthselect = []
  //选中的select子组件
  @observable selectchosetab = {
    choseyear: "",
    chosesex: "",
    chosesexyears: "",
  }
  //出生后的数据
  @observable oneyear = []
  @observable fiveyear = []
  @observable tenyear = []
  @observable fiftenyear = []
  @observable twentyear = []
  //出生后的异常
  @observable abnormalone = []
  @observable abnormalfif = []
  @observable abnormalten = []
  @observable abnormalfiften = []
  @observable abnormaltwenty = []
  @observable patientCycleNumber = ""
  @observable patientPid = ""
  @observable optionsPregnancy = []
  @observable optionsProduction = []
  @observable optionsAfterbirth = []
  @action changafterbirthselect = (val) => {
    this.afterbirthselect = val
  }
  @action changselectchosetab = (year, sex, sexnum) => {
    this.selectchosetab.choseyear = year //年龄
    this.selectchosetab.chosesex = sex //性别
    this.selectchosetab.chosesexyears = sexnum //第几个
  }

  @action setDetailData = (field, key, value) => {
    this.detailData[field][key] = value
  }

  @action setProductionDetailData = (field, key, value) => {
    this.productionDetailData[field][key] = value
  }

  @action setPatientInfo = (data) => {
    this.patientCycleNumber = data.cycleNumber
    this.patientPid = data.pid
  }

  //更新异常数据
  @action changabnormal = (num, val) => {
    switch (num) {
      case 1:
        this.abnormalone = val
        break
      case 2:
        this.abnormalfif = val
        break
      case 3:
        this.abnormalten = val
        break
      case 4:
        this.abnormalfiften = val
        break
      case 5:
        this.abnormaltwenty = val
        break
      default:
        break
    }
  }
  @action changyeardata = (index, val) => {
    switch (index) {
      case 1:
        this.oneyear = val
        break
      case 2:
        this.fiveyear = val
        break
      case 3:
        this.tenyear = val
        break
      case 4:
        this.fiftenyear = val
        break
      case 5:
        this.twentyear = val
        break
      default:
        break
    }
  }
  //处理返回的下拉框的数据
  @action changeselect = (val, data) => {
    let arr = []
    let steparr = []
    val.map((item, index) => {
      data.map((citem, cindex) => {
        if (item === citem.itemCod) {
          arr.push(citem.ontopts)
        }
        return true
      })
      return true
    })
    for (let i of arr) {
      steparr = steparr.concat(i)
    }
    return steparr
  }

  //添加并发症
  @action additem = (val) => {
    let child = {
      inspectionTime: moment(new Date()).format(formdate),
      complicationType: "",
    }
    val.push(child)
    return val
  }
  //删除并发症
  @action deleteitem = (val, index) => {
    val.splice(index, 1)
    return val
  }

  // 授精后天数() val 表示当前的检查日期  oldVal表示移植日期
  @action
  getInsemination = (val, oldVal, type) => {
    let etday = JSON.parse(localStorage.getItem("followrecord")).plantDate
    type = JSON.parse(localStorage.getItem("followrecord")).cycleType
    let insDate = new Date(val)
    this.etDate = new Date(etday)
    let changday = ""
    let tpreWeek = ""
    let preDay = ""
    changday = (insDate.getTime() - this.etDate.getTime()) / (24 * 3600 * 1000)
    if (
      type === "新鲜" ||
      type === "复苏" ||
      type === "新鲜+复苏" ||
      type === "卵子冷冻"
    ) {
      changday = (parseInt(changday) + 14).toString()
    }
    if (type === "AIH" || type === "AID") {
      changday = (parseInt(changday) + 17).toString()
    }
    tpreWeek = Math.floor(changday / 7)
    preDay = changday % 7
    let day = {
      changday,
      tpreWeek,
      preDay,
    }
    return day
  }
  // 计算手术日期
  @action getInsDate = (val) => {
    let nowDate = new Date()
    this.operationDate = new Date(val)
    this.frontDate = parseInt(
      (nowDate.getTime() - this.operationDate.getTime()) / (24 * 3600 * 1000)
    )
    return this.frontDate > 0 ? true : false
  }

  //计算两个日期的差值
  @action getdatevalue = (newval, endval) => {
    let startday = new Date(newval)
    let endday = new Date(endval)
    let days = startday.getTime() - endday.getTime()
    let day = parseInt(days / (1000 * 60 * 60 * 24))
    return day + 1
  }

  @action updateNameNumber = (data) => {
    this.nameNumber = data
  }

  @action updateQueryMap = (data) => {
    for (const key in data) {
      this.queryMaps[key] = data[key]
    }
  }
  @computed get queryString() {
    let queryString = ""
    for (let key in this.queryMaps) {
      if (queryString[key] !== undefined) {
        queryString = `${key}=${this.queryMaps[key]}`
      } else {
        if (this.queryMaps[key] !== null && this.queryMaps[key] !== "") {
          queryString += `&${key}=${this.queryMaps[key]}`
        } else {
          queryString += ""
        }
      }
    }
    return queryString
  }

  @action //下拉框选项赋值
  renderOptions = (arr, id) => {
    const options = arr.map((item) => {
      if (item.itemCod === id) {
        return item.ontopts.map((items) => {
          return (
            <Option key={items.id} value={items.optVal}>
              {items.optVal}
            </Option>
          )
        })
      } else {
        return null
      }
    })

    return options
  }

  @action initDetailData = (field, data) => {
    const freshRecovery = ["新鲜", "复苏", "新鲜+复苏"]
    const AIH = ["AIH", "AID"]
    const { surgeryDate, cycleType } = JSON.parse(
      localStorage.getItem("followrecord")
    )
    if (data.complicationDTOs.length === 0) {
      data.complicationDTOs.push({ inspectionTime: "", complicationType: [] })
    }
    if (field === "pregnancy") {
      this.detailData = data
    }
    if (field === "production") {
      if (!data.earlyPregnancyParam.followDate) {
        data.earlyPregnancyParam.followDate = moment(new Date()).format(
          "YYYY-MM-DD"
        )
      }
      if (!data.midPregnancyParam.followDate) {
        data.midPregnancyParam.followDate = moment(new Date()).format(
          "YYYY-MM-DD"
        )
      }

      if (freshRecovery.includes(cycleType)) {
        data.earlyPregnancyParam.earlyUltrasoundPregnancyParams.forEach(
          (item, index) => {
            let lastMenstruationDate = moment(surgeryDate).subtract(17, "days")
            let date =
              moment(item.date).diff(moment(lastMenstruationDate), "days") / 7
            item.pregnancyWeeks = parseInt(date, 10)
          }
        )
        data.midPregnancyParam.midUltrasoundPregnancyParams.forEach(
          (item, index) => {
            let lastMenstruationDate = moment(surgeryDate).subtract(17, "days")
            let date =
              moment(item.date).diff(moment(lastMenstruationDate), "days") / 7
            item.pregnancyWeeks = parseInt(date, 10)
          }
        )
      }

      if (AIH.includes(cycleType)) {
        data.earlyPregnancyParam.earlyUltrasoundPregnancyParams.forEach(
          (item, index) => {
            let lastMenstruationDate = moment(surgeryDate).subtract(14, "days")
            let date =
              moment(item.date).diff(moment(lastMenstruationDate), "days") / 7
            item.pregnancyWeeks = parseInt(date, 10)
          }
        )
        data.midPregnancyParam.midUltrasoundPregnancyParams.forEach(
          (item, index) => {
            let lastMenstruationDate = moment(surgeryDate).subtract(14, "days")
            let date =
              moment(item.date).diff(moment(lastMenstruationDate), "days") / 7
            item.pregnancyWeeks = parseInt(date, 10)
          }
        )
      }

      this.productionDetailData = data
    }
  }

  //初始化妊娠信息
  @action getPregnancy = () => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    return request
      .get(`${config.backend}/followUp/pregnancy`)
      .checkToken()
      .query({ cycleNumber, pid })
      .commonDispose()
      .then(
        (res) => {
          this.optionsPregnancy = res.data.ontoptInfoList
          this.initDetailData("pregnancy", res.data)
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  deleteEmpty = (detailData) => {
    const {
      pregnancyTestRecordParam,
      parturitionParam,
      ultrasoundChartPregnancyParams,
    } = detailData
    const bloodHormone =
      pregnancyTestRecordParam.followUpBloodHormoneParams.filter((v) => {
        return (
          Object.values(v)
            .filter((item) => item !== "")
            .filter((d) => d !== null)
            .toString() !== "1"
        )
      })

    const newborn = parturitionParam.newbornConditionDTOs.filter((v) => {
      return (
        Object.values(v)
          .filter((item) => item !== "")
          .filter((d) => d !== null).length !== 0
      )
    })
    newborn.forEach((item, index, arr) => {
      arr[index].babyTag = index + 1
    })
    const ultrasound = ultrasoundChartPregnancyParams.filter((v) => {
      return (
        Object.values(v)
          .filter((item) => item !== "")
          .filter((d) => d !== null).length !== 0
      )
    })

    this.detailData.pregnancyTestRecordParam.followUpBloodHormoneParams =
      bloodHormone
    this.detailData.parturitionParam.newbornConditionDTOs = newborn
    this.detailData.ultrasoundChartPregnancyParams = ultrasound
  }

  //保存妊娠信息
  @action savePregnancy = () => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    this.deleteEmpty(this.detailData)
    const body = Object.assign({ cycleNumber, pid }, this.detailData)

    return request
      .post(`${config.backend}/followUp/pregnancy`)
      .checkToken()
      .send(body)
      .commonDispose()
      .then(
        (res) => {
          this.getPregnancy()
          message.success("保存成功")
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  //初始化产筛信息
  @action getProduction = () => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    return request
      .get(`${config.backend}/followUp/production`)
      .checkToken()
      .query({ cycleNumber, pid })
      .commonDispose()
      .then(
        (res) => {
          this.optionsProduction = res.data.ontoptInfoList
          this.initDetailData("production", res.data)
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  //保存孕早期信息
  @action saveEarlyPregnancy = () => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    const body = Object.assign({ cycleNumber, pid }, this.productionDetailData)
    return request
      .post(`${config.backend}/followUp/early_pregnancy`)
      .checkToken()
      .send(body)
      .commonDispose()
      .then(
        (res) => {
          this.getProduction()
          message.success("保存成功")
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  //保存孕中期信息
  @action saveMidPregnancy = () => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    const body = Object.assign({ cycleNumber, pid }, this.productionDetailData)
    return request
      .post(`${config.backend}/followUp/middle_pregnancy`)
      .checkToken()
      .send(body)
      .commonDispose()
      .then(
        (res) => {
          this.getProduction()
          message.success("保存成功")
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  //保存产前筛查信息
  @action saveScreening = () => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    const body = Object.assign({ cycleNumber, pid }, this.productionDetailData)
    return request
      .post(`${config.backend}/followUp/screening`)
      .checkToken()
      .send(body)
      .commonDispose()
      .then(
        (res) => {
          this.getProduction()
          message.success("保存成功")
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  initAfterbirthData = (data) => {
    data.forEach((item) => {
      if (item.afterBirthOneParam.afterBirthExceptionDTOS === null) {
        item.afterBirthOneParam.afterBirthExceptionDTOS = []
      }
      if (item.afterBirthFiveParam.afterBirthExceptionDTOS === null) {
        item.afterBirthFiveParam.afterBirthExceptionDTOS = []
      }

      item.twentyFemaleParam = setDefaultData(
        item.twentyFemaleParam,
        twentyFemaleParam
      )
      item.fifteenMaleParam = setDefaultData(
        item.fifteenMaleParam,
        defaultPhysicalData
      )
      item.twentyMaleParam = setDefaultData(
        item.twentyMaleParam,
        defaultMalePhysicalData
      )
      item.fifteenFemaleParam = setDefaultData(
        item.fifteenFemaleParam,
        defaultSecondarySex
      )
    })
    this.afterbirthDetailData = data
  }

  //初始出生后信息
  @action getAfterbirth = () => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    return request
      .get(`${config.backend}/followUp/afterbirth`)
      .checkToken()
      .query({ cycleNumber, pid })
      .commonDispose()
      .then(
        (res) => {
          this.optionsAfterbirth = res.data.ontoptInfoList
          this.initAfterbirthData(res.data.followUpChildInfos)
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  //保存一周岁信息
  @action saveBirthOne = (obj) => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    const body = Object.assign({ cycleNumber, pid }, obj)
    return request
      .post(`${config.backend}/followUp/after_one`)
      .checkToken()
      .send(body)
      .commonDispose()
      .then(
        (res) => {
          this.getAfterbirth()
          message.success("保存成功")
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  //保存五周岁信息
  @action saveBirthFive = (obj) => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    const body = Object.assign({ cycleNumber, pid }, obj)
    return request
      .post(`${config.backend}/followUp/after_five`)
      .checkToken()
      .send(body)
      .commonDispose()
      .then(
        (res) => {
          this.getAfterbirth()
          message.success("保存成功")
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  //保存十周岁信息
  @action saveBirthTen = (obj) => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    const body = Object.assign({ cycleNumber, pid }, obj)
    return request
      .post(`${config.backend}/followUp/after_ten`)
      .checkToken()
      .send(body)
      .commonDispose()
      .then(
        (res) => {
          this.getAfterbirth()
          message.success("保存成功")
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  //保存十五周岁男信息
  @action saveFifteenMale = (obj) => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    const body = Object.assign({ cycleNumber, pid }, obj)
    return request
      .post(`${config.backend}/followUp/fifteen_male`)
      .checkToken()
      .send(body)
      .commonDispose()
      .then(
        (res) => {
          this.getAfterbirth()
          message.success("保存成功")
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }
  //保存十五周岁女信息
  @action saveFifteenFemale = (obj) => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    const body = Object.assign({ cycleNumber, pid }, obj)
    return request
      .post(`${config.backend}/followUp/fifteen_female`)
      .checkToken()
      .send(body)
      .commonDispose()
      .then(
        (res) => {
          this.getAfterbirth()
          message.success("保存成功")
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  //保存二十周岁男信息
  @action saveTWentyMale = (obj) => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    const body = Object.assign({ cycleNumber, pid }, obj)
    return request
      .post(`${config.backend}/followUp/twenty_male`)
      .checkToken()
      .send(body)
      .commonDispose()
      .then(
        (res) => {
          this.getAfterbirth()
          message.success("保存成功")
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }
  //保存二十周岁女信息
  @action saveTWentyFemale = (obj) => {
    const cycleNumber = JSON.parse(
      localStorage.getItem("followrecord")
    ).cycleNumber
    const pid = JSON.parse(localStorage.getItem("followrecord")).pid
    const body = Object.assign({ cycleNumber, pid }, obj)
    return request
      .post(`${config.backend}/followUp/twenty_female`)
      .checkToken()
      .send(body)
      .commonDispose()
      .then(
        (res) => {
          this.getAfterbirth()
          message.success("保存成功")
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }
  //随访列表，筛选
  @action getfollowList = () => {
    let queryData = qs.parse(this.queryString)
    if (queryData.cycleType === "新鲜 复苏") {
      queryData.cycleType = "新鲜+复苏"
    }
    return apis.follow.screeningCondition(queryData).then(
      (res) => {
        this.followList = res.data.list
        this.totalCount = res.data.total
        // 当只有妊娠，且移植日或者手术日存在的情况下才去做血激素
        if (queryData.surgeryStartDate && queryData.stageType === "0") {
          let days = this.judgeDays(queryData.surgeryStartDate)
          if (
            (days === 14 &&
              (queryData.cycleType === "新鲜" ||
                queryData.cycleType === "新鲜+复苏" ||
                queryData.cycleType === "复苏")) ||
            (days === 13 &&
              (queryData.cycleType === "AIH" || queryData.cycleType === "AID"))
          ) {
            this.getFollowBloodList(res.data.list)
          }
        }
      },
      (err) => {
        message.error(err.message)
        return Promise.reject(err)
      }
    )
  }
  // 批量获取一群人的血激素(随访)，数据处理
  @action
  handleBloodList = (data) => {
    let datas = []
    data &&
      data.forEach((item, index) => {
        datas.push({
          patientPid: item.pid,
          cycleNumber: item.cycleNumber,
          surgeryDate: item.surgeryDate,
        })
      })
    return datas
  }
  // 批量查询血激素
  @action getFollowBloodList = (data) => {
    let listData = this.handleBloodList(data)
    apis.getList.getFollowBloodList(listData).then((res) => {})
  }
  // 判断两个日期相差多少天
  @action judgeDays = (odlDate) => {
    let newDay = new Date()
    let oldDay = new Date(odlDate)
    let days = parseInt((newDay - oldDay) / (1000 * 60 * 60 * 24))
    return days
  }
  //姓名查询随访列表
  @action bynamefollowList = () => {
    return request
      .get(
        `${config.backend}/followUp/searchByNameNumber?nameNumber=${this.nameNumber}`
      )
      .checkToken()
      .commonDispose()
      .then(
        (res) => {
          this.followList = res.data.list
          this.totalCount = res.data.total
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }
  //随访详情初始化数据接口
  @action getinitialization = (val) => {
    return request
      .get(`${config.backend}/followUp/info`)
      .query(val)
      .checkToken()
      .commonDispose()
      .then(
        (res) => {
          this.Biochemicalfather = res.data
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }
}
