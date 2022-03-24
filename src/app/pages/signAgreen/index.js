import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { BaseDiv } from "@/app/components/base/baseSpan"
import BaseBread from "@/app/components/base/baseBread"
import { ArrowLeftOutlined } from "@ant-design/icons"
import Header from "@/app/components/common/Header"
import AgreenRecord from "@/app/components/normal/AgreenRecord"
import "./index.scss"
// import apis from "../../utils/apis"

export default
@inject("store", "moredetail", "inspection")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        {
          key: "操作液",
          value: "mops-p",
          haveKey: true,
          isCircle: false,
          type: "input",
        },
        {
          key: "",
          value: "mops-p",
          haveKey: false,
          isCircle: false,
          type: "input",
        },
        {
          key: "PVP",
          value: "Vitrolife+SSS 123",
          haveKey: true,
          isCircle: false,
          type: "input",
        },
        {
          key: "核",
          value: "王道催",
          haveKey: true,
          isCircle: true,
          type: "input",
        },
        {
          key: "核",
          value: "王道催",
          haveKey: true,
          isCircle: true,
          type: "input",
        },
        {
          key: "PVP",
          value: "Vitrolife+SSS 123",
          haveKey: true,
          isCircle: false,
          type: "input",
        },
      ],
    }
  }
  componentDidMount() {}
  changeTitleValue = (item, value) => {
    let { data } = this.state
    let datas = [...data]
    item.value = value
    this.setState({
      data: [...datas],
    })
  }
  render() {
    let { data } = this.state
    let patientCard = JSON.parse(localStorage.getItem("patientCard"))
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
            first="同意书"
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
                <AgreenRecord
                  data={data}
                  changeValue={(item, value) =>
                    this.changeTitleValue(item, value)
                  }
                />
              </BaseDiv>
            </div>
            <div className="rightMedical">
              <BaseDiv>
                <div className="rightAgreenCount">
                  <div className="rightTitleAgreen">
                    <svg className="icon_m">
                      <use xlinkHref="#iconsignature" />
                    </svg>
                    <div className="rightAgreenTitleFont">已签</div>
                  </div>
                </div>
              </BaseDiv>
            </div>
          </div>
        </div>
      </>
    )
  }
}
