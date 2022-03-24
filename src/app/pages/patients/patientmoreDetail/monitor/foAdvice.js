import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { FlexBetween, FloatDiv } from "@/app/components/base/baseDiv"
import { HospitalTitle } from "@/app/components/base/baseDiv.js"
import { BaseDrawer } from "@/app/components/base/baseDrawer.js"
import PrintViewCard from "@/app/components/normal/printView.js"
import FoPlane from "./foPlane" //监测情况-方案
import { Timeline } from "antd"
import apis from "@/app/utils/apis"
import "./index.scss"

//医嘱用药公用
export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false, //抽屉控制
      cycleList: null, //周期信息
      cycFlag: false,
      planList: null,
      editeFlag: false, //方案状态
      actList: null,
    }
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    let { select_one, resumePeople } = this.props.store
    let select = JSON.parse(localStorage.getItem("patient"))
    this.getCycle(resumePeople ? select : select_one)
    this.getAct(resumePeople ? select : select_one)
  }
  //获取周期信息
  getCycle = (data) => {
    let { setCurrentName } = this.props
    let { select_one } = this.props.store
    apis.Patients_monitor.getCycle(data ? data : select_one).then((res) => {
      if (res.code === 200) {
        setCurrentName(res.data.femaleName)
        this.setState({
          cycleList: res.data,
          cycFlag: true,
        })
      }
    })
  }
  //获取启动情况信息
  getAct = (data) => {
    let { select_one } = this.props.store
    apis.Patients_monitor.getActInit(data ? data : select_one).then((res) => {
      this.setState({
        actList: res.data,
      })
    })
  }
  //data
  reviseData = (data) => {
    this.FoPlane && this.FoPlane.planData(data)
  }
  //启动情况render
  actRender = (data) => {
    return (
      <Timeline>
        <Timeline.Item>
          <div className="titleItem">降调：{data.deregulationDate}</div>
          <div className="spanItem">
            {data.deregulationMedicines.map((o, i) => {
              return (
                <span key={i}>
                  {o}
                  <span style={{ padding: "0 5px" }}>|</span>
                </span>
              )
            })}
          </div>
        </Timeline.Item>
        <Timeline.Item>
          <div className="titleItem">GN：{data.gnDate}</div>
          <div className="spanItem">
            {data.gnMedicines.map((o, i) => {
              return (
                <span key={i}>
                  {o}
                  <span style={{ padding: "0 5px" }}>|</span>
                </span>
              )
            })}
          </div>
          <div className="spanItem">
            {data.gnBloods.map((itemblood, i) => {
              return (
                <div>
                  {itemblood.map((o, index) => {
                    return (
                      <span key={i}>
                        {o}
                        <span style={{ padding: "0 5px" }}>|</span>
                      </span>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </Timeline.Item>
        <Timeline.Item>
          <div className="titleItem">拮抗：{data.antagonisticDate}</div>
          <div className="spanItem">
            {data.antagonisticMedicines.map((o, i) => {
              return (
                <span key={i}>
                  {o}
                  <span style={{ padding: "0 5px" }}>|</span>
                </span>
              )
            })}
          </div>
          <div className="spanItem">
            {data.antagonisticBloods.map((itemblood, i) => {
              return (
                <div>
                  {itemblood.map((o, index) => {
                    return (
                      <span key={i}>
                        {o}
                        <span style={{ padding: "0 5px" }}>|</span>
                      </span>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </Timeline.Item>
      </Timeline>
    )
  }
  // 加载子组件中的初始化
  initPage = (data) => {
    if (this.FoPlane) {
      this.FoPlane.getPlan(data)
    }
  }
  render() {
    const { visible, cycleList, cycFlag, actList } = this.state
    return (
      <>
        {cycFlag ? (
          <PrintViewCard>
            <HospitalTitle>
              <div>
                {cycleList.artMethod} 治疗监测记录 第（
                {cycleList.cycleOrder}）周期
              </div>
              <div>
                <span>病历号</span>
                <span className="span_underline">
                  {cycleList.medicalRecordNum}
                </span>
              </div>
            </HospitalTitle>
            <FlexBetween>
              <div>
                女方
                <span className="span_underline" style={{ width: "70px" }}>
                  {cycleList.femaleName}
                </span>
              </div>
              <div>
                <span className="span_underline">{cycleList.femaleAge}</span>岁
              </div>
              <div>
                男方
                <span className="span_underline" style={{ width: "70px" }}>
                  {cycleList.maleName}
                </span>
              </div>
              <div>
                <span className="span_underline">{cycleList.maleAge}</span>岁
              </div>
              <div>
                身高
                <span className="span_underline">{cycleList.height}</span>
              </div>
              <div>
                体重
                <span className="span_underline">{cycleList.weight}</span>
              </div>
              <div>
                BMI
                <span className="span_underline">{cycleList.bmi}</span>
              </div>
              <div>
                AMH
                <span className="span_underline">{cycleList.amh}</span>
              </div>
            </FlexBetween>
            <FlexItem marginleft={"1em"}>
              <div>
                女方因素
                <span className="span_underline" style={{ width: "20em" }}>
                  {cycleList.femaleFactors}
                </span>
              </div>
              <div>
                男方因素
                <span className="span_underline" style={{ width: "20em" }}>
                  {cycleList.maleFactors}
                </span>
              </div>
              <FloatDiv onClick={() => this.setState({ visible: true })}>
                启动情况
              </FloatDiv>
              <BaseDrawer
                title="启动情况"
                visible={visible}
                onclose={() => {
                  this.setState({ visible: false })
                }}
              >
                <div>{actList && this.actRender(actList)}</div>
              </BaseDrawer>
            </FlexItem>
            <FoPlane
              checkLmp={(date) => this.props.checkLmp(date)}
              onRef={(ref) => (this.FoPlane = ref)}
              selectOption={this.props.selectOption}
            />
          </PrintViewCard>
        ) : null}
      </>
    )
  }
}
