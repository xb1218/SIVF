import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import {
  Input,
  Switch,
  Checkbox,
  DatePicker,
  Divider,
  message,
  Radio,
} from "antd"
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
      sexualCharacteristics: props.operateData.sexualCharacteristics,
      sexualException: props.operateData.sexualException,
      defaultchose: [], //默认的复选框
      exceptionalProjectDTOList: [],
    }
  }
  componentDidMount() {
    let { operateData } = this.props
    let exceptionalProjectDTOList = operateData.exceptionalProjectDTOList
      ? operateData.exceptionalProjectDTOList
      : []
    let sexualCharacteristics =
      checkArrisEmpty(operateData.sexualException) &&
      checkArrisEmpty(operateData.sexualCharacteristics)
        ? ["喉结", "阴毛", "乳房", "胡须"]
        : operateData.sexualCharacteristics
    let sexualException = checkArrisEmpty(operateData.sexualException)
      ? []
      : operateData.sexualException
    this.setState({
      operateData,
      sexualCharacteristics,
      sexualException,
      exceptionalProjectDTOList,
      defaultchose: exceptionalProjectDTOList.map((item) => {
        return item.exceptionalProjectName
      }),
    })
  }
  //关闭
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
    apis.ManCheck.getlastmanphysicalcheck(this.selectPatient()).then((res) => {
      let data = res.data
      if (checkArrisEmpty(data)) {
        message.destroy()
        message.error("无最新一条体格检查")
        // this.emptyLast()
      } else {
        data.saveDate = todayString
        data.uid = null
        let exceptionalProjectDTOList = data.exceptionalProjectDTOList
          ? data.exceptionalProjectDTOList
          : []
        let sexualCharacteristics = data.sexualCharacteristics
          ? data.sexualCharacteristics
          : []
        let sexualException = data.sexualException ? data.sexualException : []
        this.setState({
          operateData: data,
          sexualCharacteristics,
          sexualException,
          exceptionalProjectDTOList,
          defaultchose: exceptionalProjectDTOList.map((item) => {
            return item.exceptionalProjectName
          }),
        })
      }
    })
  }
  //清空数据
  emptyLast = () => {
    this.setState({
      operateData: {
        sexualCharacteristics: [],
        sexualException: [],
        exceptionalProjectDTOList: [],
      },
      sexualCharacteristics: [],
      sexualException: [],
      defaultchose: [],
      exceptionalProjectDTOList: [],
    })
  }
  //输入框值的变化
  setInheritVal = (val, param) => {
    let { operateData } = this.state
    this.setState({
      operateData: { ...operateData, [param]: val },
    })
  }
  //开关，
  setSwitch = (val, param) => {
    let { operateData, sexualCharacteristics } = this.state
    let normal = sexualCharacteristics
    if (val) {
      normal.push(param)
    } else {
      var index = normal.indexOf(param)
      if (index > -1) {
        normal.splice(index, 1)
      }
    }
    this.setState({
      operateData: {
        ...operateData,
        sexualCharacteristics: normal,
      },
    })
  }
  //radio
  setRadio = (val, param) => {
    let { operateData, sexualCharacteristics, sexualException } = this.state
    let normal = sexualCharacteristics
    let abnormal = sexualException
    if (val) {
      let index = abnormal.indexOf(param)
      if (index > -1) {
        abnormal.splice(index, 1)
        normal.push(param)
      } else {
        normal.push(param)
      }
    } else {
      let index = normal.indexOf(param)
      if (index > -1) {
        normal.splice(index, 1)
        abnormal.push(param)
      } else {
        abnormal.push(param)
      }
    }
    this.setState({
      operateData: {
        ...operateData,
        sexualCharacteristics: normal,
        sexualException: abnormal,
      },
      sexualCharacteristics: normal,
      sexualException: abnormal,
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
  //提交修改和添加
  submit = () => {
    let {
      operateData,
      exceptionalProjectDTOList,
      sexualCharacteristics,
      sexualException,
    } = this.state
    let param = {
      ...operateData,
      saveDate: operateData.saveDate ? operateData.saveDate : todayString,
      exceptionalProjectDTOList,
      sexualCharacteristics,
      sexualException,
      patientParam: this.selectPatient(),
    }
    if (operateData.uid) {
      //修改方法
      apis.ManCheck.updatemanphysicalcheck(param).then((res) => {
        message.success("修改成功")
        this.props.getData()
        this.props.close()
      })
    } else {
      //添加方法
      apis.ManCheck.savemanphysicalcheck(param).then((res) => {
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
      sexualCharacteristics,
      exceptionalProjectDTOList,
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
            <div>
              <span>指距:</span>
              <span>
                <FontInput
                  addonAfter="cm"
                  value={operateData.fingerDistance}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "fingerDistance")
                  }}
                />
              </span>
            </div>
            <div>
              <span>脐下距:</span>
              <span>
                <FontInput
                  addonAfter="cm"
                  value={operateData.infraumbilicalDistance}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "infraumbilicalDistance")
                  }}
                />
              </span>
            </div>
            <div>
              <span>上下身比:</span>
              <span>
                <Input
                  style={{ width: 70 }}
                  value={operateData.upperBottomRatio}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "upperBottomRatio")
                  }}
                />
              </span>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span>第二性征</span>
              <SpanTitle>
                胡须:
                <Switch
                  checked={sexualCharacteristics.includes("胡须")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "胡须")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                喉结：
                <Radio.Group
                  value={sexualCharacteristics.includes("喉结")}
                  onChange={(e) => {
                    this.setRadio(e.target.value, "喉结")
                  }}
                >
                  <Radio value={true}>正常</Radio>
                  <Radio value={false}>异常</Radio>
                </Radio.Group>
              </SpanTitle>
              <SpanTitle>
                阴毛：
                <Radio.Group
                  value={sexualCharacteristics.includes("阴毛")}
                  onChange={(e) => {
                    this.setRadio(e.target.value, "阴毛")
                  }}
                >
                  <Radio value={true}>正常</Radio>
                  <Radio value={false}>异常</Radio>
                </Radio.Group>
              </SpanTitle>
              <SpanTitle>
                乳房：
                <Radio.Group
                  value={sexualCharacteristics.includes("乳房")}
                  onChange={(e) => {
                    this.setRadio(e.target.value, "乳房")
                  }}
                >
                  <Radio value={true}>正常</Radio>
                  <Radio value={false}>异常</Radio>
                </Radio.Group>
              </SpanTitle>
            </div>
            {handleTag ? (
              operateData.uid ? (
                <div>
                  <DashBtn onClick={this.emptyLast}>清空</DashBtn>
                </div>
              ) : (
                <div>
                  <DashBtn onClick={this.getLast}>获取</DashBtn>
                </div>
              )
            ) : null}
          </FlexItem>
          <FlexItem>
            <div>
              <span style={{ textAlign: "left" }}>
                <Checkbox.Group
                  options={abnormalProject}
                  value={defaultchose}
                  onChange={(checked) => {
                    this.setCheckbox(checked)
                  }}
                />
              </span>
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
