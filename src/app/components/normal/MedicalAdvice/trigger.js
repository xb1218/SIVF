// 扳机
import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Select, TimePicker, InputNumber } from "antd"
import moment from "moment"
import "./index.scss"

const format = "HH:mm"
export default
@inject("moredetail")
@observer
class index extends Component {
  constructor() {
    super()
    this.state = {
      nowDate: moment(new Date()).format("YYYY-MM-DD"),
    }
  }

  // 计算取卵时间
  getEndTime = (starttime, addTime) => {
    this.props.getEndTime(starttime, addTime)
  }
  // 改变下拉框的值
  changeSelect = (val, parm, name) => {
    this.props.changeSelect(val, parm, name)
  }
  // 时长的改变
  changehours = (val) => {
    this.props.changehours(val)
  }
  // 时间的改变(和取卵时间相关)
  changeTime = (time, timestring) => {
    this.props.changeTime(time, timestring)
  }
  // 时间或者日期的改变
  changeDate = (time, timestring, parm) => {
    this.props.changeDate(time, timestring, parm)
  }
  render() {
    let {
      title,
      ontoptInfoList,
      cycleIUI,
      cycleType,
      dataSorceTrigger,
      dataSorceTriggerAgain,
    } = this.props
    let { nowDate } = this.state
    let { renderOptions } = this.props.moredetail
    return (
      <div className="divBottom">
        <div id="triggerDiv">
          <div className="triggerLeft">
            <p className="leftTitle">{title}</p>
          </div>
          <div className="triggerRight">
            {dataSorceTrigger.triggerDrugs.map((item, index) => (
              <div className="divFlex" key={index}>
                <div className="marginDiv divItem">
                  药名：<span className="spanUnder">{item.drugName}</span>
                </div>
                <div className="divItem">
                  用量：<span className="spanUnder">{item.dose}</span>
                </div>
              </div>
            ))}
            {cycleIUI ? (
              <div className="divFlex">
                <div className="marginDiv divItem">
                  时间：
                  <TimePicker
                    style={{ width: "70%" }}
                    value={
                      dataSorceTrigger.triggerTime
                        ? moment(dataSorceTrigger.triggerTime, format)
                        : ""
                    }
                    format={format}
                    onChange={(time, timestring) =>
                      this.changeTime(time, timestring)
                    }
                  />
                </div>
              </div>
            ) : cycleType === "IVF" ? (
              <>
                <div className="divFlex">
                  <div className="marginDiv divItem">
                    时间：
                    {dataSorceTrigger.triggerDate === nowDate ? (
                      <TimePicker
                        style={{ width: "70%" }}
                        value={
                          dataSorceTrigger.triggerTime
                            ? moment(dataSorceTrigger.triggerTime, format)
                            : ""
                        }
                        format={format}
                        onChange={(time, timestring) =>
                          this.changeTime(time, timestring)
                        }
                      />
                    ) : (
                      <span className="spanUnder">
                        {dataSorceTrigger.triggerTime}
                      </span>
                    )}
                  </div>
                  <div className="marginDiv divItem">
                    时长：
                    {dataSorceTrigger.triggerDate === nowDate ? (
                      <InputNumber
                        style={{ width: "70%", margin: "0" }}
                        value={dataSorceTrigger.hours}
                        onChange={(val) => this.changehours(val)}
                      />
                    ) : (
                      <span className="spanUnder">
                        {dataSorceTrigger.hours}
                      </span>
                    )}
                  </div>
                  <div className="marginDiv divItem ">
                    取卵日：
                    <span className="spanUnder">
                      {dataSorceTrigger.eggDate}
                    </span>
                  </div>
                  <div className="divItem ">
                    取卵时间：
                    <span className="spanUnder">
                      {dataSorceTrigger.eggTime}
                    </span>
                  </div>
                </div>
                <div className="divFlex">
                  <div className="marginDiv divItem" style={{ width: "50%" }}>
                    计划：
                    {dataSorceTrigger.triggerDate === nowDate ? (
                      <Select
                        style={{ width: "86%" }}
                        value={dataSorceTrigger.plan}
                        onChange={(val) =>
                          this.changeSelect(val, dataSorceTrigger, "plan")
                        }
                      >
                        {renderOptions(ontoptInfoList, "52")}
                      </Select>
                    ) : (
                      <span className="spanUnder">{dataSorceTrigger.plan}</span>
                    )}
                  </div>
                  <div className="divItem" style={{ width: "50%" }}>
                    提示：
                    {dataSorceTrigger.triggerDate === nowDate ? (
                      <Select
                        mode="tags"
                        style={{ width: "86%" }}
                        value={
                          dataSorceTrigger.specialNote
                            ? dataSorceTrigger.specialNote
                            : []
                        }
                        onChange={(val) =>
                          this.changeSelect(
                            val,
                            dataSorceTrigger,
                            "specialNote"
                          )
                        }
                      >
                        {renderOptions(ontoptInfoList, "232")}
                      </Select>
                    ) : (
                      <span className="spanUnder" style={{ width: "80%" }}>
                        {dataSorceTrigger.specialNote}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
        {dataSorceTriggerAgain.triggerAgainDrugs.length > 0 ? (
          <div id="triggerDiv">
            <div className="triggerLeft">
              <div className="repairCircle">补</div>
            </div>
            <div className="triggerRight">
              {dataSorceTriggerAgain.triggerAgainDrugs.map((item, index) => (
                <div className="divFlex" key={index}>
                  <div className="marginDiv divItem">
                    药名：<span className="spanUnder">{item.drugName}</span>
                  </div>
                  <div className="divItem">
                    用量：<span className="spanUnder">{item.dose}</span>
                  </div>
                </div>
              ))}
              <div className="divFlex">
                <div className="marginDiv divItem">
                  日期：
                  <span className="spanUnder">
                    {dataSorceTriggerAgain.triggerAgainDate}
                  </span>
                </div>
                <div className="divItem">
                  时间：
                  {dataSorceTriggerAgain.triggerAgainDate === nowDate ? (
                    <TimePicker
                      style={{ width: "70%" }}
                      defaultValue={
                        dataSorceTriggerAgain.triggerAgainTime
                          ? moment(
                              dataSorceTriggerAgain.triggerAgainTime,
                              format
                            )
                          : ""
                      }
                      format={format}
                      onChange={(time, timestring) =>
                        this.changeDate(time, timestring, "triggerAgainTime")
                      }
                    />
                  ) : (
                    <span className="spanUnder">
                      {dataSorceTriggerAgain.triggerAgainTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}
