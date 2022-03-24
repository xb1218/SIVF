import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import { checkArrisEmpty } from "@/app/utils/tool.js"
import { FlexItem } from "@/app/components/base/baseForms.js"

import PrintView from "@/app/components/normal/printView"
const PrintContent = styled.div`
  height: 30px;
  line-height: 30px;
  h3 {
    text-align: center;
    border-bottom: 1px solid #eee;
    margin-bottom: 1em;
  }
  h4 {
    text-align: center;
    margin-bottom: 1em;
  }
  .div_between {
    display: flex;
    justify-content: space-between;
    margin: 0 5px;
  }

  .span_underline {
    display: inline-block;
    width: 60px;
    height: 25px;
    border-bottom: 1px solid #bdbdbd;
    text-align: center;
  }
  .print_title {
    font-weight: 700;
    margin: 0 1em;
  }
  .bottom_line {
    border-bottom: 1px solid #eee;
    margin-bottom: 1em;
  }
`
const EditLine = styled.div`
  min-height: ${(props) => props.minheight || "40px"};
`
export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super()
    this.state = {
      dataList: props.data,
    }
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        dataList: { ...nextProps.data },
      })
    }
  }
  render() {
    let { dataList } = this.state
    let { stage } = this.props
    let { patientSex, treat_stage } = this.props.store
    const historyBaseInfo = dataList.historyBaseInfo //基本信息
    const maleExamination = dataList.maleExamination //体格检查
    const historyElseInfo = dataList.historyElseInfo //其他病史（取值月经史、婚育史）
    const medicationDTOs = dataList.medicationDTOs //用药
    const medicalAdviceCheckDTOs = dataList.medicalAdviceCheckDTOs //检查
    const comprehensiveTreatmentDTOS = dataList.comprehensiveTreatmentDTOS //治疗
    const treatmentPlanDTO = dataList.treatmentPlanDTO //治疗方案
    const diagnose = dataList.diagnose //诊断
    let patient_Sex = Number(patientSex)

    return (
      <PrintContent style={{ paddingTop: "20px" }}>
        <PrintView>
          <h3>{dataList.hospital}</h3>
          <h4>{stage === 1 ? "复诊" : "初诊"}病历</h4>
          <div className="div_between">
            <div>
              <span>姓名：</span>
              <span className="span_underline">
                {historyBaseInfo.patientName}
              </span>
            </div>
            <div>
              <span>性别：</span>
              <span className="span_underline">
                {historyBaseInfo.sex ? "女" : "男"}
              </span>
            </div>
            <div>
              <span>年龄：</span>
              <span className="span_underline">{historyBaseInfo.age}</span>
            </div>
            <div>
              <span>门诊号：</span>
              <span className="span_underline">
                {historyBaseInfo.medicalCard}
              </span>
            </div>
          </div>
          <div className="div_between bottom_line">
            <div>
              <span>生殖科：</span>
              <span className="span_underline" style={{ width: 100 }}>
                {historyBaseInfo.place && historyBaseInfo.visitRoom ? (
                  <span>
                    {historyBaseInfo.place}
                    {historyBaseInfo.visitRoom}
                  </span>
                ) : (
                  <span>{localStorage.getItem("visitRoom")}</span>
                )}
              </span>
            </div>
            <div>
              <span>日期：</span>
              <span className="span_underline" style={{ width: 100 }}>
                {historyBaseInfo.saveDate}
              </span>
            </div>
          </div>
          {treat_stage === 0 ? (
            <>
              <div className="print_title ">主诉：</div>
              <FlexItem marginleft="1em">
                <div> {dataList.complainant}</div>
              </FlexItem>
              <div className="print_title">病史：</div>
              <FlexItem marginleft="1em">
                <div> {dataList.currentMedicalHistory}</div>
              </FlexItem>
            </>
          ) : treat_stage === 1 ? (
            <>
              <div className="print_title">病史：</div>
              <FlexItem marginleft="1em">
                <div> {dataList.treatmentHistory}</div>
              </FlexItem>
            </>
          ) : null}
          {treat_stage === 0 && patient_Sex ? (
            <>
              {historyElseInfo ? (
                <>
                  <div className="print_title">其他病史：</div>
                  <FlexItem marginleft="1em">
                    <div>
                      初潮年龄：
                      {historyElseInfo.menarcheAge
                        ? historyElseInfo.menarcheAge + "岁"
                        : null}
                    </div>
                    <div>
                      月经周期：{historyElseInfo.cycleMin}-
                      {historyElseInfo.cycleMax}天
                    </div>
                    <div>
                      经期：{historyElseInfo.menstruationMin}-
                      {historyElseInfo.menstruationMax}天
                    </div>
                    <div>
                      经量：
                      {historyElseInfo.menstrualVolume}
                    </div>
                    <div>
                      痛经程度：
                      {historyElseInfo.dysmenorrheaDegree}
                    </div>
                    <div>
                      末次月经时间：
                      {historyElseInfo.lastMenstrualDate}
                    </div>
                    <div>
                      妊娠：G
                      {historyElseInfo.pregnancyNumber}
                    </div>
                    <div>P{historyElseInfo.childbirthNumber}</div>
                    <div>A{historyElseInfo.abortionNumber}</div>
                    <div>L{historyElseInfo.existingChildren}</div>
                  </FlexItem>
                </>
              ) : null}
            </>
          ) : null}
          <div className="print_title">体检及实验室检查：</div>
          {patient_Sex ? (
            <EditLine minheight="20px"></EditLine>
          ) : (
            <FlexItem marginleft="1em">
              {maleExamination ? (
                <>
                  {maleExamination.spermDensityValueOne ? (
                    <div>
                      <span>精子密度：</span>
                      <span>
                        {maleExamination.spermDensityValueOne}/
                        {maleExamination.spermDensityValueTwo}
                        {maleExamination.spermDensityUnit}
                      </span>
                    </div>
                  ) : null}
                  {maleExamination.concentration ? (
                    <div>
                      <span>浓度：</span>
                      <span>
                        {maleExamination.concentration}
                        {maleExamination.concentrationUnit}
                      </span>
                    </div>
                  ) : null}
                  {maleExamination.normalMorphologyRate ? (
                    <div>
                      <span>正常形态率：</span>
                      <span>
                        {maleExamination.normalMorphologyRate}
                        {maleExamination.normalMorphologyUnit}
                      </span>
                    </div>
                  ) : null}
                  {maleExamination.pRValue ? (
                    <div>
                      <span>PR：</span>
                      <span>
                        {maleExamination.pRValue}
                        {maleExamination.pRUnit}
                      </span>
                    </div>
                  ) : null}
                  {maleExamination.nPValue ? (
                    <div>
                      <span>NP：</span>
                      <span>
                        {maleExamination.nPValue}
                        {maleExamination.nPUnit}
                      </span>
                    </div>
                  ) : null}
                </>
              ) : null}
            </FlexItem>
          )}
          <div className="print_title">处理措施：</div>
          <div className="print_title">用药：</div>
          {!checkArrisEmpty(medicationDTOs)
            ? medicationDTOs.map((item, index) => {
                return (
                  <FlexItem marginleft="1em" key={item.uid}>
                    {index === 0 ? (
                      <>
                        <div style={{ width: "19%" }}>
                          {historyBaseInfo.saveDate}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ width: "19%" }}></div>
                      </>
                    )}
                    <div>{item.drugName}</div>
                    <div>{item.dose}</div>
                    <div>
                      {item.frequency}X{item.days}
                    </div>
                    <div>{item.usage}</div>
                    <div>{item.eatStatus}</div>
                    <div>{item.note}</div>
                  </FlexItem>
                )
              })
            : null}
          <div className="print_title">检查：</div>
          {!checkArrisEmpty(medicalAdviceCheckDTOs)
            ? medicalAdviceCheckDTOs.map((item, index) => {
                return (
                  <FlexItem marginleft="1em" key={item.uid}>
                    {index === 0 ? (
                      <>
                        <div style={{ width: "19%" }}>
                          {historyBaseInfo.saveDate}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ width: "19%" }}></div>
                      </>
                    )}
                    <div>{item.inspectionItem}</div>
                    <div>{item.entrustment}</div>
                  </FlexItem>
                )
              })
            : null}
          <div className="print_title">治疗：</div>
          {!checkArrisEmpty(comprehensiveTreatmentDTOS)
            ? comprehensiveTreatmentDTOS.map((item, index) => {
                return (
                  <FlexItem marginleft="1em" key={item.uid}>
                    {index === 0 ? (
                      <>
                        <div style={{ width: "19%" }}>
                          {historyBaseInfo.saveDate}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ width: "19%" }}></div>
                      </>
                    )}
                    <div>{item.treatmentProject}</div>
                    <div>{item.note}</div>
                  </FlexItem>
                )
              })
            : null}
          <div className="print_title">治疗方案：</div>
          <FlexItem marginleft="1em">
            <div>{treatmentPlanDTO.planType}</div>
            <div>{treatmentPlanDTO.medicationPlan}</div>
          </FlexItem>
          {/* （取值用药及检查情况） 2020-12-22 果纳芬 75mg Qdx3 皮下注射 当日 达菲林
        0.1mg Qdx3 皮下注射 当日 用药： 检查： 2020-12-24 达必佳 0.1mg Qdx3
        皮下注射 再次日 2020-12-30 E2+P 清晨空腹 8天后 E2+P+FSH 清晨空腹 8天后
        B超 清晨空腹 8天后 */}
          <div className="print_title">预约信息：</div>
          <FlexItem marginleft="1em">
            <div>
              <span>返诊日：</span>
              {dataList.returnDate || "暂无"}
            </div>
            <div>{dataList.project || "项目暂无"}</div>
          </FlexItem>
          <div className="print_title">初步诊断：</div>
          {!checkArrisEmpty(diagnose)
            ? diagnose.map((item) => {
                return (
                  <div key={item}>
                    {item.validStatus === 1 ? (
                      <span style={{ margin: "0 1em" }}>
                        {item.diagnoseResult}
                        {item.doubtStatus === 0 ? " (疑似) " : null}
                      </span>
                    ) : null}
                  </div>
                )
              })
            : null}
        </PrintView>
      </PrintContent>
    )
  }
}
