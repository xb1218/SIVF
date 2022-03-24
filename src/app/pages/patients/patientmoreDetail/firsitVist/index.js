import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Spin, Input, Radio, Button, Drawer } from "antd"
import { LoadingDiv } from "@/app/components/base/baseDiv"
import { FlexItem } from "@/app/components/base/baseForms.js"
import Diagnosis from "../diagnosis/diagn"
import Advice from "@/app/components/normal/MedicalAdvice"
import apis from "@/app/utils/apis.js"
import { todayString } from "@/app/utils/const.js"
import PrintCard from "./printCard"
import Template from "@/app/components/normal/Template"
import MenstrualHistory from "./menFirst"
import "./indx.scss"
const { TextArea } = Input

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor() {
    super()
    this.state = {
      showTemplate: false, //现病史模板是否显示
      selectArr: [],
      initFlag: false, //病历请求成功flag
      compFlag: false, //主诉请求成功flag
      optionsData: null,
      dataList: {},
      dataComplaint: {},
      menoptionsData: [],
      showTemCom: false, //主诉模板是否显示
    }
  }
  componentDidMount() {
    this.initPage()
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentKey !== this.props.currentKey ||
      nextProps.patientId !== this.props.patientId ||
      nextProps.visitRoom !== this.props.visitRoom
    ) {
      this.initPage()
    }
  }

  initPage = () => {
    let { select_one, treat_stage } = this.props.store
    let { configMedicalAdvice } = this.props.moredetail

    let obj = select_one
    obj.startDate = select_one.date
    let objComplainant = select_one
    // this.setState({
    //   compFlag: false,
    //   initFlag: false,
    // })
    //主诉初始化
    apis.Patients_firstList.getfirstComplainant(objComplainant).then((res) => {
      res.data.date = select_one.date
      this.setState({
        dataComplaint: res.data,
        compFlag: true,
      })
    })
    if (treat_stage === 0) {
      apis.Patients_firstList.getfirstList(obj).then((res) => {
        this.setState({
          dataList: res.data,
          initFlag: true,
        })
      })
    } else if (treat_stage === 1) {
      apis.Patients_secondList.getsecondList(obj).then((res) => {
        this.setState({
          dataList: res.data,
          initFlag: true,
        })
      })
    }
    if (this.Diagnosis) {
      this.Diagnosis.getdiagnoseAll() //初始化诊断
    }
    if (this.Advice) {
      this.Advice.adviceInit() //初始化医嘱
      configMedicalAdvice(select_one) //初始化用药配置
    }
    this.Menstrual && this.Menstrual.getMenValue()
  }
  //改变state中主诉值
  setStaeData = (param, val) => {
    const { dataComplaint } = this.state
    dataComplaint[param] = val
    this.setState({
      dataComplaint,
    })
  }
  //失去焦点保存
  onBlurSave = () => {
    const { dataComplaint } = this.state
    let { select_one } = this.props.store
    let obj = {
      patientParam: select_one,
      complainantParam: dataComplaint,
    }
    obj.patientParam.cycleNumber = null
    apis.Patients_firstList.saveComplainant(obj).then((res) => {
      if (res.code === 200) {
        this.initPage()
      }
    })
  }
  // 现病史模板的显示
  showTem = () => {
    this.setState({
      showTemplate: true,
    })
  }
  // 选择现病史的模板
  checkTem = (data) => {
    // 现病史赋值
    this.setStaeData("currentMedicalHistory", data)
    this.onBlurSave()
    this.setState({
      showTemplate: false,
    })
  }
  // 主诉模板的显示
  showTemCom = () => {
    this.setState({
      showTemCom: true,
    })
  }
  // 选择的主诉模板
  checkTemCom = (data) => {
    // 现病史赋值
    this.setStaeData("complainant", data)
    this.onBlurSave()
    this.setState({
      showTemCom: false,
    })
  }
  // 改变主诉内容
  changeTemCom = (obj) => {
    let { dataComplaint } = this.state
    let month = obj?.month
      ? parseFloat(obj.month)
      : dataComplaint.infertilityMonth
    let year = obj?.year ? parseFloat(obj.year) : dataComplaint.infertilityYear
    if (year === null) {
      year = 0
    }
    if (month === null) {
      month = 0
    }
    if (month >= 4 && month <= 8 && year > 0) {
      let value = 0.5 + parseFloat(year)
      this.setStaeData("complainant", `未避孕未孕${value}年`)
    } else if (month > 8 && year > 0) {
      let value = 1 + parseFloat(year)
      this.setStaeData("complainant", `未避孕未孕${value}年`)
    } else if (year <= 0 && month > 0) {
      this.setStaeData("complainant", `未避孕未孕${month}月`)
    } else if (year > 0 && month < 4) {
      this.setStaeData("complainant", `未避孕未孕${year}年`)
    } else {
      this.setStaeData("complainant", "")
    }
  }
  render() {
    let {
      initFlag,
      compFlag,
      dataList,
      dataComplaint,
      showTemplate,
      menoptionsData,
      showTemCom,
    } = this.state
    const { treat_stage, patientSex } = this.props.store
    return (
      <div>
        {initFlag && compFlag ? (
          <div className="first_content">
            <div className="printCard">
              <PrintCard data={dataList} stage={treat_stage} />
            </div>
            <div className="editCard">
              {treat_stage === 0 ? (
                <>
                  <FlexItem>
                    <div style={{ marginLeft: 0, flexGrow: 1 }}>
                      <span className="border_left" />
                      <span>主诉</span>
                      <Button
                        size="small"
                        type="primary"
                        style={{ marginLeft: "20px", marginTop: "4px" }}
                        onClick={this.showTemCom}
                      >
                        模板
                      </Button>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <div>
                      <Radio.Group
                        defaultValue={dataComplaint.infertilityType}
                        value={dataComplaint.infertilityType}
                        onChange={(e) => {
                          this.setStaeData("infertilityType", e.target.value)
                          this.changeTemCom()
                          setTimeout(() => {
                            this.onBlurSave()
                          }, 10)
                        }}
                      >
                        <Radio value="继发">继发</Radio>
                        <Radio value="原发">原发</Radio>
                      </Radio.Group>
                    </div>
                    <div>
                      <span>{patientSex ? "不孕" : "不育"}年限</span>
                      <Input
                        addonAfter="年"
                        // onBlur={(e) => this.onBlurSave()}
                        value={dataComplaint.infertilityYear}
                        onChange={(e) => {
                          this.changeTemCom({ year: e.target.value })
                          this.setStaeData("infertilityYear", e.target.value)
                        }}
                      />
                      <Input
                        addonAfter="个月"
                        // onBlur={(e) => this.onBlurSave()}
                        value={dataComplaint.infertilityMonth}
                        onChange={(e) => {
                          this.changeTemCom({ month: e.target.value })
                          this.setStaeData("infertilityMonth", e.target.value)
                        }}
                      />
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <TextArea
                      rows={2}
                      style={{ flexGrow: 1 }}
                      onMouseOut={() => this.onBlurSave()}
                      defaultValue={dataComplaint.complainant}
                      value={dataComplaint.complainant}
                      onChange={(e) => {
                        this.setStaeData("complainant", e.target.value)
                      }}
                    />
                  </FlexItem>
                  <FlexItem>
                    <div style={{ marginLeft: 0, width: "100%" }}>
                      <span className="border_left" />
                      <span>现病史</span>
                      <Button
                        size="small"
                        type="primary"
                        style={{ marginLeft: "20px", marginTop: "4px" }}
                        onClick={this.showTem}
                      >
                        模板
                      </Button>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <div style={{ marginLeft: 0, width: "100%" }}>
                      <TextArea
                        autoSize={{ minRows: 2 }}
                        style={{ width: "calc(40vw)", lineHeight: "24px" }}
                        onBlur={(e) => this.onBlurSave()}
                        defaultValue={dataComplaint.currentMedicalHistory}
                        value={dataComplaint.currentMedicalHistory}
                        onChange={(e) => {
                          this.setStaeData(
                            "currentMedicalHistory",
                            e.target.value
                          )
                        }}
                      />
                    </div>
                  </FlexItem>
                  {patientSex ? (
                    <>
                      <FlexItem>
                        <div style={{ marginLeft: 0, width: "100%" }}>
                          <span className="border_left" />
                          <span>月经史</span>
                        </div>
                      </FlexItem>
                      <MenstrualHistory
                        optionsData={menoptionsData}
                        onRef={(ref) => (this.Menstrual = ref)}
                        initPage={() => this.initPage()}
                      />
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  <FlexItem>
                    <div style={{ marginLeft: 0, width: "100%" }}>
                      <span className="border_left" />
                      <span>治疗经过</span>
                    </div>
                  </FlexItem>
                  <FlexItem>
                    <div style={{ marginLeft: 0, width: "100%" }}>
                      <TextArea
                        autoSize={{ minRows: 2 }}
                        style={{ width: "calc(40vw)", lineHeight: "24px" }}
                        onBlur={(e) => this.onBlurSave()}
                        defaultValue={dataComplaint.treatmentHistory}
                        onChange={(e) => {
                          this.setStaeData("treatmentHistory", e.target.value)
                        }}
                      />
                    </div>
                  </FlexItem>
                </>
              )}
              <div className="color_blue">日期：{todayString}</div>
              <FlexItem>
                <div style={{ marginLeft: 0 }}>
                  <span className="border_left" />
                  <span>诊断</span>
                </div>
              </FlexItem>
              <Diagnosis
                stage={0}
                genderBasicInfo={Number(patientSex)}
                initPage={() => this.initPage()}
                onRef={(ref) => (this.Diagnosis = ref)}
              />
              <FlexItem>
                <div style={{ marginLeft: 0 }}>
                  <span className="border_left" />
                  <span>医嘱</span>
                </div>
              </FlexItem>
              <Advice
                name={0}
                initPage={() => this.initPage()}
                onRef={(ref) => (this.Advice = ref)}
              />
            </div>
            {showTemplate ? (
              <Drawer
                visible={showTemplate}
                closable={false}
                width="800px"
                onClose={() => {
                  this.setState({
                    showTemplate: false,
                  })
                }}
              >
                {/* type为1代表现病史模板 */}
                <Template
                  checkTem={(data) => this.checkTem(data)}
                  type={1}
                  titleTop="现病史模板"
                />
              </Drawer>
            ) : null}
            {showTemCom ? (
              <Drawer
                visible={showTemCom}
                closable={false}
                width="800px"
                onClose={() => {
                  this.setState({
                    showTemCom: false,
                  })
                }}
              >
                {/* type为2代表是手术模板 */}
                <Template
                  checkTem={(data) => this.checkTemCom(data)}
                  type={2}
                  titleTop="主诉模板"
                />
              </Drawer>
            ) : null}
          </div>
        ) : (
          <LoadingDiv>
            <Spin />
          </LoadingDiv>
        )}
      </div>
    )
  }
}
