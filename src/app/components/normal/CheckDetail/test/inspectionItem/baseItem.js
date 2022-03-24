import React from "react"
import { BaseTable } from "@/app/components/base/baseTable"
import { FlexItem } from "@/app/components/base/baseForms.js"
import "./index.scss"

export const CommonContent = (props) => {
  let { otherInspectionProjectDTO } = props
  return (
    <FlexItem>
      <div>
        <span>结果:</span>
        <span className="span_underline" style={{ width: "auto" }}>
          {otherInspectionProjectDTO.result}
        </span>
      </div>
      <div className="flexgrow">
        <span>详述:</span>
        <span className="span_underline">
          {otherInspectionProjectDTO.detail}
        </span>
      </div>
    </FlexItem>
  )
}
export const UrethralSecretion = (props) => {
  let { data } = props
  return (
    <>
      {data.map((item, index) => {
        return (
          <FlexItem key={index}>
            <div>
              <span style={{ width: "120px" }}>
                {item.inspectionProjectName}：
              </span>
              <span className="span_underline" style={{ width: "auto" }}>
                {item.inspectionProjectValue}
              </span>
            </div>
            <div className="flexgrow">
              <span>详述：</span>
              <span className="span_underline">
                {item.inspectionProjectDetail}
              </span>
            </div>
          </FlexItem>
        )
      })}
    </>
  )
}
export const CommonTable = (props) => {
  let { item } = props
  let columns = [
    {
      title: "项目",
      align: "center",
      dataIndex: "inspectionProjectName",
      key: "inspectionProjectName",
      width: 700,
      render: (text, record, index) => {
        return <div>{text}</div>
      },
    },
    {
      title: "结果",
      dataIndex: "inspectionProjectValue",
      key: "inspectionProjectValue",
      align: "center",
      width: 300,
      render: (text, record, index) => {
        return text === "阳性（+）" ||
          text === "弱阳性" ||
          text === "可疑阳性" ? (
          <div style={{ color: "red" }}>{text}</div>
        ) : (
          <div>{text}</div>
        )
      },
    },
    {
      title: "单位",
      dataIndex: "unit",
      key: "unit",
      align: "center",
      width: 300,
      render: (text, record, index) => {
        return <div>{text}</div>
      },
    },
    {
      title: "提示",
      dataIndex: "tips",
      key: "tips",
      align: "center",
      width: 300,
      render: (text, record, index) => {
        return (
          <div>
            {text === 1 ? (
              <svg className="icon_record" aria-hidden="true">
                <use xlinkHref="#iconarrowup" />
              </svg>
            ) : text === -1 ? (
              <svg className="icon_record" aria-hidden="true">
                <use xlinkHref="#icondownarrow" />
              </svg>
            ) : null}
          </div>
        )
      },
    },
    {
      title: "参考区间",
      dataIndex: "range",
      key: "range",
      align: "center",
      width: 300,
      render: (text, record, index) => {
        return <div>{text}</div>
      },
    },
  ]
  return (
    <BaseTable
      className="basetable"
      columns={columns}
      dataSource={item.inspectionListParams.filter(
        (otherInspectionProjectDTO) =>
          otherInspectionProjectDTO.inspectionProjectValue
      )}
      pagination={false}
      rowKey={(record) => record.inspectionProjectName}
    />
  )
}
export const Content = (props) => {
  let { checkType, item, addCheckSource } = props
  let otherInspectionProjectDTO = item.otherInspectionProjectDTO
    ? item.otherInspectionProjectDTO
    : {}
  return (
    <>
      {addCheckSource === 0 ? (
        <CommonTable item={item} />
      ) : checkType === "肾功能" ? (
        <>
          <CommonContent
            otherInspectionProjectDTO={otherInspectionProjectDTO}
          />
          <CommonTable item={item} />
        </>
      ) : checkType === "HIV" ? (
        <FlexItem>
          <div>
            <span>HIVAb：</span>
            <span className="span_underline" style={{ width: "auto" }}>
              {otherInspectionProjectDTO.result}
            </span>
          </div>
          <div className="flexgrow">
            <span>详述：</span>
            <span className="span_underline">
              {otherInspectionProjectDTO.detail}
            </span>
          </div>
        </FlexItem>
      ) : checkType === "HCV" ? (
        <FlexItem>
          <div>
            <span>HCVAb：</span>
            <span className="span_underline" style={{ width: "auto" }}>
              {otherInspectionProjectDTO.result}
            </span>
          </div>
          <div>
            <span>HCV——RNA计数：</span>
            <span className="span_underline" style={{ width: "auto" }}>
              {otherInspectionProjectDTO.hcvRnaNum}
            </span>
          </div>
          <div className="flexgrow">
            <span>详述：</span>
            <span className="span_underline">
              {otherInspectionProjectDTO.detail}
            </span>
          </div>
        </FlexItem>
      ) : checkType === "血型" ? (
        <>
          <FlexItem>
            <div>
              <span>ABO血型:</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.aboBlood}
              </span>
            </div>
            <div>
              <span>RH因子:</span>
              <span className="span_underline" style={{ width: "auto" }}>
                {otherInspectionProjectDTO.rhFactor}
              </span>
            </div>
          </FlexItem>
          <FlexItem>
            <div className="flexgrow">
              <span>详述:</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.detail}
              </span>
            </div>
          </FlexItem>
        </>
      ) : checkType === "染色体" ? (
        <FlexItem>
          <div>
            <span>核型：</span>
            <span className="span_underline">
              {otherInspectionProjectDTO.karyotype}
            </span>
          </div>
          <div className="flexgrow">
            <span>临床诊断：</span>
            <span className="span_underline">
              {otherInspectionProjectDTO.clinicalDiagnosis}
            </span>
          </div>
        </FlexItem>
      ) : checkType === "地贫" ? (
        <CommonContent otherInspectionProjectDTO={otherInspectionProjectDTO} />
      ) : checkType === "尿道分泌物" ? (
        <UrethralSecretion data={item.inspectionListParams} />
      ) : checkType === "血沉" ? (
        <FlexItem>
          <div>
            <span>血沉</span>
            <span className="span_underline">
              {otherInspectionProjectDTO.erythrocyte}
            </span>
            <span>mm/H</span>
          </div>
        </FlexItem>
      ) : checkType === "染色体G带核型检查" ? (
        <FlexItem>
          <div>
            <span className="span_underline">
              {otherInspectionProjectDTO.result}
            </span>
          </div>
          {otherInspectionProjectDTO.result !== "未查" ? (
            <>
              <div>
                <span>核型：</span>
                <span className="span_underline">
                  {otherInspectionProjectDTO.karyotype}
                </span>
              </div>
              {otherInspectionProjectDTO.result === "异常" ? (
                <div className="flexgrow">
                  <span>临床诊断：</span>
                  <span className="span_underline">
                    {otherInspectionProjectDTO.clinicalDiagnosis}
                  </span>
                </div>
              ) : null}
            </>
          ) : null}
        </FlexItem>
      ) : checkType === "全基因拷贝数变异分析" ? (
        <FlexItem>
          <div>
            <span className="span_underline">
              {otherInspectionProjectDTO.result}
            </span>
          </div>
          {otherInspectionProjectDTO.result === "正常" ? (
            <div>
              <span
                className="span_underline"
                style={{ width: "auto", margin: "0 5px" }}
              >
                {otherInspectionProjectDTO.analysisMethod
                  ? "基因芯片"
                  : "高通量测序"}
              </span>
              {otherInspectionProjectDTO.analysisMethod === 0 ? null : (
                <>
                  <span style={{ marginLeft: 5 }}>类型：</span>
                  <span className="span_underline" style={{ width: "auto" }}>
                    {otherInspectionProjectDTO.chipType}
                  </span>
                </>
              )}
            </div>
          ) : null}
          {otherInspectionProjectDTO.result === "异常" ? (
            <div className="flexgrow">
              <span>详述：</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.abnormalExplain}
              </span>
            </div>
          ) : null}
        </FlexItem>
      ) : checkType === "单基因遗传病检测" ? (
        <>
          <FlexItem>
            <div className="flexgrow">
              <span>致病基因：</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.pathogeniGene}
              </span>
            </div>
            <div className="flexgrow">
              <span>具体位点：</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.specificSites}
              </span>
            </div>
            <div className="flexgrow">
              <span>遗传方式：</span>
              <span className="span_underline" style={{ width: "auto" }}>
                {otherInspectionProjectDTO.geneticPattern}
              </span>
            </div>
          </FlexItem>
          <FlexItem>
            <div className="flexgrow">
              <span>遗传病临床诊断:</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.hereditaryDiseases}
              </span>
            </div>
          </FlexItem>
        </>
      ) : checkType === "阴道分泌物" ? (
        <>
          <FlexItem>
            <div>
              <span>滴虫:</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.uid
                  ? otherInspectionProjectDTO.trichomonas
                    ? "检出"
                    : "未检出"
                  : null}
              </span>
            </div>
            <div>
              <span>霉菌:</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.uid
                  ? otherInspectionProjectDTO.mold
                    ? "检出"
                    : "未检出"
                  : null}
              </span>
            </div>
            <div>
              <span>假丝酵母菌:</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.uid
                  ? otherInspectionProjectDTO.pseudomycetes
                    ? "检出"
                    : "未检出"
                  : null}
              </span>
            </div>
            <div>
              <span>线索细胞:</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.uid
                  ? otherInspectionProjectDTO.threadedCells
                    ? "检出"
                    : "未检出"
                  : null}
              </span>
            </div>
          </FlexItem>
          <CommonTable item={item} />
        </>
      ) : checkType === "宫颈TCT" ? (
        <FlexItem>
          <div>
            <span>宫颈TCT：</span>
            <span className="span_underline" style={{ width: "auto" }}>
              {otherInspectionProjectDTO.result}
            </span>
          </div>
        </FlexItem>
      ) : checkType === "HPV" ? (
        <CommonContent otherInspectionProjectDTO={otherInspectionProjectDTO} />
      ) : checkType === "HC2" ? (
        <>
          <CommonContent
            otherInspectionProjectDTO={otherInspectionProjectDTO}
          />
          <FlexItem>
            <div className="flexgrow">
              <span>诊断:</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.clinicalDiagnosis}
              </span>
            </div>
          </FlexItem>
        </>
      ) : checkType === "肝功能" ? (
        <>
          <CommonContent
            otherInspectionProjectDTO={otherInspectionProjectDTO}
          />
          <CommonTable item={item} />
        </>
      ) : checkType === "尿常规" ? (
        <>
          <CommonContent
            otherInspectionProjectDTO={otherInspectionProjectDTO}
          />
          <CommonTable item={item} />
        </>
      ) : checkType === "AMH" ? (
        <FlexItem>
          <div>
            <span>AMH</span>
            <span className="span_underline">
              {otherInspectionProjectDTO.amhResult}
            </span>
            <span>ng/ml</span>
          </div>
        </FlexItem>
      ) : checkType === "胰岛素释放" ? (
        <>
          <CommonContent
            otherInspectionProjectDTO={otherInspectionProjectDTO}
          />
          <FlexItem>
            <div>
              <span>空腹胰岛素</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.fastinginsulin}
              </span>
              <span>uU/ml</span>
            </div>
          </FlexItem>
        </>
      ) : checkType === "精浆酶学分析" ? (
        <>
          <FlexItem>
            <div>
              <span>结果</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.result}
              </span>
            </div>
            <div>
              <span>异常项目</span>
              <span className="span_underline" style={{ width: "150px" }}>
                {otherInspectionProjectDTO.abnormalItems}
              </span>
            </div>
          </FlexItem>
          <FlexItem>
            <div className="flexgrow">
              <span>其他</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.other}
              </span>
            </div>
          </FlexItem>
        </>
      ) : checkType === "AZF基因缺失检测" ? (
        <>
          <FlexItem>
            <div>
              <span>AZF a区:</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.uid &&
                otherInspectionProjectDTO.azfaArea !== null
                  ? otherInspectionProjectDTO.azfaArea
                    ? "缺失"
                    : "存在"
                  : null}
              </span>
            </div>
            <div>
              <span>AZF b区:</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.uid &&
                otherInspectionProjectDTO.azfbArea !== null
                  ? otherInspectionProjectDTO.azfbArea
                    ? "缺失"
                    : "存在"
                  : null}
              </span>
            </div>
            <div>
              <span>AZF c区:</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.uid &&
                otherInspectionProjectDTO.azfcArea !== null
                  ? otherInspectionProjectDTO.azfcArea
                    ? "缺失"
                    : "存在"
                  : null}
              </span>
            </div>
            <div>
              <span>AZF d区:</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.uid &&
                otherInspectionProjectDTO.azfdArea !== null
                  ? otherInspectionProjectDTO.azfdArea
                    ? "缺失"
                    : "存在"
                  : null}
              </span>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span>临床诊断</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.clinicalDiagnosis}
              </span>
            </div>
          </FlexItem>
        </>
      ) : checkType === "睾丸活检" ? (
        <>
          <FlexItem>
            <div>
              <span>结果</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.result}
              </span>
            </div>
            <div>
              <span>镜检</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.microscopy}
              </span>
            </div>
            <div className="flexgrow">
              <span>备注</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.other}
              </span>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span>病理报告</span>
              <span className="span_underline" style={{ width: 148 }}>
                {otherInspectionProjectDTO.caseReport}
              </span>
            </div>
            <div className="flexgrow">
              <span>详述</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.detail}
              </span>
            </div>
          </FlexItem>
        </>
      ) : checkType === "精液常规分析" ? (
        <>
          <FlexItem>
            <div>
              <span>禁欲</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.abstinence}
              </span>
              <span>天</span>
            </div>
            <div>
              <span>精液</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.semen}
              </span>
              <span>ml</span>
            </div>
            <div>
              <span>色</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.color}
              </span>
            </div>
            <div>
              <span>液化</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.liquefaction}
              </span>
              <span>min</span>
            </div>
            <div>
              <span>粘稠度</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.viscosity}
              </span>
            </div>
            <div>
              <span>PH值</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.phValue}
              </span>
            </div>
            <div>
              <span>凝集</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.agglutination}
              </span>
            </div>
            <div>
              <span>精子总数</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.spermCount}
              </span>
              <span>×10^6</span>
            </div>
            {otherInspectionProjectDTO.concentration ? (
              <div>
                <span>浓度</span>
                <span className="span_underline">
                  {otherInspectionProjectDTO.concentration}
                </span>
                <span>×10^6</span>
              </div>
            ) : (
              <div>
                <span>精子密度</span>
                <span className="span_underline">
                  {otherInspectionProjectDTO.spermDensityFirst}
                </span>
                /
                <span className="span_underline">
                  {otherInspectionProjectDTO.spermDensitySecond}
                </span>
                <span>HF</span>
              </div>
            )}
            <div>
              <span>存活率</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.survivalRate}
              </span>
              <span>%</span>
            </div>
            <div>
              <span>白细胞</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.whiteBloodCellFirst}
              </span>
              <span>-</span>
              <span className="span_underline">
                {otherInspectionProjectDTO.whiteBloodCellSecond}
              </span>
              <span>HPF</span>
            </div>
          </FlexItem>
          <CommonTable item={item} />
        </>
      ) : (
        <CommonTable item={item} />
      )}
    </>
  )
}
