import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Radio, Divider, message } from "antd"
import { CheckCircleOutlined } from "@ant-design/icons"
import PanelTag from "@/app/components/normal/PanelTag"
import apis from "@/app/utils/apis"

export default
@inject("store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todayMedicalAdvices: [], //今日医嘱
      patientMedicalAdvices: [], //患者医嘱
      checkAdvice: 0, //选择的是今日医嘱还是患者医嘱
    }
  }
  // stageType,0是门诊，1是进周期
  componentDidMount() {
    this.initQuickAdvice()
  }
  // 快速导入医嘱接口
  initQuickAdvice = () => {
    let { select_one } = this.props.store
    apis.MedicalAdvice.quickAdvice(select_one).then((res) => {
      if (res.code === 200) {
        this.setState({
          todayMedicalAdvices: res.data.todayMedicalAdvices,
          patientMedicalAdvices: res.data.patientMedicalAdvices,
        })
      } else {
        message.error(res.message)
      }
    })
  }
  // 是今日医嘱还是患者医嘱
  changeValue = (e) => {
    this.setState({
      checkAdvice: e.target.value,
    })
  }
  // 选择医嘱快速导入
  checkedAdvice = (index, type) => {
    let { todayMedicalAdvices, patientMedicalAdvices } = this.state
    // type为0是今日医嘱，1为患者医嘱
    if (type) {
      this.checkMedical(patientMedicalAdvices, index)
    } else {
      this.checkMedical(todayMedicalAdvices, index)
    }
  }
  // 该去取哪边的数据
  checkMedical = (data, number) => {
    data.forEach((item, index) => {
      if (number === index) {
        this.props.medicalChecked(item)
      }
    })
  }
  render() {
    let { todayMedicalAdvices, patientMedicalAdvices, checkAdvice } = this.state
    return (
      <>
        <PanelTag title="导入医嘱" />
        <div id="quickCount">
          <Radio.Group
            defaultValue={0}
            buttonStyle="solid"
            size="small"
            value={checkAdvice}
            onChange={this.changeValue}
          >
            <Radio.Button value={0}>今日医嘱</Radio.Button>
            <Radio.Button value={1}>患者医嘱</Radio.Button>
          </Radio.Group>
          <div id="quickListDiv">
            {checkAdvice ? (
              <>
                {patientMedicalAdvices.map((item, index) => {
                  return (
                    <div key={index}>
                      <div className="quickItemTitle">
                        <div className="quickcycleFather">
                          <div className="quickCycle"></div>
                        </div>
                        <span className="quickDia">{item.saveDate}</span>
                        <div className="titleUnderLine"></div>
                        <div className="titleIcon">
                          <CheckCircleOutlined
                            className="iconColor"
                            onClick={() => this.checkedAdvice(index, 1)}
                          />
                        </div>
                      </div>
                      <div className="quickItem">
                        <div className="itemSpan">
                          {item.medicationDTOS.map((itemm, indexm) => {
                            return (
                              <div key={indexm}>
                                <span>
                                  {itemm.drugName}
                                  {itemm.specification ? (
                                    <>({itemm.specification})</>
                                  ) : null}
                                </span>
                                {indexm ===
                                item.medicationDTOS.length - 1 ? null : (
                                  <Divider
                                    type="vertical"
                                    className="dividerTop"
                                  ></Divider>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        <div className="itemSpan">
                          {item.medicalAdviceCheckDTOS.map((itemm, indexm) => {
                            return (
                              <div key={itemm + indexm}>
                                <span>{itemm.inspectionItem}</span>
                                {indexm ===
                                item.medicalAdviceCheckDTOS.length -
                                  1 ? null : (
                                  <Divider
                                    type="vertical"
                                    className="dividerTop"
                                  ></Divider>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        <div className="itemSpan">
                          {item.comprehensiveTreatmentDTOS.map(
                            (itemm, indexm) => {
                              return (
                                <div key={itemm + indexm}>
                                  <span>{itemm.treatmentProject}</span>
                                  {indexm ===
                                  item.comprehensiveTreatmentDTOS.length -
                                    1 ? null : (
                                    <Divider
                                      type="vertical"
                                      className="dividerTop"
                                    ></Divider>
                                  )}
                                </div>
                              )
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              <>
                {todayMedicalAdvices.map((item, index) => {
                  return (
                    <div key={item + index}>
                      <div className="quickItemTitle">
                        <div className="quickcycleFather">
                          <div className="quickCycle"></div>
                        </div>
                        <span className="quickDia">{item.diagnose}</span>
                        <div className="titleUnderLine"></div>
                        <div className="titleIcon">
                          <CheckCircleOutlined
                            className="iconColor"
                            onClick={() => this.checkedAdvice(index, 0)}
                          />
                        </div>
                      </div>
                      <div className="quickItem">
                        <div className="itemSpan">
                          {item.medicationDTOS.map((itemm, indexm) => {
                            return (
                              <div key={indexm + indexm}>
                                <span>
                                  {itemm.drugName}
                                  {itemm.specification ? (
                                    <>({itemm.specification})</>
                                  ) : null}
                                </span>
                                {indexm ===
                                item.medicationDTOS.length - 1 ? null : (
                                  <Divider
                                    type="vertical"
                                    className="dividerTop"
                                  ></Divider>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        <div className="itemSpan">
                          {item.medicalAdviceCheckDTOS.map((itemm, indexm) => {
                            return (
                              <div key={indexm + indexm}>
                                <span>{itemm.inspectionItem}</span>
                                {indexm ===
                                item.medicalAdviceCheckDTOS.length -
                                  1 ? null : (
                                  <Divider
                                    type="vertical"
                                    className="dividerTop"
                                  ></Divider>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        <div className="itemSpan">
                          {item.comprehensiveTreatmentDTOS.map(
                            (itemm, indexm) => {
                              return (
                                <div key={indexm + indexm}>
                                  <span>{itemm.treatmentProject}</span>
                                  {indexm ===
                                  item.comprehensiveTreatmentDTOS.length -
                                    1 ? null : (
                                    <Divider
                                      type="vertical"
                                      className="dividerTop"
                                    ></Divider>
                                  )}
                                </div>
                              )
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </>
    )
  }
}
