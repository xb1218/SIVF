import React, { Component } from "react"
import { Drawer } from "antd"
import { observer, inject } from "mobx-react"
import { BaseDiv } from "@/app/components/base/baseSpan"
import BaseBread from "@/app/components/base/baseBread"
import { ArrowLeftOutlined } from "@ant-design/icons"
import Header from "@/app/components/common/Header"
import BigMedical from "@/app/components/normal/BigRecord"
import MedicalCard from "./medicalCard"
import Diagnosis from "@/app/pages/patients/patientmoreDetail/diagnosis/diagn"
import Inspection from "@/app/pages/patients/patientmoreDetail/inspection/index"
import PatientsInfo from "@/app/components/normal/PatientsInfo"
import History from "@/app/pages/patients/patientmoreDetail/historytaking"
import "./index.scss"
import apis from "../../utils/apis"

export default
@inject("store", "moredetail", "inspection")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      stage: "", //是哪个阶段
      sex: -1, //性别
      initSure: false,
      maleComplainant: {}, //主诉现病史数据男方
      famaleComplainant: {}, //主诉现病史女方
    }
  }
  componentDidMount() {
    let select_male = JSON.parse(localStorage.getItem("malePatient"))
    let select_female = JSON.parse(localStorage.getItem("femalePatient"))
    this.complainant(select_male, "maleComplainant")
    this.complainant(select_female, "famaleComplainant")
  }
  // 弹出侧边栏
  changeClick = async (ref, sex) => {
    this.setState({
      stage: ref, //选中了哪一个模块
      sex: sex, //选中了是男是女
    })
    await this.setState({
      visible: true,
    })
  }
  // 抽屉不显示
  notShow = () => {
    let { stage } = this.state
    this.setState({
      visible: false,
    })
    if (stage === "basic") {
      this.PatientsInfo.saveInfo(true)
    } else if (stage === "inspect") {
      this.selectExamination()
    }
    this.BigMedical.init()
  }
  //指定该周期病例里的检查日期
  selectExamination = () => {
    let femalePatient = JSON.parse(localStorage.getItem("femalePatient"))
    let malePatient = JSON.parse(localStorage.getItem("malePatient"))
    let {
      physicalFemaleExaminationUid,
      physicalMaleExaminationUid,
      gynecologicalExaminationUid,
      maleExaminationUid,
      inspectionProjectUids,
      hysterosalpingogramUid,
      gynecologicalUltrasoundUid,
      otherVideoProjectUids,
    } = this.props.inspection
    let { sex } = this.state
    let params = {
      pid: sex ? femalePatient.patientPid : malePatient.patientPid,
      cycleNumber: sex ? femalePatient.cycleNumber : malePatient.cycleNumber,
      physicalExaminationUid: sex
        ? physicalFemaleExaminationUid
        : physicalMaleExaminationUid,
      gynecologicalExaminationUid,
      maleExaminationUid,
      inspectionProjectUids,
      hysterosalpingogramUid,
      gynecologicalUltrasoundUid,
      otherVideoProjectUids,
    }
    apis.ManCheck.setSelectExamination(params).then((res) => {})
  }
  // 初始化卡片的信息
  init = () => {
    //页面重新获取数据
  }
  // 初始化主诉现病史
  complainant = (parm, name) => {
    apis.Patients_firstList.getfirstComplainant(parm).then((res) => {
      this.setState({
        [name]: res.data,
        initSure: true,
      })
    })
  }
  // 修改主诉现病史
  updateComplainant = (e, data, parm) => {
    let { maleComplainant, famaleComplainant } = this.state
    data[parm] = e.target.value
    this.setState({
      maleComplainant,
      famaleComplainant,
    })
  }
  // 主诉保存
  saveComplainant = (sex) => {
    let { maleComplainant, famaleComplainant } = this.state
    let select_male = JSON.parse(localStorage.getItem("malePatient"))
    let select_female = JSON.parse(localStorage.getItem("femalePatient"))
    let maledata = {
      patientParam: select_male,
      complainantParam: maleComplainant,
    }
    let fameledata = {
      patientParam: select_female,
      complainantParam: famaleComplainant,
    }
    if (sex) {
      apis.Patients_firstList.saveComplainant(fameledata).then((res) => {
        if (res.code === 200) {
          this.BigMedical.init()
        }
      })
    } else {
      apis.Patients_firstList.saveComplainant(maledata).then((res) => {
        if (res.code === 200) {
          this.BigMedical.init()
        }
      })
    }
  }
  render() {
    let patientCard = JSON.parse(localStorage.getItem("patientCard"))
    let { visible, stage, sex, maleComplainant, famaleComplainant } = this.state
    return (
      <>
        <Header />
        <div className="contentBigRecord">
          <BaseBread
            icon={
              <ArrowLeftOutlined
                onClick={() =>
                  this.props.history.push("/public/patients/detail")
                }
              />
            }
            first="大病历"
          />
          <div className="contentMedical">
            <div className="leftMedical">
              <BaseDiv>
                <div className="flexMedical">
                  <svg className="icon_s svgMedical">
                    <use xlinkHref="#iconnv"></use>
                  </svg>
                  <span>{patientCard.femalePatientName}</span>
                  <span>{patientCard.femaleAge}岁</span>
                  <span>{patientCard.femaleIdNumber}</span>
                </div>
                <div className="flexMedical">
                  <svg className="icon_s svgMedical">
                    <use xlinkHref="#iconnan"></use>
                  </svg>
                  <span>{patientCard.malePatientName}</span>
                  <span>{patientCard.maleAge}岁</span>
                  <span>{patientCard.maleIdNumber}</span>
                </div>
              </BaseDiv>
              <BaseDiv style={{ height: "620px", position: "relative" }}>
                <BigMedical
                  onRef={(ref) => (this.BigMedical = ref)}
                  name="edit"
                />
              </BaseDiv>
            </div>
            <div className="rightMedical">
              <BaseDiv>
                <MedicalCard
                  sex={1}
                  click={(ref) => this.changeClick(ref, 1)}
                  data={famaleComplainant}
                  updateComplainant={(e, data, parm) =>
                    this.updateComplainant(e, data, parm)
                  }
                  saveComplainant={() => this.saveComplainant(1)}
                />
                <div className="dashedBorderMedical"></div>
                <MedicalCard
                  sex={0}
                  click={(ref) => this.changeClick(ref, 0)}
                  data={maleComplainant}
                  updateComplainant={(e, data, parm) =>
                    this.updateComplainant(e, data, parm)
                  }
                  saveComplainant={() => this.saveComplainant(0)}
                />
              </BaseDiv>
            </div>
          </div>
        </div>
        {visible ? (
          <Drawer
            width={1000}
            maskClosable
            placement="right"
            closable={false}
            visible={visible}
            onClose={this.notShow}
          >
            {stage === "diagnosis" ? (
              <Diagnosis stage={1} genderBasicInfo={sex} initPage={this.init} />
            ) : null}
            {stage === "history" ? (
              <div>
                <History name="bigRecordHistory" sex={sex} />
              </div>
            ) : null}
            {stage === "basic" ? (
              <div>
                <PatientsInfo
                  name={"basic"}
                  close={() => {
                    this.setState({
                      visible: false,
                    })
                  }}
                  sex={sex}
                  onRef={(ref) => {
                    this.PatientsInfo = ref
                  }}
                />
              </div>
            ) : null}
            {stage === "inspect" ? (
              <div>
                <Inspection sex={sex} />
              </div>
            ) : null}
          </Drawer>
        ) : null}
      </>
    )
  }
}
