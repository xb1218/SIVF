import React, { Component } from "react"
import { Button, Select, message } from "antd"
import { inject, observer } from "mobx-react"
import BaseBread from "@/app/components/base/baseBread"
import { TableSchedule } from "@/app/components/base/baseTable"
import { BaseDiv } from "@/app/components/base/baseSpan"
import PrintView from "@/app/components/normal/printView"
import SearchDiv from "../Search"
import GroupTable from "../groupTable"
import moment from "moment"
import api from "@/app/utils/apis"
import "../index.scss"
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
    let { selectList } = this.props.schedule
    let { renderOptions } = this.props.moredetail
    this.state = {
      showGroup: false, //是否显示分组
      cycleType: "ivf", //周期类型
      data_et: [],
      allData: [],
      sortCondition: {
        plantDate: moment(new Date()).format("YYYY-MM-DD"),
        cycleType: "ivf",
        place: "河西分院",
        groups: "A组",
      }, //筛选的条件
      columns_et: [
        {
          title: "",
          width: 0,
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
          width: 0,
          title: "基本信息",
          children: [
            {
              title: "病历号",
              dataIndex: "medicalRecordNum",
              key: "medicalRecordNum",
              width: 90,
            },
            {
              title: "女方",
              dataIndex: "femaleName",
              key: "femaleName",
              width: 60,
              render: (text, record) => {
                return (
                  <span
                    className={record.femalePositiveSign ? "colorRed" : null}
                  >
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
              width: 69,
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
              width: 134,
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
          width: 0,
          title: "周期信息",
          children: [
            {
              title: "组别",
              dataIndex: "group",
              key: "group",
              width: 73,
              render: (text, record) => {
                return (
                  <Select
                    value={record.group}
                    onChange={(val) =>
                      this.handleOnChange(val, record, "group")
                    }
                  >
                    {renderOptions(selectList, "222")}
                  </Select>
                )
              },
            },
            {
              title: "授精",
              dataIndex: "inseminationMethod",
              key: "inseminationMethod",
              width: 88,
            },
            {
              title: "拟移植胚胎(枚)",
              dataIndex: "transferredEmbryos",
              key: "transferredEmbryos",
              width: 76,
            },
            {
              title: "解冻后剩余冻胚(枚)",
              dataIndex: "afterThawingEmbryos",
              key: "afterThawingEmbryos",
              width: 94,
            },
          ],
        },
        {
          width: 0,
          title: "HCG日",
          children: [
            {
              title: "E2",
              dataIndex: "e2",
              key: "e2",
              width: 50,
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
              dataIndex: "p	",
              key: "p	",
              width: 58,
            },
            {
              title: "内膜(mm)分型",
              dataIndex: "innerMembrane",
              key: "innerMembrane",
              width: 86,
            },
            {
              title: "特殊提示",
              dataIndex: "specialNote",
              key: "specialNote",
              width: 93,
            },
          ],
        },
      ],
    }
  }
  // 初始化
  componentDidMount() {
    this.getArry()
  }
  // 渲染列表
  getColumns = () => {
    let { renderOptions } = this.props.moredetail
    let { selectList } = this.props.schedule
    this.setState({
      columns_et: [
        {
          title: "",
          width: 0,
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
          width: 0,
          title: "基本信息",
          children: [
            {
              title: "病历号",
              dataIndex: "medicalRecordNum",
              key: "medicalRecordNum",
              width: 90,
            },
            {
              title: "女方",
              dataIndex: "femaleName",
              key: "femaleName",
              width: 60,
              render: (text, record) => {
                return (
                  <span
                    className={record.femalePositiveSign ? "colorRed" : null}
                  >
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
              width: 69,
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
              width: 134,
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
          width: 0,
          title: "周期信息",
          children: [
            {
              title: "组别",
              dataIndex: "group",
              key: "group",
              width: 73,
              render: (text, record) => {
                return (
                  <Select
                    value={record.group}
                    onChange={(val) =>
                      this.handleOnChange(val, record, "group")
                    }
                  >
                    {renderOptions(selectList, "222")}
                  </Select>
                )
              },
            },
            {
              title: "授精",
              dataIndex: "inseminationMethod",
              key: "inseminationMethod",
              width: 88,
            },
            {
              title: "拟移植胚胎(枚)",
              dataIndex: "transferredEmbryos",
              key: "transferredEmbryos",
              width: 76,
            },
            {
              title: "解冻后剩余冻胚(枚)",
              dataIndex: "afterThawingEmbryos",
              key: "afterThawingEmbryos",
              width: 94,
            },
          ],
        },
        {
          width: 0,
          title: "HCG日",
          children: [
            {
              title: "E2",
              dataIndex: "e2",
              key: "e2",
              width: 50,
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
              width: 58,
            },
            {
              title: "内膜(mm)分型",
              dataIndex: "innerMembrane",
              key: "innerMembrane",
              width: 86,
            },
            {
              title: "特殊提示",
              dataIndex: "specialNote",
              key: "specialNote",
              width: 93,
            },
          ],
        },
      ],
    })
  }
  // 渲染数据
  renderingData = () => {
    let { data_et } = this.state
    this.setState({
      data_et: [...data_et],
    })
  }
  // 调用后台接口
  callBack = (list) => {
    let { selectData, getSelectOption } = this.props.schedule
    api.Schedule.getEtArry(list).then((res) => {
      if (res.code === 200 && res.data) {
        this.setState({
          data_et: selectData(list, res.data),
          cycleType: list.cycleType,
          allData: res.data,
        })
        getSelectOption()
        this.getColumns()
        this.handleHeader(list.cycleType)
      }
    })
  }
  // 去掉表头多余的部分
  deleteHander = (item, data) => {
    data.forEach((itemc, indexc) => {
      if (itemc.title === "精子") {
        item.children.splice(indexc, 1)
      }
      if (itemc.title === "新鲜周期数") {
        item.children.splice(indexc, 1)
      }
      if (itemc.title === "解冻周期数") {
        item.children.splice(indexc, 1)
      }
    })
  }
  // 处理表头
  handleHeader = (cycleType) => {
    let { columns_et } = this.state
    columns_et.forEach((item, index) => {
      if (item.title === "周期信息") {
        if (cycleType === "ivf") {
          this.deleteHander(item, item.children)
          item.children.splice(1, 0, {
            title: "精子",
            dataIndex: "spermSource",
            key: "spermSource",
            width: 73,
          })
        } else {
          this.deleteHander(item, item.children)
          item.children.splice(
            2,
            0,
            {
              title: "新鲜周期数",
              dataIndex: "freshCycleNum",
              key: "freshCycleNum",
              className: cycleType === "fet" ? null : "notshow",
              width: 68,
            },
            {
              title: "解冻周期数",
              dataIndex: "thawingCycleNum",
              key: "thawingCycleNum",
              className: cycleType === "fet" ? null : "notshow",
              width: 69,
            }
          )
        }
      }
    })
    this.setState({
      columns_et: columns_et,
    })
  }
  // 获取hcg的数据,不按时间排序
  getArry = () => {
    let list = {
      plantDate: moment(new Date()).format("YYYY-MM-DD"),
      cycleType: "ivf",
      place: "河西分院",
      groups: "A组",
    }
    this.callBack(list)
  }
  // 搜索
  searchEt = (val, check) => {
    this.callBack(val)
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
    let { data_et, showGroup, allData, sortCondition } = this.state
    let data = {
      scheduleType: "et",
      modifyScheduleParams: showGroup ? oneList(allData) : handleOrder(data_et),
    }
    api.Schedule.saveSchedule(data).then((res) => {
      message.success(res.data)
      this.callBack(sortCondition)
    })
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { data_et } = this.state
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(data_et, oldIndex, newIndex).filter(
        (el) => !!el
      )
      this.setState({ data_et: newData })
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
    const { data_et } = this.state
    const index = data_et.findIndex(
      (x) => x.index === restProps["data-row-key"]
    )
    return <SortableItem index={index} {...restProps} />
  }
  render() {
    let { oneList } = this.props.schedule
    let { data_et, showGroup, allData, columns_et } = this.state
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
    let columns = columns_et.slice(1)
    columns.unshift(dataNumber)
    return (
      <div className="contentWrap">
        <BaseBread first="移植日程表" />
        <SearchDiv name="et" search={this.searchEt} />
        <BaseDiv className="scheduleDiv">
          <div className="leftTitles">
            <div className="flag"></div>患者列表
          </div>
          <div className="rightprint">
            <Button
              onClick={this.saveData}
              style={{ right: "5em", top: "1px" }}
              size="small"
              type="primary"
              disabled={
                data_et.length > 0 || oneList(allData).length > 0 ? false : true
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
                    columns={columns_et}
                    dataSource={data_et}
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
