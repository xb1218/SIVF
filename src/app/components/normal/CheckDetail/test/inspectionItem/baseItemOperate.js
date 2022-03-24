import React from "react"
import { Select, Input, Radio } from "antd"
import { BaseTable } from "@/app/components/base/baseTable"
import { FontInput } from "@/app/components/base/baseFontInput"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { renderOptions } from "@/app/utils/tool.js" //引入不同的下拉框
import "./index.scss"

export const CommonHeader = (props) => {
  const setReportValue = (val, param) => {
    props.setReportValue(val, param)
  }
  let { checkType, item, insepectOptions } = props
  item.result = item.result ? item.result : "正常"
  return (
    <FlexItem>
      <div>
        <span>结果</span>
        <span>
          <Select
            value={item.result}
            style={{ width: "auto" }}
            dropdownMatchSelectWidth={100}
            onChange={(value) => {
              setReportValue(value, "result")
            }}
          >
            {renderOptions(
              insepectOptions,
              checkType === "地贫" ? "275" : "63"
            )}
          </Select>
        </span>
      </div>
      <div>
        <span>详述</span>
        <span>
          <Input
            value={item.detail}
            // style={{ width: "auto" }}
            onChange={(e) => {
              setReportValue(e.target.value, "detail")
            }}
          />
        </span>
      </div>
    </FlexItem>
  )
}
export const CommonTable = (props) => {
  const setProjectsValue = (record, val, param) => {
    props.setProjectsValue(record, val, param)
  }
  let { checkType, insepectOptions, inspectionListParams } = props
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
        return checkType === "微生物检查" ||
          checkType === "淋球菌/支、衣原体" ||
          checkType === "TORCH" ||
          checkType === "梅毒" ||
          checkType === "肝功能" ||
          checkType === "肾功能" ? (
          <Select
            value={record.inspectionProjectValue}
            style={{ width: 150, textAlign: "left" }}
            onChange={(value) => {
              setProjectsValue(record, value, "inspectionProjectValue")
            }}
          >
            {/* 表格中全部为下拉框 */}
            {renderOptions(insepectOptions, "270")}
          </Select>
        ) : record.inspectionProjectName === "精浆" ||
          record.inspectionProjectName === "血清" ? (
          <Select
            value={record.inspectionProjectValue}
            style={{ width: 150, textAlign: "left" }}
            onChange={(value) => {
              setProjectsValue(record, value, "inspectionProjectValue")
            }}
          >
            {renderOptions(insepectOptions, "267")}
          </Select>
        ) : record.inspectionProjectName === "尿蛋白" ||
          record.inspectionProjectName === "隐血" ||
          record.inspectionProjectName === "尿糖" ||
          record.inspectionProjectName === "分泌物抗精子抗体" ||
          record.inspectionProjectName === "加德纳" ||
          record.inspectionProjectName === "血清抗精子抗体" ||
          record.inspectionProjectName === "抗内膜抗体" ||
          record.inspectionProjectName === "抗心磷脂抗体" ||
          record.inspectionProjectName === "IgG" ||
          record.inspectionProjectName === "IgM" ||
          record.inspectionProjectName === "抗卵巢抗体" ||
          record.inspectionProjectName === "抗核抗体" ||
          record.inspectionProjectName === "宫颈粘液抗精子抗体" ||
          record.inspectionProjectName === "抗结核抗体" ? (
          <Select
            value={record.inspectionProjectValue}
            style={{ width: 150, textAlign: "left" }}
            onChange={(value) => {
              setProjectsValue(record, value, "inspectionProjectValue")
            }}
          >
            {/* 表格中某几项为下拉框 */}
            {renderOptions(insepectOptions, "270")}
          </Select>
        ) : record.inspectionProjectName === "清洁度" ? (
          <Select
            value={record.inspectionProjectValue}
            style={{ width: 150, textAlign: "left" }}
            onChange={(value) => {
              setProjectsValue(record, value, "inspectionProjectValue")
            }}
          >
            {renderOptions(insepectOptions, "271")}
          </Select>
        ) : checkType === "乙肝六项" ? (
          <Select
            value={record.inspectionProjectValue}
            style={{ width: 150, textAlign: "left" }}
            onChange={(value) => {
              setProjectsValue(record, value, "inspectionProjectValue")
            }}
          >
            {renderOptions(insepectOptions, "273")}
          </Select>
        ) : (
          <Input
            value={record.inspectionProjectValue}
            style={{ width: 150 }}
            onChange={(e) =>
              setProjectsValue(record, e.target.value, "inspectionProjectValue")
            }
          />
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
      style={{ margin: "8px 10px 0 10px" }}
      columns={columns}
      dataSource={inspectionListParams}
      pagination={false}
      rowKey={(record) => record.projectIndex}
    />
  )
}
export const UrethralSecretion = (props) => {
  const setProjectsValue = (param, index, val) => {
    props.setProjectsValue(param, index, val)
  }
  let { inspectionListParams } = props
  return(
    <>
    {inspectionListParams.map((item, index) => (
      <FlexItem key={index}>
        <span style={{width:"120px"}}>{item.inspectionProjectName}：</span>
        <Radio.Group 
          defaultValue={item.inspectionProjectValue}
          onChange={(e) => {
            setProjectsValue(
              item,
              e.target.value,
              "inspectionProjectValue",
            )
          }}
        >
          <Radio value="阴性">阴性</Radio>
          <Radio value="阳性">阳性</Radio>
          <Radio value="未查">未查</Radio>
        </Radio.Group>
        <span style={{ margin: "0px 15px" }}>详述</span>
        <Input 
          style={{ width: "35%" }} 
          defaultValue={item.inspectionProjectDetail}
          onChange={(e) => {
            setProjectsValue(
            item,
            e.target.value,
            "inspectionProjectDetail",
          )
          }}
        />
      </FlexItem>
    ))}
    </>
  )
}
export const CommonTableAdd = (props) => {
  const setProjectsValueAdd = (param, index, val) => {
    props.setProjectsValueAdd(param, index, val)
  }
  let { inspectionListParams } = props
  let columns = [
    {
      title: "项目",
      dataIndex: "inspectionProjectName",
      key: "inspectionProjectName",
      width: 80,
      render: (text, record, index) => {
        return <div>{text}</div>
      },
    },
    {
      title: "结果",
      dataIndex: "inspectionProjectValue",
      key: "inspectionProjectValue",
      width: 70,
      render: (text, record, index) => {
        return (
          <Input
            style={{ width: "98%" }}
            value={record.inspectionProjectValue}
            disabled={record.indexMark === 2 ? false : true}
            onChange={(e) => {
              setProjectsValueAdd(
                "inspectionProjectValue",
                index,
                e.target.value
              )
            }}
          />
        )
      },
    },
    {
      title: "",
      dataIndex: "change",
      key: "change",
      width: 1,
      render: (text, record, index) => {
        return record.indexMark === 0 || record.indexMark === 1 ? (
          <svg
            className="icon_girl"
            aria-hidden="true"
            onClick={() => {
              setProjectsValueAdd("change", index, "")
            }}
          >
            <use xlinkHref="#iconqiehuan"></use>
          </svg>
        ) : null
      },
    },
    {
      title: "单位",
      dataIndex: "unit",
      key: "unit",
      width: 70,
      render: (text, record, index) => {
        return <div>{text}</div>
      },
    },
    {
      title: "参考区间",
      dataIndex: "section",
      key: "section",
      width: 80,
      render: (text, record, index) => {
        return (
          <>
            <span>{record.section1}</span>-<span>{record.section2}</span>
          </>
        )
      },
    },
    {
      title: "提示",
      dataIndex: "tishi",
      key: "tishi",
      width: 80,
      render: (text, record, index) => {
        return (
          <div>
            {record.inspectionProjectValue !== "阴性" &&
            record.inspectionProjectValue !== "阳性" &&
            record.inspectionProjectValue !== "" &&
            record.section1 !== "" &&
            record.section2 !== "" ? (
              parseFloat(record.inspectionProjectValue) >
              parseFloat(record.section2) ? (
                <svg className="icon_record" aria-hidden="true">
                  <use xlinkHref="#iconarrowup" />
                </svg>
              ) : parseFloat(record.inspectionProjectValue) <
              parseFloat(record.section1) ? (
                <svg className="icon_record" aria-hidden="true">
                  <use xlinkHref="#icondownarrow" />
                </svg>
              ) : null
            ) : null}
          </div>
        )
      },
    },
  ]
  return (
    <BaseTable
      style={{ margin: "8px 10px 0 10px" }}
      columns={columns}
      dataSource={inspectionListParams}
      pagination={false}
      rowKey={(record) => record.projectIndex}
    />
  )
}
export const Header = (props) => {
  const setReportValue = (val, param) => {
    props.setReportValue(val, param)
  }
  let { checkType, item, insepectOptions } = props
  item.result = item.result
    ? item.result
    : checkType === "精浆酶学分析" ||
      checkType === "尿道分泌物" ||
      checkType === "宫颈TCT" ||
      checkType === "尿常规" ||
      checkType === "肝功能" ||
      checkType === "胰岛素释放"
    ? "正常"
    : "阴性（-）"

  return (
    <div>
      {checkType === "精浆酶学分析" ? (
        <FlexItem>
          <div>
            <span>结果</span>
            <span>
              <Select
                value={item.result}
                dropdownMatchSelectWidth={80}
                onChange={(value) => {
                  setReportValue(value, "result")
                }}
              >
                {renderOptions(insepectOptions, "63")}
              </Select>
            </span>
          </div>
          <div>
            <span>异常项目</span>
            <span>
              <Select
                value={item.abnormalItems}
                dropdownMatchSelectWidth={200}
                style={{ width: 200 }}
                onChange={(value) => {
                  setReportValue(value, "abnormalItems")
                }}
              >
                {renderOptions(insepectOptions, "268")}
              </Select>
            </span>
          </div>
        </FlexItem>
      ) : 
        // checkType === "尿道分泌物" ||
        checkType === "肝功能" ||
        checkType === "尿常规" ||
        checkType === "肾功能" ||
        checkType === "地贫" ||
        checkType === "胰岛素释放" ? (
        <CommonHeader
          item={item}
          setReportValue={setReportValue}
          insepectOptions={insepectOptions}
          checkType={checkType}
        />
      ) : checkType === "宫颈TCT" ? (
        <FlexItem>
          <div>
            <span>
              <Select
                value={item.result}
                style={{ width: 160 }}
                onChange={(value) => {
                  setReportValue(value, "result")
                }}
              >
                {renderOptions(insepectOptions, "272")}
              </Select>
            </span>
          </div>
        </FlexItem>
      ) : checkType === "HPV" || checkType === "HC2" ? (
        <FlexItem>
          <div>
            <span>
              <Select
                value={item.result}
                style={{ width: 110 }}
                onChange={(value) => {
                  setReportValue(value, "result")
                }}
              >
                {renderOptions(insepectOptions, "270")}
              </Select>
            </span>
          </div>
          <div>
            <span>详述</span>
            <span>
              <Input
                value={item.detail}
                style={{ width: 200 }}
                onChange={(e) => {
                  setReportValue(e.target.value, "detail")
                }}
              />
            </span>
          </div>
        </FlexItem>
      ) : checkType === "AMH" ? (
        <FlexItem>
          <div>
            <span>AMH</span>
            <span>
              <FontInput
                addonAfter="ng/ml"
                value={item.amhResult}
                onChange={(e) => {
                  setReportValue(e.target.value, "amhResult")
                }}
              />
            </span>
          </div>
        </FlexItem>
      ) : checkType === "HIV" ? (
        <FlexItem>
          <div>
            <span>HIVAb</span>
            <span>
              <Select
                value={item.result}
                dropdownMatchSelectWidth={200}
                onChange={(value) => {
                  setReportValue(value, "result")
                }}
              >
                {renderOptions(insepectOptions, "273")}
              </Select>
            </span>
          </div>
          <div>
            <span>详述</span>
            <span>
              <Input
                value={item.detail}
                style={{ width: 220 }}
                onChange={(e) => {
                  setReportValue(e.target.value, "detail")
                }}
              />
            </span>
          </div>
        </FlexItem>
      ) : checkType === "HCV" ? (
        <FlexItem>
          <div>
            <span>HCVAb</span>
            <span>
              <Select
                value={item.result}
                style={{ width: 115 }}
                onChange={(value) => {
                  setReportValue(value, "result")
                }}
              >
                {renderOptions(insepectOptions, "273")}
              </Select>
            </span>
          </div>
          <div>
            <span>HCV-RNA计数</span>
            <span>
              <Input
                value={item.hcvRnaNum}
                style={{ width: 80 }}
                onChange={(e) => {
                  setReportValue(e.target.value, "hcvRnaNum")
                }}
              />
            </span>
          </div>
        </FlexItem>
      ) : checkType === "血型" ? (
        <FlexItem>
          <div>
            <span>ABO血型</span>
            <span>
              <Select
                value={item.aboBlood}
                style={{ width: 80 }}
                onChange={(value) => {
                  setReportValue(value, "aboBlood")
                }}
              >
                {renderOptions(insepectOptions, "274")}
              </Select>
            </span>
          </div>
          <div>
            <span>RH因子</span>
            <span>
              <Select
                value={item.result}
                style={{ width: 120 }}
                onChange={(value) => {
                  setReportValue(value, "result")
                }}
              >
                {renderOptions(insepectOptions, "270")}
              </Select>
            </span>
          </div>
        </FlexItem>
      ) : checkType === "染色体" ? (
        <FlexItem>
          <div>
            <span>核型</span>
            <span>
              <Select
                style={{ width: "80px" }}
                value={item.karyotype}
                dropdownMatchSelectWidth={80}
                onChange={(val) => {
                  setReportValue(val, "karyotype")
                }}
              >
                {renderOptions(insepectOptions, "318")}
              </Select>
            </span>
          </div>
          <div>
            <span>临床诊断</span>
            <span>
              <Input
                value={item.clinicalDiagnosis}
                style={{ width: 190 }}
                onChange={(e) => {
                  setReportValue(e.target.value, "clinicalDiagnosis")
                }}
              />
            </span>
          </div>
        </FlexItem>
      ) : checkType === "血沉" ? (
        <FlexItem>
          <div>
            <span>
              <FontInput
                addonAfter="mm/H"
                value={item.erythrocyte}
                onChange={(e) => {
                  setReportValue(e.target.value, "erythrocyte")
                }}
              />
            </span>
          </div>
        </FlexItem>
      ) : checkType === "染色体G带核型检查" ? (
        <>
          <FlexItem>
            <div>
              <span>
                <Select
                  value={item.result}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    setReportValue(value, "result")
                  }}
                >
                  {renderOptions(insepectOptions, "276")}
                </Select>
              </span>
            </div>
            {item.result === "未查" || item.result === undefined ? null : (
              <div>
                <span>核型</span>
                <span>
                  <Select
                    style={{ width: "80px" }}
                    dropdownMatchSelectWidth={80}
                    value={item.karyotype}
                    onChange={(val) => {
                      setReportValue(val, "karyotype")
                    }}
                  >
                    {renderOptions(insepectOptions, "318")}
                  </Select>
                </span>
              </div>
            )}
            {item.result === "异常" ? (
              <div>
                <span>临床诊断</span>
                <span>
                  <Input
                    value={item.clinicalDiagnosis}
                    style={{ width: 100 }}
                    onChange={(e) => {
                      setReportValue(e.target.value, "clinicalDiagnosis")
                    }}
                  />
                </span>
              </div>
            ) : null}
          </FlexItem>
        </>
      ) : checkType === "全基因拷贝数变异分析" ? (
        <>
          <FlexItem>
            <div>
              <span>
                <Select
                  value={item.result}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    setReportValue(value, "result")
                  }}
                >
                  {renderOptions(insepectOptions, "276")}
                </Select>
              </span>
            </div>
            {item.result === "正常" ? (
              <>
                <div>
                  <Radio.Group
                    value={item.analysisMethod}
                    onChange={(e) => {
                      setReportValue(e.target.value, "analysisMethod")
                    }}
                  >
                    <Radio value={0}>高通量测序</Radio>
                    <Radio value={1}>基因芯片</Radio>
                  </Radio.Group>
                  {item.analysisMethod === 1 ? (
                    <>
                      <span>类型</span>
                      <span>
                        <Select
                          value={item.type}
                          style={{ width: 210 }}
                          dropdownMatchSelectWidth={200}
                          onChange={(value) => {
                            setReportValue(value, "chipType")
                          }}
                        >
                          {renderOptions(insepectOptions, "277")}
                        </Select>
                      </span>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {item.result === "异常" ? (
              <div>
                <span>
                  <Input
                    value={item.abnormalExplain}
                    style={{ width: 220 }}
                    onChange={(e) => {
                      setReportValue(e.target.value, "abnormalExplain")
                    }}
                  />
                </span>
              </div>
            ) : null}
          </FlexItem>
        </>
      ) : null}
    </div>
  )
}

