import React, { Component } from "react"
import { DateTitleView } from "@/app/components/normal/Title"
import { BaseTable } from "@/app/components/base/baseTable"
import { FlexItem } from "@/app/components/base/baseForms.js"
import "./index.scss"

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tListLength: 0,
      number: 0,
      frozenIndex: 0,
      idNumber: "341126198810143623",
      methodTag: true,
      labData: {
        inseminationMethod: "IVF,ICSI",
        transplantationList: [{}],
        frozenConditionList: [
          {
            index: 1,
            developmentDay: "D3",
            inseminationMethod: "IVF",
            evaluation: "8-1-2 II",
            frozenNum: "0923",
            frozenTubeNum: "09",
            position: "2罐1提1层1格",
            marker: "O红",
          },
          {
            index: 2,
            developmentDay: "D6",
            inseminationMethod: "IVF",
            evaluation: "4AAA II",
            frozenNum: "",
            frozenTubeNum: "",
            position: "",
            marker: "",
          },
        ],
      },
    }
  }

  componentDidMount() {
    this.initLabInfo()
  }
  //初始化实验室
  initLabInfo = () => {}

  render() {
    let { labData } = this.state
    let columns = [
      {
        title: "序号",
        dataIndex: "index",
        key: "index",
      },
      {
        title: "发育天数",
        dataIndex: "developmentDay",
        key: "developmentDay",
      },
      {
        title: "授精方式",
        dataIndex: "inseminationMethod",
        key: "inseminationMethod",
      },
      {
        title: "评价",
        dataIndex: "evaluation",
        key: "evaluation",
      },
      {
        title: "编号",
        dataIndex: "frozenNum",
        key: "frozenNum",
      },
      {
        title: "管号",
        dataIndex: "frozenTubeNum",
        key: "frozenTubeNum",
      },
      {
        title: "位置",
        dataIndex: "position",
        key: "position",
      },
      {
        title: "标记",
        dataIndex: "marker",
        key: "marker",
      },
    ]
    let inseminateColumns = [
      {
        title: "授精方式",
        dataIndex: "index",
        key: "index",
      },
      {
        title: "MII",
        dataIndex: "developmentDay",
        key: "developmentDay",
      },
      {
        title: "2Pb",
        dataIndex: "inseminationMethod",
        key: "inseminationMethod",
      },
      {
        title: "2Pn",
        dataIndex: "evaluation",
        key: "evaluation",
      },
      {
        title: "0Pn",
        dataIndex: "frozenNum",
        key: "frozenNum",
      },
      {
        title: "1Pn",
        dataIndex: "frozenTubeNum",
        key: "frozenTubeNum",
      },
      {
        title: "≥3Pn",
        dataIndex: "position",
        key: "position",
      },
      {
        title: "卵裂数",
        dataIndex: "marker",
        key: "marker",
      },
      {
        title: "2Pn卵裂数",
        dataIndex: "marker",
        key: "marker",
      },
      {
        title: "优质胚胎数",
        dataIndex: "marker",
        key: "marker",
      },
      {
        title: "可移植胚胎数",
        dataIndex: "marker",
        key: "marker",
      },
      {
        title: "囊胚培养数",
        dataIndex: "marker",
        key: "marker",
      },
      {
        title: "囊胚形成数",
        dataIndex: "marker",
        key: "marker",
      },
      {
        title: "高评分囊胚数",
        dataIndex: "marker",
        key: "marker",
      },
    ]
    return (
      <div className="lab">
        {/* 新鲜 */}
        <DateTitleView
          title="获卵情况"
          style={{ marginRight: 0, marginBottom: 0 }}
        >
          <FlexItem>
            <div>
              <span>穿刺卵泡</span>
              <span className="span_underline" style={{ width: 40 }}></span>
              <span>个</span>
            </div>
            <div>
              <span>获卵：</span>
            </div>
            <div>
              <span>L：</span>
              <span className="span_underline" style={{ width: 40 }}></span>
              <span>枚</span>
              <span style={{ marginLeft: 10 }}>R：</span>
              <span className="span_underline" style={{ width: 40 }}></span>
              <span>枚</span>
            </div>
            <div>
              <span>OCCC：</span>
              <span className="span_underline" style={{ width: 40 }}></span>
              <span>枚</span>
            </div>
            <div>
              <span>穿刺卵泡</span>
              <span className="span_underline" style={{ width: 40 }}></span>
              <span>个</span>
            </div>
          </FlexItem>
        </DateTitleView>
        <DateTitleView
          title="精子情况"
          style={{ marginRight: 0, marginBottom: 0 }}
        >
          <FlexItem>
            <div>
              <span className="span_underline"></span>
            </div>
            <div>
              <span>处理后：</span>
              <span className="span_underline"></span>
              <span>ml</span>
              <span
                className="span_underline"
                style={{ marginLeft: 15 }}
              ></span>
              <span>
                ×10<sup>6</sup>
              </span>
            </div>
            <div>
              <span>活率：</span>
              <span className="span_underline"></span>
              <span>%</span>
            </div>
            <div>
              <span>PR：</span>
              <span className="span_underline"></span>
              <span>%</span>
            </div>
            <div>
              <span>NP：</span>
              <span className="span_underline"></span>
              <span>%</span>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span className="span_underline"></span>
            </div>
            <div>
              <span>活动精子：</span>
              <span className="span_underline"></span>
              <span>/</span>
              <span className="span_underline"></span>
              <span>HPF</span>
            </div>
            <div>
              <span>曲细精管：</span>
              <span className="span_underline"></span>
            </div>
            <div>
              <span>活力：</span>
              <span className="span_underline"></span>
            </div>
          </FlexItem>
        </DateTitleView>
        <DateTitleView
          title="授精情况"
          style={{ marginRight: 0, marginBottom: 0 }}
        >
          <BaseTable
            style={{ margin: "13px 22px" }}
            columns={inseminateColumns}
            dataSource={labData.frozenConditionList}
            pagination={false}
            rowKey={(record) => record.index}
          />
        </DateTitleView>
        {/* 复苏 */}
        <DateTitleView
          title="解冻情况"
          style={{ marginRight: 0, marginBottom: 0 }}
        >
          <FlexItem>
            <div>
              <span>解冻胚胎</span>
              <span className="span_underline"></span>
              <span>枚</span>
            </div>
            <div>
              <span>存活</span>
              <span className="span_underline"></span>
              <span>枚</span>
            </div>
            <div>
              <span>完全存活</span>
              <span className="span_underline"></span>
              <span>枚</span>
            </div>
            <FlexItem>
              <div>
                <span>解冻囊胚</span>
                <span className="span_underline"></span>
                <span>枚</span>
              </div>
              <div>
                <span>解冻后冻存胚胎</span>
                <span className="span_underline"></span>
                <span>枚</span>
              </div>
              <div>
                <span>囊胚</span>
                <span className="span_underline"></span>
                <span>枚</span>
              </div>
            </FlexItem>
          </FlexItem>
        </DateTitleView>
        <DateTitleView
          title="解冻后培养情况"
          style={{ marginRight: 0, marginBottom: 0 }}
        >
          <FlexItem>
            <div>
              <span>囊胚培养</span>
              <span className="span_underline"></span>
              <span>枚</span>
            </div>
            <div>
              <span>囊胚形成</span>
              <span className="span_underline"></span>
              <span>枚</span>
            </div>
            <div>
              <span>优质囊胚</span>
              <span className="span_underline"></span>
              <span>枚</span>
            </div>
          </FlexItem>
        </DateTitleView>
        {/* 移植情况 */}
        <DateTitleView
          title="移植情况"
          style={{ marginRight: 0, marginBottom: 0 }}
        >
          <FlexItem>
            <div>
              <span>胚胎移植日：</span>
              <span className="span_underline" style={{ width: 90 }}>
                2020-10-20
              </span>
            </div>
            <div>
              <span>移植</span>
              <span className="span_underline" style={{ width: 30 }}></span>
              <span>枚</span>
            </div>
            <div>
              <span>评分：</span>
              <span className="span_underline"></span>
            </div>
            <div style={{ marginLeft: 80 }}>
              <span>囊胚移植日：</span>
              <span className="span_underline" style={{ width: 90 }}>
                2020-10-20
              </span>
            </div>
            <div>
              <span>移植</span>
              <span className="span_underline" style={{ width: 30 }}></span>
              <span>枚</span>
            </div>
            <div>
              <span>评分：</span>
              <span className="span_underline"></span>
            </div>
          </FlexItem>
        </DateTitleView>
        <DateTitleView title="PGD" style={{ marginRight: 0, marginBottom: 0 }}>
          <FlexItem>
            <div>
              <span>活检胚胎</span>
              <span className="span_underline" style={{ width: 30 }}>
                14
              </span>
              <span>枚</span>
            </div>
            <div>
              <span>活检囊胚</span>
              <span className="span_underline" style={{ width: 30 }}></span>
              <span>枚</span>
            </div>
            <div>
              <span>正常胚胎</span>
              <span className="span_underline" style={{ width: 30 }}></span>
              <span>枚</span>
            </div>
          </FlexItem>
        </DateTitleView>
        <DateTitleView title="PGS" style={{ marginRight: 0, marginBottom: 0 }}>
          <FlexItem>
            <div>
              <span>活检胚胎</span>
              <span className="span_underline" style={{ width: 30 }}>
                14
              </span>
              <span>枚</span>
            </div>
            <div>
              <span>活检囊胚</span>
              <span className="span_underline" style={{ width: 30 }}></span>
              <span>枚</span>
            </div>
            <div>
              <span>正常胚胎</span>
              <span className="span_underline" style={{ width: 30 }}></span>
              <span>枚</span>
            </div>
          </FlexItem>
        </DateTitleView>
        <DateTitleView
          title="冷冻情况"
          style={{ marginRight: 0, marginBottom: 0 }}
        >
          <FlexItem>
            <div>
              <span>日期：</span>
              <span className="span_underline" style={{ width: 90 }}></span>
            </div>
          </FlexItem>
          <BaseTable
            style={{ margin: "13px 22px" }}
            columns={columns}
            dataSource={labData.frozenConditionList}
            pagination={false}
            rowKey={(record) => record.index}
          />
        </DateTitleView>
        <DateTitleView
          title="废弃卵、精子、胚胎"
          style={{ marginRight: 0, marginBottom: 0 }}
        >
          <FlexItem style={{ marginBottom: 20 }}>
            <div>
              <span>处理方式：</span>
              <span className="span_underline" style={{ width: 80 }}></span>
            </div>
            <div>
              <span>废弃者：</span>
              <span className="span_underline"></span>
            </div>
            <div>
              <span>核实者：</span>
              <span className="span_underline"></span>
            </div>
            <div>
              <span>处理日期：</span>
              <span className="span_underline" style={{ width: 70 }}></span>
            </div>
            <div>
              <span>其他：</span>
              <span className="span_underline" style={{ width: 360 }}></span>
            </div>
          </FlexItem>
        </DateTitleView>
      </div>
    )
  }
}
