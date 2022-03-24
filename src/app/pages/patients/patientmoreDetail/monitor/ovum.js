import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { LeftOutlined, RightOutlined, MinusOutlined } from "@ant-design/icons"
import { Select, Switch, Input, message } from "antd"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { DashBtn } from "@/app/components/base/baseBtn"
import { BaseTable } from "@/app/components/base/baseTable"
import { checkArrisEmpty } from "@/app/utils/tool.js"
import { monitor_curDate } from "@/app/utils/const.js"
import { ovaDTODefault } from "./defaultData"
import styled from "styled-components"
import apis from "@/app/utils/apis"
import moment from "moment"
import "./index.scss"

export const TableContent = styled.div`
  margin: 20px;
  display: flex;
  justify-content: center;
  .ant-table-wrapper {
    margin: 0;
  }
  .checked_boredr {
    border: 1px solid #59b4f4;
  }
  .background_grey {
    background: #f6f6f6;
  }
`
export const Sidecheck = styled.div`
  width: 160px;
  cursor: pointer;
  line-height: 35px;
  text-align: center;
  border: 1px solid #eee;
  > div {
    border-bottom: 1px solid #eee;
  }
  > div:last-child {
    border-bottom: 0;
  }
`
export const OvumModaltable = styled.table`
  text-align: center;
  border-collapse: collapse;
  margin-top: 1em;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  td {
    border: 1px solid #eee;
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
      width: ${(props) => props.tdWidth || "50px"};
      height: 24px;
      word-break: break-all;
      line-height: 24px;
      > div {
        height: 15px;
        line-height: 15px;
      }
    }
    td:last-child {
      width: 100px;
    }
  }
`
export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      folliceSide: 1, //卵泡方向    1左0右
      dataList: [],
      dataSource: [], //默认先出左卵泡
      follicleLeft: ovaDTODefault.leftOvarianFollicleDTOList, //左卵巢table数据
      follicleRight: ovaDTODefault.rightOvarianFollicleDTOList, // //右卵巢table数据
      initFlag: false,
      follicleMonitoringDTO: {}, //卵泡监测DTO(B超) 长宽高,统计
      ovarianFollicleValue: null,
      new_select: {},
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    let { select_one } = this.props.store
    let select = JSON.parse(localStorage.getItem("patient"))
    this.getOvum(this.props.store.resumePeople ? select : select_one)
    document.addEventListener("keydown", this.handleOnKeyDown)
  }

  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    let { select_one } = this.props.store
    if (nextProps.lMPDate !== this.props.lMPDate) {
      this.setState({
        initFlag: false,
      })
      this.getOvum(select_one)
    }
    if (nextProps.date !== this.props.date) {
      select_one.date = nextProps.date
      this.setState({
        initFlag: false,
      })
      this.getOvum(select_one)
    }
  }
  //添加key和delflag
  putParam = (data) => {
    const { dataSource } = this.state
    data.forEach((item, i) => {
      item.key = i
      item.delflag = 1
    })
    let defaultObj = {
      diameterMin: null,
      diameterMax: null,
      count: 1,
      delflag: 0,
    }
    defaultObj.key = dataSource.length
    data.push(defaultObj)
  }
  //获取周期信息
  getOvum = (people) => {
    let { select_one } = this.props.store
    apis.Patients_monitor.getOvumInit(people ? people : select_one).then(
      (res) => {
        if (res.code === 200) {
          this.reviseData(res.data)
        } else {
          this.setState({
            follicleMonitoringDTO: { monitorDate: monitor_curDate },
            initFlag: true,
          })
          message.error(res.message)
        }
      }
    )
  }
  // 获取数据
  reviseData = (data) => {
    let {
      // follicleMonitoringDTO,
      ovarianFollicleValue,
      follicleLeft,
      follicleRight,
    } = this.state
    //卵泡长宽高
    let follicle = data.follicleMonitoringDTO
    if (follicle.monitorDate === null) {
      follicle.monitorDate = monitor_curDate
    }

    let ovaArr = data.ovarianFollicleValue
    ovarianFollicleValue = ovaArr
    this.putParam(ovaArr.leftOvarianFollicleDTOList)
    this.putParam(ovaArr.rightOvarianFollicleDTOList)
    //左卵巢卵泡情况
    follicleLeft = ovaArr.leftOvarianFollicleDTOList
    //右卵巢卵泡情况
    follicleRight = ovaArr.rightOvarianFollicleDTOList

    this.setState({
      dataList: data,
      follicleMonitoringDTO: follicle,
      ovarianFollicleValue,
      follicleLeft,
      follicleRight,
      initFlag: true,
    })
    this.setSide(1)
  }
  //选择卵泡左右
  setSide = (val) => {
    let { dataSource, folliceSide, follicleLeft, follicleRight } = this.state
    dataSource = val ? follicleLeft : follicleRight
    folliceSide = parseInt(val)
    this.setState({
      folliceSide,
      dataSource: [...dataSource],
    })
  }
  //输入框取值
  setObjVal = async (obj, param, val) => {
    obj[param] = val
    await this.setState({
      obj,
    })
  }
  // 计算卵泡大小
  calSize = (obj, parm) => {
    if (parm.indexOf("left") > -1) {
      obj.leftOvaryVolume =
        obj.leftOvaryLength +
        " *" +
        obj.leftOvaryWidth +
        " *" +
        obj.leftOvaryHeight
    }
    if (parm.indexOf("right") > -1) {
      obj.rightOvaryVolume =
        obj.rightOvaryLength +
        " *" +
        obj.rightOvaryWidth +
        " *" +
        obj.rightOvaryHeight
    }
    this.setState({
      obj,
    })
  }
  //录入表格内容更新
  setRecordObjVal = (record, param, val) => {
    const { follicleLeft, follicleRight } = this.state
    record[param] = val
      .replace(/[^\d.]/g, "")
      .replace(/^()*(\d+)\.(\d).*$/, "$2.$3")
    // 先清除数字和.以外的字符，在保留小数点后一位
    this.setState({
      follicleLeft,
      follicleRight,
    })
    this.updateCount()
  }
  //卵泡录入统计取值
  extractData = (sourceData, location) => {
    let sum = 0 //卵泡总数量
    let detailist = []
    sourceData.forEach((item) => {
      //数量为0,径1<0的不计入
      if (Number(item.count) > 0 && Number(item.diameterMin > 0)) {
        sum += Number(item.count)
        let text =
          ((Number(item.diameterMin) + Number(item.diameterMax)) / 2).toFixed(
            1
          ) +
          " x " +
          Number(item.count)

        detailist.push(text)
      }
    })
    let result = {
      total: sum,
      follicleDetail: detailist,
      location: location,
    }
    return result
  }
  // 添加行
  addRow = (record, index) => {
    const { folliceSide, follicleLeft, follicleRight, dataSource } = this.state
    let defaultObj = {
      key: index + 1,
      diameterMin: null,
      diameterMax: null,
      count: 1,
      delflag: 0,
    }
    //径1和数量不为空，且是最后一行数据，则自动添加一行
    if (
      Number(dataSource[index].diameterMin) > 0 &&
      Number(dataSource[index].diameterMax) > 0 &&
      Number(dataSource[index].count) > 0
    ) {
      if (index === dataSource.length - 1) {
        //flag 置为1 ，计算统计数据
        record.delflag = 1
        this.updateCount()
        if (folliceSide) {
          this.setState({
            follicleLeft: [...follicleLeft, defaultObj],
            dataSource: [...follicleLeft, defaultObj],
          })
        } else {
          this.setState({
            follicleRight: [...follicleRight, defaultObj],
            dataSource: [...follicleRight, defaultObj],
          })
        }
      }
    } else {
      message.error("径1，径2，以及数量不可小于1")
    }
  }
  //删除卵泡行
  delRow = async (e, record, index) => {
    let { follicleLeft, follicleRight, folliceSide } = this.state
    e.stopPropagation()
    if (folliceSide) {
      follicleLeft.splice(record.key, 1)
      await this.setState({
        follicleLeft: [...follicleLeft],
        dataSource: [...follicleLeft],
      })
    } else {
      follicleRight.splice(record.key, 1)
      this.setState({
        follicleRight: [...follicleRight],
        dataSource: [...follicleRight],
      })
    }
    this.updateCount()
  }
  //计算 卵泡数据的和
  updateCount = () => {
    let {
      follicleLeft,
      follicleRight,
      folliceSide,
      follicleMonitoringDTO,
    } = this.state
    if (folliceSide) {
      // 左卵泡
      let leftArr = this.extractData(follicleLeft, 0)
      follicleMonitoringDTO.leftFollicles = leftArr.follicleDetail
      follicleMonitoringDTO.leftFolliclesTotal = leftArr.total
    } else {
      // 右卵泡
      let rightArr = this.extractData(follicleRight, 1)
      follicleMonitoringDTO.rightFollicles = rightArr.follicleDetail
      follicleMonitoringDTO.rightFolliclesTotal = rightArr.total
    }
    this.setState({
      follicleMonitoringDTO,
    })
  }
  //加载卵泡枚数统计
  renderListDiv = (data, total) => {
    return (
      <div style={{ lineHeight: "20px" }}>
        {!checkArrisEmpty(data) &&
          data.map((item, i) => {
            return <div key={i}> {item}</div>
          })}
        {total ? <div className="colorred">({total})</div> : null}
      </div>
    )
  }
  //保存方法
  saveFuc = () => {
    let { follicleMonitoringDTO, follicleLeft, follicleRight } = this.state
    let { select_one } = this.props.store
    let select = JSON.parse(localStorage.getItem("patient"))
    //删除数据为0的数据
    follicleLeft.length > 0 &&
      follicleLeft.filter((item, i) => {
        return item.delflag === 0 && (!item.diameterMax || !item.diameterMin)
          ? follicleLeft.splice(i, 1)
          : null
      })
    follicleRight.length > 0 &&
      follicleRight.filter((item, i) => {
        return item.delflag === 0 && (!item.diameterMax || !item.diameterMin)
          ? follicleRight.splice(i, 1)
          : null
      })
    let obj = {
      patientParam: this.props.store.resumePeople ? select : select_one,
      follicleMonitoringDTO,
      ovarianFollicleValue: {
        leftOvarianFollicleDTOList: follicleLeft,
        rightOvarianFollicleDTOList: follicleRight,
      },
    }
    apis.Patients_monitor.saveBchao(obj).then((res) => {
      if (res.code !== 200) {
        message.error("保存失败！" + res.message)
      } else {
        this.props.initPage()
      }
    })
  }
  //保存当前模块
  componentWillUnmount() {
    let { editTag, editModalName } = this.props
    if (editTag === 0 && editModalName === "B超") {
      message.error("该数据从修订记录获取，不可保存")
    } else {
      this.saveFuc()
    }
  }
  // 监测情况向前一天
  setYesterdayDate = (data, parm) => {
    const { follicleMonitoringDTO } = this.state
    let { lMPDate } = this.props
    if (lMPDate) {
      let currentDate = moment(follicleMonitoringDTO.monitorDate)
        .subtract(1, "days")
        .format("YYYY-MM-DD")
      if (moment(lMPDate) <= moment(currentDate)) {
        data[parm] = currentDate
        this.setState({ data })
        this.calculateMenstruation()
      } else {
        message.error("监测日期应为末次月经之后！")
      }
    } else {
      message.error("请先保存该周期的LMP！")
    }
  }
  // 监测情况向后一天
  setTomorrowDate = (data, parm) => {
    const { follicleMonitoringDTO } = this.state
    let { lMPDate } = this.props
    if (lMPDate) {
      let currentDate = moment(follicleMonitoringDTO.monitorDate).add(1, "days")
      data[parm] = currentDate
      this.setState({ data })
      this.calculateMenstruation()
    } else {
      message.error("请先保存该周期的LMP！")
    }
  }
  //计算月经后第几天
  calculateMenstruation = () => {
    let { lMPDate } = this.props
    const { follicleMonitoringDTO } = this.state
    let startDate = new Date(lMPDate)
    let endDate = new Date(
      moment(follicleMonitoringDTO.monitorDate).add(2, "days")
    )
    var days = endDate.getTime() - startDate.getTime()
    follicleMonitoringDTO.afterMenstruation = Math.floor(
      days / (1000 * 60 * 60 * 24)
    )
    this.setState({ follicleMonitoringDTO })
  }
  // 处理键盘事件
  handleOnKeyDown = (e) => {
    // 左键
    if (e.keyCode === 37) {
      this.setSide(1)
    }
    //右键
    if (e.keyCode === 39) {
      this.setSide(0)
    }
  }
  render() {
    let {
      folliceSide,
      dataSource,
      initFlag,
      follicleMonitoringDTO,
    } = this.state
    let { renderOptions } = this.props.moredetail
    let { selectOption } = this.props
    const colums = [
      {
        title: "径1(mm)",
        dataIndex: "diameterMin",
        key: "diameterMin",
        render: (text, record, index) => (
          <Input
            type="number"
            min={1}
            defaultValue={text}
            value={text}
            onChange={({ target }) => {
              this.setRecordObjVal(record, "diameterMin", target.value)
            }}
          />
        ),
      },
      {
        title: "径2(mm)",
        dataIndex: "diameterMax",
        key: "diameterMax",
        render: (text, record) => (
          <Input
            type="number"
            min={1}
            defaultValue={text}
            value={text}
            onChange={({ target }) => {
              this.setRecordObjVal(record, "diameterMax", target.value)
            }}
          />
        ),
      },
      {
        title: "数量",
        dataIndex: "count",
        key: "count",
        render: (text, record, index) => (
          <Input
            type="number"
            min={1}
            defaultValue={text}
            value={text}
            onFocus={() => this.addRow(record, index)}
            onChange={({ target }) => {
              this.setRecordObjVal(record, "count", target.value)
            }}
          />
        ),
      },
      {
        title: "操作",
        dataIndex: "delflag",
        render: (text, record, index) =>
          text ? (
            <DashBtn>
              <MinusOutlined onClick={(e) => this.delRow(e, record, index)} />
            </DashBtn>
          ) : null,
      },
    ]
    return (
      <div>
        {initFlag ? (
          <>
            <FlexItem width="100px">
              <div>
                <span>监测日期</span>
                <span className="span_underline" style={{ width: "10em" }}>
                  <LeftOutlined
                    style={{ marginRight: 4 }}
                    onClick={() =>
                      this.setYesterdayDate(
                        follicleMonitoringDTO,
                        "monitorDate"
                      )
                    }
                  />
                  {moment(follicleMonitoringDTO.monitorDate).format(
                    "YYYY-MM-DD"
                  )}
                  <RightOutlined
                    onClick={() =>
                      this.setTomorrowDate(follicleMonitoringDTO, "monitorDate")
                    }
                    style={{ marginLeft: 4 }}
                  />
                </span>
              </div>
              <div>
                <span>月经期第</span>
                <span className="span_underline" style={{ width: "4em" }}>
                  {follicleMonitoringDTO.afterMenstruation}
                </span>
                天
              </div>
              <div>
                <span>B超医生</span>
                <span>
                  <Select
                    style={{ width: 130 }}
                    value={follicleMonitoringDTO.doctor}
                    onChange={(value) => {
                      this.setObjVal(follicleMonitoringDTO, "doctor", value)
                    }}
                  >
                    {renderOptions(selectOption, "278")}
                  </Select>
                </span>
              </div>
              <div>
                <span>B超录入</span>
                <span>
                  <Select
                    style={{ width: 130 }}
                    value={follicleMonitoringDTO.recordPerson}
                    onChange={(value) => {
                      this.setObjVal(
                        follicleMonitoringDTO,
                        "recordPerson",
                        value
                      )
                    }}
                  >
                    {renderOptions(selectOption, "278")}
                  </Select>
                </span>
              </div>
            </FlexItem>
            <FlexItem>
              <div>
                <span>内膜：</span>
                <span>厚度</span>
                <Input
                  addonAfter="mm"
                  value={follicleMonitoringDTO.innerMembrane}
                  defaultValue={follicleMonitoringDTO.innerMembrane}
                  onChange={(e) =>
                    this.setObjVal(
                      follicleMonitoringDTO,
                      "innerMembrane",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <span>分型</span>
                <Select
                  showArrow={false}
                  style={{ width: 100 }}
                  value={follicleMonitoringDTO.typing}
                  defaultValue={follicleMonitoringDTO.typing}
                  onChange={(val) =>
                    this.setObjVal(follicleMonitoringDTO, "typing", val)
                  }
                >
                  {renderOptions(selectOption, "226")}
                </Select>
              </div>
              <div>
                <span> 提示</span>
                <Switch
                  checked={follicleMonitoringDTO.ultrasoundCue}
                  defaultChecked={follicleMonitoringDTO.ultrasoundCue}
                  onChange={(val) => {
                    this.setObjVal(
                      follicleMonitoringDTO,
                      "ultrasoundCue",
                      val ? 1 : 0
                    )
                  }}
                />
              </div>
              {follicleMonitoringDTO.ultrasoundCue ? (
                <>
                  <div>
                    <span>处理</span>
                    <Input
                      style={{ width: "12em" }}
                      value={follicleMonitoringDTO.handle}
                      defaultValue={follicleMonitoringDTO.handle}
                      onChange={(e) =>
                        this.setObjVal(
                          follicleMonitoringDTO,
                          "handle",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <span>结果</span>
                    <Input
                      style={{ width: "12em" }}
                      value={follicleMonitoringDTO.result}
                      defaultValue={follicleMonitoringDTO.result}
                      onChange={(e) =>
                        this.setObjVal(
                          follicleMonitoringDTO,
                          "result",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </>
              ) : null}
            </FlexItem>
            <TableContent>
              <Sidecheck className="background_grey">
                <div>卵巢</div>
                <div>体积(cm)</div>
                <div>卵泡(枚)</div>
              </Sidecheck>
              <Sidecheck
                onClick={() => this.setSide(1)}
                className={folliceSide ? "checked_boredr" : null}
                ref={this.leftRef}
              >
                <div>左侧</div>
                <div>
                  {follicleMonitoringDTO.leftOvaryLength}*
                  {follicleMonitoringDTO.leftOvaryWidth}*
                  {follicleMonitoringDTO.leftOvaryHeight}
                </div>
                <div>
                  {this.renderListDiv(
                    follicleMonitoringDTO.leftFollicles,
                    follicleMonitoringDTO.leftFolliclesTotal
                  )}
                </div>
              </Sidecheck>
              <Sidecheck
                onClick={() => this.setSide(0)}
                className={folliceSide ? null : "checked_boredr"}
                ref={this.rightRef}
              >
                <div>右侧 </div>
                <div>
                  {follicleMonitoringDTO.rightOvaryLength}*
                  {follicleMonitoringDTO.rightOvaryWidth}*
                  {follicleMonitoringDTO.rightOvaryHeight}
                </div>
                <div>
                  {this.renderListDiv(
                    follicleMonitoringDTO.rightFollicles,
                    follicleMonitoringDTO.rightFolliclesTotal
                  )}
                </div>
              </Sidecheck>

              {/* 录入 */}
              <Sidecheck style={{ width: "100%" }}>
                {folliceSide === 1 ? (
                  <div>
                    <Input
                      style={{ width: "50px" }}
                      defaultValue={follicleMonitoringDTO.leftOvaryLength}
                      value={follicleMonitoringDTO.leftOvaryLength}
                      onChange={(e) => {
                        this.setObjVal(
                          follicleMonitoringDTO,
                          "leftOvaryLength",
                          e.target.value
                        )
                        this.calSize(follicleMonitoringDTO, "leftOvaryLength")
                      }}
                    />
                    *
                    <Input
                      style={{ width: "50px" }}
                      defaultValue={follicleMonitoringDTO.leftOvaryWidth}
                      value={follicleMonitoringDTO.leftOvaryWidth}
                      onChange={(e) => {
                        this.setObjVal(
                          follicleMonitoringDTO,
                          "leftOvaryWidth",
                          e.target.value
                        )
                        this.calSize(follicleMonitoringDTO, "leftOvaryWidth")
                      }}
                    />
                    *
                    <Input
                      style={{ width: "50px" }}
                      defaultValue={follicleMonitoringDTO.leftOvaryHeight}
                      value={follicleMonitoringDTO.leftOvaryHeight}
                      onChange={(e) => {
                        this.setObjVal(
                          follicleMonitoringDTO,
                          "leftOvaryHeight",
                          e.target.value
                        )
                        this.calSize(follicleMonitoringDTO, "leftOvaryHeight")
                      }}
                    />
                    cm
                  </div>
                ) : (
                  <div>
                    <Input
                      style={{ width: "50px" }}
                      defaultValue={follicleMonitoringDTO.rightOvaryLength}
                      value={follicleMonitoringDTO.rightOvaryLength}
                      onChange={(e) => {
                        this.setObjVal(
                          follicleMonitoringDTO,
                          "rightOvaryLength",
                          e.target.value
                        )
                        this.calSize(follicleMonitoringDTO, "rightOvaryLength")
                      }}
                    />
                    *
                    <Input
                      style={{ width: "50px" }}
                      defaultValue={follicleMonitoringDTO.rightOvaryWidth}
                      value={follicleMonitoringDTO.rightOvaryWidth}
                      onChange={(e) => {
                        this.setObjVal(
                          follicleMonitoringDTO,
                          "rightOvaryWidth",
                          e.target.value
                        )
                        this.calSize(follicleMonitoringDTO, "rightOvaryWidth")
                      }}
                    />
                    *
                    <Input
                      style={{ width: "50px" }}
                      defaultValue={follicleMonitoringDTO.rightOvaryHeight}
                      value={follicleMonitoringDTO.rightOvaryHeight}
                      onChange={(e) => {
                        this.setObjVal(
                          follicleMonitoringDTO,
                          "rightOvaryHeight",
                          e.target.value
                        )
                        this.calSize(follicleMonitoringDTO, "rightOvaryHeight")
                      }}
                    />
                    cm
                  </div>
                )}

                <div style={{ border: "none" }}>
                  <BaseTable
                    style={{ width: "100%" }}
                    columns={colums}
                    dataSource={dataSource}
                    pagination={false}
                    bordered
                  />
                </div>
              </Sidecheck>
            </TableContent>
          </>
        ) : null}
      </div>
    )
  }
}
