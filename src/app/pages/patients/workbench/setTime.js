import React, { Component } from "react"
import { FloatDiv } from "@/app/components/base/baseDiv"
import { DatePicker, TimePicker, Button, message } from "antd"
import moment from "moment"
import apis from "@/app/utils/apis.js"

const format = "HH:mm:ss"

export default class SetTime extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: moment(new Date()).format("YYYY-MM-DD"),
      time: moment().format("LTS"),
    }
  }
  // 重置时间
  reset = () => {
    apis.Time.resertTime().then((res) => {
      if (res.code === 200) {
        localStorage.setItem("nowDate", null)
        localStorage.setItem("nowTime", null)
        this.setState({
          date: moment(new Date()).format("YYYY-MM-DD"),
          time: moment().format("LTS"),
        })
        this.props.getCount() //获取工作台统计
        this.props.initWorkStation() //初始化工作台
        message.success(res.data)
      } else {
        message.error(res.message)
      }
    })
  }
  // 设置时间
  setUp = () => {
    let { date, time } = this.state
    let obj = { date, time }
    apis.Time.setTime(obj).then((res) => {
      if (res.code === 200) {
        localStorage.setItem("nowDate", moment(date).format("YYYY-MM-DD"))
        localStorage.setItem("nowTime", time)
        this.props.getCount() //获取工作台统计
        this.props.initWorkStation() //初始化工作台
        message.success(res.data)
      } else {
        message.error(res.message)
      }
    })
  }
  render() {
    let { date, time } = this.state
    return (
      <>
        <FloatDiv top="7em" right="9em">
          <DatePicker
            value={
              date
                ? moment(date, "YYYY-MM-DD")
                : moment(new Date(), "YYYY-MM-DD")
            }
            onChange={(date, datestring) => {
              this.setState({
                date: datestring,
              })
            }}
          />
          <TimePicker
            value={time ? moment(time, format) : ""}
            format={format}
            onChange={(time, timestring) => {
              this.setState({
                time: timestring,
              })
            }}
          />
          <Button onClick={this.setUp} style={{ marginRight: "5px" }}>
            设置时间
          </Button>
          <Button onClick={this.reset} style={{ marginRight: "5px" }}>
            重置时间
          </Button>
        </FloatDiv>
      </>
    )
  }
}
