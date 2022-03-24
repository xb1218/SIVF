import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { observable } from "mobx"
import styled from "styled-components"
import { Tag, Select, Button, Row } from "antd"
import BaseInfo from "@/app/pages/patients/patientmoreDetail/patientscard/baseInfo"
import { Timeline } from "antd"
import { BaseDrawer } from "@/app/components/base/baseDrawer"
import { DateTitleView } from "@/app/components/normal/Title"
import { DashBtn } from "@/app/components/base/baseBtn"
const { Option } = Select

const PatientContent = styled.div`
  background: #fff;
  border-radius: 2px;
  padding-bottom: 5px;
`
const BaseTitle = styled.div`
  height: 40px;
  line-height: 40px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .leftborder {
    vertical-align: middle;
    display: inline-block;
    margin: 0 10px;
    width: 2px;
    height: 14px;
    background-color: #59b4f4;
  }
  .rightmargin {
    margin-right: 10px;
  }
`
const InfoLine = styled.div`
  display: flex;
  height: 30px;
  width: 50%;
  justify-content: center;
  align-items: center;
  .icon_base {
    width: 1.5em;
    height: 1.5em;
    margin: 0 10px 0 20px;
    vertical-align: middle;
  }
`
const Allergic = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border-radius: 0px 0px 5px 5px;
  height: 20px;
  line-height: 20px;
  color: red;
  .icon_warnging {
    width: 1em;
    height: 1em;
    margin: 0 10px 0 22px;
    vertical-align: middle;
  }
`

const Btn = styled(DashBtn)`
  line-height: 24px;
  height: 24px;
