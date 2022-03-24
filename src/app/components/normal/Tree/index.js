import React, { Component, Fragment } from "react"
import { inject, observer } from "mobx-react"
import { toJS } from "mobx"
import {
  CONST_ZERO,
  CONST_ONE,
  CONST_TWO,
  CONST_THREE,
  CONST_FOUR,
  CONST_SIX,
  CONST_FIVE,
} from "@/app/utils/const"
import { SearchOutlined, CheckOutlined } from "@ant-design/icons"
import "./index.scss"
import { Select, Button, Empty, message, Popconfirm } from "antd"
import { AddPatient } from "@/app/components/normal/AddPatient"
import { NormalModal } from "@/app/components/base/baseModal.js"
import { BaseInput } from "@/app/components/base/formStyles"
import { checkArrisEmpty } from "@/app/utils/tool.js"
import { TableNomargin } from "@/app/components/base/baseTable"
import apis from "@/app/utils/apis"

const text = "确定修改吗？"
export default
@inject("store", "moredetail")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchWord: "", //搜索关键字
      statePatientList: [], //搜索到的患者列表
      isSearch: false, //是否搜索
      isEmpty: false, //搜索后是否为空
      isAddSpouse: false, //新建患者的弹框
      treemodelstatus: true,
      workStationType: localStorage.getItem("typeVal"),
      addVisible: false,
      titleList: [],
      patientName: null,
      documentsType: null,
      documents: null,
      sex: null,
      phone: null,
      medicalCard: null,
      visitRoom: localStorage.getItem("visitRoomKey"),
      place: localStorage.getItem("place"),
      room: localStorage.getItem("room"),
      look: 0,
    }
  }
  //请求患者
  componentDidMount() {
    const { getlocalQuery } = this.props.store
    this.setState({
      titleList: getlocalQuery("patientList_Statis"),
    })
    this.initPatientList()
  }
  // 患者列表初始化
  initPatientList = () => {
    let { store } = this.props
    let obj = {
      workStationType: localStorage.getItem("typeVal"),
      visitRoom: localStorage.getItem("room"),
      place: localStorage.getItem("place"),
    }
    store.getPatientsList(obj) //获取患者列表
  }
  //诊室切换
  clinic = (value) => {
    let { store } = this.props
    localStorage.setItem("visitRoomKey", value)

    this.consultRoom(value)
    let obj = {
      workStationType: localStorage.getItem("typeVal"),
      visitRoom: localStorage.getItem("room"),
      place: localStorage.getItem("place"),
    }
    store.getPatientsList(obj) //获得患者列表
    if (store.card_flag) {
      this.props.change()
    }
  }
  // 诊室相对应
  consultRoom = (value) => {
    let data = JSON.parse(localStorage.getItem("visitRooms"))
    data.forEach((item, index) => {
      if (value === item.value) {
        localStorage.setItem("place", item.place)
        localStorage.setItem("room", item.room)
        localStorage.setItem("visitRoom", item.place + item.room)
      }
    })
  }
  //显示隐藏新增病人信息
  submit = () => {
    this.setState({
      addVisible: false,
    })
  }
  //处理展示每种类型就诊情况
  setPerList = () => {
    let { titleList } = this.state
    return (
      <div className="totalBox">
        {titleList.map((item, index) => {
          return (
            <div key={index}>
              <span>{item.projectName}</span>
              <span>{item.percent}</span>
            </div>
          )
        })}
      </div>
    )
  }
  //新建患者信息
  setPatient = (key, value) => {
    const { setSubmitPatientData } = this.props.store
    setSubmitPatientData({ [key]: value })
  }
  // 切换患者
  switchPatient = (index) => {
    let { itemClick } = this.props.store
    itemClick(index) //基本信息刷新
    this.props.change()
  }
  // 查看患者
  lookPatient = (val, mark) => {
    if (mark === 1) {
      apis.Reservation.cancelLook(val).then((res) => {
        if (res.code === 200) {
          this.initPatientList()
        }
      })
    } else {
      apis.Reservation.setLook(val).then((res) => {
        if (res.code === 200) {
          this.initPatientList()
        }
      })
    }
  }
  // 检索看/不看
  getLookListApi = (val) => {
    let { store } = this.props
    let obj = {
      workStationType: localStorage.getItem("typeVal"),
      visitRoom: localStorage.getItem("room"),
      place: localStorage.getItem("place"),
      reportMarker: val,
    }
    store.getPatientsList(obj) //获取患者列表
  }
  // 显示所有已查看列表
  lookPatientList = () => {
    let { look } = this.state
    if (look === 0) {
      this.setState({
        look: 1,
      })
      this.getLookListApi(1)
    }
    if (look === 1) {
      this.setState({
        look: 0,
      })
      this.getLookListApi(0)
    }
  }
  //搜索患者
  searchSpouses = () => {
    let { searchWord } = this.state
    apis.Reservation.getSearch({ param: searchWord }).then((res) => {
      if (!checkArrisEmpty(res.data)) {
        this.setState({
          isSearch: true,
          isEmpty: true,
          statePatientList: res.data,
        })
      } else {
        this.setState({
          isSearch: true,
          isEmpty: false,
        })
      }
    })
  }
  // 新建预约接口
  addVersition = (record) => {
    let { workStationType } = this.state
    let obj = {
      pid: record.pid,
      patientName: record.patientName,
      documentsType: record.documentsInfos[0].documentsName,
      documents: record.documentsInfos[0].documentsNum,
      sex: record.sex,
      phone: record.phone,
      medicalCard: record.medicalCard ? record.medicalCard : null,
    }
    let param = {
      patientInfo: obj,
      workStationType,
      visitRoom: localStorage.getItem("room"),
      place: localStorage.getItem("place"),
    }
    // 患者列表里的新建患者
    apis.Patients_list.addPatients(param).then((res) => {
      if (res.code === 200) {
        this.setState({ addVisible: false })
        //更新患者列表
        this.initPatientList()
        message.success("预约成功")
      } else {
        message.error(res.message)
      }
    })
  }
  // 修改初复诊
  modifyTag = (data) => {
    apis.Patients_list.modifyTag(data.reservationUid).then((res) => {
      if (res.code === 200) {
        this.initPatientList()
        message.success("修改成功")
      } else {
        message.error(res.message)
      }
    })
  }
  render() {
    let { users } = this.props.store
    let {
      addVisible,
      workStationType,
      visitRoom,
      searchWord,
      statePatientList,
      isSearch,
      isEmpty,
      isAddSpouse,
      look,
    } = this.state
    // 搜索患者列表表格
    const listColumn = [
      {
        title: "就诊号",
        dataIndex: "medicalCard",
        width: 80,
      },
      {
        title: "姓名",
        dataIndex: "patientName",
        width: 80,
      },
      {
        title: "性别",
        dataIndex: "sex",
        width: 80,
        render: (text, record) => {
          return <>{text === 1 ? <span>女</span> : <span>男</span>}</>
        },
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
      {
        title: "证件号",
        width: 120,
        render: (text, record, index) => {
          return <div>{record.documentsInfos[0].documentsNum}</div>
        },
      },
      {
        title: "预约",
        width: 60,
        align: "center",
        render: (text, record, index) => {
          return (
            <CheckOutlined
              style={{ color: "#59B4F4" }}
              onClick={() => {
                this.addVersition(record)
              }}
            />
          )
        },
      },
    ]
    const treeElements = [] //保存生成的患者列表jsx代码
    //   患者信息
    const Showpatientinfo = (props) => {
      return (
        <Fragment>
          {props.item.map((citem, cindex) => {
            return (
              <Fragment key={cindex}>
                <div
                  className="itembox"
                  onClick={() => this.switchPatient(props.index)}
                >
                  <div className="outtotalnumber1">
                    {parseInt(citem.reportMarker) === 1 &&
                    parseInt(citem.sex) === 1 ? (
                      <svg
                        className="icon_add2"
                        aria-hidden="true"
                        onClick={() =>
                          this.lookPatient(
                            citem.reservationUid,
                            props.item[0].reportMarker
                          )
                        }
                      >
                        <use xlinkHref="#iconkan3"></use>
                      </svg>
                    ) : (
                      <svg
                        className="icon_add3"
                        aria-hidden="true"
                        onClick={() =>
                          this.lookPatient(
                            citem.reservationUid,
                            props.item[0].reportMarker
                          )
                        }
                      >
                        <use xlinkHref="#icona-kanweixuanzhong"></use>
                      </svg>
                    )}
                  </div>

                  <div className="itemtopbox">
                    <svg className="icon_girl" aria-hidden="true">
                      {citem.sex === 1 ? (
                        <use xlinkHref="#iconnv" />
                      ) : (
                        <use xlinkHref="#iconnan" />
                      )}
                    </svg>
                    <span className={citem.sameName ? "sameNameline" : null}>
                      {citem.patientName}
                    </span>
                  </div>
                </div>
                <div className="broadcast">
                  <svg className="icon_m" aria-hidden="true">
                    <use xlinkHref="#iconCalling"></use>
                  </svg>
                </div>
              </Fragment>
            )
          })}
        </Fragment>
      )
    }
    const visitRooms = JSON.parse(localStorage.getItem("visitRooms"))
    //患者列表循环（患者初复诊或进周期标识）
    toJS(users).map((item, index) => {
      return treeElements.push(
        //构建JSX
        <div
          key={index}
          className={
            item[0].checked
              ? "treeItem treeItem-active"
              : !item[0].hasTreated
              ? " treeItem treeItem-grey"
              : "treeItem"
          }
        >
          <div className="stage">
            {(() => {
              switch (item[0].treatStage) {
                case CONST_ZERO:
                  return (
                    <Popconfirm
                      placement="rightTop"
                      title={text}
                      onConfirm={() => this.modifyTag(item[0])}
                      okText="确定"
                      cancelText="取消"
                    >
                      <svg className="icon_girl" aria-hidden="true">
                        <use xlinkHref="#iconchu"></use>
                      </svg>
                    </Popconfirm>
                  )
                case CONST_ONE:
                  return (
                    <Popconfirm
                      placement="rightTop"
                      title={text}
                      onConfirm={() => this.modifyTag(item[0])}
                      okText="确定"
                      cancelText="取消"
                    >
                      <svg className="icon_girl" aria-hidden="true">
                        <use xlinkHref="#iconfu"></use>
                      </svg>
                    </Popconfirm>
                  )
                case CONST_TWO:
                  return (
                    <svg className="icon_girl" aria-hidden="true">
                      <use xlinkHref="#iconIVF"></use>
                    </svg>
                  )

                case CONST_THREE:
                  return (
                    <svg className="icon_girl" aria-hidden="true">
                      <use xlinkHref="#iconIUI"></use>
                    </svg>
                  )
                case CONST_FOUR:
                  return (
                    <svg className="icon_girl" aria-hidden="true">
                      <use xlinkHref="#iconFET"></use>
                    </svg>
                  )
                case CONST_FIVE:
                  return (
                    <svg className="icon_girl" aria-hidden="true">
                      <use xlinkHref="#icona-IVFFET"></use>
                    </svg>
                  )
                case CONST_SIX:
                  return (
                    <svg className="icon_girl" aria-hidden="true">
                      <use xlinkHref="#iconzi1"></use>
                    </svg>
                  )
                default:
                  break
              }
            })()}
          </div>
          <Showpatientinfo item={item} index={index} />
        </div>
      )
    })
    return (
      <div className="tree">
        <div className="listbox">
          <div className="selectClinic">
            <Select
              style={{width:'110px'}}
              options={visitRooms}
              onChange={this.clinic}
              defaultValue={visitRoom}
            />

            <div className="outtotalnumber">
              {look === 0 ? (
                <svg
                  className="icon_add"
                  aria-hidden="true"
                  onClick={() => this.lookPatientList()}
                >
                  <use xlinkHref="#icona-kanweixuanzhong"></use>
                </svg>
              ) : (
                <svg
                  className="icon_add"
                  aria-hidden="true"
                  onClick={() => this.lookPatientList()}
                >
                  <use xlinkHref="#icona-kanxuanzhong"></use>
                </svg>
              )}
            </div>

            <div className="outtotalnumber">
              <svg
                className="icon_add"
                aria-hidden="true"
                onClick={() => this.setState({ addVisible: true })}
              >
                <use xlinkHref="#iconNewpatients1"></use>
              </svg>
            </div>
          </div>
          {this.setPerList()}
          <div className="treebox">
            {treeElements.length > 0 ? (
              treeElements
            ) : (
              <div>
                <svg className="icon_empty" aria-hidden="true">
                  <use xlinkHref="#iconDefaultgraphNopatients"></use>
                </svg>
              </div>
            )}
          </div>
        </div>
        {addVisible ? (
          <NormalModal
            title="新建预约"
            visible={addVisible}
            width="900px"
            height="250px"
            footer={null}
            destroyOnClose={true}
            onCancel={() =>
              this.setState({
                addVisible: false,
              })
            }
          >
            <BaseInput
              onChange={(e) => {
                this.setState({ searchWord: e.target.value })
              }}
              value={searchWord}
              onPressEnter={this.searchSpouses}
              suffix={
                <SearchOutlined
                  style={{ color: "#BDBDBD" }}
                  onClick={this.searchSpouses}
                />
              }
              placeholder="请输入姓名/PID/手机号"
              style={{ width: 500, marginRight: 20, marginTop: 10 }}
            />
            <Button
              type="primary"
              onClick={() => {
                this.setState({
                  isAddSpouse: true,
                  addVisible: false,
                })
              }}
            >
              新增患者
            </Button>
            {isSearch && isEmpty ? (
              <TableNomargin
                style={{ margin: "20px 20px 0px 20px", paddingBottom: "20px" }}
                columns={listColumn}
                dataSource={statePatientList}
                rowKey="pid"
                pagination={false}
              />
            ) : (
              <Empty
                image={
                  <svg aria-hidden="true">
                    <use xlinkHref="#iconDefaultgraphNopatients" />
                  </svg>
                }
                imageStyle={{
                  height: 60,
                  marginTop: 40,
                }}
                description={
                  <span style={{ color: "#d9d9d9", marginTop: 30 }}>
                    未搜索到相关患者,请新增
                  </span>
                }
              />
            )}
          </NormalModal>
        ) : null}
        <AddPatient
          visible={isAddSpouse}
          onCancel={() => this.setState({ isAddSpouse: false })}
          type={workStationType}
          initFuc={this.initPatientList}
        />
      </div>
    )
  }
}
