import React, { Component } from "react"
import { Button, Select, message, Radio } from "antd"
import { inject, observer } from "mobx-react"
import BaseBread from "@/app/components/base/baseBread"
import { TableSchedule } from "@/app/components/base/baseTable"
import { BaseDiv } from "@/app/components/base/baseSpan"
import PrintView from "@/app/components/normal/printView"
import GroupTable from "../groupTable"
import SearchDiv from "../Search"
import moment from "moment"
import api from "@/app/utils/apis"
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc"
import { MenuOutlined } from "@ant-design/icons"
import { arrayMoveImmutable } from "array-move"

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
))
const SortableItem = sortableElement((props) => <tr {...props} />)
const SortableContainer = sortableContainer((props) => <tbody {...props} />)
export default
@inject("schedule", "moredetail")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showGroup: false, //是否显示分组
      data_iui: [],
      allData: [],
      sortCondition: {
        iuiPlantDate: moment(new Date()).format("YYYY-MM-DD"),
        groups: "A组",
        place: "河西分院",
      }, //筛选的条件
      options: [
        { label: "手术表", value: "operation" },
        { label: "扳机表", value: "trigger" },
      ],
      iuiType: "operation", //选择的是那种表的查询
    }
  }
  // 初始化
  componentDidMount() {
    let { getSelectOption } = this.props.schedule
    this.getArry()
    getSelectOption()
  }
  // 渲染数据
  renderingData = () => {
    let { data_iui } = this.state
    this.setState({
      data_iui: [...data_iui],
    })
  }
  // 调用后台接口(普通数据，IUI手术日程表)
  callBack = (list) => {
    let { selectData } = this.props.schedule
    api.Schedule.getIuiArry(list).then((res) => {
      if (res.code === 200 && res.data) {
        this.setState({
          data_iui: selectData(list, res.data),
          allData: res.data,
        })
      }
    })
  }
  // 调用后台接口，IUI日程表
  getTriggerData = (list) => {
    let { selectData } = this.props.schedule
    api.Schedule.getIUItrigger(list).then((res) => {
      if (res.code === 200 && res.data) {
        this.setState({
          data_iui: selectData(list, res.data),
          allData: res.data,
        })
      }
    })
  }
  // 获取hcg的数据,不按时间排序
  getArry = () => {
    let list = {
      iuiPlantDate: moment(new Date()).format("YYYY-MM-DD"),
      groups: "A组",
      place: "河西分院",
    }
    this.callBack(list)
  }
  // 搜索
  searchIui = (val, check) => {
    let { iuiType } = this.state
    if (iuiType === "operation") {
      this.callBack(val)
    } else {
      this.getTriggerData(val)
    }
    this.setState({
      showGroup: check,
      sortCondition: val,
    })
  }
  // 修改组别
  handleOnChange = (value, record, param) => {
    record[param] = value
    this.renderingData()
  }
  // 保存修改的日程表
  saveData = () => {
    let { oneList, handleOrder } = this.props.schedule
    let { data_iui, showGroup, allData, sortCondition } = this.state
    let data = {
      scheduleType: "iui",
      modifyScheduleParams: showGroup
        ? oneList(allData)
        : handleOrder(data_iui),
    }
    api.Schedule.saveSchedule(data).then((res) => {
      message.success(res.data)
      this.callBack(sortCondition)
    })
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { data_iui } = this.state
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(data_iui, oldIndex, newIndex).filter(
        (el) => !!el
      )
      this.setState({ data_iui: newData })
    }
  }

  DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  )

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { data_iui } = this.state
    const index = data_iui.findIndex(
      (x) => x.index === restProps["data-row-key"]
    )
    return <SortableItem index={index} {...restProps} />
  }
  // 切换日程表
  changeType = (e) => {
    let { sortCondition } = this.state
    this.setState({
      iuiType: e.target.value,
    })
    if (e.target.value === "operation") {
      this.callBack(sortCondition)
    } else {
      this.getTriggerData(sortCondition)
    }
  }
  render() {
    let { data_iui, showGroup, allData, options, iuiType } = this.state
    let { selectList, oneList } = this.props.schedule
    let { renderOptions } = this.props.moredetail
    const dataNumber = {
      title: "",
      width: 0,
      children: [
        {
          title: "序号",
          width: 42,
          dataIndex: "number",
          key: "number",
        },
      ],
    }
    let columns_iui = [
      {
        title: "",
        children: [
          {
            title: "排序",
            dataIndex: "sort",
            width: 44,
            className: "drag-visible",
            render: () => <DragHandle />,
          },
        ],
      },
      {
        title: "基本信息",
        children: [
          {
            title: "病历号",
            dataIndex: "medicalRecordNum",
            key: "medicalRecordNum",
            width: 150,
          },
          {
            title: "女方",
            dataIndex: "femaleName",
            key: "femaleName",
            width: 100,
            render: (text, record) => {
              return (
                <span className={record.femalePositiveSign ? "colorRed" : null}>
                  {text}
                  <br />
                  {record.femaleAge}岁
                </span>
              )
            },
          },
          {
            title: "男方",
            dataIndex: "maleName",
            key: "maleName",
            width: 150,
            render: (text, record) => {
              return (
                <span className={record.malePositiveSign ? "colorRed" : null}>
                  {text}
                  <br />
                  {record.maleAge}岁
                </span>
              )
            },
          },
          {
            title: "电话",
            dataIndex: "femalePhone",
            key: "femalePhone",
            width: 230,
            render: (text, record) => {
              return (
                <span>
                  女:{text}
                  <br />
                  男:{record.malePhone}
                </span>
              )
            },
          },
        ],
      },
      {
        title: "周期信息",
        children: [
          {
            title: "组别",
            dataIndex: "group",
            key: "group",
            width: 80,
            render: (text, record) => {
              return (
                <Select
                  value={record.group}
                  onChange={(val) => this.handleOnChange(val, record, "group")}
                >
                  {renderOptions(selectList, "222")}
                </Select>
              )
            },
          },
          {
            title: "治疗",
            dataIndex: "treatment",
            key: "treatment",
            width: 100,
          },
          {
            title: "精子",
            dataIndex: "sperm",
            key: "sperm",
            width: 100,
          },
          {
            title: "周期序号",
            dataIndex: "cycleOrder",
            key: "cycleOrder",
            width: 120,
          },
          {
            title: "用药方案",
            dataIndex: "medicationPlan",
            key: "medicationPlan",
            width: 150,
          },
        ],
      },
      {
        title: "HCG日",
        children: [
          {
            title: "E2",
            dataIndex: "e2",
            key: "e2",
            width: 80,
            render: (text, record) => {
              if (record.e2 !== null) {
                if (record.e2 > 10000) {
                  return <span style={{ color: "red" }}>{record.e2} A级</span>
                } else if (record.e2 < 5000) {
                  return <span style={{ color: "red" }}>{record.e2} C级</span>
                } else {
                  return <span style={{ color: "red" }}>{record.e2} B级</span>
                }
              }
            },
          },
          {
            title: "P",
            dataIndex: "p",
            key: "p",
            width: 80,
          },
          {
            title: "特殊提示",
            dataIndex: "specialNote",
            key: "specialNote",
            width: 200,
          },
        ],
      },
    ]
    let columns = columns_iui.slice(1)
    columns.unshift(dataNumber)
    return (
      <div className="contentWrap">
        <BaseBread first="IUI日程表" />
        <SearchDiv name="iui" search={this.searchIui} type={iuiType} />
        <BaseDiv className="scheduleDiv">
          <div className="leftTitles">
            <Radio.Group
              options={options}
              defaultValue="trigger"
              buttonStyle="solid"
              optionType="button"
              value={iuiType}
              onChange={this.changeType}
              size="small"
            />
          </div>
          <div className="rightprint">
            <Button
              onClick={this.saveData}
              style={{ right: "5em", top: "1px" }}
              size="small"
              type="primary"
              disabled={
                data_iui.length > 0 || oneList(allData).length > 0
                  ? false
                  : true
              }
            >
              保存
            </Button>
          </div>
          <PrintView bottom="32px" padding="0">
            <div>
              {showGroup ? (
                <GroupTable arry={allData} columns={columns} />
              ) : (
                <div>
                  <TableSchedule
                    columns={columns_iui}
                    dataSource={data_iui}
                    bordered
                    size="middle"
                    pagination={false}
                    rowKey="index"
                    components={{
                      body: {
                        wrapper: this.DraggableContainer,
                        row: this.DraggableBodyRow,
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </PrintView>
        </BaseDiv>
      </div>
    )
  }
}
