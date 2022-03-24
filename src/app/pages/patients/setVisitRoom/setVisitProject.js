import React, { Component } from "react"
import apis from "@/app/utils/apis"
import { Divider, Button, Input, message } from "antd"
import { BaseTable } from "@/app/components/base/baseTable"
import { depObj, handleData } from "@/app/utils/tool.js"
import "./index.scss"

export default class workRole extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recordData: [], //当前修改的数据
      showEdit: false, //是否显示下方的编辑
      workIndex: 0, //当前要编辑行的索引
      workValue: "", //存储input中输入的值
      currentUid: null, //当前选中数据的uid
      workData: [], //工作角色表格数据
      haveArry: [], //已经拥有的工作角色拼接字符串数组
      roleData: [], //工作角色对照表
    }
  }
  componentDidMount() {
    this.init()
    this.roleComparison()
  }
  //获取设置工作角色表格数据
  init() {
    apis.WorkBench.getProjectGroup().then((res) => {
      this.setState({
        workData: handleData(res.data, {
          group: null,
          type: null,
          project: null,
          action: false,
        }),
        haveArry: this.haveProject(res.data),
      })
    })
  }
  // 工作角色对照表
  roleComparison = () => {
    apis.WorkBench.roleComparison().then((res) => {
      if (res.code === 200) {
        this.setState({
          roleData: res.data,
        })
      }
    })
  }
  // 当类型为男科时，不可填写组别和工作，当类型为妇科时，不可填写工作
  notDo = (data) => {
    let { roleData } = this.state
    let doNow = null
    if (data.type === "男科" || data.type === roleData.男科) {
      if (data.group || data.project) {
        doNow = false
        message.error(`类型为男科或${roleData.男科}时不可填写组别和工作!`)
      } else {
        doNow = true
      }
    } else if (data.type === "妇科" || data.type === roleData.妇科) {
      if (data.project) {
        doNow = false
        message.error(`类型为妇科或${roleData.妇科}时不可填写工作!`)
      } else {
        doNow = true
      }
    } else {
      if (!data.group || !data.project || !data.type) {
        doNow = false
        message.error(`请将数据填写完整!`)
      } else {
        doNow = true
      }
    }
    return doNow
  }
  // 获取已经拥有的工作角色数组
  haveProject = (data) => {
    let arr = []
    data.forEach((item, index) => {
      arr.push(item.typeProjectValue)
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
    if (recordData[0].type) {
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
    let targetString =
      recordData[0].group + recordData[0].type + recordData[0].project
    if (haveArry.includes(targetString)) {
      targetDefault = false
      message.error("已经有此工作角色，无需重复设置！")
    } else {
      targetDefault = true
    }
    return targetDefault
  }
  // 修改数据完成
  saveChange = () => {
    let { haveArry, workData, recordData, currentUid } = this.state
    if (this.notDo(recordData[0])) {
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
  }
  // 判断最终传给后台的数据是否为null
  ifNull = (data) => {
    data.forEach((item, index) => {
      if (item.type === null) {
        data.splice(index, 1)
      }
    })
    return data
  }
  // 修改诊室列表后台接口
  postSaveData = (workData) => {
    apis.WorkBench.postProjectGroup(workData).then((res) => {
      message.success(res.message)
      this.init()
    })
  }
  render() {
    const { workData, recordData, showEdit } = this.state
    const changeColumns = [
      {
        title: "组别",
        dataIndex: "group",
        align: "center",
        render: (text, record) => {
          return (
            <Input
              value={record.group}
              onChange={({ target }) =>
                this.changeInput(record, "group", target.value)
              }
            />
          )
        },
      },
      {
        title: "类型",
        dataIndex: "type",
        align: "center",
        render: (text, record) => {
          return (
            <Input
              value={record.type}
              onChange={({ target }) =>
                this.changeInput(record, "type", target.value)
              }
            />
          )
        },
      },
      {
        title: "工作",
        dataIndex: "project",
        align: "center",
        render: (text, record) => {
          return (
            <Input
              value={record.project}
              onChange={({ target }) =>
                this.changeInput(record, "project", target.value)
              }
            />
          )
        },
      },
    ]
    const workrole = [
      {
        title: "组别",
        dataIndex: "group",
        align: "center",
      },
      {
        title: "类型",
        dataIndex: "type",
        align: "center",
      },
      {
        title: "工作",
        dataIndex: "project",
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
    ]
    return (
      <div>
        <div className="div_top_setcon">
          <BaseTable
            bordered
            columns={workrole}
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
