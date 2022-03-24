import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Drawer } from "antd"
import styled from "styled-components"
import "./index.scss"
import apis from "@/app/utils/apis"
import { depObj } from "@/app/utils/tool.js"
import PrintCard from "@/app/pages/patients/patientmoreDetail/firsitVist/printCard"
import MonitorRecord from "@/app/pages/patients/patientmoreDetail/naturalMonitor/monitorRecord" //自然周期基本信息
import RecordView from "@/app/pages/patients/patientmoreDetail/naturalMonitor/recordView" //就诊视图

const PatientContent = styled.div`
  background: #fff;
  border-radius: 2px;
  border-bottom: 10px;
  min-height: 500px;
`
const BaseTitle = styled.div`
  height: 40px;
  line-height: 40px;
  font-weight: 500;

  .leftborder {
    vertical-align: middle;
    display: inline-block;
    margin: 0 10px;
    width: 2px;
    height: 14px;
    background-color: #59b4f4;
  }
`
const ClinicItem = styled.div`
  margin: 0 10px 0 20px;
`
const RowTitle = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  span:first-child {
    margin-right: 10px;
  }
  span:nth-child(2) {
    min-width: 90px;
  }
  hr {
    width: 100%;
    color: #9fd5fb;
    border-style: dashed;
  }
`
const RowItem = styled.div`
  line-height: 30px;
`
const SpanTitle = styled.span`
  margin-right: 10px;
  font-weight: 500;
  text-align: right;
  display: inline-block;
  width: 100px;
  color: #666666;
  letter-spacing: 1px;
`
const SpanText = styled.div`
  vertical-align: top;
  display: inline-block;
  width: 85%;
