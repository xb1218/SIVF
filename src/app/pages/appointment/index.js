import React, { Component } from "react"
import { observer } from "mobx-react"
import { observable } from "mobx"
import { PlusOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons"
import BaseBread from "@/app/components/base/baseBread"
import { DivBetween } from "@/app/components/base/baseDiv"
import { DashBtn } from "@/app/components/base/baseBtn"
import { BaseModal } from "@/app/components/base/baseModal"
import SortbyDay from "./sortbyDay"
import SortbyWeek from "./sortbyWeek"
import AddApointment from "./addApointment"
import Pending from "./pending"
import Store from "@/app/stores/appointment"
import moment from "moment"
import "./index.scss"

export default
@observer
class index extends Component {
  @observable currentTab = "reservation"
  @observable currentdate = new Date()

  constructor(props) {
    super(props)
    this.store = Store.fromJS()
  }
  componentDidMount() {
    this.initFuc()
  }

  initFuc = () => {
    const {
      getReservationCount,
      updateQueryMap,
      updateTbaleQueryMap,
      getReservationList,
    } = this.store
    updateQueryMap({ date: moment(this.currentdate).format("YYYY-MM-DD") })
    updateTbaleQueryMap({ date: moment(this.currentdate).format("YYYY-MM-DD") })
    getReservationList()
    getReservationCount()
  }

  //搜索方法
  getPatientList = () => {}
  setCurrentTab = (val) => {
    this.currentTab = val
  }
  showModal = () => {
    this.store.reservationModal = true
  }

  closeModal = () => {
    this.store.reservationModal = false
  }

  setYesterdayDate = () => {
    this.currentdate = moment(this.currentdate).subtract(1, "days")
    this.isYesterday = moment(this.currentdate).isBefore(
      moment(new Date()).format("YYYY-MM-DD"),
      "day"
    )
    this.initFuc()
  }

  setTomorrowDate = () => {
    this.currentdate = moment(this.currentdate).add(1, "days")
    this.isTomorrow = moment(this.currentdate).isAfter(
      moment(new Date()).format("YYYY-MM-DD"),
      "day"
    )
    this.initFuc()
  }

  render() {
    const { currentTab } = this
    const {
      overviewData = {},
      reservationModal,
      reservationData,
      reservationVOList,
    } = this.store

    return (
      <div className="contentWrap">
        <BaseBread first="预约" />
        <DivBetween pwidth="170px" btnheight="40px">
          <div>
            <div
              className={currentTab === "pending" ? "bgGreen" : "bgDefault"}
              onClick={() => this.setCurrentTab("pending")}
            >
              Pending
            </div>
            <div
              className={currentTab === "reservation" ? "bgGreen" : "bgDefault"}
              onClick={() => this.setCurrentTab("reservation")}
            >
              <LeftOutlined
                style={{ marginRight: 4 }}
                onClick={() => this.setYesterdayDate()}
              />
              {moment(this.currentdate).format("YYYY-MM-DD")}
              <RightOutlined
                onClick={() => this.setTomorrowDate()}
                style={{ marginLeft: 4 }}
              />
            </div>
            <div
              className={currentTab === "preview" ? "bgGreen" : "bgDefault"}
              onClick={() => this.setCurrentTab("preview")}
            >
              概览
            </div>
          </div>
          <div onClick={() => this.showModal()}>
            <DashBtn>
              <PlusOutlined /> 新增预约
            </DashBtn>
          </div>
        </DivBetween>

        {currentTab === "reservation" ? (
          <SortbyDay
            reservationCount={reservationData}
            reservationVOList={reservationVOList}
            store={this.store}
          />
        ) : currentTab === "preview" ? (
          <SortbyWeek store={this.store} overviewData={overviewData} />
        ) : (
          <Pending store={this.store} />
        )}
        <div>
          <BaseModal
            title="新建预约"
            width="1140px"
            onCancel={this.closeModal}
            visible={reservationModal}
            footer={null}
            destroyOnClose={true}
          >
            <AddApointment store={this.store} />
          </BaseModal>
        </div>
      </div>
    )
  }
}
