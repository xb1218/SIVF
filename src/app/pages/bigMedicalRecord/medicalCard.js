import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { FlexItem } from "@/app/components/base/baseForms.js"
import "./index.scss"
import { Input, Radio } from "antd"

const { TextArea } = Input
export default
@inject("store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  handleChangeCard = (ref) => {
    this.props.click(ref)
  }
  // 修改主诉现病史
  setStaeData = (e, data, parm) => {
    this.props.updateComplainant(e, data, parm)
  }
  // 保存现病史
  save = () => {
    this.props.saveComplainant()
  }
  render() {
    let { sex, data } = this.props
    return (
      <>
        <div
          className="borderLeftMedical"
          onClick={() => this.handleChangeCard("basic")}
        >
          <svg className="icon_s svgMedical">
            <use xlinkHref={sex === 1 ? "#iconnv" : "#iconnan"}></use>
          </svg>
          <div className="flagMedical"></div>
          <span>基本信息</span>
        </div>
        <div className="borderLeftMedical marginLeftMedical">
          <div className="flagMedical"></div>
          <span>主诉</span>
          <span>
            <Input
              value={data.complainant}
              onChange={(e) => {
                this.setStaeData(e, data, "complainant")
              }}
              onBlur={this.save}
            />
          </span>
          <span style={{ paddingRight: "0px" }}>
            <Radio.Group
              onBlur={this.save}
              defaultValue={data.infertilityType}
              value={data.infertilityType}
              onChange={(e) => {
                this.setStaeData(e, data, "infertilityType")
              }}
            >
              <Radio value="继发">继发</Radio>
              <Radio value="原发">原发</Radio>
            </Radio.Group>
          </span>
        </div>
        <FlexItem>
          <div>
            <span>{sex ? "不孕" : "不育"}年限</span>
            <Input
              addonAfter="年"
              onBlur={this.save}
              defaultValue={data.infertilityYear}
              value={data.infertilityYear}
              onChange={(e) => {
                this.setStaeData(e, data, "infertilityYear")
              }}
            />
            <Input
              addonAfter="个月"
              onBlur={this.save}
              defaultValue={data.infertilityMonth}
              value={data.infertilityMonth}
              onChange={(e) => {
                this.setStaeData(e, data, "infertilityMonth")
              }}
            />
          </div>
        </FlexItem>
        <div className="borderLeftMedical  marginLeftMedical">
          <div className="flagMedical"></div>
          <span>现病史</span>
        </div>
        <div className=" marginLeftMedical">
          <TextArea
            rows={3}
            value={data.currentMedicalHistory}
            onChange={(e) => {
              this.setStaeData(e, data, "currentMedicalHistory")
            }}
            onBlur={this.save}
          />
        </div>
        <div
          className="borderLeftMedical  marginLeftMedical"
          onClick={() => this.handleChangeCard("history")}
        >
          <div className="flagMedical"></div>
          <span>病史</span>
        </div>
        <div
          className="borderLeftMedical  marginLeftMedical"
          onClick={() => this.handleChangeCard("inspect")}
        >
          <div className="flagMedical"></div>
          <span>检查检验</span>
        </div>
        <div
          className="borderLeftMedical  marginLeftMedical"
          onClick={() => this.handleChangeCard("diagnosis")}
        >
          <div className="flagMedical"></div>
          <span>周期诊断</span>
        </div>
      </>
    )
  }
}
