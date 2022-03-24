import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Button, DatePicker, Input, Select, message, Cascader } from "antd"
import moment from "moment"
import apis from "@/app/utils/apis.js"
import "./index.scss"

export default
@inject("store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reservationDate: moment(new Date()),
      dataNumber: 0, //不可选择今天
      optionsAll: [], //所有下拉框的集合
      placeData: [], //地点下拉框集合
      currentTypeOptions: [], //类型集合
      groupOption: [], //组别下拉框
      reservationType: null,
      reservationProject: null,
      reservationGroup: null,
      place: null,
    }
  }
  componentDidMount() {
    let { name } = this.props
    if (name === "medicalReturn") {
      this.initOptionData()
      this.initValue()
    }
  }
  // 赋值
  initValue = () => {
    let {
      reservationType,
      reservationProject,
      reservationGroup,
      place,
    } = this.props.data
    this.setState({
      reservationType: reservationType,
      reservationProject: reservationProject,
      reservationGroup: reservationGroup,
      place: place,
    })
  }
  //下拉框取值
  initOptionData = () => {
    let { select_one } = this.props.store
    apis.Reservation.getOptions().then((res) => {
      this.setState({
        optionsAll: JSON.parse(
          JSON.stringify(res.data).replace(/optVal/g, "value")
        ),
      })
      this.setTypeOptions(select_one.patientSex)
      this.havePlaceList(res.data)
    })
  }
  //根据患者性别，出不同的类型
  setTypeOptions = (sex) => {
    let { currentTypeOptions, optionsAll } = this.state
    currentTypeOptions = []
    //性别不同预约项目不同 1女0男
    optionsAll.forEach((item) => {
      let children = []
      //项目类型
      if (item.value !== "地点") {
        if (sex) {
          if (item.value !== "男科") {
            item.children &&
              item.children[0] &&
              item.children[0].value &&
              item.children.forEach((i) =>
                children.push({
                  value: i.value,
                  label: i.value,
                })
              )
            currentTypeOptions.push({
              value: item.value,
              label: item.value,
              children: children,
            })
          }
        } else {
          if (
            item.value !== "妇科" &&
            item.value !== "卵泡监测" &&
            item.value !== "手术"
          ) {
            item.children &&
              item.children.forEach((i) =>
                children.push({
                  value: i.value,
                  label: i.value,
                })
              )
            currentTypeOptions.push({
              value: item.value,
              label: item.value,
              children: children,
            })
          }
        }
      }
    })
    this.setState({
      currentTypeOptions: [...currentTypeOptions],
    })
  }
  // 获取地点集合
  havePlaceList = (data) => {
    let { placeData } = this.state
    placeData = []
    data.forEach((item, index) => {
      if (item.optVal === "地点") {
        item.children.forEach((itemc, indexc) => {
          placeData.push({
            value: itemc.optVal,
            label: itemc.optVal,
          })
        })
      }
    })
    this.setState({
      placeData: placeData,
    })
  }
  // 筛选组别
  selectGroup = (record) => {
    let { optionsAll, groupOption } = this.state
    groupOption = []
    optionsAll.forEach((item, index) => {
      if (
        record.reservationType === "专家门诊" ||
        record.reservationType === "手术" ||
        record.reservationType === "卵泡监测"
      ) {
        if (
          item.value === "专家门诊" ||
          item.value === "手术" ||
          item.value === "卵泡监测"
        ) {
          this.forSelect(item, record.reservationProject, groupOption)
        }
      } else {
        item.children &&
          item.children.forEach((itemc, indexc) => {
            if (item.value === record.reservationType) {
              itemc.children.forEach((itemf, indexf) => {
                groupOption.push({
                  value: itemf.value,
                  label: itemf.value,
                })
              })
            }
          })
      }
    })
    this.setState({
      groupOption: [...groupOption],
    })
  }
  // 筛选循环
  forSelect = (item, parm, groupOption) => {
    item.children &&
      item.children.forEach((itemc, indexc) => {
        if (itemc.value === parm) {
          itemc.children.forEach((itemf, indexf) => {
            groupOption.push({
              value: itemf.value,
              label: itemf.value,
            })
          })
        }
      })
  }
  // 选择返诊预约类型
  selectReturnType = (val) => {
    this.setState({
      reservationType: val[0],
      reservationProject: val[1],
    })
    let obj = {
      reservationType: val[0],
      reservationProject: val[1],
    }
    this.selectGroup(obj)
  }
  //预约项目
  displayRender = (label) => {
    if (label[0] === "专家门诊") {
      return label[label.length - 1] + "专诊"
    } else {
      return label[label.length - 1]
    }
  }
  // 修改pending,name为pending
  modifyPending = () => {
    let { data } = this.props
    let { reservationDate } = this.state
    data.reservationDate = reservationDate
    apis.PatientList_pending.modifyPendingList(data).then((res) => {
      if (res.code === 200) {
        message.success(res.message)
        this.props.initPage()
      } else {
        message.error(res.message)
      }
    })
  }
  // 返诊预约
  returnReservation = () => {
    let { select_one } = this.props.store
    let { dateDescription, matter, returnDate, doctor } = this.props.data
    let {
      reservationProject,
      reservationType,
      reservationGroup,
      place,
    } = this.state
    let data = {
      patientParam: select_one,
      returnClinicDTO: {
        dateDescription: dateDescription,
        matter: matter,
        returnDate: dateDescription === "日期" ? returnDate : null,
        reservationProject: reservationProject,
        reservationType: reservationType,
        reservationGroup: reservationGroup,
        place: place,
        doctor: doctor,
      },
    }
    this.props.returnRevision(data)
  }
  // 修改pending或返诊预约
  savePending = () => {
    let { name } = this.props
    if (name === "pending") {
      this.modifyPending()
    } else {
      this.returnReservation()
    }
  }
  // 日期的选择
  selectDate = (date, dateString) => {
    this.setState({
      reservationDate: dateString,
      dataNumber: moment(dateString).diff(moment(new Date()), "days"),
    })
  }
  // 输入框的选择
  selectNumber = (e) => {
    this.setState({
      reservationDate: moment(new Date()).add(parseInt(e.target.value), "days"),
      dataNumber: e.target.value,
    })
  }
  render() {
    let { data, name } = this.props
    let {
      reservationDate,
      dataNumber,
      placeData,
      currentTypeOptions,
      groupOption,
    } = this.state
    let type =
      data.reservationType === "手术" || data.reservationType === "卵泡监测"
        ? data.reservationProject
        : data.reservationType === "专家门诊"
        ? data.reservationProject + "专诊"
        : data.reservationType
    return (
      <>
        <div className="itemLine">
          <span className="itemLineLeft">
            <svg className="icon_s" aria-hidden="true">
              {data.sex === "1" ? (
                <use xlinkHref="#iconnv" />
              ) : (
                <use xlinkHref="#iconnan" />
              )}
            </svg>
          </span>
          <span className="itemLineRight">{data.patientName}</span>
        </div>
        <div className="itemLine">
          <span className="itemLineLeft">类型/项目：</span>
          {name === "pending" ? (
            <span className="itemLineRight">{type}</span>
          ) : (
            <span className="itemLineRight">
              <Cascader
                defaultValue={[type]}
                style={{ width: "130px" }}
                options={currentTypeOptions}
                expandTrigger="hover"
                displayRender={this.displayRender}
                onChange={this.selectReturnType}
              />
            </span>
          )}
        </div>
        <div className="itemLine">
          <span className="itemLineLeft">组别：</span>
          {name === "pending" ? (
            <span className="itemLineRight">{data.reservationGroup}</span>
          ) : (
            <span className="itemLineRight">
              <Select
                defaultValue={data.reservationGroup}
                style={{ width: "130px" }}
                options={groupOption}
                onChange={(val) =>
                  this.setState({
                    reservationGroup: val,
                  })
                }
              />
            </span>
          )}
        </div>
        {name === "pending" ? null : (
          <div className="itemLine">
            <span className="itemLineLeft">地点：</span>
            <span className="itemLineRight">
              <Select
                defaultValue={data.place}
                style={{ width: "130px" }}
                options={placeData}
                onChange={(val) =>
                  this.setState({
                    place: val,
                  })
                }
              />
            </span>
          </div>
        )}

        <div className="itemLine">
          <span className="itemLineLeft">事项：</span>
          <span className="itemLineRight">{data.matter}</span>
        </div>
        <div className="itemLine">
          <span className="itemLineLeft">日期：</span>
          {name === "medicalReturn" ? (
            <>
              {data.dateDescription === "日期" ? (
                <span className="itemLineRight">{data.returnDate}</span>
              ) : (
                <span className="itemLineRight">{data.dateDescription}</span>
              )}
            </>
          ) : (
            <span className="itemLineRight">{data.dateDescription}</span>
          )}
        </div>
        {name === "pending" ? (
          <div className="itemLine">
            <Input
              style={{ width: "50px" }}
              value={dataNumber}
              onChange={this.selectNumber}
            />
            天后&nbsp;&nbsp;
            <DatePicker
            value={reservationDate ? moment(reservationDate) : ""}
            onChange={this.selectDate}
            />
          </div>
        ) : null}
        <div className="divleft">
          <Button
            type="primary"
            style={{ textAlign: "center" }}
            onClick={() => this.savePending()}
          >
            提交
          </Button>
        </div>
      </>
    )
  }
}
