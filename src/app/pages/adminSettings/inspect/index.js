import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { BaseDiv } from "@/app/components/base/baseSpan"
import { BaseTable } from "@/app/components/base/baseTable"
import { AutoComplete, Input, Button, message } from "antd"
import apis from "@/app/utils/apis"
import Sider from "../sider"

import "../index.scss"

export default
@inject("moredetail", "store")
@observer
class advice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inspectOption: [],
      clinicTag: 1, //0代表门诊，1代表进周期
      packageName: null, //套餐名
      editShow: true, //是否是编辑的状态
      useScopeTag: 1, //0个人，1全院
      dataSource: [
        {
          key: 0,
          inspectionItem: null,
          entrustment: null,
        },
      ],
      uid: null, //套餐uid
    }
  }
  componentDidMount() {
    let { medicalAdviceOptions } = this.props.moredetail
    medicalAdviceOptions() //初始化检查项目下拉框
  }
  // 下拉框转换
  conversionOptionsInspect = () => {
    let { medicalAdviceCheckConfig } = this.props.moredetail
    let { inspectOption } = this.state
    medicalAdviceCheckConfig.forEach((item, index) => {
      if (item.inspectionItem) {
        inspectOption.push({
          key: item.inspectionItem,
          value: item.inspectionItem,
          label: !item.entrustment
            ? item.inspectionItem
            : item.inspectionItem + "," + item.entrustment,
        })
      }
    })
    this.setState({
      inspectOption: [...inspectOption],
    })
  }
  // 选择项目名
  changeInspect = (val, record, index) => {
    let { dataSource } = this.state
    record.inspectionItem = val ? val : ""
    this.autoDisplayInspect(record)
    this.setState({
      dataSource: [...dataSource],
    })
  }
  // 自动显示(项目)
  autoDisplayInspect = (record) => {
    let { dataSource } = this.state
    let { medicalAdviceCheckConfig } = this.props.moredetail
    medicalAdviceCheckConfig.forEach((item, index) => {
      if (record.inspectionItem === item.inspectionItem) {
        record.uid = item.uid
        record.itemId = item.id
        record.entrustment = item.entrustment
        record.inspectionItem = item.inspectionItem
      }
    })
    this.setState({
      dataSource: [...dataSource],
    })
  }
  // 获取项目的焦点
  focusInspect = () => {
    this.conversionOptionsInspect()
  }
  // 改变数据值
  changeInput = (e) => {
    this.setState({
      packageName: e.target.value,
    })
  }
  //嘱托数值改变
  changeInspectVal = (val, param, record) => {
    record[param] = val
    this.setState({
      dataSource: this.state.dataSource,
    })
  }
  // 检查套餐详情
  checkItem = (uid) => {
    apis.AdminSet.inspectDetails(uid).then((res) => {
      if (res.code === 200) {
        this.setState({
          uid: res.data.uid, //套餐uid
          packageName: res.data.packageName,
          dataSource: res.data.checkVOList,
          clinicTag: res.data.clinicTag,
          editShow: false,
        })
      }
    })
  }
  // 添加一个套餐
  addMeal = () => {
    let { uid } = this.state
    if (uid) {
      this.updateSource()
    } else {
      this.addSource()
    }
  }
  // 新建后台接口
  addSource = () => {
    let { medicalAdviceOptions } = this.props.moredetail
    let { packageName, clinicTag, useScopeTag, dataSource } = this.state
    let data = {
      roleType: 1,
      packageName,
      clinicTag,
      useScopeTag,
      checkVOList: dataSource,
    }
    if (data.packageName !== null && data.checkVOList[0]) {
      apis.AdminSet.addInspect(data).then((res) => {
        if (res.code === 200) {
          this.setState({
            editShow: false,
          })
          medicalAdviceOptions() //初始化用药配置
          this.Sider && this.Sider.getList(0, res.data)
          message.success("新建成功")
        } else {
          message.error(res.message)
        }
      })
    } else {
      message.warning("请填写完整信息!")
    }
  }
  // 修改套餐后台
  updateSource = () => {
    let { medicalAdviceOptions } = this.props.moredetail
    let { uid, packageName, clinicTag, dataSource, useScopeTag } = this.state
    let data = {
      uid,
      packageName,
      clinicTag,
      useScopeTag,
      checkVOList: dataSource,
    }
    apis.AdminSet.modifyInspect(data).then((res) => {
      if (res.code === 200) {
        this.Sider && this.Sider.getList(1, uid)
        this.setState({
          editShow: false,
        })
        medicalAdviceOptions() //初始化用药配置
        message.success(res.data)
      } else {
        message.error(res.message)
      }
    })
  }
  // 添加新的一行
  addNewLine = () => {
    let { dataSource } = this.state
    // 添加删除按钮，若为最后一行，则添加新的一行
    dataSource.push({
      key: dataSource.length,
      inspectionItem: null,
      entrustment: null,
    })
    this.setState({
      dataSource: [...dataSource],
    })
  }
  // 删除一行
  deleteLine = (index) => {
    let { dataSource } = this.state
    dataSource.splice(index, 1)
    this.setState({
      dataSource: [...dataSource],
    })
  }
  // 查看模式或编辑模式
  editShow = (val) => {
    this.setState({
      editShow: val,
    })
  }
  // 切换门诊或者进周期
  switchType = (val) => {
    this.setState({
      clinicTag: val,
    })
  }
  // 查看模式或编辑模式
  editShow = (val) => {
    this.setState({
      editShow: val,
    })
  }
  // 点击新建一个套餐
  addIcon = () => {
    this.conversionOptionsInspect()
    this.setState({
      editShow: true,
      packageName: null, //套餐名
      uid: null, //套餐uid
      dataSource: [
        {
          key: 0,
          inspectionItem: null,
          entrustment: null,
        },
      ], //表格数据
    })
  }
  render() {
    let {
      inspectOption,
      clinicTag,
      dataSource,
      packageName,
      editShow,
    } = this.state
    const columnsInspect = [
      {
        title: "检查项目",
        dataIndex: "inspectionItem",
        key: "inspectionItem",
        width: 150,
        verticalAlign: "left",
        render: (text, record, index) => {
          return (
            <>
              {editShow ? (
                <AutoComplete
                  dropdownMatchSelectWidth={350}
                  allowClear
                  options={inspectOption}
                  value={record.inspectionItem}
                  style={{ width: "90%" }}
                  onChange={(val) => this.changeInspect(val, record, index)}
                  onFocus={() => this.focusInspect(record)}
                />
              ) : (
                <span>{text}</span>
              )}
            </>
          )
        },
      },
      {
        title: "嘱托",
        dataIndex: "entrustment",
        key: "entrustment",
        width: 200,
        render: (text, record) => {
          return (
            <>
              {editShow ? (
                <Input
                  value={record.entrustment}
                  onChange={(e) =>
                    this.changeInspectVal(e.target.value, "entrustment", record)
                  }
                />
              ) : (
                <span>{text}</span>
              )}
            </>
          )
        },
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        className: editShow ? "null" : "disNow",
        width: 25,
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
              {index === 0 ? (
                <svg
                  className="icon_svg"
                  aria-hidden="true"
                  onClick={() => this.addNewLine()}
                >
                  <use xlinkHref="#iconjiahao1"></use>
                </svg>
              ) : (
                <svg
                  className="icon_svg"
                  aria-hidden="true"
                  onClick={() => this.deleteLine(index)}
                >
                  <use xlinkHref="#iconjianhao"></use>
                </svg>
              )}
            </Button>
          )
        },
      },
    ]
    return (
      <div id="adminSet">
        <BaseDiv className="leftset">
          <Sider
            type={1}
            checkItem={(uid) => this.checkItem(uid)}
            addIcon={() => this.addIcon()}
            onRef={(ref) => (this.Sider = ref)}
          />
        </BaseDiv>
        <BaseDiv className="rightShow">
          <div id="rightMealTitle">
            <div className="mealTitle">
              <span>
                <Input
                  value={packageName}
                  placeholder="请输入套餐名"
                  bordered={false}
                  className="inputMeal"
                  onChange={this.changeInput}
                />
              </span>
              {editShow ? (
                <>
                  <span
                    className={
                      clinicTag
                        ? "mealTitleSpan"
                        : "mealTitleSpan mealTitleSpanCheck"
                    }
                    onClick={() => this.switchType(0)}
                  >
                    门诊
                  </span>
                  |
                  <span
                    className={
                      clinicTag
                        ? "mealTitleSpan mealTitleSpanCheck"
                        : "mealTitleSpan "
                    }
                    onClick={() => this.switchType(1)}
                  >
                    周期
                  </span>
                </>
              ) : (
                <span className="mealTitleSpanCheck">
                  {clinicTag ? "周期" : "门诊"}
                </span>
              )}
            </div>
            <div>
              {editShow ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="icon_s cursorIcon"
                    style={{ marginRight: "35px" }}
                    onClick={() => {
                      this.editShow(false)
                    }}
                  >
                    <use xlinkHref="#iconcancel"></use>
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="icon_s cursorIcon"
                    onClick={() => {
                      this.addMeal(false)
                    }}
                  >
                    <use xlinkHref="#iconconfirm"></use>
                  </svg>
                </>
              ) : null}
            </div>
          </div>
          <BaseTable
            columns={columnsInspect}
            dataSource={dataSource}
            pagination={false}
          />
          <div className="bottomTable">
            {editShow ? null : (
              <svg
                aria-hidden="true"
                className="icon_m cursorIcon"
                onClick={() => {
                  this.editShow(true)
                }}
              >
                <use xlinkHref="#iconeditor"></use>
              </svg>
            )}
          </div>
        </BaseDiv>
      </div>
    )
  }
}
