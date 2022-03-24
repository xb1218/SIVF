//黄体用药(只读)
import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { BaseTable } from "@/app/components/base/baseTable"
import PanelTag from "@/app/components/normal/PanelTag"
import "./index.scss"

export default
@inject("moredetail")
@observer
class index extends Component {
  constructor() {
    super()
    this.state = {
      // 黄体表头
      colums: [
        {
          title: "日期",
          dataIndex: "drugDate",
          key: "drugDate",
          width: 100,
        },
        {
          title: "药名",
          dataIndex: "drugName",
          key: "drugName",
          width: 100,
        },
        {
          title: "用量",
          dataIndex: "dose",
          key: "dose",
          width: 100,
        },
        {
          title: "频次",
          dataIndex: "frequency",
          key: "frequency",
          width: 100,
        },
        {
          title: "天数",
          dataIndex: "days",
          key: "days",
          width: 100,
        },
        {
          title: "用法",
          dataIndex: "usage",
          key: "usage",
          width: 100,
        },
        {
          title: "说明",
          dataIndex: "explain",
          key: "explain",
          width: 200,
        },
        {
          title: "医生",
          dataIndex: "doctor",
          key: "doctor",
          width: 100,
        },
      ],
      dataSource: [],
    }
  }
  componentDidMount() {
    let { dataSorceLutealMedication } = this.props
    this.setState({
      dataSource: dataSorceLutealMedication,
    })
  }
  render() {
    let { colums, dataSource } = this.state
    return (
      <div>
        <PanelTag title="黄体用药" />
        <BaseTable
          columns={colums}
          pagination={false}
          dataSource={dataSource}
        />
      </div>
    )
  }
}
