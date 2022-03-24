import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { observable } from "mobx"
import {
  Input,
  DatePicker,
  Select,
  Checkbox,
  Radio,
  TimePicker,
  message,
  Divider,
  AutoComplete,
  Row,
  Button,
  Switch,
} from "antd"
import {
  PlusOutlined,
  MinusOutlined,
  EditFilled,
  CheckOutlined,
  SwapOutlined,
} from "@ant-design/icons"
import "./index.scss"
import { DateTitleView } from "@/app/components/normal/Title"
import { BaseTable } from "@/app/components/base/baseTable"
import PanelTag from "@/app/components/normal/PanelTag"
import { ThreeItem, FlexItem } from "@/app/components/base/baseForms.js"
import { checkArrisEmpty } from "@/app/utils/tool.js"
import { DashBtn } from "@/app/components/base/baseBtn"
import styled from "styled-components"
import {
  dateFormat,
  dateFormatDate,
  todayString,
  todayTime,
} from "@/app/utils/const.js"
import moment from "moment"
import apis from "@/app/utils/apis"
import { handleDefault } from "@/app/utils/tool.js"
import { defaultData } from "./defaultData"

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
      oprationRecord: props.oprationRecord, //手术字段
      directionTag: true,
      bindData: {}, //模板数据
      initSelect: [], //下拉框值
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
      transplantOperationConsumableParams: [
        {
          consumableName: null,
          innerOrOut: "内管",
          mucus: "无",
          bloodStained: "无",
          intubation: "无",
          depth: null,
        },
        {
          consumableName: null,
          innerOrOut: "外管",
          mucus: "无",
          bloodStained: "无",
          intubation: "无",
          depth: null,
        },
      ], //耗材
      selecteDrugArry: [], //用药初始化
      drugeOption: [], // 用药下拉框数据
      ontoptInfoList: [], //下拉框的数据
      items: ["当日", "次日", "再次日"],
    }
  }
  componentDidMount = () => {
    let { select_one } = this.props.store
    let { configMedicalAdvice } = this.props.moredetail
    configMedicalAdvice(select_one) //初始化用药配置
    this.props.onRef && this.props.onRef(this)
    this.getInitData()
    this.initTransplantSelect()
    this.selectDrug() //模糊查询用药
  }
  //获取下拉框值
  initTransplantSelect = () => {
    apis.Patients_surgery.initSelecttran().then((res) => {
      this.setState({
        initSelect: res.data,
      })
    })
  }
  //初始化空数据
  initCheckData = (resData, initData) => {
    let data = !checkArrisEmpty(resData) ? resData : initData
    return data
  }
  //初始化数据
  getInitData = (val) => {
    let {
      oprationRecord,
      eggRetrievalOperationMedicationParams,
      transplantOperationConsumableParams,
    } = this.state
    let record = null
    if (val) {
      record = val.charAt(val.length - 1) //取手术记录次数
    } else {
      record = oprationRecord.charAt(oprationRecord.length - 1) //取手术记录次数
    }
    apis.Patients_surgery.initSurgerytransplant(
      this.props.store.select_one
    ).then((res) => {
      if (!checkArrisEmpty(res.data) && res.data.length > record - 1) {
        let getData = res.data[record - 1]
        this.setState({
          bindData: handleDefault(res.data[record - 1], defaultData),
          eggRetrievalOperationMedicationParams: this.initCheckData(
            getData.eggRetrievalOperationMedicationParams,
            eggRetrievalOperationMedicationParams
          ),
          transplantOperationConsumableParams: this.initCheckData(
            getData.transplantOperationConsumableParams,
            transplantOperationConsumableParams
          ),
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
  //新增,修改移植手术
  save = () => {
    let {
      bindData,
      eggRetrievalOperationMedicationParams,
      transplantOperationConsumableParams,
    } = this.state
    let data = {
      ...bindData,
      eggRetrievalOperationMedicationParams: eggRetrievalOperationMedicationParams.filter(
        (item) => {
          return item.drugName
        }
      ),
      transplantOperationConsumableParams,
    }
    data.patientParam = this.props.store.select_one
    let flag = data.uid ? true : false
    apis.Patients_surgery.addSurgerytransplant(data).then((res) => {
      message.destroy()
      if (flag) {
        message.success("修改成功")
      } else {
        message.success("添加成功")
        this.props.store.initCard("patient")
      }
    })
  }
  //删除移植手术
  delete = () => {
    let { bindData } = this.state
    if (!bindData.uid) {
      message.success("删除成功")
      this.props.deleteItem()
    } else {
      apis.Patients_surgery.deltransplant(bindData.uid).then((res) => {
        if (res.code === 200) {
          message.success("删除成功")
          this.props.deleteItem()
        } else {
          message.error(res.message)
        }
      })
    }
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
  // 修改耗材
  setConsumables = (value, param, index) => {
    let { transplantOperationConsumableParams } = this.state
    let arr = transplantOperationConsumableParams
    arr.map((item, itemIndex) => {
      if (itemIndex === index) {
        item[param] = value
      }
      return item
    })
    this.setState({
      transplantOperationConsumableParams: [...arr],
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
  changeBlood = (text, record, parm) => {
    let { transplantOperationConsumableParams } = this.state
    if (parm === "intubation") {
      if (text === "容易") {
        record[parm] = "困难"
      } else {
        record[parm] = "容易"
      }
    } else {
      if (text === "有") {
        record[parm] = "无"
      } else {
        record[parm] = "有"
      }
    }
    this.setState({
      transplantOperationConsumableParams,
    })
  }
  render() {
    let { days } = this
    let { renderOptions } = this.props.moredetail
    let {
      bindData,
      initSelect,
      medicationFlag,
      eggRetrievalOperationMedicationParams,
      transplantOperationConsumableParams,
      drugeOption,
      ontoptInfoList,
      items,
    } = this.state
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
                      <span
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
                      </span>
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
    ] //用药表头
    let columnsConsumables = [
      {
        title: "耗材",
        dataIndex: "consumableName",
        key: "consumableName",
        render: (text, record, index) => {
          return (
            <AutoComplete
              value={record.consumableName}
              style={{ width: "98%" }}
              dropdownMatchSelectWidth={100}
              onChange={(val) =>
                this.setConsumables(val, "consumableName", index)
              }
            >
              {renderOptions(initSelect, "184")}
            </AutoComplete>
          )
        },
      },
      {
        title: "内外",
        dataIndex: "innerOrOut",
        key: "innerOrOut",
      },
      {
        title: "粘液",
        dataIndex: "mucus",
        key: "mucus",
        render: (text, record) => {
          return (
            <div>
              <span>{text ? text : "无"}</span>
              <SwapOutlined
                style={{ color: "#59b4f4" }}
                onClick={() => this.changeBlood(text, record, "mucus")}
              />
            </div>
          )
        },
      },
      {
        title: "血染",
        dataIndex: "bloodStained",
        key: "bloodStained",
        render: (text, record) => {
          return (
            <div>
              <span>{text ? text : "无"}</span>
              <SwapOutlined
                style={{ color: "#59b4f4" }}
                onClick={() => this.changeBlood(text, record, "bloodStained")}
              />
            </div>
          )
        },
      },
      {
        title: "插管",
        dataIndex: "intubation",
        key: "intubation",
        render: (text, record, index) => {
          return (
            <div>
              <span>{text ? text : "无"}</span>
              <SwapOutlined
                style={{ color: "#59b4f4" }}
                onClick={() => this.changeBlood(text, record, "intubation")}
              />
            </div>
          )
        },
      },
      {
        title: "深度",
        dataIndex: "depth",
        key: "depth",
        render: (text, record, index) => {
          return (
            <Input
              value={record.depth}
              style={{ width: "90%" }}
              onChange={(e) =>
                this.setConsumables(e.target.value, "depth", index)
              }
            />
          )
        },
      },
    ] //耗材表头
    return (
      <div className="surgeryTransplant">
        <DateTitleView
          flag={true}
          title={
            <div style={{ marginLeft: 15 }}>
              <span className="surgeryChecked">移植手术</span>
            </div>
          }
          style={{ marginRight: 0, marginBottom: 0 }}
        >
          <FlexItem className="flexItem">
            <div className="paneldiv">
              <PanelTag title="" />
            </div>
            <div className="paneldiv">
              <DatePicker
                allowClear={false}
                style={{ margin: 0, borderRight: "none" }}
                defaultValue={bindData.date}
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
                defaultValue={bindData.startTime}
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
            <div className="paneldiv">
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
                  {renderOptions(initSelect, "179")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
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
                  {renderOptions(initSelect, "180")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>实验室</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.laboratory}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "laboratory")
                  }}
                >
                  {renderOptions(initSelect, "181")}
                </Select>
              </span>
            </div>
          </FlexItem>
          <FlexItem className="flexItem">
            <div className="paneldiv">
              <PanelTag title="" />
            </div>
            <div className="paneldiv divmargin">
              <span>子宫位置:</span>
              <span>
                <Select
                  style={{ width: "80px" }}
                  value={bindData.uterusPosition}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "uterusPosition")
                  }}
                >
                  {renderOptions(initSelect, "182")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>偏位:</span>
              <span>
                <Radio.Group
                  value={bindData.deviation}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "deviation")
                  }}
                >
                  <Radio value={0}>左</Radio>
                  <Radio value={1}>右</Radio>
                </Radio.Group>
              </span>
            </div>
            <div className="paneldiv">
              <span>内膜:</span>
              <span>
                <Input
                  addonAfter="mm"
                  style={{ width: "80px" }}
                  value={bindData.innerMembrane}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "innerMembrane")
                  }}
                />
              </span>
            </div>
            <div className="paneldiv">
              <span>形态:</span>
              <span>
                <Select
                  style={{ width: "80px" }}
                  value={bindData.morphological}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "morphological")
                  }}
                >
                  {renderOptions(initSelect, "226")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>宫颈:</span>
              <span>
                <Select
                  style={{ width: "80px" }}
                  value={bindData.uterusNeck}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "uterusNeck")
                  }}
                >
                  {renderOptions(initSelect, "257")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>盆底积液(cm):</span>
              <span>
                <Input
                  style={{ maxWidth: 60 }}
                  value={bindData.pelvicEffusionLength}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "pelvicEffusionLength")
                  }}
                />
                <span className="spanTitle">*</span>
                <Input
                  style={{ maxWidth: 60 }}
                  value={bindData.pelvicEffusionWidth}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "pelvicEffusionWidth")
                  }}
                />
              </span>
            </div>
            <div className="paneldiv">
              <span>左卵巢(mm):</span>
              <span>
                <Input
                  style={{ maxWidth: 50 }}
                  value={bindData.leftOvarianLength}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "leftOvarianLength")
                  }}
                />
                <span className="spanTitle">*</span>
                <Input
                  style={{ maxWidth: 50 }}
                  value={bindData.leftOvarianWidth}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "leftOvarianWidth")
                  }}
                />
                <span className="spanTitle">*</span>
                <Input
                  style={{ maxWidth: 50 }}
                  value={bindData.leftOvarianHeight}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "leftOvarianHeight")
                  }}
                />
              </span>
            </div>
            <div className="paneldiv">
              <span>右卵巢(mm):</span>
              <span>
                <Input
                  style={{ maxWidth: 53 }}
                  value={bindData.rightOvarianLength}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "rightOvarianLength")
                  }}
                />
                <span className="spanTitle">*</span>
                <Input
                  style={{ maxWidth: 53 }}
                  value={bindData.rightOvarianWidth}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "rightOvarianWidth")
                  }}
                />
                <span className="spanTitle">*</span>
                <Input
                  style={{ maxWidth: 53 }}
                  value={bindData.rightOvarianHeight}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "rightOvarianHeight")
                  }}
                />
              </span>
            </div>
            <div className="paneldiv">
              <span>回声:</span>
              <span>
                <Radio.Group
                  value={bindData.echoes}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "echoes")
                  }}
                >
                  <Radio value={0}>均匀</Radio>
                  <Radio value={1}>不均</Radio>
                </Radio.Group>
              </span>
            </div>
            <div className="paneldiv">
              <span>运动:</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.sports}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "sports")
                  }}
                >
                  {renderOptions(initSelect, "186")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>窥阴器:</span>
              <span>
                <Radio.Group
                  value={bindData.speculum}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "speculum")
                  }}
                >
                  <Radio value={0}>长</Radio>
                  <Radio value={1}>短</Radio>
                </Radio.Group>
              </span>
            </div>
            <div className="paneldiv">
              <span>分泌物:</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.secretion}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "secretion")
                  }}
                >
                  {renderOptions(initSelect, "302")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>出血:</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.hemorrhage}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "hemorrhage")
                  }}
                >
                  {renderOptions(initSelect, "301")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>黏液:</span>
              <span>
                <Radio.Group
                  value={bindData.mucus}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "mucus")
                  }}
                >
                  <Radio value={0}>易去除</Radio>
                  <Radio value={1}>不易去除</Radio>
                </Radio.Group>
              </span>
            </div>
            <div className="paneldiv">
              <span>膀胱:</span>
              <span>
                <Radio.Group
                  value={bindData.bladderFullness}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "bladderFullness")
                  }}
                >
                  <Radio value={0}>充盈</Radio>
                  <Radio value={1}>非充盈</Radio>
                </Radio.Group>
              </span>
            </div>
          </FlexItem>
          <FlexItem className="flexItem">
            <div className="paneldiv">
              <Checkbox
                checked={bindData.insertedCore}
                onChange={(e) => {
                  this.setInheritVal(e.target.checked ? 1 : 0, "insertedCore")
                }}
              >
                加内芯
              </Checkbox>
              <Checkbox
                checked={bindData.tubeResistance}
                onChange={(e) => {
                  this.setInheritVal(e.target.checked ? 1 : 0, "tubeResistance")
                }}
              >
                碰宫底
              </Checkbox>
              <Checkbox
                checked={bindData.ultrasoundGuidance}
                onChange={(e) => {
                  this.setInheritVal(
                    e.target.checked ? 1 : 0,
                    "ultrasoundGuidance"
                  )
                }}
              >
                超声引导
              </Checkbox>
              <Checkbox
                checked={bindData.intrauterineImageClear}
                onChange={(e) => {
                  this.setInheritVal(
                    e.target.checked ? 1 : 0,
                    "intrauterineImageClear"
                  )
                }}
              >
                进宫腔影像清晰
              </Checkbox>
              <Checkbox
                checked={bindData.injectedImageClear}
                onChange={(e) => {
                  this.setInheritVal(
                    e.target.checked ? 1 : 0,
                    "injectedImageClear"
                  )
                }}
              >
                注射影像清晰
              </Checkbox>
              <Checkbox
                checked={bindData.clampCervix}
                onChange={(e) => {
                  this.setInheritVal(e.target.checked ? 1 : 0, "clampCervix")
                }}
              >
                钳夹宫颈
              </Checkbox>
              <Checkbox
                checked={bindData.useProbes}
                onChange={(e) => {
                  this.setInheritVal(e.target.checked ? 1 : 0, "useProbes")
                }}
              >
                使用探针
              </Checkbox>
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
              <span>用药</span>
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
                          <div className="flexgrow" style={{ marginLeft: 0 }}>
                            <span
                              className="span_underline"
                              style={{ flexGrow: 1, textAlign: "left" }}
                            >
                              <span className="medication">
                                {item.drugName}
                              </span>
                              <span className="medication">{item.dose}</span>
                              <span className="medication">{item.usage}</span>
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
                            this.setInheritVal(val, "medicationPractitioner")
                          }
                        >
                          {renderOptions(initSelect, "179")}
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
          <div style={{ display: "flex" }}>
            <div className="paneldiv">
              <PanelTag title="" />
            </div>
            <div className="flexgrow">
              <BaseTable
                style={{ marginLeft: 10 }}
                columns={columnsConsumables}
                dataSource={transplantOperationConsumableParams}
                pagination={false}
                rowKey={(record) => record.uid}
              />
            </div>
          </div>
          <FlexItem className="flexItem" style={{ margin: "10px 0 0 20px" }}>
            <div className="paneldiv">
              <span>胚胎:</span>
              <span>
                <Input
                  addonAfter="枚"
                  style={{ width: "150px" }}
                  value={bindData.embryosNumber}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "embryosNumber")
                  }}
                />
              </span>
            </div>
            <div className="paneldiv">
              <span>容量:</span>
              <span>
                <Input
                  addonAfter="UL"
                  style={{ width: "150px" }}
                  value={bindData.capacity}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "capacity")
                  }}
                />
              </span>
            </div>
            <div className="paneldiv">
              <span>进入:</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.entryNumber}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "entryNumber")
                  }}
                >
                  {renderOptions(initSelect, "185")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>距宫底:</span>
              <span>
                <Input
                  addonAfter="cm"
                  style={{ width: "150px" }}
                  value={bindData.uterusBottomDistance}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "uterusBottomDistance")
                  }}
                />
              </span>
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
              <span>过程:</span>
              <span>
                <Radio.Group
                  value={bindData.process}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "process")
                  }}
                >
                  <Radio value={0}>容易</Radio>
                  <Radio value={1}>困难</Radio>
                </Radio.Group>
              </span>
            </div>
            <div className="paneldiv">
              <span>残留物:</span>
              <span>
                <Radio.Group
                  value={bindData.embryoResidue}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "embryoResidue")
                  }}
                >
                  <Radio value={1}>有</Radio>
                  <Radio value={0}>无</Radio>
                </Radio.Group>
              </span>
            </div>
            <div className="paneldiv">
              <span>器械</span>
            </div>
            <div className="paneldiv">
              <span>术前器械完整:</span>
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
            <div className="paneldiv">
              <span>术后器械完整:</span>
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
