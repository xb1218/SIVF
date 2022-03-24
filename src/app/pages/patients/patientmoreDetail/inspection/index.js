import React, { Component } from "react"
import { DateTitleView } from "@/app/components/normal/Title"
import { FilterDiv } from "@/app/components/base/baseDiv"
import Type from "./type"
import Abnormal from "./abnormal"
import TimeLine from "./timeLine"
import "./index.scss"

export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      typeValue: "类型",
    }
  }

  setCurrentTab = (value) => {
    this.setState({
      typeValue: value,
    })
  }
  render() {
    let { typeValue } = this.state
    let { currentKey, sex, patientId } = this.props
    return (
      <div className="inspection">
        <DateTitleView
          style={{ marginRight: 0 }}
          flag={true}
          selectOption={
            <FilterDiv style={{ marginLeft: "10px" }} fontnum={4}>
              <div
                className={typeValue === "类型" ? "btnChecked" : "btnDefault"}
                onClick={() => {
                  this.setCurrentTab("类型")
                }}
              >
                类型
              </div>
              <div
                className={typeValue === "异常" ? "btnChecked" : "btnDefault"}
                onClick={() => {
                  this.setCurrentTab("异常")
                }}
              >
                异常
              </div>
              <div
                className={typeValue === "时间轴" ? "btnChecked" : "btnDefault"}
                onClick={() => {
                  this.setCurrentTab("时间轴")
                }}
              >
                时间轴
              </div>
            </FilterDiv>
          }
        />
        {typeValue === "类型" ? (
          // 类型
          <Type currentKey={currentKey} sex={sex} patientId={patientId} />
        ) : typeValue === "异常" ? (
          // 异常
          <Abnormal currentKey={currentKey} sex={sex} patientId={patientId} />
        ) : (
          // 时间轴
          <TimeLine currentKey={currentKey} sex={sex} patientId={patientId} />
        )}
      </div>
    )
  }
}
