import { observable, action } from "mobx"
import apis from "@/app/utils/apis"
import { todayString } from "@/app/utils/const.js"
import request from "@/app/utils/request"
import config from "@/app/config"
import { message } from "antd"

export default class {
  @observable adminAdviceUid = "" //管理员中套餐的默认uid
  @observable resumePeople = false
  //患者列表
  @observable users = [] //患者列表
  @observable sureGet = false //  是否加载卡片完成
  @observable selectedPerson = this.getlocalQuery("select_one") // 患者信息?
  @observable chosedPerson = {}

  @observable collapsed = false
  @action setCollapse = () => {
    this.collapsed = !this.collapsed
  }
  @observable patientCard = []
  @observable followHistory = []
  @observable cycleType = ""
  @observable card_flag = false //病人卡片请求成功

  //new observs-start 3-31
  @observable haveSpousePid = 1 //1有0无

  @action //更改患者性别参数 （基本信息调用）
  setSpousePid = (val) => {
    this.haveSpousePid = val
  }
  @observable select_resume = {
    cycleNumber: null,
    treatStage: null,
    patientPid: null,
    patientSex: null,
    spousePid: null,
    date: null,
  } //大病历查询以前周期用这个
  @observable select_one = {} //当前患者信息
  @observable select_female = {} //当前患者信息（女）
  @observable select_male = {} //当前患者信息（男）
  @observable treat_stage = null //当前患者周期阶段
  @observable patientSex = 1 //当前患者性别
  @observable activeKey = "" //当前患者的默认页面

  //new observs-end

