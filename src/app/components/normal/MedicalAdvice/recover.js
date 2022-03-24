import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Select, DatePicker, TimePicker } from "antd"
import moment from "moment"
import "./index.scss"

const format = "HH:mm"

export default
@inject("moredetail")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    let { dataSorceRecover, changeSelect, changeDate, returnEt } = this.props
    let { renderOptions, ontoptInfoList } = this.props.moredetail
    return (
      <div className="divBottom">
        <div id="triggerDiv">
          <div className="triggerLeft">
            <p className="leftTitle">复苏医嘱</p>
          </div>
          <div className="triggerRight">
            <div className="divFlex">
              <div className="marginDiv divItem">
                解冻：
                <Select
                  style={{ width: "70%", margin: "0" }}
                  value={dataSorceRecover.thawType}
                  onChange={(val) =>
                    changeSelect(val, dataSorceRecover, "thawType")
                  }
                >
                  {renderOptions(ontoptInfoList, "212")}
                </Select>
              </div>
              {dataSorceRecover.thawType !== null &&
              dataSorceRecover.thawType.indexOf("胚胎") > -1 ? (
                <>
                  <div className="marginDiv divItem">
                    胚胎解冻日：
                    <DatePicker
                      style={{ width: "50%" }}
                      value={
                        dataSorceRecover.embryosThawDate
                          ? moment(dataSorceRecover.embryosThawDate)
                          : ""
                      }
                      onChange={(date, datestring) => {
                        changeDate(
                          date,
                          datestring,
                          dataSorceRecover,
                          "embryosThawDate"
                        )
                        returnEt()
                      }}
                    />
                  </div>
                  <div className="divItem">
                    解冻时间：
                    <TimePicker
                      style={{ width: "50%" }}
                      value={
                        dataSorceRecover.embryosThawTime
                          ? moment(dataSorceRecover.embryosThawTime, format)
                          : ""
                      }
                      format={format}
                      onChange={(date, datestring) =>
                        changeDate(
                          date,
                          datestring,
                          dataSorceRecover,
                          "embryosThawTime"
                        )
                      }
                    />
                  </div>
                </>
              ) : null}
            </div>
            <div className="divFlex">
              <div className="marginDiv divItem">
                解冻前冻存胚胎
                <span className="underSpan">
                  {dataSorceRecover.thawEmbryos}枚
                </span>
                囊胚
                <span className="underSpan">
                  {dataSorceRecover.thawBlastocysts}枚
                </span>
              </div>
              {dataSorceRecover.thawType !== null &&
              dataSorceRecover.thawType.indexOf("囊胚") > -1 ? (
                <>
                  <div className="marginDiv divItem">
                    囊胚解冻日：
                    <DatePicker
                      style={{ width: "50%" }}
                      value={
                        dataSorceRecover.blastocystThawDate
                          ? moment(dataSorceRecover.blastocystThawDate)
                          : ""
                      }
                      onChange={(date, datestring) => {
                        changeDate(
                          date,
                          datestring,
                          dataSorceRecover,
                          "blastocystThawDate"
                        )
                        returnEt()
                      }}
                    />
                  </div>
                  <div className="divItem">
                    解冻时间：
                    <TimePicker
                      style={{ width: "50%" }}
                      value={
                        dataSorceRecover.blastocystThawTime
                          ? moment(dataSorceRecover.blastocystThawTime, format)
                          : ""
                      }
                      format={format}
                      onChange={(date, datestring) =>
                        changeDate(
                          date,
                          datestring,
                          dataSorceRecover,
                          "blastocystThawTime"
                        )
                      }
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
