import React, { Component } from "react"
import { inject, observer } from "mobx-react"

export default
@inject("schedule")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          title: "基本信息",
          key: 0,
          children: [
            { name: "病历号", lable: "medicalRecordNum", value: "", key: 0 },
            { name: "女方", lable: "femaleName", value: "", key: 1 },
            { name: "年龄", lable: "femaleAge", value: "", key: 2 },
            { name: "电话", lable: "femalePhone", value: "", key: 3 },
            { name: "不孕因素", lable: "femaleFactors", value: "", key: 4 },
            { name: "男方", lable: "maleName", value: "", key: 5 },
            { name: "年龄", lable: "maleAge", value: "", key: 6 },
            { name: "电话", lable: "malePhone", value: "", key: 7 },
            { name: "不育因素", lable: "maleFactors", value: "", key: 8 },
          ],
        },
        {
          title: "取卵",
          key: 1,
          children: [
            { name: "组别", lable: "group", value: "", key: 0 },
            { name: "HCG时间", lable: "triggerTime", value: "", key: 1 },
            { name: "扳机时长", lable: "triggerHours", value: "", key: 2 },
            { name: "取卵时间", lable: "opuTime", value: "", key: 3 },
            { name: "拟麻醉", lable: "anesthetize", value: "", key: 4 },
          ],
        },
        {
          title: "周期类型",
          key: 2,
          children: [
            { name: "LMP", lable: "lmp", value: "", key: 0 },
            { name: "周期数", lable: "cycleOrder", value: "", key: 1 },
            { name: "周期类型", lable: "artMethod", value: "", key: 2 },
            { name: "精子", lable: "sperm", value: "", key: 3 },
            {
              name: "授精方式",
              lable: "inseminationMethod",
              value: "",
              key: 0,
            },
          ],
        },
        {
          title: "HCG日",
          key: 3,
          children: [
            { name: "内膜", lable: "innerMembrane", value: "", key: 0 },
            { name: "优势卵泡", lable: "dominantFollicle", value: "", key: 1 },
            { name: "≥16mm", lable: "largeThanSixteen", value: "", key: 2 },
            { name: "≥14mm", lable: "largeThanFourteen", value: "", key: 3 },
            { name: "≥12mm", lable: "largeThanTwelve", value: "", key: 4 },
            { name: "E2", lable: "e2", value: "", key: 5 },
            { name: "P", lable: "p", value: "", key: 6 },
            { name: "P值升高", lable: "pHigh", value: "", key: 7 },
            { name: "LH", lable: "lh", value: "", key: 8 },
          ],
        },
        {
          title: "备注",
          key: 4,
          children: [{ name: "", lable: "specialNote", value: "", key: 0 }],
        },
      ],
    }
  }
  componentDidMount() {
    this.handleData()
  }
  // 数据处理
  handleData = () => {
    let { arry } = this.props
    let { data } = this.state
    data.forEach((item, index) => {
      item.children.forEach((itemc, indexc) => {
        itemc.value = arry[itemc.lable]
      })
    })
    this.setState({
      data: data,
    })
  }
  render() {
    let { data } = this.state
    return (
      <div>
        {data.map((item, index) => {
          return (
            <div id="detailDivOpu" key={index}>
              <div className="detailItemTitle">{item.title}</div>
              {item.children.map((itemc, indexc) => {
                return (
                  <div key={itemc + indexc}>
                    {index === data.length - 1 ? (
                      <div className="detailItemOpu">{itemc.value}</div>
                    ) : (
                      <div className="detailItemOpu">
                        {itemc.name}:<span className="paddingspan"></span>
                        {itemc.value}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}
