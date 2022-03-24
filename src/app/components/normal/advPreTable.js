import React from "react"
import { inject } from "mobx-react"
import styled from "styled-components"
import { BaseModal } from "@/app/components/base/baseModal"
import AdvPreChart from "@/app/components/normal/advPreChart"
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AlignCenterOutlined,
  BarChartOutlined,
} from "@ant-design/icons"
import { deepClone } from "@/app/utils/tool.js"
import apis from "@/app/utils/apis"

//卵泡监测 医嘱用要table
const OvumModaltable = styled.table`
  text-align: center;
  border-collapse: collapse;
  margin: 1em auto;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  td {
    border: 1px solid #000;
    padding: 0 2px;
  }
  thead {
    background: #fafafa;
    td {
      height: 40px;
      line-height: 40px;
    }
  }
  tbody {
    td {
      width: ${(props) => props.tdWidth};
      height: 30px;
      word-break: break-all;
      line-height: 30px;
    }
    td:last-child {
      width: 100px;
    }
  }
`
const TrStyle = styled.tr`
  :hover {
    background-color: #edf6fd;
  }
`

let resData = [] //请求获取的表格数据
let spliceData = [] //请求后截取的表格数据

export default
@inject("moredetail", "store")
class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      medColspan: 1, // 用药合并列
      bloColspan: 1, // 血激素合并列
      spredVisible: false, // 是否展开用药table
      spredType: false, // 展开收起状态
      tdWidth: 0, // table列宽
      dataSource: [], //表格数据
      type: props.type,
      initFlag: false,
      naturalType: true, //切换血激素表头值
      naturalHead: [], //血激素表头
      chartVisiable: false, //血激素折线图
    }
  }

  componentDidMount() {
    let { type } = this.props
    this.judgeShow(type)
    this.props.onRef && this.props.onRef(this)
  }
  UNSAFE_componentWillReceiveProps(nextprops) {
    if (this.props.type !== nextprops.type) {
      this.judgeShow(nextprops.type)
    }
  }
  // 判断应该使用哪个视图
  judgeShow = (type) => {
    let { resumePeople, select_one } = this.props.store
    let select = JSON.parse(localStorage.getItem("patient"))
    switch (type) {
      case "clinic":
        this.getVisView(resumePeople ? select : select_one)
        break
      case "mdecine":
        this.getMedView(resumePeople ? select : select_one)
        break
      default:
        break
    }
  }
  //设置 和并列，用药是否展开
  setCols = (data) => {
    let { checkArrisEmpty } = this.props.moredetail
    let { medColspan, bloColspan, tdWidth } = this.state
    if (!checkArrisEmpty(data)) {
      //计算表格列数
      let medCol =
        data[0].medicationHead.length === 0 ? 1 : data[0].medicationHead.length
      let tableWidth = document.getElementById("advTable")
        ? document.getElementById("advTable").offsetWidth
        : "500px"
      let tds = medCol + 8 + 9 //总的列数
      tdWidth = `${Math.floor(tableWidth / tds)}px` //每一列的宽度
      medColspan = medCol //用药占多少列
      bloColspan = 4 //血激素水平占多少列
      this.setState({
        medColspan,
        bloColspan,
        tdWidth,
      })
    }
  }
  //根据用药长度，设置表格中数据
  setDatasource = (data) => {
    let { dataSource } = this.state
    //存入原始请求数据
    resData = deepClone(data)
    if (data && data.length > 0 && data[0].medicationHead.length > 3) {
      //用药大于三列时仅显示3列，其他收起，此处做数据处理
      data.forEach((item, i) => {
        if (i === 0) {
          item.medicationHead.splice(0, 3)
        }
        item.medication.splice(0, 3)
        this.setState({
          spredVisible: true,
        })
      })
    }
    spliceData = data
    dataSource = spliceData
    this.setCols(spliceData)
    this.setState({
      dataSource,
    })
  }
  //获取用药视图
  getMedView = (data) => {
    let { select_one } = this.props.store
    apis.Patients_monitor.getMedInit(data ? data : select_one).then((res) => {
      if (res.code === 200) {
        this.setState({
          initFlag: true,
        })
        this.setDatasource(res.data)
        this.setCols(res.data)
      }
    })
  }
  //获取门诊视图
  getVisView = (data) => {
    let { select_one } = this.props.store
    apis.Patients_monitor.getVisInit(data ? data : select_one).then((res) => {
      this.setState({
        initFlag: true,
        naturalHead:
          res.data[0] && res.data[0].bloodHormoneHead
            ? res.data[0].bloodHormoneHead
            : [],
      })
      this.setDatasource(res.data)
      this.setCols(res.data)
    })
  }
  // 点击行
  checkRow = (index) => {
    let { dataSource } = this.state
    dataSource.forEach((item, indexs) => {
      if (index === indexs) {
        this.props.changeDate(item.monitorDate)
      }
    })
  }
  // 展开收起用药多余列
  spredMed = (val) => {
    let { dataSource, medColspan } = this.state
    this.setState({
      spredType: val,
    })
    dataSource = val ? resData : spliceData
    medColspan = dataSource[0].medicationHead.length //用药占多少列
    this.setState({
      dataSource: [...dataSource],
      medColspan,
    })
  }
  // 切换血激素的表头
  checkNatural = () => {
    let { naturalType } = this.state
    this.setState({
      naturalType: !naturalType,
    })
  }
  //血激素折线图
  chartShow = () => {
    let { chartVisiable } = this.state
    this.setState({
      chartVisiable: !chartVisiable,
    })
  }
  // 判断图标
  judgeIcon = (item, olditem) => {
    let data = 1
    item = item ?? item ? parseFloat(item) : 0
    olditem = olditem ?? olditem ? parseFloat(olditem) : 0
    if (item === olditem) {
      data = null
    } else if (item > olditem) {
      data = (
        <svg className="icon_s">
          <use xlinkHref="#iconrise" />
        </svg>
      )
    } else {
      data = (
        <svg className="icon_s">
          <use xlinkHref="#iconfall" />
        </svg>
      )
    }
    return data
  }
  // 应该和哪个值进行判断
  judgeIndex = (index, length, dataSource) => {
    let iJudge = 1
    for (let i = 1; i < length; i++) {
      if (
        dataSource[index - i] &&
        dataSource[index - i].bloodHormoneViews &&
        dataSource[index - i].bloodHormoneViews.length > 0
      ) {
        iJudge = i
      }
    }
    return index - iJudge
  }
  render() {
    let { checkArrisEmpty } = this.props.moredetail
    let {
      medColspan,
      bloColspan,
      tdWidth,
      dataSource,
      spredVisible,
      spredType,
      initFlag,
      naturalType,
      naturalHead,
      chartVisiable,
    } = this.state
    let { currentPersonName } = this.props
    return (
      <div id="advTable" style={{ minWidth: "500px", padding: "10px 10px" }}>
        {dataSource && dataSource.length > 0 && initFlag ? (
          <>
            <OvumModaltable
              border="1"
              cellspacing="0"
              cellpadding="0"
              tdWidth={tdWidth}
            >
              {/* 表头 */}
              <thead>
                <tr>
                  <td>日期</td>
                  <td>月经</td>
                  <td colSpan="2">左侧卵巢</td>
                  <td colSpan="2">右侧卵巢</td>
                  <td>子宫</td>
                  <td colSpan={medColspan}>
                    <span style={{ paddingRight: "10px" }}>用药</span>
                    {spredVisible ? (
                      spredType ? (
                        <MenuFoldOutlined
                          onClick={() => this.spredMed(false)}
                        />
                      ) : (
                        <MenuUnfoldOutlined
                          onClick={() => this.spredMed(true)}
                        />
                      )
                    ) : null}
                  </td>
                  <td colSpan={bloColspan} style={{ width: "35%" }}>
                    血激素化验
                    <AlignCenterOutlined
                      onClick={this.checkNatural}
                      className="checkNatural"
                    />
                    <BarChartOutlined
                      className="checkNatural"
                      onClick={this.chartShow}
                    />
                  </td>
                  <td>B超录入</td>
                  <td>B超医生</td>
                  <td>医生</td>
                  <td>备注</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td>大小(cm)</td>
                  <td>卵泡(mm)</td>
                  <td>大小(cm)</td>
                  <td>卵泡(mm)</td>
                  <td>内膜(mm)分型</td>
                  {!checkArrisEmpty(dataSource[0].medicationHead) ? (
                    dataSource[0].medicationHead.map((med, i) => {
                      return <td key={i}> {med} </td>
                    })
                  ) : (
                    <td>-</td>
                  )}
                  <td colSpan={bloColspan} style={{ width: "35%" }}>
                    {naturalType ? (
                      <div className="naturalHead">
                        {naturalHead.map((item, index) => {
                          return (
                            <div key={index}>
                              {item.split("(")[0]}
                              <div>{`(${item.split("(")[1]}`}</div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      "血激素值"
                    )}
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {dataSource.length > 0 &&
                  dataSource.map((item, index) => {
                    return (
                      <TrStyle
                        key={index}
                        onClick={() => this.checkRow(index)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{item.monitorDate}</td>
                        <td>{item.afterMenstruation}</td>
                        <td>{item.leftOvaryVolume}</td>
                        <td>
                          {!checkArrisEmpty(item.leftFollicles) ? (
                            <>
                              {item &&
                                item.leftFollicles &&
                                item.leftFollicles.map((detail, indexd) => {
                                  return <div key={indexd}>{detail}</div>
                                })}
                              <div className="colorred">
                                ({item.leftFolliclesTotal})
                              </div>
                            </>
                          ) : null}
                        </td>
                        <td>{item.rightOvaryVolume}</td>
                        <td>
                          {!checkArrisEmpty(item.rightFollicles) ? (
                            <>
                              {item &&
                                item.rightFollicles &&
                                item.rightFollicles.map((detail, indexd) => {
                                  return <div key={indexd}>{detail}</div>
                                })}
                              <div className="colorred">
                                ({item.rightFolliclesTotal})
                              </div>
                            </>
                          ) : null}
                        </td>
                        <td>
                          <div>{item.innerMembrane}</div>
                          <div>{item.typing}</div>
                        </td>
                        {!checkArrisEmpty(item.medication) ? (
                          item &&
                          item.medication &&
                          item.medication.map((medival, i) => {
                            return <td key={i}>{medival.replace("*1", "")}</td>
                          })
                        ) : (
                          <td></td>
                        )}
                        <td colSpan={bloColspan} style={{ width: "30%" }}>
                          {naturalType ? (
                            <>
                              {item &&
                                item.bloodHormoneViews &&
                                item.bloodHormoneViews.length > 0 &&
                                item.bloodHormoneViews.map((itemb, indexb) => {
                                  return (
                                    <div
                                      className={`mointorHead ${
                                        item.bloodHormoneViews.length > 1
                                          ? "borderNatural"
                                          : null
                                      }`}
                                      key={indexb}
                                    >
                                      {itemb &&
                                        itemb.length > 0 &&
                                        itemb.map((itemi, indexi) => {
                                          return (
                                            <div key={itemi + indexi}>
                                              {itemi}
                                              <span>
                                                {index &&
                                                index > 0 &&
                                                indexb === 0 ? (
                                                  <>
                                                    {this.judgeIcon(
                                                      itemi,
                                                      dataSource[
                                                        this.judgeIndex(
                                                          index,
                                                          dataSource.length,
                                                          dataSource
                                                        )
                                                      ].bloodHormoneViews[
                                                        dataSource[
                                                          this.judgeIndex(
                                                            index,
                                                            dataSource.length,
                                                            dataSource
                                                          )
                                                        ].bloodHormoneViews
                                                          .length - 1
                                                      ][indexi]
                                                    )}
                                                  </>
                                                ) : index === 0 &&
                                                  indexb === 0 ? null : (
                                                  <>
                                                    {this.judgeIcon(
                                                      itemi,
                                                      item.bloodHormoneViews[
                                                        indexb - 1
                                                      ][indexi]
                                                    )}
                                                  </>
                                                )}
                                              </span>
                                            </div>
                                          )
                                        })}
                                    </div>
                                  )
                                })}
                            </>
                          ) : (
                            <>
                              {item &&
                                item.bloodHormoneDetail &&
                                item.bloodHormoneDetail.map((ites, i) => {
                                  return (
                                    <div
                                      style={{ marginBottom: "10px" }}
                                      key={i}
                                    >
                                      {ites.map((itemi, indexi) => {
                                        return (
                                          <span key={indexi}>{itemi},</span>
                                        )
                                      })}
                                    </div>
                                  )
                                })}
                            </>
                          )}
                        </td>
                        <td>{item.ultrasoundRecorder}</td>
                        <td>{item.ultrasoundDoctor}</td>
                        <td>{item.doctor}</td>
                        <td>{item.note}</td>
                      </TrStyle>
                    )
                  })}
              </tbody>
            </OvumModaltable>
          </>
        ) : null}
        <BaseModal
          width="920px"
          onCancel={this.chartShow}
          visible={chartVisiable}
          footer={null}
          closable={false}
        >
          <AdvPreChart
            patientName={currentPersonName}
            close={this.chartShow}
            chartData={dataSource}
          />
        </BaseModal>
      </div>
    )
  }
}
