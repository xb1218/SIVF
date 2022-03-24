import React from "react"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { BaseTable } from "@/app/components/base/baseTable"
import { checkArrisEmpty } from "@/app/utils/tool.js"

//女方体格检查
export const FemaleBodyCheck = (props) => {
  let { item } = props
  let abnormalColumns = [
    {
      title: "异常项目",
      align: "center",
      dataIndex: "exceptionalProjectName",
      key: "exceptionalProjectName",
      width: 120,
    },
    {
      title: "说明",
      dataIndex: "explain",
      key: "explain",
      align: "center",
      width: "100vw",
      render: (text, record, index) => {
        return <div>{text}</div>
      },
    },
  ]
  return (
    <>
      <FlexItem>
        <div>
          <span>T:</span>
          <span className="span_underline">{item.temperature}</span>
          <span>℃</span>
        </div>
        <div>
          <span>P:</span>
          <span className="span_underline">{item.pulse}</span>
          <span>次/分</span>
        </div>
        <div>
          <span>R:</span>
          <span className="span_underline">{item.respiration}</span>
          <span>次/分</span>
        </div>
        <div>
          <span>BP:</span>
          <span className="span_underline">
            {item.systolicBloodPressure}/{item.diastolicBloodPressure}
          </span>
          <span>mmHg</span>
        </div>
      </FlexItem>
      <FlexItem>
        <div>
          <span>身高:</span>
          <span className="span_underline">{item.height}</span>
          <span>cm</span>
        </div>
        <div>
          <span>体重:</span>
          <span className="span_underline">{item.weight}</span>
          <span>Kg</span>
        </div>
        <div>
          <span>BMI:</span>
          <span className="span_underline">{item.bmi}</span>
        </div>
        <div>
          <span>腰围:</span>
          <span className="span_underline">{item.girth}</span>
          <span>cm</span>
        </div>
        <div>
          <span>臀围:</span>
          <span className="span_underline">{item.hipMeasurement}</span>
          <span>cm</span>
        </div>
        <div>
          <span>腰臂比:</span>
          <span className="span_underline">{item.waistHipRatio}</span>
        </div>
      </FlexItem>
      <FlexItem>
        {item.special !== undefined && item.special.length !== 0 ? (
          <div>
            <span style={{ color: "#59b4f4" }}>特殊</span>
            {item.special.map((sitem, sindex) => {
              return (
                <span
                  className="span_underline"
                  style={{ marginLeft: 10 }}
                  key={sindex}
                >
                  {sitem}
                </span>
              )
            })}
          </div>
        ) : null}
        <div>
          {
            item.fgPolychromeScoreFlg === 1 ? 
            <>
              <span>F-G多毛评分:</span>
              <span className="span_underline">{item.fgPolychromeScore}</span>
            </> : null
          }
        </div>
        <div>
          <span>疼痛评分:</span>
          <span className="span_underline">{item.painScore}</span>
        </div>
      </FlexItem>
      <FlexItem>
        <div>
          <span>补充说明：</span>
          <span className="span_underline" style={{width: "auto"}}>{item.additionalInformation}</span>
        </div>
      </FlexItem>
      <FlexItem>
        <div>
          <span>
            <div style={{ textAlign: "left" }}>其他均正常,异常项目如下:</div>
            <div>
              <BaseTable
                style={{ marginRight: 10 }}
                columns={abnormalColumns}
                dataSource={item.exceptionalProjectDTOList}
                pagination={false}
                rowKey={(record) => record.id}
              />
            </div>
          </span>
        </div>
      </FlexItem>
    </>
  )
}
//妇科检查
export const FemaleCheck = (props) => {
  let { item } = props
  return (
    <>
      <FlexItem>
        <div>
          <span>外阴:</span>
          <span className="span_underline" style={{ width: 80 }}>
            {item.vulvaPattern}
          </span>
          <span className="span_underline" style={{ marginLeft: 30 }}>
            {item.vulva === null ? null : item.vulva ? "发育异常" : "发育正常"}
          </span>
        </div>
        <div>
          <span>阴毛分布:</span>
          <span className="span_underline">
            {item.pubicHairDistribution === null
              ? null
              : item.pubicHairDistribution
              ? "异常"
              : "正常"}
          </span>
          <span className="span_underline" style={{ marginLeft: 30 }}>
            {item.vulvaDeformity === null
              ? null
              : item.vulvaDeformity
              ? "畸形"
              : "无畸形"}
          </span>
        </div>
        {item.vulvaDeformity ? (
          <div>
            <span>说明:</span>
            <span className="span_underline" style={{ width: 100 }}>
              {item.vulvaExplain}
            </span>
          </div>
        ) : null}
      </FlexItem>
      <FlexItem>
        <div>
          <span>阴道:</span>
          <span className="span_underline">
            {item.vaginal === null ? null : item.vaginal ? "不通畅" : "通畅"}
          </span>
          <span className="span_underline" style={{ marginLeft: 30 }}>
            {item.secretion}
          </span>
        </div>
        <div>
          <span>黏膜:</span>
          <span className="span_underline">
            {item.mucosa === null ? null : item.mucosa ? "异常" : "正常"}
          </span>
          <span className="span_underline" style={{ marginLeft: 30 }}>
            {item.smell}
          </span>
        </div>
      </FlexItem>
      <FlexItem>
        <div>
          <span>宫颈:</span>
          <span className="span_underline">{item.uterusNeck}</span>
          {item.uterusNeckSituation
            ? item.uterusNeckSituation.map((citem, cindex) => {
                return (
                  <span
                    key={cindex}
                    className="span_underline"
                    style={{ marginLeft: 30, width: 75 }}
                  >
                    {citem}
                  </span>
                )
              })
            : null}
          {!checkArrisEmpty(item.uterusNeckSituation) ? (
            !item.uterusNeckSituation.includes("息肉") &&
            !item.uterusNeckSituation.includes("纳式囊肿") ? (
              <span className="span_underline" style={{ marginLeft: 30 }}>
                无赘生物
              </span>
            ) : null
          ) : null}
        </div>
      </FlexItem>
      <FlexItem>
        <div>
          <span style={{ color: "#59b4f4" }}>宫体</span>
          <span className="span_underline">{item.uterusPosition}</span>
        </div>
        <div>
          <span>大小:</span>
          <span className="span_underline">
            {item.uterusSize === null
              ? null
              : item.uterusSize
              ? "异常"
              : "正常"}
          </span>
        </div>
        <div>
          <span>质地:</span>
          <span className="span_underline">{item.uterusParenchyma}</span>
        </div>
        <div>
          <span>活动度:</span>
          <span className="span_underline">{item.uterusMotility}</span>
          <span className="span_underline" style={{ marginLeft: 30 }}>
            {item.uterusPressurePain === null
              ? null
              : item.uterusPressurePain
              ? "压痛"
              : "无压痛"}
          </span>
        </div>
      </FlexItem>
      <FlexItem>
        <div>
          <span style={{ color: "#59b4f4" }}>附件</span>
        </div>
        <div>
          <span>左侧:</span>
          <span className="span_underline">
            {item.leftSide === null ? null : item.leftSide ? "异常" : "正常"}
          </span>
          {item.leftSituation
            ? item.leftSituation.map((citem, cindex) => {
                return (
                  <span
                    key={cindex}
                    className="span_underline"
                    style={{ marginLeft: 30 }}
                  >
                    {citem}
                  </span>
                )
              })
            : null}
        </div>
        <div>
          <span>右侧:</span>
          <span className="span_underline">
            {item.rightSide === null ? null : item.rightSide ? "异常" : "正常"}
          </span>
          {item.rightSituation
            ? item.rightSituation.map((citem, cindex) => {
                return (
                  <span
                    key={cindex}
                    className="span_underline"
                    style={{ marginLeft: 30 }}
                  >
                    {citem}
                  </span>
                )
              })
            : null}
        </div>
      </FlexItem>
      <FlexItem>
        <div className="flexgrow">
          <span>说明:</span>
          <span className="span_underline">{item.explain}</span>
        </div>
      </FlexItem>
    </>
  )
}
//男方体格检查
export const MaleBodyCheck = (props) => {
  let { item } = props
  let abnormalColumns = [
    {
      title: "异常项目",
      align: "center",
      dataIndex: "exceptionalProjectName",
      key: "exceptionalProjectName",
      width: 120,
    },
    {
      title: "说明",
      dataIndex: "explain",
      key: "explain",
      align: "center",
      width: "100vw",
      render: (text, record, index) => {
        return <div>{text}</div>
      },
    },
  ]
  return (
    <>
      <FlexItem>
        <div>
          <span>身高:</span>
          <span className="span_underline">{item.height}</span>
          <span>cm</span>
        </div>
        <div>
          <span>体重:</span>
          <span className="span_underline">{item.weight}</span>
          <span>Kg</span>
        </div>
        <div>
          <span>BP:</span>
          <span className="span_underline">
            {item.systolicBloodPressure}/{item.diastolicBloodPressure}
          </span>
          <span>mmHg</span>
        </div>
        <div>
          <span>指距:</span>
          <span className="span_underline">{item.fingerDistance}</span>
          <span>cm</span>
        </div>
        <div>
          <span>脐下距:</span>
          <span className="span_underline">{item.infraumbilicalDistance}</span>
          <span>cm</span>
        </div>
        <div>
          <span>上下身比:</span>
          <span className="span_underline">{item.upperBottomRatio}</span>
        </div>
      </FlexItem>
      <FlexItem>
        <div>
          <span>第二性征</span>
        </div>
        {!checkArrisEmpty(item.sexualCharacteristics)
          ? item.sexualCharacteristics.map((citem, cindex) => {
              return (
                <div key={citem + cindex}>
                  {citem === "胡须" ? (
                    <>
                      <span>{citem}</span>
                      <span className="span_underline">有</span>
                    </>
                  ) : (
                    <>
                      <span>{citem}</span>
                      <span className="span_underline">正常</span>
                    </>
                  )}
                </div>
              )
            })
          : null}
        {!checkArrisEmpty(item.sexualException)
          ? item.sexualException.map((citem, cindex) => {
              return (
                <div key={citem + cindex}>
                  <span>{citem}</span>
                  <span className="span_underline">异常</span>
                </div>
              )
            })
          : null}
      </FlexItem>
      <FlexItem>
        <div>
          <span>
            <div style={{ textAlign: "left" }}>其他均正常,异常项目如下:</div>
            <div>
              <BaseTable
                style={{ marginRight: 10 }}
                columns={abnormalColumns}
                dataSource={item.exceptionalProjectDTOList}
                pagination={false}
                rowKey={(record) => record.id}
              />
            </div>
          </span>
        </div>
      </FlexItem>
    </>
  )
}
//男科检查
export const MaleCheck = (props) => {
  let { item } = props
  let columns = [
    {
      title: "睾丸",
      width: 120,
      colSpan: 0,
      render: (text, record, index) => {
        return <div>{index ? "右" : "左"}</div>
      },
    },
    {
      title: "睾丸",
      align: "center",
      dataIndex: "testicularVolume",
      key: "testicularVolume",
      width: 120,
      colSpan: 3,
      render: (text, record, index) => {
        return <div>{text}ml</div>
      },
    },
    {
      title: "睾丸",
      align: "center",
      dataIndex: "testicularMass",
      key: "testicularMass",
      width: 120,
      colSpan: 0,
      render: (text, record, index) => {
        return <div>质地：{text}</div>
      },
    },
    {
      title: "附睾",
      align: "center",
      dataIndex: "epididymis",
      key: "epididymis",
      width: 320,
      render: (text, record, index) => {
        return <div>{text ? "异常" : "正常"}</div>
      },
    },
    {
      title: "输精管",
      align: "center",
      dataIndex: "vasDeferens",
      key: "vasDeferens",
      width: 320,
      render: (text, record, index) => {
        return <div>{text}</div>
      },
    },
    {
      title: "精索静脉",
      align: "center",
      dataIndex: "spermaticVein",
      key: "spermaticVein",
      width: 320,
      render: (text, record, index) => {
        return <div>{text}</div>
      },
    },
  ]
  return (
    <>
      <FlexItem>
        <div>
          <span>阴茎:</span>
          <span className="span_underline">
            {item.penile ? "异常" : "正常"}
          </span>
        </div>
        <div>
          <span>长度:</span>
          <span className="span_underline">{item.penileLength}</span>
          <span>cm</span>
        </div>
        <div>
          <span>发育:</span>
          <span className="span_underline">{item.penileDevelopment}</span>
        </div>
      </FlexItem>
      <FlexItem>
        <div>
          <span>
            <BaseTable
              style={{ marginRight: 10 }}
              columns={columns}
              dataSource={item.testicularInfos}
              pagination={false}
              rowKey={(record) => record.uid}
            />
          </span>
        </div>
      </FlexItem>
      <FlexItem>
        <div>
          <span>前列腺:</span>
          <span className="span_underline">
            {item.prostatitis ? "异常" : "正常"}
          </span>
        </div>
        <div>
          <span>大小:</span>
          <span className="span_underline">{item.vasDeferensSize}</span>
        </div>
        <div>
          <span>质地:</span>
          <span className="span_underline">{item.vasDeferensMass}</span>
        </div>
        <div>
          {item.lumpy ? <span className="span_underline">结节</span> : null}
        </div>
        <div>
          {item.pressurePain ? (
            <span className="span_underline">压痛</span>
          ) : null}
        </div>
      </FlexItem>
      <FlexItem>
        <div>
          <span>阴囊:</span>
          <span className="span_underline">
            {item.scrotum ? "异常" : "正常"}
          </span>
          <span className="span_underline">
            {item.scrotalSwelling ? "阴囊肿物" : null}
          </span>
        </div>
      </FlexItem>
      <FlexItem>
        <div className="flexgrow">
          <span>备注:</span>
          <span className="span_underline">{item.note}</span>
        </div>
      </FlexItem>
    </>
  )
}
//检查内容
export const Content = (props) => {
  let { item, typeTitle } = props
  return (
    <>
      {typeTitle === "女方体检" ? (
        <FemaleBodyCheck item={item} />
      ) : typeTitle === "男方体检" ? (
        <MaleBodyCheck item={item} />
      ) : typeTitle === "妇科检查" ? (
        <FemaleCheck item={item} />
      ) : (
        <MaleCheck item={item} />
      )}
    </>
  )
}
