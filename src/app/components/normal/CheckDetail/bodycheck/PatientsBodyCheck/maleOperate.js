import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import {
  Input,
  Switch,
  DatePicker,
  Divider,
  message,
  Radio,
  Select,
} from "antd"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import { DateTitleView } from "@/app/components/normal/Title"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { DashBtn } from "@/app/components/base/baseBtn.js"
import { FontInput } from "@/app/components/base/baseFontInput"
import { BaseTable } from "@/app/components/base/baseTable"
import { todayString, dateFormatDate } from "@/app/utils/const.js"
import { checkArrisEmpty, checkDataisEmpty } from "@/app/utils/tool.js"
import styled from "styled-components"
import moment from "moment"
import apis from "@/app/utils/apis"
import { maleCheck } from "./defaultData"
import { defaultOperate } from "@/app/utils/tool.js"

const SpanTitle = styled.span`
  margin-left: 15px;
`
const { TextArea } = Input

export default
@inject("moredetail", "store", "inspection")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      operateData: props.operateData,
      testicularInfos: [],
      tableDataArrInit: [
        {
          testicularVolume: null,
          testicularMass: "正常",
          epididymis: 0,
          vasDeferens: "正常",
          spermaticVein: "正常",
        },
        {
          testicularVolume: null,
          testicularMass: "正常",
          epididymis: 0,
          vasDeferens: "正常",
          spermaticVein: "正常",
        },
      ],
    }
  }
  componentDidMount() {
    let { operateData } = this.props
    let { tableDataArrInit } = this.state
    this.setState({
      operateData: defaultOperate(operateData, maleCheck),
      testicularInfos: checkArrisEmpty(operateData.testicularInfos)
        ? tableDataArrInit
        : operateData.testicularInfos,
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
    let { tableDataArrInit } = this.state
    apis.ManCheck.getlastcheckmale(this.selectPatient()).then((res) => {
      let data = res.data
      if (checkArrisEmpty(data)) {
        message.destroy()
        message.error("无最新一条男科检查")
        // this.emptyLast()
      } else {
        data.saveDate = todayString
        data.uid = null
        this.setState({
          operateData: checkDataisEmpty(data, {}),
          testicularInfos: checkDataisEmpty(
            data.testicularInfos,
            tableDataArrInit
          ),
        })
      }
    })
  }
  //清空数据
  emptyLast = () => {
    let { tableDataArrInit } = this.state
    this.setState({
      operateData: {},
      testicularInfos: checkDataisEmpty(null, tableDataArrInit),
    })
  }
  //输入框值的变化
  setInheritVal = (val, param) => {
    let { operateData } = this.state
    this.setState({
      operateData: { ...operateData, [param]: val },
    })
  }
  //表格中的数据切换
  setTableVal = (val, param, cindex) => {
    let { testicularInfos } = this.state
    let arr = testicularInfos
    arr.forEach((item, index) => {
      if (cindex === index) {
        item[param] = val
      }
    })
    this.setState({
      testicularInfos: arr,
    })
  }
  //提交修改和添加
  submit = () => {
    let { operateData, testicularInfos } = this.state
    let param = {
      ...operateData,
      saveDate: operateData.saveDate ? operateData.saveDate : todayString,
      patientParam: this.selectPatient(),
      testicularInfos,
    }
    if (operateData.uid) {
      //修改方法
      apis.ManCheck.updatecheckmale(param).then((res) => {
        message.success("修改成功")
        this.props.getData()
        this.props.close()
      })
    } else {
      //添加方法
      apis.ManCheck.savemancheck(param).then((res) => {
        message.success("添加成功")
        this.props.getData()
        this.props.close()
      })
    }
  }

  render() {
    let { typeTitle, handleTag } = this.props
    let { malecheckOption } = this.props.inspection
    let { operateData, testicularInfos } = this.state
    let { renderOptions } = this.props.moredetail
    let columns = [
      {
        title: "睾丸",
        width: 120,
        colSpan: 0,
        render: (text, record, index) => {
          return <div>{index ? "右" : "左"}</div>
        },
      },
      {
        title: "睾丸",
        align: "center",
        dataIndex: "testicularVolume",
        key: "testicularVolume",
        width: 120,
        colSpan: 3,
        render: (text, record, index) => {
          return (
            <div>
              <FontInput
                addonAfter="ml"
                value={record.testicularVolume}
                onChange={(e) => {
                  this.setTableVal(e.target.value, "testicularVolume", index)
                }}
              />
            </div>
          )
        },
      },
      {
        title: "睾丸",
        align: "center",
        dataIndex: "testicularMass",
        key: "testicularMass",
        width: 120,
        colSpan: 0,
        render: (text, record, index) => {
          return (
            <div>
              <Select
                value={record.testicularMass}
                style={{ width: 110 }}
                onChange={(value) => {
                  this.setTableVal(value, "testicularMass", index)
                }}
              >
                {renderOptions(malecheckOption, "124")}
              </Select>
            </div>
          )
        },
      },
      {
        title: "附睾",
        align: "center",
        dataIndex: "epididymis",
        key: "epididymis",
        width: 320,
        render: (text, record, index) => {
          return (
            <div>
              <Radio.Group
                value={record.epididymis}
                onChange={(e) => {
                  this.setTableVal(e.target.value, "epididymis", index)
                }}
              >
                <Radio value={0}>正常</Radio>
                <Radio value={1}>异常</Radio>
              </Radio.Group>
            </div>
          )
        },
      },
      {
        title: "输精管",
        align: "center",
        dataIndex: "vasDeferens",
        key: "vasDeferens",
        width: 320,
        render: (text, record, index) => {
          return (
            <div>
              <Select
                value={record.vasDeferens}
                style={{ width: 110 }}
                onChange={(value) => {
                  this.setTableVal(value, "vasDeferens", index)
                }}
              >
                {renderOptions(malecheckOption, "123")}
              </Select>
            </div>
          )
        },
      },
      {
        title: "精索静脉",
        align: "center",
        dataIndex: "spermaticVein",
        key: "spermaticVein",
        width: 320,
        render: (text, record, index) => {
          return (
            <div>
              <Select
                value={record.spermaticVein}
                style={{ width: 110 }}
                onChange={(value) => {
                  this.setTableVal(value, "spermaticVein", index)
                }}
              >
                {renderOptions(malecheckOption, "123")}
              </Select>
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
              <span>
                阴茎
                <Radio.Group
                  value={operateData.penile}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "penile")
                  }}
                >
                  <Radio value={0}>正常</Radio>
                  <Radio value={1}>异常</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>长度</span>
              <span>
                <FontInput
                  addonAfter="cm"
                  value={operateData.penileLength}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "penileLength")
                  }}
                />
              </span>
            </div>
            <div>
              <span>发育</span>
              <span>
                <Select
                  value={operateData.penileDevelopment}
                  style={{ width: 110 }}
                  onChange={(value) => {
                    this.setInheritVal(value, "penileDevelopment")
                  }}
                >
                  {renderOptions(malecheckOption, "231")}
                </Select>
              </span>
            </div>
            {handleTag ? (
              operateData.uid ? (
                <div style={{ alignSelf: "center" }}>
                  <DashBtn
                    style={{ height: 32, lineHeight: "32px" }}
                    onClick={this.emptyLast}
                  >
                    <span>清空</span>
                  </DashBtn>
                </div>
              ) : (
                <div style={{ alignSelf: "center" }}>
                  <DashBtn
                    style={{ height: 32, lineHeight: "32px" }}
                    onClick={this.getLast}
                  >
                    <span>获取</span>
                  </DashBtn>
                </div>
              )
            ) : null}
          </FlexItem>
          <FlexItem>
            <div>
              <span>
                <BaseTable
                  style={{ marginRight: 10 }}
                  columns={columns}
                  dataSource={testicularInfos}
                  pagination={false}
                  rowKey={(record, index) => index}
                />
              </span>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span>前列腺</span>
              <span>
                <Radio.Group
                  value={operateData.prostatitis}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "prostatitis")
                  }}
                >
                  <Radio value={0}>正常</Radio>
                  <Radio value={1}>异常</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>大小</span>
              <span>
                <Select
                  value={operateData.vasDeferensSize}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    this.setInheritVal(value, "vasDeferensSize")
                  }}
                >
                  {renderOptions(malecheckOption, "75")}
                </Select>
              </span>
            </div>
            <div>
              <span>质地</span>
              <span>
                <Select
                  value={operateData.vasDeferensMass}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    this.setInheritVal(value, "vasDeferensMass")
                  }}
                >
                  {renderOptions(malecheckOption, "71")}
                </Select>
              </span>
            </div>
            <div>
              <SpanTitle>
                结节:
                <Switch
                  checked={operateData.lumpy}
                  onChange={(checked) => {
                    this.setInheritVal(checked ? 1 : 0, "lumpy")
                  }}
                />
              </SpanTitle>
            </div>
            <div>
              <SpanTitle>
                压痛:
                <Switch
                  checked={operateData.pressurePain}
                  onChange={(checked) => {
                    this.setInheritVal(checked ? 1 : 0, "pressurePain")
                  }}
                />
              </SpanTitle>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span>阴囊</span>
              <span>
                <Radio.Group
                  value={operateData.scrotum}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "scrotum")
                  }}
                >
                  <Radio value={0}>正常</Radio>
                  <Radio value={1}>异常</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <SpanTitle>
                阴囊肿物:
                <Switch
                  checked={operateData.scrotalSwelling}
                  onChange={(checked) => {
                    this.setInheritVal(checked ? 1 : 0, "scrotalSwelling")
                  }}
                />
              </SpanTitle>
            </div>
          </FlexItem>
          <FlexItem>
            <div className="flexgrow">
              <span>备注</span>
              <TextArea
                rows={2}
                style={{ flexGrow: 1 }}
                value={operateData.note}
                onChange={(e) => {
                  this.setInheritVal(e.target.value, "note")
                }}
              />
            </div>
          </FlexItem>
        </div>
      </DateTitleView>
    )
  }
}