  @action //更多患者列表
  getPatientsList = (paramObj) => {
    apis.Patients_list.getPatientList(paramObj).then((res) => {
      if (res.code === 200) {
        this.users = res.data
        if (this.users.length !== 0) {
          this.setPatientParam(res.data[0][0])
          this.itemClick(0)
          if (localStorage.getItem("typeVal") === "卵泡监测") {
            this.getPatientListBlood(res.data)
          }
        }
      } else {
        message.error(res.message)
      }
    })
  }
  // 批量获取血激素处理患者列表
  @action
  handlePatientList = (data) => {
    let dataList = []
    data.forEach((item, index) => {
      dataList.push({
        patientPid: item[0].pid,
        patientSex: item[0].sex,
        spousePid: item[0].spousePid,
        date: item[0].date,
        cycleNumber: item[0].cycleNumber,
        treatStage: item[0].treatStage,
        reservationUid: item[0].reservationUid,
        place: item[0].place,
        visitRoom: item[0].visitRoom,
      })
    })
    return dataList
  }
  // 获取血激素的值（批量获取）
  @action
  getPatientListBlood = (data) => {
    apis.getList
      .getPeopleBloodList(this.handlePatientList(data))
      .then((res) => {})
  }
  @action //患者显示卡显示
  itemClick = (index) => {
    let list = this.users
    list.forEach((item) => {
      item[0].checked = false
    })
    list[index][0].checked = true
    this.setPatientParam(list[index][0])
    this.initCard("patient")
    //存入是否有配偶
    this.setSpousePid(list[index][1].pid !== null ? 1 : 0)
  }
  @action //存入患者通用请求参数  1女0男
  setPatientParam = (data) => {
    let paramobj = {
      cycleNumber: data.cycleNumber,
      treatStage: data.treatStage,
      patientPid: data.pid,
      patientSex: data.sex,
      spousePid: data.spousePid,
      date: data.date || todayString, //补录日期
      place: data.place || null,
      visitRoom: data.visitRoom || null,
      reservationUid: data.reservationUid,
    }

    this.select_one = paramobj
    this.patientSex = data.sex
    this.treat_stage = data.treatStage
    this.activeKey =
      this.treat_stage === 0
        ? "fir"
        : this.treat_stage === 1
        ? "sec"
        : this.treat_stage === 6
        ? "natural"
        : "mon"
    this.setlocalQuery(data.sex, "sex")
    this.setlocalQuery(data.treatStage, "stage")
    this.setlocalQuery(paramobj, "patient")
  }
  @action //获取患者card信息  患者详情，随访详情通用
  initCard = (page, female, male) => {
    //根据id查询患者基本信息card
    if (page === "patient") {
      apis.WorkBench.getPatiensInfo(this.select_one).then((res) => {
        if (res.code === 200) {
          this.patientCard = res.data
          this.card_flag = true
          let data = res.data
          //存入病人性别 男(0)女(1)  ，进周期默认女方 (仅病人页使用)
          if (data) {
            //默认女
            let femaleObj = {
              cycleNumber: data.cycleNumber,
              patientPid: data.femalePid,
              patientSex: 1,
              spousePid: data.malePid,
              date: data.femaleDate || todayString,
              treatStage: data.treatStage,
              reservationUid: data.reservationUid,
              place: data.femalePlace || null,
              visitRoom: data.femaleVisitRoom || null,
            }
            let maleObj = {
              cycleNumber: data.cycleNumber,
              patientPid: data.malePid,
              patientSex: 0,
              spousePid: data.femalePid,
              date: data.maleDate || todayString,
              treatStage: data.treatStage,
              reservationUid: data.reservationUid,
              place: data.malePlace || null,
              visitRoom: data.maleVisitRoom || null,
            }
            // this.select_one = this.patientSex ? femaleObj : maleObj
            this.select_female = femaleObj
            this.select_male = maleObj
            this.treat_stage = data.treatStage
            this.setlocalQuery(
              parseFloat(localStorage.getItem("sex")) ? femaleObj : maleObj,
              "patient"
            )
            this.setlocalQuery(femaleObj, "femalePatient")
            this.setlocalQuery(maleObj, "malePatient")
            this.setlocalQuery(data.treatStage, "stage")
            this.setlocalQuery(this.patientCard, "patientCard")
            this.sureGet = true
          }
        }
      })
    } else if (page === "frozen" || page === "follow") {
      this.patientCard = { ...female, ...male }
    }
  }
  //获取随访履历
  @action
  getFollowHistory = (params) => {
    return request
      .get(`${config.backend}/followUp/history`)
      .checkToken()
      .query(params)
      .commonDispose()
      .then(
        (res) => {
          this.cycleType = res.data.cycleType
          this.followHistory = res.data.cycleHistoryVOs
        },
        (err) => {
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  //筛选条件存入缓存
  @action
  setlocalQuery = (queryobj, page) => {
    let str = JSON.stringify(queryobj)
    localStorage.setItem(page, str)
  }
  //筛选条件取出缓存
  @action
  getlocalQuery = (itmeName) => {
    return JSON.parse(localStorage.getItem(itmeName))
  }
  @action //判断数组是否为空
  checkArrisEmpty = (arr) => {
    let flag = Array.isArray(arr)
    if (flag) {
      return arr === null || arr.length === 0 ? true : false
    } else {
      return arr === null || arr === undefined ? true : false
    }
  }

  @action //校验请求数据，如果为空，取前端初始化数据
  checkDataisEmpty = (resdata, initdata) => {
    return resdata ? resdata : initdata
  }

  @action //表格合并行
  getRowSpan = (data, param) => {
    return data
      .reduce((result, item) => {
        //首先将param字段作为新数组result取出
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
  @action //当前履历选择的患者
  resumeSelect = (data) => {
    let femaleObj = {
      cycleNumber: data.cycleNumber,
      patientPid: data.patientPid,
      patientSex: 1,
      spousePid: data.spousePid,
      date: data.date,
      treatStage: data.treatStage,
      palce: data.palce || null,
      visitRoom: data.visitRoom || null,
    }
    let maleObj = {
      cycleNumber: data.cycleNumber,
      patientPid: data.spousePid,
      patientSex: 0,
      spousePid: data.patientPid,
      date: data.date,
      treatStage: data.treatStage,
      palce: data.palce || null,
      visitRoom: data.visitRoom || null,
    }
    this.setlocalQuery(femaleObj, "femalePatient")
    this.setlocalQuery(maleObj, "malePatient")
    this.setlocalQuery(data.treatStage, "stage")
  }
}
