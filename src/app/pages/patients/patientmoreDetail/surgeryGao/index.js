import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import "./index.scss"
import {
  Input,
  DatePicker,
  Radio,
  Select,
  Checkbox,
  Button,
  Row,
  TimePicker,
  message,
  Divider,
  Switch,
} from "antd"
import { SwapOutlined } from "@ant-design/icons"
import PanelTag from "@/app/components/normal/PanelTag"
import { BaseTable } from "@/app/components/base/baseTable"
import { DateTitleView } from "@/app/components/normal/Title"
import { ThreeItem, FlexItem } from "@/app/components/base/baseForms.js"
import { checkArrisEmpty } from "@/app/utils/tool.js"
import {
  dateFormat,
  dateFormatDate,
  todayString,
  todayTime,
} from "@/app/utils/const.js"
import moment from "moment"
import { depObj } from "@/app/utils/tool"
import apis from "@/app/utils/apis"
import { handleDefault } from "@/app/utils/tool.js"
import { defaultData } from "./defaultData"

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      directionTag: true, //左右切换
      oprationRecord: props.oprationRecord, //手术字段
      bindData: {}, //模板数据
      initSelect: [],
      epididymisData: [], //附睾数据
      testisData: [], //睾丸数据
      testisRecord: [
        {
          side: "左侧",
          key: 0,
          testiclesCollectMaterial: null,
          testiclesCollectMaterialNumber: null,
          testiclesVaricoseSeminiferousTubules: "见",
          testiclesElse: null,
          testiclesFeed: null,
          testiclesSuction: null,
          testiclesSeen: "多见活动精子",
          consumableName: "多见活动精子",
        },
        {
          side: "右侧",
          key: 1,
          testiclesCollectMaterial: null,
          testiclesCollectMaterialNumber: null,
          testiclesVaricoseSeminiferousTubules: "见",
          testiclesElse: null,
          testiclesFeed: null,
          testiclesSuction: null,
          testiclesSeen: "多见活动精子",
          consumableName: "多见活动精子",
        },
      ],
      epididymisRecord: [
        {
          side: "左侧",
          key: 0,
          epididymisFeed: null,
          epididymisSuction: null,
          epididymisCollectMaterial: null,
          epididymisCollectMaterialNumber: null,
          epididymisVaricoseSeminiferousTubules: null,
          epididymisSeen: null,
          epididymisPunctureFluid: null,
          epididymisColor: "乳白",
          epididymisLabTest: "见",
          lepididymisElse: null,
          testiclesSeen: "多见活动精子",
          consumableName: "多见活动精子",
        },
        {
          side: "右侧",
          key: 1,
          epididymisFeed: null,
          epididymisSuction: null,
          epididymisCollectMaterial: null,
          epididymisCollectMaterialNumber: null,
          epididymisVaricoseSeminiferousTubules: null,
          epididymisSeen: null,
          epididymisPunctureFluid: null,
          epididymisColor: "乳白",
          epididymisLabTest: "见",
          lepididymisElse: null,
          testiclesSeen: "多见活动精子",
          consumableName: "多见活动精子",
        },
      ],
      punctureShow: true, //穿刺针等是否显示
    }
  }
  componentDidMount = () => {
    this.props.onRef && this.props.onRef(this)
    this.getInitData()
    this.initGaoSelect()
  }
  //初始化下拉框
  initGaoSelect = () => {
    apis.Patients_surgery.initSelectgao().then((res) => {
      this.setState({
        initSelect: res.data,
      })
    })
  }
  //初始化睾穿手术
  getInitData = (val) => {
    let {
      oprationRecord,
      epididymisRecord,
      testisRecord,
      bindData,
    } = this.state
    let record = null
    if (val) {
      record = val.charAt(val.length - 1) //取手术记录次数
    } else {
      record = oprationRecord.charAt(oprationRecord.length - 1) //取手术记录次数
    }
    apis.Patients_surgery.initSurgerygao(this.props.store.select_one).then(
      (res) => {
        if (!checkArrisEmpty(res.data) && res.data.length > record - 1) {
          res.data[record - 1].punctureMethod = res.data[record - 1]
            .punctureMethod
            ? res.data[record - 1].punctureMethod
            : "睾丸穿刺"
          let recordData = handleDefault(res.data[record - 1], defaultData)
          this.setState({
            bindData: recordData,
            epididymisData: recordData.testicularPunctureEpididymisParamList,
            testisData: recordData.testicularPunctureTesticlesParamList,
          })
          this.punctureShow(
            res.data[record - 1].punctureMethod,
            "punctureMethod"
          ) //判断穿刺针等是否显示
        } else {
          depObj(this.state.epididymisData, epididymisRecord)
          depObj(this.state.testisData, testisRecord)
          //初始化添加数据
          this.setState({
            bindData: {
              ...defaultData,
              date: todayString,
              startTime: moment().format("LT"),
              endTime: moment().format("LT"),
              epididymisData: [...epididymisRecord],
              testisData: [...testisRecord],
              punctureMethod: "睾丸穿刺",
            },
          })
          this.showTable(bindData.punctureMethod, "睾丸")
        }
      }
    )
  }
  //onChange事件
  setInheritVal = (val, param) => {
    let { bindData } = this.state
    let newTestData = Object.assign(bindData, { [param]: val })
    this.punctureShow(val, param)
    this.emptyData(param)
    this.setState({
      bindData: newTestData,
    })
  }
  // 穿刺针等是否显示
  punctureShow = (val, parm) => {
    let arr = ["附睾穿刺", "睾丸穿刺", "附睾穿刺+睾丸穿刺"]
    if (parm === "punctureMethod") {
      if (arr.includes(val)) {
        this.setState({
          punctureShow: true,
        })
      } else {
        this.setState({
          punctureShow: false,
        })
      }
    }
  }
  // 穿刺针改变的是否清空后面的编号等内容
  emptyData = (parm) => {
    let { bindData } = this.state
    if (parm === "punctureNeedle") {
      bindData.batchNumber = null
      bindData.punctureElse = null
    }
  }
  //删除手术按钮
  delete = () => {
    let { bindData } = this.state
    if (!bindData.uid) {
      this.props.deleteItem()
      message.success("删除成功")
    } else {
      apis.Patients_surgery.delSurgerygao(bindData.uid).then((res) => {
        if (res.code === 200) {
          this.props.deleteItem()
          message.success("删除成功")
        } else {
          message.error(res.message)
        }
      })
    }
  }
  //新增,修改睾穿手术
  save = () => {
    let { bindData, epididymisData, testisData } = this.state
    let data = {
      ...bindData,
      testicularPunctureEpididymisParamList: epididymisData,
      testicularPunctureTesticlesParamList: testisData,
    }
    data.patientParam = this.props.store.select_one
    let flag = data.uid ? true : false
    apis.Patients_surgery.addSurgerygao(data).then((res) => {
      message.destroy()
      if (flag) {
        message.success("修改成功")
      } else {
        message.success("添加成功")
        this.props.store.initCard("patient")
      }
    })
  }
  // 修改表格附睾穿刺
  setpididymis = (value, param, index) => {
    let { epididymisData } = this.state
    let arr = epididymisData
    arr.map((item, itemIndex) => {
      if (itemIndex === index) {
        item[param] = value
      }
      return item
    })
    this.setState({
      epididymisData: [...arr],
    })
  }
  // 修改表格睾丸穿刺
  settestis = (value, param, index) => {
    let { testisData } = this.state
    let arr = testisData
    arr.map((item, itemIndex) => {
      if (itemIndex === index) {
        item[param] = value
      }
      return item
    })
    this.setState({
      testisData: [...arr],
    })
  }
  changeBlood = (text, record, parm) => {
    let { epididymisData, testisData } = this.state
    if (text === "见") {
      record[parm] = "未见"
    } else {
      record[parm] = "见"
    }
    this.setState({
      epididymisData,
      testisData,
    })
  }
  // 查询是否需要显示
  showTable = (parm, val) => {
    let data = false
    if (parm && parm.indexOf(val) !== -1) {
      data = true
    } else {
      data = false
    }
    return data
  }
  render() {
    let {
      bindData,
      initSelect,
      epididymisData,
      testisData,
      punctureShow,
    } = this.state
    let { renderOptions } = this.props.moredetail
    let epididymisColumns = [
      {
        title: "附睾穿刺",
        dataIndex: "side",
        key: "side",
      },
      {
        title: "进针(次)",
        dataIndex: "epididymisFeed",
        key: "epididymisFeed",
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.epididymisFeed}
              onChange={(e) => {
                this.setpididymis(e.target.value, "epididymisFeed", index)
              }}
            />
          )
        },
      },
      {
        title: "穿刺液(ml)",
        dataIndex: "epididymisPunctureFluid",
        key: "epididymisPunctureFluid",
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.epididymisPunctureFluid}
              onChange={(e) => {
                this.setpididymis(
                  e.target.value,
                  "epididymisPunctureFluid",
                  index
                )
              }}
            />
          )
        },
      },
      {
        title: "颜色",
        dataIndex: "epididymisColor",
        key: "epididymisColor",
        render: (text, record, index) => {
          return (
            <Select
              style={{ width: "98%" }}
              value={record.epididymisColor}
              onChange={(val) => {
                this.setpididymis(val, "epididymisColor", index)
              }}
            >
              {renderOptions(initSelect, "142")}
            </Select>
          )
        },
      },
      {
        title: "抽吸(次)",
        dataIndex: "epididymisSuction",
        key: "epididymisSuction",
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.epididymisSuction}
              onChange={(e) => {
                this.setpididymis(e.target.value, "epididymisSuction", index)
              }}
            />
          )
        },
      },
      {
        title: "实验室检查",
        dataIndex: "epididymisLabTest",
        key: "epididymisLabTest",
        render: (text, record) => {
          return (
            <div>
              <span>{text ? text : "见"}</span>
              <SwapOutlined
                style={{ color: "#59b4f4" }}
                onClick={() =>
                  this.changeBlood(text, record, "epididymisLabTest")
                }
              />
            </div>
          )
        },
      },
      {
        title: "所见",
        dataIndex: "consumableName",
        key: "consumableName",
        render: (text, record, index) => {
          return (
            <Select
              value={record.consumableName}
              defaultValue="多见活动精子"
              style={{ width: "90%" }}
              onChange={(val) =>
                this.setpididymis(val, "consumableName", index)
              }
            >
              {renderOptions(initSelect, "304")}
            </Select>
          )
        },
      },
      {
        title: "其他",
        dataIndex: "lepididymisElse",
        key: "lepididymisElse",
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.lepididymisElse}
              onChange={(e) => {
                this.setpididymis(e.target.value, "lepididymisElse", index)
              }}
            />
          )
        },
      },
    ] //附睾表头
    let testisColumns = [
      {
        title:
          bindData.punctureMethod === "睾丸切开"
            ? "睾丸切开"
            : bindData.punctureMethod === "显微附睾穿刺" ||
              bindData.punctureMethod === "显微附睾切开"
            ? "显微切开穿刺"
            : "睾丸穿刺",
        dataIndex: "side",
        key: "side",
      },
      {
        title: "进针(次)",
        dataIndex: "testiclesFeed",
        key: "testiclesFeed",
        className:
          bindData.punctureMethod === "睾丸穿刺" ||
          bindData.punctureMethod === "附睾穿刺+睾丸穿刺"
            ? null
            : "disShow",
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.testiclesFeed}
              onChange={(e) => {
                this.settestis(e.target.value, "testiclesFeed", index)
              }}
            />
          )
        },
      },
      {
        title: "抽吸(次)",
        dataIndex: "testiclesSuction",
        key: "testiclesSuction",
        className:
          bindData.punctureMethod === "睾丸穿刺" ||
          bindData.punctureMethod === "睾丸切开" ||
          bindData.punctureMethod === "附睾穿刺+睾丸穿刺"
            ? null
            : "disShow",
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.testiclesSuction}
              onChange={(e) => {
                this.settestis(e.target.value, "testiclesSuction", index)
              }}
            />
          )
        },
      },
      {
        title: "取材数(块)",
        dataIndex: "testiclesCollectMaterial",
        key: "testiclesCollectMaterial",
        className: bindData.punctureMethod === "睾丸切开" ? "disShow" : null,
        render: (text, record, index) => {
          return (
            <Input
              value={record.testiclesCollectMaterial}
              style={{ width: "90%" }}
              onChange={(e) =>
                this.settestis(
                  e.target.value,
                  "testiclesCollectMaterial",
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "取材（mm^3)",
        dataIndex: "testiclesCollectMaterialNumber",
        key: "testiclesCollectMaterialNumber",
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.testiclesCollectMaterialNumber}
              onChange={(e) => {
                this.settestis(
                  e.target.value,
                  "testiclesCollectMaterialNumber",
                  index
                )
              }}
            />
          )
        },
      },
      {
        title: "曲细精管情况",
        dataIndex: "testiclesVaricoseSeminiferousTubules",
        key: "testiclesVaricoseSeminiferousTubules",
        render: (text, record) => {
          return (
            <div>
              <span>{text ? text : "见"}</span>
              <SwapOutlined
                style={{ color: "#59b4f4" }}
                onClick={() =>
                  this.changeBlood(
                    text,
                    record,
                    "testiclesVaricoseSeminiferousTubules"
                  )
                }
              />
            </div>
          )
        },
      },
      {
        title: "所见",
        dataIndex: "testiclesSeen",
        key: "testiclesSeen",
        className:
          bindData.punctureMethod === "睾丸穿刺" ||
          bindData.punctureMethod === "附睾穿刺+睾丸穿刺"
            ? null
            : "disShow",
        render: (text, record, index) => {
          return (
            <Select
              style={{ width: "98%" }}
              value={record.testiclesSeen}
              defaultValue="多见活动精子"
              onChange={(val) => {
                this.settestis(val, "testiclesSeen", index)
              }}
            >
              {renderOptions(initSelect, "304")}
            </Select>
          )
        },
      },
      {
        title: "其他",
        dataIndex: "testiclesElse",
        key: "testiclesElse",
        className:
          bindData.punctureMethod === "睾丸穿刺" ||
          bindData.punctureMethod === "附睾穿刺+睾丸穿刺"
            ? "disShow"
            : null,
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.testiclesElse}
              onChange={(e) => {
                this.settestis(e.target.value, "testiclesElse", index)
              }}
            />
          )
        },
      },
    ] //睾丸表头
    return (
      <div className="surgeryGao">
        <DateTitleView
          flag={true}
          title={
            <div style={{ marginLeft: 15 }}>
              <span className="surgeryChecked">取精手术</span>
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
                  {renderOptions(initSelect, "128")}
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
                  {renderOptions(initSelect, "129")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>镜检者</span>
              <span>
                <Select
                  style={{ width: 100, textAlign: "left" }}
                  value={bindData.microscopist}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "microscopist")
                  }}
                >
                  {renderOptions(initSelect, "130")}
                </Select>
              </span>
            </div>
          </FlexItem>
          <FlexItem className="flexItem">
            <div className="paneldiv">
              <PanelTag title="" />
            </div>
            <div className="paneldiv">
              <span>诊断</span>
            </div>
            <div className="paneldiv">
              <span>术前</span>
              <span>
                <Select
                  style={{ width: 165 }}
                  value={bindData.preoperativeDiagnosis}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "preoperativeDiagnosis")
                  }}
                >
                  {renderOptions(initSelect, "135")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>术后</span>
              <span>
                <Select
                  style={{ width: 165 }}
                  value={bindData.postoperativeDiagnosis}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "postoperativeDiagnosis")
                  }}
                >
                  {renderOptions(initSelect, "136")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>消毒药物</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.disinfectant}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "disinfectant")
                  }}
                >
                  {renderOptions(initSelect, "132")}
                </Select>
              </span>
            </div>
          </FlexItem>
          <FlexItem className="flexItem">
            <div className="paneldiv">
              <PanelTag title="" />
            </div>
            <div className="paneldiv">
              <span>精索阻滞局部麻醉</span>
            </div>
            <div className="paneldiv">
              <span>用药</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.narcotic}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "narcotic")
                  }}
                >
                  {renderOptions(initSelect, "133")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>麻醉师</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.anesthesiologist}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "anesthesiologist")
                  }}
                >
                  {renderOptions(initSelect, "131")}
                </Select>
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
              <span>
                <Select
                  value={bindData.punctureMethod}
                  style={{ width: 200 }}
                  onChange={(value) => {
                    this.setInheritVal(value, "punctureMethod")
                  }}
                >
                  {renderOptions(initSelect, "137")}
                </Select>
              </span>
            </div>
            {punctureShow ? (
              <>
                <div className="paneldiv">
                  <span>穿刺针</span>
                  <span>
                    <Select
                      style={{ width: 150 }}
                      value={bindData.punctureNeedle}
                      onChange={(value) => {
                        this.setInheritVal(value, "punctureNeedle")
                      }}
                    >
                      {renderOptions(initSelect, "138")}
                    </Select>
                  </span>
                </div>
                <div className="paneldiv">
                  <span>批号</span>
                  <span>
                    <Input
                      style={{ width: 150 }}
                      value={bindData.batchNumber}
                      onChange={(e) => {
                        this.setInheritVal(e.target.value, "batchNumber")
                      }}
                    />
                  </span>
                </div>
                <div className="paneldiv">
                  <span>其他</span>
                  <span>
                    <Input
                      style={{ flex: 1 }}
                      value={bindData.punctureElse}
                      onChange={(e) => {
                        this.setInheritVal(e.target.value, "punctureElse")
                      }}
                    />
                  </span>
                </div>
              </>
            ) : null}
          </FlexItem>
          <div>
            {bindData.punctureMethod ? (
              <>
                {this.showTable(bindData.punctureMethod, "附睾") ? (
                  <div className="flexgrow">
                    <BaseTable
                      style={{ marginLeft: 10 }}
                      columns={epididymisColumns}
                      dataSource={epididymisData}
                      pagination={false}
                      rowKey={(record) => record.uid}
                    />
                  </div>
                ) : null}
                {this.showTable(bindData.punctureMethod, "睾丸") ||
                this.showTable(bindData.punctureMethod, "显微") ? (
                  <div className="flexgrow">
                    <BaseTable
                      style={{ marginLeft: 10 }}
                      columns={testisColumns}
                      dataSource={testisData}
                      pagination={false}
                      rowKey={(record) => record.uid}
                    />
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
          <FlexItem className="flexItem">
            <div className="paneldiv">
              <span>手术</span>
              <span>
                <Select
                  style={{ width: 80 }}
                  value={bindData.process}
                  onChange={(value) => {
                    this.setInheritVal(value, "process")
                  }}
                >
                  {renderOptions(initSelect, "143")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>术中出血</span>
              <span>
                <Radio.Group
                  value={bindData.intraoperativeBleeding}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "intraoperativeBleeding")
                  }}
                >
                  <Radio value="有">有</Radio>
                  <Radio value="无">无</Radio>
                </Radio.Group>
              </span>
            </div>
            <div className="paneldiv">
              <span>量</span>
              <span>
                <Input
                  addonAfter="ml"
                  style={{ width: 150 }}
                  value={bindData.intraoperativeBleedingVolume}
                  onChange={(e) => {
                    this.setInheritVal(
                      e.target.value,
                      "intraoperativeBleedingVolume"
                    )
                  }}
                />
              </span>
            </div>
            <div className="paneldiv">
              <span>皮下血肿</span>
              <span>
                <Input
                  style={{ width: 44 }}
                  value={bindData.subcutaneousHematomaLength}
                  onChange={(e) => {
                    this.setInheritVal(
                      e.target.value,
                      "subcutaneousHematomaLength"
                    )
                  }}
                />
                <span className="spanTitle">*</span>
                <Input
                  style={{ width: 44 }}
                  value={bindData.subcutaneousHematomaWidth}
                  onChange={(e) => {
                    this.setInheritVal(
                      e.target.value,
                      "subcutaneousHematomaWidth"
                    )
                  }}
                />
                <span className="spanTitle">*</span>
                <Input
                  style={{ width: 44 }}
                  value={bindData.subcutaneousHematomaHeight}
                  onChange={(e) => {
                    this.setInheritVal(
                      e.target.value,
                      "subcutaneousHematomaHeight"
                    )
                  }}
                />
              </span>
            </div>
            <div className="paneldiv">
              <span>
                <Checkbox
                  checked={bindData.pains}
                  onChange={(e) => {
                    this.setInheritVal(e.target.checked ? 1 : 0, "pains")
                  }}
                >
                  疼痛
                </Checkbox>
              </span>
            </div>
          </FlexItem>
          <FlexItem className="flexItem">
            <div className="paneldiv">
              <span>不良反应</span>
              <span>
                <Radio.Group
                  value={bindData.adverseReaction}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "adverseReaction")
                  }}
                >
                  <Radio value="有">有</Radio>
                  <Radio value="无">无</Radio>
                </Radio.Group>
              </span>
            </div>
            {bindData.adverseReaction === "有" ? (
              <div className="paneldiv  flexgrow">
                <span>说明</span>
                <span style={{ flexGrow: 1 }}>
                  <Input
                    style={{ width: "98%" }}
                    value={bindData.adverseReactionDescription}
                    onChange={(e) => {
                      this.setInheritVal(
                        e.target.value,
                        "adverseReactionDescription"
                      )
                    }}
                  />
                </span>
              </div>
            ) : null}
          </FlexItem>
          <FlexItem className="flexItem">
            <div className="paneldiv">
              <span>手术目的</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.aim}
                  onChange={(value) => {
                    this.setInheritVal(value, "aim")
                  }}
                >
                  {renderOptions(initSelect, "144")}
                </Select>
              </span>
            </div>
            <div className="paneldiv flexgrow">
              <span>小结</span>
              <span style={{ flexGrow: 1 }}>
                <Input
                  style={{ width: "98%" }}
                  value={bindData.summary}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "summary")
                  }}
                />
              </span>
            </div>
          </FlexItem>
          <FlexItem className="flexItem">
            <div className="paneldiv flexgrow">
              <span>手术经过</span>
              <Input
                style={{ flexGrow: 1 }}
                value={bindData.surgicalProcedure}
                onChange={(e) => {
                  this.setInheritVal(e.target.value, "surgicalProcedure")
                }}
              />
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
            <div className="paneldiv">
              <span>穿刺物处理:</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.punctureDisposal}
                  onChange={(value) => {
                    this.setInheritVal(value, "punctureDisposal")
                  }}
                >
                  {renderOptions(initSelect, "145")}
                </Select>
              </span>
            </div>
            <div className="paneldiv">
              <span>清点者</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.inventor}
                  onChange={(value) => {
                    this.setInheritVal(value, "inventor")
                  }}
                >
                  {renderOptions(initSelect, "303")}
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
