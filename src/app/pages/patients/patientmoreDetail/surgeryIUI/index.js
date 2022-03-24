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
  Drawer,
} from "antd"
import {
  PlusOutlined,
  MinusOutlined,
  EditFilled,
  CheckOutlined,
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
import Template from "@/app/components/normal/Template"

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
      showTemplate: false, //手术模板的显示
      oprationRecord: props.oprationRecord, //手术字段
      bindData: {},
      initSelect: [],
      medicationFlag: false,
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
    this.initIuiSelect()
    this.selectDrug() //模糊查询用药
  }
  //获取下拉框值
  initIuiSelect = () => {
    apis.Patients_surgery.initSelectiui().then((res) => {
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
    let { oprationRecord, eggRetrievalOperationMedicationParams } = this.state
    let record = null
    if (val) {
      record = val.charAt(val.length - 1) //取手术记录次数
    } else {
      record = oprationRecord.charAt(oprationRecord.length - 1) //取手术记录次数
    }
    apis.Patients_surgery.initSurgeryiui(this.props.store.select_one).then(
      (res) => {
        if (!checkArrisEmpty(res.data) && res.data.length > record - 1) {
          let ovumRecordData = res.data[record - 1]
          this.setState({
            bindData: handleDefault(res.data[record - 1], defaultData),
            eggRetrievalOperationMedicationParams: this.initCheckData(
              ovumRecordData.eggRetrievalOperationMedicationParams,
              eggRetrievalOperationMedicationParams
            ),
          })
        } else {
          //初始化添加数据
          this.setState({
            bindData: {
              ...defaultData,
              surgeryDate: todayString,
              startTime: moment().format("LT"),
              endTime: moment().format("LT"),
            },
          })
        }
      }
    )
  }
  //onChange事件
  setInheritVal = (val, param) => {
    let { bindData } = this.state
    let newTestData = Object.assign(bindData, { [param]: val })
    this.clear(param, newTestData, val)
    this.setState({
      bindData: newTestData,
    })
  }
  //清除带标志输入框
  clear = (param, newTestData, val) => {
    if (param === "repeatFeeding" && !val) {
      return (newTestData.repeatFeedingNumber = null)
    } else if (param === "injectSpermSuspension" && !val) {
      return (newTestData.spermSuspensionVolume = null)
    } else if (param === "injectSperm" && !val) {
      return (newTestData.spermVolume = null)
    } else if (param === "injectForwardSperm" && !val) {
      return (newTestData.forwardSpermVolume = null)
    }
  }
  //获取精子数据
  getSpermData = () => {
    let { bindData } = this.state
    this.setState({
      bindData: { ...bindData, injectForwardSperm: 1 },
    })
  }
  //删除IUI手术
  delete = () => {
    let { bindData } = this.state
    if (!bindData.uid) {
      message.success("删除成功")
      this.props.deleteItem()
    } else {
      apis.Patients_surgery.delSurgeryiui(bindData.uid).then((res) => {
        if (res.code === 200) {
          message.success("删除成功")
          this.props.deleteItem()
        } else {
          message.error(res.message)
        }
      })
    }
  }
  //新增,修改IUI手术
  save = () => {
    let { bindData, eggRetrievalOperationMedicationParams } = this.state
    let data = {
      ...bindData,
      eggRetrievalOperationMedicationParams: eggRetrievalOperationMedicationParams.filter(
        (item) => {
          return item.drugName
        }
      ),
    }
    data.patientParam = this.props.store.select_one
    let flag = data.uid ? true : false
    apis.Patients_surgery.addSurgeryiui(data).then((res) => {
      if (res.code === 200) {
        message.destroy()
        if (flag) {
          message.success("修改成功")
        } else {
          message.success("添加成功")
          this.props.store.initCard("patient")
        }
      } else {
        message.error(res.message)
      }
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
  // 手术模板的显示
  showTem = () => {
    this.setState({
      showTemplate: true,
    })
  }
  // 选择的手术模板
  checkTem = (data) => {
    this.setInheritVal(data, "surgeryPass")
    this.setState({
      showTemplate: false,
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
      drugeOption,
      ontoptInfoList,
      items,
      showTemplate,
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
    ]
    return (
      <div className="surgeryIUI">
        <DateTitleView
          flag={true}
          title={
            <div style={{ marginLeft: 15 }}>
              <span className="surgeryChecked">IUI手术</span>
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
                defaultValue={bindData.surgeryDate}
                value={
                  bindData.surgeryDate
                    ? moment(bindData.surgeryDate, dateFormatDate)
                    : moment(todayString, dateFormatDate)
                }
                onChange={(date, datestring) => {
                  this.setInheritVal(datestring, "surgeryDate")
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
            <div className="paneldiv">
              <span>术者</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.surgeryDoctor}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "surgeryDoctor")
                  }}
                >
                  {renderOptions(initSelect, "148")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>助手</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.executiveNurse}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "executiveNurse")
                  }}
                >
                  {renderOptions(initSelect, "149")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>核对</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.checker}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "checker")
                  }}
                >
                  {renderOptions(initSelect, "151")}
                </Select>
              </span>
            </div>
          </FlexItem>
          <FlexItem className="flexItem">
            <div className="paneldiv">
              <PanelTag title="" />
            </div>
            <div className="paneldiv">
              <span>授精管</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.inseminationDuct}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "inseminationDuct")
                  }}
                >
                  {renderOptions(initSelect, "150")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>批号</span>
              <span>
                <Input
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.batchNumber}
                  showArrow={false}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "batchNumber")
                  }}
                />
              </span>
            </div>
            <div className="paneldiv">
              <span>消毒液</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.disinfectant}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "disinfectant")
                  }}
                >
                  {renderOptions(initSelect, "171")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>器械</span>
            </div>
            <div className="paneldiv">
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
          </FlexItem>
          <FlexItem className="flexItem">
            <div className="paneldiv">
              <PanelTag title="" />
            </div>
            <div className="paneldiv">
              <span>授精时期</span>
              <span>
                <Radio.Group
                  value={bindData.inseminationPeriod}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "inseminationPeriod")
                  }}
                >
                  <Radio value={0}>排卵前</Radio>
                  <Radio value={1}>排卵后</Radio>
                </Radio.Group>
              </span>
            </div>
            <div className="paneldiv">
              <span>方式</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.inseminationMethod}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "inseminationMethod")
                  }}
                >
                  {renderOptions(initSelect, "147")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
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
                checked={bindData.clampCervix}
                onChange={(e) => {
                  this.setInheritVal(e.target.checked ? 1 : 0, "clampCervix")
                }}
              >
                钳夹宫颈
              </Checkbox>
              <Checkbox
                checked={bindData.metalProbe}
                onChange={(e) => {
                  this.setInheritVal(e.target.checked ? 1 : 0, "metalProbe")
                }}
              >
                金属探针
              </Checkbox>
              <Checkbox
                checked={bindData.repeatFeeding}
                onChange={(e) => {
                  this.setInheritVal(e.target.checked ? 1 : 0, "repeatFeeding")
                }}
              >
                反复进管
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
                          {renderOptions(initSelect, "148")}
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
              <PanelTag title="" />
            </div>
            <div className="paneldiv divmargin">
              <span>过程</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.surgeryProcess}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "surgeryProcess")
                  }}
                >
                  {renderOptions(initSelect, "154")}
                </Select>
              </span>
            </div>
            <div className="paneldiv divmargin">
              <span>出血</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.hemorrhage}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "hemorrhage")
                  }}
                >
                  {renderOptions(initSelect, "153")}
                </Select>
              </span>
            </div>
            <div className="paneldiv divmargin">
              <span>精准推注时间</span>
              <span>
                <TimePicker
                  value={
                    bindData.semenIntoUterusTime
                      ? moment(bindData.semenIntoUterusTime, dateFormat)
                      : moment(todayTime, dateFormat)
                  }
                />
              </span>
            </div>
            <div className="paneldiv divmargin">
              <span>进宫腔深度</span>
              <span>
                <Input
                  addonAfter="cm"
                  value={bindData.intoUterusDepth}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "intoUterusDepth")
                  }}
                />
              </span>
            </div>
            <div className="paneldiv divmargin">
              <span>导管血染</span>
              <span>
                <Switch
                  checked={bindData.catheterBloodStain}
                  onChange={(checked) => {
                    this.setInheritVal(checked ? 1 : 0, "catheterBloodStain")
                  }}
                />
              </span>
            </div>
            <div className="paneldiv divmargin">
              <span>阴道分泌物</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.vaginalDischarge}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "vaginalDischarge")
                  }}
                >
                  {renderOptions(initSelect, "153")}
                </Select>
              </span>
            </div>
            <div className="paneldiv divmargin">
              <span>宫颈粘液</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.cervicalMucus}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "cervicalMucus")
                  }}
                >
                  {renderOptions(initSelect, "153")}
                </Select>
              </span>
            </div>
            <div className="paneldiv divmargin">
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.spermSuspensionVolume}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "spermSuspensionVolume")
                  }}
                >
                  <Option value="精子悬念">精子悬念</Option>
                  <Option value="精液量">精液量</Option>
                </Select>
              </span>
              <span>
                <Input
                  addonAfter="ml"
                  value={bindData.spermVolume}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "spermVolume")
                  }}
                />
              </span>
            </div>
            <div className="paneldiv divmargin">
              <span>向前运动精子总数</span>
              <span>
                <Input
                  addonAfter="10^6"
                  value={bindData.forwardSpermVolume}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "forwardSpermVolume")
                  }}
                />
              </span>
            </div>
          </FlexItem>
          <FlexItem className="flexItem">
            <div className="paneldiv flexgrow">
              <span>
                <Button
                  type="primary"
                  style={{ marginRight: "15px" }}
                  onClick={this.showTem}
                >
                  模板
                </Button>
                手术经过
              </span>
              <Input
                style={{ flexGrow: 1 }}
                value={bindData.surgeryPass}
                onChange={(e) => {
                  this.setInheritVal(e.target.value, "surgeryPass")
                }}
              />
            </div>
          </FlexItem>
          <FlexItem className="flexItem">
            <div className="paneldiv">
              <PanelTag title="" />
            </div>
            <div>
              <span>周期结论</span>
              <span>
                <Select
                  style={{ width: 150, textAlign: "left" }}
                  value={bindData.periodicConclusion}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "periodicConclusion")
                  }}
                >
                  {renderOptions(initSelect, "146")}
                </Select>
              </span>
            </div>
          </FlexItem>
          <FlexItem className="flexItem">
            <div className="paneldiv flexgrow">
              <span>备注</span>
              <Input
                style={{ flexGrow: 1 }}
                value={bindData.conclusionNote}
                onChange={(e) => {
                  this.setInheritVal(e.target.value, "conclusionNote")
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
          {showTemplate ? (
            <Drawer
              visible={showTemplate}
              closable={false}
              width="800px"
              onClose={() => {
                this.setState({
                  showTemplate: false,
                })
              }}
            >
              {/* type为0代表是iui手术模板 */}
              <Template
                checkTem={(data) => this.checkTem(data)}
                type={0}
                titleTop="手术记录模板"
              />
            </Drawer>
          ) : null}
        </DateTitleView>
      </div>
    )
  }
}
