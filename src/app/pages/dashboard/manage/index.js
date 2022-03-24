import React, { Component } from "react"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { Radio, Tabs, DatePicker, Select } from "antd"
import { workSelect, typeData, quarterlist } from "./defaultData"
import moment from "moment"
import BaseBread from "@/app/components/base/baseBread"
import { DateTitleView } from "@/app/components/normal/Title"
import DemoColumn from "@/app/components/normal/Charts/Column"
import DemoArea from "@/app/components/normal/Charts/Area"
import apis from "@/app/utils/apis"

import "./index.scss"

const { RangePicker } = DatePicker
const { TabPane } = Tabs
const colorColumn = ["#65D7E2", "#98A3FF"]
const yearFormat = `YYYY年`
const monthFormat = `YYYY年M月`

export default class extends Component {
  constructor() {
    super()
    this.state = {
      workSelectData: {
        typeTag: 0, //0=临床；1=实验室
        project: "移植", //项目
        startDate: moment(new Date()).format("YYYY-MM-DD"),
        endDate: moment(new Date()).format("YYYY-MM-DD"),
      },
      visitDate: moment(new Date()).format("YYYY-MM-DD"), //返诊量查询条件就诊显示的日期(季)
      returnDate: moment(new Date()).format("YYYY-MM-DD"), //返诊量查询条件就诊日期(周)
      roundDate: moment(new Date()).format("YYYY-MM-DD"), //返诊量查询条件就诊日期(周)
      todayDate: new Date().getDate(), //当前的日期
      workyAxis: { min: 0, max: 100 }, //工作量统计数据的最大与最小
      returnyAxis: { min: 0, max: 100 }, //返诊统计数据的最大与最小
      countsData: [], //例数统计数组
      timeData: [], //返诊量统计
      weekData: [], //周数据
      monthData: [], //月数据
      quarterData: [], //季度数据
      weekArrys: [], //每月周数据
      today: moment(),
      cycleData: [], //工作量统计
      cycleValue: "2", //当前是周1还是月2还是季度3
      quarter: null, //当前的季度
      week: [],
      weekDay: "",
      wIndex: 0, //当前周的下标
      qIndex: 0,
      text: "周日",
    }
  }
  componentDidMount() {
    this.selectQuar(new Date()) //当前的季度
    this.spliceDate() //当前的日期
    this.returnClinicData()
    this.workLoad()
    this.initWeek()
  }
  // 生成相应的周数数组
  weekArry = (arrys) => {
    let arry = []
    arrys.forEach((item, index) => {
      arry.push(`第${item}周`)
    })
    this.setState({
      weekArrys: [...arry],
    })
    return arry
  }
  // 计算一个月有多少周
  judgeHaveWeek = (date, textDay) => {
    // 2022-08-31
    let text = textDay ? textDay : this.state.text
    let year = date.split("-")[0]
    let month = date.split("-")[1]
    let weekCount = []
    // 计算这个月总共有多少天
    let days = new Date(year, month, 0).getDate()
    // 每个月的第一天是星期几
    let weekDayStart = new Date(`${year}-${month}-1`).getDay()
    // 每个月的最后一天是星期几
    let weekDayEnd = new Date(`${year}-${month}-${days}`).getDay()

    let allDay
    if (text === "周日") {
      allDay = (days + weekDayStart - weekDayEnd - 8) / 7
      if (weekDayStart <= 3) {
        allDay += 1
      }
      if (weekDayEnd >= 3) {
        allDay += 1
      }
    } else {
      let signDayStart
      let signDayEnd
      weekDayStart === 0 ? (signDayStart = 7) : (signDayStart = weekDayStart)
      weekDayEnd === 0 ? (signDayEnd = 7) : (signDayEnd = weekDayEnd)
      allDay = (days - 8 + signDayStart - signDayEnd) / 7
      if (signDayStart <= 4) {
        allDay += 1
      }
      if (signDayEnd >= 4) {
        allDay += 1
      }
    }
    for (let i = 1; i <= allDay; i++) {
      weekCount.push(i)
    }
    return this.weekArry(weekCount)
  }

