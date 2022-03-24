import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { AlignCenterOutlined } from "@ant-design/icons"
import { BaseTable } from "@/app/components/base/baseTable"
import { putKeys } from "@/app/utils/tool.js"
import apis from "@/app/utils/apis"
import "./index.scss"

// 血激素表头

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super()
    this.state = {
      naturalViewData: [],
      naturalType: 0, //默认是收起的状态，0代表收起，1代表展开
      naturalHead: [],
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.getView()
  }
  // 获取就诊视图
  getView = () => {
    let { select_one } = this.props.store
    let { name, naturalObj } = this.props
    apis.NaturalMonitor.getNatureCycleView(
      naturalObj && name === "clinic" ? naturalObj : select_one
    ).then((res) => {
      putKeys(res.data)
      if (res.code === 200) {
        this.setState({
          naturalViewData: res.data,
          naturalHead:
            res.data[0] && res.data[0].bloodHormoneHead
              ? res.data[0].bloodHormoneHead
              : [],
        })
      }
    })
  }
  //点击行，获得这行的数据
  getRowrecord = (record) => {
    let { name } = this.props
    if (name === "mointor") {
      this.props.changeDate(record.monitorDate)
    }
  }
  // 切换血激素的表头
  checkNatural = () => {
    let { naturalType } = this.state
    this.setState({
      naturalType: !naturalType,
    })
  }
  // 判断图标
  judgeIcon = (item, olditem) => {
    let data = null
    item = item ? parseInt(item) : 0
    olditem = olditem ? parseInt(olditem) : 0
    if (item === olditem) {
      data = null
    } else if (item > olditem) {
      data = (
        <svg className="icon_s">
          <use xlinkHref="#iconrise" />
        </svg>
      )
    } else {
      data = (
        <svg className="icon_s">
          <use xlinkHref="#iconfall" />
        </svg>
      )
    }
    return data
  }
  render() {
    let { naturalViewData, naturalType, naturalHead } = this.state
    const columnsView = [
      {
        title: "日期",
        dataIndex: "monitorDate",
        key: "monitorDate",
      },
      {
        title: "月经",
        dataIndex: "afterMenstruation",
        key: "afterMenstruation",
      },
      {
        title: "左侧",
        dataIndex: "left",
        key: "left",
        children: [
          {
            title: "大小（cm）",
            dataIndex: "leftOvaryVolume",
            key: "leftOvaryVolume",
          },
          {
            title: "卵泡（mm）",
            dataIndex: "leftFolliclesTotal",
            key: "leftFolliclesTotal",
            render: (text, record) => {
              return (
                <>
                  {record.leftFollicles.map((item, index) => {
                    return <div key={index}>{item}</div>
                  })}
                  <div className="colorRed">{text ? <>({text})</> : null}</div>
                </>
              )
            },
          },
        ],
      },
      {
        title: "右侧",
        dataIndex: "right",
        key: "right",
        children: [
          {
            title: "大小（cm）",
            dataIndex: "rightOvaryVolume",
            key: "rightOvaryVolume",
          },
          {
            title: "卵泡（mm）",
            dataIndex: "rightFolliclesTotal",
            key: "rightFolliclesTotal",
            render: (text, record) => {
              return (
                <>
                  {record.rightFollicles.map((item, index) => {
                    return <div key={index}>{item}</div>
                  })}
                  <div className="colorRed">{text ? <>({text})</> : null}</div>
                </>
              )
            },
          },
        ],
      },
      {
        title: "子宫",
        dataIndex: "innerMembrane",
        key: "innerMembrane",
        children: [
          {
            title: "内膜（mm）分型",
            dataIndex: "typing",
            key: "typing",
            render: (text, record) => {
              return (
                <>
                  <div>{record.innerMembrane}</div>
                  <div>{record.typing}</div>
                </>
              )
            },
          },
        ],
      },
      {
        title: (
          <div>
            血激素化验
            <AlignCenterOutlined
              onClick={this.checkNatural}
              className="checkNatural"
            />
          </div>
        ),
        children: [
          {
            title: (
              <>
                {naturalType ? (
                  <div className="naturalHead">
                    {naturalHead.map((item, index) => {
                      return (
                        <div key={index}>
                          {item.split("(")[0]}
                          <div>{`(${item.split("(")[1]}`}</div>
                        </div>
                      )
                    })}{" "}
                  </div>
                ) : (
                  "血激素值"
                )}
              </>
            ),
            render: (text, record) => {
              return (
                <>
                  {naturalType ? (
                    <>
                      {record.bloodHormoneViews.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className={`naturalHead ${
                              record.bloodHormoneViews.length > 1
                                ? "borderNatural"
                                : null
                            }`}
                          >
                            {item.map((itemi, indexi) => {
                              return (
                                <div key={indexi}>
                                  {itemi}
                                  <span>
                                    {index > 0 ? (
                                      <>
                                        {this.judgeIcon(
                                          itemi,
                                          record.bloodHormoneViews[index - 1][
                                            indexi
                                          ]
                                        )}
                                      </>
                                    ) : null}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
                    </>
                  ) : (
                    <>
                      {record.bloodHormoneDetail.map((item, index) => {
                        return (
                          <div>
                            {item.map((itemi, indexi) => {
                              return <span key={indexi}>{itemi}, </span>
                            })}
                          </div>
                        )
                      })}
                    </>
                  )}
                </>
              )
            },
          },
        ],
      },
      {
        title: "B超录入",
        dataIndex: "ultrasoundRecorder",
        key: "ultrasoundRecorder",
      },
      {
        title: "B超医生",
        dataIndex: "ultrasoundDoctor",
        key: "ultrasoundDoctor",
      },
      {
        title: "医生",
        dataIndex: "doctor",
        key: "doctor",
      },
    ]
    return (
      <>
        <BaseTable
          bordered
          columns={columnsView}
          dataSource={naturalViewData}
          rowKey={(record) => record.uid}
          pagination={false}
          onRow={(record, index) => {
            return {
              onClick: () => this.getRowrecord(record),
            }
          }}
        />
      </>
    )
  }
}
