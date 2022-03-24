import React, { Component } from "react"
import "./index.scss"
import moment from "moment"
// import { Pie } from "@ant-design/charts"
import DemoPie from "@/app/components/normal/Charts/Pie"
import BaseBread from "@/app/components/base/baseBread"
import { DateTitleView } from "@/app/components/normal/Title"
import BaseLine from "@/app/components/base/baseLine"
import DemoColumn from "@/app/components/normal/Charts/Column"
import Img from "@/assets/eggNumber.png"
import { Tabs, DatePicker, Select } from "antd"
import apis from "@/app/utils/apis"

const { RangePicker } = DatePicker
const { TabPane } = Tabs
const colorColumn = ["#65D7E2", "#98A3FF"]
const colorPie = ["#FF9797", "#5CB5F3", "#FFCB69", "#65D7E2"]

export default class extends Component {
  constructor() {
    super()
    this.state = {
      eggStartDate: moment(new Date())
        .subtract(1, "month")
        .format("YYYY-MM-DD"),
      eggEndDate: moment(new Date()).format("YYYY-MM-DD"),
      eggMonth: 1, //近一个月
      factorStartDate: moment(new Date())
        .subtract(1, "month")
        .format("YYYY-MM-DD"), //不孕因素开始时间
      factorEndDate: moment(new Date()).format("YYYY-MM-DD"), //不孕因素开始时间
      factormonth: 1, //近一个月
      bioStartDate: moment(new Date())
        .subtract(1, "month")
        .format("YYYY-MM-DD"), //生化妊娠率开始时间
      bioEndDate: moment(new Date()).format("YYYY-MM-DD"), //生化妊娠率结束时间
      bioMonth: 1, //近一个月
      month: 0, //0：近三月  1：近六月(Integer)，新鲜或复苏周期总数
      freshYAxis: { min: 0, max: 100 },
      treatmentValue: 0, //0：近三月  1：近六月(Integer)，治疗周期数
      cycleYAxis: { min: 0, max: 100 },
      pregnantValue: 0, //0：近三月  1：近六月(Integer)，新增不孕例数
      preganYAxis: { min: 0, max: 100 },
      successValue: 0, //0生化妊娠率,1临床妊娠率
      data: [], //不孕因素
      cycleData: [],
      treatmentData: [],
      pregnantData: [],
      average: 0, //平均获卵数
      success: { total: "72", color: "#FF9797" }, //生化妊娠率或临床妊娠率
      monthOptions: [
        { label: "近一个月", value: 1 },
        { label: "近三个月", value: 3 },
        { label: "近六个月", value: 6 },
      ],
    }
  }
  componentDidMount() {
    this.getFactor() //获取不孕因素
    this.getFresh() //获取新鲜或复苏周期数
    this.getCycleData() // 获取周期总数
    this.getPregan() // 获取新增不孕例数
    this.biochemicalPregnancyRate() // 获取生化妊娠率
    this.averageEgg() //获取平均获卵数
  }
  // 获取生化妊娠率
  biochemicalPregnancyRate = (start, end) => {
    let { success, bioStartDate, bioEndDate } = this.state
    let obj = {
      startDate: start ? start : bioStartDate,
      endDate: end ? end : bioEndDate,
    }
    apis.DataView.biochemicalPregnancyRate(obj).then((res) => {
      if (res.code === 200) {
        success.total = res.data
        this.setState({
          success,
        })
      }
    })
  }
  // 获取临床妊娠率
  clinicalPregnancyRate = (start, end) => {
    let { success, bioStartDate, bioEndDate } = this.state
    let obj = {
      startDate: start ? start : bioStartDate,
      endDate: end ? end : bioEndDate,
    }
    apis.DataView.clinicalPregnancyRate(obj).then((res) => {
      if (res.code === 200) {
        success.total = res.data
        this.setState({
          success,
        })
      }
    })
  }
  // 获取平均获卵数
  averageEgg = (start, end) => {
    let { eggEndDate, eggStartDate } = this.state
    let obj = {
      startDate: start ? start : eggStartDate,
      endDate: end ? end : eggEndDate,
    }
    apis.DataView.averageEgg(obj).then((res) => {
      if (res.code === 200) {
        this.setState({
          average: res.data,
        })
      }
    })
  }
  // 获取不孕因素
  getFactor = () => {
    let { factorStartDate, factorEndDate } = this.state
    let obj = {
      startDate: factorStartDate,
      endDate: factorEndDate,
    }
    apis.DataView.infertilityFactor(obj).then((res) => {
      if (res.code === 200) {
        this.setState({
          data: [
            {
              type: "女方因素",
              value: res.data.femaleFactor
                ? parseFloat(res.data.femaleFactor)
                : 0,
            },
            {
              type: "男方因素",
              value: res.data.maleFactor ? parseFloat(res.data.maleFactor) : 0,
            },
            {
              type: "双方因素",
              value: res.data.coupleFactor
                ? parseFloat(res.data.coupleFactor)
                : 0,
            },
            {
              type: "不明因素",
              value: res.data.unknownFactor
                ? parseFloat(res.data.unknownFactor)
                : 0,
            },
          ],
        })
      }
    })
  }
  // 获取周期总数
  getCycleData = (m) => {
    let { treatmentValue } = this.state
    let obj = { month: m ? m : treatmentValue }
    apis.DataView.cycleView(obj).then((res) => {
      if (res.code === 200) {
        this.setState({
          treatmentData: this.handleFresh(
            res.data,
            "治疗总例数",
            "治疗周期总数",
            "treatTotal",
            "treatCycle"
          ),
          cycleYAxis: this.getMaxData(
            this.handleFresh(
              res.data,
              "治疗总例数",
              "治疗周期总数",
              "treatTotal",
              "treatCycle"
            )
          ),
        })
      }
    })
  }
  // 获取新鲜或复苏周期数
  getFresh = (m) => {
    let { month } = this.state
    let obj = { month: m ? m : month }
    apis.DataView.fresh(obj).then((res) => {
      if (res.code === 200) {
        this.setState({
          cycleData: this.handleFresh(
            res.data,
            "新鲜周期",
            "复苏周期",
            "freshCycle",
            "recoverCycle"
          ),
          freshYAxis: this.getMaxData(
            this.handleFresh(
              res.data,
              "新鲜周期",
              "复苏周期",
              "freshCycle",
              "recoverCycle"
            )
          ),
        })
      }
    })
  }
  // 获取新增不孕例数
  getPregan = (m) => {
    let { pregnantValue } = this.state
    let obj = { month: m ? m : pregnantValue }
    apis.DataView.sterileView(obj).then((res) => {
      if (res.code === 200) {
        this.setState({
          pregnantData: this.handleFresh(
            res.data,
            "原发不孕例数",
            "继发不孕例数",
            "primaryInfertility",
            "secondaryInfertility"
          ),
          preganYAxis: this.getMaxData(
            this.handleFresh(
              res.data,
              "原发不孕例数",
              "继发不孕例数",
              "primaryInfertility",
              "secondaryInfertility"
            )
          ),
        })
      }
    })
  }
  // 找到最大数
  getMaxData = (data) => {
    let obj = { min: 0, max: 100 }
    let maxData = []
    data.forEach((item, index) => {
      maxData.push(item.label)
    })
    maxData.sort((a, b) => {
      return b - a
    })
    if (maxData[0] && maxData[0] > 0) {
      obj.max = maxData[0]
    }
    return obj
  }
  // 将新鲜或复苏周期进行转换
  handleFresh = (data, name1, name2, type1, type2) => {
    let freshData = []
    data.forEach((item, index) => {
      freshData.push(
        {
          name: name1,
          value: item.statisticateDate,
          label: item[type1],
        },
        {
          name: name2,
          value: item.statisticateDate,
          label: item[type2],
        }
      )
    })
    return [...freshData]
  }
  // 切换新鲜复复苏周期的月数
  cycleChange = (key) => {
    this.getFresh(key)
    this.setState({
      month: key,
    })
  }
  // 切换治疗周期总数
  treatmentChange = (key) => {
    this.getCycleData(key)
    this.setState({
      treatmentValue: key,
    })
  }
  // 新增不孕例数
  pregnantChange = (key) => {
    this.getPregan(key)
    this.setState({
      pregnantValue: key,
    })
  }
  // 切换生化妊娠率
  changeSuccess = () => {
    let { successValue } = this.state
    this.setState({
      successValue: successValue ? 0 : 1,
    })
    if (successValue) {
      this.biochemicalPregnancyRate() //生化
    } else {
      this.clinicalPregnancyRate() //临床
    }
  }
  // 切换月份
  changeFuc = (val, type) => {
    let { eggEndDate, bioEndDate, successValue } = this.state
    switch (type) {
      case 1:
        this.setState({
          eggMonth: val,
          eggStartDate: this.calDate(val),
        })
        this.averageEgg(this.calDate(val), eggEndDate)
        break
      case 2:
        this.setState({
          bioMonth: val,
          bioStartDate: this.calDate(val),
        })
        if (successValue) {
          this.clinicalPregnancyRate(this.calDate(val), bioEndDate)
        } else {
          this.biochemicalPregnancyRate(this.calDate(val), bioEndDate)
        }
        break
      default:
        break
    }
  }
  //计算开始时间结束时间
  calDate = (val) => {
    let date = moment(new Date()).subtract(1, "month").format("YYYY-MM-DD")
    switch (val) {
      case 1:
        date = moment(new Date()).subtract(1, "month").format("YYYY-MM-DD")
        break
      case 3:
        date = moment(new Date()).subtract(3, "month").format("YYYY-MM-DD")
        break
      case 6:
        date = moment(new Date()).subtract(6, "month").format("YYYY-MM-DD")
        break
      default:
        break
    }
    return date
  }
  // 时间的改变
  changeDate = (val, datestring, parm1, parm2, type) => {
    let { successValue } = this.state
    this.setState({
      [parm1]: datestring[0],
      [parm2]: datestring[1],
    })
    if (type === 1) {
      this.averageEgg(datestring[0], datestring[1])
    } else {
      if (successValue) {
        this.clinicalPregnancyRate(datestring[0], datestring[1])
      } else {
        this.biochemicalPregnancyRate(datestring[0], datestring[1])
      }
    }
  }
  render() {
    const {
      data,
      pregnantData,
      treatmentData,
      cycleData,
      average,
      success,
      month,
      freshYAxis,
      cycleYAxis,
      preganYAxis,
      successValue,
      treatmentValue,
      pregnantValue,
      monthOptions,
      bioMonth,
      eggMonth,
      eggStartDate,
      eggEndDate,
      bioStartDate,
      bioEndDate,
    } = this.state
    return (
      <div className="contentWrap ">
        <BaseBread first="数据总览" />
        <div className="overview">
          <div className="topview">
            <div className="topfirst">
              <div>
                <div className="eggCount">
                  <DateTitleView
                    name="平均获卵数"
                    range={
                      <RangePicker
                        allowClear={false}
                        style={{ width: 240 }}
                        value={[
                          moment(eggStartDate, "YYYY-MM"),
                          moment(eggEndDate, "YYYY-MM"),
                        ]}
                        picker="month"
                        onChange={(val, datestring) => {
                          this.changeDate(
                            val,
                            datestring,
                            "eggStartDate",
                            "eggEndDate",
                            1
                          )
                        }}
                      />
                    }
                    select={
                      <Select
                        onChange={(val) => this.changeFuc(val, 1)}
                        options={monthOptions}
                        value={eggMonth}
                        bordered={false}
                      />
                    }
                  >
                    <div className="imgDiv">
                      {average}
                      <img src={Img} alt="" className="imgNumber"></img>
                    </div>
                  </DateTitleView>
                </div>
                <div>
                  <DateTitleView
                    name={
                      <span className="spanLine" onClick={this.changeSuccess}>
                        {successValue ? "临床妊娠率" : "生化妊娠率"}
                      </span>
                    }
                    range={
                      <RangePicker
                        allowClear={false}
                        style={{ width: 240 }}
                        value={[
                          moment(bioStartDate, "YYYY-MM"),
                          moment(bioEndDate, "YYYY-MM"),
                        ]}
                        picker="month"
                        onChange={(val, datestring) => {
                          this.changeDate(
                            val,
                            datestring,
                            "bioStartDate",
                            "bioEndDate",
                            2
                          )
                        }}
                      />
                    }
                    select={
                      <Select
                        onChange={(val) => this.changeFuc(val, 2)}
                        options={monthOptions}
                        value={bioMonth}
                        bordered={false}
                      />
                    }
                  >
                    <BaseLine total={success.total} color={success.color} />
                  </DateTitleView>
                </div>
              </div>
              <div>
                <DateTitleView title="不孕因素">
                  <DemoPie datas={data} colorlist={colorPie} />
                </DateTitleView>
              </div>
            </div>
            <div>
              <DateTitleView
                title="新鲜/复苏周期数"
                style={{ marginRight: 0 }}
                subtitle={
                  <Tabs
                    className="leftmargin"
                    onChange={this.cycleChange}
                    value={month}
                  >
                    <TabPane tab="近三个月" key={0}></TabPane>
                    <TabPane tab="近六个月" key={1}></TabPane>
                  </Tabs>
                }
              >
                <DemoColumn
                  datas={cycleData}
                  colorlist={colorColumn}
                  yAxis={freshYAxis}
                />
              </DateTitleView>
            </div>
          </div>
          <div className="bottomview">
            <div>
              <DateTitleView
                style={{ marginBottom: 0, height: "100%" }}
                title="周期总数"
                subtitle={
                  <Tabs
                    className="leftmargin"
                    onChange={this.treatmentChange}
                    defaultActiveKey={treatmentValue}
                  >
                    <TabPane tab="近三个月" key={0}></TabPane>
                    <TabPane tab="近六个月" key={1}></TabPane>
                  </Tabs>
                }
              >
                <DemoColumn
                  datas={treatmentData}
                  colorlist={colorColumn}
                  yAxis={cycleYAxis}
                />
              </DateTitleView>
            </div>
            <div>
              <DateTitleView
                title="新增不育例数"
                style={{ marginRight: 0, marginBottom: 0, height: "100%" }}
                subtitle={
                  <Tabs
                    className="leftmargin"
                    onChange={this.pregnantChange}
                    defaultActiveKey={pregnantValue}
                  >
                    <TabPane tab="近三个月" key={0}></TabPane>
                    <TabPane tab="近六个月" key={1}></TabPane>
                  </Tabs>
                }
              >
                <DemoColumn
                  datas={pregnantData}
                  colorlist={colorColumn}
                  yAxis={preganYAxis}
                />
              </DateTitleView>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
