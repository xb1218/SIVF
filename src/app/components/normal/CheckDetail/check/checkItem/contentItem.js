import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { CommonExhibition } from "./commonContent"
import { FlexItem } from "@/app/components/base/baseForms.js"

export default
@inject("store")
@observer
class Index extends Component {
  render() {
    let { checkType, item, timeLine, sex } = this.props
    let { patientSex } = this.props.store
    let flag = sex === null ? patientSex : sex
    return (
      <>
        {checkType === "妇科B超" ? (
          <>
            <CommonExhibition item={item} />
            <FlexItem>
              <div className="flexgrow">
                <span>所见：</span>
                <span className="span_underline">{item.weSee}</span>
              </div>
            </FlexItem>
            <FlexItem>
              <div className="flexgrow">
                <span>印象：</span>
                <span className="span_underline">{item.impression}</span>
              </div>
            </FlexItem>
          </>
        ) : checkType === "阴道B超" ? (
          <>
            <FlexItem>
              <div>
                <span>月经周期：</span>
                <span className="span_underline">{item.menstruation}</span>
                <span>天</span>
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <span>子宫：</span>
                <span className="span_underline">{item.uterusLength}</span>
                <span>*</span>
                <span className="span_underline">{item.uterusWidth}</span>
                <span>*</span>
                <span className="span_underline">{item.uterusHeight}</span>
                <span>cm</span>
              </div>
              <div>
                <span>内膜：</span>
                <span className="span_underline">{item.innerMembrane}</span>
                <span>cm</span>
              </div>
              <div>
                <span>形态：</span>
                <span className="span_underline">{item.morphological}</span>
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <span>左卵巢：</span>
                <span className="span_underline">{item.leftOvaryLength}</span>
                <span>*</span>
                <span className="span_underline">{item.leftOvaryWidth}</span>
                <span>*</span>
                <span className="span_underline">{item.leftOvaryHeight}</span>
                <span>cm</span>
              </div>
              <div>
                <span>优势卵泡：</span>
                <span className="span_underline">
                  {item.leftOvaryDominantFollicle}
                </span>
                <span>cm</span>
              </div>
              <div>
                <span>卵泡：</span>
                <span className="span_underline">{item.leftOvaryFollicle}</span>
                <span>个</span>
              </div>
              <div>
                <span>窦卵泡：</span>
                <span className="span_underline">
                  {item.leftOvarySinusFollicle}
                </span>
                <span>个</span>
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <span>右卵巢：</span>
                <span className="span_underline">{item.rightOvaryLength}</span>
                <span>*</span>
                <span className="span_underline">{item.rightOvaryWidth}</span>
                <span>*</span>
                <span className="span_underline">{item.rightOvaryHeight}</span>
                <span>cm</span>
              </div>
              <div>
                <span>优势卵泡：</span>
                <span className="span_underline">
                  {item.rightOvaryDominantFollicle}
                </span>
                <span>cm</span>
              </div>
              <div>
                <span>卵泡：</span>
                <span className="span_underline">
                  {item.rightOvaryFollicle}
                </span>
                <span>个</span>
              </div>
              <div>
                <span>窦卵泡：</span>
                <span className="span_underline">
                  {item.rightOvarySinusFollicle}
                </span>
                <span>个</span>
              </div>
            </FlexItem>
            <FlexItem>
              <div className="flexgrow">
                <span>备注：</span>
                <span className="span_underline">{item.note}</span>
              </div>
            </FlexItem>
          </>
        ) : checkType === "B超检查" ? (
          flag ? (
            item.map((project, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    lineHeight: "40px",
                  }}
                >
                  <div
                    style={{
                      flexBasis: "112px",
                      textAlign: "left",
                      marginLeft: "2em",
                    }}
                  >
                    {project.bType}
                  </div>
                  {timeLine ? (
                    <div style={{ flexGrow: 1 }} key={index}>
                      <FlexItem
                        style={{
                          marginTop: 0,
                        }}
                      >
                        <div>
                          <span
                            className="span_underline"
                            style={{
                              color: "#59b4f4",
                              width: "75px",
                            }}
                          >
                            {project.place !== 0
                              ? project.place === 1
                                ? "外院"
                                : "第三方检验"
                              : "本院"}
                          </span>
                        </div>
                        <div>
                          <span
                            className="span_underline"
                            style={{ width: "100px" }}
                          >
                            {project.date}
                          </span>
                        </div>
                        {project.bType === "胸部B超" ? (
                          <div>
                            <span
                              className="span_underline"
                              style={{ marginLeft: 10 }}
                            >
                              {project.result ? "异常" : "正常"}
                            </span>
                          </div>
                        ) : null}
                        {project.bType === "胸部B超" ? (
                          <div className="flexgrow">
                            <span
                              className="span_underline"
                              style={{
                                marginLeft: 10,
                                flexGrow: 1,
                                textAlign: "left",
                              }}
                            >
                              {project.detail}
                            </span>
                          </div>
                        ) : null}
                        {project.bType !== "胸部B超" ? (
                          <div className="flexgrow">
                            <span
                              className="span_underline"
                              style={{
                                marginLeft: 10,
                                flexGrow: 1,
                                textAlign: "left",
                              }}
                            >
                              {project.diagnosis}
                            </span>
                          </div>
                        ) : null}
                      </FlexItem>
                    </div>
                  ) : (
                    <div style={{ flexGrow: 1 }}>
                      {project.otherVideoDTOS
                        ? project.otherVideoDTOS.map((proItem, proIndex) => {
                            return (
                              <FlexItem
                                style={{
                                  marginTop: 0,
                                }}
                                key={proIndex}
                              >
                                <div>
                                  <span
                                    style={{
                                      color: "#59b4f4",
                                      width: "75px",
                                    }}
                                  >
                                    {proItem.place !== 0
                                      ? proItem.place === 1
                                        ? "外院"
                                        : "第三方检验"
                                      : null}
                                  </span>
                                </div>
                                <div>
                                  <span
                                    className="span_underline"
                                    style={{ width: "100px" }}
                                  >
                                    {proItem.date}
                                  </span>
                                </div>
                                {project.bType === "胸部B超" ? (
                                  <div>
                                    <span
                                      className="span_underline"
                                      style={{ marginLeft: 10 }}
                                    >
                                      {proItem.result ? "异常" : "正常"}
                                    </span>
                                  </div>
                                ) : null}
                                {project.bType === "胸部B超" ? (
                                  <div className="flexgrow">
                                    <span
                                      className="span_underline"
                                      style={{
                                        marginLeft: 10,
                                        flexGrow: 1,
                                        textAlign: "left",
                                      }}
                                    >
                                      {proItem.detail}
                                    </span>
                                  </div>
                                ) : null}
                                {project.bType !== "胸部B超" ? (
                                  <div className="flexgrow">
                                    <span
                                      className="span_underline"
                                      style={{
                                        marginLeft: 10,
                                        flexGrow: 1,
                                        textAlign: "left",
                                      }}
                                    >
                                      {proItem.diagnosis}
                                    </span>
                                  </div>
                                ) : null}
                              </FlexItem>
                            )
                          })
                        : null}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <CommonExhibition item={item} />
          )
        ) : checkType === "胸片" ? (
          <CommonExhibition item={item} />
        ) : checkType === "输卵管造影" ? (
          <>
            <FlexItem>
              <div>
                <span>方式：</span>
                <span className="span_underline">{item.method}</span>
              </div>
              <div>
                <span>子宫形态：</span>
                <span className="span_underline">
                  {item.uterusMorphology ? "异常" : "正常"}
                </span>
              </div>
              <div className="flexgrow">
                <span>详述：</span>
                <span className="span_underline">{item.uterusDetail}</span>
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <span>右侧输卵管：</span>
                <span className="span_underline">
                  {item.rightFallopianTube}
                </span>
              </div>
              <div>
                <span>形态：</span>
                <span className="span_underline">
                  {item.rightFallopianTubeMorphology ? "异常" : "正常"}
                </span>
              </div>
              <div className="flexgrow">
                <span>详述：</span>
                <span className="span_underline">
                  {item.rightFallopianTubeDetail}
                </span>
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <span>左侧输卵管：</span>
                <span className="span_underline">{item.leftFallopianTube}</span>
              </div>
              <div>
                <span>形态：</span>
                <span className="span_underline">
                  {item.leftFallopianTubeMorphology ? "异常" : "正常"}
                </span>
              </div>
              <div className="flexgrow">
                <span>详述：</span>
                <span className="span_underline">
                  {item.leftFallopianTubeDetail}
                </span>
              </div>
            </FlexItem>
            <FlexItem>
              <div className="flexgrow">
                <span>表现：</span>
                <span className="span_underline">{item.expression}</span>
              </div>
            </FlexItem>
            <FlexItem>
              <div className="flexgrow">
                <span>诊断：</span>
                <span className="span_underline">{item.diagnostic}</span>
              </div>
            </FlexItem>
          </>
        ) : checkType === "输卵管通液" ? (
          <CommonExhibition item={item} />
        ) : checkType === "心电图" ? (
          <>
            <CommonExhibition item={item} />
            <FlexItem>
              <div className="flexgrow">
                <span>提示：</span>
                <span className="span_underline">{item.tips}</span>
              </div>
            </FlexItem>
          </>
        ) : checkType === "宫腔镜" ? (
          <>
            <CommonExhibition item={item} />
            <FlexItem>
              <div>
                <span>cd138:</span>
                <span className="span_underline">
                  {item.cdOne === "1" ? "阳性" : "阴性"}
                </span>
              </div>
              <div>
                <span>cd38:</span>
                <span className="span_underline">
                  {item.cdThree === "1" ? "阳性" : "阴性"}
                </span>
              </div>
            </FlexItem>
          </>
        ) : checkType === "腹腔镜" ? (
          <CommonExhibition item={item} />
        ) : checkType === "阴道镜" ? (
          <>
            <FlexItem>
              <div>
                <span>宫颈SPT：</span>
                <span className="span_underline">
                  {item.spt ? "异常" : "正常"}
                </span>
              </div>
              <div>
                <span>宫颈炎：</span>
                <span className="span_underline">
                  {item.cervicitis ? "异常" : "正常"}
                </span>
              </div>
              <div>
                <span>宫颈转化区(TZ)：</span>
                <span className="span_underline">
                  {item.tz ? "异常" : "正常"}
                </span>
              </div>
            </FlexItem>
            <FlexItem>
              <div className="flexgrow">
                <span>诊断：</span>
                <span className="span_underline">{item.diagnosis}</span>
              </div>
            </FlexItem>
          </>
        ) : checkType === "子宫内膜活检" ? (
          <CommonExhibition item={item} />
        ) : null}
      </>
    )
  }
}
