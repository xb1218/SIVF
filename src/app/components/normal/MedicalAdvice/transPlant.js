import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Select, DatePicker, Input } from "antd"
import moment from "moment"
import "./index.scss"

export default
@inject("moredetail")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    let {
      defaultselectType,
      dataSorceTrs,
      embryoType,
      defaultType,
      blastulaType,
      changeSelect,
      changeDate,
      changeInput,
      returnEt,
    } = this.props
    let { renderOptions, ontoptInfoList } = this.props.moredetail
    return (
      <div className="divBottom">
        <div id="triggerDiv">
          <div className="triggerLeft">
            <p className="leftTitle">移植医嘱</p>
          </div>
          <div className="triggerRight">
            <div className="divFlex">
              <div className="marginDiv divItem">
                拟行：
                {defaultselectType ? (
                  <Select
                    style={{ width: "70%", margin: "0" }}
                    value={dataSorceTrs.transplantType}
                    onChange={(val) =>
                      changeSelect(val, dataSorceTrs, "transplantType")
                    }
                  >
                    {renderOptions(ontoptInfoList, "213")}
                  </Select>
                ) : (
                  <span className="spanUnderLine">
                    {dataSorceTrs.transplantType}
                  </span>
                )}
              </div>
              {dataSorceTrs.transplantType === "无可移植胚胎" ? (
                <div className="marginDiv divItem" style={{ width: "25%" }}>
                  <Select
                    style={{ width: "130px" }}
                    value={dataSorceTrs.type}
                    onChange={(val) => changeSelect(val, dataSorceTrs, "type")}
                  >
                    {renderOptions(ontoptInfoList, "218")}
                  </Select>
                </div>
              ) : null}
              {dataSorceTrs.transplantType === "无可移植胚胎" ||
              dataSorceTrs.transplantType === "不移植" ||
              dataSorceTrs.transplantType === "全胚冷冻" ? (
                <>
                  <div className="marginDiv divItem">
                    取消日期：
                    <DatePicker
                      style={{
                        width: "60%",
                        marginRight: "15px",
                      }}
                      value={
                        dataSorceTrs.cancelTransplantDate
                          ? moment(dataSorceTrs.cancelTransplantDate)
                          : ""
                      }
                      onChange={(date, datestring) =>
                        changeDate(
                          date,
                          datestring,
                          dataSorceTrs,
                          "cancelTransplantDate"
                        )
                      }
                    />
                  </div>
                  <div className="marginDiv divItem">
                    取消原因：
                    <Input
                      style={{ width: "60%" }}
                      value={dataSorceTrs.cancelTransplantReason}
                      onChange={(e) =>
                        changeInput(e, dataSorceTrs, "cancelTransplantReason")
                      }
                    />
                  </div>
                </>
              ) : null}
            </div>
            {/* 取消原因等 */}
            <div className="divFlex">
              {dataSorceTrs.transplantType &&
              dataSorceTrs.transplantType.indexOf("胚胎") > -1 &&
              dataSorceTrs.transplantType !== "无可移植胚胎" ? (
                <div className="marginDiv divItem" style={{ width: "60%" }}>
                  胚胎移植日：
                  {embryoType && defaultType ? (
                    <>
                      <DatePicker
                        style={{
                          width: "30%",
                          marginRight: "15px",
                        }}
                        value={
                          dataSorceTrs.embryosTransplantDate
                            ? moment(dataSorceTrs.embryosTransplantDate)
                            : ""
                        }
                        onChange={(date, datestring) => {
                          changeDate(
                            date,
                            datestring,
                            dataSorceTrs,
                            "embryosTransplantDate"
                          )
                          returnEt()
                        }}
                      />
                      <Input
                        addonAfter="枚"
                        style={{ width: "30%" }}
                        value={dataSorceTrs.embryosNumber}
                        onChange={(e) =>
                          changeInput(e, dataSorceTrs, "embryosNumber")
                        }
                      />
                    </>
                  ) : (
                    <>
                      <span className="spanUnderLine">
                        {dataSorceTrs.embryosTransplantDate}
                      </span>
                      <span className="spanUnderLine">
                        {dataSorceTrs.embryosNumber}枚
                      </span>
                    </>
                  )}
                </div>
              ) : null}
            </div>
            <div className="divFlex">
              {dataSorceTrs.transplantType &&
              dataSorceTrs.transplantType.indexOf("囊胚") > -1 ? (
                <div className="marginDiv divItem" style={{ width: "60%" }}>
                  囊胚移植日：
                  {blastulaType ? (
                    <>
                      <DatePicker
                        style={{
                          width: "30%",
                          marginRight: "15px",
                        }}
                        value={
                          dataSorceTrs.blastocystTransplantDate
                            ? moment(dataSorceTrs.blastocystTransplantDate)
                            : ""
                        }
                        onChange={(date, datestring) => {
                          changeDate(
                            date,
                            datestring,
                            dataSorceTrs,
                            "blastocystTransplantDate"
                          )
                          returnEt()
                        }}
                      />
                      <Input
                        addonAfter="枚"
                        style={{ width: "30%" }}
                        value={dataSorceTrs.blastocystNumber}
                        onChange={(e) =>
                          changeInput(e, dataSorceTrs, "blastocystNumber")
                        }
                      />
                    </>
                  ) : (
                    <>
                      <span className="spanUnderLine">
                        {dataSorceTrs.blastocystTransplantDate}
                      </span>
                      <span className="spanUnderLine">
                        {dataSorceTrs.blastocystNumber}枚
                      </span>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
