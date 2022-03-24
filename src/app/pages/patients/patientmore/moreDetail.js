import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Tabs } from "antd"
import { StyledTabs } from "@/app/components/base/baseTabs"
import PatientsCard from "@/app/components/normal/PatientsCard"
import ClinicRecord from "../patientmoreDetail/clinicRecord" //就诊履历
import HistoryTaking from "../patientmoreDetail/historytaking" //病史
import Inspection from "../patientmoreDetail/inspection"
import "./index.scss"

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  UNSAFE_componentWillReceiveProps(nextprops) {
    let { selectPatient } = this.props
    this.initPage(selectPatient)
  }
  initPage = (data) => {
    this.PatientsCard && this.PatientsCard.judgeGetBaseInfo()
    this.ClinicRecord && this.ClinicRecord.init(data)
    this.HistoryTaking && this.HistoryTaking.initPage(data)
  }
  render() {
    const { TabPane } = Tabs
    const { maleBaseData } = this.props.moredetail
    return (
      <div>
        <PatientsCard
          page="patient"
          type="更多患者"
          name="moreDetail"
          onRef={(ref) => (this.PatientsCard = ref)}
        />
        <StyledTabs defaultActiveKey="cli">
          <TabPane tab="就诊履历" key="cli">
            <ClinicRecord onRef={(ref) => (this.ClinicRecord = ref)} />
          </TabPane>
          <TabPane tab="检查检验" key="checks">
            <Inspection onRef={(ref) => (this.Inspection = ref)} />
          </TabPane>
          <TabPane tab="病史" key="dishis">
            <HistoryTaking
              maleBaseData={maleBaseData}
              onRef={(ref) => (this.HistoryTaking = ref)}
            />
          </TabPane>
        </StyledTabs>
      </div>
    )
  }
}
