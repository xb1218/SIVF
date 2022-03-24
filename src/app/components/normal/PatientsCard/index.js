import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import styled from "styled-components"
import { Tag, Select, Button, Row } from "antd"
import { Timeline } from "antd"
import { BaseDrawer } from "@/app/components/base/baseDrawer"
import { DateTitleView } from "@/app/components/normal/Title"
import { DashBtn } from "@/app/components/base/baseBtn"
import PatientsInfo from "@/app/components/normal/PatientsInfo"
import ModalMark from "@/app/components/normal/ModalMark"
import Tips from "@/app/components/normal/Tips"
import apis from "@/app/utils/apis.js"
import { BaseModal } from "@/app/components/base/baseModal"

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
  width: 100%;
  justify-content: center;
  align-items: center;
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
const cycleTypeMap = new Map([
  ["新鲜", "IVF周期"],
  ["复苏", "FET周期"],
  ["新鲜+复苏", "IVF+FET周期"],
  ["AIH", "AIH"],
  ["AID", "AID"],
])
export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false, //基本信息详情弹窗
      historyVisible: false, //就诊履历弹窗
      visibleMark: false, //特殊标记弹窗
      statusMark: false, //特殊标记（男女）
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.judgeGetBaseInfo()
  }
  // 调用哪个页面的基本信息
  judgeGetBaseInfo = () => {
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
    } else if (this.props.name === "moreDetail") {
      this.props.store.initCard("patient")
    }
  }
  // 入组多选
  leaveFuc = (value) => {
    let { patientSex, patientCard } = this.props.store
    if (parseInt(patientSex)) {
      patientCard.femaleEnterGroup = value
    } else {
      patientCard.maleEnterGroup = value
    }
    this.getGroup(value)
  }
  // 入组保存后台接口
  getGroup = (value) => {
    let { select_one } = this.props.store
    let data = {
      enterGroups: value,
      ...select_one,
    }
    apis.Patients_info.patientGroup(data).then((res) => {})
  }
  getDetail = () => {
    this.setState({
      visible: true,
    })
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
  closeDrawer = () => {
    this.setState({
      visible: false,
    })
    //关闭弹窗时，保存基本信息
    this.PatientsInfo.saveInfo(true)
  }
  //保存特殊标记
  saveMarkData = () => {
    let params = {
      patientParam: this.props.moredetail.patientParams,
      sex: this.props.moredetail.patientParams.patientSex,
      specialTips: this.state.statusMark
        ? this.props.moredetail.specialTipsMan
        : this.props.moredetail.specialTipsWoman,
    }
    apis.Patients_info.saveMarkData(params).then((res) => {
      if (res.code === 200) {
        this.setState({
          visibleMark: false,
        })
        this.props.store.initCard("patient")
      }
    })
  }
  render() {
    let { name, femalePerson, malePerson } = this.props
    const {
      patientCard,
      checkArrisEmpty,
      patientSex,
      followHistory,
      cycleType,
    } = this.props.store
    const pageType = this.props.page
    const detailType = this.props.type
    const { visible, historyVisible, visibleMark, statusMark } = this.state
    let tagstyle = [
      { text: "初", color: "#59B4F4", val: 0 },
      { text: "复", color: "#FF9797", val: 1 },
      { text: "IVF", color: "#FFC75F", val: 2 },
      { text: "IUI", color: "#B1ADFF", val: 3 },
      { text: "FET", color: "#63D6E2", val: 4 },
      { text: "I+F", color: "#FE89B4", val: 5 },
      { text: "自", color: "#F8FAFB", val: 6 },
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
                    {name && name === "frozen" ? null : (
                      <Select
                        showArrow
                        placeholder="入组"
                        defaultValue={patientCard.femaleEnterGroup || []}
                        value={patientCard.femaleEnterGroup || []}
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
                        disabled={
                          patientCard.treatStage === 0 ||
                          patientCard.treatStage === 1
                            ? true
                            : false
                        }
                        defaultValue={patientCard.maleEnterGroup || []}
                        value={patientCard.maleEnterGroup || []}
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
            {patientSex ? (
              <>
                <div style={{ flex: 0.8 }}>
                  <svg
                    aria-hidden="true"
                    className="icon_base"
                    style={{ marginLeft: "10px" }}
                  >
                    <use xlinkHref="#iconnvhuanzhemorentouxiang"></use>
                  </svg>
                </div>
                <div style={{ flex: 11.2 }}>
                  <InfoLine>
                    <div style={{ flex: 1.2 }}>
                      <span>{patientCard.femalePatientName}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      {patientCard.femaleAge
                        ? patientCard.femaleAge + "岁"
                        : null}
                    </div>
                    <div style={{ flex: 5 }}>
                      证件:{patientCard.femaleIdNumber}
                    </div>
                    <div style={{ flex: 4 }}>
                      电话:{patientCard.femalePhone}
                      <svg
                        aria-hidden="true"
                        className="icon_base_patient"
                        style={{ marginLeft: "10px" }}
                        onClick={() =>
                          this.setState({
                            visibleMark: true,
                            statusMark: false,
                          })
                        }
                      >
                        <use xlinkHref="#iconteshubiaoji"></use>
                      </svg>
                    </div>
                  </InfoLine>
                  {name ? null : (
                    <Tips
                      positiveTag={patientCard.femalePositiveTag}
                      tips={patientCard.femaleTips}
                    />
                  )}
                </div>
                <div style={{ flex: 0.8 }}>
                  <svg aria-hidden="true" className="icon_base">
                    <use xlinkHref="#iconnanhuanzhemorentouxiang"></use>
                  </svg>
                </div>
                <div style={{ flex: 11.2 }}>
                  <InfoLine>
                    <div style={{ flex: 1.2 }}>
                      <span>{patientCard.malePatientName}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      {patientCard.maleAge ? patientCard.maleAge + "岁" : null}
                    </div>
                    <div style={{ flex: 5 }}>
                      证件:{patientCard.maleIdNumber}
                    </div>
                    <div style={{ flex: 4 }}>
                      电话:{patientCard.malePhone}
                      <svg
                        aria-hidden="true"
                        className="icon_base_patient"
                        style={{ marginLeft: "10px" }}
                        onClick={() =>
                          this.setState({ visibleMark: true, statusMark: true })
                        }
                      >
                        <use xlinkHref="#iconteshubiaoji"></use>
                      </svg>
                    </div>
                  </InfoLine>
                  {name ? null : (
                    <Tips
                      positiveTag={patientCard.malePositiveTag}
                      tips={patientCard.maleTips}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <div style={{ flex: 0.8 }}>
                  <svg
                    aria-hidden="true"
                    className="icon_base"
                    style={{ marginLeft: "10px" }}
                  >
                    <use xlinkHref="#iconnanhuanzhemorentouxiang"></use>
                  </svg>
                </div>
                <div style={{ flex: 11.2 }}>
                  <InfoLine>
                    <div style={{ flex: 1.2 }}>
                      <span>{patientCard.malePatientName}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      {patientCard.maleAge ? patientCard.maleAge + "岁" : null}
                    </div>
                    <div style={{ flex: 5 }}>
                      证件:{patientCard.maleIdNumber}
                    </div>
                    <div style={{ flex: 4 }}>
                      电话:{patientCard.malePhone}
                      <svg
                        aria-hidden="true"
                        className="icon_base_patient"
                        style={{ marginLeft: "10px" }}
                        onClick={() =>
                          this.setState({ visibleMark: true, statusMark: true })
                        }
                      >
                        <use xlinkHref="#iconteshubiaoji"></use>
                      </svg>
                    </div>
                  </InfoLine>
                  {name ? null : (
                    <Tips
                      positiveTag={patientCard.malePositiveTag}
                      tips={patientCard.maleTips}
                    />
                  )}
                </div>
                <div style={{ flex: 0.8 }}>
                  <svg aria-hidden="true" className="icon_base">
                    <use xlinkHref="#iconnvhuanzhemorentouxiang"></use>
                  </svg>
                </div>
                <div style={{ flex: 11.2 }}>
                  <InfoLine>
                    <div style={{ flex: 1.2 }}>
                      <span>{patientCard.femalePatientName}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      {patientCard.femaleAge
                        ? patientCard.femaleAge + "岁"
                        : null}
                    </div>
                    <div style={{ flex: 5 }}>
                      证件:{patientCard.femaleIdNumber}
                    </div>
                    <div style={{ flex: 4 }}>
                      电话:{patientCard.femalePhone}
                      <svg
                        aria-hidden="true"
                        className="icon_base_patient"
                        style={{ marginLeft: "10px" }}
                        onClick={() =>
                          this.setState({
                            visibleMark: true,
                            statusMark: false,
                          })
                        }
                      >
                        <use xlinkHref="#iconteshubiaoji"></use>
                      </svg>
                    </div>
                  </InfoLine>
                  {name ? null : (
                    <Tips
                      positiveTag={patientCard.femalePositiveTag}
                      tips={patientCard.femaleTips}
                    />
                  )}
                </div>
              </>
            )}
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
              <span>提示：</span>
              {patientCard.femaleAllergyHistory
                ? `${patientCard.femalePatientName}${patientCard.femaleAllergyHistory}` +
                  "，"
                : null}
              {patientCard.maleAllergyHistory
                ? `${patientCard.malePatientName}${patientCard.maleAllergyHistory}`
                : null}
              {/* 过敏史 */}
            </small>
          </Allergic>
        ) : null}
        <BaseDrawer
          visible={visible}
          onclose={this.closeDrawer}
          width={980}
          bodyStyle={{ padding: "10px 8px 0 0" }}
          closable={false}
          placement="right"
        >
          <PatientsInfo
            name={name}
            femalePerson={femalePerson}
            malePerson={malePerson}
            sex={patientSex}
            close={() => {
              this.setState({
                visible: false,
              })
            }}
            open={() => {
              this.setState({
                visible: true,
              })
            }}
            onRef={(ref) => {
              this.PatientsInfo = ref
            }}
          />
        </BaseDrawer>
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
                {cycleTypeMap.get(cycleType)}
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
        <BaseModal
          title={statusMark ? "男方病情" : "女方病情"}
          width="500px"
          closable={false}
          visible={visibleMark}
          destroyOnClose
          footer={[
            <Button onClick={() => this.setState({ visibleMark: false })}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={this.saveMarkData}>
              保存
            </Button>,
          ]}
        >
          {visibleMark ? (
            <ModalMark
              getDataMark={statusMark ? "326" : "327"}
              patientData={patientCard}
            />
          ) : null}
        </BaseModal>
      </div>
    )
  }
}
