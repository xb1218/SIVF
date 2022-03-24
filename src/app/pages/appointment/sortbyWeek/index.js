import React, { Component } from "react"
import { observable } from "mobx"
import { observer } from "mobx-react"
import { DivBetween, BaseDiv, FilterDiv } from "@/app/components/base/baseDiv"
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons"
import { BaseTable } from "@/app/components/base/baseTable"
import { DateTitleView } from "@/app/components/normal/Title"
import Pagination from "@/app/components/normal/Pagination"
import "./index.scss"

const columns = [
  {
    title: "预约项目",
    dataIndex: "reservationProject",
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
    title: "预约类型",
    dataIndex: "reservationType",
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

const weeks = new Map([
  [0, "周日"],
  [1, "周一"],
  [2, "周二"],
  [3, "周三"],
  [4, "周四"],
  [5, "周五"],
  [6, "周六"],
])

export default
@observer
class index extends Component {
  @observable currentTab = "卵泡监测"
  @observable cycle = "week"
  @observable weekNum = 0
  @observable monthNum = 0

  componentDidMount() {
    const { updateOverviewQueryMap, getReservationOverview } = this.props.store
    updateOverviewQueryMap({ name: this.currentTab, num: this.weekNum })
    getReservationOverview(this.cycle)
  }

  setCycle = (val) => {
    const { getReservationOverview } = this.props.store
    getReservationOverview(val)
    this.cycle = val
    if (val === "week") {
      this.monthNum = 0
    } else {
      this.weekNum = 0
    }
  }
  /**
   * @func 切换标题
   */

  setCurrentTab = (val) => {
    const { updateOverviewQueryMap, getReservationOverview } = this.props.store
    this.currentTab = val
    updateOverviewQueryMap({ name: val })
    getReservationOverview(this.cycle)
  }

  /**
   * @func 上周/上月点击
   * @params 看不到未来的一周数据
   */
  scrollLeft = () => {
    const { updateOverviewQueryMap, getReservationOverview } = this.props.store
    if (this.cycle === "week") {
      this.weekNum = this.weekNum - 1
      updateOverviewQueryMap({ num: this.weekNum })
    } else {
      this.monthNum = this.monthNum - 1
      updateOverviewQueryMap({ num: this.monthNum })
    }
    getReservationOverview(this.cycle)
  }
  /**
   * @func 下周/下月点击
   */
  scrollRight = () => {
    const { updateOverviewQueryMap, getReservationOverview } = this.props.store
    if (this.cycle === "week") {
      this.weekNum = this.weekNum + 1
      updateOverviewQueryMap({ num: this.weekNum })
    } else {
      this.monthNum = this.monthNum + 1
      updateOverviewQueryMap({ num: this.monthNum })
    }
    getReservationOverview(this.cycle)
  }

  onPaginChange = (selectedPageNumber) => {
    const { updateOverviewQueryMap, getReservationOverview } = this.props.store
    updateOverviewQueryMap({ pageNum: selectedPageNumber })
    getReservationOverview(this.cycle)
  }

  render() {
    const {
      store: { overviewQueryMaps },
      overviewData = {},
    } = this.props
    const totalCount = overviewData.count && overviewData.count
    const overviewList =
      overviewData.pageInfo && (overviewData.pageInfo.list || [])
    const recordVO = overviewData.recordVO && (overviewData.recordVO || [])
    return (
      <BaseDiv height="100%" width="100%">
        <DivBetween btnheight="26px">
          <FilterDiv fontnum={4}>
            <div
              className={
                this.currentTab === "卵泡监测" ? "btnChecked" : "btnDefault"
              }
              onClick={() => {
                this.setCurrentTab("卵泡监测")
              }}
            >
              卵泡监测
            </div>
            <div
              className={
                this.currentTab === "手术" ? "btnChecked" : "btnDefault"
              }
              onClick={() => {
                this.setCurrentTab("手术")
              }}
            >
              手术
            </div>
            <div
              className={
                this.currentTab === "专家门诊" ? "btnChecked" : "btnDefault"
              }
              onClick={() => {
                this.setCurrentTab("专家门诊")
              }}
            >
              专家门诊
            </div>

            <div
              className={
                this.currentTab === "妇科" ? "btnChecked" : "btnDefault"
              }
              onClick={() => {
                this.setCurrentTab("妇科")
              }}
            >
              妇科
            </div>
            <div
              className={
                this.currentTab === "男科" ? "btnChecked" : "btnDefault"
              }
              onClick={() => {
                this.setCurrentTab("男科")
              }}
            >
              男科
            </div>
          </FilterDiv>
          <div className="checkview">
            <span>共：{totalCount} 例</span>
            <span
              className={this.cycle === "week" ? "bgGreen" : null}
              onClick={() => this.setCycle("week")}
            >
              周视图
            </span>
            <span
              className={this.cycle === "month" ? "bgGreen" : null}
              onClick={() => this.setCycle("month")}
            >
              月视图
            </span>
          </div>
        </DivBetween>
        <div className="peoplsContent">
          <div
            className={
              this.weekNum === -1 || this.monthNum === -1
                ? "sideschild disable"
                : "sideschild"
            }
            onClick={this.scrollLeft}
          >
            <div>
              <DoubleLeftOutlined />
            </div>
            <div>上</div>
            <div>{this.cycle === "week" ? "周" : "月"}</div>
          </div>
          <div className="middlechild">
            {recordVO &&
              recordVO.map((item, index) => {
                return (
                  <div key={index}>
                    <div>
                      {this.cycle === "week" ? <>{weeks.get(index)}</> : null}
                      {item.date}
                    </div>
                    <div>{item.record}人</div>
                  </div>
                )
              })}
          </div>
          <div
            className={
              this.weekNum === 1 || this.monthNum === 1
                ? "sideschild disable"
                : "sideschild"
            }
            onClick={this.scrollRight}
          >
            <div>
              <DoubleRightOutlined />
            </div>
            <div>下</div>
            <div>{this.cycle === "week" ? "周" : "月"}</div>
          </div>
        </div>
        <DateTitleView title={"患者列表"}>
          <BaseTable
            columns={columns}
            dataSource={overviewList}
            pagination={false}
          />
          <Pagination
            pageSize={parseInt(overviewQueryMaps.pageSize, 10)}
            total={totalCount}
            current={parseInt(overviewQueryMaps.pageNum, 10)}
            onChange={this.onPaginChange}
          />
        </DateTitleView>
      </BaseDiv>
    )
  }
}
