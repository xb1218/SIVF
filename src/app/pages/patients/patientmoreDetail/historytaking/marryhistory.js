import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { observable } from "mobx"
import styled from "styled-components"
import { Radio, Select, Input, Switch, DatePicker } from "antd"
import { MinusOutlined } from "@ant-design/icons"
import { DashBtn } from "@/app/components/base/baseBtn"
import moment from "moment"
import { FlexItem } from "@/app/components/base/baseForms"
import { checkArrisEmpty, renderOptions } from "@/app/utils/tool"
import { todayString } from "@/app/utils/const"

const RadioGroup = Radio.Group
const dateFormat = "YYYY-MM-DD"
const Diytable = styled.div`
  margin: 1em 2em;
  border-radius: 2px;
  display: flex;
  align-items: center;

  > .ant-select,
  > .ant-input-group-wrapper {
    width: 90px;
    margin: 0 10px;
  }
  > .ant-picker {
    width: 110px;
    margin: 0 10px;
  }
  div > .ant-select {
    width: 90px;
    margin: 0 10px;
  }
  div > .ant-input-group-wrapper {
    margin: 0 10px;
  }
  div > .ant-input {
    width: 150px;
    margin: 0 10px;
  }
`
const Abortion = styled.div`
  margin: 0em 2.7em;
  background: #f6f6f6;
  padding: 4px 10px;
  border-left: 3px solid #e2e2e2;
  display: inline-block;
  .explain {
    margin: 0px 10px;
  }
  .ant-select {
    width: 90px;
    margin: 0 10px;
  }
  .ant-input {
    width: 150px;
    margin: 0 10px;
  }
`

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  @observable femaleTemp = this.props.data
  @observable maleTemp = this.props.dataMale
  @observable adoptDisable = false
  constructor(props) {
    super(props)
    this.state = {
      patientSex: props.sex,
    }
  }
  componentDidMount() {
    this.handleFemale()
  }
  //处理数据
  handleFemale = () => {
    let { femaleTemp } = this
    let { patientSex } = this.state
    //领养计算 = 现有子女数-list子女总数 >0 可填
    if (patientSex) {
      let totalchildrens = []
      femaleTemp.femaleMaritalHistoryResultVOList.forEach((item) => {
        if (item.resultType === 1) {
          totalchildrens.push(item.childbirthFemale)
          totalchildrens.push(item.childbirthMale)
        }
      })
      let total_childs = totalchildrens.reduce(function (preValue, curValue) {
        return preValue + curValue
      }, 0)
      this.adoptDisable =
        femaleTemp.existingChildren - total_childs > 0 ? false : true
      this.setTablelist(
        this.femaleTemp.pregnancyNumber ? this.femaleTemp.pregnancyNumber : 0
      )
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.data !== this.props.data ||
      nextProps.sex !== this.props.sex
    ) {
      this.setState({
        patientSex: nextProps.sex,
      })
      this.femaleTemp = nextProps.data
      this.maleTemp = nextProps.dataMale
      this.handleFemale()
    }
  }
  //删除胚胎行
  delembBro = async (index) => {
    let { femaleTemp } = this
    femaleTemp.femaleMaritalHistoryResultVOList.splice(index, 1)
    femaleTemp.pregnancyNumber =
      femaleTemp.femaleMaritalHistoryResultVOList.length
    await this.setState({
      number: femaleTemp.pregnancyNumber,
    })
    this.updateChildNum()
    this.isAdoptChild()
  }
  //设置表格行数
  setTablelist = (num) => {
    let { femaleTemp } = this
    let { todayString } = this.props.moredetail
    let tableLength = femaleTemp.femaleMaritalHistoryResultVOList.length
    if (tableLength < num) {
      let obj = {
        date: todayString,
        pregnancyTime: null, //怀孕时间
        pregnancyUnit: "周", //怀孕单位
        spouseRelationship: null, //配偶关系
        type: null,
        method: null, //分娩方式
        childbirthMale: null, //分娩子
        childbirthFemale: null, //分娩女
        resultType: 0, //结果类型
      }
      for (let i = 1; i <= num - tableLength; i++) {
        femaleTemp.femaleMaritalHistoryResultVOList.push(obj)
      }
    }
  }
  //计算子女孕，产，流存，宫外孕，
  updateChildNum = () => {
    let { femaleTemp } = this
    let exG = [] //孕
    let curG = [] //孕
    let exP = [] //产
    let curP = [] //产
    let exA = [] //流
    let curA = [] //流
    let exEc = [] //宫
    let curEc = [] //宫
    let exL = [] //存
    let curL = [] //存
    femaleTemp.femaleMaritalHistoryResultVOList.forEach((item) => {
      if (item.spouseRelationship) {
        //孕
        exG.push(item)
        //流
        if (item.resultType === 0 || item.resultType === 3) {
          exA.push(item)
        }
        //产
        if (item.resultType === 1) {
          exP.push(item)
          //存
          if (item.type !== "死产" && item.type !== "死胎") {
            exL.push(item.childbirthFemale)
            exL.push(item.childbirthMale)
          }
        }
        //宫
        if (item.resultType === 2) {
          exEc.push(item)
        }
      } else {
        //孕
        curG.push(item)
        //流
        if (item.resultType === 0 || item.resultType === 3) {
          curA.push(item)
        }
        //产
        if (item.resultType === 1) {
          curP.push(item)
          //存
          if (item.type !== "死产" && item.type !== "死胎") {
            curL.push(item.childbirthFemale)
            curL.push(item.childbirthMale)
          }
        }
        //宫
        if (item.resultType === 2) {
          curEc.push(item)
        }
      }
    })
    //孕
    femaleTemp.exG = exG.length
    femaleTemp.currentG = curG.length
    //产
    femaleTemp.exP = exP.length
    femaleTemp.currentP = curP.length
    //流
    femaleTemp.exA = exA.length
    femaleTemp.currentA = curA.length
    //宫
    femaleTemp.exEctopicPregnancy = exEc.length
    femaleTemp.currentEctopicPregnancy = curEc.length
    //存
    femaleTemp.exLTatal = exL.reduce(function (preValue, curValue) {
      return preValue + curValue
    }, 0)
    femaleTemp.currentLTatal = curL.reduce(function (preValue, curValue) {
      return preValue + curValue
    }, 0)
    this.props.changeData(femaleTemp, "femaleMaritalHistoryVO")
  }
  // 计算妊娠次数
  calculatePregnancyNumber = () => {
    let { maleTemp } = this
    let data =
      parseInt(maleTemp.currentG ? maleTemp.currentG : 0) +
      parseInt(maleTemp.exG ? maleTemp.exG : 0)
    maleTemp.pregnancyNumber = data
    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
  }
  // 是否允许领养
  isAdoptChild = () => {
    let { femaleTemp } = this
    // 现有子女个数
    let child = parseInt(femaleTemp.existingChildren)
    // 分娩的子女个数
    let childBirth = 0
    femaleTemp.femaleMaritalHistoryResultVOList.forEach((item) => {
      if (item.resultType === 1) {
        childBirth = childBirth + item.childbirthFemale + item.childbirthMale
      }
    })
    this.adoptDisable = child - childBirth > 0 ? false : true
    if (this.adoptDisable) {
      femaleTemp.adoptChildren = null
    }
  }
  render() {
    const { optionsData } = this.props
    let { patientSex } = this.state
    let { femaleTemp, maleTemp, adoptDisable } = this
    return (
      <div>
        {patientSex ? (
          //女方婚史
          <>
            <FlexItem>
              <div>
                <span>初婚</span>
                <Input
                  addonAfter="岁"
                  value={femaleTemp.marriageAge}
                  defaultValue={femaleTemp.marriageAge}
                  onChange={(e) => {
                    femaleTemp.marriageAge = e.target.value
                    this.props.changeData(femaleTemp, "femaleMaritalHistoryVO")
                  }}
                />
              </div>

              <div>
                <span>再婚</span>
                <Switch
                  checked={femaleTemp.marriageState}
                  onChange={(val) => {
                    femaleTemp.marriageState = val ? 1 : 0
                    this.props.changeData(femaleTemp, "femaleMaritalHistoryVO")
                  }}
                />
              </div>
              <div>
                <span>近亲结婚</span>
                <Switch
                  checked={femaleTemp.consanguineousMarriageTag}
                  onChange={(val) => {
                    femaleTemp.consanguineousMarriageTag = val ? 1 : 0
                    this.props.changeData(femaleTemp, "femaleMaritalHistoryVO")
                  }}
                />
              </div>
              <div>
                <span>妊娠</span>
                <Input
                  addonAfter="次"
                  value={femaleTemp.pregnancyNumber}
                  onChange={(e) => {
                    femaleTemp.pregnancyNumber = e.target.value
                    this.setTablelist(e.target.value)
                    this.props.changeData(femaleTemp, "femaleMaritalHistoryVO")
                  }}
                />
              </div>
              <div>
                <span>现有子女</span>
                <Input
                  addonAfter="个"
                  value={femaleTemp.existingChildren}
                  onChange={(e) => {
                    femaleTemp.existingChildren = e.target.value
                    this.props.changeData(femaleTemp, "femaleMaritalHistoryVO")
                    this.isAdoptChild()
                  }}
                />
              </div>
              <div>
                {femaleTemp.infertilityType
                  ? femaleTemp.infertilityType + "不孕"
                  : null}
              </div>
            </FlexItem>
            {/* 妊娠表格list */}
            <>
              {!checkArrisEmpty(femaleTemp.femaleMaritalHistoryResultVOList) &&
                femaleTemp.femaleMaritalHistoryResultVOList.map((item, i) => {
                  return (
                    <div key={i}>
                      <Diytable>
                        <Select
                          placeholder="结局"
                          value={item.resultType}
                          defaultValue={item.resultType}
                          onChange={(val) => {
                            item.resultType = val
                            item.childbirthFemale = null
                            item.childbirthMale = null
                            this.isAdoptChild()
                            this.updateChildNum()
                            this.props.changeData(
                              femaleTemp,
                              "femaleMaritalHistoryVO"
                            )
                          }}
                        >
                          <Select.Option value={0}>流产</Select.Option>
                          <Select.Option value={1}>分娩</Select.Option>
                          <Select.Option value={2}>宫外孕</Select.Option>
                          <Select.Option value={3}>生化妊娠</Select.Option>
                          {/* <Select.Option value={4}>宫内孕</Select.Option>
                          <Select.Option value={5}>宫内外孕</Select.Option> */}
                          {/* {renderOptions(optionsData, "219")} */}
                        </Select>
                        <DatePicker
                          picker="month"
                          style={{ width: "130px" }}
                          value={moment(item.date || todayString, dateFormat)}
                          defaultValue={moment(
                            item.date || todayString,
                            dateFormat
                          )}
                          onChange={(date, dateString) => {
                            item.date = dateString
                            this.props.changeData(
                              femaleTemp,
                              "femaleMaritalHistoryVO"
                            )
                          }}
                        />
                        <Input
                          addonAfter={
                            <Select
                              value={item.pregnancyUnit}
                              defaultValue={item.pregnancyUnit}
                              onChange={(val) => (item.pregnancyUnit = val)}
                            >
                              <Select.Option value="天">天</Select.Option>
                              <Select.Option value="周">周</Select.Option>
                            </Select>
                          }
                          value={item.pregnancyTime}
                          defaultValue={item.pregnancyTime}
                          onChange={(e) => {
                            item.pregnancyTime = e.target.value
                              ? parseInt(e.target.value)
                              : null
                            this.props.changeData(
                              femaleTemp,
                              "femaleMaritalHistoryVO"
                            )
                          }}
                          style={{ width: "100px" }}
                        />

                        <RadioGroup
                          value={item.spouseRelationship}
                          onChange={(e) => {
                            item.spouseRelationship = e.target.value
                            this.updateChildNum()
                            this.props.changeData(
                              femaleTemp,
                              "femaleMaritalHistoryVO"
                            )
                          }}
                        >
                          <Radio value={0}>现任</Radio>
                          <Radio value={1}>前任</Radio>
                        </RadioGroup>

                        {/* 类型（输入框1） */}
                        {item.resultType === 3 ? (
                          <Input
                            placeholder="原因"
                            style={{ width: "40%" }}
                            value={item.type}
                            defaultValue={item.type}
                            onChange={(e) => {
                              item.type = e.target.value
                              this.props.changeData(
                                femaleTemp,
                                "femaleMaritalHistoryVO"
                              )
                            }}
                          />
                        ) : (
                          <Select
                            showArrow={false}
                            placeholder="类型"
                            style={{ width: "120px" }}
                            value={item.type}
                            defaultValue={item.type}
                            onChange={(val) => {
                              item.type = val
                              this.props.changeData(
                                femaleTemp,
                                "femaleMaritalHistoryVO"
                              )
                            }}
                          >
                            {item.resultType === 0
                              ? renderOptions(optionsData, "87")
                              : item.resultType === 1
                              ? renderOptions(optionsData, "34")
                              : item.resultType === 2
                              ? renderOptions(optionsData, "220")
                              : null}
                          </Select>
                        )}
                        {/* 方式（输入框2） */}
                        {item.resultType === 0 ? (
                          <Input
                            placeholder="原因"
                            style={{ width: "25%" }}
                            value={item.method}
                            defaultValue={item.method}
                            onChange={(e) => {
                              item.method = e.target.value
                              this.props.changeData(
                                femaleTemp,
                                "femaleMaritalHistoryVO"
                              )
                            }}
                          />
                        ) : null}

                        {item.resultType === 1 || item.resultType === 2 ? (
                          <Select
                            showArrow={false}
                            placeholder="方式"
                            style={{ width: "120px" }}
                            value={item.method}
                            defaultValue={item.method}
                            onChange={(val) => {
                              item.method = val
                              this.props.changeData(
                                femaleTemp,
                                "femaleMaritalHistoryVO"
                              )
                            }}
                          >
                            {item.resultType === 1
                              ? renderOptions(optionsData, "35")
                              : renderOptions(optionsData, "36")}
                          </Select>
                        ) : null}

                        {item.resultType === 1 ? (
                          <div>
                            <Input
                              addonAfter="子"
                              style={{ width: "80px" }}
                              value={item.childbirthMale}
                              defaultValue={item.childbirthMale}
                              onChange={(e) => {
                                item.childbirthMale = parseInt(
                                  e.target.value ? e.target.value : 0
                                )
                                this.updateChildNum()
                                this.props.changeData(
                                  femaleTemp,
                                  "femaleMaritalHistoryVO"
                                )
                                this.isAdoptChild()
                              }}
                            />
                            <Input
                              addonAfter="女"
                              style={{ width: "80px" }}
                              value={item.childbirthFemale}
                              defaultValue={item.childbirthFemale}
                              onChange={(e) => {
                                item.childbirthFemale = parseInt(
                                  e.target.value ? e.target.value : 0
                                )
                                this.updateChildNum()
                                this.props.changeData(
                                  femaleTemp,
                                  "femaleMaritalHistoryVO"
                                )
                                this.isAdoptChild()
                              }}
                            />
                          </div>
                        ) : null}

                        <DashBtn
                          style={{
                            height: "20px",
                            lineHeight: "20px",
                            marginLeft: "1.5em",
                          }}
                        >
                          <MinusOutlined onClick={() => this.delembBro(i)} />
                        </DashBtn>
                      </Diytable>
                      {item.resultType === 0 && (
                        <Abortion>
                          <span>流产组织染色体检测结果</span>
                          <Select
                            placeholder="未查"
                            style={{ width: "120px" }}
                            value={item.abortionResult}
                            defaultValue={item.abortionResult}
                            onChange={(val) => {
                              item.abortionResult = val
                              this.props.changeData(
                                femaleTemp,
                                "femaleMaritalHistoryVO"
                              )
                            }}
                          >
                            {renderOptions(optionsData, "37")}
                          </Select>
                          <span className="explain">说明</span>
                          <Input
                            style={{ width: "400px" }}
                            value={item.abortionExplain}
                            defaultValue={item.abortionExplain}
                            onChange={(e) => {
                              item.abortionExplain = e.target.value
                              this.props.changeData(
                                femaleTemp,
                                "femaleMaritalHistoryVO"
                              )
                            }}
                          />
                        </Abortion>
                      )}
                    </div>
                  )
                })}
            </>

            {/* 前任现任 */}
            <FlexItem>
              <div>
                <span>末次妊娠</span>
                <span className="span_underline" style={{ width: "100px" }}>
                  {!checkArrisEmpty(femaleTemp.femaleMaritalHistoryResultVOList)
                    ? femaleTemp.lastPregnancyDate
                    : null}
                </span>
              </div>
              <div>
                <span>领养</span>
                <Input
                  addonAfter="个"
                  disabled={adoptDisable}
                  value={this.adoptDisable ? null : femaleTemp.adoptChildren}
                  defaultValue={femaleTemp.adoptChildren}
                  onChange={(e) => (femaleTemp.adoptChildren = e.target.value)}
                />
              </div>
              <div style={{ width: "65%", minWidth: "300px" }}>
                <b style={{ marginRight: "2em" }}>现任</b>
                孕(G)
                <span className="span_underline">{femaleTemp.currentG}</span>
                产(P)
                <span className="span_underline">{femaleTemp.currentP}</span>
                流(A)
                <span className="span_underline">{femaleTemp.currentA}</span>
                存(L)
                <span className="span_underline">
                  {femaleTemp.currentLTatal}
                </span>
                宫外孕
                <span className="span_underline">
                  {femaleTemp.currentEctopicPregnancy}
                </span>
              </div>
            </FlexItem>
            <FlexItem>
              <div style={{ marginLeft: "25.5em" }}>
                <b style={{ marginRight: "2em" }}>前任</b>
                孕(G)<span className="span_underline">{femaleTemp.exG}</span>
                产(P)<span className="span_underline">{femaleTemp.exP}</span>
                流(A)<span className="span_underline">{femaleTemp.exA}</span>
                存(L)
                <span className="span_underline">{femaleTemp.exLTatal}</span>
                宫外孕
                <span className="span_underline">
                  {femaleTemp.exEctopicPregnancy}
                </span>
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <span>畸形儿史</span>
                <Switch
                  checked={femaleTemp.deformedChildTag}
                  onChange={(val) => {
                    femaleTemp.deformedChildTag = val ? 1 : 0
                    this.props.changeData(femaleTemp, "femaleMaritalHistoryVO")
                  }}
                />
              </div>
              <div>
                <Select
                  showArrow={false}
                  style={{ width: "120px" }}
                  value={femaleTemp.deformedChildDetail}
                  defaultValue={femaleTemp.deformedChildDetail}
                  onChange={(val) => {
                    femaleTemp.deformedChildDetail = val
                    this.props.changeData(femaleTemp, "femaleMaritalHistoryVO")
                  }}
                >
                  {renderOptions(optionsData, "235")}
                </Select>
              </div>
              <div style={{ width: "60%", minWidth: "400px" }}>
                <span style={{ width: "50px" }}>说明</span>
                <Input
                  style={{ width: "100%" }}
                  value={femaleTemp.deformedChildExplain}
                  defaultValue={femaleTemp.deformedChildExplain}
                  onChange={(e) => {
                    femaleTemp.deformedChildExplain = e.target.value
                    this.props.changeData(femaleTemp, "femaleMaritalHistoryVO")
                  }}
                />
              </div>
            </FlexItem>
          </>
        ) : (
          //男方婚史
          <>
            <FlexItem>
              <div>
                <span>初婚</span>
                <Input
                  addonAfter="岁"
                  value={maleTemp.marriageAge}
                  defaultValue={maleTemp.marriageAge}
                  onChange={(e) => {
                    maleTemp.marriageAge = e.target.value
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
              </div>
              <div>
                <span>再婚</span>
                <Switch
                  checked={maleTemp.marriageState}
                  onChange={(val) => {
                    maleTemp.marriageState = val ? 1 : 0
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
              </div>
              <div>
                <span>近亲结婚</span>
                <Switch
                  checked={maleTemp.consanguineousMarriageTag}
                  onChange={(val) => {
                    maleTemp.consanguineousMarriageTag = val ? 1 : 0
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
              </div>
              <div>
                <span>妊娠</span>
                <span className="span_underline">
                  {maleTemp.pregnancyNumber}
                </span>
                次
              </div>
              <div>
                <span>现有子女</span>
                <Input
                  addonAfter="个"
                  value={maleTemp.existingChildren}
                  defaultValue={maleTemp.existingChildren}
                  onChange={(e) => {
                    maleTemp.existingChildren = e.target.value
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                    this.isAdoptChild()
                  }}
                />
              </div>
              <div>
                {maleTemp.infertilityType
                  ? maleTemp.infertilityType + "不育"
                  : null}
              </div>
              <div>
                <span>领养</span>
                <Input
                  addonAfter="个"
                  value={maleTemp.adoptChildren}
                  defaultValue={maleTemp.adoptChildren}
                  onChange={(e) => {
                    maleTemp.adoptChildren = e.target.value
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <b style={{ marginRight: "2em" }}>现任</b>
                <span className="paddingBoth">孕(G)</span>
                <Input
                  value={maleTemp.currentG}
                  defaultValue={maleTemp.currentG}
                  onChange={(e) => {
                    maleTemp.currentG = e.target.value
                    this.calculatePregnancyNumber()
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />

                <span className="paddingBoth">产(P)</span>
                <Input
                  value={maleTemp.currentP}
                  defaultValue={maleTemp.currentP}
                  onChange={(e) => {
                    maleTemp.currentP = e.target.value
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
                <span className="paddingBoth">流(A)</span>
                <Input
                  value={maleTemp.currentA}
                  defaultValue={maleTemp.currentA}
                  onChange={(e) => {
                    maleTemp.currentA = e.target.value
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
                <span className="paddingBoth">存(L)</span>
                <Input
                  value={maleTemp.currentLTatal}
                  defaultValue={maleTemp.currentLTatal}
                  onChange={(e) => {
                    maleTemp.currentLTatal = e.target.value
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
                <span className="paddingBoth">宫外孕</span>
                <Input
                  value={maleTemp.currentEctopicPregnancy}
                  defaultValue={maleTemp.currentEctopicPregnancy}
                  onChange={(e) => {
                    maleTemp.currentEctopicPregnancy = e.target.value
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <b style={{ marginRight: "2em" }}>前任</b>
                <span className="paddingBoth">孕(G)</span>
                <Input
                  value={maleTemp.exG}
                  defaultValue={maleTemp.exG}
                  onChange={(e) => {
                    maleTemp.exG = e.target.value
                    this.calculatePregnancyNumber()
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
                <span className="paddingBoth">产(P)</span>
                <Input
                  value={maleTemp.exP}
                  defaultValue={maleTemp.exP}
                  onChange={(e) => {
                    maleTemp.exP = e.target.value
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
                <span className="paddingBoth">流(A)</span>
                <Input
                  value={maleTemp.exA}
                  defaultValue={maleTemp.exA}
                  onChange={(e) => {
                    maleTemp.exA = e.target.value
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
                <span className="paddingBoth">存(L)</span>
                <Input
                  value={maleTemp.exLTatal}
                  defaultValue={maleTemp.exLTatal}
                  onChange={(e) => {
                    maleTemp.exLTatal = e.target.value
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
                <span className="paddingBoth">宫外孕</span>
                <Input
                  value={maleTemp.exEctopicPregnancy}
                  defaultValue={maleTemp.exEctopicPregnancy}
                  onChange={(e) => {
                    maleTemp.exEctopicPregnancy = e.target.value
                    this.props.changeData(maleTemp, "maleMaritalHistoryVO")
                  }}
                />
              </div>
            </FlexItem>
          </>
        )}
      </div>
    )
  }
}