`
export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false, //大病历显示
      recordData: [], //初始化就诊履历
      src: null,
      dataList: null, //打开的病历的数据
      sex: null, //选择的患者性别
      naturalShow: false, //自然周期抽屉的显示与隐藏
      naturalObj: {
        patientPid: null,
        date: null,
        cycleNumber: null,
        treatStage: 6,
        patientSex: null,
      },
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.init()
  }
  // 病历初始化
  init = () => {
    let patient = this.props.store.select_one
    apis.Patients_history.getMedicalHistory(patient).then((res) => {
      this.setState({
        recordData: res.data,
      })
    })
  }
  //初诊后台
  getMedicalFirst = (obj) => {
    apis.Patients_firstList.getfirstList(obj).then((res) => {
      if (res.code === 200) {
        this.setState({
          dataList: res.data,
          isShow: true,
        })
      }
    })
  }
  //复诊后台
  getMedicalSecond = (obj) => {
    apis.Patients_secondList.getsecondList(obj).then((res) => {
      if (res.code === 200) {
        this.setState({
          dataList: res.data,
          isShow: true,
        })
      }
    })
  }
  // 判断应该打开初诊还是复诊还是卵泡监测
  getMedicalRecord = (data) => {
    let { store } = this.props
    depObj(store.select_resume, store.select_one)
    store.select_resume.cycleNumber = data.cycleNumber
    store.select_resume.treatStage = data.treatStage
    store.select_resume.date = data.startDate
    let obj = {
      startDate: data.startDate,
      patientPid: data.patientPid,
      reservationUid: data.reservationUid || null,
    }
    this.setState({
      naturalObj: {
        patientPid: data.patientPid,
        date: data.startDate,
        cycleNumber: data.cycleNumber,
        patientSex: 1,
        treatStage: 6,
      },
    })
    this.setState({
      sex: data.sex,
    })
    store.patientSex = data.sex
    if (data.treatStage === 0) {
      this.getMedicalFirst(obj)
    } else if (data.treatStage === 1) {
      this.getMedicalSecond(obj)
    } else if (data.treatStage === 6) {
      this.setState({
        naturalShow: true,
      })
    } else {
      this.props.changeClick()
    }
    localStorage.setItem("patient", JSON.stringify(store.select_resume))
    store.resumeSelect(store.select_resume)
    this.props.store.resumePeople = true
  }
  //打开病历
  openClinic = (item) => {
    this.getMedicalRecord(item)
  }
  // 关闭侧边弹框
  closeDraw = () => {
    this.setState({
      isShow: false,
    })
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.currentKey !== this.props.currentKey) {
      this.init()
    }
  }
  render() {
    let {
      recordData,
      isShow,
      dataList,
      sex,
      naturalShow,
      naturalObj,
    } = this.state
    let { select_resume } = this.props.store
    return (
      <div className="clinicRecordilc">
        <PatientContent>
          <BaseTitle>
            <div className="leftborder" />
            <span className="rightmargin">就诊履历</span>
          </BaseTitle>
          {recordData &&
            recordData.map((item, index) => {
              return (
                <ClinicItem key={index} onClick={() => this.openClinic(item)}>
                  <RowTitle>
                    <span>
                      <svg className="icon_record" aria-hidden="true">
                        {item.sex === 0 ? (
                          item.treatStage === 0 ? (
                            <use xlinkHref="#iconnanfangchuzhen" />
                          ) : (
                            <use xlinkHref="#iconnvfangfuzhen" />
                          )
                        ) : item.treatStage === 0 ? (
                          <use xlinkHref="#iconlvlichuzhen" />
                        ) : item.treatStage === 1 ? (
                          <use xlinkHref="#iconlvlifuzhen" />
                        ) : item.treatStage === 2 ? (
                          <use xlinkHref="#iconlvliIVF" />
                        ) : item.treatStage === 3 ? (
                          <use xlinkHref="#iconlvliIUI" />
                        ) : item.treatStage === 4 ? (
                          <use xlinkHref="#iconlvliFET" />
                        ) : item.treatStage === 5 ? (
                          <use xlinkHref="#icona-IVFFET3" />
                        ) : item.treatStage === 6 ? (
                          <use xlinkHref="#iconzi3" />
                        ) : null}
                      </svg>
                    </span>
                    <span> {item.startDate}</span>
                    <hr size="1" />
                  </RowTitle>
                  {item.treatStage === 0 ? (
                    <>
                      <RowItem>
                        <SpanTitle>主诉:</SpanTitle>
                        <SpanText>{item.complainant}</SpanText>
                      </RowItem>
                      <RowItem>
                        <SpanTitle>现病史:</SpanTitle>
                        <SpanText>{item.currentMedicalHistory}</SpanText>
                      </RowItem>
                      <RowItem>
                        <SpanTitle>诊断:</SpanTitle>
                        {item.diagnose != null ? (
                          <span>
                            {item.diagnose.map((items) => {
                              return (
                                <span style={{ margin: "0 1em" }} key={items}>
                                  {items.diagnoseResult}
                                  {items.doubtStatus === 0 ? " (疑似) " : null}
                                </span>
                              )
                            })}
                          </span>
                        ) : (
                          <span>无</span>
                        )}
                      </RowItem>
                    </>
                  ) : null}
                  {item.treatStage === 1 ? (
                    <>
                      <RowItem>
                        <SpanTitle>治疗经过:</SpanTitle>
                        <SpanText title={item.currentMedicalHistory}>
                          {item.currentMedicalHistory}
                        </SpanText>
                      </RowItem>
                      <RowItem style={{ display: "flex" }}>
                        <SpanTitle>诊断:</SpanTitle>
                        {item.diagnose != null ? (
                          <span>
                            {item.diagnose.map((items) => {
                              return (
                                <span style={{ margin: "0 1em" }} key={items}>
                                  {items.diagnoseResult}
                                  {items.doubtStatus === 0 ? " (疑似) " : null}
                                </span>
                              )
                            })}
                          </span>
                        ) : (
                          <span>无</span>
                        )}
                      </RowItem>
                    </>
                  ) : null}
                  {item.treatStage === 2 ? (
                    <>
                      <RowItem>
                        <SpanTitle>用药方案:</SpanTitle>
                        <span>{item.medicationPlan}</span>
                      </RowItem>
                      <RowItem>
                        <SpanTitle>授精方式:</SpanTitle>
                        <span>{item.inseminationMethod}</span>
                        <SpanTitle>获卵:</SpanTitle>
                        {item.obtainedEggs ? (
                          <span>{item.obtainedEggs}枚</span>
                        ) : null}
                        <SpanTitle>正常授精:</SpanTitle>
                        {item.fertilizedCount ? (
                          <span>{item.fertilizedCount}枚</span>
                        ) : null}
                        <SpanTitle>优质胚胎数:</SpanTitle>
                        {item.goodQualityEmbryos ? (
                          <span>{item.goodQualityEmbryos}枚</span>
                        ) : null}
                        <SpanTitle>可移植胚胎:</SpanTitle>
                        {item.availableTransferredEmbryos ? (
                          <span>{item.availableTransferredEmbryos}枚</span>
                        ) : null}
                        <SpanTitle>冻存胚胎:</SpanTitle>
                        {item.frozenEmbryos ? (
                          <span>{item.frozenEmbryos}枚</span>
                        ) : null}
                      </RowItem>
                      <RowItem>
                        <SpanTitle>随访结果:</SpanTitle>
                        <span>{item.followUpEnding}</span>
                      </RowItem>
                      <RowItem style={{ marginLeft: "20px" }}>
                        {item.spermSource ? <span>供精，</span> : null}
                        {item.spermFresh ? <span>冻精，</span> : null}
                        {item.spermMethod ? <span>手术精，</span> : null}
                        {item.eggSource ? <span>供卵，</span> : null}
                        {item.eggFresh ? <span>冻卵，</span> : null}
                        {item.ivm ? <span>IVM(供精体外培养)</span> : null}
                      </RowItem>
                    </>
                  ) : null}
                  {item.treatStage === 3 ? (
                    <>
                      <RowItem>
                        <SpanTitle>用药方案:</SpanTitle>
                        <span>{item.medicationPlan}</span>
                      </RowItem>
                      <RowItem>
                        <SpanTitle>授精日期:</SpanTitle>
                        <span>
                          {item.iuiDate ? (
                            <>
                              {item.iuiDate.map((item, index) => {
                                return <span key={index}>{item},</span>
                              })}
                            </>
                          ) : null}
                        </span>
                        <SpanTitle>授精次数:</SpanTitle>
                        <span>{item.iuiOperations}</span>
                      </RowItem>
                      <RowItem>
                        <SpanTitle>随访结果:</SpanTitle>
                        <span>{item.followUpEnding}</span>
                      </RowItem>
                    </>
                  ) : null}
                  {item.treatStage === 4 ? (
                    <>
                      <RowItem>
                        <SpanTitle>用药方案:</SpanTitle>
                        <span>{item.medicationPlan}</span>
                      </RowItem>
                      <RowItem>
                        <SpanTitle>解冻胚胎数:</SpanTitle>
                        {item.thawedEmbryos ? (
                          <span>{item.thawedEmbryos}枚</span>
                        ) : null}
                        <SpanTitle>移植胚胎数:</SpanTitle>
                        {item.transferredEmbryos ? (
                          <span>{item.transferredEmbryos}枚</span>
                        ) : null}
                        <SpanTitle>剩余胚胎数:</SpanTitle>
                        {item.remainingEmbryos ? (
                          <span>{item.remainingEmbryos}枚</span>
                        ) : null}
                      </RowItem>
                      <RowItem>
                        <SpanTitle>随访结果:</SpanTitle>
                        <span>{item.followUpEnding}</span>
                      </RowItem>
                    </>
                  ) : null}
                  {item.treatStage === 6 ? (
                    <>
                      <div className="naturalLeftDiv">月经:</div>
                      <div className="naturalRightDiv">
                        {item.natureMonitoringAdviceVOList.map(
                          (item, index) => {
                            return (
                              <div key={index}>
                                <div className="naturalRightItem">
                                  <div className="titleFlexDiv">
                                    第{item.afterMenstruation}天
                                  </div>
                                  <div className="titleFlexDiv">
                                    <span className="titleFlexSpan">左:</span>
                                    <span className="titleFlexSpan">
                                      {item.leftOvaryVolume ? (
                                        <>{item.leftOvaryVolume}cm</>
                                      ) : null}
                                    </span>
                                    <span className="titleFlexSpan">
                                      {item.leftFolliclesTotal ? (
                                        <>{item.leftFolliclesTotal}枚</>
                                      ) : null}
                                    </span>
                                    <span className="titleFlexSpan">
                                      {item.leftFollicles}
                                    </span>
                                  </div>
                                  <div className="titleFlexDiv">
                                    <span className="titleFlexSpan">右:</span>
                                    <span className="titleFlexSpan">
                                      {item.rightOvaryVolume ? (
                                        <>{item.rightOvaryVolume}cm</>
                                      ) : null}
                                    </span>
                                    <span className="titleFlexSpan">
                                      {item.rightFolliclesTotal ? (
                                        <>{item.rightFolliclesTotal}枚</>
                                      ) : null}
                                    </span>
                                    <span className="titleFlexSpan">
                                      {item.rightFollicles}
                                    </span>
                                  </div>
                                </div>
                                {item.bloodHormoneDetail.map(
                                  (itemb, indexb) => {
                                    return (
                                      <div
                                        key={indexb}
                                        className="naturalRightItem"
                                        style={{ marginLeft: "60px" }}
                                      >
                                        {itemb.map((itemi, indexi) => {
                                          return (
                                            <span
                                              className="titleFlexSpan"
                                              key={indexi}
                                            >
                                              {itemi},
                                            </span>
                                          )
                                        })}
                                      </div>
                                    )
                                  }
                                )}
                              </div>
                            )
                          }
                        )}
                      </div>
                    </>
                  ) : null}
                  {item.treatStage === 0 || item.treatStage === 1 ? (
                    <RowItem style={{ textAlign: "right" }}>
                      <SpanTitle>医生:</SpanTitle>
                      <span>{item.doctor}</span>
                    </RowItem>
                  ) : null}
                </ClinicItem>
              )
            })}
        </PatientContent>
        <Drawer
          closable={false}
          onClose={this.closeDraw}
          placement="right"
          bodyStyle={{ padding: "10px", height: "100%", overflow: "hidden" }}
          visible={isShow}
          width={650}
        >
          <div className="printDrawer">
            <PrintCard
              data={dataList}
              name="resume"
              sex={sex}
              stage={select_resume.treatStage}
            />
          </div>
        </Drawer>
        {naturalShow ? (
          <Drawer
            closable={false}
            onClose={() => {
              this.setState({
                naturalShow: false,
              })
            }}
            placement="right"
            bodyStyle={{ padding: "10px", height: "100%", overflow: "hidden" }}
            visible={naturalShow}
            width={800}
          >
            <div id="viewDiv" className="printDrawer">
              <MonitorRecord name="clinic" naturalObj={naturalObj} />
              <RecordView name="clinic" naturalObj={naturalObj} />
            </div>
          </Drawer>
        ) : null}
      </div>
    )
  }
}
