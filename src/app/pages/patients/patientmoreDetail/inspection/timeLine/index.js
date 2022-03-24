import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Timeline, Spin } from "antd"
import {
  EllipsisOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons"
import BodyCheck from "@/app/components/normal/CheckDetail/bodycheck/PatientsBodyCheck/bodyCheck.js"
import CheckItem from "@/app/components/normal/CheckDetail/check/checkItem/checkItem.js"
import InspectionItem from "@/app/components/normal/CheckDetail/test/inspectionItem/inspectionItem.js" //验的展示
import "./index.scss"
import styled from "styled-components"
import { LoadingDiv } from "@/app/components/base/baseDiv"
import { checkArrisEmpty } from "@/app/utils/tool.js"
import apis from "@/app/utils/apis"

const ContentBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f6f6f6;
  margin: 10px 20px 10px 0;
  height: 38px;
  div:first-child {
    .spanName {
      margin-left: 10px;
      font-weight: bold;
    }
    width:90%;
    .spanContent {
      display: inline-block;
      width:80%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
  }
  .icon {
    margin: 0 10px;
    width: 1em;
    height: 1em;
  }
`
const SpanContent = styled.span`
  &:first-child {
    margin-left: 10px;
  }
  margin-right: 10px;
`

export default
@inject("store", "inspection")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      projectShow: false, //显示异常项目
      timeLineList: [],
      date: "",
      projectItem: [],
      projectType: "",
      projectTitle: "",
      initFlag: false,
    }
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.sex !== this.props.sex ||
      nextProps.currentKey !== this.props.currentKey ||
      nextProps.patientId !== this.props.patientId
    ) {
      this.initTimeLine()
    }
  }
  componentDidMount = () => {
    this.initTimeLine()
  }
  selectPatient = () => {
    let { selectPatient } = this.props.inspection
    let { select_one } = this.props.store
    return selectPatient(select_one, this.props.sex)
  }
  //初始化时间轴
  initTimeLine = () => {
    apis.ManCheck.getTimeLine(this.selectPatient()).then((res) => {
      this.setState({
        timeLineList: res.data,
        initFlag: true,
      })
    })
  }
  //查看项目
  showProjectItem = async (project, date, type, title) => {
    await this.setState({
      date,
      projectShow: true,
      projectItem: project,
      projectType: type,
      projectTitle: title,
    })
  }
  //关闭查看项目
  closeProjectItem = () => {
    this.setState({
      projectShow: false,
    })
  }
  render() {
    let {
      timeLineList,
      projectShow,
      projectItem,
      projectType,
      projectTitle,
      date,
      initFlag,
    } = this.state
    let { judgeSex } = this.props.inspection
    let { patientSex } = this.props.store
    let { sex } = this.props
    return (
      <div className="timeLine">
        {!projectShow ? (
          <>
            {initFlag ? (
              <Timeline>
                {Object.keys(timeLineList).map((key, index) => {
                  return (
                    <Timeline.Item key={index}>
                      <span>{key}</span>
                      {/*体格检查*/}
                      {!checkArrisEmpty(
                        timeLineList[key].physicalExaminationDTO
                      )
                        ? timeLineList[key].physicalExaminationDTO.map(
                            (item, index) => {
                              return (
                                <ContentBox key={index}>
                                  <div>
                                    <span className="spanContent">
                                      {judgeSex(sex, patientSex) ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            特殊：
                                          </span>
                                          {!checkArrisEmpty(item.special)
                                            ? item.special.join(",")
                                            : "无"}
                                        </SpanContent>
                                      ) : (
                                        <SpanContent>
                                          <span className="itemName">
                                            第二性征：
                                          </span>
                                          {!checkArrisEmpty(
                                            item.sexualException
                                          )
                                            ? item.sexualException.join(",")
                                            : "无"}
                                        </SpanContent>
                                      )}
                                      <SpanContent>
                                        <span className="itemName">
                                          异常项目：
                                        </span>
                                        {!checkArrisEmpty(
                                          item.exceptionalProjectDTOList
                                        )
                                          ? item.exceptionalProjectDTOList.map(
                                              (
                                                exceptional,
                                                exceptionalIndex
                                              ) => {
                                                return (
                                                  <SpanContent
                                                    key={exceptionalIndex}
                                                  >
                                                    {
                                                      exceptional.exceptionalProjectName
                                                    }
                                                    :
                                                    {exceptional.explain
                                                      ? exceptional.explain
                                                      : "无"}
                                                  </SpanContent>
                                                )
                                              }
                                            )
                                          : "无"}
                                      </SpanContent>
                                    </span>
                                  </div>
                                  <div className="ellipsis">
                                    <EllipsisOutlined
                                      onClick={() => {
                                        this.showProjectItem(
                                          item,
                                          key,
                                          "bodycheck",
                                          judgeSex(sex, patientSex)
                                            ? "女方体检"
                                            : "男方体检"
                                        )
                                      }}
                                    />
                                  </div>
                                </ContentBox>
                              )
                            }
                          )
                        : null}

                      {/*妇科检查*/}
                      {!checkArrisEmpty(
                        timeLineList[key].gynecologicalExaminationDTO
                      )
                        ? timeLineList[key].gynecologicalExaminationDTO.map(
                            (item, index) => {
                              return (
                                <ContentBox key={index}>
                                  <div>
                                    <span className="spanContent">
                                      {item.vulva ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            外阴：
                                          </span>
                                          <span>异常</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.pubicHairDistribution ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            阴毛分布：
                                          </span>
                                          <span>异常</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.vulvaDeformity ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            畸形：
                                          </span>
                                          <span>是</span>
                                          <span>{item.vulvaExplain}</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.vaginal ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            阴道：
                                          </span>
                                          <span>不通畅</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.secretion !== "正常" ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            分泌物：
                                          </span>
                                          <span>{item.secretion}</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.mucosa ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            黏膜：
                                          </span>
                                          <span>异常</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.smell !== "有异位" ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            气味：
                                          </span>
                                          <span>无异味</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.uterusNeck !== "光滑" ||
                                      !checkArrisEmpty(
                                        item.uterusNeckSituation
                                      ) ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            宫颈：
                                          </span>
                                          <span>
                                            {item.uterusNeck === "光滑"
                                              ? null
                                              : item.uterusNeck}
                                          </span>
                                          <span>
                                            {item.uterusNeckSituation.join(",")}
                                          </span>
                                        </SpanContent>
                                      ) : null}

                                      {item.uterusSize ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            宫体大小：
                                          </span>
                                          <span>异常</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.uterusParenchyma !== "适中" ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            宫体质地：
                                          </span>
                                          <span>{item.uterusParenchyma}</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.uterusMotility ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            活动度：
                                          </span>
                                          <span>{item.uterusMotility}</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.uterusPressurePain ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            宫体压痛：
                                          </span>
                                          <span>是</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.leftSide ||
                                      !checkArrisEmpty(item.leftSituation) ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            左侧：
                                          </span>
                                          <span>
                                            {item.leftSide ? "异常" : null}
                                          </span>
                                          <span>
                                            {item.leftSituation.join(",")}
                                          </span>
                                        </SpanContent>
                                      ) : null}
                                      {item.rightSide ||
                                      !checkArrisEmpty(item.rightSituation) ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            右侧：
                                          </span>
                                          <span>
                                            {item.rightSide ? "异常" : null}
                                          </span>
                                          <span style={{ marginLeft: 5 }}>
                                            {item.rightSituation.join(",")}
                                          </span>
                                        </SpanContent>
                                      ) : null}
                                    </span>
                                  </div>
                                  <div className="ellipsis">
                                    <EllipsisOutlined
                                      onClick={() => {
                                        this.showProjectItem(
                                          item,
                                          key,
                                          "wmcheck",
                                          "妇科检查"
                                        )
                                      }}
                                    />
                                  </div>
                                </ContentBox>
                              )
                            }
                          )
                        : null}

                      {/*男科检查*/}
                      {!checkArrisEmpty(timeLineList[key].maleExaminationDTO)
                        ? timeLineList[key].maleExaminationDTO.map(
                            (item, index) => {
                              return (
                                <ContentBox key={index}>
                                  <div>
                                    <span className="spanContent">
                                      {item.penile ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            阴茎：
                                          </span>
                                          <span>异常</span>
                                        </SpanContent>
                                      ) : null}

                                      {!checkArrisEmpty(
                                        item.testicularInfos
                                      ) ? (
                                        <>
                                          <SpanContent>
                                            <span className="itemName">
                                              左：
                                            </span>
                                            <span>睾丸 质地：</span>
                                            <span>
                                              {
                                                item.testicularInfos[0]
                                                  .testicularMass
                                              }
                                            </span>
                                          </SpanContent>
                                          <SpanContent>
                                            <span className="itemName">
                                              附睾：
                                            </span>
                                            <span>
                                              {item.testicularInfos[0]
                                                .epididymis
                                                ? "异常"
                                                : "正常"}
                                            </span>
                                          </SpanContent>
                                          <SpanContent>
                                            <span className="itemName">
                                              输精管：
                                            </span>
                                            <span>
                                              {
                                                item.testicularInfos[0]
                                                  .vasDeferens
                                              }
                                            </span>
                                          </SpanContent>
                                          <SpanContent>
                                            <span className="itemName">
                                              精索精脉：
                                            </span>
                                            <span>
                                              {
                                                item.testicularInfos[0]
                                                  .spermaticVein
                                              }
                                            </span>
                                          </SpanContent>
                                          <SpanContent>
                                            <span className="itemName">右</span>
                                            <span>睾丸 质地：</span>
                                            <span>
                                              {
                                                item.testicularInfos[1]
                                                  .testicularMass
                                              }
                                            </span>
                                          </SpanContent>
                                          <SpanContent>
                                            <span className="itemName">
                                              附睾：
                                            </span>
                                            <span>
                                              {item.testicularInfos[1]
                                                .epididymis
                                                ? "异常"
                                                : "正常"}
                                            </span>
                                          </SpanContent>
                                          <SpanContent>
                                            <span className="itemName">
                                              输精管：
                                            </span>
                                            <span>
                                              {
                                                item.testicularInfos[1]
                                                  .vasDeferens
                                              }
                                            </span>
                                          </SpanContent>
                                          <SpanContent>
                                            <span className="itemName">
                                              精索精脉：
                                            </span>
                                            <span>
                                              {
                                                item.testicularInfos[1]
                                                  .spermaticVein
                                              }
                                            </span>
                                          </SpanContent>
                                        </>
                                      ) : null}
                                      {item.prostatitis ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            前列腺：
                                          </span>
                                          <span>异常</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.vasDeferensSize ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            大小：
                                          </span>
                                          <span>{item.vasDeferensSize}</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.vasDeferensMass ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            质地：
                                          </span>
                                          <span>{item.vasDeferensSize}</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.lumpy ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            结节：
                                          </span>
                                          <span>是</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.pressurePain ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            压痛：
                                          </span>
                                          <span>是</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.scrotum ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            阴囊：
                                          </span>
                                          <span>异常</span>
                                        </SpanContent>
                                      ) : null}
                                      {item.scrotalSwelling ? (
                                        <SpanContent>
                                          <span className="itemName">
                                            阴囊肿物：
                                          </span>
                                          <span>有</span>
                                        </SpanContent>
                                      ) : null}
                                    </span>
                                  </div>
                                  <div className="ellipsis">
                                    <EllipsisOutlined
                                      onClick={() => {
                                        this.showProjectItem(
                                          item,
                                          key,
                                          "wmcheck",
                                          "男科检查"
                                        )
                                      }}
                                    />
                                  </div>
                                </ContentBox>
                              )
                            }
                          )
                        : null}

                      {/*化验单+报告单*/}
                      {!checkArrisEmpty(timeLineList[key].inspectionVOS)
                        ? timeLineList[key].inspectionVOS.map(
                            (project, projectIndex) => {
                              return (
                                <ContentBox key={projectIndex}>
                                  <div>
                                    <span className="spanName">
                                      {project.inspectionName}:
                                    </span>
                                    {/* 报告单 */}
                                    {project.inspectionName ===
                                    "AZF基因缺失检测" ? (
                                      <SpanContent style={{ marginLeft: 10 }}>
                                        {project.otherInspectionProjectDTO
                                          .azfaArea ? (
                                          <span>azfa区：缺失</span>
                                        ) : null}
                                        {project.otherInspectionProjectDTO
                                          .azfbArea ? (
                                          <span>azfb区：缺失</span>
                                        ) : null}
                                        {project.otherInspectionProjectDTO
                                          .azfcArea ? (
                                          <span>azfc区：缺失</span>
                                        ) : null}
                                        {project.otherInspectionProjectDTO
                                          .azfdArea ? (
                                          <span>azfd区：缺失</span>
                                        ) : null}
                                      </SpanContent>
                                    ) : null}
                                    {project.inspectionName === "AMH" ||
                                    project.inspectionName === "血沉" ||
                                    project.inspectionName === "染色体" ||
                                    project.inspectionName ===
                                      "精液形态学分析" ? (
                                      <SpanContent style={{ marginLeft: 10 }}>
                                        暂无异常提示
                                      </SpanContent>
                                    ) : null}
                                    {project.otherInspectionProjectDTO ? (
                                      project.otherInspectionProjectDTO
                                        .result ? (
                                        <>
                                          {project.otherInspectionProjectDTO
                                            .result ? (
                                            <SpanContent
                                              style={{
                                                color:
                                                  project
                                                    .otherInspectionProjectDTO
                                                    .result === "阳性（+）"
                                                    ? "red"
                                                    : null,
                                                marginLeft: 10,
                                                marginRight: 0,
                                              }}
                                            >
                                              {
                                                project
                                                  .otherInspectionProjectDTO
                                                  .result
                                              }
                                            </SpanContent>
                                          ) : null}

                                          {/* 异常项目 */}
                                          {project.otherInspectionProjectDTO
                                            .abnormalItems ? (
                                            <SpanContent>
                                              {
                                                project
                                                  .otherInspectionProjectDTO
                                                  .abnormalItems
                                              }
                                            </SpanContent>
                                          ) : null}

                                          {/* 详述 */}
                                          {project.otherInspectionProjectDTO
                                            .detail ? (
                                            <SpanContent>
                                              详述:
                                              {
                                                project
                                                  .otherInspectionProjectDTO
                                                  .detail
                                              }
                                            </SpanContent>
                                          ) : null}

                                          {/* 临床诊断 */}
                                          {project.otherInspectionProjectDTO
                                            .clinicalDiagnosis ? (
                                            <SpanContent>
                                              诊断:
                                              {
                                                project
                                                  .otherInspectionProjectDTO
                                                  .clinicalDiagnosis
                                              }
                                            </SpanContent>
                                          ) : null}
                                        </>
                                      ) : null
                                    ) : null}

                                    {/* 化验单 */}
                                    {checkArrisEmpty(
                                      project.inspectionListParams.filter(
                                        (projectItem) => {
                                          return (
                                            projectItem.inspectionProjectValue ===
                                              "阳性（+）" ||
                                            projectItem.tips === 1 ||
                                            projectItem.tips === -1
                                          )
                                        }
                                      )
                                    ) &&
                                    !checkArrisEmpty(
                                      project.inspectionListParams
                                    ) ? (
                                      <SpanContent style={{ marginLeft: 10 }}>
                                        暂无异常提示
                                      </SpanContent>
                                    ) : (
                                      project.inspectionListParams
                                        .filter((projectItem) => {
                                          return (
                                            projectItem.inspectionProjectValue ===
                                              "阳性（+）" ||
                                            projectItem.tips === 1 ||
                                            projectItem.tips === -1
                                          )
                                        })
                                        .map((citem, cindex) => {
                                          return cindex < 3 ? (
                                            <span key={cindex}>
                                              <SpanContent>
                                                {citem.inspectionProjectName}
                                              </SpanContent>
                                              <SpanContent
                                                style={{
                                                  color:
                                                    citem.inspectionProjectValue ===
                                                    "阳性（+）"
                                                      ? "red"
                                                      : null,
                                                }}
                                              >
                                                {citem.inspectionProjectValue}
                                              </SpanContent>
                                              {citem.tips === 1 ? (
                                                <SpanContent>
                                                  <ArrowUpOutlined className="icon" />
                                                </SpanContent>
                                              ) : citem.tips === -1 ? (
                                                <SpanContent>
                                                  <ArrowDownOutlined className="icon" />
                                                </SpanContent>
                                              ) : null}
                                            </span>
                                          ) : null
                                        })
                                    )}
                                  </div>
                                  <div className="ellipsis">
                                    <EllipsisOutlined
                                      onClick={() => {
                                        this.showProjectItem(
                                          project,
                                          key,
                                          "test",
                                          project.inspectionName
                                        )
                                      }}
                                    />
                                  </div>
                                </ContentBox>
                              )
                            }
                          )
                        : null}

                      {/* 阴道B超 */}
                      {!checkArrisEmpty(
                        timeLineList[key].gynecologicalUltrasoundDTO
                      )
                        ? timeLineList[key].gynecologicalUltrasoundDTO.map(
                            (item, index) => {
                              return (
                                <ContentBox key={index}>
                                  <div>
                                    <span className="spanContent">
                                      <SpanContent className="itemName">
                                        阴道B超：
                                      </SpanContent>
                                      <SpanContent>
                                        <span>无异常提示</span>
                                      </SpanContent>
                                    </span>
                                  </div>
                                  <div className="ellipsis">
                                    <EllipsisOutlined
                                      onClick={() => {
                                        this.showProjectItem(
                                          item,
                                          key,
                                          "check",
                                          "阴道B超"
                                        )
                                      }}
                                    />
                                  </div>
                                </ContentBox>
                              )
                            }
                          )
                        : null}

                      {/* 输卵管造影 */}
                      {!checkArrisEmpty(
                        timeLineList[key].hysterosalpingogramDTO
                      )
                        ? timeLineList[key].hysterosalpingogramDTO.map(
                            (item, index) => {
                              return (
                                <ContentBox key={index}>
                                  <div>
                                    <span>
                                      <SpanContent className="itemName">
                                        输卵管造影：
                                      </SpanContent>
                                      {item.uterusMorphology ||
                                      item.leftFallopianTubeMorphology ||
                                      item.rightFallopianTubeMorphology ? (
                                        <>
                                          {item.uterusMorphology ? (
                                            <SpanContent>
                                              <span className="itemName">
                                                子宫形态：
                                              </span>
                                              <span>异常</span>
                                            </SpanContent>
                                          ) : null}
                                          {item.leftFallopianTubeMorphology ? (
                                            <SpanContent>
                                              <span className="itemName">
                                                左侧输卵管：
                                              </span>
                                              <span>异常&nbsp;</span>
                                              <span>
                                                {item.leftFallopianTubeDetail}
                                              </span>
                                            </SpanContent>
                                          ) : null}
                                          {item.rightFallopianTubeMorphology ? (
                                            <SpanContent>
                                              <span className="itemName">
                                                右侧输卵管：
                                              </span>
                                              <span>异常&nbsp;</span>
                                              <span>
                                                {item.rightFallopianTubeDetail}
                                              </span>
                                            </SpanContent>
                                          ) : null}
                                        </>
                                      ) : (
                                        "无异常提示"
                                      )}
                                    </span>
                                  </div>
                                  <div className="ellipsis">
                                    <EllipsisOutlined
                                      onClick={() => {
                                        this.showProjectItem(
                                          item,
                                          key,
                                          "check",
                                          "输卵管造影"
                                        )
                                      }}
                                    />
                                  </div>
                                </ContentBox>
                              )
                            }
                          )
                        : null}

                      {/* B超检查*/}
                      {!checkArrisEmpty(timeLineList[key].ultrasounds) ? (
                        <ContentBox>
                          <div>
                            {timeLineList[key].ultrasounds.map(
                              (item, index) => {
                                return (
                                  <SpanContent key={index}>
                                    <span>{item.videoType}：</span>
                                    {item.bType === "胸部B超" && item.result ? (
                                      <span>
                                        <span className="itemName">
                                          {item.bType}：
                                        </span>
                                        <span>异常</span>
                                        <span style={{ marginLeft: 10 }}>
                                          {item.detail}
                                        </span>
                                      </span>
                                    ) : (
                                      <span>
                                        <span className="itemName">
                                          {item.bType}：
                                        </span>
                                        <span>无异常提示</span>
                                      </span>
                                    )}
                                  </SpanContent>
                                )
                              }
                            )}
                          </div>
                          <div className="ellipsis">
                            <EllipsisOutlined
                              onClick={() => {
                                this.showProjectItem(
                                  timeLineList[key].ultrasounds,
                                  key,
                                  "check",
                                  "B超检查"
                                )
                              }}
                            />
                          </div>
                        </ContentBox>
                      ) : null}
                      {/* 其他影像 */}
                      {!checkArrisEmpty(timeLineList[key].otherVideoDTO)
                        ? timeLineList[key].otherVideoDTO.map(
                            (otherVideo, index) => {
                              return (
                                <ContentBox key={index}>
                                  <div>
                                    <span className="spanContent">
                                      <SpanContent className="itemName">
                                        {otherVideo.videoType}：
                                      </SpanContent>
                                      {otherVideo.result ? (
                                        <SpanContent>
                                          <span>异常</span>
                                          <span style={{ marginLeft: 10 }}>
                                            {otherVideo.detail}
                                          </span>
                                        </SpanContent>
                                      ) : (
                                        "无异常提示"
                                      )}
                                    </span>
                                  </div>
                                  <div className="ellipsis">
                                    <EllipsisOutlined
                                      onClick={() => {
                                        this.showProjectItem(
                                          otherVideo,
                                          key,
                                          "check",
                                          otherVideo.videoType
                                        )
                                      }}
                                    />
                                  </div>
                                </ContentBox>
                              )
                            }
                          )
                        : null}
                    </Timeline.Item>
                  )
                })}
              </Timeline>
            ) : (
              <LoadingDiv>
                <Spin />
              </LoadingDiv>
            )}
          </>
        ) : projectType === "test" ? (
          <InspectionItem
            timeLine={true}
            date={date}
            itemTitle={projectTitle}
            projectItem={projectItem}
            closeProjectItem={this.closeProjectItem}
          />
        ) : projectType === "check" ? (
          <CheckItem
            timeLine={true}
            date={date}
            itemTitle={projectTitle}
            projectItem={projectItem}
            sex={sex}
            closeProjectItem={this.closeProjectItem}
          />
        ) : projectType === "bodycheck" ? (
          <BodyCheck
            timeLine={true}
            date={date}
            typeTitle={projectTitle}
            projectItem={projectItem}
            closeProjectItem={this.closeProjectItem}
          />
        ) : projectType === "wmcheck" ? (
          <BodyCheck
            timeLine={true}
            date={date}
            typeTitle={projectTitle}
            projectItem={projectItem}
            closeProjectItem={this.closeProjectItem}
          />
        ) : null}
      </div>
    )
  }
}
