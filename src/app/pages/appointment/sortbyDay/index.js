import React, { Component } from "react"
import CardDiv from "@/app/components/normal/CardDiv"
import { observable } from "mobx"
import { DivContent, BaseDiv, FilterDiv } from "@/app/components/base/baseDiv"
import { TableNomargin } from "@/app/components/base/baseTable"
import Pagination from "@/app/components/normal/Pagination"
import "../index.scss"

const columns = [
  {
    title: "预约项目",
    dataIndex: "reservationProject",
    align: "center",
    render: (text, record) => <div>{text || "/"}</div>,
  },
  {
    title: "预约类型",
    dataIndex: "reservationType",
    align: "center",
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: "预约时间",
    dataIndex: "reservationDate",
    align: "center",
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: "就诊卡号",
    dataIndex: "medicalCard",
    align: "center",
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: "姓名",
    dataIndex: "patientName",
    align: "center",
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: "联系方式",
    dataIndex: "phone",
    align: "center",
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: "地点",
    dataIndex: "place",
    align: "center",
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: "分组",
    dataIndex: "reservationGroup",
    align: "center",
    render: (text, record) => <div>{text}</div>,
  },
  {
    title: "事项",
    dataIndex: "matter",
    align: "matter",
    render: (text, record) => <div>{text}</div>,
  },
]
export default class index extends Component {
  @observable currentTab = "卵泡监测"

  // 切换标题
  setCurrentTab = (val) => {
    const { getReservationList, updateTbaleQueryMap } = this.props.store
    this.currentTab = val
    updateTbaleQueryMap({ projectType: val })
    getReservationList()
  }

  onPaginChange = (selectedPageNumber) => {
    const { updateTbaleQueryMap, getReservationList } = this.props.store
    updateTbaleQueryMap({ pageNum: selectedPageNumber })
    getReservationList()
  }

  render() {
    const { currentTab } = this
    const {
      store: { tablequeryMaps },
      reservationCount,
      reservationVOList = {},
    } = this.props
    const reservationList = reservationVOList.list || []
    const totalCount = reservationVOList.total

    return (
      <div id="appointmentCount">
        <DivContent height="128px">
          <CardDiv reservationCount={reservationCount} />
        </DivContent>
        <BaseDiv width="100%" className="appointmentDiv">
          <FilterDiv fontnum={4}>
            <div
              className={
                currentTab === "卵泡监测" ? "btnChecked" : "btnDefault"
              }
              onClick={() => {
                this.setCurrentTab("卵泡监测")
              }}
            >
              卵泡监测
            </div>
            <div
              className={currentTab === "手术" ? "btnChecked" : "btnDefault"}
              onClick={() => {
                this.setCurrentTab("手术")
              }}
            >
              手术
            </div>
            <div
              className={
                currentTab === "专家门诊" ? "btnChecked" : "btnDefault"
              }
              onClick={() => {
                this.setCurrentTab("专家门诊")
              }}
            >
              专家门诊
            </div>
            <div
              className={currentTab === "妇科" ? "btnChecked" : "btnDefault"}
              onClick={() => {
                this.setCurrentTab("妇科")
              }}
            >
              妇科
            </div>
            <div
              className={currentTab === "男科" ? "btnChecked" : "btnDefault"}
              onClick={() => {
                this.setCurrentTab("男科")
              }}
            >
              男科
            </div>
          </FilterDiv>
          <div className="Project_table" style={{ marginTop: "20px" }}>
            <TableNomargin
              columns={columns}
              pagination={false}
              dataSource={reservationList}
            />
            <Pagination
              className="appointmenPagination"
              pageSize={parseInt(tablequeryMaps.pageSize, 10)}
              total={totalCount}
              current={parseInt(tablequeryMaps.pageNum, 10)}
              onChange={this.onPaginChange}
            />
          </div>
        </BaseDiv>
      </div>
    )
  }
}
