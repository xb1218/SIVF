import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import apis from "@/app/utils/apis.js"
import { Checkbox, Row, Col } from "antd"
import styled from "styled-components"

const ModalDiv = styled.div`
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
`

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      patientInfoMan: [], //男患者信息
      patientInfoWoman: [], //女患者信息
      patientMan: [], //男患者选择的特殊标记
      patientWoman: [], //女患者选择的特殊标记
    }
  }
  componentDidMount() {
    this.setState({
      patientMan: this.props.patientData.maleTips,
      patientWoman: this.props.patientData.femaleTips,
    })
    this.getMarkData()
    this.setParams()
  }
  //构建patientParam参数
  setParams = () => {
    let { getDataMark } = this.props
    let femalePatient = JSON.parse(localStorage.getItem("femalePatient"))
    let malePatient = JSON.parse(localStorage.getItem("malePatient"))
    this.props.moredetail.patientParams = {
      patientPid:
        getDataMark === "326"
          ? malePatient.patientPid
          : femalePatient.patientPid,
      patientSex: getDataMark === "326" ? 0 : 1,
      spousePid:
        getDataMark === "326"
          ? femalePatient.patientPid
          : malePatient.patientPid,
      date: getDataMark === "326" ? malePatient.date : femalePatient.date,
      cycleNumber:
        getDataMark === "326"
          ? malePatient.cycleNumber
          : femalePatient.cycleNumber,
      treatStage:
        getDataMark === "326"
          ? malePatient.treatStage
          : femalePatient.treatStage,
      reservationUid:
        getDataMark === "326"
          ? malePatient.reservationUid
          : femalePatient.reservationUid,
      place: getDataMark === "326" ? malePatient.place : femalePatient.place,
      visitRoom:
        getDataMark === "326" ? malePatient.visitRoom : femalePatient.visitRoom,
    }
  }
  //获取所有特殊标记
  getMarkData = () => {
    let { patientCard } = this.props.store
    this.props.moredetail.patientMan = patientCard.maleTips
    this.props.moredetail.patientWoman = patientCard.femaleTips
    apis.WorkBench.getMarkData().then((res) => {
      if (res.code === 200) {
        res.data.forEach((element) => {
          if (element.itemCod === "326") {
            this.setState({
              patientInfoMan: element.ontopts,
            })
          } else {
            this.setState({
              patientInfoWoman: element.ontopts,
            })
          }
        })
      }
    })
  }
  render() {
    let { getDataMark } = this.props
    const {
      patientInfoMan,
      patientInfoWoman,
      patientWoman,
      patientMan,
    } = this.state
    const onChangeMan = (checkedValues) => {
      this.setState({
        patientMan: checkedValues,
      })
      this.props.moredetail.specialTipsMan = checkedValues
    }
    const onChangeWoman = (checkedValues) => {
      this.setState({
        patientWoman: checkedValues,
      })
      this.props.moredetail.specialTipsWoman = checkedValues
    }
    return (
      <div>
        {getDataMark === "326" ? (
          <Checkbox.Group
            style={{ width: "100%" }}
            onChange={onChangeMan}
            value={patientMan}
          >
            <ModalDiv>
              <Row>
                {patientInfoMan.map((item) => {
                  return (
                    <Col span={12} key={item.optVal}>
                      <Checkbox value={item.optVal}>{item.optVal}</Checkbox>
                    </Col>
                  )
                })}
              </Row>
            </ModalDiv>
          </Checkbox.Group>
        ) : (
          <Checkbox.Group
            style={{ width: "100%" }}
            onChange={onChangeWoman}
            value={patientWoman}
          >
            <ModalDiv>
              <Row>
                {patientInfoWoman.map((item) => {
                  return (
                    <Col span={12} key={item.optVal}>
                      <Checkbox value={item.optVal}>{item.optVal}</Checkbox>
                    </Col>
                  )
                })}
              </Row>
            </ModalDiv>
          </Checkbox.Group>
        )}
      </div>
    )
  }
}
