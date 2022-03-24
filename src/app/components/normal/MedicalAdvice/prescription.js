// 处方(只读)
import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import "./index.scss"

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super()
    this.state = {
      dataSorcePre: {
        age: "",
        date: "",
        diagnose: "",
        doctor: "",
        comprehensiveTreatmentDTOS: [],
        medicalAdviceCheckDTOS: [],
        medicationDTOS: [],
        medicalRecordNum: "",
      },
    }
  }
  // 初始化
  componentDidMount() {
    let { prescription } = this.props
    this.setState({
      dataSorcePre: prescription,
    })
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.prescription !== this.props.prescription) {
      this.setState({
        dataSorcePre: nextProps.prescription,
      })
    }
  }
  render() {
    let { dataSorcePre } = this.state
    let sex = this.props.store.patientSex
    const ModalFont = () => {
      return (
          <span className="modalFont">.</span>
      )
    }
    return (
      <>
        <div id="showMediaArry">
          <p className="titleP">处方</p>
          <div className="titleMedical">
            <div>
              病历号：
              <span className="underLineSpan">
                <ModalFont />
                {dataSorcePre.medicalRecordNum}
              </span>
            </div>
            <div>
              {sex === 1 ? <span>女方：</span> : <span>男方：</span>}
              <span className="underLineSpan"> 
                <ModalFont />
                {dataSorcePre.patientName}
              </span>
            </div>
            <div>
              年龄：
              <span style={{ width: "35px" }} className="underLineSpan">
                <ModalFont />
                {dataSorcePre.patientAge}岁
              </span>
            </div>
            <div>
              电话：
              <span style={{ width: "100px" }} className="underLineSpan">
                <ModalFont />
                {dataSorcePre.phone}
              </span>
            </div>
          </div>
          <div style={{ marginLeft: "18px" }}>
            诊断：
            <span className="underLineSpan" style={{ width: "80%" }}>
                <ModalFont />
              {dataSorcePre.diagnose}
            </span>
          </div>
          <div className="medicalDiv">
            {dataSorcePre.medicationDTOS.map((item, index) => {
              return (
                <div key={index} className="drugFlex">
                  {item.drugName ? (
                    <div className="drugFlex showFlex" key={index}>
                      <div>{item.drugName}</div>
                      <div>{item.dose}</div>
                      <div>
                        {item.frequency}x{item.days}
                      </div>
                      <div>{item.usage}</div>
                      <div>{item.eatStatus}</div>
                      <div>{item.note}</div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
          <div className="medicalDiv">
            {dataSorcePre.medicalAdviceCheckDTOS.map((item, index) => {
              return (
                <div key={index} className="drugFlex">
                  {item.inspectionItem ? (
                    <div className="drugFlex showFlex" key={index}>
                      <div>{item.inspectionItem}</div>
                      <div>{item.entrustment}</div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
          <div className="medicalDiv">
            {dataSorcePre.comprehensiveTreatmentDTOS.map((item, index) => {
              return (
                <div key={index} className="drugFlex">
                  {item.treatmentProject ? (
                    <div className="drugFlex showFlex" key={index}>
                      <div>{item.treatmentProject}</div>
                      <div>{item.note}</div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
          <div className="floatDiv">{dataSorcePre.doctor}</div>
          <div className="floatDiv">{dataSorcePre.date}</div>
        </div>
      </>
    )
  }
}
