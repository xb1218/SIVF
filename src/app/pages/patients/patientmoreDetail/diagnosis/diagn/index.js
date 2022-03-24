import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import moment from "moment"
import {
  Button,
  DatePicker,
  Select,
  Checkbox,
  Radio,
  Row,
  Drawer,
  message,
  Popover,
} from "antd"
import { NormalModal } from "@/app/components/base/baseModal"
import { DownOutlined, UpOutlined } from "@ant-design/icons"
import { CONST_ONE } from "@/app/utils/const"
import api from "@/app/utils/apis"
import Record from "../redord"
import DndList from "./dnd"
import { hospitalCode } from "./data"
import "../index.scss"

const BaseDrawer = styled(Drawer)`
  &.ant-drawer > .ant-drawer-content-wrapper {
    width: 500px !important;
  }
`
const contentDelete = <p>点击删除</p>
const contentDiagnosis = <p>点击设为确诊</p>
const contentInvalid = <p>点击设为无效</p>

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 排序列表
      list: [],
      cycleListChecked: [],
      director: "", //主任
      deputyDirector: "", //副主任
      cycleDoctor: "", //医师
      dialist: [], //已经存在的诊断集合
      // 选中的要排序的
      activeItem: {},
      stage: 0, //当前是否进周期
      selectedCard: 0, //选择的是诊断还是不孕因素，0为诊断，1为不孕因素
      selectButtons: 0, //接收父组件传过来的患者性别,0男，1女
      ShowRecord: false, // 就诊记录的显示与隐藏
      deleteVisible: false, //删除弹框的显示与隐藏
      confirmVisible: false, //确诊弹框的显示与隐藏
      confirmItem: null, //选择的哪一条数据
      effectVisible: false, //有效无效(弹框)
      itemDelete: null, //选中的哪条数据删除
      indexDelete: null, //选择删除的数据下标
      deleteDia: "", //删除诊断的名称
      // 诊断记录中患者数据
      date: moment(new Date()), //时间
      diagnoseResult: "", //诊断
      doctor: localStorage.getItem("username"), //医生
      doubtStatus: 1, //确诊或疑似的状态（疑似为0）
      factor: "", //选中的主要因素
      factorListChecked: [], //选中的次要因素
      factorshowlist: [], //除了主要因素的次要因素集合
      departmentOrCycleList: [], //是门诊还是进周期(有效诊断)
      departmentOrCycleRecord: [], //诊断记录
      departmentList: [], //门诊
      ontoptInfoList: [], //诊断下拉框取值
      genderBasicInfo: "", //性别
      diagnoseTag: null, //诊断标志
      manDiagnoses: [], //男性诊断
      womanDiagnoses: [], //女性诊断
    }
  }
  // 初始化
  componentDidMount() {
    let { genderBasicInfo, stage } = this.props
    // stage ,0为门诊，1为进周期
    if (stage === 0) {
      this.getdiagnoseAll()
    } else {
      this.selectMale(genderBasicInfo)
    }
    this.setState({
      selectButtons: genderBasicInfo ? genderBasicInfo : 0,
      stage: stage,
    })
    this.props.onRef && this.props.onRef(this)
  }
  // 判断是男患者还是女患者
  selectMale = (genderBasicInfo) => {
    if (genderBasicInfo === 0) {
      // 男性
      let data = JSON.parse(localStorage.getItem("malePatient"))
      data.hospitalCode = hospitalCode
      this.getdiagnoseAll(data)
    } else {
      let data = JSON.parse(localStorage.getItem("femalePatient"))
      data.hospitalCode = hospitalCode //2是指厦门
      this.getdiagnoseAll(data)
    }
  }
  // 诊断集合的获取
  getDialist = (data) => {
    let { dialist } = this.state
    dialist = []
    data.forEach((item, index) => {
      dialist.push(item.diagnoseResult)
    })
    this.setState({
      dialist: dialist,
    })
  }
  // 去掉选中的次要因素中的主要因素
  delectFactorarry = (arry, check) => {
    let { factorshowlist } = this.state
    factorshowlist = []
    arry.forEach((item, index) => {
      if (item !== check) {
        factorshowlist.push(item)
      }
    })
    this.setState({
      factorshowlist: factorshowlist,
    })
  }

  // 初始化诊断后台接口
  getdiagnoseAll = (data) => {
    let { select_one } = this.props.store
    select_one.hospitalCode = hospitalCode
    api.Diagnosis_order.getdiagnoseAll(data ? data : select_one).then((res) => {
      if (res.data) {
        if (res.data.cycleDiagnoseVO) {
          // 处理诊断记录中哪个被选中
          this.handlediaListChecked(
            res.data.clinicDiagnoseList,
            res.data.cycleDiagnoseVO.diagnoseResult
          )
          // 处理拖拽排序数组
          this.handleSortTable(res.data.cycleDiagnoseVO.diagnoseResult)
          // 处理诊断是否选中
          let factor = res.data.cycleDiagnoseVO.diagnoseFactorVO.mainFactor
          if (res.data.cycleDiagnoseVO) {
            res.data.cycleDiagnoseVO.diagnoseFactorVO.factorList.push(factor)
          } else {
            res.data.cycleDiagnoseVO.diagnoseFactorVO.factorList = []
          }
        }
        res.data.clinicDiagnoseRecord.filter(
          (item, index) => (item.key = index)
        )
        this.setState({
          diagnoseTag: res.data.diagnoseTag, //诊断标志
          manDiagnoses: res.data.manDiagnoses, //男性诊断
          womanDiagnoses: res.data.womanDiagnoses, //女性诊断
          cycleListChecked: res.data.diagnoseResult, //男性诊断下拉菜单
          ontoptInfoList: res.data.ontoptInfoList, //门诊下拉菜单
          director: res.data.cycleDiagnoseVO
            ? res.data.cycleDiagnoseVO.director
            : "", //主任
          deputyDirector: res.data.cycleDiagnoseVO
            ? res.data.cycleDiagnoseVO.deputyDirector
            : "", //副主任
          cycleDoctor: res.data.cycleDiagnoseVO
            ? res.data.cycleDiagnoseVO.doctor
            : "", //医师
          factorListChecked: res.data.cycleDiagnoseVO
            ? res.data.cycleDiagnoseVO.diagnoseFactorVO.factorList
            : "",
          factor:
            res.data.cycleDiagnoseVO !== null
              ? res.data.cycleDiagnoseVO.diagnoseFactorVO.mainFactor
              : "",
          departmentList: res.data.clinicDiagnoseList,
          departmentOrCycleRecord: res.data.clinicDiagnoseRecord,
        })
        // 处理门诊
        this.selectDia()
        // 去掉主要因素的其他因素
        if (res.data.cycleDiagnoseVO) {
          this.delectFactorarry(
            res.data.cycleDiagnoseVO.diagnoseFactorVO.factorList,
            res.data.cycleDiagnoseVO.diagnoseFactorVO.mainFactor
          )
        }
        this.getDialist(res.data.clinicDiagnoseList)
      }
    })
  }
  // 处理拖拽排序的数组
  handleSortTable = (data) => {
    let { list } = this.state
    data.forEach((item, index) => {
      list.push({ id: index, title: item })
    })
    this.setState({
      list: [...list],
    })
  }
  // 处理诊断记录中哪个被选中
  handlediaListChecked = (data, dataChecked) => {
    data.forEach((item, index) => {
      if (dataChecked.indexOf(item.diagnoseResult) > -1) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
  }
  // 拖拽放下，重新排序
  onDropEnd = (list, fromIndex, toIndex) => {
    this.setState({
      list: [...list],
    })
  }
  // 点击的时候判断选中的是哪条数据
  onClick = (item) => {
    let { activeItem } = this.state
    if (item.id !== activeItem.id) {
      this.setState({
        activeItem: item,
      })
    }
  }
  // 处理门诊数据
  selectDia = () => {
    let { departmentList } = this.state
    this.setState({
      departmentOrCycleList: this.handleData(departmentList),
    })
  }
  // 诊断数组处理,进周期判断诊断是否被选中
  handleDiaSelect = (arry, checklist) => {
    arry.forEach((item, index) => {
      if (checklist.indexOf(item.diagnoseResult) > -1) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
  }
  // 数组中对象去重
  removal = (arr, param1, param2) => {
    let arry = []
    for (let val of arr) {
      if (
        !arry.some(
          (item) => item[param1] === val[param1] && item[param2] === val[param2]
        )
      ) {
        arry.push(val)
      }
    }
    return arry
  }
  // 处理初始化数据
  handleData = (arry) => {
    let dateList = []
    if (arry === null) {
      arry = []
    }
    arry.map((item) => {
      dateList.push({
        date: item.date,
        doctor: item.doctor,
        open: item.open ? item.open : true,
        list: [],
      })
      return dateList
    }, 0)
    dateList = this.removal(dateList, "doctor", "date")
    dateList.forEach((item, index) => {
      arry.forEach((items, indexs) => {
        if (item.doctor === items.doctor && item.date === items.date) {
          item.list.push(items)
        }
      })
    })
    return dateList
  }
  // 选择次要因素
  changeFactor = (checkedValues) => {
    let { factor } = this.state
    this.setState({
      factorListChecked: checkedValues,
    })
    // 去掉主要因素的其他因素
    this.delectFactorarry(checkedValues, factor)
  }
  // 选择主要因素
  getMainCheck = (e, val) => {
    let { factorListChecked } = this.state
    this.setState({
      factor: e.target.value,
    })
    this.delectFactorarry(factorListChecked, e.target.value)
  }
  // 添加诊断
  addDiagnose = () => {
    this.postDiagnos()
  }
  // 添加诊断（提交）
  postDiagnos = () => {
    let { date, diagnoseResult, doubtStatus, doctor } = this.state
    let { genderBasicInfo } = this.props
    let malePatient = JSON.parse(localStorage.getItem("malePatient"))
    let femalePatient = JSON.parse(localStorage.getItem("femalePatient"))
    let data = {
      patientParam: genderBasicInfo ? femalePatient : malePatient,
      diagnoseVO: {
        type: 0,
        date: date,
        diagnoseResult: diagnoseResult,
        doubtStatus: doubtStatus,
        doctor: doctor,
      },
    }
    if (date && diagnoseResult && doctor) {
      this.putDiaginos(data)
    } else {
      message.destroy()
      message.warning("请选择诊断类型和医生！")
    }
  }
  // 添加诊断后台接口
  putDiaginos = (data) => {
    api.Diagnosis_order.postDiagnose(data).then((res) => {
      if (res.data) {
        message.success(res.data)
        this.getdiagnoseAll({
          ...data.patientParam,
          hospitalCode: hospitalCode,
        })
        this.setState({
          diagnoseResult: "",
          doubtStatus: 1,
        })
        this.props.initPage()
      }
    })
  }
  // 就诊记录的显示与隐藏
  ShowRecords = () => {
    this.setState({
      ShowRecord: true,
    })
  }
  // 获取日期
  changeData = (data, dataString) => {
    this.setState({
      date: dataString,
    })
  }
  // 判断当前诊断是否存在
  judgeDia = (parm, value) => {
    let { dialist, diagnoseResult } = this.state
    if (dialist.indexOf(value) > -1 || value === diagnoseResult) {
      this.setState({
        [parm]: "",
      })
      message.destroy()
      message.error("已存在此诊断,请重新选择！")
      return false
    } else {
      this.setState({
        [parm]: value,
      })
      return true
    }
  }
  // 下拉框选值
  getSelect = (parm, value) => {
    if (parm === "diagnoseResult") {
      this.judgeDia(parm, value)
    } else {
      this.setState({
        [parm]: value,
      })
    }
  }
  // 单选框取值
  getCheckBox = (e, val) => {
    this.setState({
      [val]: e.target.checked ? 0 : 1,
    })
  }
  // 后台接口保存诊断模块
  saveData = () => {
    let {
      factor,
      factorshowlist,
      director,
      deputyDirector,
      cycleDoctor,
      cycleListChecked,
    } = this.state
    let { genderBasicInfo } = this.props
    let malePatient = JSON.parse(localStorage.getItem("malePatient"))
    let femalePatient = JSON.parse(localStorage.getItem("femalePatient"))
    let data = {
      patientParam: genderBasicInfo ? femalePatient : malePatient,
      diagnoseFactorVO: {
        mainFactor: factor,
        factorList: factorshowlist,
      },
      diagnoseResult: cycleListChecked,
      doctor: cycleDoctor,
      director: director,
      deputyDirector: deputyDirector,
    }
    api.Diagnosis_order.saveDiagnosis(data).then((res) => {
      if (res.data) {
        message.success(res.data)
      }
    })
  }
  // 确诊弹框选择确定
  confirmVisible = () => {
    let { confirmItem } = this.state
    this.confirmedOrSuspected(confirmItem)
  }
  // 隐藏确诊弹框
  handleCancelConfirm = () => {
    this.setState({
      confirmVisible: false,
    })
  }
  // 选择确诊
  confirmshow = (item) => {
    this.setState({
      confirmVisible: true,
      confirmItem: item,
    })
  }
  // 是确诊还是疑似
  confirmedOrSuspected = (items) => {
    let { departmentOrCycleList } = this.state
    let { select_one } = this.props.store
    this.changeState(
      items.uid,
      items.doubtStatus === CONST_ONE ? 0 : 1,
      items,
      select_one
    )
    this.setState({
      departmentOrCycleList: [...departmentOrCycleList],
    })
  }
  // 疑似或确诊的后台接口
  changeState = (uid, status, items, basic) => {
    let data = {
      uid: uid,
      status: status,
    }
    api.Diagnosis_order.modifySuspected(data).then((res) => {
      if (res.code === 200) {
        this.getdiagnoseAll({ ...basic, hospitalCode: hospitalCode })
        this.setState({
          confirmVisible: false,
        })
      }
    })
  }
  // 删除渲染
  deleteShow = (uid, i) => {
    let { departmentOrCycleList } = this.state
    departmentOrCycleList.forEach((item, index) => {
      item.list.forEach((items, indexs) => {
        if (items.uid === uid) {
          item.list.splice(indexs, 1)
          if (item.list.length === 0 && i === index) {
            departmentOrCycleList.splice(i, 1)
          }
        }
      })
    })
    this.setState({
      departmentOrCycleList: [...departmentOrCycleList],
    })
  }
  // 选择删除就诊
  deleteDefi = (item, index) => {
    this.setState({
      deleteVisible: true,
      itemDelete: item,
      indexDelete: index,
    })
  }
  // 确认删除
  handleOk = () => {
    let { itemDelete, indexDelete } = this.state
    let { select_one } = this.props.store
    api.Diagnosis_order.deleteDiagnosis(itemDelete.uid).then((res) => {
      if (res.code === 200) {
        this.getdiagnoseAll({ ...select_one, hospitalCode: hospitalCode })
        this.deleteShow(itemDelete.uid, indexDelete)
        message.success(res.data)
        this.setState({
          deleteVisible: false,
        })
      }
    })
  }
  // 取消删除诊断
  handleCancel = () => {
    this.setState({
      deleteVisible: false,
    })
  }
  // 设置有效弹框弹出
  visibleEffect = (item) => {
    this.setState({
      effectVisible: true,
      itemDelete: item,
    })
  }
  // 设置无效调用后台接口
  effectget = () => {
    let { itemDelete } = this.state
    let data = {
      uid: itemDelete.uid,
      status: 0,
    }
    let { select_one } = this.props.store
    api.Diagnosis_order.modifyEffective(data).then((res) => {
      if (res.code === 200) {
        message.success(res.data)
        this.getdiagnoseAll({ ...select_one, hospitalCode: hospitalCode })
      }
    })
  }
  // 确认设置为无效
  handleOkEffect = () => {
    this.setState({
      effectVisible: false,
    })
    this.effectget()
    this.props.initPage()
  }
  // 取消设置为无效
  handleCancelEffect = () => {
    this.setState({
      effectVisible: false,
    })
  }
  // 选择诊断还是不孕因素
  selectCard = (e) => {
    this.setState({
      selectedCard: e.target.value,
    })
  }
  // 改变诊断是否选中
  changecheckbox = (item) => {
    let { departmentOrCycleList } = this.state
    item.checked = !item.checked
    this.setState({
      departmentOrCycleList: departmentOrCycleList,
    })
    this.addCycleDia()
  }
  // 添加周期诊断
  addCycleDia = () => {
    let { departmentOrCycleList, list, cycleListChecked } = this.state
    list = []
    cycleListChecked = []
    departmentOrCycleList.forEach((item, index) => {
      item.list.forEach((iteml, indexl) => {
        if (iteml.checked) {
          list.push({ id: index + indexl, title: iteml.diagnoseResult })
          cycleListChecked.push(iteml.diagnoseResult)
        }
      })
    })
    this.setState({
      list: list,
      cycleListChecked: cycleListChecked,
    })
  }
  // 定制诊断回填的数据
  optionItem = (data) => {
    let returnData = data.map((item) => {
      return (
        <Select.Option key={item.id} value={item.name}>
          {item.name}
        </Select.Option>
      )
    })
    return returnData
  }
  render() {
    let {
      ShowRecord,
      diagnoseResult,
      factor,
      doctor,
      date,
      departmentOrCycleRecord,
      departmentOrCycleList,
      factorListChecked,
      factorshowlist,
      ontoptInfoList,
      selectButtons,
      deleteVisible,
      itemDelete,
      effectVisible,
      selectedCard,
      stage,
      confirmVisible,
      confirmItem,
      list,
      activeItem,
      director, //主任
      deputyDirector, //副主任
      cycleDoctor, //医师
      diagnoseTag, //诊断标志
      manDiagnoses, //男性诊断
      womanDiagnoses, //女性诊断
      doubtStatus,
    } = this.state
    let { renderOptions, disabledDate, getCheckBoxs } = this.props.moredetail
    return (
      <>
        <div style={{ marginLeft: "10px" }}>
          {stage === 0 ? null : (
            <div>
              <div style={{ marginBottom: "10px" }}>
                <div id="cycleDiv">
                  <div className="cycleLeft">
                    <div className="title">周期诊断</div>
                    {/* 拖拽排序列表 */}
                    <div className="list-wrap">
                      <DndList
                        list={list}
                        activeItem={activeItem}
                        onDropEnd={this.onDropEnd}
                        onClick={this.onClick}
                      />
                    </div>
                  </div>
                  <div className="cycleRight">
                    <div className="title">不孕因素</div>
                    <div className="titleTwo">
                      主要：<span style={{ color: " #59b4f4" }}>{factor}</span>
                    </div>
                    <div className="titleTwo">
                      其他：
                      {factorshowlist.map((item, index) => {
                        return <span key={item + index}>{item},</span>
                      })}
                    </div>
                  </div>
                </div>
                <div id="option">
                  <span>
                    <span style={{ color: "#FF0000", marginRight: 4 }}>*</span>
                    医师：
                    <Select
                      style={{ width: 90 }}
                      value={cycleDoctor}
                      onChange={(value) => this.getSelect("cycleDoctor", value)}
                    >
                      {renderOptions(ontoptInfoList, "278")}
                    </Select>
                  </span>
                  <span>
                    <span style={{ color: "#FF0000", marginRight: 4 }}>*</span>
                    副主任医师：
                    <Select
                      style={{ width: 90 }}
                      value={deputyDirector}
                      onChange={(value) =>
                        this.getSelect("deputyDirector", value)
                      }
                    >
                      {renderOptions(ontoptInfoList, "324")}
                    </Select>
                  </span>
                  <span>
                    <span style={{ color: "#FF0000", marginRight: 4 }}>*</span>
                    主任医师：
                    <Select
                      style={{ width: 90 }}
                      value={director}
                      onChange={(value) => this.getSelect("director", value)}
                    >
                      {renderOptions(ontoptInfoList, "323")}
                    </Select>
                  </span>
                </div>
              </div>
              <Radio.Group
                buttonStyle="solid"
                onChange={this.selectCard}
                value={selectedCard}
                size="small"
              >
                <Radio.Button value={0}>诊断</Radio.Button>
                <Radio.Button value={1}>不孕因素</Radio.Button>
              </Radio.Group>
            </div>
          )}
          {selectedCard === 0 ? (
            <div>
              <div className="diagnosis_content">
                {departmentOrCycleRecord.length > 0 ? (
                  <Button
                    type="primary"
                    onClick={this.ShowRecords}
                    style={{ float: "right" }}
                    size="small"
                  >
                    查看就诊记录
                  </Button>
                ) : null}
                <div id="listDia">
                  {departmentOrCycleList.map((item, index) => (
                    <div key={index}>
                      <div className="listHeader">
                        <span className="circleSpanDia"></span>
                        {item.open ? (
                          <span className="spanDown">
                            <DownOutlined />
                          </span>
                        ) : (
                          <span className="spanDown">
                            <UpOutlined />
                          </span>
                        )}
                        <span className="spanList">{item.date}</span>
                        <span>
                          <svg className="icon_svg" aria-hidden="true">
                            <use xlinkHref="#icondoctor"></use>
                          </svg>
                          {item.doctor}
                        </span>
                      </div>
                      {item.open ? (
                        <div className="itemDiv">
                          {item.list.map((items, indexs) => (
                            <div className="itemLIst" key={indexs}>
                              {stage === 0 ? null : (
                                <span style={{ marginRight: "10px" }}>
                                  <Checkbox
                                    checked={items.checked}
                                    onChange={(e) => this.changecheckbox(items)}
                                  />
                                </span>
                              )}
                              <span
                                style={{
                                  width: "40%",
                                  display: "inline-block",
                                }}
                              >
                                {items.diagnoseResult}
                              </span>

                              {items.doubtStatus === 0 ? (
                                <span
                                  className="icon_Span"
                                  onClick={() => this.confirmshow(items)}
                                >
                                  <Popover
                                    content={contentDiagnosis}
                                    title={false}
                                  >
                                    <svg
                                      className="icon_svg"
                                      aria-hidden="true"
                                    >
                                      <use xlinkHref="#iconquestion"></use>
                                    </svg>
                                  </Popover>
                                </span>
                              ) : (
                                <span className="icon_Span"></span>
                              )}
                              <span
                                className="icon_Span"
                                onClick={() => this.visibleEffect(items)}
                              >
                                {items.effectiveStatus === CONST_ONE ? (
                                  <Popover
                                    content={contentInvalid}
                                    title={false}
                                  >
                                    <svg
                                      className="icon_svg"
                                      aria-hidden="true"
                                    >
                                      <use xlinkHref="#iconclose-circlebeifen"></use>
                                    </svg>
                                  </Popover>
                                ) : null}
                              </span>
                              {items.isSameOne === CONST_ONE &&
                              items.isToday === CONST_ONE ? (
                                <span
                                  className="icon_delete"
                                  onClick={() => this.deleteDefi(items, index)}
                                >
                                  <Popover
                                    content={contentDelete}
                                    title={false}
                                  >
                                    <svg
                                      className="icon_svg"
                                      aria-hidden="true"
                                    >
                                      <use xlinkHref="#icondelete"></use>
                                    </svg>
                                  </Popover>
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="itemDownDiv"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {stage === 0 ? null : (
                <div style={{ marginBottom: "15px" }}>
                  <span style={{ color: "#FF0000", marginRight: 4 }}>*</span>
                  日期：
                  <DatePicker
                    defaultValue={date}
                    onChange={this.changeData}
                    disabledDate={disabledDate}
                  />
                </div>
              )}
              <div id="option">
                <span>
                  <span style={{ color: "#FF0000", marginRight: 4 }}>*</span>
                  诊断：
                  <Select
                    style={{ width: 130 }}
                    value={diagnoseResult}
                    dropdownMatchSelectWidth={250}
                    onChange={(value) =>
                      this.getSelect("diagnoseResult", value)
                    }
                  >
                    {selectButtons === CONST_ONE && diagnoseTag === 1 ? (
                      <>{renderOptions(ontoptInfoList, "106")}</>
                    ) : selectButtons === 0 && diagnoseTag === 1 ? (
                      <>{renderOptions(ontoptInfoList, "107")}</>
                    ) : selectButtons === CONST_ONE && diagnoseTag === 0 ? (
                      <>{this.optionItem(womanDiagnoses)}</>
                    ) : selectButtons === 0 && diagnoseTag === 0 ? (
                      <>{this.optionItem(manDiagnoses)}</>
                    ) : null}
                  </Select>
                </span>
                <span>
                  疑似：
                  <Checkbox
                    checked={!doubtStatus}
                    onChange={(e) => this.getCheckBox(e, "doubtStatus")}
                  ></Checkbox>
                </span>
                <span>
                  <span style={{ color: "#FF0000", marginRight: 4 }}>*</span>
                  医师：
                  <Select
                    style={{ width: 90 }}
                    value={doctor}
                    onChange={(value) => this.getSelect("doctor", value)}
                  >
                    {renderOptions(ontoptInfoList, "278")}
                  </Select>
                </span>
                <Button type="primary" onClick={this.addDiagnose} size="small">
                  提交
                </Button>
              </div>
            </div>
          ) : null}
          {selectedCard === 1 ? (
            <div>
              <div className="femaleFactors">
                {selectButtons === CONST_ONE || selectButtons === CONST_ONE ? (
                  <span>女方因素</span>
                ) : (
                  <span>男方因素</span>
                )}
              </div>
              <p style={{ textAlign: "left" }}>已选:</p>
              <div style={{ textAlign: "left" }}>
                <Radio.Group
                  options={factorListChecked}
                  value={factor}
                  onChange={this.getMainCheck}
                />
              </div>
              <p></p>
              <p style={{ textAlign: "left" }}>次要因素:</p>
              <div style={{ textAlign: "left" }}>
                <Checkbox.Group
                  value={factorListChecked}
                  style={{ width: "100%" }}
                  onChange={this.changeFactor}
                >
                  {selectButtons === CONST_ONE ? (
                    <Row>{getCheckBoxs(ontoptInfoList, "60")}</Row>
                  ) : (
                    <Row>{getCheckBoxs(ontoptInfoList, "61")}</Row>
                  )}
                </Checkbox.Group>
                <p></p>
              </div>
            </div>
          ) : null}
          {stage === 1 ? (
            <div style={{ margin: "20px 20px", textAlign: "center" }}>
              <Button type="primary" onClick={this.saveData} size="small">
                保存
              </Button>
            </div>
          ) : null}

          {ShowRecord ? (
            <BaseDrawer
              title="就诊记录"
              placement="right"
              closable={false}
              onClose={() => this.setState({ ShowRecord: false })}
              visible={ShowRecord}
            >
              <Record
                arry={departmentOrCycleRecord}
                click={(data) =>
                  this.getdiagnoseAll({ ...data, hospitalCode: hospitalCode })
                }
                sex={selectButtons}
              />
            </BaseDrawer>
          ) : null}
          {deleteVisible ? (
            <NormalModal
              visible={deleteVisible}
              centered
              closable={false}
              title="提示"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <p className="modalp">
                确认删除诊断
                <span style={{ color: "red" }}>
                  {itemDelete.diagnoseResult}
                </span>
                吗？
              </p>
            </NormalModal>
          ) : null}
          {effectVisible ? (
            <NormalModal
              visible={effectVisible}
              centered
              closable={false}
              title="提示"
              onOk={this.handleOkEffect}
              onCancel={this.handleCancelEffect}
            >
              <p className="modalp">
                确认将诊断
                <span style={{ color: "red" }}>
                  {itemDelete.diagnoseResult}
                </span>
                设置为无效吗？
              </p>
            </NormalModal>
          ) : null}
          {confirmVisible ? (
            <NormalModal
              visible={confirmVisible}
              centered
              closable={false}
              title="提示"
              onOk={this.confirmVisible}
              onCancel={this.handleCancelConfirm}
            >
              <p className="modalp">
                将
                <span style={{ color: "red" }}>
                  {confirmItem.diagnoseResult}
                </span>
                诊断设置为确诊吗？
              </p>
            </NormalModal>
          ) : null}
        </div>
      </>
    )
  }
}
