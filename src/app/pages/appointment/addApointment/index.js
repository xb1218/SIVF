import React, { Component } from "react"
import { observer } from "mobx-react"
import { DatePicker, Select, Row, Cascader, message } from "antd"
import { PlusOutlined, SearchOutlined, CheckOutlined } from "@ant-design/icons"
import styled from "styled-components"
import moment from "moment"
import { BaseInput } from "@/app/components/base/formStyles"
import { TableNomargin } from "@/app/components/base/baseTable"
import { DashBtn } from "@/app/components/base/baseBtn"
import { BaseModal } from "@/app/components/base/baseModal"
import { TitleP } from "@/app/components/base/baseP"
import { DateTitleView } from "@/app/components/normal/Title"
import { AddPatient } from "@/app/components/normal/AddPatient"
import DeleteSvg from "@/app/components/base/baseDelete"
import { todayString } from "@/app/utils/const.js"
import { depObj } from "@/app/utils/tool"
import Store from "@/app/stores/appointment"

import apis from "@/app/utils/apis.js"
import "./index.scss"

const SpanLine = styled.span`
  display: inline-block;
  height: 20px;
  line-height: 20px;
  width: ${(props) => props.width + "px"};
  border-bottom: 1px solid #bdbdbd;
  text-align: center;
`
const SpanTitle = styled.span`
  display: inline-block;
  width: ${(props) => props.width + "px"};
  height: 30px;
  line-height: 30px;
  text-align: center;
`
const { Option } = Select

