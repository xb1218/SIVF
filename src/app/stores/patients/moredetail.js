import React from "react"
import List from "@/app/stores/list"
import { action, observable } from "mobx"
import moment from "moment"
import { Select, Col, Checkbox } from "antd"
import { isObj, isArray } from "@/app/utils/reg.js"
import request from "@/app/utils/request"
import config from "@/app/config"
import { message } from "antd"
import apis from "@/app/utils/apis"

export default class Store {
  @observable patientSex = 0 //病人性别 男(0)女(1)
  @observable init = "tzlllllll" //测试数据

  @observable todayString = moment(new Date()).format("YYYY-MM-DD") //当天日期
  @observable todayTime = moment(new Date()).format("LTS") //当天时间,时分秒
  @observable patinetsList = []

  @observable triggerDTOList_store = []
  @observable queryMaps = {
    //分页数据
    date: "",
    projectList: [],
    pageNum: 1,
    pageSize: 15,
  }
  @observable femaleBaseData = {
    baseInfoDTO: {
      documentsInfos: [{}],
      relativeInfos: [{}],
    },
    complainantDTO: {},
    personalHistoryDTO: {},
    familyHistoryDTO: {},
    menstrualHistoryDTO: {},
    undesirableProcreationConclusion: [],
    infertilityConclusion: [],
    geneticHistoryConclusion: [],
    tumorHistoryConclusion: [],
    reproductiveSystemConclusion: [],
    pastHistoryDTOList: [],
    surgicalHistoryDTOList: [],
    artTreatmentHistoryDTOList: [],
    abortionDTOList: [],
    childbirthDTOList: [],
    ectopicPregnancyDTOList: [],
  }
  @observable maleBaseData = {
    baseInfoDTO: {
      documentsInfos: [{}],
      relativeInfos: [{}],
    },
    complainantDTO: {},
    personalHistoryDTO: {},
    familyHistoryDTO: {},
    maleMaritalHistoryDTO: {},
    undesirableProcreationConclusion: [],
    infertilityConclusion: [],
    geneticHistoryConclusion: [],
    tumorHistoryConclusion: [],
    reproductiveSystemConclusion: [],
    pastHistoryDTOList: [],
    surgicalHistoryDTOList: [],
    artTreatmentHistoryDTOList: [],
  }
  @observable optionsData = []
  @observable birthPlaceList = []

  // 医嘱页面(开始)
  @observable medicalDataSource = [
    {
      key: 0,
      drugType: 1,
      drugName: "",
      dose: "",
      unit: "",
      frequency: "",
      days: "",
      usage: "",
      eatStatus: "",
      eatDate: moment(new Date()),
      note: "",
      startNode: null,
      specification: "",
      tag: null,
      amount: "",
      remain: "",
      delete: false,
      canDel: 0,
      drugeOption: [],
    },
    {
      key: 1,
      drugType: 1,
      drugName: "",
      dose: "",
      unit: "",
      frequency: "",
      days: "",
      usage: "",
      eatStatus: "",
      eatDate: moment(new Date()),
      note: "",
      startNode: null,
      specification: "",
      tag: null,
      amount: "",
      remain: "",
      delete: false,
      canDel: 0,
      drugeOption: [],
    },
  ]
  @observable inspectDataSource = [
    {
      key: 0,
      inspectionItem: "",
      entrustment: "",
      delete: false,
    },
  ]
  @observable treatmentDataSource = [
    {
      key: 0,
      treatmentProject: "",
      note: "",
      delete: false,
    },
  ]
  @observable selectDrugArry = [
    { type: 0, list: [] },
    { type: 1, list: [] },
    { type: 2, list: [] },
    { type: 3, list: [] },
  ] //用药类型的下拉框
  @observable dataSetMent = [] // 选中的套餐项
  @observable setMentTyle = 0 // 选中的套餐项的类别
  @observable ontoptInfoList = [] // 下拉框选项
  @observable medicationConfig = [] //用药配置
  @observable medicalAdviceCheckConfig = [] //检查配置
  @observable packageCheckOptions = [] //检查配置
  @observable outPatientMedicationPackages = [] //门诊用药套餐
  @observable cycleMedicationPackages = [] //进周期用药套餐
  @observable outPatientCheckPackages = [] //门诊检查套餐
  @observable cycleCheckPackages = [] //进周期检查套餐
  @observable solventConfig = [] //溶剂用药配置

  @observable patientParams = {
    patientPid: "",
    patientSex: 0,
    spousePid: "",
    date: "",
    cycleNumber: "",
    treatStage: -1,
    reservationUid: "",
    place: "",
    visitRoom: "",
  }
  @observable specialTipsMan = []
  @observable specialTipsWoman = []

