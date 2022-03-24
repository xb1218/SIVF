// 就诊记录
import React, { Component } from "react"
import { message } from "antd"
import { BaseTable } from "@/app/components/base/baseTable"
import styled from "styled-components"
import { NormalModal } from "@/app/components/base/baseModal"
import { observer, inject } from "mobx-react"
import { CONST_ONE } from "@/app/utils/const"
import api from "@/app/utils/apis"

const SrcollerDiv = styled.div.attrs({
  className: "ScrollDiv",
})`
  margin-top: 10px;
  height: calc(100vh - 114px);
  overflow-y: scroll;
  &.ScrollDiv::-webkit-scrollbar {
    display: none;
  }
`
const SpanBlue = styled.span`
  color: #59b4f4;
  cursor: pointer;
  border-bottom: 1px solid #59b4f4;
`
export default
@inject("moredetail", "store")
@observer
class FollowRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      diagnosis: "", //是将什么置为无效
      recordDia: null,
      visible: false, //弹框是否显示
      valid: false, //有效或者无效
      columns: [
        {
          title: "日期",
          dataIndex: "date",
          key: "date",
          width: 200,
          render(_, row) {
            return {
              children: row.date,
              props: {
                rowSpan: row.rowSpan,
              },
            }
          },
        },
        {
          title: "诊断",
          dataIndex: "diagnoseResult",
          key: "diagnoseResult",
          width: 250,
          render: (text, record) => {
            if (record.effectiveStatus === CONST_ONE) {
              return <span>{record.diagnoseResult}</span>
            } else {
              return (
                <span style={{ textDecoration: "line-through", color: "red" }}>
                  {record.diagnoseResult}
                </span>
              )
            }
          },
        },
        {
          title: "医生",
          dataIndex: "doctor",
          key: "doctor",
          width: 100,
        },
        {
          title: "修改者",
          dataIndex: "operator",
          key: "operator",
          width: 100,
        },
        {
          title: "操作",
          dataIndex: "effectiveStatus",
          key: "effectiveStatus",
          width: 150,
          render: (text, record) => {
            return (
              <div>
                {record.effectiveStatus === CONST_ONE ? null : (
                  <SpanBlue onClick={() => this.changeEffective(record)}>
                    设为有效
                  </SpanBlue>
                )}
              </div>
            )
          },
        },
      ],
      effectiveList: [], //诊断记录中的有效诊断
    }
  }
  // 初始化
  componentDidMount() {
    let { arry } = this.props
    this.setState({
      dataSource: arry,
    })
    this.judgeList(arry)
  }
  judgeList = (data) => {
    let { effectiveList } = this.state
    effectiveList = []
    data.forEach((item, index) => {
      if (item.effectiveStatus === 1) {
        effectiveList.push(item.diagnoseResult)
      }
    })
    this.setState({
      effectiveList: effectiveList,
    })
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.arry !== this.props.arry) {
      this.setState({
        dataSource: nextProps.arry,
      })
      this.judgeList(nextProps.arry)
    }
  }
  // 有效还是无效
  changeEffective = (record) => {
    this.setState({
      diagnosis: record.diagnoseResult,
      recordDia: record,
    })
    this.showFrame(record)
  }
  // 后台接口改变有效或无效
  ValidOrInvalid = () => {
    let { recordDia } = this.state
    let data = {
      uid: recordDia.uid,
      status: 1,
    }
    api.Diagnosis_order.modifyEffective(data).then((res) => {
      if (res.code === 200) {
        message.success(res.data)
        recordDia.effectiveStatus = 1
      }
    })
  }
  // 有效无效弹框的显示与隐藏
  showFrame = (record) => {
    let { effectiveList, visible } = this.state
    if (effectiveList.indexOf(record.diagnoseResult) > -1) {
      message.destroy()
      message.error("已存在该有效诊断，不可将其置为有效")
    } else {
      this.setState({
        visible: !visible,
      })
    }
  }
  // 点击确定
  handleOk = () => {
    let { dataSource } = this.state
    this.ValidOrInvalid()
    this.setState({
      visible: false,
      dataSource: [...dataSource],
    })
    let data = this.props.store.select_one
    this.props.click(data)
  }
  render() {
    let { getRowSpan } = this.props.moredetail
    let { columns, visible, diagnosis, dataSource } = this.state
    return (
      <SrcollerDiv>
        <div>
          <BaseTable
            columns={columns}
            dataSource={getRowSpan(dataSource, "date")}
            pagination={false}
          />
        </div>
        <NormalModal
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.showFrame}
          centered
          title="提示"
          closable={false}
        >
          <p className="modalp">
            确认将诊断
            <span style={{ color: "red" }}>{diagnosis}</span>
            置为有效吗？
          </p>
        </NormalModal>
      </SrcollerDiv>
    )
  }
}