export default
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.store = Store.fromJS()
    this.state = {
      visible: false, //确认删除已预约弹窗
      addModal: false, //新建患者
      //当前患者信息
      statePatientData: {
        documents: null,
        documentsType: "身份证",
        medicalCard: null,
        patientName: null,
        phone: null,
        sex: 0,
        visitRoom: null,
        workStationType: null,
      },
      //当前查询患者列表
      statePatientList: [],
      searchVal: null,
      //新增预约表数据
      addResDatasource: [
        {
          reservationType: "", //类型
          reservationProject: "", //项目
          reservationDate: todayString, //预约日
          noonType: null, //午别
          timePeriod: null, //时间段
          reservationGroup: null, //分组
          place: null, //地点
          ranking: null, //排号
          visitRoom: null,
          key: 0,
          options: [],
        },
      ],
      //当前可选类型
      currentTypeOptions: [],
      //所有预约类型
      optionsAll: [],
      reservationDTOList: [], //已预约项目
      resUid: null, //已预约uid
      placeData: [], //地点下拉框集合
    }
  }
  componentDidMount() {
    this.initOptionData()
  }
  //下拉框取值
  initOptionData = () => {
    apis.Reservation.getOptions().then((res) => {
      this.setState({
        optionsAll: JSON.parse(
          JSON.stringify(res.data).replace(/optVal/g, "value")
        ),
      })
      this.havePlaceList(res.data)
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
  //根据查询条件查询患者列表
  getPatientList = () => {
    const { searchVal } = this.state
    apis.Reservation.getSearch({ param: searchVal }).then((res) => {
      this.setState({
        statePatientList: res.data,
      })
    })
  }
  //查询已预约项目表格
  getHasResList = (id) => {
    apis.Reservation.hasReservation(id).then((res) => {
      this.setState({
        reservationDTOList: res.data,
      })
    })
  }
  //设置state中当前患者信息
  setStatePatientData = (data) => {
    this.setState({
      statePatientData: data,
    })
  }
  //新增预约 ☑️提交按钮
  addReservation = (record) => {
    let { statePatientData, addResDatasource } = this.state
    let params = {
      pid: statePatientData.pid,
      reservationDTOList: [record],
    }
    let obj = {
      reservationType: "", //类型
      reservationProject: "", //项目
      reservationDate: todayString, //预约日
      noonType: null, //午别
      timePeriod: null, //时间段
      reservationGroup: null, //分组
      place: null, //地点
      ranking: null, //排号
      visitRoom: null,
      key: 0,
      options: [],
    }
    //含有uid 为修改
    record.uid
      ? apis.Reservation.editReservation(record).then((res) => {
          message.success("修改成功！")
          addResDatasource.splice(0, 1)
          depObj(record, obj)
          this.setState({
            addResDatasource: [{ ...obj }],
          })
          this.getHasResList(statePatientData.pid)
        })
      : apis.Reservation.addReservation(params).then((res) => {
          if (res.code === 411) {
            message.warning(res.message)
          } else {
            message.success("提交成功！")
            depObj(record, obj)
            this.setState({
              addResDatasource: [{ ...record }],
            })
            this.getHasResList(statePatientData.pid)
          }
        })
  }
  //设置新建预约表datasuorce
  updateNewRes = (record) => {
    let { addResDatasource } = this.state

    addResDatasource[0] = record
    this.setState({
      addResDatasource: [...addResDatasource],
    })
  }
  //删除已预约
  delReservation = () => {
    const { resUid, statePatientData } = this.state
    apis.Reservation.delReservation(resUid).then((res) => {
      message.success("删除成功！")
      this.getHasResList(statePatientData.pid)
    })
    this.setState({
      visible: false,
    })
  }
  //新增患者
  addNewPatient = () => {
    //新建预约的弹窗
    this.store.reservationModal = false
    this.setState({
      addModal: true,
    })
  }
  //关闭新增,取消
  closeAdd = () => {
    this.store.reservationModal = true
    this.setState({
      addModal: false,
    })
  }
  //关闭新增，打开预约，确认
  closeAddPatient = (data) => {
    let { store } = this.props
    store.reservationModal = true
    // store.getReservationOption(data.pid) //获取项目table列表
    this.setTypeOptions(data.sex)
    this.setState({
      statePatientData: data,
      addModal: false,
    })
  }
  //预约项目
  displayRender = (label) => {
    if (label[0] === "专家门诊") {
      return label[label.length - 1] + "专诊"
    }
    if (!label[label.length - 1]) {
      return label[0]
    } else {
      return label[label.length - 1]
    }
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
  // 筛选循环
  forSelect = (item, parm, record) => {
    item.children &&
      item.children.forEach((itemc, indexc) => {
        if (itemc.value === parm) {
          itemc.children.forEach((itemf, indexf) => {
            record.options.push({
              value: itemf.value,
              label: itemf.value,
            })
          })
        }
      })
  }
  // 筛选组别
  selectGroup = (record) => {
    let { optionsAll } = this.state
    record.options = []
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
          this.forSelect(item, record.reservationProject, record)
        }
      } else {
        item.children &&
          item.children.forEach((itemc, indexc) => {
            if (item.value === record.reservationType) {
              itemc.children.forEach((itemf, indexf) => {
                record.options.push({
                  value: itemf.value,
                  label: itemf.value,
                })
              })
            }
          })
      }
    })
  }
  render() {
    const { visible, addModal } = this.state
    const {
      statePatientData,
      statePatientList,
      addResDatasource,
      currentTypeOptions,
      reservationDTOList,
      placeData,
    } = this.state
    const newColumn = [
      {
        title: "预约项目",
        width: 150,
        align: "center",
        render: (text, record, index) => {
          let arrVal = []
          arrVal[0] = record.reservationType
          arrVal[1] = record.reservationProject
          return (
            <Cascader
              options={currentTypeOptions}
              expandTrigger="hover"
              displayRender={this.displayRender}
              value={arrVal}
              key={arrVal}
              // width="150"
              onChange={(val) => {
                record.reservationType = val[0]
                record.reservationProject = val[1]
                this.selectGroup(record)
                this.setState({ addResDatasource: [...addResDatasource] })
              }}
            />
          )
        },
      },
      {
        title: "预约日期",
        dataIndex: "reservationDate",
        width: 130,
        align: "center",
        render: (text, record, index) => {
          return (
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <DatePicker
                allowClear={false}
                value={moment(record.reservationDate, "YYYY-MM-DD")}
                suffixIcon={null}
                onChange={(date, dateString) => {
                  record.reservationDate = dateString
                  this.setState({ addResDatasource: [...addResDatasource] })
                }}
                style={{ width: 130 }}
              />
            </span>
          )
        },
      },
      {
        title: "午别",
        dataIndex: "noonType",
        width: 70,
        align: "center",
        render: (text, record, index) => {
          return (
            <Select
              value={record.noonType}
              onChange={(val) => {
                record.noonType = val
                this.setState({ addResDatasource: [...addResDatasource] })
              }}
              style={{ width: 70 }}
            >
              <Option value="上午">上午</Option>
              <Option value="下午">下午</Option>
            </Select>
          )
        },
      },
      {
        title: "分时段",
        dataIndex: "timePeriod",
        width: 110,
        align: "center",
        render: (text, record, index) => {
          return (
            <Select
              value={record.timePeriod}
              onChange={(val) => {
                record.timePeriod = val
                this.setState({ addResDatasource: [...addResDatasource] })
              }}
              style={{ width: 120 }}
            >
              {record.noonType === "上午" ? (
                <>
                  <Option value="8:00-9:00">8:00-9:00</Option>
                  <Option value="9:00-10:00">9:00-10:00</Option>
                </>
              ) : (
                <>
                  <Option value="13:00-14:00">13:00-14:00</Option>
                  <Option value="15:00-16:00">15:00-16:00</Option>
                </>
              )}
            </Select>
          )
        },
      },
      {
        title: "地点",
        dataIndex: "place",
        width: 70,
        align: "center",
        render: (text, record, index) => {
          return (
            <Select
              options={placeData}
              value={record.place}
              onChange={(val) => {
                record.place = val
                this.setState({ addResDatasource: [...addResDatasource] })
              }}
              dropdownMatchSelectWidth={100}
            />
          )
        },
      },
      {
        title: "组别",
        dataIndex: "reservationGroup",
        width: 70,
        align: "center",
        render: (text, record, index) => {
          return record.reservationType === "男科" ? (
            "/"
          ) : (
            <Select
              options={record.options}
              value={text}
              onChange={(val) => {
                record.reservationGroup = val
                this.setState({ addResDatasource: [...addResDatasource] })
              }}
              style={{ width: 70 }}
            />
          )
        },
      },
      {
        title: "排号",
        dataIndex: "ranking",
        width: 100,
        align: "center",
        render: (text, record) => (
          <div>
            已约 <span style={{ color: "#59B4F4" }}>{text}</span> 人
          </div>
        ),
      },
      {
        width: 60,
        align: "center",
        render: (text, record, index) => {
          return record.reservationType ? (
            <CheckOutlined
              style={{ color: "#59B4F4" }}
              onClick={(e) => {
                this.addReservation(record)
              }}
            />
          ) : null
        },
      },
    ]
    const alreadyApointmentColumn = [
      {
        title: "预约项目",
        dataIndex: "reservationType",
        width: 150,
        align: "center",
        render: (text, record) => {
          return text === "专家门诊" ? (
            record.reservationProject + "专诊"
          ) : text === "手术" || text === "卵泡监测" ? (
            record.reservationProject
          ) : (
            <div>{text}</div>
          )
        },
      },
      {
        title: "预约日期",
        dataIndex: "reservationDate",
        width: 150,
        align: "center",
        render: (text, record) => (
          <div>{moment(text).format("YYYY-MM-DD")}</div>
        ),
      },
      {
        title: "午别",
        dataIndex: "noonType",
        width: 90,
        align: "center",
        render: (text, record) => <div>{text}</div>,
      },
      {
        title: "分时段",
        dataIndex: "timePeriod",
        align: "center",
        width: 130,
        render: (text, record) => <div>{text}</div>,
      },
      {
        title: "地点",
        dataIndex: "place",
        align: "center",
        width: 90,
        render: (text, record) => <div>{text}</div>,
      },
      {
        title: "组别",
        dataIndex: "reservationGroup",
        align: "center",
        width: 90,
        render: (text, record) => <div>{text}</div>,
      },
      {
        title: "排号",
        dataIndex: "ranking",
        align: "center",
        width: 100,
        render: (text, record) => <div>{text}</div>,
      },
      {
        dataIndex: "new",
        align: "center",
        render: (text, record) => (
          <div
            onClick={(e) => {
              e.stopPropagation()
              this.setState({ visible: true, resUid: record.uid })
            }}
          >
            <DeleteSvg />
          </div>
        ),
      },
    ]
    // 患者列表表格
    const listColumn = [
      {
        title: "姓名",
        dataIndex: "patientName",
        width: 80,
      },
      {
        title: "出生年月",
        dataIndex: "birthday",
        width: 100,
      },
      {
        title: "电话",
        dataIndex: "phone",
        width: 120,
      },
    ]
    return (
      <div className="addApointment">
        <div className="addLeft">
          <BaseInput
            onChange={(e) => this.setState({ searchVal: e.target.value })}
            onPressEnter={() => {
              this.getPatientList()
            }}
            suffix={
              <SearchOutlined
                style={{ color: "#BDBDBD" }}
                onClick={() => {
                  this.getPatientList()
                }}
              />
            }
            placeholder="请输入姓名/助记符/PID/手机号检索"
          />
          <div style={{ height: 400, width: 320 }}>
            <TableNomargin
              scroll={{ y: 350 }}
              style={{ marginTop: 12 }}
              columns={listColumn}
              dataSource={statePatientList}
              onRow={(record) => {
                return {
                  onClick: (event) => {
                    this.setTypeOptions(record.sex)
                    this.setStatePatientData(record)
                    this.getHasResList(record.pid)
                  },
                }
              }}
              rowKey="pid"
              pagination={false}
            />
          </div>
          <div className="btnDefaultAdd" onClick={this.addNewPatient}>
            <DashBtn style={{ marginRight: 0 }} height="28">
              <PlusOutlined /> 新建患者
            </DashBtn>
          </div>
        </div>
        <div className="addRight">
          <div className="rightTitle">
            <SpanTitle width={60}>姓名:</SpanTitle>
            <SpanLine width={90}>{statePatientData.patientName}&nbsp;</SpanLine>
            <SpanLine width={20} style={{ margin: "0 15px" }}>
              {statePatientData.sex === undefined
                ? null
                : statePatientData.sex === 0
                ? "男"
                : "女"}
              &nbsp;
            </SpanLine>
            <SpanLine width={110}>{statePatientData.birthday}&nbsp;</SpanLine>
            {/* <SpanTitle width={60}>证件:</SpanTitle>
            <SpanLine width={160}>
              {statePatientData.documentsInfos
                ? statePatientData.documentsInfos[0].documentsNum
                : statePatientData.documents}
              &nbsp;
            </SpanLine> */}
            <SpanTitle width={60}>电话:</SpanTitle>
            <SpanLine width={120}>{statePatientData.phone}&nbsp;</SpanLine>
            <SpanTitle width={90}>就诊号:</SpanTitle>
            <SpanLine width={120}>
              {statePatientData.medicalCard}&nbsp;
            </SpanLine>
          </div>
          <DateTitleView title="新建预约">
            <div className="reservationTable" style={{ height: 150 }}>
              <TableNomargin
                columns={newColumn}
                dataSource={addResDatasource}
                pagination={false}
              />
            </div>
          </DateTitleView>
          <DateTitleView title="已预约">
            <div className="reservationTable">
              <TableNomargin
                columns={alreadyApointmentColumn}
                dataSource={reservationDTOList}
                rowKey={(record) => record.uid}
                pagination={false}
                onRow={(record, index) => {
                  return {
                    onClick: (e) => {
                      this.updateNewRes(record)
                    }, // 点击行
                  }
                }}
              />
            </div>
          </DateTitleView>
        </div>

        {/* 新增患者 */}
        <AddPatient
          visible={addModal}
          onCancel={() => this.closeAdd()}
          onOk={(val) => this.closeAddPatient(val)}
        />

        {/* 删除已预约 */}
        <BaseModal
          closable={false}
          visible={visible}
          title="提示"
          footer={
            <Row type="flex" align="middle" justify="center">
              <div
                className="cancel-btn"
                onClick={() => this.setState({ visible: false })}
              >
                取消
              </div>
              <div
                className="confirm-btn"
                type="primary"
                style={{ marginLeft: "20px" }}
                onClick={this.delReservation}
              >
                确认
              </div>
            </Row>
          }
        >
          <TitleP>是否确认删除？</TitleP>
        </BaseModal>
      </div>
    )
  }
}