  // 医嘱配置（后台接口调用）(进周期)
  configMedicalAdvice = (select) => {
    apis.MedicalAdvice.configMedical(select).then((res) => {
      if (res.code === 200) {
        this.handleKey(res.data.outPatientMedicationPackages, "medicationInfos")
        this.handleKey(res.data.cycleMedicationPackages, "medicationInfos")
        this.handleKey(
          res.data.outPatientCheckPackages,
          "medicalAdviceCheckConfigs"
        )
        this.handleKey(res.data.cycleDateCheckPackages, "cycleCheckPackages")
        this.handleSelect(res.data.medicationConfig)
        this.ontoptInfoList = res.data.ontoptInfoList
        this.medicationConfig = res.data.medicationConfig
        this.solventConfig = res.data.solventConfig
        this.medicalAdviceCheckConfig = res.data.medicalAdviceCheckConfig
        this.packageCheckOptions = res.data.packageCheckOptions
        this.outPatientMedicationPackages =
          res.data.outPatientMedicationPackages
        this.cycleMedicationPackages = res.data.cycleMedicationPackages
        this.outPatientCheckPackages = res.data.outPatientCheckPackages
        this.cycleCheckPackages = res.data.cycleDateCheckPackages
        return true
      }
    })
  }
  // 初始化用药&检查下拉框
  medicalAdviceOptions = () => {
    apis.MedicalAdvice.medicalAdviceOptions().then((res) => {
      if (res.code === 200) {
        this.handleSelect(res.data.medicationConfig)
        this.medicationConfig = res.data.medicationConfig
        this.solventConfig = res.data.solventConfig
        this.ontoptInfoList = res.data.ontoptInfoList
        this.medicalAdviceCheckConfig = res.data.medicalAdviceCheckConfig
        return true
      }
    })
  }
  // 数据处理(门诊医嘱)
  handleAdviceDate = (fatcher, item, source, oldSource, name) => {
    if (fatcher[oldSource].length > 0) {
      fatcher[oldSource].push(item)
      fatcher[oldSource].filter((items, index) => (items.key = index))
      fatcher[oldSource].forEach((itemf, indexf) => {
        if (itemf[name]) {
          itemf.delete = true
        } else {
          itemf.delete = false
        }
      })
    } else {
      fatcher[oldSource] = source
    }
  }
  // 数据处理加序号
  @action handleKey = (data, param) => {
    data &&
      data.forEach((item, index) => {
        item[param].forEach((itemi, indexi) => {
          itemi.key = indexi
        })
      })
  }
  // 生成多选框集合
  @action getCheckBoxs = (arry, itemid) => {
    const boxs = arry.map((item, index) => {
      if (item.itemCod === itemid) {
        return item.ontopts.map((items, i) => {
          return (
            <Col span={6} style={{ marginBottom: "10px" }} key={i}>
              <Checkbox key={i} value={items.optVal}>
                {items.optVal}
              </Checkbox>
            </Col>
          )
        })
      } else {
        return null
      }
    })
    return boxs
  }
  // 添加下拉框选项
  handledrugselect = (arry, itemd) => {
    arry.push({
      value: itemd.id,
      label:
        itemd.drugName +
        ", " +
        itemd.tag +
        ", " +
        itemd.dose +
        ", " +
        itemd.frequency +
        ", " +
        itemd.usage,
      key: itemd.id,
    })
  }
  // 医嘱用药类型下拉框
  @action handleSelect = (list) => {
    this.selectDrugArry.forEach((item) => {
      if (item.type !== 0) {
        list.forEach((itemd, indexd) => {
          if (itemd.drugType === item.type) {
            this.handledrugselect(item.list, itemd)
          }
        })
      } else {
        list.forEach((itemd, indexd) => {
          this.handledrugselect(item.list, itemd)
        })
      }
    })
  }
  // 医嘱用药处理初始化下拉框
  @action selectdruginit = (arry) => {
    arry.forEach((itema, indexa) => {
      this.selectDrugArry.forEach((item, index) => {
        if (itema.drugType === item.type) {
          itema.drugeOption = item.list
        }
      })
    })
  }
  // 不能选择今天之前的日期
  @action disabledDate = (current) => {
    return current < moment().subtract(1, "days")
  }
  // 医嘱模块结束
  //保存用户信息
  @action saveInfo = (body) => {
    return request
      .post(`${config.backend}/baseInfo`)
      .checkToken()
      .send(body)
      .commonDispose()
      .then(
        (res) => {
          return Promise.resolve()
        },
        (err) => {
          message.destroy()
          message.error(err.message)
          return Promise.reject(err)
        }
      )
  }

  @action updateQueryMap = (data) => {
    for (const key in data) {
      this.queryMaps[key] = data[key]
    }
  }
  @action //字符串转数组
  strToarr = (data) => {
    return typeof data === "string" ? data.split(",") : data
  }
  @action //下拉框选项赋值
  renderOptions = (arr, id) => {
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
  @action //表格合并行
  getRowSpan = (data, param) => {
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
  @action //设置默认值
  setDefalutval = (data, attr, val) => {
    if (isObj(data)) {
      data[attr] = data[attr] === null || data[attr] === "" ? val : data[attr]
    } else if (isArray(data)) {
      data.map((item) => {
        if (item[attr] === null || item[attr] === "") {
          item[attr] = val
        }
        return item[attr]
      })
    }
  }

  @action //判断数组是否为空
  checkArrisEmpty = (arr) => {
    let flag = Array.isArray(arr)
    if (flag) {
      return arr === null || arr.length === 0 ? true : false
    } else {
      return arr === null ? true : false
    }
  }

  @action //校验请求数据，如果为空，取前端初始化数据
  checkDataisEmpty = (resdata, initdata) => {
    return resdata ? resdata : initdata
  }
  @action //给数据加key
  putKeys = (data) => {
    data.forEach((item, i) => {
      item.key = i
    })
  }

  static fromJS() {
    const store = new Store()
    store.list = new List(store, "aaa/bbb/ccc") //使用list说明 aaa/bbb/ccc为请求列表接口
    return store
  }
}
