import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Collapse, Button, message, Input } from "antd"
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons"
import PanelTag from "@/app/components/normal/PanelTag"
import { BaseCollapse } from "@/app/components/base/baseCollapse"
import { ContentRadius } from "@/app/components/base/baseDiv"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { monitor_curDate } from "@/app/utils/const.js"
import MonitorRecord from "./monitorRecord" //自然周期基本信息
import RecordView from "./recordView" //就诊视图
import Ovum from "@/app/pages/patients/patientmoreDetail/monitor/ovum" //b超
import Blood from "@/app/pages/patients/patientmoreDetail/monitor/foBlood" //血激素水平
import Medication from "@/app/components/normal/MedicalAdvice" //医嘱
import Dias from "@/app/pages/patients/patientmoreDetail/diagnosis/diagn"
import apis from "@/app/utils/apis"
import "./index.scss"

const { Panel } = Collapse
const { TextArea } = Input
export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super()
    this.state = {
      date: null,
      lMPDate: null, //lmp日期
      selectOption: [],
      dataUid: null, //本周期的uid
      treatmentHistory: null, //治疗经过
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.getOption()
    this.getTreatMent()
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentKey !== this.props.currentKey ||
      nextProps.patientId !== this.props.patientId
    ) {
      let { store } = this.props
      if (!Object.values(store.select_resume).includes(null)) {
        this.initPage(store.select_resume)
      } else {
        this.initPage()
      }
    }
  }
  // 整个页面的初始化
  initPage = (data) => {
    let { store } = this.props
    if (this.MointorRecord) {
      this.MointorRecord.getCycle(data ? data : null)
    }
    if (this.RecordView) {
      this.RecordView.getView(data ? data : null)
    }
    if (this.Medication) {
      this.Medication.corpusInit(data ? data : null)
      this.Medication.adviceInit(data ? data : null)
    }
    if (this.Ovum) {
      this.Ovum.getOvum(data ? data : null)
    }
    if (this.Blood) {
      this.Blood.getblood(data ? data : null)
    }
    if (this.Dias) {
      this.Dias.getdiagnoseAll(data ? data : null)
    }
    this.getTreatMent(data ? data : null)
    store.card_flag = false
  }
  // 获取视图
  getView = (data) => {
    if (this.RecordView) {
      this.RecordView.getView(data ? data : null)
    }
  }
  // 获取下拉框的值
  getOption = () => {
    //（卵泡监测）
    apis.Patients_monitor.getOptionInit().then((res) => {
      this.setState({
        selectOption: res.data,
      })
    })
  }
  // 初始化治疗经过
  getTreatMent = (data) => {
    let { select_one } = this.props.store
    apis.Patients_firstList.getfirstComplainant(data ? data : select_one).then(
      (res) => {
        if (res.code === 200) {
          this.setState({
            treatmentHistory: res.data.treatmentHistory,
          })
        }
      }
    )
  }
  // 初始化保存
  saveTreatMent = (data) => {
    let { treatmentHistory } = this.state
    let { select_one } = this.props.store
    let obj = {
      patientParam: select_one,
      complainantParam: { treatmentHistory: treatmentHistory },
    }
    apis.Patients_firstList.saveComplainant(obj).then((res) => {
      if (res.code === 200) {
        this.initPage()
      }
    })
  }
  // lmp日期的改变(就诊视图的点击行改变检测日期)
  changeDate = (date) => {
    this.setState({
      date: date,
    })
  }
  // lmp的改变
  checkLmp = (date) => {
    this.setState({
      lMPDate: date,
    })
  }
  // 获取这个周期的uid
  getUid = (uid) => {
    this.setState({
      dataUid: uid,
    })
  }
  // 结束本周期
  endCycle = () => {
    let { dataUid } = this.state
    apis.NaturalMonitor.EndNatureCycle({ uid: dataUid }).then((res) => {
      if (res.code === 200) {
        message.success("本周期成功结束！")
      } else {
        message.error(res.messag)
      }
    })
  }
  render() {
    const { lMPDate, selectOption, date, treatmentHistory } = this.state
    const { patientSex } = this.props.store
    return (
      <>
        <ContentRadius>
          <div id="endDiv">
            <Button onClick={this.endCycle} type="primary">
              结束
            </Button>
          </div>
          <div id="viewDiv">
            <MonitorRecord
              getUid={(uid) => this.getUid(uid)}
              checkLmp={(date) => this.checkLmp(date)}
              onRef={(ref) => (this.MointorRecord = ref)}
              name="mointor"
            />
            <RecordView
              changeDate={(date) => this.changeDate(date)}
              onRef={(ref) => (this.RecordView = ref)}
              name="mointor"
            />
          </div>
        </ContentRadius>
        <FlexItem
          width={"100px"}
          style={{
            marginTop: 0,
            color: "#59b4f4",
          }}
        >
          <div style={{ marginBottom: "1em" }}>
            开立日
            <span className="span_underline">{monitor_curDate}</span>
          </div>
        </FlexItem>
        <BaseCollapse
          ghost
          destroyInactivePanel={true}
          expandIcon={({ isActive }) =>
            isActive ? <CaretUpOutlined /> : <CaretDownOutlined />
          }
          className="monitor-collapse"
        >
          <Panel header={<PanelTag title="B超" />} key="m_bchao">
            <Ovum
              onRef={(ref) => (this.Ovum = ref)}
              lMPDate={lMPDate}
              date={date}
              selectOption={selectOption}
              initPage={() => this.getView()}
            />
          </Panel>
          <Panel header={<PanelTag title="血激素水平" />} key="m_blood">
            <Blood
              onRef={(ref) => (this.Blood = ref)}
              lMPDate={lMPDate}
              initPage={() => this.getView()}
              name="natural"
            />
          </Panel>
          <Panel
            header={<PanelTag title="治疗经过" />}
            key="m_treatmentHistory"
          >
            <TextArea
              rows={4}
              value={treatmentHistory}
              onChange={(e) => {
                this.setState({
                  treatmentHistory: e.target.value,
                })
              }}
              onBlur={this.saveTreatMent}
            />
          </Panel>
          <Panel header={<PanelTag title="诊断" />} key="m_dias">
            <Dias
              stage={0}
              genderBasicInfo={Number(patientSex)}
              onRef={(ref) => (this.Dias = ref)}
              initPage={this.initPage}
            />
          </Panel>
          <Panel header={<PanelTag title="医嘱" />} key="m_docAdvice">
            <Medication
              name={0}
              onRef={(ref) => (this.Medication = ref)}
              initPage={this.initPage}
            />
          </Panel>
        </BaseCollapse>
      </>
    )
  }
}
