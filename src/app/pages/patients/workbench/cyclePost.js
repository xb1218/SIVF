import React, { Component } from "react"
import { Radio, Select, Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { BaseTable } from "@/app/components/base/baseTable"
import { BaseDrawer } from "@/app/components/base/baseDrawer"
import FollowDetail from "@/app/pages/follow/details/Detail"
import Pagin from "@/app/components/normal/Pagination"
import { onePostSelect, twoPostSelect } from "./defaultData"
import { handlOrderNumber } from "@/app/utils/tool.js"
import apis from "@/app/utils/apis.js"

const RadioGroup = Radio.Group

const cycleData = ["验孕", "翻倍", "一超", "二超", "三超"]
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [], //表格数据
      postList: [], //阶段统计
      places: [], //地点集合
      typeName: null, //预约类型
      stages: null, //阶段
      place: null, //地点
      nameNumber: null, //姓名或病历号
      pageNum: 1, //当前页数
      pageSize: 10, //每页数量
      totalCount: 0, //总数
      followVisible: false,
    }
  }
  componentDidMount() {
    let { curType } = this.props
    this.setState({
      stages: curType === "周期一岗" ? "验孕" : "IUI经期",
    })
    this.getPlaces()
    this.getPeople()
  }
  UNSAFE_componentWillReceiveProps(nextprops) {
    if (nextprops.curType !== this.props.curType) {
      this.getSourceList(nextprops.curType)
      return true
    }
    return false
  }
  //分页切换
  onPaginChange = (selectedPageNumber) => {
    let { place, nameNumber, stages, curType } = this.state
    this.setState({
      pageNum: selectedPageNumber,
    })
    this.getSourceList(
      curType,
      place,
      stages,
      nameNumber,
      parseInt(selectedPageNumber, 10)
    )
  }
  // 获取周期一岗二岗人数
  getPeople = () => {
    apis.WorkBench.initPeopele().then((res) => {
      if (res.code === 200) {
        this.setState({
          postList: res.data,
        })
      }
    })
  }
  // 查询周期一岗二岗的数据
  getSourceList = (c, p, s, n, num) => {
    let { curType } = this.props
    let { place, nameNumber, pageNum, pageSize, stages } = this.state
    let data = {
      typeName: c ? c : curType,
      stages: s ? s : stages,
      place: p ? p : place,
      nameNumber: n ? n : nameNumber,
      pageNum: num ? num : pageNum,
      pageSize,
    }
    apis.WorkBench.getPeopleList(data).then((res) => {
      if (res.code === 200) {
        handlOrderNumber(res.data, "list", "number")
        this.setState({
          dataSource: res.data.list,
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize,
          totalCount: res.data.total,
        })
      }
    })
  }
  // 获取所有地点集合
  getPlaces = () => {
    let { curType } = this.props
    apis.WorkBench.getPlaces().then((res) => {
      if (res.code === 200) {
        this.setState({
          places: res.data,
          place: res.data[0],
        })
        this.getSourceList(curType, res.data[0])
      }
    })
  }
  // 修改值
  changeVal = (val, parm) => {
    this.setState({
      [parm]: val,
    })
  }
  // 打开就诊履历
  getRowrecord = (record, index) => {
    if (cycleData.includes(this.state.stages)) {
      localStorage.setItem("followrecord", JSON.stringify(record.followUpVO))
      this.setState({
        followVisible: true,
      })
    }
  }
  render() {
    let columns = [
      {
        title: "序号",
        key: "number",
        dataIndex: "number",
      },
      {
        title: "姓名",
        key: "patientName",
        dataIndex: "patientName",
      },
      {
        title: "就诊卡号",
        key: "medicalCard",
        dataIndex: "medicalCard",
      },
      {
        title: "身份证号",
        key: "idNumber",
        dataIndex: "idNumber",
        width: 200,
      },
      {
        title: "状态",
        dataIndex: "hasTreated",
        key: "hasTreated",
        render: (text) => (
          <span style={{ color: text === 0 ? "#7AC3F6" : "#FFA25C" }}>
            {text === 0 ? "待就诊" : "已就诊"}
          </span>
        ),
      },
      {
        title: "类型",
        key: "stage",
        dataIndex: "stage",
      },
    ]
    let { curType } = this.props
    let {
      places,
      place,
      postList,
      stages,
      nameNumber,
      pageNum,
      pageSize,
      dataSource,
      totalCount,
      followVisible,
    } = this.state
    return (
      <div id="cyclePost">
        <div className="postTitle">
          {/* 地点 */}
          <RadioGroup
            className="titleLeft"
            options={places}
            value={place}
            onChange={(e) => {
              this.changeVal(e.target.value, "place")
              this.getSourceList(curType, e.target.value, stages, nameNumber)
            }}
          />
          <div className="titleRight">
            <div>
              {postList.map((item, index) => {
                return (
                  <div key={index}>
                    {item.position === curType ? (
                      <>
                        {item.stageCountVOList.map((items, indexs) => {
                          return (
                            <span className="paddingSpan" key={indexs}>
                              {items.stage}
                              {items.counts}
                            </span>
                          )
                        })}
                      </>
                    ) : null}
                  </div>
                )
              })}
            </div>
            <div className="titleSelect">
              <Select
                options={curType === "周期一岗" ? onePostSelect : twoPostSelect}
                value={stages}
                style={{ marginRight: 15, width: "200px" }}
                onChange={(val) => {
                  this.changeVal(val, "stages")
                  this.getSourceList(curType, place, val, nameNumber)
                }}
              />
              <Input
                width="250"
                placeholder="请输入姓名/病历号检索"
                value={nameNumber}
                suffix={<SearchOutlined onClick={() => this.getSourceList()} />}
                onChange={(e) => {
                  this.changeVal(e.target.value, "nameNumber")
                }}
                onPressEnter={() => this.getSourceList()}
              />
            </div>
          </div>
        </div>
        <BaseTable
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: `calc(100vh - 200px)` }}
          rowKey={(record) => record.pid}
          style={{
            padding: "0 10px",
            height: `calc(100vh - 270px)`,
          }}
          onRow={(record, index) => {
            return {
              onClick: (event) => this.getRowrecord(record, index),
            }
          }}
        />
        <div style={{ padding: "10px 20px 10px 0" }}>
          <Pagin
            pageSize={parseInt(pageSize, 10)}
            current={parseInt(pageNum, 10)}
            total={totalCount}
            onChange={this.onPaginChange}
          />
        </div>
        {followVisible ? (
          <BaseDrawer
            visible={followVisible}
            onclose={() => {
              this.setState({
                followVisible: false,
              })
            }}
            width={1200}
            bodyStyle={{ padding: "10px 8px 0 0" }}
            closable={false}
            placement="right"
          >
            <FollowDetail page="workbench" />
          </BaseDrawer>
        ) : null}
      </div>
    )
  }
}
