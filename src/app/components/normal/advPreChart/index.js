import React from "react"
import { inject } from "mobx-react"
import "./index.scss"
import { DualAxes } from "@ant-design/charts"
import { CloseOutlined } from "@ant-design/icons"

export default
@inject("moredetail", "store")
class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chartData: [],
      largerData: []
    }
  }

  componentDidMount() {
    this.dealChartData()
  }

  UNSAFE_componentWillReceiveProps(nextprops) {}

  //整理图表数据
  dealChartData = () => {
    //名称数组 type: arr -> bloodHormoneHead
    //数据数组 type: arr -> bloodHormoneViews
    //此条日期 type: string -> monitorDate
    //HCG(IU/L) -> state: largerData
    let { chartData } = this.props
    let tempData = [] 
    let tempOther = [] 
    chartData.forEach(item => {
      item.bloodHormoneViews.forEach((dataItem, dataIndex) => {
        dataItem.forEach((citem, cindex) => {
          //双轴数据分别分组
          if(chartData[0].bloodHormoneHead[cindex] === "HCG(IU/L)"){
            let tempObj = {
              name: "HCG(IU/L)",
              count: parseInt(citem),
              date: item.bloodHormoneViews.length > 1 ? (item.monitorDate + `(${dataIndex + 1})`) : item.monitorDate,
            }
            tempOther.push(tempObj)
          }else{
            let tempObj = {
              type: chartData[0].bloodHormoneHead[cindex],
              value: parseInt(citem),
              date: item.bloodHormoneViews.length > 1 ? (item.monitorDate + `(${dataIndex + 1})`) : item.monitorDate,
            }
            tempData.push(tempObj)
          }
        })
      })
    })
    this.setState({
      chartData: [...tempData],
      largerData: [...tempOther]
    })
  }

  render() {
    let { patientName, close } = this.props
    let { chartData, largerData } = this.state
    const config = {
      data: [largerData, chartData],
      xField: "date",
      yField: ["count", "value"],
      geometryOptions: [
        {
          geometry: 'line',
          seriesField: 'name',
          lineStyle: {
            lineWidth: 3,
            lineDash: [5, 5],
          },
          smooth: true,
        },
        {
          geometry: 'line',
          seriesField: 'type',
          point: {},
        },
      ],
    }
    return (
      <div className="chartBody">
        <span className="title"><span className="patientName">{patientName}</span> 血激素水平数据变化</span>
        <CloseOutlined className="close" onClick={close} />
        <div className="chart">
          <DualAxes {...config} />
        </div>
      </div>
    )
  }
}
