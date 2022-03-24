import React, { Component } from "react"

import { ArrowLeftOutlined } from "@ant-design/icons"
import { BaseDiv } from "@/app/components/base/baseSpan"
import PatientsCard from "@/app/components/normal/PatientsCard"
import Detail from "./Detail"
import "./index.scss"
import { inject, observer } from "mobx-react"
import moment from "moment"
import "moment/locale/zh-cn"

moment.locale("zh-cn")
export default
@inject("follow")
@observer
class index extends Component {
  render() {
    const followPatientData = JSON.parse(localStorage.getItem("followrecord"))
    const malePerson = {
      maleAge: followPatientData.maleAge,
      maleIdNumber: followPatientData.maleIdNum,
      malePatientName: followPatientData.maleName,
      malePhone: followPatientData.malePhone,
      malePid: followPatientData.spousePid,
    }
    const femalePerson = {
      femaleAge: followPatientData.femaleAge,
      femaleIdNumber: followPatientData.femaleIdNum,
      femalePatientName: followPatientData.femaleName,
      femalePhone: followPatientData.femalePhone,
      femalePid: followPatientData.pid,
    }

    return (
      <div className="contentWrap followDetail">
        <div
          style={{ padding: 10, alignItems: "center" }}
          onClick={() => this.props.history.push("/public/follow/followList")}
        >
          <ArrowLeftOutlined />
          &nbsp;&nbsp;&nbsp;随访
        </div>
        <BaseDiv>
          <PatientsCard
            name="follow"
            malePerson={malePerson}
            femalePerson={femalePerson}
          />
        </BaseDiv>
        <Detail />
      </div>
    )
  }
}
