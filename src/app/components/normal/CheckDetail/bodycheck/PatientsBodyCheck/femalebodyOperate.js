import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { Input, Switch, Checkbox, DatePicker, Divider, message } from "antd"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import { DateTitleView } from "@/app/components/normal/Title"
import { BaseTable } from "@/app/components/base/baseTable"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { FontInput } from "@/app/components/base/baseFontInput"
import { DashBtn } from "@/app/components/base/baseBtn.js"
import { todayString, dateFormatDate } from "@/app/utils/const.js"
import { checkArrisEmpty } from "@/app/utils/tool.js"
import styled from "styled-components"
import moment from "moment"
import apis from "@/app/utils/apis"

const SpanTitle = styled.span`
  margin-left: 15px;
`
export default
@inject("store", "inspection")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      operateData: props.operateData,
      BMI: null,
      waistHipRatio: null,
      defaultchose: [],
      exceptionalProjectDTOList: [],
      isScore: false
    }
  }
  componentDidMount() {
    let { operateData } = this.state
    this.setState({
      operateData,
      BMI: operateData.bmi,
      waistHipRatio: operateData.waistHipRatio,
      exceptionalProjectDTOList: operateData.exceptionalProjectDTOList,
      defaultchose: operateData.exceptionalProjectDTOList.map((item) => {
        return item.exceptionalProjectName
      }),
    })
  }
  close = () => {
    this.props.getData()
    this.props.close()
  }

  selectPatient = () => {
    let { selectPatient } = this.props.inspection
    let { select_one } = this.props.store
    return selectPatient(select_one, this.props.sex)
  }

  //获取上次最新数据
  getLast = () => {
    apis.ManCheck.getlastwomanphysicalcheck(this.selectPatient()).then(
      (res) => {
        let data = res.data
        if (checkArrisEmpty(data)) {
          message.destroy()
          message.error("无最新一条体格检查")
          this.emptyLast()
        } else {
          data.saveDate = todayString
          data.uid = null
          this.setState({
            operateData: data,
            BMI: data.bmi,
            waistHipRatio: data.waistHipRatio,
            exceptionalProjectDTOList: data.exceptionalProjectDTOList,
            defaultchose: data.exceptionalProjectDTOList.map((item) => {
              return item.exceptionalProjectName
            }),
          })
        }
      }
    )
  }
  //清空数据
  emptyLast = () => {
    this.setState({
      operateData: { special: [], exceptionalProjectDTOList: [] },
      BMI: null,
      waistHipRatio: null,
      defaultchose: [],
      exceptionalProjectDTOList: [],
    })
  }
  //输入框值的变化
  setInheritVal = (val, param) => {
    let { operateData } = this.state
    //处理BMI和腰臀比
    this.handleData(val, param)
    this.setState({
      operateData: { ...operateData, [param]: val },
    })
  }
  //开关
  setSwitch = (val, param) => {
    let { operateData } = this.state
    let arr = operateData.special
    if (val) {
      arr.push(param)
    } else {
      var index = arr.indexOf(param)
      if (index > -1) {
        arr.splice(index, 1)
      }
    }
    this.setState({
      operateData: {
        ...operateData,
        special: arr,
      },
    })
  }
  //checkbox
  setCheckbox = (val) => {
    let { defaultchose, exceptionalProjectDTOList } = this.state
    defaultchose = val
    this.setState({
      defaultchose,
    })
    let existArr = exceptionalProjectDTOList
    let newArr = []
    if (val.length > 0) {
      val.forEach((item, i) => {
        newArr.push({
          exceptionalProjectName: item,
          explain: "",
          id: i + 1,
        })
      })
    }
    newArr.forEach((item) => {
      existArr.forEach((itemcopy) => {
        if (item.exceptionalProjectName === itemcopy.exceptionalProjectName) {
          item.explain = itemcopy.explain
        }
      })
    })
    this.setState({
      exceptionalProjectDTOList: newArr,
    })
  }
  //checkbox的说明
  explain = (val, id, key) => {
    let { exceptionalProjectDTOList } = this.state
    exceptionalProjectDTOList.forEach((item, index) => {
      if (index === key) {
        item.explain = val
      }
    })
    this.setState({
      exceptionalProjectDTOList,
    })
  }
  //处理BMI和腰臀比
  handleData = (val, param) => {
    let { operateData } = this.state
    if (param === "weight") {
      if (operateData.height && val) {
        this.setState({
          BMI: (
            val /
            ((operateData.height * operateData.height) / 10000)
          ).toPrecision(3),
        })
      } else {
        this.setState({
          BMI: null,
        })
      }
    } else if (param === "height") {
      if (operateData.weight && val) {
        this.setState({
          BMI: (operateData.weight / ((val * val) / 10000)).toPrecision(3),
        })
      } else {
        this.setState({
          BMI: null,
        })
      }
    } else if (param === "girth") {
      if (operateData.hipMeasurement && val) {
        this.setState({
          waistHipRatio: (val / operateData.hipMeasurement).toPrecision(3),
        })
      } else {
        this.setState({
          waistHipRatio: null,
        })
      }
    } else if (param === "hipMeasurement") {
      if (operateData.girth && val) {
        this.setState({
          waistHipRatio: (operateData.girth / val).toPrecision(3),
        })
      } else {
        this.setState({
          waistHipRatio: null,
        })
      }
    }
  }
  //提交修改和添加
  submit = () => {
    let {
      operateData,
      BMI,
      waistHipRatio,
      exceptionalProjectDTOList,
    } = this.state
    let param = {
      ...operateData,
      saveDate: operateData.saveDate ? operateData.saveDate : todayString,
      bmi: BMI,
      waistHipRatio: waistHipRatio,
      exceptionalProjectDTOList: exceptionalProjectDTOList,
      patientParam: this.selectPatient(),
    }
    if (operateData.uid) {
      //修改方法
      apis.ManCheck.updatewomanphysicalcheck(param).then((res) => {
        message.success("修改成功")
        this.props.getData()
        this.props.close()
      })
    } else {
      //添加方法
      apis.ManCheck.savewomanphysicalcheck(param).then((res) => {
        message.success("添加成功")
        this.props.getData()
        this.props.close()
      })
    }
  }

  render() {
    let { typeTitle, handleTag } = this.props
    let { abnormalProject } = this.props.inspection
    let {
      operateData,
      defaultchose,
      BMI,
      waistHipRatio,
      exceptionalProjectDTOList
    } = this.state
    let abnormalColumns = [
      {
        title: "异常项目",
        align: "center",
        dataIndex: "exceptionalProjectName",
        key: "exceptionalProjectName",
        width: 120,
      },
      {
        title: "说明",
        dataIndex: "explain",
        key: "explain",
        align: "center",
        width: "100vw",
        render: (text, record, index) => {
          return (
            <div>
              <Input
                style={{ width: "98%" }}
                value={text}
                onChange={(e) => this.explain(e.target.value, record.id, index)}
              />
            </div>
          )
        },
      },
    ]
    return (
      <DateTitleView
        title={typeTitle}
        selectOption={
          <div className="selectOptions">
            <span className="checkdate">检查日期:</span>
            {!operateData.uid ? (
              <span>
                <DatePicker
                  style={{ width: 150 }}
                  allowClear={false}
                  value={
                    operateData.saveDate
                      ? moment(operateData.saveDate, dateFormatDate)
                      : moment(todayString, dateFormatDate)
                  }
                  onChange={(date, datestring) => {
                    this.setInheritVal(datestring, "saveDate")
                  }}
                />
              </span>
            ) : (
              <span>{operateData.saveDate}</span>
            )}
          </div>
        }
        subtitle={
          <>
            <CheckOutlined
              style={{ color: "#59B4F4", marginRight: 20 }}
              onClick={this.submit}
            />
            <CloseOutlined style={{ color: "red" }} onClick={this.close} />
          </>
        }
        style={{ marginRight: 0 }}
      >
        <div className="divider">
          <Divider />
        </div>
        <div className="content">
          <FlexItem>
            <div>
              <span>T:</span>
              <span>
                <FontInput
                  addonAfter="℃"
                  style={{ width: "120px" }}
                  value={operateData.temperature}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "temperature")
                  }}
                />
              </span>
            </div>
            <div>
              <span>P:</span>
              <span>
                <FontInput
                  addonAfter="次/分"
                  style={{ width: "120px" }}
                  value={operateData.pulse}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "pulse")
                  }}
                />
              </span>
            </div>
            <div>
              <span>R:</span>
              <span>
                <FontInput
                  addonAfter="次/分"
                  style={{ width: "120px" }}
                  value={operateData.respiration}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "respiration")
                  }}
                />
              </span>
            </div>
            <div>
              <span>BP:</span>
              <span>
                <FontInput
                  value={operateData.systolicBloodPressure}
                  style={{ width: 50 }}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "systolicBloodPressure")
                  }}
                />
                /
                <FontInput
                  style={{ marginLeft: 0, width: 130 }}
                  addonAfter="mmHg"
                  value={operateData.diastolicBloodPressure}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "diastolicBloodPressure")
                  }}
                />
              </span>
            </div>
            {handleTag ? (
              operateData.uid ? (
                <div>
                  <DashBtn onClick={this.emptyLast}>
                    <span>清空</span>
                  </DashBtn>
                </div>
              ) : (
                <div>
                  <DashBtn onClick={this.getLast}>
                    <span>获取</span>
                  </DashBtn>
                </div>
              )
            ) : null}
          </FlexItem>
          <FlexItem>
            <div>
              <span>身高:</span>
              <span>
                <FontInput
                  addonAfter="cm"
                  value={operateData.height}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "height")
                  }}
                />
              </span>
            </div>
            <div>
              <span>体重:</span>
              <span>
                <FontInput
                  addonAfter="Kg"
                  value={operateData.weight}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "weight")
                  }}
                />
              </span>
            </div>
            <div>
              <span>BMI:</span>
              <span className="span_underline">{BMI}</span>
            </div>
            <div>
              <span>腰围:</span>
              <span>
                <FontInput
                  addonAfter="cm"
                  value={operateData.girth}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "girth")
                  }}
                />
              </span>
            </div>
            <div>
              <span>臀围:</span>
              <span>
                <FontInput
                  addonAfter="cm"
                  value={operateData.hipMeasurement}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "hipMeasurement")
                  }}
                />
              </span>
            </div>
            <div>
              <span>腰臂比:</span>
              <span className="span_underline">{waistHipRatio}</span>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span style={{ color: "#59b4f4" }}>特殊</span>
              <SpanTitle>
                痤疮:
                <Switch
                  checked={operateData.special.includes("痤疮")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "痤疮")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                脱发:
                <Switch
                  checked={operateData.special.includes("脱发")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "脱发")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                溢乳:
                <Switch
                  checked={operateData.special.includes("溢乳")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "溢乳")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                黑棘皮症:
                <Switch
                  checked={operateData.special.includes("黑棘皮症")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "黑棘皮症")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                F-G多毛
                <Switch
                  checked={operateData.special.includes("F-G多毛")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "F-G多毛")
                    this.setInheritVal(checked ? 1 : 0, "fgPolychromeScoreFlg")
                  }}
                />
                <span style={{ marginLeft: "3px" }}>评分:</span>
                <Input
                  disabled={!operateData.special.includes("F-G多毛")}
                  style={{ width: 70 }}
                  value={operateData.fgPolychromeScore}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "fgPolychromeScore")
                  }}
                />
              </SpanTitle>
            </div>
            <div>
              <span>疼痛评分:</span>
              <Input
                style={{ width: 70 }}
                value={operateData.painScore}
                onChange={(e) => {
                  this.setInheritVal(e.target.value, "painScore")
                }}
              />
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span style={{ textAlign: "left" }}>
                <Checkbox.Group
                  options={abnormalProject}
                  value={defaultchose}
                  onChange={(checked, checkedValue) => {
                    this.setCheckbox(checked)
                  }}
                />
              </span>
            </div>
            <div style={{ width: "100%" }}>
              <span>补充说明</span>
              <Input 
                value={operateData.additionalInformation}
                style={{ width: "90%" }} 
                onChange={(e) => {
                  this.setInheritVal(e.target.value, "additionalInformation")
                }}
              />
            </div>
            <div>
              <span>
                <BaseTable
                  style={{ marginRight: 10 }}
                  columns={abnormalColumns}
                  dataSource={exceptionalProjectDTOList}
                  pagination={false}
                  rowKey={(record) => record.uid}
                />
              </span>
            </div>
          </FlexItem>
        </div>
      </DateTitleView>
    )
  }
}
