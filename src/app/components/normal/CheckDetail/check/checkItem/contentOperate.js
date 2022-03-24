import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { Select, Input, Radio, DatePicker, AutoComplete } from "antd"
import { FontInput } from "@/app/components/base/baseFontInput"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { renderOptions } from "@/app/utils/tool.js" //引入不同的下拉框
import { dateFormatDate } from "@/app/utils/const.js"
import { CommonContent, CommonDiagnosis } from "./commonContent"
import moment from "moment"

const { TextArea } = Input

export default
@inject("store")
@observer
class Index extends Component {
  setInheritVal = (val, param) => {
    this.props.setInheritVal(val, param)
  }
  //修改B超检查时，调用
  setUltrasounds = (index, proIndex, param, value) => {
    this.props.setUltrasounds(index, proIndex, param, value)
  }
  // 给数据默认值
  defaultData = () => {
    let { ultrasounds } = this.props
    ultrasounds &&
      ultrasounds.forEach((item, index) => {
        if (item.bType === "胸部B超") {
          item.otherVideoDTOS &&
            item.otherVideoDTOS.forEach((itemo, indexo) => {
              itemo.result = itemo.result ? itemo.result : 0
            })
        }
      })
    return ultrasounds
  }
  render() {
    let { checkType, item, bType, ultrasounds, options, sex } = this.props
    let { patientSex } = this.props.store
    let flag = sex === null ? patientSex : sex
    // ultrasounds = this.defaultData()
    return (
      <>
        {checkType === "妇科B超" ? (
          <>
            <CommonContent item={item} setInheritVal={this.setInheritVal} />
            <FlexItem>
              <div className="flexgrow">
                <span>所见:</span>
                <TextArea
                  rows={2}
                  style={{ flexGrow: 1 }}
                  value={item.weSee}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "weSee")
                  }}
                />
              </div>
            </FlexItem>
            <FlexItem>
              <div className="flexgrow">
                <span>印象:</span>
                <TextArea
                  rows={2}
                  style={{ flexGrow: 1 }}
                  value={item.impression}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "impression")
                  }}
                />
              </div>
            </FlexItem>
          </>
        ) : checkType === "阴道B超" ? (
          <>
            <FlexItem>
              <div>
                <span>月经周期:</span>
                <span>
                  <FontInput
                    addonAfter="天"
                    style={{ width: 100 }}
                    value={item.menstruation}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "menstruation")
                    }}
                  />
                </span>
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <span>子宫:</span>
                <span>
                  <Input
                    value={item.uterusLength}
                    style={{ width: 50 }}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "uterusLength")
                    }}
                  />
                </span>
                <span className="spanTitle">*</span>
                <span>
                  <Input
                    value={item.uterusWidth}
                    style={{ width: 50 }}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "uterusWidth")
                    }}
                  />
                </span>
                <span className="spanTitle">*</span>
                <span>
                  <Input
                    value={item.uterusHeight}
                    style={{ width: 50 }}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "uterusHeight")
                    }}
                  />
                </span>
                <span className="spanTitle">cm</span>
              </div>
              <div>
                <span>内膜:</span>
                <span>
                  <FontInput
                    addonAfter="cm"
                    value={item.innerMembrane}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "innerMembrane")
                    }}
                  />
                </span>
              </div>
              <div>
                <span>形态:</span>
                <span>
                  <Select
                    value={item.morphological}
                    style={{ width: 110, textAlign: "left" }}
                    onChange={(value) => {
                      this.setInheritVal(value, "morphological")
                    }}
                  >
                    {renderOptions(options, "226")}
                  </Select>
                </span>
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <span>左卵巢:</span>
                <span>
                  <Input
                    value={item.leftOvaryLength}
                    style={{ width: 50 }}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "leftOvaryLength")
                    }}
                  />
                </span>
                <span className="spanTitle">*</span>
                <span>
                  <Input
                    value={item.leftOvaryWidth}
                    style={{ width: 50 }}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "leftOvaryWidth")
                    }}
                  />
                </span>
                <span className="spanTitle">*</span>
                <span>
                  <Input
                    value={item.leftOvaryHeight}
                    style={{ width: 50 }}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "leftOvaryHeight")
                    }}
                  />
                </span>
                <span className="spanTitle">cm</span>
              </div>
              <div>
                <span>优势卵泡:</span>
                <span>
                  <FontInput
                    addonAfter="cm"
                    value={item.leftOvaryDominantFollicle}
                    onChange={(e) => {
                      this.setInheritVal(
                        e.target.value,
                        "leftOvaryDominantFollicle"
                      )
                    }}
                  />
                </span>
              </div>
              <div>
                <span>卵泡:</span>
                <span>
                  <FontInput
                    addonAfter="个"
                    value={item.leftOvaryFollicle}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "leftOvaryFollicle")
                    }}
                  />
                </span>
              </div>
              <div>
                <span>窦卵泡:</span>
                <span>
                  <FontInput
                    addonAfter="个"
                    value={item.leftOvarySinusFollicle}
                    onChange={(e) => {
                      this.setInheritVal(
                        e.target.value,
                        "leftOvarySinusFollicle"
                      )
                    }}
                  />
                </span>
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <span>右卵巢:</span>
                <span>
                  <Input
                    value={item.rightOvaryLength}
                    style={{ width: 50 }}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "rightOvaryLength")
                    }}
                  />
                </span>
                <span className="spanTitle">*</span>
                <span>
                  <Input
                    value={item.rightOvaryWidth}
                    style={{ width: 50 }}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "rightOvaryWidth")
                    }}
                  />
                </span>
                <span className="spanTitle">*</span>
                <span>
                  <Input
                    value={item.rightOvaryHeight}
                    style={{ width: 50 }}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "rightOvaryHeight")
                    }}
                  />
                </span>
                <span className="spanTitle">cm</span>
              </div>
              <div>
                <span>优势卵泡:</span>
                <span>
                  <FontInput
                    addonAfter="cm"
                    value={item.rightOvaryDominantFollicle}
                    onChange={(e) => {
                      this.setInheritVal(
                        e.target.value,
                        "rightOvaryDominantFollicle"
                      )
                    }}
                  />
                </span>
              </div>
              <div>
                <span>卵泡:</span>
                <span>
                  <FontInput
                    addonAfter="个"
                    value={item.rightOvaryFollicle}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "rightOvaryFollicle")
                    }}
                  />
                </span>
              </div>
              <div>
                <span>窦卵泡:</span>
                <span>
                  <FontInput
                    addonAfter="个"
                    value={item.rightOvarySinusFollicle}
                    onChange={(e) => {
                      this.setInheritVal(
                        e.target.value,
                        "rightOvarySinusFollicle"
                      )
                    }}
                  />
                </span>
              </div>
            </FlexItem>
            <FlexItem>
              <div className="flexgrow">
                <span>备注:</span>
                <TextArea
                  rows={2}
                  style={{ flexGrow: 1 }}
                  value={item.note}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "note")
                  }}
                />
              </div>
            </FlexItem>
          </>
        ) : checkType === "B超检查" ? (
          flag ? (
            <>
              {item.edit ? (
                <>
                  {ultrasounds.map((project, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          lineHeight: "40px",
                        }}
                      >
                        <div
                          style={{
                            flexBasis: "112px",
                            textAlign: "left",
                            marginLeft: "2em",
                          }}
                        >
                          {project.bType}
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          {project.otherVideoDTOS
                            ? project.otherVideoDTOS.map(
                                (proItem, proIndex) => {
                                  return (
                                    <FlexItem key={proIndex}>
                                      <div>
                                        <span style={{ width: "100px" }}>
                                          {proItem.date}
                                        </span>
                                      </div>
                                      <div
                                        style={{
                                          minwidth: 260,
                                          marginLeft: 0,
                                        }}
                                      >
                                        <Radio.Group
                                          value={proItem.place}
                                          onChange={(e) => {
                                            this.setUltrasounds(
                                              index,
                                              proIndex,
                                              "place",
                                              e.target.value
                                            )
                                          }}
                                        >
                                          <Radio value={0}>本院</Radio>
                                          <Radio value={1}>外院</Radio>
                                          <Radio value={2}>第三方检查</Radio>
                                        </Radio.Group>
                                      </div>
                                      {project.bType === "胸部B超" ? (
                                        <div>
                                          <span>
                                            结果：
                                            <Radio.Group
                                              value={proItem.result}
                                              onChange={(e) => {
                                                this.setUltrasounds(
                                                  index,
                                                  proIndex,
                                                  "result",
                                                  e.target.value
                                                )
                                              }}
                                            >
                                              <Radio value={0}>正常</Radio>
                                              <Radio value={1}>异常</Radio>
                                            </Radio.Group>
                                          </span>
                                        </div>
                                      ) : null}
                                      {project.bType === "胸部B超" ? (
                                        <div className="flexgrow">
                                          <span>详述：</span>
                                          <AutoComplete
                                            allowClear
                                            options={[]}
                                            style={{
                                              flexGrow: 1,
                                            }}
                                            value={proItem.detail}
                                            onChange={(value) => {
                                              this.setUltrasounds(
                                                index,
                                                proIndex,
                                                "detail",
                                                value
                                              )
                                            }}
                                          />
                                        </div>
                                      ) : null}
                                      {project.bType !== "胸部B超" ? (
                                        <div className="flexgrow">
                                          <span>诊断：</span>
                                          <Input
                                            value={proItem.diagnosis}
                                            style={{
                                              flexGrow: 1,
                                            }}
                                            onChange={(e) => {
                                              this.setUltrasounds(
                                                index,
                                                proIndex,
                                                "diagnosis",
                                                e.target.value
                                              )
                                            }}
                                          />
                                        </div>
                                      ) : null}
                                    </FlexItem>
                                  )
                                }
                              )
                            : null}
                        </div>
                      </div>
                    )
                  })}
                </>
              ) : (
                <>
                  {bType === "胸部B超" ? (
                    <FlexItem>
                      <div>
                        <span>胸部B超:</span>
                        <span>
                          <DatePicker
                            style={{ width: 120 }}
                            value={
                              item.date
                                ? moment(item.date, dateFormatDate)
                                : null
                            }
                            onChange={(date, datestring) => {
                              this.setInheritVal(datestring, "date")
                            }}
                          />
                        </span>
                      </div>
                      <div>
                        <span>
                          结果:
                          <Radio.Group
                            value={item.result}
                            onChange={(e) => {
                              this.setInheritVal(e.target.value, "result")
                            }}
                          >
                            <Radio value={0}>正常</Radio>
                            <Radio value={1}>异常</Radio>
                          </Radio.Group>
                        </span>
                      </div>
                      <div className="flexgrow">
                        <span>详述:</span>
                        <AutoComplete
                          allowClear
                          options={[]}
                          style={{ flexGrow: 1 }}
                          value={item.detail}
                          onChange={(value) => {
                            this.setInheritVal(value, "detail")
                          }}
                        />
                      </div>
                    </FlexItem>
                  ) : (
                    <CommonDiagnosis
                      item={item}
                      type={bType}
                      setInheritVal={this.setInheritVal}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <CommonContent item={item} setInheritVal={this.setInheritVal} />
          )
        ) : checkType === "胸片" ? (
          <CommonContent item={item} setInheritVal={this.setInheritVal} />
        ) : checkType === "输卵管造影" ? (
          <>
            <FlexItem>
              <div>
                <span>方式:</span>
                <span>
                  <Select
                    value={item.method}
                    style={{ width: 94, textAlign: "left" }}
                    onChange={(value) => {
                      this.setInheritVal(value, "method")
                    }}
                  >
                    {renderOptions(options, "282")}
                  </Select>
                </span>
              </div>
              <div>
                <span>
                  子宫形态:
                  <Radio.Group
                    value={item.uterusMorphology}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "uterusMorphology")
                    }}
                  >
                    <Radio value={0}>正常</Radio>
                    <Radio value={1}>异常</Radio>
                  </Radio.Group>
                </span>
              </div>
              <div className="flexgrow">
                <span>详述:</span>
                <AutoComplete
                  allowClear
                  options={[]}
                  style={{ flexGrow: 1 }}
                  value={item.uterusDetail}
                  onChange={(value) => {
                    this.setInheritVal(value, "uterusDetail")
                  }}
                />
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <span>右侧输卵管:</span>
                <span>
                  <Select
                    value={item.rightFallopianTube}
                    style={{ width: 80, textAlign: "left" }}
                    onChange={(value) => {
                      this.setInheritVal(value, "rightFallopianTube")
                    }}
                  >
                    {renderOptions(options, "280")}
                  </Select>
                </span>
              </div>
              <div>
                <span>形态:</span>
                <span>
                  <Radio.Group
                    value={item.rightFallopianTubeMorphology}
                    onChange={(e) => {
                      this.setInheritVal(
                        e.target.value,
                        "rightFallopianTubeMorphology"
                      )
                    }}
                  >
                    <Radio value={0}>正常</Radio>
                    <Radio value={1}>异常</Radio>
                  </Radio.Group>
                </span>
              </div>
              <div className="flexgrow">
                <span>详述:</span>
                <AutoComplete
                  allowClear
                  options={[]}
                  style={{ flexGrow: 1 }}
                  value={item.rightFallopianTubeDetail}
                  onChange={(value) => {
                    this.setInheritVal(value, "rightFallopianTubeDetail")
                  }}
                />
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <span>左侧输卵管:</span>
                <span>
                  <Select
                    value={item.leftFallopianTube}
                    style={{ width: 80, textAlign: "left" }}
                    onChange={(value) => {
                      this.setInheritVal(value, "leftFallopianTube")
                    }}
                  >
                    {renderOptions(options, "280")}
                  </Select>
                </span>
              </div>
              <div>
                <span>形态:</span>
                <span>
                  <Radio.Group
                    value={item.leftFallopianTubeMorphology}
                    onChange={(e) => {
                      this.setInheritVal(
                        e.target.value,
                        "leftFallopianTubeMorphology"
                      )
                    }}
                  >
                    <Radio value={0}>正常</Radio>
                    <Radio value={1}>异常</Radio>
                  </Radio.Group>
                </span>
              </div>
              <div className="flexgrow">
                <span>详述:</span>
                <AutoComplete
                  allowClear
                  options={[]}
                  style={{ flexGrow: 1 }}
                  value={item.leftFallopianTubeDetail}
                  onChange={(value) => {
                    this.setInheritVal(value, "leftFallopianTubeDetail")
                  }}
                />
              </div>
            </FlexItem>
            <FlexItem>
              <div className="flexgrow">
                <span>表现:</span>
                <TextArea
                  rows={2}
                  style={{ flexGrow: 1 }}
                  value={item.expression}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "expression")
                  }}
                />
              </div>
            </FlexItem>
            <FlexItem>
              <div className="flexgrow">
                <span>诊断:</span>
                <TextArea
                  rows={2}
                  style={{ flexGrow: 1 }}
                  value={item.diagnostic}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "diagnostic")
                  }}
                />
              </div>
            </FlexItem>
          </>
        ) : checkType === "输卵管通液" ? (
          <CommonContent
            item={item}
            setInheritVal={this.setInheritVal}
            checkType={checkType}
            options={options}
          />
        ) : checkType === "心电图" ? (
          <>
            <CommonContent item={item} setInheritVal={this.setInheritVal} />
            <FlexItem>
              <div className="flexgrow">
                <span>提示:</span>
                <TextArea
                  rows={2}
                  style={{ flexGrow: 1 }}
                  value={item.tips}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "tips")
                  }}
                />
              </div>
            </FlexItem>
          </>
        ) : checkType === "宫腔镜" ? (
          <>
            <CommonContent item={item} setInheritVal={this.setInheritVal} />
            <FlexItem>
              <div>
                <span>cd138:</span>
                <span>
                  <Select
                    style={{ width: "130px" }}
                    value={item.cdOne}
                    onChange={(val) => {
                      this.setInheritVal(val, "cdOne")
                    }}
                  >
                    <Radio value="0">阴性（-）</Radio>
                    <Radio value="1">阳性（+）</Radio>
                  </Select>
                </span>
              </div>
              <div>
                <span>cd38:</span>
                <span>
                  <Select
                    style={{ width: "130px" }}
                    value={item.cdThree}
                    onChange={(val) => {
                      this.setInheritVal(val, "cdThree")
                    }}
                  >
                    <Radio value="0">阴性（-）</Radio>
                    <Radio value="1">阳性（+）</Radio>
                  </Select>
                </span>
              </div>
            </FlexItem>
          </>
        ) : checkType === "腹腔镜" ? (
          <CommonContent item={item} setInheritVal={this.setInheritVal} />
        ) : checkType === "阴道镜" ? (
          <>
            <FlexItem>
              <div>
                <span>
                  宫颈SPT:
                  <Radio.Group
                    value={item.spt}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "spt")
                    }}
                  >
                    <Radio value={0}>正常</Radio>
                    <Radio value={1}>异常</Radio>
                  </Radio.Group>
                </span>
              </div>
              <div>
                <span>
                  宫颈炎:
                  <Radio.Group
                    value={item.cervicitis}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "cervicitis")
                    }}
                  >
                    <Radio value={0}>正常</Radio>
                    <Radio value={1}>异常</Radio>
                  </Radio.Group>
                </span>
              </div>
              <div>
                <span>
                  宫颈转化区(TZ):
                  <Radio.Group
                    value={item.tz}
                    onChange={(e) => {
                      this.setInheritVal(e.target.value, "tz")
                    }}
                  >
                    <Radio value={0}>正常</Radio>
                    <Radio value={1}>异常</Radio>
                  </Radio.Group>
                </span>
              </div>
            </FlexItem>
            <FlexItem>
              <div className="flexgrow">
                <span>诊断:</span>
                <TextArea
                  rows={2}
                  style={{ flexGrow: 1 }}
                  value={item.diagnosis}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "diagnosis")
                  }}
                />
              </div>
            </FlexItem>
          </>
        ) : checkType === "子宫内膜活检" ? (
          <CommonContent item={item} setInheritVal={this.setInheritVal} />
        ) : null}
      </>
    )
  }
}
