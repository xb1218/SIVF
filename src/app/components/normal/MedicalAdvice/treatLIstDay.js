//当天治疗单(进周期)
import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import PrintView from "@/app/components/normal/printView"
import "./index.scss"

export default
@inject("moredetail")
@observer
class index extends Component {
  constructor() {
    super()
    this.state = {
      dataSorceTreatList: {
        name: "",
        medicalRecordNum: "",
        age: "",
        treatmentMethod: "",
        doctor: "",
        date: "",
        medicationDTOS: [],
        medicalAdviceCheckDTOS: [],
        comprehensiveTreatmentDTOS: [],
      },
    }
  }
  componentDidMount() {
    let { dataSourceTreatmentSheet } = this.props
    this.setState({
      dataSorceTreatList: dataSourceTreatmentSheet,
    })
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.dataSourceTreatmentSheet !== this.props.dataSourceTreatmentSheet
    ) {
      this.setState({
        dataSorceTreatList: nextProps.dataSourceTreatmentSheet,
      })
    }
  }

  render() {
    let { dataSorceTreatList } = this.state
    const ModalFont = () => {
      return <span className="modalFont">.</span>
    }
    return (
      <PrintView>
        <div>
          <p className="titleP">治疗单</p>
          <div className="titleMedical">
            <div>
              女方：
              <span className="underLineSpan">
                {dataSorceTreatList.patientName}
              </span>
            </div>
            <div>
              病历号：
              <span className="underLineSpan">
                <ModalFont />
                {dataSorceTreatList.medicalRecordNum}
              </span>
            </div>
            <div>
              年龄：
              <span className="underLineSpan">
                <ModalFont />
                {dataSorceTreatList.patientAge}岁
              </span>
            </div>
            <div>
              治疗方式：
              <span className="underLineSpan">
                <ModalFont />
                {dataSorceTreatList.treatmentMethod}
              </span>
            </div>
          </div>
          <div id="treatMent">
            <div className="treatMentDiv">
              {dataSorceTreatList.medicationDTOS.map((item, index) => {
                return (
                  <div key={index}>
                    {item.drugName ? (
                      <div className="treatMentItem" key={index}>
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
            <div className="treatMentDiv">
              {dataSorceTreatList.medicalAdviceCheckDTOS.map((item, index) => {
                return (
                  <div key={index}>
                    {item.inspectionItem ? (
                      <div className="treatMentItem" key={index}>
                        <div style={{ width: "27.5%" }}>
                          {item.inspectionItem}
                        </div>
                        <div style={{ width: "55%" }}>{item.entrustment}</div>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
            <div className="treatMentDiv">
              {dataSorceTreatList.comprehensiveTreatmentDTOS.map(
                (item, index) => {
                  return (
                    <div key={index}>
                      {item.treatmentProject ? (
                        <div className="treatMentItem" key={index}>
                          <div style={{ width: "27.5%" }}>
                            {item.treatmentProject}
                          </div>
                          <div style={{ width: "55%" }}>{item.note}</div>
                        </div>
                      ) : null}
                    </div>
                  )
                }
              )}
            </div>
          </div>
          <div className="floatDiv">{dataSorceTreatList.doctor}</div>
          <div className="floatDiv">{dataSorceTreatList.date}</div>
        </div>
      </PrintView>
    )
  }
}
