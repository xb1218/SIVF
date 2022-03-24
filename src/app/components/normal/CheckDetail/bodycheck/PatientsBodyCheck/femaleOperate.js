import React, { Component } from "react"
import {
  Input,
  Switch,
  DatePicker,
  Divider,
  message,
  Radio,
  Select,
} from "antd"
import { observer, inject } from "mobx-react"
import { CloseOutlined, CheckOutlined } from "@ant-design/icons"
import { DateTitleView } from "@/app/components/normal/Title"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { DashBtn } from "@/app/components/base/baseBtn.js"
import { todayString, dateFormatDate } from "@/app/utils/const.js"
import { checkArrisEmpty } from "@/app/utils/tool.js"
import styled from "styled-components"
import moment from "moment"
import apis from "@/app/utils/apis"
import { femaleCheck } from "./defaultData"
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
      operateData: [],
      uterusNeckSituation: [],
      leftSituation: [],
      rightSituation: [],
    }
  }
  componentDidMount() {
    let { operateData } = this.props
    //初始化妇科检查空数组
    let uterusNeckSituation = operateData.uterusNeckSituation
      ? operateData.uterusNeckSituation
      : []
    let leftSituation = operateData.leftSituation
      ? operateData.leftSituation
      : []
    let rightSituation = operateData.rightSituation
      ? operateData.rightSituation
      : []
    this.setState({
      operateData: defaultOperate(operateData, femaleCheck),
      uterusNeckSituation,
      leftSituation,
      rightSituation,
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
    apis.ManCheck.getlastcheckfemale(this.selectPatient()).then((res) => {
      let data = res.data
      if (checkArrisEmpty(data)) {
        message.destroy()
        message.error("无最新一条妇科检查")
        // this.emptyLast()
      } else {
        data.saveDate = todayString
        data.uid = null
        this.setState({
          operateData: data,
        })
      }
    })
  }
  //清空数据
  emptyLast = () => {
    this.setState({
      operateData: {
        uterusNeckSituation: [],
        leftSituation: [],
        rightSituation: [],
      },
    })
  }
  //输入框值的变化
  setInheritVal = (val, param) => {
    let { operateData } = this.state
    this.setState({
      operateData: { ...operateData, [param]: val },
    })
  }
  //开关
  setSwitch = (val, type, param) => {
    let {
      operateData,
      uterusNeckSituation,
      leftSituation,
      rightSituation,
    } = this.state

    let arr =
      type === "uterusNeckSituation"
        ? uterusNeckSituation
        : type === "leftSituation"
        ? leftSituation
        : rightSituation

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
        uterusNeckSituation,
        leftSituation,
        rightSituation,
      },
    })
  }
  //提交修改和添加
  submit = () => {
    let {
      operateData,
      uterusNeckSituation,
      leftSituation,
      rightSituation,
    } = this.state
    let param = {
      ...operateData,
      saveDate: operateData.saveDate ? operateData.saveDate : todayString,
      uterusNeckSituation,
      leftSituation,
      rightSituation,
      patientParam: this.selectPatient(),
    }
    if (operateData.uid) {
      //修改方法
      apis.ManCheck.updatecheckfemale(param).then((res) => {
        message.success("修改成功")
        this.props.getData()
        this.props.close()
      })
    } else {
      //添加方法
      apis.ManCheck.savecheckfemale(param).then((res) => {
        message.success("添加成功")
        this.props.getData()
        this.props.close()
      })
    }
  }

  render() {
    let { typeTitle, handleTag } = this.props
    let { femalecheckOption } = this.props.inspection
    let {
      operateData,
      uterusNeckSituation,
      leftSituation,
      rightSituation,
    } = this.state
    let { renderOptions } = this.props.moredetail
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
              <span>外阴</span>
            </div>
            <div>
              <span>
                发育
                <Radio.Group
                  value={operateData.vulva}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "vulva")
                  }}
                >
                  <Radio value={0}>正常</Radio>
                  <Radio value={1}>异常</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>
                阴毛分布
                <Radio.Group
                  value={operateData.pubicHairDistribution}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "pubicHairDistribution")
                  }}
                >
                  <Radio value={0}>正常</Radio>
                  <Radio value={1}>异常</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>形态</span>
              <span>
                <Select
                  value={operateData.vulvaPattern}
                  style={{ width: 125 }}
                  onChange={(value) => {
                    this.setInheritVal(value, "vulvaPattern")
                  }}
                >
                  {renderOptions(femalecheckOption, "65")}
                </Select>
              </span>
            </div>
            <div>
              <span>畸形</span>
              <span>
                <Switch
                  checked={operateData.vulvaDeformity}
                  onChange={(checked) => {
                    this.setInheritVal(checked ? 1 : 0, "vulvaDeformity")
                  }}
                />
              </span>
            </div>
            <div>
              <span>说明</span>
              <span>
                <Input
                  value={operateData.vulvaExplain}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "vulvaExplain")
                  }}
                />
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
              <span>阴道</span>
              <span>
                <Radio.Group
                  value={operateData.vaginal}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "vaginal")
                  }}
                >
                  <Radio value={0}>通畅</Radio>
                  <Radio value={1}>不通畅</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>分泌物</span>
              <span>
                <Select
                  value={operateData.secretion}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    this.setInheritVal(value, "secretion")
                  }}
                >
                  {renderOptions(femalecheckOption, "67")}
                </Select>
              </span>
            </div>
            <div>
              <span>
                黏膜:
                <Radio.Group
                  value={operateData.mucosa}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "mucosa")
                  }}
                >
                  <Radio value={0}>正常</Radio>
                  <Radio value={1}>异常</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>气味</span>
              <span>
                <Select
                  value={operateData.smell}
                  style={{ width: 120 }}
                  onChange={(value) => {
                    this.setInheritVal(value, "smell")
                  }}
                >
                  {renderOptions(femalecheckOption, "284")}
                </Select>
              </span>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span>宫颈</span>
              <span>
                <Select
                  value={operateData.uterusNeck}
                  style={{ width: 135 }}
                  onChange={(value) => {
                    this.setInheritVal(value, "uterusNeck")
                  }}
                >
                  {renderOptions(femalecheckOption, "257")}
                </Select>
              </span>
            </div>
            <div>
              <SpanTitle>
                肥大:
                <Switch
                  checked={uterusNeckSituation.includes("肥大")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "uterusNeckSituation", "肥大")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                举痛:
                <Switch
                  checked={uterusNeckSituation.includes("举痛")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "uterusNeckSituation", "举痛")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                接触性出血:
                <Switch
                  checked={uterusNeckSituation.includes("接触性出血")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "uterusNeckSituation", "接触性出血")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                息肉:
                <Switch
                  checked={uterusNeckSituation.includes("息肉")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "uterusNeckSituation", "息肉")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                纳式囊肿:
                <Switch
                  checked={uterusNeckSituation.includes("纳式囊肿")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "uterusNeckSituation", "纳式囊肿")
                  }}
                />
              </SpanTitle>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span>宫体</span>
              <span>
                <Select
                  value={operateData.uterusPosition}
                  style={{ width: 135 }}
                  onChange={(value) => {
                    this.setInheritVal(value, "uterusPosition")
                  }}
                >
                  {renderOptions(femalecheckOption, "69")}
                </Select>
              </span>
            </div>
            <div>
              <span>
                <SpanTitle>大小:</SpanTitle>
                <Radio.Group
                  value={operateData.uterusSize}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "uterusSize")
                  }}
                >
                  <Radio value={0}>正常</Radio>
                  <Radio value={1}>异常</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>质地</span>
              <span>
                <Select
                  value={operateData.uterusParenchyma}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    this.setInheritVal(value, "uterusParenchyma")
                  }}
                >
                  {renderOptions(femalecheckOption, "71")}
                </Select>
              </span>
            </div>
            <div>
              <span>活动度</span>
              <span>
                <Select
                  value={operateData.uterusMotility}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    this.setInheritVal(value, "uterusMotility")
                  }}
                >
                  {renderOptions(femalecheckOption, "73")}
                </Select>
              </span>
            </div>
            <div>
              <SpanTitle>
                压痛:
                <Switch
                  checked={operateData.uterusPressurePain}
                  onChange={(checked) => {
                    this.setInheritVal(checked ? 1 : 0, "uterusPressurePain")
                  }}
                />
              </SpanTitle>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span>附件</span>
            </div>
            <div>
              <span>
                左侧
                <Radio.Group
                  value={operateData.leftSide}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "leftSide")
                  }}
                >
                  <Radio value={0}>正常</Radio>
                  <Radio value={1}>异常</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <SpanTitle>
                压痛:
                <Switch
                  checked={leftSituation.includes("压痛")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "leftSituation", "压痛")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                增厚:
                <Switch
                  checked={leftSituation.includes("增厚")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "leftSituation", "增厚")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                肿块:
                <Switch
                  checked={leftSituation.includes("肿块")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "leftSituation", "肿块")
                  }}
                />
              </SpanTitle>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span style={{ width: 28 }}></span>
            </div>
            <div>
              <span>
                右侧
                <Radio.Group
                  value={operateData.rightSide}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "rightSide")
                  }}
                >
                  <Radio value={0}>正常</Radio>
                  <Radio value={1}>异常</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <SpanTitle>
                压痛:
                <Switch
                  checked={rightSituation.includes("压痛")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "rightSituation", "压痛")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                增厚:
                <Switch
                  checked={rightSituation.includes("增厚")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "rightSituation", "增厚")
                  }}
                />
              </SpanTitle>
              <SpanTitle>
                肿块:
                <Switch
                  checked={rightSituation.includes("肿块")}
                  onChange={(checked) => {
                    this.setSwitch(checked, "rightSituation", "肿块")
                  }}
                />
              </SpanTitle>
            </div>
          </FlexItem>
          <FlexItem>
            <div className="flexgrow">
              <span>说明</span>
              <TextArea
                rows={2}
                style={{ flexGrow: 1 }}
                value={operateData.explain}
                onChange={(e) => {
                  this.setInheritVal(e.target.value, "explain")
                }}
              />
            </div>
          </FlexItem>
        </div>
      </DateTitleView>
    )
  }
}
