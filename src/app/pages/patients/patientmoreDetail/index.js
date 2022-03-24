import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Tabs, Empty, Popover } from "antd"
import styled from "styled-components"
import { ArrowLeftOutlined, DownOutlined } from "@ant-design/icons"
import Tree from "@/app/components/normal/Tree"
import BaseBread from "@/app/components/base/baseBread"
import { DivContent } from "@/app/components/base/baseDiv"
import { NavTabs } from "@/app/components/base/baseTabs"
import Operation from "@/app/components/normal/Operation" //手术
import PatientsCard from "@/app/components/normal/PatientsCard"
import IllnessRecord from "./illnessRecord" //病程记录
import ClinicRecord from "./clinicRecord" //就诊履历
import HistoryTaking from "./historytaking" //病史
import Monitor from "./monitor" //卵泡监测
import NaturalMointor from "./naturalMonitor" //自然周期卵泡监测
import Inspection from "./inspection" //检查检验
import FirsitVist from "./firsitVist" //初复诊
import Lab from "./lab" //实验室
import Calculation from "@/app/components/normal/Calculation"
import BigMedical from "./bigMedical" //大病历
import Agreement from "./agreement" //知情同意书
import "./index.scss"

const PositonDiv = styled.div`
  position: absolute;
  top: 20px;
  right: 10px;
  display: inlink-block;
  z-index: 2;
`
export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      surgery: "1",
      screenShow: "none", //是否显示手术
    }
  }
  componentWillUnmount() {
    let { store } = this.props
    store.sureGet = false
  }
  // 切换标签的回调行数
  changeKey = (key) => {
    this.props.store.activeKey = key
  }
  // 切换患者//诊室
  switchPatient = () => {
    let { treat_stage, activeKey } = this.props.store
    if (treat_stage === 0) {
      if (activeKey !== "fir") {
        activeKey = "fir"
      }
    } else if (treat_stage === 1) {
      if (activeKey !== "sec") {
        activeKey = "sec"
      }
    } else if (treat_stage === 6) {
      if (activeKey !== "natural") {
        activeKey = "natural"
      }
    } else {
      if (activeKey !== "mon") {
        this.props.store.activeKey = "mon"
      }
    }
    this.props.store.resumePeople = false
  }
  //手术记录鼠标移入
  onMouseOver = () => {
    this.setState({ screenShow: "block" })
  }
  //手术记录鼠标离开
  onMouseLeave = () => {
    this.setState({ screenShow: "none" })
  }
  // 就诊履历的切换
  changeClick = () => {
    let { store } = this.props
    this.props.store.activeKey = "mon"
    this.Monitor.initPage(store.select_resume)
  }
  render() {
    const { TabPane } = Tabs
    const { maleBaseData } = this.props.moredetail
    let { patientCard } = this.props.store
    let {
      sureGet,
      treat_stage,
      users,
      activeKey,
      select_one,
    } = this.props.store
    let { screenShow } = this.state
    return (
      <div className="contentWrap" style={{ paddingRight: 0 }}>
        <div className="breadContent">
          <BaseBread
            icon={
              <ArrowLeftOutlined
                onClick={() =>
                  this.props.history.push("/public/patients/workbench")
                }
              />
            }
            first="详情"
          />
        </div>
        <div className="detailContent">
          <Tree change={this.switchPatient} />
          {users && users.length > 0 ? (
            <div className="contained">
              <PatientsCard page="patient" />
              {sureGet ? (
                <div style={{ position: "relative" }}>
                  <PositonDiv>
                    <span className="hand FiveMargin">
                      <svg className="icon_b" aria-hidden="true">
                        <use xlinkHref="#iconSystemmessage"></use>
                      </svg>
                    </span>
                    <Popover
                      placement="bottomLeft"
                      content={<Calculation />}
                      trigger="click"
                    >
                      <span className="hand">
                        <svg className="icon_b" aria-hidden="true">
                          <use xlinkHref="#icontool1"></use>
                        </svg>
                      </span>
                    </Popover>
                  </PositonDiv>
                  <NavTabs
                    defaultActiveKey={activeKey}
                    activeKey={activeKey}
                    onChange={this.changeKey}
                  >
                    {treat_stage === 0 ? (
                      <TabPane tab="初诊病历" key="fir">
                        <FirsitVist
                          currentKey={activeKey}
                          patientId={select_one.patientPid}
                          visitRoom={localStorage.getItem("visitRoom")}
                        />
                      </TabPane>
                    ) : null}
                    {treat_stage !== 1 ? null : (
                      <TabPane tab="复诊病历" key="sec">
                        <FirsitVist
                          currentKey={activeKey}
                          patientId={select_one.patientPid}
                          visitRoom={localStorage.getItem("visitRoom")}
                        />
                      </TabPane>
                    )}
                    {treat_stage !== 6 ? null : (
                      <TabPane tab="自然周期卵泡监测" key="natural">
                        <NaturalMointor
                          currentKey={activeKey}
                          patientId={select_one.patientPid}
                          onRef={(ref) => (this.NaturalMointor = ref)}
                        />
                      </TabPane>
                    )}
                    {treat_stage === 2 ||
                    treat_stage === 3 ||
                    treat_stage === 4 ||
                    treat_stage === 5 ? (
                      <>
                        <TabPane tab="卵泡监测" key="mon">
                          <Monitor
                            currentKey={activeKey}
                            patientId={select_one.patientPid}
                            cycleNumber={select_one.cycleNumber}
                            onRef={(ref) => (this.Monitor = ref)}
                          />
                        </TabPane>
                        <TabPane tab="病程记录" key="record">
                          <IllnessRecord currentKey={activeKey} />
                        </TabPane>
                        <TabPane tab="大病历" key="big">
                          <BigMedical
                            history={this.props.history}
                            patientId={select_one.patientPid}
                            currentKey={activeKey}
                          />
                        </TabPane>
                        <TabPane
                          tab={
                            <div
                              onMouseOver={this.onMouseOver}
                              onMouseLeave={this.onMouseLeave}
                            >
                              <span style={{ marginLeft: 10 }}>手术记录</span>
                              <DownOutlined style={{ marginLeft: 10 }} />
                            </div>
                          }
                          key="sur"
                          style={{
                            position: "relative",
                            minHeight: 400,
                          }}
                        >
                          <Operation
                            style={{ display: screenShow }}
                            Over={this.onMouseOver}
                            Leave={this.onMouseLeave}
                            currentKey={activeKey}
                            patientId={select_one.patientPid}
                            arry={patientCard.femaleOperationNames}
                          />
                        </TabPane>
                        <TabPane tab="实验室" key="lab">
                          <Lab />
                        </TabPane>
                      </>
                    ) : null}
                    <TabPane tab="病史" key="dishis">
                      <HistoryTaking
                        maleBaseData={maleBaseData}
                        currentKey={activeKey}
                      />
                    </TabPane>
                    <TabPane tab="检查检验" key="checks">
                      <Inspection
                        currentKey={activeKey}
                        sex={null}
                        patientId={select_one.patientPid}
                      />
                    </TabPane>
                    <TabPane tab="就诊履历" key="cli">
                      <ClinicRecord
                        currentKey={activeKey}
                        changeClick={this.changeClick}
                      />
                    </TabPane>
                    <TabPane tab="同意书" key="agree">
                      <Agreement
                        history={this.props.history}
                        currentKey={activeKey}
                        changeClick={this.changeClick}
                      />
                    </TabPane>
                  </NavTabs>
                </div>
              ) : null}
            </div>
          ) : (
            <DivContent height="128px">
              <Empty
                image={
                  <svg aria-hidden="true">
                    <use xlinkHref="#iconDefaultgraphNopatients" />
                  </svg>
                }
                imageStyle={{
                  height: 60,
                  marginTop: 50,
                }}
                description={
                  <span style={{ color: "#d9d9d9", marginTop: 50 }}>
                    未搜索到相关患者,请新增
                  </span>
                }
              />
            </DivContent>
          )}
        </div>
      </div>
    )
  }
}