export const Content = (props) => {
  //设置报告单值
  const setReportValue = (val, param) => {
    props.setReportValue(val, param)
  }
  //设置表格内录入值
  const setProjectsValue = (record, val, param) => {
    props.setProjectsValue(record, val, param)
  }
  const setProjectsValueAdd = (param, index, val) => {
    props.setProjectsValueAdd(param, index, val)
  }
  //切换浓度和精子密度
  const setDegreeType = (val) => {
    props.setDegreeType(val)
  }
  //切换版本
  const setVersion = (val) => {
    props.setVersion(val)
  }
  let {
    checkType,
    item,
    inspectionListParams,
    version,
    degreeType,
    insepectOptions,
    edit,
    addCheckSource,
  } = props
  return (
    <div>
      {checkType === "精液常规分析" ? (
        <>
          <FlexItem style={{ lineHeight: "40px" }}>
            <div>
              <span>禁欲</span>
              <span>
                <FontInput
                  addonAfter="天"
                  value={item.abstinence}
                  onChange={(e) => {
                    setReportValue(e.target.value, "abstinence")
                  }}
                />
              </span>
            </div>
            <div>
              <span>精液</span>
              <span>
                <FontInput
                  addonAfter="ml"
                  value={item.semen}
                  onChange={(e) => {
                    setReportValue(e.target.value, "semen")
                  }}
                />
              </span>
            </div>
            <div>
              <span>色</span>
              <span>
                <Select
                  value={item.color}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    setReportValue(value, "color")
                  }}
                >
                  {renderOptions(insepectOptions, "264")}
                </Select>
              </span>
            </div>
            <div>
              <span>液化</span>
              <span>
                <FontInput
                  addonAfter="min"
                  value={item.liquefaction}
                  onChange={(e) => {
                    setReportValue(e.target.value, "liquefaction")
                  }}
                />
              </span>
            </div>
            <div>
              <span>粘稠度</span>
              <span>
                <Select
                  value={item.viscosity}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    setReportValue(value, "viscosity")
                  }}
                >
                  {renderOptions(insepectOptions, "265")}
                </Select>
              </span>
            </div>
            <div>
              <span>PH值</span>
              <span>
                <Input
                  value={item.phValue}
                  onChange={(e) => {
                    setReportValue(e.target.value, "phValue")
                  }}
                />
              </span>
            </div>
            <div>
              <span>凝集</span>
              <span>
                <Select
                  value={item.agglutination}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    setReportValue(value, "agglutination")
                  }}
                >
                  {renderOptions(insepectOptions, "266")}
                </Select>
              </span>
            </div>
            <div>
              <span>精子总数</span>
              <span>
                <FontInput
                  style={{ width: "110px" }}
                  addonAfter="×10^6"
                  value={item.spermCount}
                  onChange={(e) => {
                    setReportValue(e.target.value, "spermCount")
                  }}
                />
              </span>
            </div>
            {degreeType ? (
              <div>
                <span
                  className="degreeType"
                  onClick={() => setDegreeType(false)}
                >
                  浓度
                </span>
                <span>
                  <FontInput
                    disabled={
                      item.spermDensityFirst && item.spermDensitySecond
                        ? true
                        : false
                    }
                    addonAfter="×10^6"
                    style={{ marginRight: 10, width: "130px" }}
                    value={item.concentration}
                    onChange={(e) => {
                      setReportValue(e.target.value, "concentration")
                    }}
                  />
                </span>
              </div>
            ) : (
              <div>
                <span
                  className="degreeType"
                  onClick={() => setDegreeType(true)}
                >
                  精子密度
                </span>
                <span>
                  <Input
                    style={{ width: 120 }}
                    value={item.spermDensityFirst}
                    disabled={item.concentration ? true : false}
                    onChange={(e) => {
                      setReportValue(e.target.value, "spermDensityFirst")
                    }}
                  />
                </span>
                <span style={{ marginLeft: 10 }}>/</span>
                <span>
                  <Input
                    style={{ width: 60 }}
                    disabled={item.concentration ? true : false}
                    value={item.spermDensitySecond}
                    onChange={(e) => {
                      setReportValue(e.target.value, "spermDensitySecond")
                    }}
                  />
                </span>
                <span>HF</span>
              </div>
            )}
            <div>
              <span>存活率</span>
              <span>
                <FontInput
                  addonAfter="%"
                  value={item.survivalRate}
                  onChange={(e) => {
                    setReportValue(e.target.value, "survivalRate")
                  }}
                />
              </span>
            </div>
            <div>
              <span>白细胞</span>
              <span>
                <Input
                  style={{ width: 60 }}
                  value={item.whiteBloodCellFirst}
                  onChange={(e) => {
                    setReportValue(e.target.value, "whiteBloodCellFirst")
                  }}
                />
              </span>
              <span style={{ marginLeft: 10 }}>-</span>
              <span>
                <Input
                  style={{ width: 60 }}
                  value={item.whiteBloodCellSecond}
                  onChange={(e) => {
                    setReportValue(e.target.value, "whiteBloodCellSecond")
                  }}
                />
              </span>
              <span>HPF</span>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              {edit ? (
                <>
                  {inspectionListParams.length === 3 ? (
                    <span
                      onClick={() => setVersion("精液常规分析五版")}
                      className="version"
                    >
                      四版
                    </span>
                  ) : (
                    <span
                      onClick={() => setVersion("精液常规分析四版")}
                      className="version"
                    >
                      五版
                    </span>
                  )}
                </>
              ) : (
                <>
                  {version === "精液常规分析五版" ? (
                    <span
                      onClick={() => setVersion("精液常规分析四版")}
                      className="version"
                    >
                      五版
                    </span>
                  ) : (
                    <span
                      onClick={() => setVersion("精液常规分析五版")}
                      className="version"
                    >
                      四版
                    </span>
                  )}
                </>
              )}
            </div>
          </FlexItem>
          <CommonTable
            checkType={checkType}
            inspectionListParams={inspectionListParams}
            insepectOptions={insepectOptions}
            setProjectsValue={setProjectsValue}
          />
        </>
      ) : checkType === "精浆酶学分析" ? (
        <FlexItem>
          <div className="flexgrow">
            <span>其他</span>
            <Input
              value={item.other}
              style={{ flexGrow: 1 }}
              onChange={(e) => {
                setReportValue(e.target.value, "other")
              }}
            />
          </div>
        </FlexItem>
      ) : checkType === "AZF基因缺失检测" ? (
        <>
          <FlexItem>
            <div>
              <span>
                AZF a区
                <Radio.Group
                  value={item.azfaArea}
                  onChange={(e) => {
                    setReportValue(e.target.value, "azfaArea")
                  }}
                >
                  <Radio value={0}>存在</Radio>
                  <Radio value={1}>缺失</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>
                AZF b区
                <Radio.Group
                  value={item.azfbArea}
                  onChange={(e) => {
                    setReportValue(e.target.value, "azfbArea")
                  }}
                >
                  <Radio value={0}>存在</Radio>
                  <Radio value={1}>缺失</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>
                AZF c区
                <Radio.Group
                  value={item.azfcArea}
                  onChange={(e) => {
                    setReportValue(e.target.value, "azfcArea")
                  }}
                >
                  <Radio value={0}>存在</Radio>
                  <Radio value={1}>缺失</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>
                AZF d区
                <Radio.Group
                  value={item.azfdArea}
                  onChange={(e) => {
                    setReportValue(e.target.value, "azfdArea")
                  }}
                >
                  <Radio value={0}>存在</Radio>
                  <Radio value={1}>缺失</Radio>
                </Radio.Group>
              </span>
            </div>
          </FlexItem>
          <FlexItem>
            <div className="flexgrow">
              <span>临床诊断</span>
              <Input
                style={{ flexGrow: 1 }}
                value={item.clinicalDiagnosis}
                onChange={(e) => {
                  setReportValue(e.target.value, "clinicalDiagnosis")
                }}
              />
            </div>
          </FlexItem>
        </>
      ) : checkType === "睾丸活检" ? (
        <>
          <FlexItem>
            <div>
              <span>结果</span>
              <span>
                <Select
                  value={item.result}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    setReportValue(value, "result")
                  }}
                >
                  {renderOptions(insepectOptions, "63")}
                </Select>
              </span>
            </div>
            <div>
              <span>镜检</span>
              <span>
                <Select
                  value={item.microscopy}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    setReportValue(value, "microscopy")
                  }}
                >
                  {renderOptions(insepectOptions, "269")}
                </Select>
              </span>
            </div>
            <div className="flexgrow">
              <span>备注</span>
              <Input
                value={item.other}
                style={{ flexGrow: 1 }}
                onChange={(e) => {
                  setReportValue(e.target.value, "other")
                }}
              />
            </div>
          </FlexItem>
          <FlexItem>
            <div style={{ width: "24%" }}>
              <span>病理报告</span>
              <Input
                value={item.caseReport}
                style={{ width: 197 }}
                onChange={(e) => {
                  setReportValue(e.target.value, "caseReport")
                }}
              />
            </div>
            <div className="flexgrow">
              <span>详述</span>
              <Input
                value={item.detail}
                style={{ flexGrow: 1 }}
                onChange={(e) => {
                  setReportValue(e.target.value, "detail")
                }}
              />
            </div>
          </FlexItem>
        </>
      ) : checkType === "阴道分泌物" ? (
        <>
          <FlexItem>
            <div>
              <span>
                滴虫
                <Radio.Group
                  value={item.trichomonas}
                  onChange={(e) => {
                    setReportValue(e.target.value, "trichomonas")
                  }}
                >
                  <Radio value={0}>未检出</Radio>
                  <Radio value={1}>检出</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>
                霉菌
                <Radio.Group
                  value={item.mold}
                  onChange={(e) => {
                    setReportValue(e.target.value, "mold")
                  }}
                >
                  <Radio value={0}>未检出</Radio>
                  <Radio value={1}>检出</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>
                假丝酵母菌
                <Radio.Group
                  value={item.pseudomycetes}
                  onChange={(e) => {
                    setReportValue(e.target.value, "pseudomycetes")
                  }}
                >
                  <Radio value={0}>未检出</Radio>
                  <Radio value={1}>检出</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>
                线索细胞
                <Radio.Group
                  value={item.threadedCells}
                  onChange={(e) => {
                    setReportValue(e.target.value, "threadedCells")
                  }}
                >
                  <Radio value={0}>未检出</Radio>
                  <Radio value={1}>检出</Radio>
                </Radio.Group>
              </span>
            </div>
          </FlexItem>
          <CommonTable
            checkType={checkType}
            inspectionListParams={inspectionListParams}
            insepectOptions={insepectOptions}
            setProjectsValue={setProjectsValue}
          />
        </>
      ) : checkType === "HC2" ? (
        <FlexItem>
          <div className="flexgrow">
            <span>诊断</span>
            <Input
              value={item.clinicalDiagnosis}
              style={{ flexGrow: 1 }}
              onChange={(e) => {
                setReportValue(e.target.value, "clinicalDiagnosis")
              }}
            />
          </div>
        </FlexItem>
      ) : checkType === "胰岛素释放" ? (
        <FlexItem>
          <div>
            <span>空腹胰岛素</span>
            <span>
              <FontInput
                addonAfter="uU/ml"
                value={item.fastinginsulin}
                onChange={(e) => {
                  setReportValue(e.target.value, "fastinginsulin")
                }}
              />
            </span>
          </div>
        </FlexItem>
      ) : checkType === "血型" || checkType === "HCV" ? (
        <FlexItem>
          <div className="flexgrow">
            <span>详述</span>
            <Input
              value={item.detail}
              style={{ flexGrow: 1 }}
              onChange={(e) => {
                setReportValue(e.target.value, "detail")
              }}
            />
          </div>
        </FlexItem>
      ) : checkType === "单基因遗传病检测" ? (
        <>
          <FlexItem>
            <div className="flexgrow">
              <span>致病基因</span>
              <Input
                value={item.pathogeniGene}
                style={{ flexGrow: 1 }}
                onChange={(e) => {
                  setReportValue(e.target.value, "pathogeniGene")
                }}
              />
            </div>
            <div className="flexgrow">
              <span>具体位点</span>
              <Input
                value={item.specificSites}
                style={{ flexGrow: 1 }}
                onChange={(e) => {
                  setReportValue(e.target.value, "specificSites")
                }}
              />
            </div>
            <div className="flexgrow">
              <span>遗传方式</span>
              <Select
                value={item.geneticPattern}
                style={{ flexGrow: 1, textAlign: "left" }}
                onChange={(value) => {
                  setReportValue(value, "geneticPattern")
                }}
              >
                {renderOptions(insepectOptions, "277")}
              </Select>
            </div>
          </FlexItem>
          <FlexItem>
            <div className="flexgrow">
              <span>遗传病临床诊断</span>
              <Input
                value={item.hereditaryDiseases}
                style={{ flexGrow: 1 }}
                onChange={(e) => {
                  setReportValue(e.target.value, "hereditaryDiseases")
                }}
              />
            </div>
          </FlexItem>
        </>
      ) : checkType === "尿道分泌物" ? (
        <UrethralSecretion
          inspectionListParams={inspectionListParams}
          setProjectsValue={setProjectsValue}
        />
      ) : checkType === "宫颈TCT" ||
        checkType === "HPV" ||
        checkType === "AMH" ||
        checkType === "HIV" ||
        checkType === "染色体" ||
        checkType === "染色体G带核型检查" ||
        checkType === "全基因拷贝数变异分析" ||
        checkType === "血沉" ||
        checkType === "地贫" ? null : addCheckSource === 1 ? (
        <CommonTableAdd
          checkType={checkType}
          inspectionListParams={inspectionListParams}
          insepectOptions={insepectOptions}
          setProjectsValue={setProjectsValue}
          setProjectsValueAdd={setProjectsValueAdd}
        />
      ) : (
        <CommonTable
          checkType={checkType}
          inspectionListParams={inspectionListParams}
          insepectOptions={insepectOptions}
          setProjectsValue={setProjectsValue}
        />
      )}
    </div>
  )
}
