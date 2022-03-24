/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { observable } from "mobx"
import {
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  TimePicker,
  message,
  AutoComplete,
  InputNumber,
  Switch,
  Divider,
} from "antd"
import {
  PlusOutlined,
  MinusOutlined,
  EditFilled,
  CheckOutlined,
} from "@ant-design/icons"
import { DateTitleView } from "@/app/components/normal/Title"
import PanelTag from "@/app/components/normal/PanelTag"
import { FontInput } from "@/app/components/base/baseFontInput"
import { ThreeItem, FlexItem } from "@/app/components/base/baseForms.js"
import { BaseTable } from "@/app/components/base/baseTable"
import { DashBtn } from "@/app/components/base/baseBtn"
import {
  dateFormat,
  dateFormatDate,
  todayString,
  todayTime,
} from "@/app/utils/const.js"
import { checkArrisEmpty, renderOptions } from "@/app/utils/tool.js"
import moment from "moment"
import apis from "@/app/utils/apis"
import styled from "styled-components"
import { handleDefault } from "@/app/utils/tool.js"
import { defaultData } from "./defaultData"
import "./index.scss"

const { Option } = Select

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
      ovumRecord: true, //取卵手术记录，获卵记录标记
      oprationRecord: props.oprationRecord,
      bindData: {}, //模板数据
      initSelect: [], //下拉框值
      medicationFlag: false,
      selecteDrugArry: [], //用药初始化
      drugeOption: [], // 用药下拉框数据
      ontoptInfoList: [], //下拉框的数据
      items: ["当日", "次日", "再次日"],
      eggHarvestRecordParams: [
        {
          serialNumber: 1,
          position: "",
          character: "",
          volume: "",
          flush: "",
          largeFollicleNumber: null,
          midFollicleNumber: null,
          smallFollicleNumber: null,
          follicleSize: "",
          eggNumber: null,
          recordNote: "",
        },
      ], //获卵记录的值
      eggRetrievalOperationSingPrams: [], //体征
      eggRetrievalOperationNarcoticParams: [], //麻醉
      eggRetrievalOperationMedicationParams: [
        {
          drugName: null,
          dose: null,
          frequency: null,
          days: null,
          usage: null,
          eatStatus: null,
          eatDate: null,
          note: null,
          eggMedicationPractitioner: null,
        },
      ], //用药
      ovarianFeedParams: [], //卵巢
    }
  }
  componentDidMount = () => {
    let { select_one } = this.props.store
    let { configMedicalAdvice } = this.props.moredetail
    configMedicalAdvice(select_one) //初始化用药配置
    this.props.onRef && this.props.onRef(this)
    this.initArrData()
    this.getInitData()
    this.initOvumSelect()
    this.selectDrug() //模糊查询用药
  }
  //初始化下拉框的值
  initOvumSelect = () => {
    apis.Patients_surgery.initSelectovum().then((res) => {
      this.setState({
        initSelect: res.data,
      })
    })
  }
  //初始化数组对象数据
  initArrData = async () => {
    await this.setState({
      eggHarvestRecordParams: [
        {
          serialNumber: 1,
          position: "",
          character: "",
          volume: "",
          flush: "",
          largeFollicleNumber: null,
          midFollicleNumber: null,
          smallFollicleNumber: null,
          follicleSize: "",
          eggNumber: null,
          recordNote: "",
        },
      ], //获卵记录的值
      eggRetrievalOperationSingPrams: [
        {
          operation: "术前",
          t: null,
          p: null,
          r: null,
          bpMin: null,
          bpMax: null,
        },
      ], //体征
      eggRetrievalOperationNarcoticParams: [
        {
          method: "静脉麻醉",
          drugs: null,
          dose: null,
          injectionMethod: null,
          anaesthetist: null,
        },
      ], //麻醉
      ovarianFeedParams: [
        {
          side: "左侧",
          sideNeedleTimes: null,
          follicleNumber: null,
          sideOvumNumber: null,
          cystsNumber: null,
          ovaryDifficulty: null,
        },
        {
          side: "右侧",
          sideNeedleTimes: null,
          follicleNumber: null,
          sideOvumNumber: null,
          cystsNumber: null,
          ovaryDifficulty: null,
        },
      ], //卵巢
      eggRetrievalOperationMedicationParams: [
        {
          drugName: null,
          dose: null,
          frequency: null,
          days: null,
          usage: null,
          eatStatus: null,
          eatDate: null,
          note: null,
          eggMedicationPractitioner: null,
        },
      ], //用药
    })
  }
  //初始化空数据
  initCheckData = (resData, initData) => {
    let data = !checkArrisEmpty(resData) ? resData : initData
    return data
  }
  //初始化取卵手术
  getInitData = (val) => {
    let {
      oprationRecord,
      eggHarvestRecordParams,
      eggRetrievalOperationSingPrams,
      eggRetrievalOperationNarcoticParams,
      eggRetrievalOperationMedicationParams,
    } = this.state
    let { select_one } = this.props.store
    //第几个手术
    let record = null
    if (val) {
      record = val.charAt(val.length - 1) //取手术记录次数
    } else {
      record = oprationRecord.charAt(oprationRecord.length - 1) //取手术记录次数
    }
    apis.Patients_surgery.initSurgeryovum(select_one).then((res) => {
      //手术赋值
      if (!checkArrisEmpty(res.data) && res.data.length > record - 1) {
        let ovumRecordData = handleDefault(res.data[record - 1], defaultData)
        this.setState({
          bindData: ovumRecordData,
          eggHarvestRecordParams: this.initCheckData(
            ovumRecordData.eggHarvestRecordParams,
            eggHarvestRecordParams
          ),
          //体征
          eggRetrievalOperationSingPrams: this.initCheckData(
            ovumRecordData.eggRetrievalOperationSingPrams,
            eggRetrievalOperationSingPrams
          ),
          //麻醉
          eggRetrievalOperationNarcoticParams: this.initCheckData(
            ovumRecordData.eggRetrievalOperationNarcoticParams,
            eggRetrievalOperationNarcoticParams
          ),
          //用药
          eggRetrievalOperationMedicationParams: this.initCheckData(
            ovumRecordData.eggRetrievalOperationMedicationParams,
            eggRetrievalOperationMedicationParams
          ),
          ovarianFeedParams: ovumRecordData.ovarianFeedParams, //卵巢
        })
      } else {
        //初始化添加数据
        this.setState({
          bindData: {
            ...defaultData,
            date: todayString,
            startTime: moment().format("LT"),
            endTime: moment().format("LT"),
          },
        })
      }
    })
  }
  //onChange事件
  setInheritVal = (val, param) => {
    let { bindData } = this.state
    let newTestData = Object.assign(bindData, { [param]: val })
    this.setState({
      bindData: newTestData,
    })
  }
  //获卵记录change
  setOvumRecord = (val, param, cindex) => {
    let { eggHarvestRecordParams } = this.state
    let arr = eggHarvestRecordParams
    arr.forEach((item, index) => {
      if (index === cindex) {
        item[param] = val
      }
    })
    this.setState({
      eggHarvestRecordParams: [...arr],
    })
  }
  //卵子个数
  setEggNumber = (val, param, record, cindex) => {
    let { eggHarvestRecordParams } = this.state
    let arr = eggHarvestRecordParams
    let num =
      record.largeFollicleNumber +
      record.midFollicleNumber +
      record.smallFollicleNumber
    if (val > num) {
      message.destroy()
      message.error("数据错误")
    } else {
      arr[cindex][param] = val
      this.setState({
        eggHarvestRecordParams: [...arr],
      })
    }
  }
  //增一行获卵记录
  addRow = (serialNumber, position, index) => {
    let { eggHarvestRecordParams } = this.state
    let arr = eggHarvestRecordParams
    const rowsData = {
      uid: null,
      serialNumber: serialNumber + 1,
      position: position,
      character: "",
      volume: "",
      flush: "",
      largeFollicleNumber: null,
      midFollicleNumber: null,
      smallFollicleNumber: null,
      follicleSize: "",
      eggNumber: null,
      recordNote: "",
    }
    if (eggHarvestRecordParams.length - 1 === index) {
      arr.push(rowsData)
      this.setState({
        eggHarvestRecordParams: [...arr],
      })
    }
  }
  //麻醉方式加
  addNarcotic = () => {
    let { eggRetrievalOperationNarcoticParams } = this.state
    let NarcoticParams = eggRetrievalOperationNarcoticParams
    NarcoticParams.push({
      method: "静脉麻醉",
      drugs: null,
      dose: null,
      injectionMethod: null,
      anaesthetist: null,
    })
    this.setState({
      eggRetrievalOperationNarcoticParams: NarcoticParams,
    })
  }
  //体征加
  addSurgery = () => {
    let { eggRetrievalOperationSingPrams } = this.state
    let surgery = eggRetrievalOperationSingPrams
    if (eggRetrievalOperationSingPrams.length === 3) {
      message.destroy()
      message.error("不允许再添加")
      return
    }
    surgery.push({
      operation: null,
      t: null,
      p: null,
      r: null,
      bpMin: null,
      bpMax: null,
    })
    this.setState({
      eggRetrievalOperationSingPrams: surgery,
    })
  }
  //麻醉方式,体征方式,卵巢数据变化
  setParams = async (value, param, index, data) => {
    let arr = data
    arr.map((item, itemIndex) => {
      if (itemIndex === index) {
        item[param] = value
      }
      return item
    })
    await this.setState({
      [data]: [...arr],
    })
  }
  //麻醉方式减,体征减
  deleteParams = (index, data) => {
    let arr = data
    arr.splice(index, 1)
    this.setState({
      [data]: arr,
    })
  }
  // 选择药名
  setDrugChange = (val, record, index) => {
    record.drugName = val.split(", ")[0]
    record.dose = val.split(", ")[2]
    record.frequency = val.split(", ")[3]
    record.days = val.split(", ")[4]
    record.usage = val.split(", ")[5]
    record.eatStatus = val.split(", ")[6]
    this.addRowMedication(index)
  }
  addRowMedication = async (index) => {
    let { eggRetrievalOperationMedicationParams } = this.state
    let arr = eggRetrievalOperationMedicationParams
    // 添加新的一行
    if (index === eggRetrievalOperationMedicationParams.length - 1) {
      arr.push({
        drugName: null,
        dose: null,
        frequency: null,
        days: null,
        usage: null,
        eatStatus: null,
        eatDate: null,
        note: null,
        eggMedicationPractitioner: null,
      })
    }
    await this.setState({
      eggRetrievalOperationMedicationParams: [...arr],
    })
  }
  //用药修改
  setMedication = async (value, param, index) => {
    let { eggRetrievalOperationMedicationParams } = this.state
    let arr = eggRetrievalOperationMedicationParams
    arr.map((item, itemIndex) => {
      if (itemIndex === index) {
        item[param] = value
      }
      return item
    })
    await this.setState({
      eggRetrievalOperationMedicationParams: [...arr],
    })
  }
  //用药删除
  deleteMedication = (index) => {
    let { eggRetrievalOperationMedicationParams } = this.state
    let arr = eggRetrievalOperationMedicationParams
    arr.splice(index, 1)
    this.setState({
      eggRetrievalOperationMedicationParams: [...arr],
    })
  }
  // 用药模糊查询
  selectDrug = () => {
    apis.MedicalAdvice.selectdrug().then((res) => {
      this.setState({
        selecteDrugArry: res.data,
      })
    })
  }
  // 转化为下拉框options
  conversionOptions = () => {
    let { drugeOption, selecteDrugArry } = this.state
    drugeOption = []
    selecteDrugArry.forEach((item, index) => {
      drugeOption.push({
        value:
          item.drugName +
          ", " +
          item.tag +
          ", " +
          item.dose +
          ", " +
          item.frequency +
          ", " +
          item.days +
          ", " +
          item.usage +
          ", " +
          item.startDay,
        text:
          item.drugName +
          ", " +
          item.tag +
          ", " +
          item.dose +
          ", " +
          item.frequency +
          ", " +
          item.days +
          ", " +
          item.usage +
          ", " +
          item.startDay,
        key: index,
      })
    })
    this.setState({
      drugeOption: [...drugeOption],
    })
  }
  //计算具体日期
  computedDateFuc = (val, afterDays, record) => {
    if (val === "当日") {
      record.eatDate = moment(new Date()).format("YYYY-MM-DD")
    } else if (val === "次日") {
      record.eatDate = moment(new Date())
        .subtract(-1, "days")
        .format("YYYY-MM-DD")
    } else if (val === "再次日") {
      record.eatDate = moment(new Date())
        .subtract(-2, "days")
        .format("YYYY-MM-DD")
    } else {
      record.eatDate = moment(new Date())
        .subtract(-afterDays, "days")
        .format("YYYY-MM-DD")
    }
  }
  //days的改变
  onNameChange = (e) => {
    this.days = e.target.value
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
      })
    }
  }
  //新增取卵手术
  save = () => {
    let {
      bindData,
      eggHarvestRecordParams,
      eggRetrievalOperationSingPrams,
      eggRetrievalOperationNarcoticParams,
      eggRetrievalOperationMedicationParams,
      ovarianFeedParams,
    } = this.state
    let { select_one } = this.props.store
    let params = {
      ...bindData,
      patientParam: select_one,
      eggHarvestRecordParams,
      eggRetrievalOperationSingPrams,
      eggRetrievalOperationNarcoticParams,
      eggRetrievalOperationMedicationParams: eggRetrievalOperationMedicationParams.filter(
        (item) => {
          return item.drugName
        }
      ),
      ovarianFeedParams,
    }
    let flag = params.uid ? true : false
    apis.Patients_surgery.addSurgeryovum(params).then((res) => {
      if (res.code === 200) {
        message.destroy()
        if (flag) {
          message.success("修改成功")
        } else {
          message.success("新增成功")
          this.props.store.initCard("patient")
        }
      }
    })
  }
  //删除取卵手术
  delete = () => {
    let { bindData } = this.state
    if (!bindData.uid) {
      message.success("删除成功")
      this.props.deleteItem()
    } else {
      apis.Patients_surgery.delSurgeryovum(bindData.uid).then((res) => {
        if (res.code === 200) {
          message.success("删除成功")
          this.props.deleteItem()
        } else {
          message.error(res.message)
        }
      })
    }
  }
  render() {
    let { days } = this
    let {
      bindData,
      initSelect,
      ovumRecord,
      eggHarvestRecordParams,
      ovarianFeedParams,
      eggRetrievalOperationSingPrams,
      eggRetrievalOperationNarcoticParams,
      eggRetrievalOperationMedicationParams,
      items,
      medicationFlag,
      drugeOption,
    } = this.state
    let { ontoptInfoList } = this.props.moredetail
    const flush = [{ value: "冲管", text: "冲管" }]
    let columns = [
      {
        title: "序号",
        width: 30,
        dataIndex: "serialNumber",
        key: "serialNumber",
        render: (text, record, index) => {
          return <div>{text}</div>
        },
      },
      {
        title: "位置",
        width: 30,
        dataIndex: "position",
        key: "position",
        render: (text, record, index) => {
          return (
            <div>
              <Select
                value={record.position}
                style={{ width: 60 }}
                onChange={(value) => {
                  this.setOvumRecord(value, "position", index)
                  this.addRow(record.serialNumber, record.position, index)
                }}
              >
                <Option value="左">左</Option>
                <Option value="右">右</Option>
              </Select>
            </div>
          )
        },
      },
      {
        title: "性状",
        width: 30,
        dataIndex: "character",
        key: "character",
        render: (text, record, index) => {
          return (
            <div>
              <Select
                value={record.character}
                style={{ width: 60 }}
                onChange={(value) => {
                  this.setOvumRecord(value, "character", index)
                  this.addRow(record.serialNumber, record.position, index)
                }}
              >
                {renderOptions(initSelect, "319")}
              </Select>
            </div>
          )
        },
      },
      {
        title: "量（ml）",
        width: 30,
        dataIndex: "volume",
        key: "volume",
        render: (text, record, index) => {
          return (
            <div>
              <Input
                style={{ width: 60 }}
                value={record.volume}
                onChange={(e) => {
                  this.setOvumRecord(e.target.value, "volume", index)
                }}
              />
            </div>
          )
        },
      },
      {
        title: "冲洗",
        width: 30,
        dataIndex: "flush",
        key: "flush",
        render: (text, record, index) => {
          return (
            <div>
              <AutoComplete
                allowClear
                options={flush}
                style={{ width: 80 }}
                value={record.flush}
                onChange={(value) => {
                  this.setOvumRecord(value, "flush", index)
                }}
              />
            </div>
          )
        },
      },
      {
        title: "大",
        width: 60,
        dataIndex: "largeFollicleNumber",
        key: "largeFollicleNumber",
        render: (text, record, index) => {
          return (
            <div>
              <InputNumber
                style={{ width: 60 }}
                value={record.largeFollicleNumber}
                onChange={(value) => {
                  this.setOvumRecord(value, "largeFollicleNumber", index)
                }}
              />
            </div>
          )
        },
      },
      {
        title: "中",
        width: 60,
        dataIndex: "midFollicleNumber",
        key: "midFollicleNumber",
        render: (text, record, index) => {
          return (
            <div>
              <InputNumber
                style={{ width: 60 }}
                value={record.midFollicleNumber}
                onChange={(value) => {
                  this.setOvumRecord(value, "midFollicleNumber", index)
                }}
              />
            </div>
          )
        },
      },
      {
        title: "小",
        width: 60,
        dataIndex: "smallFollicleNumber",
        key: "smallFollicleNumber",
        render: (text, record, index) => {
          return (
            <div>
              <InputNumber
                style={{ width: 60 }}
                value={record.smallFollicleNumber}
                onChange={(value) => {
                  this.setOvumRecord(value, "smallFollicleNumber", index)
                }}
              />
            </div>
          )
        },
      },
      {
        title: "卵泡大小",
        width: 60,
        dataIndex: "follicleSize",
        key: "follicleSize",
        render: (text, record, index) => {
          return (
            <div>
              <Input
                style={{ width: 60 }}
                value={record.follicleSize}
                onChange={(e) => {
                  this.setOvumRecord(e.target.value, "follicleSize", index)
                }}
              />
            </div>
          )
        },
      },
      {
        title: "卵子数",
        width: 60,
        dataIndex: "eggNumber",
        key: "eggNumber",
        render: (text, record, index) => {
          return (
            <div>
              <InputNumber
                style={{ width: 60 }}
                value={record.eggNumber}
                onChange={(value) => {
                  this.setEggNumber(value, "eggNumber", record, index)
                }}
              />
            </div>
          )
        },
      },
      {
        title: "备注",
        width: 120,
        dataIndex: "recordNote",
        key: "recordNote",
        render: (text, record, index) => {
          return (
            <div>
              <Input
                style={{ width: 120 }}
                value={record.recordNote}
                onChange={(e) => {
                  this.setOvumRecord(e.target.value, "recordNote", index)
                }}
              />
            </div>
          )
        },
      },
    ]
    let ovaryColumns = [
      {
        title: "卵巢",
        width: 60,
        dataIndex: "side",
        key: "side",
        align: "center",
        render: (text, record, index) => {
          return <div>{text}</div>
        },
      },
      {
        title: "进针（次）",
        width: 120,
        dataIndex: "sideNeedleTimes",
        key: "sideNeedleTimes",
        align: "center",
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: 80, marginLeft: 0 }}
              value={record.sideNeedleTimes}
              onChange={(e) => {
                this.setParams(
                  e.target.value,
                  "sideNeedleTimes",
                  index,
                  ovarianFeedParams
                )
              }}
            />
          )
        },
      },
      {
        title: "卵泡（个）",
        width: 120,
        dataIndex: "follicleNumber",
        key: "follicleNumber",
        align: "center",
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: 80, marginLeft: 0 }}
              value={record.follicleNumber}
              onChange={(e) => {
                this.setParams(
                  e.target.value,
                  "follicleNumber",
                  index,
                  ovarianFeedParams
                )
              }}
            />
          )
        },
      },
      {
        title: "获卵（枚）",
        width: 120,
        dataIndex: "sideOvumNumber",
        key: "sideOvumNumber",
        align: "center",
        render: (text, record, index) => {
          return (
            <div>
              <Input
                style={{ width: 80, marginLeft: 0 }}
                value={record.sideOvumNumber}
                onChange={(e) => {
                  this.setParams(
                    e.target.value,
                    "sideOvumNumber",
                    index,
                    ovarianFeedParams
                  )
                }}
              />
            </div>
          )
        },
      },
      {
        title: "囊肿（个）",
        width: 120,
        dataIndex: "cystsNumber",
        key: "cystsNumber",
        align: "center",
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: 80, marginLeft: 0 }}
              value={record.cystsNumber}
              onChange={(e) => {
                this.setParams(
                  e.target.value,
                  "cystsNumber",
                  index,
                  ovarianFeedParams
                )
              }}
            />
          )
        },
      },
      {
        title: "难易",
        width: 120,
        dataIndex: "ovaryDifficulty",
        key: "ovaryDifficulty",
        align: "center",
        render: (text, record, index) => {
          return (
            <Select
              value={record.ovaryDifficulty}
              style={{ width: 80, marginLeft: 0 }}
              onChange={(value) => {
                this.setParams(
                  value,
                  "ovaryDifficulty",
                  index,
                  ovarianFeedParams
                )
              }}
            >
              {renderOptions(initSelect, "170")}
            </Select>
          )
        },
      },
    ]
    let medicationColumns = [
      {
        title: "药名",
        dataIndex: "drugName",
        key: "drugName",
        width: 80,
        render: (text, record, index) => {
          return (
            <AutoComplete
              dropdownMatchSelectWidth={300}
              allowClear={false}
              options={drugeOption}
              value={record.drugName}
              style={{ width: "98%" }}
              onChange={(value) => {
                this.setDrugChange(value, record, index)
              }}
              onFocus={this.conversionOptions}
            />
          )
        },
      },
      {
        title: "用量",
        dataIndex: "dose",
        key: "dose",
        width: 64,
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.dose}
              onChange={(e) => {
                this.setMedication(e.target.value, "dose", index)
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
        render: (text, record, index) => {
          return (
            <Select
              dropdownMatchSelectWidth={100}
              value={record.frequency}
              style={{ width: "98%" }}
              onChange={(val) => {
                this.setMedication(val, "frequency", index)
              }}
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
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: "98%" }}
              placeholder="1"
              value={record.days}
              onChange={(e) => {
                this.setMedication(e.target.value, "days", index)
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
        render: (text, record, index) => {
          return (
            <Select
              value={record.usage}
              style={{ width: "98%" }}
              onChange={(val) => this.setMedication(val, "usage", index)}
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
        render: (text, record, index) => {
          return (
            <div>
              <Select
                dropdownMatchSelectWidth={130}
                style={{ width: "76%" }}
                value={record.eatStatus}
                onChange={(val) => {
                  this.setMedication(val, "eatStatus", index)
                  this.computedDateFuc(val, parseInt(days) + 1, record)
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
                    ? moment(record.eatDate, dateFormatDate)
                    : moment(new Date(), dateFormatDate)
                }
              />
            </div>
          )
        },
      },
      {
        title: "说明",
        dataIndex: "note",
        key: "note",
        width: 100,
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.note}
              onChange={(e) => {
                this.setMedication(e.target.value, "note", index)
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
          return index !== eggRetrievalOperationMedicationParams.length - 1 ? (
            <DashBtn className="dashbutton">
              <MinusOutlined
                onClick={() => {
                  this.deleteMedication(index)
                }}
              />
            </DashBtn>
          ) : (
            <DashBtn className="dashbutton">
              <PlusOutlined
                onClick={() => {
                  this.addRowMedication(index)
                }}
              />
            </DashBtn>
          )
        },
      },
    ]
    return (
      <div className="surgeryOvum">
        <DateTitleView
          flag={true}
          title={
            <div style={{ marginLeft: 15 }}>
              <span
                className={ovumRecord ? "surgeryChecked" : "surgeryUnchecked"}
                onClick={() => {
                  this.setState({
                    ovumRecord: true,
                  })
                }}
              >
                取卵手术记录
              </span>
              <span
                style={{ marginLeft: 15 }}
                className={!ovumRecord ? "surgeryChecked" : "surgeryUnchecked"}
                onClick={() => {
                  this.setState({
                    ovumRecord: false,
                  })
                }}
              >
                获卵记录
              </span>
            </div>
          }
          style={{ marginRight: 0, marginBottom: 0 }}
        >
          {ovumRecord ? (
            <>
              <FlexItem className="flexItem">
                <div className="paneldiv">
                  <PanelTag title="" />
                </div>
                <div className="paneldiv">
                  <DatePicker
                    allowClear={false}
                    style={{ margin: 0, borderRight: "none" }}
                    value={
                      bindData.date
                        ? moment(bindData.date, dateFormatDate)
                        : moment(todayString, dateFormatDate)
                    }
                    onChange={(date, datestring) => {
                      this.setInheritVal(datestring, "date")
                    }}
                  />
                  <TimePicker.RangePicker
                    style={{ width: "160px", margin: 0, borderLeft: "none" }}
                    allowClear={false}
                    value={[
                      bindData.startTime
                        ? moment(bindData.startTime, dateFormat)
                        : moment(todayTime, dateFormat),
                      bindData.endTime
                        ? moment(bindData.endTime, dateFormat)
                        : moment(todayTime, dateFormat),
                    ]}
                    onChange={(date, datestring) => {
                      this.setInheritVal(datestring[0], "startTime")
                      this.setInheritVal(datestring[1], "endTime")
                    }}
                    format={"HH:mm"}
                  />
                </div>
                <div>
                  <span>术者</span>
                  <span>
                    <Select
                      style={{ width: 100, textAlign: "left" }}
                      value={bindData.surgeon}
                      showArrow={false}
                      onChange={(value) => {
                        this.setInheritVal(value, "surgeon")
                      }}
                    >
                      {renderOptions(initSelect, "155")}
                    </Select>
                  </span>
                </div>
                <div>
                  <span>助手</span>
                  <span>
                    <Select
                      style={{ width: 100, textAlign: "left" }}
                      value={bindData.assistant}
                      showArrow={false}
                      onChange={(value) => {
                        this.setInheritVal(value, "assistant")
                      }}
                    >
                      {renderOptions(initSelect, "156")}
                    </Select>
                  </span>
                </div>
                <div>
                  <span>记录者</span>
                  <span>
                    <Select
                      style={{ width: 100, textAlign: "left" }}
                      value={bindData.recorder}
                      showArrow={false}
                      onChange={(value) => {
                        this.setInheritVal(value, "recorder")
                      }}
                    >
                      {renderOptions(initSelect, "157")}
                    </Select>
                  </span>
                </div>
              </FlexItem>
              <FlexItem style={{ marginLeft: "30px" }}>
                <div className="colorTrigger">
                  {bindData.triggerDate ? (
                    <>
                      <span className="circleOvum">扳</span>
                      <span>
                        {bindData.triggerDate}&nbsp;&nbsp;{bindData.triggerTime}
                      </span>
                    </>
                  ) : null}
                </div>
                <div className="colorTrigger">
                  {bindData.triggerAgainDate ? (
                    <>
                      <span className="circleOvum">补</span>
                      <span>
                        {bindData.triggerAgainDate}&nbsp;&nbsp;
                        {bindData.triggerAgainTime}
                      </span>
                    </>
                  ) : null}
                </div>
              </FlexItem>
              {eggRetrievalOperationSingPrams.map((item, index) => {
                return (
                  <FlexItem className="flexItem" key={index}>
                    {index === 0 ? (
                      <div className="paneldiv">
                        <PanelTag title="" />
                      </div>
                    ) : (
                      <div className="occupy"></div>
                    )}
                    <div className="paneldiv">
                      {item.operation ? (
                        <span style={{ width: "60px", textAlign: "left" }}>
                          {item.operation}
                        </span>
                      ) : (
                        <span>
                          <Select
                            style={{
                              width: 60,
                              textAlign: "left",
                              marginLeft: 0,
                            }}
                            value={item.operation}
                            showArrow={false}
                            onChange={(value) => {
                              this.setParams(
                                value,
                                "operation",
                                index,
                                eggRetrievalOperationSingPrams
                              )
                            }}
                          >
                            <Select.Option value={"术中"}>术中</Select.Option>
                            <Select.Option value={"术后"}>术后</Select.Option>
                          </Select>
                        </span>
                      )}
                    </div>
                    <div className="paneldiv">
                      <span>T</span>
                      <span>
                        <FontInput
                          addonAfter="℃"
                          style={{ width: 100 }}
                          value={item.t}
                          onChange={(e) => {
                            this.setParams(
                              e.target.value,
                              "t",
                              index,
                              eggRetrievalOperationSingPrams
                            )
                          }}
                        />
                      </span>
                    </div>
                    <div>
                      <span>P</span>
                      <span>
                        <FontInput
                          addonAfter="次/分"
                          style={{ width: 100 }}
                          value={item.p}
                          onChange={(e) => {
                            this.setParams(
                              e.target.value,
                              "p",
                              index,
                              eggRetrievalOperationSingPrams
                            )
                          }}
                        />
                      </span>
                    </div>
                    <div>
                      <span>R</span>
                      <span>
                        <FontInput
                          addonAfter="次/分"
                          style={{ width: 100 }}
                          value={item.r}
                          onChange={(e) => {
                            this.setParams(
                              e.target.value,
                              "r",
                              index,
                              eggRetrievalOperationSingPrams
                            )
                          }}
                        />
                      </span>
                    </div>
                    <div>
                      <span>BP</span>
                      <span>
                        <Input
                          style={{ width: 50 }}
                          value={item.bpMin}
                          onChange={(e) => {
                            this.setParams(
                              e.target.value,
                              "bpMin",
                              index,
                              eggRetrievalOperationSingPrams
                            )
                          }}
                        />
                      </span>
                      /
                      <span>
                        <FontInput
                          addonAfter="mmHg"
                          style={{ width: 100 }}
                          value={item.bpMax}
                          onChange={(e) => {
                            this.setParams(
                              e.target.value,
                              "bpMax",
                              index,
                              eggRetrievalOperationSingPrams
                            )
                          }}
                        />
                      </span>
                    </div>
                    <div>
                      <span>
                        <DashBtn className="dashbutton">
                          {index === 0 ? (
                            <PlusOutlined onClick={this.addSurgery} />
                          ) : (
                            <MinusOutlined
                              onClick={() =>
                                this.deleteParams(
                                  index,
                                  eggRetrievalOperationSingPrams
                                )
                              }
                            />
                          )}
                        </DashBtn>
                      </span>
                    </div>
                  </FlexItem>
                )
              })}
              <FlexItem className="flexItem">
                <div className="paneldiv">
                  <PanelTag title="" />
                </div>
                <div className="paneldiv">
                  <span>取卵针</span>
                  <span>
                    <Select
                      style={{ width: 120, textAlign: "left" }}
                      value={bindData.oocyteRemovalNeedle}
                      showArrow={false}
                      onChange={(value) => {
                        this.setInheritVal(value, "oocyteRemovalNeedle")
                      }}
                    >
                      {renderOptions(initSelect, "159")}
                    </Select>
                  </span>
                </div>
                <div>
                  <span>型号</span>
                  <span>
                    <Input
                      style={{ width: 100 }}
                      value={bindData.oocyteRemovalNeedleModelNumber}
                      onChange={(e) => {
                        this.setInheritVal(
                          e.target.value,
                          "oocyteRemovalNeedleModelNumber"
                        )
                      }}
                    />
                  </span>
                </div>
                <div>
                  <span>冲卵液</span>
                  <span>
                    <Select
                      style={{ width: 120, textAlign: "left" }}
                      value={bindData.flushingEggFluid}
                      showArrow={false}
                      onChange={(value) => {
                        this.setInheritVal(value, "flushingEggFluid")
                      }}
                    >
                      {renderOptions(initSelect, "160")}
                    </Select>
                  </span>
                </div>
                <div>
                  <span>批号</span>
                  <span>
                    <Input
                      style={{ width: 100 }}
                      value={bindData.flushingEggFluidBatchNumber}
                      onChange={(e) => {
                        this.setInheritVal(
                          e.target.value,
                          "flushingEggFluidBatchNumber"
                        )
                      }}
                    />
                  </span>
                </div>
                <div>
                  <span>负压</span>
                  <span>
                    <FontInput
                      style={{ width: 100 }}
                      addonAfter="mmHg"
                      value={bindData.negativePressure}
                      onChange={(e) => {
                        this.setInheritVal(e.target.value, "negativePressure")
                      }}
                    />
                  </span>
                </div>
              </FlexItem>
              {eggRetrievalOperationNarcoticParams.map((item, index) => {
                return (
                  <FlexItem key={index} className="flexItem">
                    {index === 0 ? (
                      <div className="paneldiv">
                        <PanelTag title="" />
                      </div>
                    ) : (
                      <div className="occupy"></div>
                    )}
                    <div className="paneldiv">
                      <span>方式</span>
                      <span>
                        <Select
                          style={{ width: 100, textAlign: "left" }}
                          value={item.method}
                          showArrow={false}
                          onChange={(value) => {
                            this.setParams(
                              value,
                              "method",
                              index,
                              eggRetrievalOperationNarcoticParams
                            )
                          }}
                        >
                          {renderOptions(initSelect, "161")}
                        </Select>
                      </span>
                    </div>
                    <div>
                      <span>用药</span>
                      <span>
                        <Select
                          style={{ width: 100 }}
                          value={item.drugs}
                          showArrow={false}
                          onChange={(value) => {
                            this.setParams(
                              value,
                              "drugs",
                              index,
                              eggRetrievalOperationNarcoticParams
                            )
                          }}
                        >
                          {renderOptions(initSelect, "162")}
                        </Select>
                      </span>
                    </div>
                    <div>
                      <span>用量</span>
                      <span>
                        <Input
                          style={{ width: 100 }}
                          value={item.dose}
                          showArrow={false}
                          onChange={(e) => {
                            this.setParams(
                              e.target.value,
                              "dose",
                              index,
                              eggRetrievalOperationNarcoticParams
                            )
                          }}
                        />
                        <Select
                          style={{ width: 50, marginLeft: "0px" }}
                          value={item.doseUnit}
                          showArrow={false}
                          onChange={(value) => {
                            this.setParams(
                              value,
                              "doseUnit",
                              index,
                              eggRetrievalOperationNarcoticParams
                            )
                          }}
                        >
                          {renderOptions(initSelect, "163")}
                        </Select>
                      </span>
                    </div>
                    <div>
                      <span>用法</span>
                      <span>
                        <Select
                          style={{ width: 100 }}
                          value={item.injectionMethod}
                          showArrow={false}
                          onChange={(value) => {
                            this.setParams(
                              value,
                              "injectionMethod",
                              index,
                              eggRetrievalOperationNarcoticParams
                            )
                          }}
                        >
                          {renderOptions(initSelect, "164")}
                        </Select>
                      </span>
                    </div>
                    <div>
                      <span>麻醉师</span>
                      <span>
                        <Select
                          style={{ width: 100 }}
                          value={item.anaesthetist}
                          showArrow={false}
                          onChange={(value) => {
                            this.setParams(
                              value,
                              "anaesthetist",
                              index,
                              eggRetrievalOperationNarcoticParams
                            )
                          }}
                        >
                          {renderOptions(initSelect, "158")}
                        </Select>
                      </span>
                    </div>
                    <div>
                      <span>
                        <DashBtn className="dashbutton">
                          {index === 0 ? (
                            <PlusOutlined onClick={this.addNarcotic} />
                          ) : (
                            <MinusOutlined
                              onClick={() =>
                                this.deleteParams(
                                  index,
                                  eggRetrievalOperationNarcoticParams
                                )
                              }
                            />
                          )}
                        </DashBtn>
                      </span>
                    </div>
                  </FlexItem>
                )
              })}
              <FlexItem className="flexItem">
                <div className="paneldiv">
                  <PanelTag title="" />
                </div>
                <div className="paneldiv flexgrow">
                  <span>盆腔超声示</span>
                  <Input
                    style={{ flexGrow: 1 }}
                    value={bindData.pelvicUltrasoundTip}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "pelvicUltrasoundTip")
                    }}
                  />
                </div>
                <div className="paneldiv flexgrow">
                  <span>消毒冲洗</span>
                  <Input
                    style={{ flexGrow: 1 }}
                    value={bindData.disinfectionRinseTip}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "disinfectionRinseTip")
                    }}
                  />
                </div>
              </FlexItem>
              <div className="divider">
                <Divider />
              </div>
              {/* 用药 */}
              <div style={{ display: "flex" }}>
                <div className="paneldiv">
                  <PanelTag title="" />
                </div>
                <div className="paneldiv">
                  <span>术后</span>
                </div>
                <div className="paneldiv">
                  医师：{bindData.medicationPractitioner}
                </div>
                <div className="flexgrow">
                  {!medicationFlag ? (
                    <>
                      {eggRetrievalOperationMedicationParams
                        .filter((item) => {
                          return item.drugName
                        })
                        .map((item, index) => {
                          return (
                            <FlexItem
                              style={{ marginTop: 0 }}
                              className="flexItem"
                              key={index}
                            >
                              <div
                                className="flexgrow"
                                style={{ marginLeft: 0 }}
                              >
                                <span
                                  className="span_underline"
                                  style={{ flexGrow: 1, textAlign: "left" }}
                                >
                                  <span className="medication">
                                    {item.drugName}
                                  </span>
                                  <span className="medication">
                                    {item.dose}
                                  </span>
                                  <span className="medication">
                                    {item.usage}
                                  </span>
                                </span>
                              </div>
                            </FlexItem>
                          )
                        })}
                      <div
                        style={{
                          float: "right",
                          marginTop: 10,
                        }}
                      >
                        <EditFilled
                          className="icon_record"
                          onClick={() =>
                            this.setState({
                              medicationFlag: !medicationFlag,
                            })
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <BaseTable
                        style={{ marginLeft: 10 }}
                        columns={medicationColumns}
                        dataSource={eggRetrievalOperationMedicationParams}
                        pagination={false}
                        rowKey={(record) => record.uid}
                      />
                      <div
                        style={{
                          float: "right",
                          marginTop: 10,
                          marginRight: 24,
                        }}
                      >
                        <div
                          style={{
                            display: "inline-block",
                            marginRight: "20px",
                          }}
                        >
                          <span>医师</span>
                          <span>
                            <Select
                              value={bindData.medicationPractitioner}
                              style={{ width: 90 }}
                              onChange={(val) =>
                                this.setInheritVal(
                                  val,
                                  "medicationPractitioner"
                                )
                              }
                            >
                              {renderOptions(initSelect, "155")}
                            </Select>
                          </span>
                        </div>
                        <DashBtn className="dashbutton">
                          <CheckOutlined
                            onClick={() => {
                              this.setState({
                                medicationFlag: false,
                              })
                            }}
                          />
                        </DashBtn>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="divider">
                <Divider />
              </div>
              <FlexItem className="flexItem">
                <div className="paneldiv">
                  <BaseTable
                    columns={ovaryColumns}
                    dataSource={ovarianFeedParams}
                    pagination={false}
                    rowKey={(record) => record.side}
                  />
                </div>
                <div style={{ flexDirection: "column", marginLeft: 0 }}>
                  <FlexItem>
                    <div>
                      <span>穿刺点渗血</span>
                      <span>
                        <Switch
                          checked={bindData.puncturePointBleed}
                          onChange={(checked) => {
                            this.setInheritVal(
                              checked ? 1 : 0,
                              "puncturePointBleed"
                            )
                          }}
                        />
                      </span>
                    </div>
                    <div>
                      <span>填塞纱布</span>
                      <span>
                        <FontInput
                          addonAfter="块"
                          style={{ width: 100 }}
                          value={bindData.filledGauzePieces}
                          onChange={(e) => {
                            this.setInheritVal(
                              e.target.value,
                              "filledGauzePieces"
                            )
                          }}
                        />
                      </span>
                    </div>
                    <div>
                      <span>
                        <FontInput
                          addonAfter="h取出"
                          style={{ width: 100 }}
                          value={bindData.filledGauzeRemovalHours}
                          onChange={(e) => {
                            this.setInheritVal(
                              e.target.value,
                              "filledGauzeRemovalHours"
                            )
                          }}
                        />
                      </span>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <div>
                      <span>出血</span>
                      <span>
                        <FontInput
                          addonAfter="ml"
                          style={{ width: 100 }}
                          value={bindData.hemorrhage}
                          onChange={(e) => {
                            this.setInheritVal(e.target.value, "hemorrhage")
                          }}
                        />
                      </span>
                    </div>
                  </FlexItem>
                </div>
              </FlexItem>
              <div className="divider">
                <Divider />
              </div>
              <FlexItem className="flexItem">
                <div className="paneldiv">
                  <PanelTag title="" />
                </div>
                <div className="paneldiv">
                  <span>疼痛</span>
                  <span>
                    <Switch
                      checked={bindData.postoperativePain}
                      onChange={(checked) => {
                        this.setInheritVal(checked ? 1 : 0, "postoperativePain")
                      }}
                    />
                  </span>
                </div>
                <div>
                  <span>意识</span>
                  <span>
                    <Select
                      style={{ width: 100, textAlign: "left" }}
                      value={bindData.postoperativeRealize}
                      showArrow={false}
                      onChange={(value) => {
                        this.setInheritVal(value, "postoperativeRealize")
                      }}
                    >
                      {renderOptions(initSelect, "167")}
                    </Select>
                  </span>
                </div>
                <div>
                  <span>观察时长</span>
                  <span>
                    <FontInput
                      style={{ width: 100 }}
                      addonAfter="h"
                      value={bindData.postoperativeObservationDuration}
                      onChange={(e) => {
                        this.setInheritVal(
                          e.target.value,
                          "postoperativeObservationDuration"
                        )
                      }}
                    />
                  </span>
                </div>
              </FlexItem>
              <FlexItem className="flexItem">
                <div className="paneldiv flexgrow">
                  <span>小结</span>
                  <Input
                    style={{ flexGrow: 1 }}
                    value={bindData.postoperativeUmmary}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "postoperativeUmmary")
                    }}
                  />
                </div>
              </FlexItem>
              <FlexItem className="flexItem">
                <div className="paneldiv">
                  <PanelTag title="" />
                </div>
                <div>
                  <span>术前完整</span>
                  <span>
                    <Switch
                      checked={bindData.preoperativeInstrumentIntegrity}
                      onChange={(checked) => {
                        this.setInheritVal(
                          checked ? 1 : 0,
                          "preoperativeInstrumentIntegrity"
                        )
                      }}
                    />
                  </span>
                </div>
                <div>
                  <span>术后完整</span>
                  <span>
                    <Switch
                      checked={bindData.postoperativeInstrumentIntegrity}
                      onChange={(checked) => {
                        this.setInheritVal(
                          checked ? 1 : 0,
                          "postoperativeInstrumentIntegrity"
                        )
                      }}
                    />
                  </span>
                </div>
                <div>
                  <span>清点者</span>
                  <span>
                    <Select
                      style={{ width: 100, textAlign: "left" }}
                      value={bindData.inventor}
                      showArrow={false}
                      onChange={(value) => {
                        this.setInheritVal(value, "inventor")
                      }}
                    >
                      {renderOptions(initSelect, "287")}
                    </Select>
                  </span>
                </div>
              </FlexItem>
              <FlexItem className="flexItem">
                <div className="paneldiv flexgrow">
                  <span>备注</span>
                  <Input
                    style={{ flexGrow: 1 }}
                    value={bindData.note}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "note")
                    }}
                  />
                </div>
              </FlexItem>
            </>
          ) : (
            <BaseTable
              style={{ marginRight: 10, marginLeft: 20, minHeight: 350 }}
              columns={columns}
              dataSource={eggHarvestRecordParams}
              pagination={false}
              rowKey={(record) => record.serialNumber}
            />
          )}
          <ThreeItem style={{ margin: "20px 0" }}>
            <div style={{ width: "100%" }}>
              <Row type="flex" align="middle" justify="center">
                <Button type="primary" onClick={this.save}>
                  保存
                </Button>
              </Row>
            </div>
          </ThreeItem>
        </DateTitleView>
      </div>
    )
  }
}
