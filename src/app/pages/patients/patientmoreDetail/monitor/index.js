import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { Collapse, Button, message, Drawer, Timeline, Radio } from "antd"
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons"
import PanelTag from "@/app/components/normal/PanelTag"
import { BaseCollapse } from "@/app/components/base/baseCollapse"
import { ContentRadius } from "@/app/components/base/baseDiv"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { monitor_curDate } from "@/app/utils/const.js"
import FolliceMedicalAdvice from "./foAdvice" //监测情况-门诊视图/用药视图
import Ovum from "./ovum" //b超
import Blood from "./foBlood" //血激素水平
import Medication from "@/app/components/normal/MedicalAdvice" //医嘱
import AdvPreTable from "@/app/components/normal/advPreTable.js"
import apis from "@/app/utils/apis"
import "./index.scss"
const { Panel } = Collapse
const PositonDiv = styled.div`
  position: absolute;
  top: 15px;
  right: 30px;
  display: inlink-block;
  z-index: 2;
  cursor: pointer;
`
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
      activeKey: [],
      revisionShow: false, //修订记录侧边栏
      recordData: [], //修订记录数据
      editTag: 1, //0不可编辑,1可以编辑
      editModalName: null, //当前编辑的模块名称
      checkvisitShow: "clinic", //clinic门诊
      options: [
        { label: "就诊视图", value: "clinic" },
        { label: "用药视图", value: "mdecine" },
      ],
      currentPersonName: "",
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.getOption()
    this.getRevision() //获取修订记录
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    let { store } = this.props
    if (
      nextProps.currentKey !== this.props.currentKey ||
      nextProps.patientId !== this.props.patientId ||
      nextProps.cycleNumber !== this.props.cycleNumber
    ) {
      if (!Object.values(store.select_resume).includes(null)) {
        this.initPage(store.select_resume)
      } else {
        this.initPage()
      }
    }
  }
  // 整个页面的初始化
  initPage = (data) => {
    let { checkvisitShow } = this.state
    let { store } = this.props
    let { configMedicalAdvice } = this.props.moredetail
    let { select_one } = this.props.store

    if (this.Medication) {
      this.Medication.corpusInit(data ? data : null)
      this.Medication.adviceInit(data ? data : null)
      configMedicalAdvice(select_one) //初始化用药配置
    }
    if (this.FolliceMedicalAdvice) {
      this.FolliceMedicalAdvice.getCycle(data ? data : null)
      this.FolliceMedicalAdvice.getAct(data ? data : null)
      this.FolliceMedicalAdvice.initPage(data ? data : null)
    }
    if (this.AdvPreTable) {
      if (checkvisitShow === "clinic") {
        this.AdvPreTable.getVisView(data ? data : null)
      } else {
        this.AdvPreTable.getMedView(data ? data : null)
      }
    }
    if (this.Ovum) {
      this.Ovum.getOvum(data ? data : null)
    }
    if (this.Blood) {
      this.Blood.getblood(data ? data : null)
    }
    this.getRevision(data ? data : null)
    store.card_flag = false
  }
  // 获取视图
  getView = (data) => {
    let { checkvisitShow } = this.state
    if (this.FolliceMedicalAdvice) {
      this.FolliceMedicalAdvice.getCycle(data ? data : null)
      this.FolliceMedicalAdvice.getAct(data ? data : null)
      this.FolliceMedicalAdvice.initPage(data ? data : null)
    }
    if (this.AdvPreTable) {
      if (checkvisitShow === "clinic") {
        this.AdvPreTable.getVisView(data ? data : null)
      } else {
        this.AdvPreTable.getMedView(data ? data : null)
      }
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
  // lmp日期的改变
  checkLmp = (date) => {
    this.setState({
      lMPDate: date,
    })
  }
  // 监测日期的改变
  changeDate = (date) => {
    this.setState({
      date: date,
    })
  }
  // 返回本周期
  currentCycle = () => {
    let { store } = this.props
    for (var item in store.select_resume) {
      store.select_resume[item] = null
    }
    store.resumeSelect(store.select_one)
    store.resumePeople = false
    localStorage.setItem("patient", JSON.stringify(store.select_one))
    this.initPage(store.select_one)
  }
  // 查看修订记录
  revision = () => {
    this.setState({
      revisionShow: true,
    })
  }
  // 查看修订记录
  checkRevision = (item) => {
    let obj = {
      uid: item.uid,
      moduleName: item.moduleName,
    }
    this.setState({
      editModalName: item.moduleName,
      editTag: item.editTag,
    })
    this.getRevisionData(obj)
  }
  // 修订记录后台初始化接口
  getRevision = (data) => {
    let { select_one } = this.props.store
    apis.Patients_monitor.revisionRecord(data ? data : select_one).then(
      (res) => {
        if (res.code === 200) {
          this.setState({
            recordData: res.data,
          })
        } else {
          message.error(res.message)
        }
      }
    )
  }
  // 修订记录查看接口
  getRevisionData = (data) => {
    apis.Patients_monitor.getRevisionData(data).then((res) => {
      if (res.code === 200) {
        this.checkData(data, res.data)
      } else {
        message.error(res.message)
      }
    })
  }
  // 查看相应模块的数据
  checkData = (data, res) => {
    switch (data.moduleName) {
      case "血激素水平":
        this.Blood && this.Blood.reviseData(res[0].moduleObject)
        break
      case "B超":
        this.Ovum && this.Ovum.reviseData(res[0].moduleObject)
        break
      case "周期方案":
        this.FolliceMedicalAdvice &&
          this.FolliceMedicalAdvice.reviseData(res[0].moduleObject)
        break
      case "医嘱":
      case "返诊预约":
        this.Medication && this.Medication.medicalData(res[0].moduleObject)
        break
      default:
        break
    }
    this.setState({
      revisionShow: false,
    })
  }
  // 切换就诊视图
  checkShow = (val) => {
    this.setState({
      checkvisitShow: val,
    })
  }
  //获取当前患者姓名
  getCurrentName = (val) => {
    this.setState({
      currentPersonName: val,
    })
  }
  render() {
    const {
      lMPDate,
      selectOption,
      date,
      activeKey,
      revisionShow,
      recordData,
      editTag,
      editModalName,
      checkvisitShow,
      options,
      currentPersonName,
    } = this.state
    return (
      <>
        <ContentRadius style={{ position: "relative" }}>
          <PositonDiv onClick={this.currentCycle}>
            <svg
              className="icon_m"
              aria-hidden="true"
              style={{ verticalAlign: "middle", marginRight: "5px" }}
            >
              <use xlinkHref="#iconshouqi" />
            </svg>
            返回本周期
            <Button
              type="primary"
              size="small"
              style={{ margin: "0 0 0 10px" }}
              onClick={this.revision}
            >
              修订记录
            </Button>
          </PositonDiv>
          <Radio.Group
            className="visitButton"
            options={options}
            onChange={({ target }) => this.checkShow(target.value)}
            value={checkvisitShow}
            optionType="button"
          />
          <FolliceMedicalAdvice
            onRef={(ref) => (this.FolliceMedicalAdvice = ref)}
            checkLmp={(date) => {
              this.checkLmp(date)
            }}
            setCurrentName={(name) => this.getCurrentName(name)}
            lmpDate={lMPDate}
            selectOption={selectOption}
            editTag={editTag}
            editModalName={editModalName}
          />
          <AdvPreTable
            type={checkvisitShow}
            changeDate={(date) => this.changeDate(date)}
            checkLmp={(date) => this.checkLmp(date)}
            onRef={(ref) => (this.AdvPreTable = ref)}
            selectOption={selectOption}
            currentPersonName={currentPersonName}
          />
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
          activeKey={activeKey}
          onChange={(keys) => {
            this.setState({
              activeKey: keys,
            })
          }}
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
              editTag={editTag}
              editModalName={editModalName}
              selectOption={selectOption}
              initPage={() => this.getView()}
            />
          </Panel>
          <Panel header={<PanelTag title="血激素水平" />} key="m_blood">
            <Blood
              editTag={editTag}
              editModalName={editModalName}
              onRef={(ref) => (this.Blood = ref)}
              initPage={() => this.getView()}
            />
          </Panel>
          <Panel header={<PanelTag title="医嘱" />} key="m_docAdvice">
            <Medication
              editTag={editTag}
              editModalName={editModalName}
              name={1}
              initPage={() => this.getView()}
              onRef={(ref) => (this.Medication = ref)}
            />
          </Panel>
        </BaseCollapse>
        <Drawer
          visible={revisionShow}
          closable={false}
          width="300px"
          onClose={() => {
            this.setState({
              revisionShow: false,
            })
          }}
        >
          <PanelTag title="修订记录" />
          <Timeline>
            {recordData.map((item, index) => {
              return (
                <Timeline.Item key={index}>
                  <div className="revisionFlex">
                    <div className="revisionMargin">
                      第{item.versionNumber}版
                    </div>
                    <div>{item.monitorDate}</div>
                  </div>
                  <div style={{ marginTop: "15px" }} className="revisionFlex">
                    <div className="revisionMargin">
                      {item.createName}
                      {item.operate ? "修改" : "新增"}
                      {item.moduleName}
                    </div>
                    <svg
                      className="icon_s revisionCursor"
                      aria-hidden="true"
                      onClick={() => this.checkRevision(item)}
                    >
                      <use xlinkHref="#iconxiudingjilu"></use>
                    </svg>
                  </div>
                </Timeline.Item>
              )
            })}
          </Timeline>
        </Drawer>
      </>
    )
  }
}
