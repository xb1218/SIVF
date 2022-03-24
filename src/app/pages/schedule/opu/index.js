import React, { Component } from "react"
import Styled from "styled-components"
import moment from "moment"
import {
  Radio,
  Button,
  InputNumber,
  Select,
  Drawer,
  message,
  TimePicker,
} from "antd"
import { inject, observer } from "mobx-react"
import BaseBread from "@/app/components/base/baseBread"
import { TableSchedule } from "@/app/components/base/baseTable"
import { BaseDiv } from "@/app/components/base/baseSpan"
import PrintView from "@/app/components/normal/printView"
import GroupTable from "../groupTable"
import SearchDiv from "../Search"
import DetailOpu from "./detailOpu"
import api from "@/app/utils/apis"

const BaseDrawer = Styled(Drawer)`
.ant-drawer-body{
  padding:0;
}
`
export default
@inject("schedule", "moredetail")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: "opu", //是取卵表还是夜针表
      showGroup: false, //是否显示所有人
      data_collection: [], //普通表数据
      allData: [], //查询所有人的表格
      arry: null, // 点击的患者的详情数据
      showDetail: false, //是否出现患者的详情抽屉
      sortCondition: {
        eggDate: moment(new Date()).add(2, "days").format("YYYY-MM-DD"),
        hcgDate: moment(new Date()).format("YYYY-MM-DD"),
        type: "opu",
        groups: "A组",
        place: "河西分院",
      }, //筛选条件
      options: [
        { label: "取卵表", value: "opu" },
        { label: "夜针表", value: "hcg" },
      ],
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
    let { data_collection } = this.state
    this.setState({
      data_collection: [...data_collection],
    })
  }
  // 修改egg时间
  changeTime = (value, record, param) => {
    record[param] = value
    this.renderingData()
    this.getQlTime(record)
  }
  // 格式化时间
  timePadStart = (date) => {
    return date.toString().padStart(2, "0")
  }
  // 取卵时间计算
  getQlTime = (record) => {
    let qlTime =
      new Date(
        record.triggerDate + " " + record.triggerTime + ":00"
      ).getTime() +
      record.triggerHours * 60 * 60 * 1000
    let startDate = new Date(qlTime)
    var y = startDate.getFullYear()
    var m = startDate.getMonth() + 1
    var d = startDate.getDate()
    let qlHours =
      this.timePadStart(startDate.getHours()) +
      ":" +
      this.timePadStart(startDate.getMinutes())
    record.opuTime = qlHours
    record.opuDate = y + "-" + m + "-" + d
  }
  // 修改组别和扳机时长
  handleOnChange = (value, record, param) => {
    record[param] = value
    this.renderingData()
    this.getQlTime(record)
  }
  // 调用后台接口(普通列表)
  callBack = (list) => {
    let { selectData } = this.props.schedule
    api.Schedule.getOpuArry(list).then((res) => {
      if (res.code === 200 && res.data) {
        this.setState({
          data_collection: selectData(list, res.data),
          allData: res.data,
        })
      }
    })
  }
  // 获取hcg的数据,不按时间排序
  getArry = () => {
    let { sortCondition } = this.state
    this.callBack(sortCondition)
  }
  // 筛选
  searchOpu = (val, check) => {
    let { type } = this.state
    val.type = type
    this.setState({
      sortCondition: val,
      showGroup: check,
    })
    this.callBack(val)
  }
  // 取卵表还是夜针表
  changeType = (e) => {
    let { sortCondition } = this.state
    sortCondition.type = e.target.value
    this.setState({
      type: e.target.value,
    })
    this.callBack(sortCondition)
  }
  // 点击表格的行，出现该患者的详情
  onClickRow = (record) => {
    this.setState({
      arry: record,
      showDetail: true,
    })
  }
  // 保存修改的日程表
  saveData = () => {
    let { oneList } = this.props.schedule
    let {
      sortCondition,
      type,
      data_collection,
      showGroup,
      allData,
    } = this.state
    let data = {
      scheduleType: sortCondition.type,
      triggerDate: type === "hcg" ? sortCondition.hcgDate : null,
      eggDate: type === "opu" ? sortCondition.eggDate : null,
      modifyScheduleParams: showGroup ? oneList(allData) : data_collection,
    }
    api.Schedule.saveSchedule(data).then((res) => {
      message.success(res.data)
      this.callBack(sortCondition)
    })
  }
  render() {
    const {
      data_collection,
      showGroup,
      type,
      options,
      showDetail,
      arry,
      allData,
    } = this.state
    let { selectList, oneList } = this.props.schedule
    let { renderOptions } = this.props.moredetail
    //取卵日程表表头
    let columns_opu = [
      {
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
      },
      {
        title: "周期情况",
        width: 0,
        children: [
          {
            title: "病历号",
            dataIndex: "medicalRecordNum",
            key: "medicalRecordNum",
            width: 56,
          },
          {
            title: "女方",
            dataIndex: "femaleName",
            key: "femaleName",
            width: 56,
            render: (text, record) => {
              return (
                <span
                  className={record.femalePositiveSign ? "colorRed" : null}
                  onClick={() => this.onClickRow(record)}
                >
                  {text}
                  <br />
                  {record.femaleAge ? record.femaleAge + "岁" : ""}
                </span>
              )
            },
          },
          {
            title: "男方",
            dataIndex: "maleName",
            key: "maleName",
            width: 56,
            render: (text, record) => {
              return (
                <span
                  className={record.malePositiveSign ? "colorRed" : null}
                  onClick={() => this.onClickRow(record)}
                >
                  {text}
                  <br />
                  {record.maleAge ? record.maleAge + "岁" : ""}
                </span>
              )
            },
          },
          {
            title: "电话",
            dataIndex: "femalePhone",
            key: "femalePhone",
            width: 121,
            render: (text, record) => {
              return (
                <span>
                  {text ? "女:" + text : ""}
                  <br />
                  {record.malePhone ? "男:" + record.malePhone : ""}
                </span>
              )
            },
          },
          {
            title: "精子",
            dataIndex: "sperm",
            key: "sperm",
            width: 57,
          },
          {
            title: "授精",
            dataIndex: "inseminationMethod",
            key: "inseminationMethod",
            width: 51,
          },
        ],
      },
      {
        title: "取卵",
        width: 0,
        children: [
          {
            title: "组别",
            dataIndex: "group",
            key: "group",
            width: 61,
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
            title: "计划",
            dataIndex: "anesthetize",
            key: "anesthetize",
            width: 56,
          },
          {
            title: "HCG时间",
            dataIndex: "triggerTime",
            key: "triggerTime",
            width: 52,
            render: (text, record) => {
              return (
                <div>
                  {type === "hcg" ? (
                    <TimePicker
                      style={{ width: "85px" }}
                      defaultValue={moment(record.triggerTime, "HH:mm")}
                      value={
                        record.triggerTime
                          ? moment(record.triggerTime, "HH:mm")
                          : ""
                      }
                      format={"HH:mm"}
                      onChange={(time, timeString) => {
                        this.changeTime(timeString, record, "triggerTime")
                      }}
                    />
                  ) : (
                    <div>{text}</div>
                  )}
                </div>
              )
            },
          },
          {
            title: "扳机时长（h）",
            dataIndex: "triggerHours",
            key: "triggerHours",
            width: 61,
            render: (text, record) => {
              return (
                <div>
                  {type === "hcg" ? (
                    <InputNumber
                      style={{ width: "55px" }}
                      value={record.triggerHours ? record.triggerHours : ""}
                      onChange={(val) =>
                        this.handleOnChange(val, record, "triggerHours")
                      }
                    />
                  ) : (
                    <div>{text}</div>
                  )}
                </div>
              )
            },
          },
          {
            title: "取卵时间",
            dataIndex: "opuTime",
            key: "opuTime",
            width: 65,
            render: (text, record) => {
              return (
                <div>
                  {type === "opu" ? (
                    <TimePicker
                      style={{ width: "85px" }}
                      defaultValue={moment(record.opuTime, "HH:mm")}
                      value={
                        record.opuTime ? moment(record.opuTime, "HH:mm") : ""
                      }
                      format={"HH:mm"}
                      onChange={(time, timeString) => {
                        this.changeTime(timeString, record, "opuTime")
                      }}
                    />
                  ) : (
                    <div>{text}</div>
                  )}
                </div>
              )
            },
          },
        ],
      },
      {
        title: "HCG日",
        width: 0,
        children: [
          {
            title: "内膜",
            dataIndex: "innerMembrane",
            key: "innerMembrane",
            width: 44,
          },
          {
            title: "优势卵泡",
            dataIndex: "dominantFollicle",
            key: "dominantFollicle",
            width: 45,
          },
          {
            title: "≥16（mm）",
            dataIndex: "largeThanSixteen",
            key: "largeThanSixteen",
            width: 48,
          },
          {
            title: "≥14（mm）",
            dataIndex: "largeThanFourteen",
            key: "largeThanFourteen",
            width: 48,
          },
          {
            title: "≥12（mm）",
            dataIndex: "largeThanTwelve",
            key: "largeThanTwelve",
            width: 48,
          },
          {
            title: "E2",
            dataIndex: "e2",
            key: "e2",
            width: 36,
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
            width: 56,
            render: (text, record) => {
              return (
                <span>
                  {text}
                  {record.pHigh ? (
                    <svg className="icon_svg" aria-hidden="true">
                      <use
                        xlinkHref={
                          record.pHigh > 0 ? "#iconarrowup" : "#icondownarrow"
                        }
                      ></use>
                    </svg>
                  ) : null}
                </span>
              )
            },
          },
          {
            title: "LH",
            dataIndex: "lh",
            key: "lh",
            width: 37,
          },
        ],
      },
      {
        title: "备注",
        children: [
          {
            title: "",
            dataIndex: "specialNote",
            key: "specialNote",
            width: 68,
          },
        ],
      },
    ]
    return (
      <div className="contentWrap">
        <BaseBread first="取卵日程表" />
        <SearchDiv name="opu" search={this.searchOpu} type={type} />
        <BaseDiv className="scheduleDiv">
          <div className="leftTitles">
            <Radio.Group
              options={options}
              defaultValue="opu"
              buttonStyle="solid"
              optionType="button"
              value={type}
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
                data_collection.length > 0 || oneList(allData).length > 0
                  ? false
                  : true
              }
            >
              保存
            </Button>
          </div>
          <PrintView bottom="33px" padding="0">
            <div>
              {showGroup ? (
                <GroupTable columns={columns_opu} arry={allData} />
              ) : (
                <TableSchedule
                  columns={columns_opu}
                  dataSource={data_collection}
                  bordered
                  pagination={false}
                />
              )}
            </div>
          </PrintView>
          <div>
            {showDetail ? (
              <BaseDrawer
                placement="right"
                closable={false}
                onClose={() => this.setState({ showDetail: false })}
                visible={showDetail}
              >
                <DetailOpu arry={arry} />
              </BaseDrawer>
            ) : null}
          </div>
        </BaseDiv>
      </div>
    )
  }
}
