/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { observable } from "mobx"
import {
  DatePicker,
  Radio,
  Button,
  Select,
  Drawer,
  AutoComplete,
  Input,
  Divider,
  message,
  TimePicker,
  Row,
  Popover,
  Switch,
} from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { CONST_ONE, CONST_TWO, CONST_THREE } from "@/app/utils/const"
import moment from "moment"
import { NormalModal } from "@/app/components/base/baseModal"
import Trigger from "./trigger" //扳机
import Prescription from "./prescription" //处方
import SetMeal from "./setMeal" //套餐
import Corpus from "./corpus" //黄体期用药抽屉
import TreatListDay from "./treatLIstDay" //当天治疗单抽屉
import Recover from "./recover" //复苏医嘱
import TransPlant from "./transPlant" //移植医嘱
import DeterMineDate from "@/app/components/normal/DetermineDate" //拼针列表
import QuickAdvice from "./quickAdvice" //医嘱快速导入
import SpellsList from "@/app/components/normal/SpellsList"
import { optionSelect, matterOptions } from "./defaultData"
import {
  notModifiable, //是否可以修改这行数据
  handleCal, //初始余量的处理
  adddrugeOption, //加上所需的属性
  selectStrings, //取出字符串中非数字
  selectNmbers, //取出字符串中所有的数字
  defaultKey, //是否显示拟行
  compareDate, //判断两个日期的前后
  calculationMargin,
  disabledDate,
} from "./medicalTool"
import Regimen from "./regimen"
import "./index.scss"
import apis from "@/app/utils/apis"
import { TableSchedule } from "@/app/components/base/baseTable"
const dateFormat = "YYYY-MM-DD"
const { Option } = Select
const format = "HH:mm"
const ReadDate = styled(DatePicker)`
  &.ant-picker {
    background-color: transparent;
    border-color: transparent;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
`
export default
@inject("moredetail", "store")
@observer
class index extends Component {
  @observable days = 0
  constructor(props) {
    super(props)
    this.state = {
      showQuick: null, //显示快速导入的侧边栏
      spellListUid: "", //拼针记录表中的uid
      spellDate: null, //发起拼针的日期
      sepllId: null, //发起拼针的药的id
      recordSpell: null, //拼针的行
      launchSpell: false, //发起拼针的弹框
      acceptSpell: false, //接受拼针的弹框
      selecteDrugArry: [], //模糊查询的数组
      cycleIUI: false, //是否显示iui扳机
      cycleType: "", //art方式
      dataSetMent: [], // 选中的套餐项
      haveTrigger: false, //用药列表中是否含有扳机
      setMentTyle: 0, // 选中的套餐项的类别
      visible: false, //降调节弹框启动
      differDays: 0, //两个日期相差的天数
      showCorpus: false, //移植医嘱的显示与隐藏
      showRecover: false, //复苏医嘱的显示与隐藏
      showTriggerArry: -1, //扳机等显示与隐藏
      showDraw: false, //治疗单或黄体用药的抽屉
      selectChecked: 0, //选择的是医嘱还是治疗单还是黄体用药
      showMed: false, //显示药名输入框
      mediName: null, //自定义药名输入框的内容
      selectValue: [], //选中的下拉框的值
      selectOption: [], //已选择的治疗名的数组
      addVisible: false,
      nameDrug: "", //药名
      typeDrug: "", //什么类型的药
      nowDate: moment(new Date()).format("YYYY-MM-DD"),
      medicalShow: false, //用药数据的显示
      inspectShow: false, //检查数据的显示
      returnDate: moment(new Date()).format("YYYY-MM-DD"), //返诊日
      doctor: localStorage.getItem("username"), //医生
      startNodes: [], //启动节点
      dataSourceInspect: [], //检查
      dataSourceTreat: [], //治疗
      dataSourceMedical: [], //用药
      treatmentPlanDTO: {
        uid: null,
        lmp: null,
        place: null,
        group: null,
        planType: null,
        planCycleType: null,
        medicationPlan: null,
        sperm: null,
        egg: null,
        inseminationMethod: null,
        ivm: null,
        pgtSr: null,
        pgtM: null,
        pgtA: null,
      }, //治疗方案
      dataSorceLutealMedication: [], //黄体用药治疗
      dataSourceTreatmentSheet: [], //当天治疗单
      iuiAdviceDTO: {}, //手术iui医嘱
      dataSorceTrigger: {}, //扳机
      dataSorceTriggerAgain: {}, //补扳机
      dataSorceTriggerluteal: {}, //黄体扳机
      dataSorceTriggerlutealAgain: {}, //黄体补扳机
      dataSorceRecover: {}, //复苏医嘱
      dataSorceTrs: {}, //移植医嘱
      returnClinicDTO: {},
      prescription: {}, //处方
      value: "",
      // 用药下拉框数据
      drugeOption: [],
      // 药品名称
      drugNameList: [],
      inspectOption: [], //项目下拉框
      nameList: [], //项目配置
      items: ["当日", "次日", "再次日"],
      ontoptInfoList: [], //下拉框的数据
      checkPackages: [], //项目配置
      defaultselectType: true, //是否可以修改拟行
      embryoType: null,
      blastulaType: null,
      dateDescription: "日期", //选择的类型是什么
      matter: [], //所选择的事项是什么
      selectOptionPlan: [], //用药方案中的下拉框
      showProgramme: false, //方案的显示与隐藏
      haveIUIDate: 0, //是否有iui手术时间，0表示没有，1表示有
      haveIUIDateAgain: 0, //是否有iui再次手术时间，0表示没有，1表示有
      planType: "", //方案类型
      notTrigger: false, //IUI扳机只会扳机一次，如果已经扳机，则不允许扳机第二次
    }
  }
  // 卵子冷冻相当于新鲜周期，但没有移植医嘱，新鲜周期（ivf，ivf+fet）开黄体用药有移植医嘱，
  // 复苏周期（fet）开黄体用药有移植医嘱和复苏医嘱，没有黄体期扳机
  // iui为iui扳机，没有补扳机的概念，开黄体用药时没有移植医嘱
  // 预约事项，门诊按照男女，不开进周期为妇科或者男科，开进周期医嘱默认B超，扳机默认取卵，复苏或移植默认移植
  // QD为每日一次，tid每日三次，bid每日两次，st为临时执行一次，qod隔日一次
  // 方案的添加在治疗为IUI,IVF,FET才会存在
  // 初始化
  componentDidMount() {
    let { select_one } = this.props.store
    let { configMedicalAdvice } = this.props.moredetail
    let { name } = this.props
    if (name === 1) {
      this.corpusInit() //初始化黄体用药
    }
    this.selectDrug() //模糊查询用药
    configMedicalAdvice(select_one) //初始化用药配置
    this.adviceInit() //初始化整体用药
    this.getOption() //获取用药的方案的下拉框
    this.props.onRef && this.props.onRef(this)
  }
  // 判断是否可扳机
  judgeTrigger = (type, data, date) => {
    let nowDate = moment(new Date()).format("YYYY-MM-DD")
    if (data.length > 0 && type === "IUI" && nowDate !== date) {
      this.setState({
        notTrigger: true,
      })
    } else {
      this.setState({
        notTrigger: false,
      })
    }
  }
  // 默认时长判断
  judgeHours = (type) => {
    let hours = ""
    switch (type) {
      case "长方案":
        hours = 36.5
        break
      case "拮抗方案":
        hours = 36
        break
      default:
        break
    }
    return hours
  }
  // 生成用药溶剂的下拉框
  genSolventConfig = () => {
    let { solventConfig } = this.props.moredetail
    let data = []
    solventConfig.forEach((item, index) => {
      data.push({
        label: `${item.drugName},${item.specification},${item.dose},${item.frequency},${item.usage},`,
        value: item.id,
      })
    })
    return data
  }
  // 调用获取方案的下拉框
  getOption = () => {
    apis.Patients_monitor.getOptionInit().then((res) => {
      this.setState({
        selectOptionPlan: res.data,
      })
    })
  }
  // 初始化matter,事项
  matterDefault = (data) => {
    let { name } = this.props
    let {
      matter,
      showTriggerArry,
      cycleType,
      showRecover,
      showCorpus,
      selectOption,
    } = this.state
    if (data && data.length > 0) {
      matter = data
    } else {
      matter = []
      if (name === CONST_ONE) {
        if (showRecover || showCorpus || cycleType === "FET") {
          matter.push("移植")
        } else if (showTriggerArry > 0) {
          matter.push("取卵")
        }
      } else {
        if (selectOption) {
          matter.push("B超")
        }
        if (localStorage.getItem("sex") === "1") {
          matter.push("妇科")
        } else {
          matter.push("男科")
        }
      }
    }
    this.setState({
      matter: matter,
    })
  }
  // 开药查询药品是否可拼
  canSpell = (drugName, record) => {
    let { medicationConfig } = this.props.moredetail
    if (record.drugType === 1) {
      medicationConfig.forEach((item, index) => {
        if (drugName === item.drugName && item.canSpell === 1) {
          record.delete = false
          record.isSpell = true
          record.canDel = 0
        }
      })
    }
  }
  // 点击拼针的图标,0发起拼针，1接受拼针
  showLaunchSpell = (record) => {
    apis.MedicalAdvice.medicalIsSpell(record.id).then((res) => {
      if (res.code === 200) {
        this.setState({
          sepllId: record.id,
        })
        if (!res.data) {
          // 发起拼针
          this.setState({
            launchSpell: true,
            recordSpell: record,
          })
        } else {
          // 接受拼针
          this.setState({
            sepllId: record.id,
            acceptSpell: true,
            recordSpell: record,
          })
        }
        this.setState({
          spellDate: record.eatDate,
        })
      }
    })
  }
  // 确定发起拼针
  OkLanchSpell = () => {
    this.postSpell()
    this.setState({
      launchSpell: false,
    })
  }
  // 确定接受拼针
  okAcceptSpell = () => {
    this.putSpell()
    this.setState({
      acceptSpell: false,
    })
  }
  // 发起拼针后台接口
  postSpell = () => {
    let { select_one } = this.props.store
    let { sepllId, spellDate } = this.state
    let data = {
      patientPid: select_one.patientPid,
      id: sepllId,
      eatDate: spellDate,
    }
    apis.MedicalAdvice.postSpell(data).then((res) => {
      if (res.code === 200) {
        message.success(res.message)
        this.changeSpellIcon("launch", res.data)
        this.medicalSave()
      } else {
        message.warning(res.message)
      }
    })
  }
  // 接受拼针后台接口
  putSpell = () => {
    let { select_one } = this.props.store
    let data = {
      patientPid: select_one.patientPid,
      uid: localStorage.getItem("spellListUid"),
    }
    apis.MedicalAdvice.putSpell(data).then((res) => {
      if (res.code === 200) {
        message.success(res.data)
        this.changeSpellIcon("accept")
        this.medicalSave()
      } else {
        message.error(res, message)
      }
    })
  }
  // 改变拼针的图标,拼针成功
  changeSpellIcon = (successful, spellUId) => {
    let { recordSpell, dataSourceMedical } = this.state
    dataSourceMedical.forEach((item, index) => {
      if (item.key === recordSpell.key) {
        if (successful === "launch") {
          item.canDel = 1
        } else if (successful === "accept") {
          item.canDel = 1
          item.amount = 0
          item.remain = 0
        } else {
          item.canDel = 0
          item.delete = true
        }
        if (spellUId) {
          item.spellUid = spellUId
        }
      }
    })
    this.setState({
      dataSourceMedical: dataSourceMedical,
    })
  }
  // 初始化黄体用药(进周期)
  corpusInit = (data) => {
    let patient = this.props.store.select_one
    apis.MedicalAdvice.getLutealMedical(data ? data : patient).then((res) => {
      this.setState({
        dataSorceLutealMedication: res.data.filter(
          (item, index) => (item.key = item.uid)
        ),
      })
    })
  }
  // 初始化整个医嘱
  adviceInit = (data) => {
    this.setState({
      dataSourceInspect: [],
      dataSourceTreat: [],
      dataSourceMedical: [],
    })
    this.props.moredetail.medicalDataSource = [
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
        delete: false,
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
        delete: false,
        drugeOption: [],
      },
    ]
    this.props.moredetail.inspectDataSource = [
      {
        key: 0,
        inspectionItem: "",
        entrustment: "",
        delete: false,
      },
    ]
    this.props.moredetail.treatmentDataSource = [
      {
        key: 0,
        treatmentProject: "",
        note: "",
        delete: false,
      },
    ]
    setTimeout(() => {
      this.getInit(data)
    }, 1)
  }
  // 请求后台初始化
  getInit = (data) => {
    let patient = this.props.store.select_one
    apis.MedicalAdvice.getMedicalAdvice(data ? data : patient).then((res) => {
      if (res.code === 200) {
        this.medicalData(res.data)
      }
    })
  }
  // 初始化医嘱数据
  medicalData = (data) => {
    let { name } = this.props
    let { nowDate, treatmentPlanDTO, returnDate } = this.state
    let {
      handleAdviceDate,
      medicalDataSource,
      inspectDataSource,
      treatmentDataSource,
      selectdruginit,
    } = this.props.moredetail
    this.setState({
      planType: data.planType, //方案类型
      prescription: data.prescription, //处方
      treatmentPlanDTO: data.prescription.treatmentPlanDTO
        ? data.prescription.treatmentPlanDTO
        : treatmentPlanDTO, //方案
      cycleIUI: data.artMethod === "IUI" ? true : false,
      cycleType: data.artMethod,
      dateDescription: data.returnClinicDTO.dateDescription
        ? data.returnClinicDTO.dateDescription
        : "日期",
      matter:
        data.returnClinicDTO && data.returnClinicDTO.matter
          ? data.returnClinicDTO.matter.split(",")
          : [],
      returnClinicDTO: data.returnClinicDTO,
      returnDate: data.returnClinicDTO.returnDate
        ? data.returnClinicDTO.returnDate
        : returnDate,
      doctor: data.returnClinicDTO.doctor || localStorage.getItem("username"),
    })
    // 判断IUI时间是否已经存在
    if (data.iuiAdviceDTO && data.iuiAdviceDTO.iuiDate) {
      this.setState({
        haveIUIDate: 1,
      })
    }
    if (data.iuiAdviceDTO && data.iuiAdviceDTO.iuiAgainDate) {
      this.setState({
        haveIUIDateAgain: 1,
      })
    }
    if (name === 1) {
      data.iuiAdviceDTO.inseminateTag =
        data.iuiAdviceDTO.inseminateTag === null
          ? 1
          : data.iuiAdviceDTO.inseminateTag
      // 处理扳机中的计划
      this.handlePlan(data.triggerVO.specialNote)
      this.handlePlan(data.lutealTriggerVO.specialNote)
      this.setState({
        defaultselectType: defaultKey(
          compareDate(
            data.transplantationAdviceDTO.blastocystTransplantDate,
            nowDate
          ),
          compareDate(
            data.transplantationAdviceDTO.embryosTransplantDate,
            nowDate
          )
        ),
        blastulaType: compareDate(
          data.transplantationAdviceDTO.blastocystTransplantDate,
          nowDate
        ),
        embryoType: compareDate(
          data.transplantationAdviceDTO.embryosTransplantDate,
          nowDate
        ),
        iuiAdviceDTO: data.iuiAdviceDTO,
        startNodes: data.startNodes,
        dataSorceTrigger: data.triggerVO,
        dataSorceTriggerAgain: data.triggerAgainVO,
        dataSorceTriggerluteal: data.lutealTriggerVO, //黄体扳机
        dataSorceTriggerlutealAgain: data.lutealTriggerAgainVO, //黄体补扳机
        dataSorceRecover: data.recoveryAdviceDTO, //复苏医嘱
        dataSorceTrs: data.transplantationAdviceDTO,
      })
      // 用药添加属性
      adddrugeOption(data.prescription.medicationDTOS)
      // 处理数据
      selectdruginit(data.prescription.medicationDTOS)
      // 用药数据重构
      // this.setTableData(data.prescription.medicationDTOS)
      // 判断当前周期 ，控制显示
      this.showCycle(data.artMethod)
      // 判断iui周期是否可选择扳机
      this.judgeTrigger(
        data.artMethod,
        data.triggerVO.triggerDrugs,
        data.triggerVO.triggerDate
      )
    }
    handleAdviceDate(
      data.prescription,
      medicalDataSource[0],
      medicalDataSource,
      "medicationDTOS",
      "drugName"
    )
    handleAdviceDate(
      data.prescription,
      inspectDataSource[0],
      inspectDataSource,
      "medicalAdviceCheckDTOS",
      "inspectionItem"
    )
    handleAdviceDate(
      data.prescription,
      treatmentDataSource[0],
      treatmentDataSource,
      "comprehensiveTreatmentDTOS",
      "treatmentProject"
    )
    this.setState({
      dataSourceInspect: data.prescription.medicalAdviceCheckDTOS,
      dataSourceTreat: data.prescription.comprehensiveTreatmentDTOS,
      dataSourceMedical: data.prescription.medicationDTOS,
    })
    this.showinitprogramme(data.prescription.comprehensiveTreatmentDTOS)
    // 当前开的扳机的药是哪种扳机的
    this.showTrigger(data.triggerVO, data.artMethod, data.lutealTriggerVO)
    // this.haveTrigger(data.triggerVO) //当天用药列表中是否有扳机
    // 已经选择的治疗名称
    this.selectTreatment(data.prescription.comprehensiveTreatmentDTOS)
    this.matterDefault(
      data.returnClinicDTO && data.returnClinicDTO.matter
        ? data.returnClinicDTO.matter.split(",")
        : []
    ) //事项初始化
  }
  //给表格数据添加属性
  setTableData = (data) => {
    data.forEach((record) => {
      record.doseNumber = selectNmbers(record.dose)
      record.speciNumber = selectNmbers(record.specification)
      record.sepciCompany = selectStrings(record.specification)
    })
    this.judgequick(data)
    data.forEach((record) => {
      calculationMargin(record) //计算余量
    })
  }
  // 初始化时是否显示方案
  showinitprogramme = (data) => {
    let arry = ["IVF", "FET", "IUI"]
    data.forEach((item, index) => {
      if (item.treatmentProject && arry.includes(item.treatmentProject)) {
        this.setState({
          showProgramme: true,
        })
      }
    })
  }
  // 处理扳机中的计划
  handlePlan = (source) => {
    if (source) {
      source = source.split(",")
    } else {
      source = []
    }
  }
  // 用药模糊查询
  selectDrug = () => {
    apis.MedicalAdvice.selectdrug().then((res) => {
      this.setState({
        selecteDrugArry: res.data,
      })
    })
  }
  // 按照首字母查询用药选项
  selectedDrug = (val, record) => {
    let { drugeOption, selecteDrugArry, dataSourceMedical } = this.state
    drugeOption = []
    record.drugeOption = []
    record.drugName = val
    selecteDrugArry.forEach((item, index) => {
      if (
        item.firstSpell.indexOf(val) !== -1 &&
        item.drugType === record.drugType
      ) {
        let obj = {
          value: item.id,
          label:
            item.drugName +
            ", " +
            item.tag +
            ", " +
            item.dose +
            ", " +
            item.frequency +
            ", " +
            item.usage,
          key: index,
        }
        drugeOption.push(obj)
        record.drugeOption.push(obj)
      }
    })
    this.setState({
      drugeOption: drugeOption,
      dataSourceMedical: dataSourceMedical,
    })
  }
  // 用药列表中是否含有扳机
  haveTrigger = () => {
    let { dataSourceMedical, showTriggerArry } = this.state
    let arry = []
    dataSourceMedical.forEach((item, index) => {
      arry.push(item.drugType)
    })
    if (arry.includes(2) || showTriggerArry === 0 || showTriggerArry === 2) {
      this.setState({
        haveTrigger: true,
      })
    } else {
      this.setState({
        haveTrigger: false,
      })
    }
  }
  // 时间或者日期的改变
  changeDates = (time, timestring, parm, name) => {
    let { dataSorceRecover, dataSorceTrs } = this.state
    parm[name] = timestring
    this.setState({
      dataSorceRecover: dataSorceRecover,
      dataSorceTrs: dataSorceTrs,
    })
  }
  // 已经选择的治疗的名称
  selectTreatment = (comprehensiveTreatmentDTOS) => {
    let arry = []
    comprehensiveTreatmentDTOS.forEach((item, index) => {
      if (item.treatmentProject) {
        arry.push(item.treatmentProject)
      }
    })
    this.setState({
      selectOption: arry,
    })
  }
  // 扳机等模块的显示与隐藏，0扳机，1补扳机，2黄体扳机，3黄体补扳机,4IUI扳机,5复苏周期扳机
  showTrigger = (trigger, art, trigerluteal) => {
    let { showTriggerArry, nowDate } = this.state
    if (art === "IUI") {
      showTriggerArry = 4
    } else if (art === "FET") {
      showTriggerArry = 5
    } else {
      if (
        trigger.triggerDrugs.length === 0 ||
        (trigger.triggerDrugs.length > 0 && trigger.triggerDate === nowDate)
      ) {
        showTriggerArry = 0
      } else {
        if (
          trigger.triggerDrugs.length > 0 &&
          this.getDate(trigger.triggerDate) === 1
        ) {
          showTriggerArry = 1
        } else {
          if (
            (trigger.triggerDrugs.length > 0 &&
              this.getDate(trigger.eggDate) > 0) ||
            (trigerluteal.triggerDrugs.length === 0 &&
              this.getDate(trigger.eggDate) > 0)
          ) {
            showTriggerArry = 2
          } else {
            showTriggerArry = 3
          }
        }
      }
    }
    this.setState({
      showTriggerArry: showTriggerArry,
    })
  }
  // 扳机用药，判断是哪种扳机
  handletrigger = () => {
    let { dataSourceMedical } = this.state
    let typeArry = []
    this.defaultEmpty()
    dataSourceMedical.forEach((itemd, indexd) => {
      if (itemd.drugType === 2) {
        typeArry.push(itemd.drugType)
        this.addTrigger(itemd)
      }
    })
    if (typeArry.length === 0) {
      this.emptyTrigget()
    }
  }
  // 当用药列表中没有药的时候，清空数据
  emptyTrigget = () => {
    let { showTriggerArry } = this.state
    let obj = {
      hours: "",
      triggerDate: "",
      triggerTime: "",
      eggDate: "",
      eggTime: "",
      plan: "",
      specialNote: "",
      triggerDrugs: [],
    }
    let againObj = {
      triggerAgainDate: "",
      triggerAgainTime: "",
      triggerAgainDrugs: [],
    }
    switch (showTriggerArry) {
      case 0:
      case 4:
      case 5:
        this.setState({
          dataSorceTrigger: { ...obj },
        })

        break
      case 1:
        this.setState({
          dataSorceTriggerAgain: { ...againObj },
        })
        break
      case 2:
        this.setState({
          dataSorceTriggerluteal: { ...obj },
        })
        break
      case 3:
        this.setState({
          dataSorceTriggerlutealAgain: { ...againObj },
        })
        break
      default:
        break
    }
  }
  // 添加扳机用药
  addTrigger = (itemd) => {
    let {
      dataSorceTrigger,
      dataSorceTriggerAgain,
      showTriggerArry,
      dataSorceTriggerluteal,
      dataSorceTriggerlutealAgain,
    } = this.state
    switch (showTriggerArry) {
      case 0:
      case 4:
      case 5:
        this.pushTrigger(dataSorceTrigger, "triggerDrugs", itemd)
        this.setState({
          dataSorceTrigger: dataSorceTrigger,
        })
        break
      case 1:
        this.pushTrigger(dataSorceTriggerAgain, "triggerAgainDrugs", itemd)
        this.setState({
          dataSorceTriggerAgain: dataSorceTriggerAgain,
        })
        break
      case 2:
        this.pushTrigger(dataSorceTriggerluteal, "triggerDrugs", itemd)
        this.setState({
          dataSorceTriggerluteal: dataSorceTriggerluteal,
        })
        break
      case 3:
        this.pushTrigger(
          dataSorceTriggerlutealAgain,
          "triggerAgainDrugs",
          itemd
        )
        this.setState({
          dataSorceTriggerlutealAgain: dataSorceTriggerlutealAgain,
        })
        break
      default:
        break
    }
    this.setState({
      dataSorceTrigger: { ...dataSorceTrigger },
      dataSorceTriggerAgain: { ...dataSorceTriggerAgain },
      dataSorceTriggerluteal: { ...dataSorceTriggerluteal },
      dataSorceTriggerlutealAgain: { ...dataSorceTriggerlutealAgain },
    })
  }
  // 添加哪个扳机用药
  pushTrigger = (trigger, triggerType, itemd) => {
    let { planType, cycleType } = this.state
    trigger[triggerType].push({
      drugName: itemd.drugName,
      dose: itemd.dose,
    })
    if (trigger[triggerType].length > 0) {
      if (cycleType !== "IUI") {
        trigger.hours = this.judgeHours(planType)
      }
      if (triggerType.includes("Again")) {
        trigger.triggerAgainDate = moment(new Date()).format("YYYY-MM-DD")
      } else {
        trigger.triggerDate = moment(new Date()).format("YYYY-MM-DD")
      }
    } else {
      trigger.hours = ""
      trigger.triggerDate = ""
      trigger.triggerTime = ""
      trigger.eggDate = ""
      trigger.eggTime = ""
      trigger.plan = ""
      trigger.specialNote = ""
    }
  }
  // 置空
  defaultEmpty = () => {
    let {
      dataSorceTrigger,
      dataSorceTriggerAgain,
      dataSorceTriggerluteal,
      dataSorceTriggerlutealAgain,
      showTriggerArry,
    } = this.state
    switch (showTriggerArry) {
      case 0:
      case 4:
      case 5:
        dataSorceTrigger.triggerDrugs = []
        break
      case 1:
        dataSorceTriggerAgain.triggerAgainDrugs = []
        break
      case 2:
        dataSorceTriggerluteal.triggerDrugs = []
        break
      case 3:
        dataSorceTriggerlutealAgain.triggerAgainDrugs = []
        break
      default:
        break
    }
  }
  // switch判断什么周期
  switchType = (cycleType) => {
    switch (cycleType) {
      case "卵子冷冻":
        this.setState({
          showCorpus: false,
          showRecover: false,
          cycleIUI: false,
        })
        break
      case "IVF":
      case "IVF+FET":
        this.setState({
          showCorpus: true,
          showRecover: false,
          cycleIUI: false,
        })
        break
      case "FET":
        this.setState({
          showCorpus: true,
          showRecover: true,
          cycleIUI: false,
        })
        break
      default:
        break
    }
  }
  // 初始化判断什么周期
  showCycle = (cycleType, arry) => {
    if (cycleType === "IUI") {
      this.setState({
        showCorpus: false,
        showRecover: false,
        cycleIUI: true,
      })
    } else if (cycleType === "IVF") {
      this.setState({
        showCorpus: false,
        showRecover: false,
        cycleIUI: false,
      })
    } else {
      if (arry) {
        if (arry.indexOf(3) > -1) {
          this.switchType(cycleType)
        }
      }
    }
  }
  // 复苏和移植医嘱的显示与隐藏，开黄体的药出现移植医嘱，当为复苏周期的时候出现复苏
  showCor = () => {
    let { cycleType, dataSourceMedical } = this.state
    let arry = []
    dataSourceMedical.forEach((item, index) => {
      if (item.drugName) {
        arry.push(item.drugType)
      }
    })
    this.showCycle(cycleType, arry)
  }
  // 返诊日的计算（用药的返诊日计算），扳机为取卵日，用药日期加天数加1，复苏和移植为当天
  returnDay = (record) => {
    let { dataSourceMedical, haveTrigger } = this.state
    let date = moment(new Date(record.eatDate)) //启用日期
    if (record.drugType !== 3 && record.drugType !== 2) {
      // 吃药日期加吃几天加1
      record.returnDay = date.add(record.days, "days").format("YYYY-MM-DD")
    }

    this.setState({
      dataSourceMedical: dataSourceMedical,
    })
    // 有无扳机的返诊日的计算
    if (haveTrigger) {
      this.returnDiagnosis()
    } else {
      this.returndayArry()
    }
  }
  // 周期用药返诊日计算
  returndayArry = () => {
    let { dataSourceMedical } = this.state
    let arry = []
    dataSourceMedical.forEach((item, index) => {
      if (item.returnDay) {
        arry.push(item.returnDay)
      }
    })
    arry.sort((n1, n2) => {
      return (
        Date.parse(n2.replace(/-/g, "/")) - Date.parse(n1.replace(/-/g, "/"))
      )
    })
    this.setState({
      returnDate: arry[0],
    })
  }
  // 扳机用药，返诊日为取卵日，0扳机，1补扳机，2黄体扳机，3黄体补扳机
  returnDiagnosis = () => {
    let {
      showTriggerArry,
      dataSorceTrigger,
      dataSorceTriggerluteal,
      dataSourceMedical,
    } = this.state
    dataSourceMedical.forEach((item, index) => {
      if (item.drugType === 2) {
        if (showTriggerArry === 0) {
          this.setState({
            returnDate: dataSorceTrigger.eggDate,
          })
        } else if (showTriggerArry === 2) {
          this.setState({
            returnDate: dataSorceTriggerluteal.eggDate,
          })
        }
      }
    })
    this.setState({
      dataSourceMedical: dataSourceMedical,
    })
  }
  // 黄体用药，复苏或移植当天，取最小值
  returnEt = () => {
    let { dataSorceRecover, dataSorceTrs, dataSourceMedical } = this.state
    let arry = []
    dataSourceMedical.forEach((item, index) => {
      if (item.drugType === 3) {
        arry.push(
          dataSorceTrs.embryosTransplantDate,
          dataSorceTrs.blastocystTransplantDate,
          dataSorceRecover.embryosThawDate,
          dataSorceRecover.blastocystThawDate
        )
      }
    })
    let filterarry = arry
      .filter((item) => item !== null)
      .sort((n1, n2) => {
        return (
          Date.parse(n1.replace(/-/g, "/")) - Date.parse(n2.replace(/-/g, "/"))
        )
      })
    this.setState({
      returnDate: filterarry[0],
    })
  }
  //判断两个日期相差多少天
  getDate = (oldVal) => {
    let { differDays } = this.state
    let newDate = new Date()
    let oldDate = new Date(oldVal)
    differDays = parseInt(
      (newDate.getTime() - oldDate.getTime()) / (24 * 3600 * 1000)
    )
    this.setState({ differDays })
    return differDays
  }
  // 根据药的类型改变下拉框的值
  showSelect = (type, index) => {
    let { dataSourceMedical } = this.state
    let { selectDrugArry } = this.props.moredetail
    dataSourceMedical.forEach((item, i) => {
      selectDrugArry.forEach((items, indexs) => {
        if (items.type === type) {
          item.drugeOption = items.list
        }
      })
    })
    this.setState({
      dataSourceMedical: [...dataSourceMedical],
    })
  }
  // 选择药的类型
  handleDrugType = (val, record, parm, index) => {
    let { notTrigger } = this.state
    if (val === 2 && notTrigger) {
      message.warning("已扳机，不可再扳机")
    } else {
      if (notModifiable(record)) {
        record[parm] = val
        this.showSelect(val)
      }
    }
  }
  // 改变周期还是黄体用药或治疗单
  changeButton = (e) => {
    this.setState({
      selectChecked: e.target.value,
    })
    if (e.target.value !== 0) {
      this.setState({
        showDraw: true,
      })
    }
  }
  // 判断药或者项目是否需要保留
  judgeShowItem = (dataSource, parm) => {
    let { dataSourceInspect, dataSourceMedical } = this.state
    dataSource.forEach((item, index) => {
      if (!item[parm]) {
        dataSource.splice(index, 2)
      }
    })
    this.setState({
      dataSourceInspect: [...dataSourceInspect],
      dataSourceMedical: [...dataSourceMedical],
    })
  }
  // 用药添加一行空数据
  addmedicalItem = () => {
    let { dataSourceMedical } = this.state
    dataSourceMedical.push({
      key: dataSourceMedical.length + 1,
      drugType: 1,
      drugName: "",
      dose: "",
      unit: "",
      frequency: "",
      days: "",
      usage: "",
      eatStatus: "",
      remarks: "",
      drugeOption: [],
      startNode: null,
      delete: false,
    })
    this.setState({
      dataSourceMedical: [...dataSourceMedical],
    })
    this.showSelect(1)
  }
  // 检查添加一行空数据
  addinspectItem = () => {
    let { dataSourceInspect } = this.state
    dataSourceInspect.push({
      key: dataSourceInspect.length + 1,
      inspectionItem: "",
      entrustment: "",
      delete: false,
    })
    this.setState({
      dataSourceInspect: [...dataSourceInspect],
    })
  }
  //套餐弹框选择确定
  handleOk = () => {
    let { dataSourceInspect, dataSourceMedical } = this.state
    let { dataSetMent, setMentTyle } = this.props.moredetail
    if (setMentTyle === 1) {
      this.judgeShowItem(dataSourceInspect, "inspectionItem")
      dataSetMent.forEach((item, index) => {
        item.delete = true
        item.key = parseInt(dataSourceInspect.length + index)
        dataSourceInspect.unshift(item)
      })
      this.addinspectItem()
    } else {
      this.judgeShowItem(dataSourceMedical, "drugName")
      dataSetMent.forEach((item, index) => {
        item.delete = true
        item.eatStatus = "当日"
        item.days = 1
        item.eatDate = moment(new Date())
        item.key = item.drugId
        item.id = item.drugId
        dataSourceMedical.unshift(item)
      })
      this.setTableData(dataSourceMedical)
      this.addmedicalItem()
    }
    this.setState({
      dataSourceInspect: [...dataSourceInspect],
      dataSourceMedical: [...dataSourceMedical],
      visibleDraw: false,
    })
  }
  // 渲染处方和当天治疗单
  rendingPre = () => {
    let {
      returnDate,
      doctor,
      dataSourceMedical,
      dataSourceInspect,
      dataSourceTreat,
      prescription,
    } = this.state
    prescription.medicationDTOS = dataSourceMedical
    prescription.medicalAdviceCheckDTOS = dataSourceInspect
    prescription.comprehensiveTreatmentDTOS = dataSourceTreat
    prescription.date = returnDate
    prescription.doctor = doctor
    this.setState({
      prescription: { ...prescription },
    })
  }
  // 添加处方
  addData = (returnData) => {
    apis.MedicalAdvice.saveMedicalAdvice(this.publicDataDepar()).then((res) => {
      if (res.code === 200) {
        this.rendingPre()
        message.destroy()
        message.success("添加处方成功!")
        this.props.initPage()
      } else {
        message.error(res.message)
      }
    })
  }
  // 转化为下拉框options
  conversionOptions = () => {
    let { drugeOption, drugNameList } = this.state
    let { medicationConfig } = this.props.moredetail
    drugeOption = []
    drugNameList = medicationConfig
    medicationConfig.forEach((item, index) => {
      if (item.drugType === 0) {
        drugeOption.push({
          value: item.id,
          label:
            item.drugName +
            ", " +
            item.tag +
            ", " +
            item.dose +
            ", " +
            item.frequency +
            ", " +
            item.usage,
          key: item.id,
        })
      }
    })
    this.setState({
      drugeOption: [...drugeOption],
      drugNameList: [...drugNameList],
    })
  }
  // 下拉框转换
  conversionOptionsInspect = () => {
    let { packageCheckOptions } = this.props.moredetail
    let { inspectOption } = this.state
    inspectOption = []
    packageCheckOptions.forEach((item, index) => {
      if (item.inspectionItem) {
        inspectOption.push({
          value: !item.entrustment
            ? item.inspectionItem
            : item.inspectionItem + "," + item.entrustment,
          label: (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {!item.entrustment
                ? item.inspectionItem
                : item.inspectionItem + "," + item.entrustment}
              <span
                style={{ color: item.inspectionExpireTip === "未查" && "red" }}
              >
                {item.inspectionExpireTip}
              </span>
            </div>
          ),
        })
      }
    })
    this.setState({
      nameList: packageCheckOptions,
      inspectOption: [...inspectOption],
    })
  }
  // 隐藏降调节等弹框
  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }
  // 降调节弹框点击确定
  handleOkNode = () => {
    let { startNodes, typeDrug, nowDate } = this.state
    startNodes.push({ nodeName: typeDrug, startDate: nowDate })
    this.setState({
      visible: false,
      startNodes: [...startNodes],
    })
  }
  // 判断节点数组中是否有该节点
  haveType = (type) => {
    let { startNodes } = this.state
    let show = false
    let arryNode = []
    startNodes.forEach((items, indexs) => {
      arryNode.push(items.nodeName)
    })
    if (arryNode.includes(type)) {
      show = false
    } else {
      show = true
    }
    return show
  }
  // 判断当前startNode是哪一种
  judgeStartNode = (startNode) => {
    let node = ""
    switch (startNode) {
      case 0:
        node = "降调节"
        break
      case 1:
        node = "GN"
        break
      case 3:
        node = "黄体"
        break
      default:
        break
    }
    return node
  }
  // 降调节启动弹框
  judgeModel = (record, val) => {
    let { drugNameList, cycleType } = this.state
    // 获得这个药的节点
    if (
      (cycleType === "FET" && record.startNode === 3) ||
      record.startNode !== 3
    ) {
      drugNameList.forEach((item, index) => {
        if (val === item.id) {
          if (record.drugType === CONST_ONE) {
            this.setState({
              nameDrug: record.drugName,
              typeDrug: this.judgeStartNode(record.startNode),
            })
            if (this.haveType(this.judgeStartNode(record.startNode))) {
              this.setState({
                visible: true,
              })
            }
          }
        }
      })
    }
  }
  // 获取药名下拉选框焦点
  focusDrug = (record) => {
    this.showSelect(record.drugType)
    if (!record.isSolvent) {
      this.conversionOptions()
    }
  }
  // 获取项目的焦点
  focusInspect = () => {
    this.conversionOptionsInspect()
  }
  // 查找该药中对应的规格
  selectSpecification = (record) => {
    let { dataSourceMedical } = this.state
    let { medicationConfig } = this.props.moredetail
    let obj = []
    medicationConfig.forEach((item, index) => {
      if (
        record.drugName === item.drugName &&
        record.drugType === item.drugType
      ) {
        obj.push({
          value: item.tag,
          label: item.tag,
          key: item.specification,
        })
      }
    })
    record.specificationOption = obj
    this.setState({
      dataSourceMedical: dataSourceMedical,
    })
  }
  // 查询该药是否有余量
  selectRemain = (name, record, index) => {
    let { select_one } = this.props.store
    // 查询该药是否有余量
    let data = {
      patientPid: select_one.patientPid,
      drugName: name,
    }
    if (record.drugType === 1) {
      apis.MedicalAdvice.medicalRemain(data).then((res) => {
        if (res.code === 200) {
          handleCal(res.data, record)
          this.autoDisplay(record, index)
        } else {
          message.error("查询余量失败！")
        }
      })
    } else {
      record.remain = null
    }
  }
  // 判断该药是否有溶剂
  judgeHaveSolvent = (solvent, index) => {
    let { dataSourceMedical } = this.state
    if (solvent && !dataSourceMedical[index + 1].isSolvent) {
      dataSourceMedical.splice(index + 1, 0, {
        key: new Date().getTime(),
        drugType: 0,
        drugName: "",
        dose: "",
        unit: "",
        frequency: "",
        days: "",
        usage: "",
        eatDate: moment(new Date()).format("YYYY-MM-DD"),
        eatStatus: "",
        remarks: "",
        isSolvent: 1,
        startNode: null,
        delete: false,
      })
      this.setState({
        dataSourceMedical: [...dataSourceMedical],
      })
    }
  }
  // 选择药名
  changeDrug = (val, record, index) => {
    let { name } = this.props
    let { dataSourceMedical, dataSorceTrigger } = this.state
    if (notModifiable(record)) {
      record.id = val
      if (name !== CONST_ONE) {
        record.drugType = 0
      }
      // 添加删除按钮，若为最后一行，则添加新的一行
      if (record.id) {
        record.delete = true
        // 添加新的一行，最后一行
        if (index === dataSourceMedical.length - 1) {
          dataSourceMedical.push({
            key: dataSourceMedical.length,
            drugType: 1,
            drugName: "",
            dose: "",
            unit: "",
            frequency: "",
            days: "",
            usage: "",
            eatDate: moment(new Date()).format("YYYY-MM-DD"),
            eatStatus: "",
            remarks: "",
            startNode: null,
            delete: false,
          })
        }
        this.autoDisplay(record, index) //自动显示
        this.returnDay(record) //计算返诊日
        this.matterDefault() //事项默认显示
        if (name === CONST_ONE) {
          this.judgeModel(record, val) //启动降调节弹框
          this.selectRemain(record.drugName, record, index) //查询余量
          this.selectSpecification(record) //筛选相应药的规格
          this.showSelect(record.drugType) // 根据药的类型改变下拉框的值
          this.handletrigger() //添加扳机用药
          this.showCor() //显示复苏
          this.haveTrigger() //是否显示扳机
          this.canSpell(record.drugName, record) //是否接受拼针
        }
      }
      this.setState({
        dataSourceMedical: [...dataSourceMedical],
        dataSorceTrigger: { ...dataSorceTrigger },
      })
    }
  }
  // 选择项目名
  changeInspect = (val, record, index) => {
    let { dataSourceInspect } = this.state
    record.inspectionItem = val ? val.split(",")[0] : ""
    if (record.inspectionItem) {
      record.delete = true
      if (index === dataSourceInspect.length - 1) {
        dataSourceInspect.push({
          key: dataSourceInspect.length,
          inspectionItem: "",
          entrustment: "",
          delete: false,
        })
      }
    }
    this.autoDisplayInspect(record)
    this.setState({
      dataSourceInspect: [...dataSourceInspect],
    })
  }
  // 不可选择的治疗名
  notOptional = (val, record, index) => {
    let { selectOption } = this.state
    if (record.treatmentProject) {
      record.treatmentProject = val
      selectOption.push(val)
    } else {
      if (
        ((selectOption.includes("FET") ||
          selectOption.includes("IUI") ||
          selectOption.includes("IVF") ||
          selectOption.includes("自然")) &&
          val !== "指导同房") ||
        (selectOption.includes("指导同房") && val === "指导同房")
      ) {
        message.destroy()
        message.warning("已选择相同类型的治疗！")
      } else {
        record.treatmentProject = val
        selectOption.push(val)
      }
    }
    this.setState({
      selectOption: [...selectOption],
    })
  }
  // 判断当前是否可选择治疗名称
  notChangeTreat = (val, record, index) => {
    const { select_one } = this.props.store
    if (!select_one.spousePid && val !== "指导同房") {
      message.destroy()
      message.warning("该患者没有配偶，不可选择进周期！")
    } else {
      this.changeTreat(val, record, index)
    }
  }
  // 选择治疗名
  changeTreat = (val, record, index) => {
    let { dataSourceTreat } = this.state
    this.notOptional(val, record, index)
    this.programmeShow(val)
    if (record.treatmentProject) {
      record.delete = true
      if (index === dataSourceTreat.length - 1) {
        dataSourceTreat.push({
          key: dataSourceTreat.length,
          treatmentProject: "",
          note: "",
          delete: false,
        })
      }
    }
    this.setState({ dataSourceTreat: [...dataSourceTreat] })
  }
  // 方案的显示与隐藏
  programmeShow = (val) => {
    let arr = ["IVF", "IUI", "FET"]
    if (arr.includes(val)) {
      this.setState({
        showProgramme: true,
      })
    } else {
      this.setState({
        showProgramme: false,
      })
    }
  }
  // 自动显示(用药)
  autoDisplay = (record, i) => {
    let { drugNameList } = this.state
    drugNameList.forEach((item, index) => {
      if (item.id === record.id) {
        record.id = item.id
        record.tag = item.tag
        record.drugName = item.drugName
        record.specification = item.specification
        record.canSpell = item.canSpell
        record.dose = item.dose
        record.frequency = item.frequency
        record.usage = item.usage
        record.startNode = item.startNode
        record.eatDate = moment(new Date()).format("YYYY-MM-DD")
        record.eatStatus = "当日"
        record.days = 1
        record.amount = 1
        record.needSolventTag = item.needSolventTag
        record.isSolventTag = item.isSolventTag
        record.doseNumber = selectNmbers(item.dose)
        record.speciNumber = selectNmbers(item.specification)
        record.sepciCompany = selectStrings(item.specification)
        this.judgeHaveSolvent(item.needSolventTag, i) //判断是否有溶剂标识
        calculationMargin(record) //计算余量
      }
    })
  }
  // 自动显示(项目)
  autoDisplayInspect = (record) => {
    let { nameList, dataSourceInspect } = this.state
    nameList.forEach((item, index) => {
      if (record.inspectionItem === item.inspectionItem) {
        record.entrustment = item.entrustment
        record.inspectionItem = item.inspectionItem
      }
    })
    this.setState({ dataSourceInspect })
  }
  // 输入框的改变时
  changeInput = (e, record, param) => {
    let { dataSourceMedical, dataSorceRecover, dataSorceTrs } = this.state
    let { name } = this.props
    if (record.drugType) {
      if (notModifiable(record)) {
        if (param === "dose") {
          record[param] = e.target.value
          record.doseNumber = selectNmbers(e.target.value)
        } else if (param === "amount" || param === "days") {
          record[param] = e.target.value ? parseInt(e.target.value) : 0
        } else {
          record[param] = e.target.value
        }
        if (name === CONST_ONE) {
          calculationMargin(record) //计算余量
        }
      }
    } else {
      record[param] = e.target.value
    }
    this.setState({
      dataSourceMedical: dataSourceMedical,
      dataSorceRecover: dataSorceRecover,
      dataSorceTrs: dataSorceTrs,
    })
  }
  // 查找对应的规格
  selectSpe = (val, record) => {
    let { medicationConfig } = this.props.moredetail
    medicationConfig.forEach((item, index) => {
      if (
        record.drugName === item.drugName &&
        record.drugType === item.drugType &&
        val === item.tag
      ) {
        record.tag = val
        record.specification = item.specification
        record.speciNumber = selectNmbers(item.specification)
        record.sepciCompany = selectStrings(item.specification)
      }
    })
  }
  // 下拉框的改变时
  changeSelect = (val, record, param) => {
    let {
      dataSourceMedical,
      dataSorceRecover,
      dataSorceTrs,
      iuiAdviceDTO,
    } = this.state
    let { name } = this.props
    if (notModifiable(record)) {
      record[param] = val
      if (param === "specification") {
        this.selectSpe(val, record)
      }
      this.setState({
        dataSourceMedical: dataSourceMedical,
        dataSorceRecover: dataSorceRecover,
        dataSorceTrs: dataSorceTrs,
        iuiAdviceDTO: iuiAdviceDTO,
      })
      if (name === CONST_ONE && record.drugType) {
        calculationMargin(record) //计算余量
      }
    }
  }
  // 添加多少天后
  addItem = () => {
    const { items } = this.state
    const { days } = this
    if (days) {
      let day = `${days}天后`
      items.push(day)
      this.setState({
        items: [...items],
        days: "",
      })
    }
  }
  //多少天后input输入框值的改变
  onNameChange = (e) => {
    this.days = e.target.value
  }
  //计算具体日期(用药启用)
  computedDateFuc = (val, afterDays, record) => {
    // 前一天
    let after_days_Time = moment(new Date()).subtract(-afterDays, "days")
    let obj = [
      {
        days: "当日",
        date: moment(new Date()),
      },
      {
        days: "次日",
        date: moment(new Date()).subtract(-1, "days"),
      },
      {
        days: "再次日",
        date: moment(new Date()).subtract(-2, "days"),
      },
    ]
    obj.filter((item) =>
      item.days === val
        ? (record.eatDate = item.date)
        : (record.eatDate = after_days_Time)
    )
  }
  // 删除一行
  deleteLine = (data, index) => {
    let { dataSourceMedical, dataSourceTreat, dataSourceInspect } = this.state
    data.splice(index, 1)
    message.destroy()
    message.success("删除成功！")
    this.setState({
      dataSourceMedical: [...dataSourceMedical],
      dataSourceInspect: [...dataSourceInspect],
      dataSourceTreat: [...dataSourceTreat],
    })

    data.forEach((item, i) => {
      item.key = i
    })
    this.handletrigger() //处理扳机
    this.showCor() //是否显示复苏
    this.rendingPre() //渲染处方和当天治疗单
    this.selectTreatment([...dataSourceTreat]) //已经选择的治疗名
  }
  // 调用后台接口的进周期医嘱保存
  getcyclemedical = (data) => {
    apis.MedicalAdvice.saveMedicalAdvice(data).then((res) => {
      if (res.code === 200) {
        this.corpusInit() //初始化黄体用药
        this.rendingPre()
        this.props.initPage()
        message.destroy()
        message.success("保存成功！")
      } else {
        message.error(res.message)
      }
    })
  }
  // 用药数据处理
  handleModection = (data) => {
    if (data[0].drugName === "" && data[0].days === "") {
      data.splice(0, 1)
    }
    return data
  }
  // 公用的医嘱保存数据，进周期
  publicData = (dataObj) => {
    let {
      returnDate,
      doctor,
      startNodes,
      dataSourceInspect,
      dataSourceTreat,
      dataSourceMedical,
      dataSorceTrigger,
      dataSorceTriggerAgain,
      dataSorceTriggerluteal,
      dataSorceTriggerlutealAgain,
      dataSorceRecover,
      dataSorceTrs,
      iuiAdviceDTO,
      cycleType,
      dateDescription,
      matter,
    } = this.state
    if (
      dataSorceTrigger.specialNote &&
      Array.isArray(dataSorceTrigger.specialNote)
    ) {
      dataSorceTrigger.specialNote = dataSorceTrigger.specialNote.join(",")
    }
    if (
      dataSorceTriggerluteal.specialNote &&
      Array.isArray(dataSorceTriggerluteal.specialNote)
    ) {
      dataSorceTriggerluteal.specialNote = dataSorceTriggerluteal.specialNote.join(
        ","
      )
    }
    let returnObj = {
      returnDate: returnDate,
      doctor: doctor,
      matter: matter.join(","),
      dateDescription: dateDescription,
    }
    let data = {
      patientParam: this.props.store.select_one,
      triggerVO: dataSorceTrigger,
      triggerAgainVO: dataSorceTriggerAgain,
      lutealTriggerVO: dataSorceTriggerluteal,
      lutealTriggerAgainVO: dataSorceTriggerlutealAgain,
      recoveryAdviceDTO: dataSorceRecover,
      transplantationAdviceDTO: dataSorceTrs,
      startNodes: startNodes,
      medicationDTOS: this.handleModection(
        dataSourceMedical.slice(0, dataSourceMedical.length - 1)
      ),
      medicalAdviceCheckDTOS: dataSourceInspect.slice(
        0,
        dataSourceInspect.length - 1
      ),
      comprehensiveTreatmentDTOS: dataSourceTreat.slice(
        0,
        dataSourceTreat.length - 1
      ),
      returnClinicDTO: dataObj ? dataObj : returnObj,
    }
    if (cycleType === "IUI") {
      data.iuiAdviceDTO = iuiAdviceDTO
    }
    return data
  }
  // 公用的数据医嘱保存，处方
  publicDataDepar = (returnData) => {
    let { select_one } = this.props.store
    let {
      returnDate,
      doctor,
      dataSourceMedical,
      dataSourceInspect,
      dataSourceTreat,
      prescription,
      dateDescription,
      treatmentPlanDTO,
      matter,
    } = this.state
    let returnObj = {
      returnDate: returnDate,
      doctor: doctor,
      matter: matter.join(","),
      dateDescription: dateDescription,
    }
    let data = {
      patientParam: select_one,
      medicationDTOS: this.handleModection(
        dataSourceMedical.slice(0, dataSourceMedical.length - 1)
      ),
      medicalAdviceCheckDTOS: dataSourceInspect.slice(
        0,
        dataSourceInspect.length - 1
      ),
      comprehensiveTreatmentDTOS: dataSourceTreat.slice(
        0,
        dataSourceTreat.length - 1
      ),
      treatmentPlanDTO: treatmentPlanDTO,
      returnClinicDTO: returnData ? returnData : returnObj,
      prescription: prescription,
    }
    return data
  }
  // 医嘱的保存
  medicalSave = (dataObj) => {
    let { editTag, editModalName } = this.props
    if (editTag === 0 && editModalName === "医嘱") {
      message.error("该数据从修订记录获取，不可保存")
    } else {
      this.getcyclemedical(this.publicData())
    }
  }
  // 修改手术日期
  changeOperationTime = (time, timestring, data, parm) => {
    let { iuiAdviceDTO, nowDate, haveIUIDate, haveIUIDateAgain } = this.state
    let datas = data
    if (parm === "cancelDate") {
      datas[parm] = timestring
      this.setState({
        [data]: datas,
      })
    } else {
      if (parm === "iuiDate" || parm === "iuiTime") {
        if (haveIUIDate === 0 || compareDate(iuiAdviceDTO[parm], nowDate)) {
          datas[parm] = timestring
          this.setState({
            [data]: datas,
          })
        } else {
          message.error("已经过了能修改的日期，不能再修改！")
        }
      }
      if (parm === "iuiAgainDate" || parm === "iuiAgainTime") {
        if (
          haveIUIDateAgain === 0 ||
          compareDate(iuiAdviceDTO[parm], nowDate)
        ) {
          datas[parm] = timestring
          this.setState({
            [data]: datas,
          })
        } else {
          message.error("已经过了能修改的日期，不能再修改！")
        }
      }
    }
  }
  // 判断拟行是否可选
  judgeType = (dataSorceTrs) => {
    let { nowDate } = this.state
    if (
      !dataSorceTrs.embryosTransplantDate ||
      !dataSorceTrs.blastocystTransplantDate
    ) {
      return true
    } else if (
      !dataSorceTrs.blastocystTransplantDate &&
      dataSorceTrs.embryosTransplantDate &&
      compareDate(dataSorceTrs.embryosTransplantDate, nowDate)
    ) {
      return true
    } else if (
      !dataSorceTrs.embryosTransplantDate &&
      dataSorceTrs.blastocystTransplantDate &&
      compareDate(dataSorceTrs.blastocystTransplantDate, nowDate)
    ) {
      return true
    } else {
      return false
    }
  }
  // 图标的控制
  iconControl = (record, index) => {
    let { dataSourceMedical } = this.state
    let data = null
    if (record.canDel) {
      data = (
        <Popover content={<p className="redColor">已拼针！</p>}>
          <svg className="icon_bm" aria-hidden="true">
            <use xlinkHref="#iconSpelltheneedle"></use>
          </svg>
        </Popover>
      )
    } else {
      if (record.delete) {
        data = (
          <Button
            style={{
              border: "1px dashed #59b4f4",
              background: "#def0fd",
              borderRadius: "2px",
              padding: "2px 4px",
              margin: "0",
              width: "98%",
            }}
            onClick={() => this.deleteLine(dataSourceMedical, index)}
          >
            <svg className="icon_svg" aria-hidden="true">
              <use xlinkHref="#iconjianhao"></use>
            </svg>
          </Button>
        )
      } else {
        data = record.isSpell ? (
          <svg className="icon_m hand" aria-hidden="true">
            <use
              xlinkHref="#icondoubt"
              onClick={() => this.showLaunchSpell(record)}
            ></use>
          </svg>
        ) : null
      }
    }
    return data
  }
  // 判断后面的图标是什么
  judgequick = (data) => {
    data.forEach((item, index) => {
      if (item.canSpell) {
        item.delete = false
        item.isSpell = true
        item.canDel = 0
      } else {
        item.canDel = 0
        item.delete = true
      }
    })
    return data
  }
  // 医嘱快速导入
  checkMedical = (data) => {
    let { dataSourceInspect, dataSourceMedical, dataSourceTreat } = this.state
    this.setState({
      dataSourceInspect: [
        ...this.judgequick(data.medicalAdviceCheckDTOS),
        ...dataSourceInspect,
      ],
      dataSourceMedical: [
        ...this.judgequick(data.medicationDTOS),
        ...dataSourceMedical,
      ],
      dataSourceTreat: [
        ...this.judgequick(data.comprehensiveTreatmentDTOS),
        ...dataSourceTreat,
      ],
      showQuick: false,
    })
  }
  // 预约返诊
  returnRevision = (data) => {
    let { dataSourceTreat } = this.state
    let { name } = this.props
    apis.MedicalAdvice.saveMedicalAdvice(
      name === CONST_ONE ? this.publicData() : this.publicDataDepar()
    ).then((res) => {
      if (res.code === 200) {
        data.addMedicalAdviceVO = res.data
        data.comprehensiveTreatmentDTOS = dataSourceTreat.slice(
          0,
          dataSourceTreat.length - 1
        )
        apis.MedicalAdvice.returnReservation(data).then((res) => {
          if (res.code === 200) {
            this.props.initPage && this.props.initPage()
            message.success("预约成功！")
          } else {
            message.error(res.message)
          }
        })
      } else {
        message.error(res.message)
      }
    })
  }
  // 改变普通下拉框的值
  setObjVal = (val, obj, param) => {
    obj[param] = val
    this.setState({
      obj,
    })
  }
  // 改变方案类型
  changePlan = (val) => {
    let { treatmentPlanDTO } = this.state
    treatmentPlanDTO.planCycleType = val[0]
    treatmentPlanDTO.planType = val[1]
    this.setState({
      treatmentPlanDTO,
    })
  }
  // 扳机的相关方法
  // 计算取卵时间
  getEndTime = (datasource, starttime, addTime) => {
    let { dataSorceTrigger, dataSorceTriggerluteal } = this.state
    let startDate = new Date(starttime)
    startDate = startDate.valueOf() //转换为毫秒数
    let addhours = Number(addTime * 60 * 60 * 1000)
    startDate = startDate + Number(addhours)
    startDate = new Date(startDate)
    var y = startDate.getFullYear()
    var m = startDate.getMonth() + 1
    var d = startDate.getDate()
    var hh = startDate.getHours()
    var mm = startDate.getMinutes()
    if (m <= 9) m = "0" + m
    if (d <= 9) d = "0" + d
    if (hh <= 9) hh = "0" + hh
    if (mm <= 9) mm = "0" + mm
    datasource.eggDate = y + "-" + m + "-" + d
    datasource.eggTime = hh + ":" + mm
    this.setState({
      dataSorceTrigger: { ...dataSorceTrigger },
      dataSorceTriggerluteal: { ...dataSorceTriggerluteal },
    })
  }
  // 改变下拉框的值
  changeSelect = (val, parm, nameParam) => {
    let { name } = this.props
    let {
      dataSorceTrigger,
      dataSorceTriggerluteal,
      dataSourceMedical,
    } = this.state
    if (nameParam === "tag") {
      this.selectSpe(val, parm)
    }
    parm[nameParam] = val
    this.setState({
      dataSorceTrigger: { ...dataSorceTrigger },
      dataSorceTriggerluteal: { ...dataSorceTriggerluteal },
      dataSourceMedical: dataSourceMedical,
    })
    if (name === CONST_ONE && parm.drugType) {
      calculationMargin(parm) //计算余量
    }
  }
  // 时长的改变
  changehours = (dataSorce, val) => {
    dataSorce.hours = val
    this.setState({
      dataSorce: dataSorce,
    })
    if (dataSorce.hours && dataSorce.triggerTime) {
      this.getEndTime(
        dataSorce,
        `${dataSorce.triggerDate} ${dataSorce.triggerTime}:00`,
        val
      )
    }
  }
  // 时间的改变(和取卵时间相关)
  changeTime = (dataSorce, time, timestring) => {
    let { dataSorceTrigger, dataSorceTriggerluteal } = this.state
    dataSorce.triggerTime = timestring
    if (dataSorce.hours && dataSorce.triggerTime) {
      this.getEndTime(
        dataSorce,
        `${dataSorce.triggerDate} ${timestring}:00`,
        dataSorce.hours
      )
    }
    this.setState({
      dataSorceTrigger: { ...dataSorceTrigger },
      dataSorceTriggerluteal: { ...dataSorceTriggerluteal },
    })
  }
  // 时间或者日期的改变
  changeDate = (dataSource, time, timestring, parm) => {
    let { dataSorceTrigger, dataSorceTriggerluteal } = this.state
    dataSource[parm] = timestring
    this.setState({
      dataSorceTrigger: { ...dataSorceTrigger },
      dataSorceTriggerluteal: { ...dataSorceTriggerluteal },
    })
  }
  //输入框取值
  setObjVal = async (val, obj, param, parm) => {
    if (param === "planType") {
      obj[param] = val[1]
      obj[parm] = val[0]
    } else {
      obj[param] = val
    }
    await this.setState({
      treatmentPlanDTO: { ...obj },
    })
  }
  render() {
    let { days } = this
    let {
      selectChecked,
      visibleDraw,
      showDraw,
      returnDate,
      doctor,
      visible,
      items,
      dataSourceMedical,
      dataSourceInspect,
      dataSourceTreat,
      dataSorceLutealMedication,
      dataSorceTrigger, //扳机
      dataSorceTriggerAgain, //补扳机
      dataSorceTriggerluteal, //黄体扳机
      dataSorceTriggerlutealAgain, //黄体补扳机
      dataSorceRecover, //复苏医嘱
      dataSorceTrs, //移植医嘱
      inspectOption,
      drugeOption,
      prescription,
      // showCorpus,
      showRecover,
      startNodes,
      nameDrug,
      typeDrug,
      dataSetMent,
      setMentTyle,
      cycleIUI, //是否为iui扳机
      iuiAdviceDTO,
      defaultselectType,
      embryoType,
      blastulaType,
      dateDescription,
      matter,
      returnClinicDTO,
      acceptSpell, //接受拼针弹框
      launchSpell, //发起拼针弹框
      sepllId,
      spellListUid, //拼针记录中的uid
      showQuick, //显示快速导入的侧边栏
      cycleType,
      showProgramme, //方案的显示与隐藏
      treatmentPlanDTO,
    } = this.state
    let { name } = this.props
    let { renderOptions, ontoptInfoList } = this.props.moredetail
    const columnsycle = [
      {
        title: "",
        width: "30px",
        dataIndex: "drugType",
        key: "drugType",
        render: (text, record, index) => {
          return (
            <Select
              style={{ width: "100%" }}
              value={record.drugType}
              onChange={(val) =>
                this.handleDrugType(val, record, "drugType", index)
              }
            >
              <Select.Option value={0}>非</Select.Option>
              <Select.Option value={1}>周</Select.Option>
              <Select.Option value={2}>扳</Select.Option>
              <Select.Option value={3}>黄</Select.Option>
            </Select>
          )
        },
      },
      {
        title: "药名",
        dataIndex: "drugName",
        key: "drugName",
        width: 150,
        render: (text, record, index) => {
          return (
            <>
              <AutoComplete
                dropdownMatchSelectWidth={340}
                allowClear
                options={
                  name === CONST_ONE && record.isSolvent
                    ? this.genSolventConfig()
                    : name === CONST_ONE && !record.isSolvent
                    ? record.drugeOption
                    : drugeOption
                }
                value={record.drugName}
                style={{ width: "49%" }}
                onChange={(value) => {
                  this.changeDrug(value, record, index)
                }}
                onSearch={(val) => this.selectedDrug(val, record)}
                onFocus={() => this.focusDrug(record)}
              />
              {name === CONST_ONE ? (
                <Select
                  dropdownMatchSelectWidth={100}
                  options={record.specificationOption}
                  style={{ width: "49%", marginLeft: "2%" }}
                  value={record.tag}
                  onFocus={() => {
                    this.selectSpecification(record)
                  }}
                  onChange={(val) => this.changeSelect(val, record, "tag")}
                />
              ) : null}
            </>
          )
        },
      },
      {
        title: "数量",
        dataIndex: "amount",
        key: "amount",
        width: 35,
        render: (text, record) => {
          return (
            <Input
              style={{ width: "100%" }}
              value={record.amount}
              onChange={(e) => {
                this.changeInput(e, record, "amount")
              }}
            />
          )
        },
      },
      {
        title: "用量",
        dataIndex: "dose",
        key: "dose",
        width: 65,
        render: (text, record) => {
          return (
            <Input
              style={{ width: "100%" }}
              value={record.dose}
              onChange={(e) => {
                this.changeInput(e, record, "dose")
              }}
            />
          )
        },
      },
      {
        title: "频次",
        dataIndex: "frequency",
        key: "frequency",
        width: 28,
        render: (text, record) => {
          return (
            <Select
              dropdownMatchSelectWidth={100}
              value={record.frequency}
              style={{ width: "100%" }}
              onChange={(val) => this.changeSelect(val, record, "frequency")}
            >
              {renderOptions(ontoptInfoList, "204")}
            </Select>
          )
        },
      },
      {
        title: "天数",
        dataIndex: "days",
        key: "days",
        width: 35,
        render: (text, record) => {
          return (
            <Input
              style={{ width: "100%" }}
              value={record.days}
              onChange={(e) => {
                this.changeInput(e, record, "days")
                this.returnDay(record)
              }}
            />
          )
        },
      },
      {
        title: "用法",
        dataIndex: "usage",
        key: "usage",
        width: 27,
        render: (text, record) => {
          return (
            <Select
              dropdownMatchSelectWidth={100}
              value={record.usage}
              style={{ width: "100%" }}
              onChange={(val) => this.changeSelect(val, record, "usage")}
            >
              {renderOptions(ontoptInfoList, "205")}
            </Select>
          )
        },
      },
      {
        title: "启用",
        dataIndex: "eatStatus",
        key: "eatStatus",
        width: 100,
        render: (text, record) => {
          return (
            <div>
              <Select
                dropdownMatchSelectWidth={130}
                style={{ width: "76%" }}
                value={record.eatStatus}
                onChange={(val) => {
                  this.changeSelect(val, record, "eatStatus")
                  this.computedDateFuc(val, parseInt(days) + 1, record)
                  this.returnDay(record)
                }}
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: "4px 0" }} />
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        padding: 8,
                      }}
                    >
                      <Input
                        style={{ flex: "auto" }}
                        onChange={this.onNameChange}
                      />
                      <a
                        style={{
                          flex: "none",
                          padding: "8px",
                          display: "block",
                          cursor: "pointer",
                        }}
                        onClick={this.addItem}
                      >
                        天后
                        <PlusOutlined />
                      </a>
                    </div>
                  </div>
                )}
              >
                {items.map((item, i) => (
                  <Option key={i} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
              <ReadDate
                style={{ width: "13%" }}
                allowClear={false}
                value={
                  record.eatDate
                    ? moment(record.eatDate, dateFormat)
                    : moment(new Date())
                }
              />
            </div>
          )
        },
      },
      {
        title: "余量",
        dataIndex: "remain",
        key: "remain",
        width: 65,
        render: (text, record) => {
          return <Input style={{ width: "100%" }} value={record.remain} />
        },
      },
      {
        title: "备注",
        dataIndex: "note",
        key: "note",
        width: 54,
        render: (text, record) => {
          return (
            <Input
              style={{ width: "100%" }}
              value={record.note}
              onChange={(e) => {
                this.changeInput(e, record, "note")
              }}
            />
          )
        },
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        width: 15,
        render: (text, record, index) => {
          return <>{this.iconControl(record, index)}</>
        },
      },
    ]
    const columns = [
      {
        title: "药名",
        dataIndex: "drugName",
        key: "drugName",
        width: 80,
        render: (text, record, index) => {
          return (
            <AutoComplete
              dropdownMatchSelectWidth={300}
              allowClear
              options={name === CONST_ONE ? record.drugeOption : drugeOption}
              value={record.drugName}
              style={{ width: "98%" }}
              onChange={(value) => {
                this.changeDrug(value, record, index)
              }}
              onSearch={(val) => this.selectedDrug(val, record)}
              onFocus={() => this.focusDrug(record)}
            />
          )
        },
      },
      {
        title: "用量",
        dataIndex: "dose",
        key: "dose",
        width: 64,
        render: (text, record) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.dose}
              onChange={(e) => {
                this.changeInput(e, record, "dose")
              }}
            />
          )
        },
      },
      {
        title: "频次",
        dataIndex: "frequency",
        key: "frequency",
        width: 42,
        render: (text, record) => {
          return (
            <Select
              dropdownMatchSelectWidth={100}
              value={record.frequency}
              style={{ width: "98%" }}
              onChange={(val) => this.changeSelect(val, record, "frequency")}
            >
              {renderOptions(ontoptInfoList, "204")}
            </Select>
          )
        },
      },
      {
        title: "天数",
        dataIndex: "days",
        key: "days",
        width: 28,
        render: (text, record) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.days}
              onChange={(e) => {
                this.changeInput(e, record, "days")
                this.returnDay(record)
              }}
            />
          )
        },
      },
      {
        title: "用法",
        dataIndex: "usage",
        key: "usage",
        width: 64,
        render: (text, record) => {
          return (
            <Select
              dropdownMatchSelectWidth={100}
              value={record.usage}
              style={{ width: "98%" }}
              onChange={(val) => this.changeSelect(val, record, "usage")}
            >
              {renderOptions(ontoptInfoList, "205")}
            </Select>
          )
        },
      },
      {
        title: "启用",
        dataIndex: "eatStatus",
        key: "eatStatus",
        width: 93,
        render: (text, record) => {
          return (
            <div>
              <Select
                dropdownMatchSelectWidth={130}
                style={{ width: "76%" }}
                value={record.eatStatus}
                onChange={(val) => {
                  this.changeSelect(val, record, "eatStatus")
                  this.computedDateFuc(val, parseInt(days) + 1, record)
                  this.returnDay(record)
                }}
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: "4px 0" }} />
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        padding: 8,
                      }}
                    >
                      <Input
                        style={{ flex: "auto" }}
                        onChange={this.onNameChange}
                      />
                      <a
                        style={{
                          flex: "none",
                          padding: "8px",
                          display: "block",
                          cursor: "pointer",
                        }}
                        onClick={this.addItem}
                      >
                        天后
                        <PlusOutlined />
                      </a>
                    </div>
                  </div>
                )}
              >
                {items.map((item, i) => (
                  <Option key={i} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
              <ReadDate
                style={{ width: "13%" }}
                allowClear={false}
                value={
                  record.eatDate
                    ? moment(record.eatDate, dateFormat)
                    : moment(new Date())
                }
              />
            </div>
          )
        },
      },
      {
        title: "备注",
        dataIndex: "note",
        key: "note",
        width: 50,
        render: (text, record) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.note}
              onChange={(e) => {
                this.changeInput(e, record, "note")
              }}
            />
          )
        },
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        width: 20,
        render: (text, record, index) => {
          return (
            <Button
              style={{
                border: "1px dashed #59b4f4",
                background: "#def0fd",
                borderRadius: "2px",
                padding: "2px 4px",
                margin: "0",
                width: "98%",
              }}
              onClick={() => this.deleteLine(dataSourceMedical, index)}
            >
              {record.delete ? (
                <svg className="icon_svg" aria-hidden="true">
                  <use xlinkHref="#iconjianhao"></use>
                </svg>
              ) : null}
            </Button>
          )
        },
      },
    ]
    const columnsInspect = [
      {
        title: "检查项目",
        dataIndex: "inspectionItem",
        key: "inspectionItem",
        width: 150,
        verticalAlign: "left",
        render: (text, record, index) => {
          return (
            <AutoComplete
              dropdownMatchSelectWidth={350}
              allowClear
              options={inspectOption}
              value={record.inspectionItem}
              style={{ width: "90%" }}
              onChange={(val) => this.changeInspect(val, record, index)}
              onFocus={() => this.focusInspect(record)}
            />
          )
        },
      },
      {
        title: "嘱托",
        dataIndex: "entrustment",
        key: "entrustment",
        width: 200,
        render: (text, record) => {
          return (
            <Input
              value={record.entrustment}
              onChange={(e) => {
                this.changeInput(e, record, "entrustment")
              }}
            />
          )
        },
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        width: 50,
        render: (text, record, index) => {
          return (
            <Button
              style={{
                border: "1px dashed #59b4f4",
                background: "#def0fd",
                borderRadius: "2px",
                padding: "2px 4px",
              }}
              onClick={() => this.deleteLine(dataSourceInspect, index)}
            >
              {record.delete ? (
                <svg className="icon_svg" aria-hidden="true">
                  <use xlinkHref="#iconjianhao"></use>
                </svg>
              ) : null}
            </Button>
          )
        },
      },
    ]
    const columnsTreat = [
      {
        title: "综合",
        dataIndex: "treatmentProject",
        key: "treatmentProject",
        width: 150,
        verticalAlign: "left",
        render: (text, record, index) => {
          return (
            <AutoComplete
              dropdownMatchSelectWidth={150}
              allowClear
              value={record.treatmentProject}
              style={{ width: "98%" }}
              onChange={(val) => this.notChangeTreat(val, record, index)}
            >
              {name === CONST_ONE ? (
                <>{renderOptions(ontoptInfoList, "210")}</>
              ) : (
                <>{renderOptions(ontoptInfoList, "62")}</>
              )}
            </AutoComplete>
          )
        },
      },
      {
        title: "说明",
        dataIndex: "note",
        key: "note",
        width: 200,
        render: (text, record) => {
          return (
            <Input
              value={record.note}
              onChange={(e) => {
                this.changeInput(e, record, "note")
              }}
            />
          )
        },
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        width: 50,
        render: (text, record, index) => {
          return (
            <Button
              style={{
                border: "1px dashed #59b4f4",
                background: "#def0fd",
                borderRadius: "2px",
                padding: "2px 4px",
              }}
              onClick={() => this.deleteLine(dataSourceTreat, index)}
            >
              {record.delete ? (
                <svg className="icon_svg" aria-hidden="true">
                  <use xlinkHref="#iconjianhao"></use>
                </svg>
              ) : null}
            </Button>
          )
        },
      },
    ]
    const defaultType = !embryoType || !blastulaType ? false : true
    const patientName =
      localStorage.getItem("typeVal") === "男科"
        ? JSON.parse(localStorage.getItem("patientCard")).malePatientName
        : JSON.parse(localStorage.getItem("patientCard")).femalePatientName
    return (
      <>
        <div>
          {name === CONST_ONE ? (
            <Radio.Group
              defaultValue={selectChecked}
              value={selectChecked}
              buttonStyle="solid"
              onChange={this.changeButton}
              size="small"
            >
              <Radio.Button value={0} className="marginFive">
                医嘱
              </Radio.Button>
              <Radio.Button value={2} className="marginFive">
                黄体用药
              </Radio.Button>
              <Radio.Button value={3} className="marginFive">
                治疗单打印
              </Radio.Button>
            </Radio.Group>
          ) : (
            <div>
              {prescription.patientName ? (
                <Prescription prescription={prescription} />
              ) : null}
            </div>
          )}
          <div className="titleCountBetween">
            {name === CONST_ONE ? (
              <div>
                {startNodes.map((item, index) => (
                  <span key={index}>{item.nodeName},</span>
                ))}
              </div>
            ) : (
              <div></div>
            )}
            <div className="buttonsRight">
              <Button
                type="primary"
                style={{ marginRight: "10px" }}
                onClick={() => {
                  this.setState({
                    showQuick: true,
                  })
                }}
                size="small"
              >
                导入
              </Button>
              <Button
                style={{ marginRight: "10px" }}
                type="primary"
                size="small"
                onClick={() =>
                  this.setState({
                    visibleDraw: true,
                  })
                }
              >
                套餐
              </Button>
              {name === CONST_ONE ? (
                <Button
                  type="primary"
                  onClick={() => this.medicalSave()}
                  size="small"
                >
                  添加
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => this.addData()}
                  size="small"
                >
                  添加
                </Button>
              )}
            </div>
          </div>
          <div>
            <div className="marginCountDiv">
              <TableSchedule
                columns={name === CONST_ONE ? columnsycle : columns}
                dataSource={dataSourceMedical}
                pagination={false}
              />
            </div>
            <div className="marginCountDiv">
              <TableSchedule
                columns={columnsInspect}
                dataSource={dataSourceInspect}
                pagination={false}
              />
            </div>
            <div className="marginCountDiv">
              <TableSchedule
                columns={columnsTreat}
                dataSource={dataSourceTreat}
                pagination={false}
              />
            </div>
            {name === CONST_ONE ? (
              <>
                {dataSorceTrigger.triggerDrugs &&
                dataSorceTrigger.triggerDrugs.length > 0 ? (
                  <Trigger
                    title="扳机"
                    cycleIUI={cycleIUI}
                    ontoptInfoList={ontoptInfoList}
                    dataSorceTrigger={dataSorceTrigger}
                    dataSorceTriggerAgain={dataSorceTriggerAgain}
                    cycleType={cycleType}
                    getEndTime={(starttime, addTime) =>
                      this.getEndTime(dataSorceTrigger, starttime, addTime)
                    }
                    changeSelect={(val, parm, name) =>
                      this.changeSelect(val, parm, name)
                    }
                    changehours={(val) =>
                      this.changehours(dataSorceTrigger, val)
                    }
                    changeTime={(time, timestring) =>
                      this.changeTime(dataSorceTrigger, time, timestring)
                    }
                    changeDate={(time, timestring, parm) =>
                      this.changeDate(
                        dataSorceTriggerAgain,
                        time,
                        timestring,
                        parm
                      )
                    }
                  />
                ) : null}

                {cycleIUI ? (
                  <>
                    <div className="divBottom">
                      <div id="triggerDiv">
                        <div className="triggerRight">
                          <div className="divFlex">
                            <div className="divItem">
                              手术日：
                              <DatePicker
                                disabledDate={disabledDate}
                                value={
                                  iuiAdviceDTO.iuiDate
                                    ? moment(iuiAdviceDTO.iuiDate, "YYYY-MM-DD")
                                    : ""
                                }
                                onChange={(time, timestring) =>
                                  this.changeOperationTime(
                                    time,
                                    timestring,
                                    iuiAdviceDTO,
                                    "iuiDate"
                                  )
                                }
                              />
                            </div>
                            <div className="marginDiv divItem">
                              手术时间：
                              <TimePicker
                                value={
                                  iuiAdviceDTO.iuiTime
                                    ? moment(iuiAdviceDTO.iuiTime, format)
                                    : ""
                                }
                                format={format}
                                onChange={(time, timestring) =>
                                  this.changeOperationTime(
                                    time,
                                    timestring,
                                    iuiAdviceDTO,
                                    "iuiTime"
                                  )
                                }
                              />
                            </div>
                            <div className="marginDiv divItem">
                              再次手术日：
                              <DatePicker
                                disabledDate={disabledDate}
                                value={
                                  iuiAdviceDTO.iuiAgainDate
                                    ? moment(
                                        iuiAdviceDTO.iuiAgainDate,
                                        "YYYY-MM-DD"
                                      )
                                    : ""
                                }
                                onChange={(time, timestring) =>
                                  this.changeOperationTime(
                                    time,
                                    timestring,
                                    iuiAdviceDTO,
                                    "iuiAgainDate"
                                  )
                                }
                              />
                            </div>
                            <div className="divItem">
                              再次手术时间：
                              <TimePicker
                                value={
                                  iuiAdviceDTO.iuiAgainTime
                                    ? moment(iuiAdviceDTO.iuiAgainTime, format)
                                    : ""
                                }
                                format={format}
                                onChange={(time, timestring) =>
                                  this.changeOperationTime(
                                    time,
                                    timestring,
                                    iuiAdviceDTO,
                                    "iuiAgainTime"
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="divFlex">
                            <div
                              className="marginDiv divItem"
                              style={{ width: "50%" }}
                            >
                              计划：
                              <Select
                                style={{ width: "86%" }}
                                value={iuiAdviceDTO.plan}
                                onChange={(val) =>
                                  this.changeSelect(val, iuiAdviceDTO, "plan")
                                }
                              >
                                {renderOptions(ontoptInfoList, "52")}
                              </Select>
                            </div>
                            <div className="divItem" style={{ width: "50%" }}>
                              提示：
                              <Select
                                style={{ width: "86%" }}
                                value={iuiAdviceDTO.specialNote}
                                onChange={(val) =>
                                  this.changeSelect(
                                    val,
                                    iuiAdviceDTO,
                                    "specialNote"
                                  )
                                }
                              >
                                {renderOptions(ontoptInfoList, "232")}
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="divBottom">
                      <div id="triggerDiv">
                        <div className="triggerLeft">
                          <p className="leftTitle">IUI医嘱</p>
                        </div>
                        <div className="triggerRight">
                          <div className="divFlex">
                            <div className="divItem" style={{ width: "20%" }}>
                              授精：
                              <Switch
                                checked={iuiAdviceDTO.inseminateTag}
                                onChange={(val) =>
                                  this.changeSelect(
                                    val ? 1 : 0,
                                    iuiAdviceDTO,
                                    "inseminateTag"
                                  )
                                }
                              />
                            </div>
                            {!iuiAdviceDTO.inseminateTag && (
                              <>
                                <div className="marginDiv divItem">
                                  取消原因：
                                  <Input
                                    style={{ width: "70%" }}
                                    value={iuiAdviceDTO.cancelReason}
                                    onChange={(e) =>
                                      this.changeSelect(
                                        e.target.value,
                                        iuiAdviceDTO,
                                        "cancelReason"
                                      )
                                    }
                                  />
                                </div>
                                <div className="marginDiv divItem">
                                  取消日期：
                                  <DatePicker
                                    disabledDate={disabledDate}
                                    value={
                                      iuiAdviceDTO.cancelDate
                                        ? moment(iuiAdviceDTO.cancelDate)
                                        : ""
                                    }
                                    onChange={(time, timestring) =>
                                      this.changeOperationTime(
                                        time,
                                        timestring,
                                        iuiAdviceDTO,
                                        "cancelDate"
                                      )
                                    }
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
                {cycleType === "IVF" ? (
                  <>
                    {dataSorceTriggerluteal.triggerDrugs &&
                    dataSorceTriggerluteal.triggerDrugs.length > 0 ? (
                      <Trigger
                        title="黄体扳机"
                        cycleIUI={cycleIUI}
                        ontoptInfoList={ontoptInfoList}
                        dataSorceTrigger={dataSorceTriggerluteal}
                        dataSorceTriggerAgain={dataSorceTriggerlutealAgain}
                        cycleType={cycleType}
                        getEndTime={(starttime, addTime) =>
                          this.getEndTime(
                            dataSorceTriggerluteal,
                            starttime,
                            addTime
                          )
                        }
                        changeSelect={(val, parm, name) =>
                          this.changeSelect(val, parm, name)
                        }
                        changehours={(val) =>
                          this.changehours(dataSorceTriggerluteal, val)
                        }
                        changeTime={(time, timestring) =>
                          this.changeTime(
                            dataSorceTriggerluteal,
                            time,
                            timestring
                          )
                        }
                        changeDate={(time, timestring, parm) =>
                          this.changeDate(
                            dataSorceTriggerlutealAgain,
                            time,
                            timestring,
                            parm
                          )
                        }
                      />
                    ) : null}
                  </>
                ) : null}
                {dataSorceRecover.thawType || showRecover ? (
                  <Recover
                    dataSorceRecover={dataSorceRecover}
                    changeSelect={(val, trs, type) =>
                      this.changeSelect(val, trs, type)
                    }
                    changeDate={(date, datestring, trs, cancelTransplant) =>
                      this.changeDates(date, datestring, trs, cancelTransplant)
                    }
                    returnEt={this.returnEt}
                  />
                ) : null}
                {!cycleIUI && (
                  <TransPlant
                    defaultselectType={defaultselectType}
                    dataSorceTrs={dataSorceTrs}
                    embryoType={embryoType}
                    defaultType={defaultType}
                    blastulaType={blastulaType}
                    changeSelect={(val, trs, type) =>
                      this.changeSelect(val, trs, type)
                    }
                    changeDate={(date, datestring, trs, cancelTransplant) =>
                      this.changeDates(date, datestring, trs, cancelTransplant)
                    }
                    changeInput={(e, trs, cancel) =>
                      this.changeInput(e, trs, cancel)
                    }
                    returnEt={this.returnEt}
                  />
                )}
              </>
            ) : null}
          </div>
          {/* 方案的添加 */}
          {showProgramme && (
            <>
              <div id="triggerDiv">
                <div className="triggerLeft">
                  <p className="leftTitle">方案</p>
                </div>
                <div className="triggerRight">
                  <Regimen
                    dataList={treatmentPlanDTO}
                    dataSourceTreat={dataSourceTreat}
                    selectOption={ontoptInfoList}
                    setObjVal={(val, obj, param, parm) =>
                      this.setObjVal(val, treatmentPlanDTO, param, parm)
                    }
                  />
                </div>
              </div>
            </>
          )}
          {/* 返诊信息 */}
          <div id="triggerDiv">
            <div className="triggerLeft">
              <p className="leftTitle">返诊</p>
            </div>
            <div className="triggerRight">
              <div className="divFlex">
                <div className="marginDiv divItem">
                  <Select
                    style={{ with: "35%", marginRight: "0px" }}
                    value={dateDescription}
                    options={optionSelect}
                    dropdownMatchSelectWidth={130}
                    onChange={(val) =>
                      this.setState({
                        dateDescription: val,
                      })
                    }
                  />
                  {dateDescription === "日期" ? (
                    <DatePicker
                      style={{ width: "60%" }}
                      disabledDate={disabledDate}
                      value={returnDate ? moment(returnDate) : ""}
                      onChange={(data, dataString) =>
                        this.setState({
                          returnDate: dataString,
                        })
                      }
                    />
                  ) : null}
                </div>
                <div className="marginDiv divItem">
                  事项：
                  <Select
                    mode="tags"
                    style={{ width: name === CONST_ONE ? "85%" : "70%" }}
                    options={matterOptions}
                    value={matter}
                    dropdownMatchSelectWidth={300}
                    allowClear
                    onChange={(val) => {
                      this.setState({
                        matter: val,
                      })
                    }}
                  />
                </div>
                <Popover
                  placement="left"
                  content={
                    <DeterMineDate
                      data={{
                        sex: localStorage.getItem("sex"),
                        patientName: patientName,
                        returnDate,
                        dateDescription,
                        matter: matter.length > 0 ? matter.join(",") : "",
                        doctor,
                        reservationType: returnClinicDTO.reservationType,
                        reservationProject: returnClinicDTO.reservationProject,
                        reservationGroup: returnClinicDTO.reservationGroup,
                        place: returnClinicDTO.place,
                      }}
                      returnRevision={(data) => {
                        this.returnRevision(data)
                      }}
                      medicalSave={(data) => this.medicalSave(data)}
                      addData={(data) => this.addData(data)}
                      name="medicalReturn"
                      type={name}
                    />
                  }
                  trigger="click"
                >
                  <div style={{ cursor: "pointer" }}>
                    <svg aria-hidden="true" className="icon_base_chu">
                      <use xlinkHref="#iconicon_yuyue"></use>
                    </svg>
                  </div>
                </Popover>
              </div>
              <div className="divFlex">
                <div className="marginDiv divItem">
                  医生：
                  <Select
                    style={{ width: "130px" }}
                    defaultValue={doctor}
                    value={doctor}
                    onChange={(val) => {
                      this.setState({
                        doctor: val,
                      })
                    }}
                  >
                    {renderOptions(ontoptInfoList, "278")}
                  </Select>
                </div>
              </div>
            </div>
          </div>
          {name === CONST_ONE ? (
            <div style={{ width: "100%" }}>
              <Row type="flex" align="middle" justify="center">
                <Button
                  type="primary"
                  onClick={() => this.medicalSave()}
                  size="small"
                >
                  保存
                </Button>
              </Row>
            </div>
          ) : null}
          {/* 降调节弹框 */}
          {visible ? (
            <NormalModal
              visible={visible}
              centered
              closable={false}
              title="降调节"
              onOk={this.handleOkNode}
              onCancel={this.handleCancel}
            >
              <div className="modalDivFrame">
                {nameDrug}为{typeDrug}用药，是否启动{typeDrug}?
              </div>
            </NormalModal>
          ) : null}
          {/* 套餐 */}
          <NormalModal
            visible={visibleDraw}
            onOk={this.handleOk}
            width="820px"
            height="350px"
            title="套餐"
            onCancel={() =>
              this.setState({
                visibleDraw: false,
              })
            }
            destroyOnClose
          >
            <SetMeal
              name={name}
              dataSetMent={dataSetMent}
              setMentTyle={setMentTyle}
              visibleDraw={visibleDraw}
              // drugeOption={drugeOption}
              inspectOption={inspectOption}
            />
          </NormalModal>
          {/* 侧边栏 */}
          <Drawer
            visible={showDraw}
            closable={false}
            width="700px"
            onClose={() => {
              this.setState({
                showDraw: false,
                selectChecked: 0,
              })
            }}
          >
            {selectChecked === CONST_TWO ? (
              <Corpus dataSorceLutealMedication={dataSorceLutealMedication} />
            ) : selectChecked === CONST_THREE ? (
              <TreatListDay dataSourceTreatmentSheet={prescription} />
            ) : null}
          </Drawer>
          {/* 发起拼针弹框 */}
          {launchSpell ? (
            <NormalModal
              visible={launchSpell}
              centered
              closable={false}
              title="发起拼针"
              onOk={this.OkLanchSpell}
              onCancel={() => {
                this.changeSpellIcon(0)
                this.setState({
                  launchSpell: false,
                })
              }}
            >
              <div className="modalDivFrame">
                <p className="redColor">选择后不可更改，请谨慎选择！</p>
                <p>是否发起拼针？</p>
              </div>
            </NormalModal>
          ) : null}
          {/* 接受拼针弹框 */}
          {acceptSpell ? (
            <NormalModal
              visible={acceptSpell}
              width="700px"
              height="350px"
              centered
              closable={false}
              title={
                <div>
                  接受拼针
                  <span className="redColor marginSpan">
                    选择后不可更改，请谨慎选择！
                  </span>
                </div>
              }
              onOk={this.okAcceptSpell}
              onCancel={() => {
                this.changeSpellIcon(0)
                this.setState({
                  acceptSpell: false,
                })
              }}
            >
              <SpellsList id={sepllId} spellListUid={spellListUid} />
            </NormalModal>
          ) : null}
          {/* 快速导入的侧边栏 */}
          <Drawer
            visible={showQuick}
            closable={false}
            width="700px"
            onClose={() => {
              this.setState({
                showQuick: false,
              })
            }}
          >
            <QuickAdvice
              medicalChecked={(data) => this.checkMedical(data)}
              stageType={name}
            />
          </Drawer>
        </div>
      </>
    )
  }
}