`

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  @observable group = []
  constructor(props) {
    super(props)
    this.state = {
      visible: false, //基本信息详情弹窗
      historyVisible: false, //就诊履历弹窗
    }
  }
  componentDidMount() {
    if (this.props.name === "frozen") {
      this.props.store.initCard(
        "frozen",
        this.props.femalePerson,
        this.props.malePerson
      )
    } else if (this.props.name === "follow") {
      this.props.store.initCard(
        "follow",
        this.props.femalePerson,
        this.props.malePerson
      )
    } else {
      this.props.store.initCard("patient")
    }
  }
  // 入组多选
  leaveFuc = (value) => {
    this.group = value
  }
  getDetail = () => {
    this.setState({
      visible: true,
    })
    if (this.props.name === "frozen" || this.props.name === "follow") {
      let { femalePerson, malePerson } = this.props
      let patientParam = {
        patientPid: femalePerson.femalePid,
        patientSex: 1,
      }
      let patientParam2 = {
        patientPid: malePerson.malePid,
        patientSex: 0,
      }
      this.BaseInfo.getInfos(patientParam, patientParam2)
    } else {
      this.BaseInfo.getInfos()
    }
  }
  getFollowHistory = () => {
    const { getFollowHistory } = this.props.store
    const { cycleNumber, pid } = JSON.parse(
      localStorage.getItem("followrecord")
    )
    getFollowHistory({ cycleNumber, femalePid: pid })
    this.setState({
      historyVisible: true,
    })
  }
  openDrawer = () => {
    this.setState({
      visible: true,
    })
  }
  closeDrawer = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    let { name } = this.props
    const {
      patientCard,
      checkArrisEmpty,
      patientSex,
      followHistory,
    } = this.props.store
    const pageType = this.props.page
    const detailType = this.props.type
    const { visible, historyVisible } = this.state
    let tagstyle = [
      { text: "初", color: "#59B4F4", val: 0 },
      { text: "复", color: "#FF9797", val: 1 },
      { text: "IVF", color: "#FFC75F", val: 2 },
      { text: "IUI", color: "#B1ADFF", val: 3 },
      { text: "FET", color: "#63D6E2", val: 4 },
    ]
    return (
      <div>
        <PatientContent>
          <BaseTitle>
            <div>
              <div className="leftborder" />
              <span className="rightmargin">基本信息</span>
              {pageType === "patient"
                ? tagstyle.map((item, index) => {
                    return item.val === parseFloat(patientCard.treatStage) ? (
                      <Tag key={index} color={item.color}>
                        {item.text}
                      </Tag>
                    ) : null
                  })
                : null}
            </div>
            {name !== "follow" && (
              <div>
                {parseInt(patientSex) ? (
                  <>
                    {!checkArrisEmpty(patientCard.femaleEnterGroup)
                      ? patientCard.femaleEnterGroup.map((item, index) => {
                          return (
                            // <Tag key={index} color="orange">
                            //   {item}
                            // </Tag>
                            <span>222</span>
                          )
                        })
                      : null}
                    {name && name === "frozen" ? null : (
                      <Select
                        showArrow
                        placeholder="入组"
                        defaultValue={patientCard.femaleEnterGroup || []}
                        size="small"
                        mode="tags"
                        style={{ width: 270 }}
                        onChange={this.leaveFuc}
                        className="rightmargin"
                      >
                        <Option value="PCOS">PCOS</Option>
                        <Option value="POI"> POI</Option>
                        <Option value="围绝经期">围绝经期</Option>
                      </Select>
                    )}
                  </>
                ) : (
                  <>
                    {!checkArrisEmpty(patientCard.maleEnterGroup)
                      ? patientCard.maleEnterGroup.forEach((item, index) => {
                          return (
                            <Tag key={index} color="orange">
                              {item}
                            </Tag>
                          )
                        })
                      : null}
                    {name && name === "frozen" ? null : (
                      <Select
                        showArrow
                        placeholder="入组"
                        defaultValue={patientCard.maleEnterGroup || []}
                        size="small"
                        mode="tags"
                        style={{ width: 270 }}
                        onChange={this.leaveFuc}
                        className="rightmargin"
                      >
                        <Option value="PCOS">PCOS</Option>
                        <Option value="POI"> POI</Option>
                        <Option value="围绝经期">围绝经期</Option>
                      </Select>
                    )}
                  </>
                )}
                {/* 更多患者不显示详情 */}
                {detailType !== "更多患者" ? (
                  <Button
                    size="small"
                    type="primary"
                    className="rightmargin"
                    onClick={this.getDetail}
                  >
                    详情
                  </Button>
                ) : null}
              </div>
            )}

            {name === "follow" && (
              <div>
                <Btn onClick={this.getFollowHistory}>随访履历</Btn>
                <Button
                  size="small"
                  type="primary"
                  className="rightmargin"
                  onClick={this.getDetail}
                >
                  详情
                </Button>
              </div>
            )}
          </BaseTitle>
          <div style={{ display: "flex" }}>
            <InfoLine>
              <div style={{ flex: 3 }}>
                <svg aria-hidden="true" className="icon_base">
                  <use xlinkHref="#iconnvhuanzhemorentouxiang"></use>
                </svg>
                <span>
                  女方:
                  {patientCard.femalePatientName}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                {patientCard.femaleAge ? patientCard.femaleAge + "岁" : null}
              </div>
              <div style={{ flex: 4 }}>证件:{patientCard.femaleIdNumber}</div>
              <div style={{ flex: 3 }}>电话:{patientCard.femalePhone}</div>
            </InfoLine>

            <InfoLine>
              <div style={{ flex: 3 }}>
                <svg aria-hidden="true" className="icon_base">
                  <use xlinkHref="#iconnanhuanzhemorentouxiang"></use>
                </svg>
                <span>
                  男方:
                  {patientCard.malePatientName}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                {patientCard.maleAge ? patientCard.maleAge + "岁" : null}
              </div>
              <div style={{ flex: 4 }}>证件:{patientCard.maleIdNumber}</div>
              <div style={{ flex: 3 }}>电话:{patientCard.malePhone}</div>
            </InfoLine>
          </div>
        </PatientContent>
        {pageType === "patient" &&
        (patientCard.maleAllergyHistory || patientCard.femaleAllergyHistory) ? (
          <Allergic>
            <svg className="icon_warnging" aria-hidden="true">
              <use xlinkHref="#iconzhuyi"></use>
            </svg>
            <small>
              {/* 该病人有 */}
              {patientCard.maleAllergyHistory ||
                "" + patientCard.femaleAllergyHistory ||
                ""}
              {/* 过敏史 */}
            </small>
          </Allergic>
        ) : null}

        <BaseInfo
          infoState={visible}
          close={this.closeDrawer}
          open={this.openDrawer}
          onRef={(ref) => {
            this.BaseInfo = ref
          }}
        />

        <BaseDrawer
          visible={historyVisible}
          onclose={() =>
            this.setState({
              historyVisible: false,
            })
          }
          width={280}
          bodyStyle={{ padding: "10px 8px 0 0" }}
          closable={false}
          placement="right"
        >
          <DateTitleView title={`随访履历`}>
            <Timeline>
              <Row
                type="flex"
                align="middle"
                style={{ marginBottom: 12, color: "#59b4f4" }}
              >
                IVF周期
              </Row>
              {followHistory.map((item, index) => {
                return (
                  <Timeline.Item key={index}>
                    <Row type="flex" align="middle">
                      <div>{item.stage}</div>
                      <div>{item.followDate}</div>
                    </Row>
                  </Timeline.Item>
                )
              })}
            </Timeline>
          </DateTitleView>
        </BaseDrawer>
      </div>
    )
  }
}
