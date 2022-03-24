import React, { Component } from "react"
import styled from "styled-components"
import { Select, DatePicker } from "antd"
import { Bar } from "@ant-design/charts"
import moment from "moment"
import { months, quarters } from "./default"
import BaseBread from "@/app/components/base/baseBread"
import { DateTitleView } from "@/app/components/normal/Title"
import DemoColumn from "@/app/components/normal/Charts/Column"
import DemoLine from "@/app/components/normal/Charts/Line"
// import DemoBar from "@/app/components/normal/Charts/Bar"
import "./index.scss"
import apis from "@/app/utils/apis"

const Content = styled.div`
  margin: 0 auto;
  width: 95%;
  text-align: left;
  height: ${`calc(100vh - 70px)`};
`
const yearFormat = `YYYY`
const colorColumn = ["#65D7E2", "#98A3FF", "#FF9797"]
const colorColumnYear = ["#65D7E2", "#98A3FF"]
const colorLine = ["#65D7E2", "#99A3FF", "#FF9797", "#FFCB68"]
export default class extends Component {
  state = {
    month: 1, //同期数对比的月份
    astSameData: [], //同期数对比数据,去年同月治疗年数据
    quarter: 1, //季度
    year: moment(new Date()).format("YYYY-MM-DD"),
    cyclethreeData: [], //三年内同季度对比
    yearQuarterData: [], //本年度各季度数据对比
    yearMonthData: [], //年度各月数据对比
  }
  componentDidMount() {
    this.setState({
      cycleData: this.state.cyclethreeData,
    })
    this.astSame() //去年同月治疗数据对比
    this.threeYear()
    this.getYearQuarterData()
    this.yearMonth()
  }
  //去年同月治疗数据对比
  astSame = (m) => {
    let { month } = this.state
    let mon = m > -1 ? m : month
    let obj = { month: mon }
    apis.DataView.astSame(obj).then((res) => {
      if (res.code === 200) {
        let data = res.data
        this.setState({
          astSameData: [...data],
        })
      }
    })
  }
  // 三年内同季度周期数对比
  threeYear = (q) => {
    let { quarter } = this.state
    let qs = q > -1 ? q : quarter
    let obj = { quarter: qs }
    apis.DataView.threeYear(obj).then((res) => {
      if (res.code === 200) {
        this.setState({
          cyclethreeData: this.handleThree(res.data, qs),
        })
      }
    })
  }
  // 处理三年同季度对比
  handleThree = (data, q) => {
    let datas = []
    data.forEach((item, index) => {
      datas.push(
        {
          name: "OPU",
          value: `${item.year}年第${q}季度`,
          label: item.opuData,
        },
        {
          name: "ET",
          value: `${item.year}年第${q}季度`,
          label: item.etData,
        },
        {
          name: "FET",
          value: `${item.year}年第${q}季度`,
          label: item.fetData,
        }
      )
    })
    return datas
  }
  // 本年度各季度对比
  getYearQuarterData = () => {
    apis.DataView.getYearQuarterData().then((res) => {
      if (res.code === 200) {
        this.setState({
          yearQuarterData: res.data,
        })
      }
    })
  }
  // 各年度各月数据
  yearMonth = (y) => {
    let { year } = this.state
    let ys = y ? y : year
    apis.DataView.yearMonth({ year: ys }).then((res) => {
      if (res.code === 200) {
        this.setState({
          yearMonthData: this.handleYearMonth(res.data),
        })
      }
    })
  }
  // 处理各年度各月数据
  handleYearMonth = (data) => {
    let datas = []
    data.forEach((item, index) => {
      datas.push(
        {
          name: "OPU",
          value: `${index + 1}月`,
          label: item.opu,
        },
        {
          name: "ET",
          value: `${index + 1}月`,
          label: item.et,
        }
      )
    })
    return datas
  }
  // 改变月份
  changeFuc = (val) => {
    this.setState({
      month: val,
    })
    this.astSame(val)
  }
  // 改变季度
  changeQuarter = (val) => {
    this.setState({
      quarter: val,
    })
    this.threeYear(val)
  }
  // 改变年份
  changeData = (date, datestring) => {
    this.setState({
      year: datestring,
    })
    this.yearMonth(datestring)
  }
  render() {
    const {
      month,
      year,
      astSameData,
      quarter,
      cyclethreeData,
      yearQuarterData,
      yearMonthData,
    } = this.state
    const SelectOption = () => {
      return (
        <Select
          style={{ width: 90 }}
          options={months}
          value={month}
          onChange={this.changeFuc}
        />
      )
    }
    const SelectMonths = () => {
      return (
        <Select
          style={{ width: 100 }}
          options={quarters}
          value={quarter}
          onChange={this.changeQuarter}
        />
      )
    }
    const DemoBar: React.FC = () => {
      const config = {
        data: astSameData,
        isGroup: true,
        xField: "count",
        yField: "stage",
        seriesField: "month",
        marginRatio: 1,
        legend: {
          offsetY: 5,
          layout: "horizontal",
          position: "bottom",
        },
        color: ["#65D7E2", "#98A3FF"],
      }
      return (
        <Content>
          <Bar {...config} />
        </Content>
      )
    }
    return (
      <div className="contentWrap ">
        <BaseBread first="数据回顾" />
        <div className="review">
          <div className="curlist">
            <DateTitleView
              style={{ marginBottom: 0, height: "100%" }}
              title={"去年同月治疗数据对比"}
              subtitle={<SelectOption />}
            >
              <DemoBar style={{ height: "calc(100vh - 100px)" }} />
            </DateTitleView>
          </div>
          <div className="threelist">
            <div className="comtop">
              <DateTitleView
                title={"三年内同季度周期数对比"}
                subtitle={<SelectMonths />}
              >
                <DemoColumn datas={cyclethreeData} colorlist={colorColumn} />
              </DateTitleView>

              <DateTitleView title={"本年度各季度数据对比"}>
                <DemoLine
                  datas={yearQuarterData}
                  colorlist={colorLine}
                  // yAxis={yAxisL}
                />
              </DateTitleView>
            </div>
            <div className="combottom">
              <DateTitleView
                style={{ marginBottom: 0, height: "100%" }}
                title={"年度各月数据对比"}
                subtitle={
                  <DatePicker
                    allowClear={false}
                    picker="year"
                    value={year ? moment(year, yearFormat) : ""}
                    onChange={this.changeData}
                  />
                }
              >
                <DemoColumn
                  datas={yearMonthData}
                  colorlist={colorColumnYear}
                  // yAxis={yAxisCY}
                />
              </DateTitleView>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