  // 计算当前是第几周，周的索引
  initWeek = (date, textDay) => {
    let returnDate = date ? date : this.state.returnDate
    let text = textDay ? textDay : this.state.text
    let week = this.judgeHaveWeek(returnDate, text)
    let year = returnDate.split("-")[0]
    let month = returnDate.split("-")[1]
    let day = returnDate.split("-")[2]
    let arr = []
    let allDays = 0
    let weekIndex

    // 计算这个月总共有多少天
    let days = new Date(year, month, 0).getDate()
    // 每个月的第一天是星期几
    let weekDayStart = new Date(`${year}-${month}-01`).getDay()
    // 每个月的最后一天是星期几
    let weekDayEnd = new Date(`${year}-${month}-${days}`).getDay()

    let allDay
    let signDayStart
    let signDayEnd
    if (text === "周日") {
      allDay = (days + weekDayStart - weekDayEnd - 8) / 7
    } else {
      weekDayStart === 0 ? (signDayStart = 7) : (signDayStart = weekDayStart)
      weekDayEnd === 0 ? (signDayEnd = 7) : (signDayEnd = weekDayEnd)
      allDay = (days - 8 + signDayStart - signDayEnd) / 7
    }

    text === "周日" ? arr.push(7 - weekDayStart) : arr.push(8 - signDayStart)
    for (let i = 1; i <= allDay; i++) {
      arr.push(7)
    }
    text === "周日" ? arr.push(weekDayEnd + 1) : arr.push(signDayEnd)
    for (let i = 0; i < arr.length; i++) {
      allDays += arr[i]
      if (allDays >= day) {
        weekIndex = i
        break
      }
    }
    if (arr[0] < 4 && day < 4) {
      weekIndex = 0
      this.setState({
        returnDate: `${year}-${month}-0${arr[0] + 1}`,
      })
    } else if (arr[0] < 4) {
      weekIndex = weekIndex - 1
    }
    if (arr[arr.length - 1] < 4 && days - day < 3) {
      weekIndex = weekIndex - 1
      this.setState({
        returnDate: `${year}-${month}-${days - arr[arr.length - 1]}`,
      })
    }
    this.setState({
      weekDay: week[weekIndex],
      wIndex: weekIndex,
    })
  }

  // 切换计算方法
  changePattern = () => {
    let text
    let { returnDate, cycleValue } = this.state
    if (this.state.text === "周日") {
      text = "周一"
    } else {
      text = "周日"
    }
    this.initWeek(returnDate, text)
    this.returnClinicData(returnDate, cycleValue, text)
    this.setState({
      text,
    })
  }

