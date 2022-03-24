import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { DatePicker, message } from "antd"
import moment from "moment"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { HospitalTitle } from "@/app/components/base/baseDiv.js"
import apis from "@/app/utils/apis"

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super()
    this.state = {
      naturalCycleData: {
        uid: null,
        artMethod: null,
        endTag: null,
        cycleOrder: null,
        medicalRecordNum: null,
        femaleName: null,
        femaleAge: null,
        femaleHeight: null,
        femaleWeight: null,
        femaleBmi: null,
        femaleAmh: null,
        lmp: null,
      },
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.getCycle()
  }
  // 获取周期信息
  getCycle = () => {
    let { select_one } = this.props.store
    let { name, naturalObj } = this.props
    apis.NaturalMonitor.getNatureCycle(
      naturalObj && name === "clinic" ? naturalObj : select_one
    ).then((res) => {
      if (res.code === 200) {
        this.setState({
          naturalCycleData: res.data,
        })
        if (name === "mointor") {
          this.props.getUid(res.data.uid)
          this.props.checkLmp(res.data.lmp)
        }
      }
    })
  }
  // 修改lmp
  changeLmp = (datestring) => {
    let { naturalCycleData } = this.state
    let { name } = this.props
    naturalCycleData.lmp = datestring
    if (name === "mointor") {
      this.changeLmpDate(datestring)
    }
    this.setState({
      naturalCycleData,
    })
  }
  // 修改lmp的后台接口
  changeLmpDate = (date) => {
    let { naturalCycleData } = this.state
    let { name } = this.props
    let data = {
      uid: naturalCycleData.uid,
      lmp: date,
    }
    apis.NaturalMonitor.putLmp(data).then((res) => {
      if (res.code === 200) {
        if (name === "mointor") {
          this.props.checkLmp(date)
        }
        message.success("末次月经修改成功")
      }
    })
  }
  render() {
    let { naturalCycleData } = this.state
    let { name } = this.props
    return (
      <>
        <HospitalTitle>
          <div>
            {naturalCycleData.artMethod} 治疗监测记录 第（
            {naturalCycleData.cycleOrder}）周期
          </div>
          <div>
            <span>病历号</span>
            <span className="span_underline">
              {naturalCycleData.medicalRecordNum}
            </span>
          </div>
        </HospitalTitle>
        <FlexItem id="flexDivItem">
          <div>
            女方
            <span className="span_underline" style={{ width: "70px" }}>
              {naturalCycleData.femaleName}
            </span>
          </div>
          <div>
            <span className="span_underline" style={{ width: "20px" }}>
              {naturalCycleData.femaleAge}
            </span>
            岁
          </div>
          <div>
            身高
            <span className="span_underline">
              {naturalCycleData.femaleHeight}
              {naturalCycleData.femaleHeight ? <span>cm</span> : null}
            </span>
          </div>
          <div>
            体重
            <span className="span_underline">
              {naturalCycleData.femaleWeight}
              {naturalCycleData.femaleHeight ? <span>kg</span> : null}
            </span>
          </div>
          <div>
            BMI
            <span className="span_underline">{naturalCycleData.femaleBmi}</span>
          </div>
          <div>
            AMH
            <span className="span_underline">{naturalCycleData.femaleAmh}</span>
          </div>
          <div>
            LMP
            <span>
              {name === "mointor" ? (
                <>
                  <DatePicker
                    style={{ width: 130 }}
                    allowClear={false}
                    value={
                      naturalCycleData.lmp
                        ? moment(naturalCycleData.lmp, "YYYY-MM-DD")
                        : null
                    }
                    onChange={(date, datestring) => {
                      this.changeLmp(datestring)
                    }}
                  />
                </>
              ) : (
                <span className="span_underline" style={{ width: "95px" }}>
                  {naturalCycleData.lmp}
                </span>
              )}
            </span>
          </div>
        </FlexItem>
      </>
    )
  }
}
