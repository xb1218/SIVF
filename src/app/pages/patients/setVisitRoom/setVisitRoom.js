import React, { Component } from "react"
import { Divider, Button, Input, message } from "antd"
import { BaseTable } from "@/app/components/base/baseTable"
import { depObj, handleData } from "@/app/utils/tool.js"
import "./index.scss"
import apis from "@/app/utils/apis"
//更改antd中已有Table的样式

export default class setVisit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //诊室列表---设置表格
      location: [
        {
          title: "地点",
          dataIndex: "place",
          align: "center",
        },
        {
          title: "诊室",
          dataIndex: "visitRoom",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "action",
          render: (text, record, index) => {
            return (
              <Button
                style={{
                  border: "1px dashed #59b4f4",
                  background: "#def0fd",
                  borderRadius: "2px",
                  padding: "2px 4px",
                }}
              >
                {record.action ? (
                  <svg
                    className="icon_svg"
                    aria-hidden="true"
                    onClick={() => this.deleteItemLine(index)}
                  >
                    <use xlinkHref="#iconjianhao"></use>
                  </svg>
                ) : null}
              </Button>
            )
          },
        },
      ],
      //诊室列表数据
      workData: [],
      recordData: [], //选中的数据
      currentUid: null, //当前选中的uid
      haveArry: [], //已经存在的诊室
    }
  }
  componentDidMount() {
    this.init()
  }
  //初始化工作配置数据
  init() {
    apis.WorkBench.getVisitRoomList().then((res) => {
      this.setState({
        workData: handleData(res.data, {
          place: null,
          visitRoom: null,
          action: null,
        }),
        haveArry: this.haveVisitRoom(res.data),
      })
    })
  }
  // 拿到所有的诊室拼接
  haveVisitRoom = (data) => {
    let arr = []
    data.forEach((item, index) => {
      item.visitValue = item.place + item.visitRoom
      arr.push(item.visitValue)
    })
    return arr
  }
  // 删除一行
  deleteItemLine = (index) => {
    let { workData } = this.state
    workData.splice(index, 1)
    this.setState({
      workData: this.ifNull(workData),
    })
    this.postSaveData(workData)
  }
  // 点击哪行修改哪行
  changeData = (record) => {
    let obj = {}
    depObj(obj, record)
    this.setState({
      recordData: [obj],
      showEdit: true,
      currentUid: record.uid,
    })
  }
  //  修改数据
  changeInput = (record, parm, val) => {
    let { recordData } = this.state
    record[parm] = val
    this.setState({
      recordData,
    })
  }
  // 点击修改完成时所有的数据都应该填写
  allowSave = () => {
    let { recordData } = this.state
    let showAllow = null
    if (recordData[0].place && recordData[0].visitRoom) {
      showAllow = true
    } else {
      message.error("请将数据填写完整!")
      showAllow = false
    }
    return showAllow
  }
  // 在修改完成之前判断是否已经有了该类型
  judgeHaveTwo = (haveArry, recordData) => {
    let targetDefault = null
    let targetString = recordData[0].place + recordData[0].visitRoom
    if (haveArry.includes(targetString)) {
      targetDefault = false
      message.error("已有此诊室，无需重复设置！")
    } else {
      targetDefault = true
    }
    return targetDefault
  }
  // 修改数据完成
  saveChange = () => {
    let { workData, recordData, currentUid, haveArry } = this.state
    if (this.allowSave() && this.judgeHaveTwo(haveArry, recordData)) {
      workData.forEach((item, index) => {
        item.action = true
        if (item.uid === currentUid) {
          depObj(item, recordData[0])
        }
      })
      this.setState({
        workData: this.ifNull(workData),
        showEdit: false,
      })
      this.postSaveData(workData)
    }
  }
  // 判断最终传给后台的数据是否为null
  ifNull = (data) => {
    data.forEach((item, index) => {
      if (item.place === null || item.visitRoom === null) {
        data.splice(index, 1)
      }
    })
    return data
  }
  // 修改诊室列表后台接口
  postSaveData = (workData) => {
    apis.WorkBench.postVisitRoomList(workData).then((res) => {
      message.success(res.message)
      this.init()
    })
  }
  render() {
    const { workData, location, showEdit, recordData } = this.state
    const changeColumns = [
      {
        title: "地点",
        dataIndex: "place",
        align: "center",
        render: (text, record) => {
          return (
            <Input
              value={record.place}
              onChange={({ target }) =>
                this.changeInput(record, "place", target.value)
              }
            />
          )
        },
      },
      {
        title: "诊室",
        dataIndex: "visitRoom",
        align: "center",
        render: (text, record) => {
          return (
            <Input
              value={record.visitRoom}
              onChange={({ target }) =>
                this.changeInput(record, "visitRoom", target.value)
              }
            />
          )
        },
      },
    ]
    return (
      <div>
        <div className="div_top_setcon">
          <BaseTable
            bordered="true"
            columns={location}
            dataSource={workData}
            pagination={false}
            scroll={{ y: `calc(100vh - 300px)` }}
            onRow={(record, text) => {
              return {
                onClick: () => this.changeData(record),
              }
            }}
          />
        </div>
        {showEdit ? (
          <>
            <Divider>编辑</Divider>
            <div style={{ textAlign: "right" }}>
              <svg
                style={{ width: "2em", height: "2em" }}
                aria-hidden="true"
                onClick={this.saveChange}
              >
                <use xlinkHref="#iconcheck" />
              </svg>
            </div>
            <div className="div_bottom_setcon">
              <BaseTable
                bordered
                columns={changeColumns}
                dataSource={recordData}
                pagination={false}
              />
            </div>
          </>
        ) : null}
      </div>
    )
  }
}
