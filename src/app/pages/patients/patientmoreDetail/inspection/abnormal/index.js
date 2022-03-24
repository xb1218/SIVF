import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Spin } from "antd"
import { BaseTable } from "@/app/components/base/baseTable"
import { LoadingDiv } from "@/app/components/base/baseDiv"
import { Exception } from "./exception.js"
import { getRowSpan } from "@/app/utils/tool.js"
import "./index.scss"
import apis from "@/app/utils/apis"
import styled from "styled-components"

const ExceptionDiv = styled.div`
  display: flex;
  width: -webkit-fill-available;
  background-color: white;
  border-radius: 2px;
  padding: 10px 0;
`
const Title = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  .flag {
    vertical-align: middle;
    display: inline-block;
    margin: 0 10px;
    width: 2px;
    height: 14px;
    background-color: rgba(89, 180, 244, 1);
  }
  .title {
    font-weight: bold;
  }
`
export default
@inject("store", "inspection")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      physicalException: null,
      inspectionException: [],
      videoException: null,
      initFlag: false,
    }
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.sex !== this.props.sex ||
      nextProps.currentKey !== this.props.currentKey ||
      nextProps.patientId !== this.props.patientId
    ) {
      this.initAbnormal()
    }
  }
  componentDidMount() {
    this.initAbnormal()
  }
  selectPatient = () => {
    let { selectPatient } = this.props.inspection
    let { select_one } = this.props.store
    return selectPatient(select_one, this.props.sex)
  }
  initAbnormal = () => {
    apis.ManCheck.getException(this.selectPatient()).then((res) => {
      let data = res.data
      this.setState({
        physicalException: data.physicalException,
        inspectionException: data.inspectionException,
        videoException: data.videoException,
        initFlag: true,
      })
    })
  }
  render() {
    let {
      physicalException,
      inspectionException,
      videoException,
      initFlag,
    } = this.state
    let columns = [
      {
        title: "日期",
        align: "center",
        dataIndex: "date",
        key: "date",
        width: 150,
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
        title: "异常项目",
        align: "center",
        dataIndex: "inspectionProjectName",
        key: "inspectionProjectName",
        width: 600,
        render: (text, record, index) => {
          return <div>{text}</div>
        },
      },
      {
        title: "结果",
        dataIndex: "inspectionProjectValue",
        key: "inspectionProjectValue",
        align: "center",
        width: 300,
        render: (text, record, index) => {
          return text === "阳性（+）" ? (
            <div style={{ color: "red" }}>{text}</div>
          ) : (
            <div>{text}</div>
          )
        },
      },
      {
        title: "单位",
        dataIndex: "unit",
        key: "unit",
        align: "center",
        width: 300,
        render: (text, record, index) => {
          return <div>{text}</div>
        },
      },
      {
        title: "提示",
        dataIndex: "tips",
        key: "tips",
        align: "center",
        width: 300,
        render: (text, record, index) => {
          return (
            <div>
              {text === 1 ? (
                <svg className="icon_record" aria-hidden="true">
                  <use xlinkHref="#iconarrowup" />
                </svg>
              ) : text === -1 ? (
                <svg className="icon_record" aria-hidden="true">
                  <use xlinkHref="#icondownarrow" />
                </svg>
              ) : null}
            </div>
          )
        },
      },
      {
        title: "参考区间",
        dataIndex: "range",
        key: "range",
        align: "center",
        width: 300,
        render: (text, record, index) => {
          return <div>{text}</div>
        },
      },
    ]
    //左侧标题
    const LeftTitle = (props) => {
      return (
        <Title>
          <div className="flag"></div>
          <span className="title">{props.title}</span>
        </Title>
      )
    }
    return (
      <div className="abnormal">
        {initFlag ? (
          <>
            <ExceptionDiv>
              <LeftTitle title="体" />
              <Exception exceptions={physicalException} />
            </ExceptionDiv>
            <ExceptionDiv>
              <LeftTitle title="验" />
              <BaseTable
                style={{ margin: "0 10px 0 20px" }}
                columns={columns}
                dataSource={getRowSpan(inspectionException, "date")}
                pagination={false}
                rowKey={(record) => record.uid}
              />
            </ExceptionDiv>
            <ExceptionDiv>
              <LeftTitle title="查" />
              <Exception exceptions={videoException} />
            </ExceptionDiv>
          </>
        ) : (
          <LoadingDiv>
            <Spin />
          </LoadingDiv>
        )}
      </div>
    )
  }
}