  // 查询现在是第几季度
  selectQuar = (date) => {
    let { visitDate } = this.state
    var today = new Date(date ? date : visitDate) //获取当前时间
    var m = today.getMonth() + 1
    var quarter = ""
    if (m < 4) {
      quarter = 1
    } else if (m < 7) {
      quarter = 2
    } else if (m < 10) {
      quarter = 3
    } else {
      quarter = 4
    }
    this.setState({
      quarter: `第${quarter}季度`,
    })
    return quarter
  }
  // 拼接date
  spliceDate = () => {
    let { todayDate } = this.state
    if (todayDate < 10) {
      this.setState({
        todayDate: "0" + todayDate,
      })
    }
  }
  // 获取工作量统计的数据
  workLoad = () => {
    let { workSelectData } = this.state
    apis.DataView.workLoad(workSelectData).then((res) => {
      if (res.code === 200) {
        this.handleWorkData([...res.data])
      }
    })
  }
  // 获取返诊量统计
  // data: 2021-09-29       type: 周"1" 月"2" 季"3"
  returnClinicData = (date, type, week) => {
    let { roundDate, cycleValue, text } = this.state
    let obj = {
      visitDate: date ? date : roundDate,
      weekStartType: week ? (week === "周日" ? 0 : 1) : text === "周日" ? 0 : 1,
    }
    let cyc = type ? type : cycleValue
    apis.DataView.returnClinicData(obj).then((res) => {
      if (res.code === 200) {
        this.setState({
          timeData:
            cyc === "1"
              ? this.handleReturnData(res.data.weekDatas, "周")
              : cyc === "2"
              ? this.handleReturnData(res.data.monthDatas, "月")
              : this.handleQuarter(res.data.quarterDatas),
          weekData: this.handleReturnData(res.data.weekDatas, "周"),
          monthData: this.handleReturnData(res.data.monthDatas, "月"),
          quarterData: this.handleQuarter(res.data.quarterDatas),
          returnyAxis:
            cyc === "1"
              ? this.getMinorMax(res.data.weekDatas)
              : cyc === "2"
              ? this.getMinorMax(res.data.monthDatas)
              : this.getMinorMax(res.data.quarterDatas),
        })
        this.handleWeek(res.data.monthDatas)
        this.judgeHaveWeek(obj.visitDate)
      }
    })
  }
  // 数据处理,获取工作量统计
  handleWorkData = (data) => {
    let { countsData } = this.state
    let datas = []
    data.forEach((item) => {
      if (item.workloads.length > 0) {
        item.workloads.forEach((ele) => {
          if (ele.surgeon) {
            datas.push({
              name: item.stage,
              value: ele.surgeon,
              label: ele.counts,
            })
            countsData.push(ele.counts)
          }
        })
      }
    })
    this.setState({
      cycleData: [...datas],
      workyAxis: this.getMinorMax([...countsData]),
    })
  }
  // 数据处理，获取返诊量统计
  handleReturnData = (data, type) => {
    let datas = []
    switch (type) {
      case "周":
        let { text } = this.state
        if (text === "周日") {
          data.forEach((item, index) => {
            if (index === 0) {
              datas.push({
                date: "周7",
                type: "复诊",
                value: item,
              })
            } else {
              datas.push({
                date: `周${index}`,
                type: "复诊",
                value: item,
              })
            }
          })
        } else {
          data.forEach((item, index) => {
            datas.push({
              date: `周${index + 1}`,
              type: "复诊",
              value: item,
            })
          })
        }
        break
      case "月":
        data.forEach((item, index) => {
          datas.push({
            date: `第${index + 1}周`,
            type: "复诊",
            value: item,
          })
        })
        break
      default:
        break
    }
    return datas
  }
  // 处理总共有多少个周
  handleWeek = (data) => {
    let datas = []
    data.forEach((item, index) => {
      datas.push(`第${index + 1}周`)
    })
    this.setState({
      week: [...datas],
    })
  }
  // 找到统计中的最大值和最小值
  getMinorMax = (arr) => {
    let obj = { min: 0, max: 100 }
    if (arr.length > 0) {
      arr.sort((a, b) => {
        return b - a
      })
      if (arr[0] && arr[0] > 0) {
        obj.max = arr[0]
      }
    }
    return obj
  }
  // 单独处理季度的取值
  handleQuarter = (arr) => {
    let data = []
    let list = quarterlist.filter(
      (item, index) => item.value === this.selectQuar()
    )[0].list
    arr.forEach((item, index) => {
      list.forEach((iteml, indexl) => {
        if (index === indexl) {
          data.push({
            date: iteml,
            type: "复诊",
            value: item,
          })
        }
      })
    })
    return [...data]
  }
  // 改变周，月，季度
  cycleChange = (key) => {
    let { returnDate } = this.state
    this.setState({
      cycleValue: key,
    })
    this.returnClinicData(returnDate, key)
  }
  // 向后一个日期
  addWq = () => {
    let { cycleValue } = this.state
    switch (cycleValue) {
      case "1":
        this.changeWeek(1)
        break
      case "2":
        this.changeMonth(1)
        break
      case "3":
        this.changeQuare(1)
        break
      default:
        break
    }
  }
  // 向前一个日期
  cutWq = () => {
    let { cycleValue } = this.state
    // cycleValue: 周"1" 月"2" 季"3"
    switch (cycleValue) {
      case "1":
        this.changeWeek(0)
        break
      case "2":
        this.changeMonth(0)
        break
      case "3":
        this.changeQuare(0)
        break
      default:
        break
    }
  }
  // 改变下拉框选项
  changeSelect = (val, parm) => {
    let { workSelectData } = this.state
    workSelectData[parm] = val
    this.setState({
      workSelectData: { ...workSelectData },
    })
    this.workLoad()
  }
  // 改变时间下拉框
  changeDate = (val, datestring, parm1, parm2) => {
    let { workSelectData } = this.state
    workSelectData[parm1] = datestring && datestring[0]
    workSelectData[parm2] = datestring && datestring[1]
    this.setState({
      workSelectData: { ...workSelectData },
    })
    this.workLoad()
  }
  // 改变返诊日期
  changeVisitDate = (date, datestring, cycleValue) => {
    let { todayDate, visitDate } = this.state
    let year = datestring.split("-")[0]
    let month = datestring.split("-")[1]
    let days = new Date(year, month, 0).getDate()
    if (todayDate > days) {
      todayDate = days
    }
    if (cycleValue === "1") {
      this.setState({
        returnDate: `${datestring}-${todayDate}`,
      })
      this.initWeek(`${datestring}-${todayDate}`)
      this.returnClinicData(`${datestring}-${todayDate}`)
    }
    if (cycleValue === "2") {
      this.setState({
        roundDate: `${datestring}-${todayDate}`,
      })
      this.returnClinicData(`${datestring}-${todayDate}`)
    }
    if (cycleValue === "3") {
      let month = new Date(visitDate).getMonth() + 1
      this.setState({
        visitDate: `${datestring}-${month}-${todayDate}`,
      })
      this.returnClinicData(`${datestring}-${month}-${todayDate}`)
    }
  }
  // 向前或向后切换月份,向前为0，向后为1
  changeMonth = (type) => {
    let { roundDate } = this.state
    if (type) {
      this.setState({
        roundDate: moment(roundDate).add(1, "month").format("YYYY-MM-DD"),
      })
      this.returnClinicData(
        moment(roundDate).add(1, "month").format("YYYY-MM-DD")
      )
    } else {
      this.setState({
        roundDate: moment(roundDate).subtract(1, "month").format("YYYY-MM-DD"),
      })
      this.returnClinicData(
        moment(roundDate).subtract(1, "month").format("YYYY-MM-DD")
      )
    }
  }
  // 向前或向后切换季度
  changeQuare = (type) => {
    const quarters = ["第1季度", "第2季度", "第3季度", "第4季度"]
    let { visitDate, quarter } = this.state
    let index = quarters.indexOf(quarter)
    if (type) {
      if (index === 3) {
        this.setState({
          visitDate: moment(visitDate).add(3, "month").format("YYYY-MM-DD"),
          quarter: "第1季度",
        })
      } else {
        this.setState({
          visitDate: moment(visitDate).add(3, "month").format("YYYY-MM-DD"),
          quarter: quarters[index + 1],
        })
      }
      this.returnClinicData(
        moment(visitDate).add(3, "month").format("YYYY-MM-DD")
      )
    } else {
      if (index === 0) {
        this.setState({
          visitDate: moment(visitDate)
            .subtract(3, "month")
            .format("YYYY-MM-DD"),
          quarter: "第4季度",
        })
      } else {
        this.setState({
          visitDate: moment(visitDate)
            .subtract(3, "month")
            .format("YYYY-MM-DD"),
          quarter: quarters[index - 1],
        })
      }
      this.returnClinicData(
        moment(visitDate).subtract(3, "month").format("YYYY-MM-DD")
      )
    }
  }
  // 向前向后切换周(0是向后一周，1是向前一周)
  changeWeek = (type) => {
    let addDays = 7
    let removeDays = 7
    let { returnDate, wIndex, text } = this.state
    let year = returnDate.split("-")[0]
    let month = returnDate.split("-")[1]
    let day = returnDate.split("-")[2]
    let days = new Date(year, month, 0).getDate()
    // 按周日计算使用
    let weekDayStart = new Date(`${year}-${month}-01`).getDay()
    let weekDayEnd = new Date(`${year}-${month}-${days}`).getDay()
    // 按周一计算使用
    let signDayStart = weekDayStart === 0 ? 7 : weekDayStart
    let signDayEnd = weekDayEnd === 0 ? 7 : weekDayEnd

    if (type) {
      let nextTime = moment(returnDate).add(7, "days").format("YYYY-MM-DD")
      let nextYear = nextTime.split("-")[0]
      let nextMonth = nextTime.split("-")[1]
      let nextDay = nextTime.split("-")[2]
      let nextWeekDayStart = new Date(`${nextYear}-${nextMonth}-01`).getDay()
      let nextWeekDaySignStart = nextWeekDayStart === 0 ? 7 : nextWeekDayStart
      if (text === "周日") {
        if (
          month !== nextMonth &&
          nextWeekDayStart > 3 &&
          nextDay <= 7 - nextWeekDayStart
        ) {
          addDays = days - day
        }
        if (
          month === nextMonth &&
          weekDayEnd < 3 &&
          days - nextDay <= weekDayEnd
        ) {
          addDays = 8 + days - nextDay
        }
      } else {
        if (
          month !== nextMonth &&
          nextWeekDaySignStart > 4 &&
          nextDay <= 8 - nextWeekDaySignStart
        ) {
          addDays = days - day
        }
        if (
          month === nextMonth &&
          signDayEnd < 4 &&
          days - nextDay <= weekDayEnd
        ) {
          addDays = 8 + days - nextDay
        }
      }
    } else {
      let prevTime = moment(returnDate).subtract(7, "days").format("YYYY-MM-DD")
      let prevYear = prevTime.split("-")[0]
      let prevMonth = prevTime.split("-")[1]
      let prevDay = prevTime.split("-")[2]
      let prevDays = new Date(prevYear, prevMonth, 0).getDate()
      let prevWeekDayEnd = new Date(
        `${prevYear}-${prevMonth}-${prevDays}`
      ).getDay()
      let prevWeekDaySignEnd = prevWeekDayEnd === 0 ? 7 : prevWeekDayEnd
      if (text === "周日") {
        if (
          month !== prevMonth &&
          prevWeekDayEnd < 3 &&
          prevDays - prevDay < 3
        ) {
          removeDays = day - 1
        }
        if (month === prevMonth && weekDayStart > 3 && prevDay <= 3) {
          removeDays = 7 + Number(prevDay)
        }
      } else {
        if (
          month !== prevMonth &&
          prevWeekDaySignEnd < 4 &&
          prevDays - prevDay < 3
        ) {
          removeDays = day - 1
        }
        if (month === prevMonth && signDayStart > 4 && prevDay <= 3) {
          removeDays = 7 + Number(prevDay)
        }
      }
    }
    let weekArrys
    if (type) {
      weekArrys = this.judgeHaveWeek(
        moment(returnDate).add(addDays, "days").format("YYYY-MM-DD")
      )
    } else {
      weekArrys = this.judgeHaveWeek(
        moment(returnDate).subtract(removeDays, "days").format("YYYY-MM-DD")
      )
    }
    let lastIndex = weekArrys.length - 1
    if (type) {
      if (
        moment(returnDate)
          .add(addDays, "days")
          .format("YYYY-MM-DD")
          .split("-")[1] !== month
      ) {
        wIndex = -1
      }
    } else {
      if (
        moment(returnDate)
          .subtract(removeDays, "days")
          .format("YYYY-MM-DD")
          .split("-")[1] !== month
      ) {
        wIndex = weekArrys.length
      }
    }
    if (type) {
      if (wIndex < lastIndex) {
        this.setState({
          wIndex: wIndex + 1,
          weekDay: weekArrys[wIndex + 1],
        })
      } else {
        this.setState({
          wIndex: 0,
          weekDay: weekArrys[0],
        })
      }
      this.setState({
        returnDate: moment(returnDate)
          .add(addDays, "days")
          .format("YYYY-MM-DD"),
      })
      this.returnClinicData(
        moment(returnDate).add(addDays, "days").format("YYYY-MM-DD")
      )
    } else {
      if (wIndex > 0) {
        this.setState({
          wIndex: wIndex - 1,
          weekDay: weekArrys[wIndex - 1],
        })
      } else {
        this.setState({
          wIndex: weekArrys.length - 1,
          weekDay: weekArrys[weekArrys.length - 1],
        })
      }
      this.setState({
        returnDate: moment(returnDate)
          .subtract(removeDays, "days")
          .format("YYYY-MM-DD"),
      })
      this.returnClinicData(
        moment(returnDate).subtract(removeDays, "days").format("YYYY-MM-DD")
      )
    }
  }
  render() {
    const {
      workSelectData,
      cycleData,
      workyAxis,
      returnyAxis,
      cycleValue,
      timeData,
      visitDate,
      quarter,
      weekDay,
      returnDate,
      roundDate,
    } = this.state
    return (
      <div className="contentWrap">
        <BaseBread first="数据管理" />
        <div className="manage">
          <DateTitleView
            style={{ marginRight: 0 }}
            title={
              <>
                <span>工作量统计</span>
                <Radio.Group
                  options={typeData}
                  size="small"
                  value={workSelectData.typeTag}
                  className="typeRadio"
                  onChange={(e) => this.changeSelect(e.target.value, "typeTag")}
                  optionType="button"
                  buttonStyle="solid"
                />
              </>
            }
            subtitle={
              <span>
                <RangePicker
                  style={{ width: 250 }}
                  allowClear={false}
                  value={[
                    moment(workSelectData.startDate, "YYYY-MM-DD"),
                    moment(workSelectData.endDate, "YYYY-MM-DD"),
                  ]}
                  onChange={(val, datestring) => {
                    this.changeDate(val, datestring, "startDate", "endDate")
                  }}
                />
                <Select
                  defaultValue="请选择"
                  options={workSelect}
                  value={workSelectData.project}
                  style={{ width: 130, marginLeft: 15 }}
                  onChange={(val) => this.changeSelect(val, "project")}
                ></Select>
              </span>
            }
          >
            <DemoColumn
              datas={cycleData}
              colorlist={colorColumn}
              yAxis={workyAxis}
            />
          </DateTitleView>
          <DateTitleView
            style={{ marginRight: 0, marginBottom: 0, height: "100%" }}
            title="返诊量"
            selectOption={
              <div className="position_datePicker">
                <LeftOutlined onClick={this.cutWq} />
                {/* 周 */}
                <DatePicker
                  picker="month"
                  allowClear={false}
                  value={returnDate ? moment(returnDate, monthFormat) : ""}
                  style={{
                    width: "90px",
                    display: cycleValue === "1" ? "" : "none",
                  }}
                  suffixIcon={false}
                  bordered={false}
                  onChange={(date, datestring) =>
                    this.changeVisitDate(date, datestring, cycleValue)
                  }
                />
                {cycleValue === "1" ? <span>{weekDay}</span> : null}
                {/* 月 */}
                <DatePicker
                  picker="month"
                  allowClear={false}
                  value={roundDate ? moment(roundDate, monthFormat) : ""}
                  style={{
                    width: "90px",
                    display: cycleValue === "2" ? "" : "none",
                  }}
                  suffixIcon={false}
                  bordered={false}
                  onChange={(date, datestring) =>
                    this.changeVisitDate(date, datestring, cycleValue)
                  }
                />
                {/* 季度 */}
                <DatePicker
                  picker="year"
                  allowClear={false}
                  style={{ width: "80px" }}
                  value={visitDate ? moment(visitDate, yearFormat) : ""}
                  className={cycleValue === "3" ? null : "notshow"}
                  suffixIcon={false}
                  bordered={false}
                  onChange={(date, datestring) =>
                    this.changeVisitDate(date, datestring, cycleValue)
                  }
                />
                <span className={cycleValue === "3" ? null : "notshow"}>
                  {quarter}
                </span>
                <RightOutlined onClick={this.addWq} />
                {cycleValue === "1" ? (
                  <span
                    onClick={() => this.changePattern()}
                    style={{
                      marginLeft: "20px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    {this.state.text}
                  </span>
                ) : null}
              </div>
            }
            subtitle={
              <Tabs onChange={this.cycleChange} activeKey={cycleValue}>
                <TabPane tab="周" key="1"></TabPane>
                <TabPane tab="月" key="2"></TabPane>
                <TabPane tab="季" key="3"></TabPane>
              </Tabs>
            }
          >
            <DemoArea datas={timeData} yAxis={returnyAxis} />
          </DateTitleView>
        </div>
      </div>
    )
  }
}
