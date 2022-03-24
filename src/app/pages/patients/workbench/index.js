import React, { Component } from "react"
import { SettingOutlined } from "@ant-design/icons"
// import CircleAgree from "@/app/components/normal/circleSpan"
import { observer, inject } from "mobx-react"
import { Select, Radio, Tabs, Button, message, Drawer } from "antd"
import BaseBread from "@/app/components/base/baseBread"
import BaseProgress from "@/app/components/base/baseProgress"
import { FloatDiv } from "@/app/components/base/baseDiv"
import { BaseTable } from "@/app/components/base/baseTable"
import { DateTitleView } from "@/app/components/normal/Title"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { NavTabs } from "@/app/components/base/baseTabs"
import DemoBar from "@/app/components/normal/Charts/Bar"
import { NormalModal } from "@/app/components/base/baseModal.js"
import Pagin from "@/app/components/normal/Pagination"
import { BaseDrawer } from "@/app/components/base/baseDrawer"
import PatientsInfo from "@/app/components/normal/PatientsInfo"
import CyclePost from "./cyclePost" //周期一岗二岗
import moment from "moment"
import apis from "@/app/utils/apis.js"
import TreatListDay from "@/app/components/normal/MedicalAdvice/treatLIstDay" //当天治疗单抽屉
import Prescription from "@/app/components/normal/MedicalAdvice/prescription" //处方
// import SetTime from "./setTime"
import "./index.scss"

const colorBar = ["#C4BFFF", "#FF9797", "#7AC3F6", "#B8E58C"]
const colorPro = [
  {
    typeName: "卵泡监测",
    color: "#B8E58C",
  },
  {
    typeName: "专家门诊",
    color: "#7AC3F6",
  },
  {
    typeName: "手术",
    color: "#FF9797",
  },
  {
    typeName: "妇科",
    color: "#C4BFFF",
  },
  {
    typeName: "男科",
    color: "#B9E38C",
  },
]
const RadioGroup = Radio.Group
const { TabPane } = Tabs

export default
@inject("moredetail", "store")
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      curNum: 0, //已就诊
      totalNum: 0, //今日总人数
      curType: "卵泡监测",
      totalCount: 0, //患者数据总条数
      userdata: [], //患者信息列表
      unHasTreated: [], //未就诊患者列表
      showListMark: true, //工作台患者列表显示标记：全部患者 / 未就诊患者
      Chartdata: [], //图表数据
      color: "#B8E58C", //选中类型颜色
      xAxis: { min: 0, max: 10 },
      pieCharts: [], //左侧统计数据
      chekedSecond: "新鲜",
      monthChart: [],
      weekChart: [],
      ismonthCheck: true, //当前是否月视图
      tb_group: "所有人",
      tb_place: "",
      tableTitle: [],
      visible: false,
      typeTotal: 0, //类型下的总人数
      visitRoomVisible: false, //选择诊室弹窗
      perNum: 0, //progress 进度条
      patientsInfo: [],
      initOption: [], //下拉框对应值
      visitRooms: [], //诊室
      visitRoomSettingParams: [], //诊室地点集合
      groups: [], //组别
      places: [], //地点
      date: moment(new Date()).format("YYYY-MM-DD"),
      time: moment().format("LTS"),
      showDraw: false, //处方的抽屉
      prescription: {}, //处方
      showDrawTreat: false, //当天治疗单的抽屉
    }
  }
  componentDidMount() {
    let { date, time } = this.state
    localStorage.setItem("typeVal", "卵泡监测")
    this.getCount() //获取工作台统计
    this.initWorkStation() //初始化工作台
    if (!localStorage.getItem("nowDate") || !localStorage.getItem("nowTime")) {
      this.setState({
        date: moment(new Date()).format("YYYY-MM-DD"),
        time: moment().format("LTS"),
      })
    } else {
      this.setState({
        date:
          localStorage.getItem("nowDate") !== "null"
            ? localStorage.getItem("nowDate")
            : date,
        time:
          localStorage.getItem("nowTime") !== "null"
            ? localStorage.getItem("nowTime")
            : time,
      })
    }
  }
  // 初始值,地点和组别
  initselectItem = (groups, places) => {
    let defaultGroup = this.changeSelect(groups).length - 1
    if (this.changeSelect(groups).length > 0) {
      this.setState({
        tb_group: this.changeSelect(groups)[defaultGroup].value,
      })
    }
    if (this.changeSelect(places).length > 0) {
      this.setState({
        tb_place: this.changeSelect(places)[0].value,
      })
    }
    this.getapidata(
      this.changeSelect(groups).length > 0
        ? this.changeSelect(groups)[defaultGroup].value
        : null,
      this.changeSelect(places).length > 0
        ? this.changeSelect(places)[0].value
        : null
    ) //获取患者table
  }
  // 设置地点诊室的初始值
  initVisitPlace = (data) => {
    let { visitRooms } = this.state
    visitRooms = []
    data.forEach((item, index) => {
      visitRooms.push({
        value: item.uid,
        label: item.place + item.visitRoom,
        place: item.place,
        room: item.visitRoom,
      })
    })
    this.setState({
      visitRooms: visitRooms,
    })
    localStorage.setItem("visitRooms", JSON.stringify(visitRooms))
    localStorage.setItem(
      "visitRoom",
      visitRooms.length > 0 ? visitRooms[0].label : ""
    )
    localStorage.setItem(
      "visitRoomKey",
      visitRooms.length > 0 ? visitRooms[0].value : ""
    )
    this.setPlaceAndVisit(
      data,
      visitRooms.length > 0 ? visitRooms[0].value : ""
    )
  }
  // 工作台初始化
  initWorkStation = () => {
    apis.WorkBench.initWorkStaion().then((res) => {
      this.setState({
        initOption: res.data,
        groups: this.selectItem(res.data, "卵泡监测", "groups"),
        places: this.selectItem(res.data, "卵泡监测", "places"),
        visitRoomSettingParams: this.selectItem(
          res.data,
          "卵泡监测",
          "visitRoomSettingParams"
        ),
      })
      this.initVisitPlace(
        this.selectItem(res.data, "卵泡监测", "visitRoomSettingParams")
      )
      this.initselectItem(
        this.selectItem(res.data, "卵泡监测", "groups"),
        this.selectItem(res.data, "卵泡监测", "places")
      )
    })
  }
  // 设置地点和诊室
  setPlaceAndVisit = (data, key) => {
    data.forEach((item, index) => {
      if (key === item.uid) {
        localStorage.setItem("place", item.place)
        localStorage.setItem("room", item.visitRoom)
      }
    })
  }
  // 查找对应的诊室,组别，地点
  selectItem = (data, value, name) => {
    let parm = []
    data.forEach((item, index) => {
      if (item.type === value) {
        parm = item[name]
      }
    })
    return parm
  }
  // 将数据转化为想要的数组
  changeSelect = (data) => {
    let arr = []
    data.map((item, index) => {
      arr.push({
        value: item,
        label: item,
      })
      return arr
    })
    return arr
  }
  //获取左侧图数据
  getCount = () => {
    let { typeTotal, perNum } = this.state
    let typeVal = localStorage.getItem("typeVal")
    let params = {
      typeName: typeVal,
      weekStartType: 0,
    }
    apis.WorkBench.getworkbenchcount(params).then((res) => {
      this.dealdata(
        res.data.workStationMonths,
        res.data.workStationWeeks,
        res.data.pieCharts
      )
      //计算改类型下的总人数
      let tempArr = []
      res.data.pieCharts.forEach((item) => {
        tempArr.push(item.total)
      })
      typeTotal = tempArr.reduce(function (preValue, curValue) {
        return preValue + curValue
      }, 0)
      perNum =
        (res.data.pieCharts[0].hasTreated / res.data.pieCharts[0].total) * 100
      this.setState({
        curNum: res.data.pieCharts[0].hasTreated,
        totalNum: res.data.pieCharts[0].total,
        chekedSecond: res.data.pieCharts[0].projectName,
        pieCharts: res.data.pieCharts,
        typeTotal,
        perNum,
      })
    })
  }
  //获取患者table数据
  getapidata = (group, place) => {
    let { queryMaps } = this.props.moredetail
    let typeVal = localStorage.getItem("typeVal")
    let { tb_group, tb_place } = this.state
    let selectGroup =
      typeVal === "妇科" || typeVal === "男科" || typeVal === "专家门诊"
        ? "所有人"
        : group

    let params = {
      pageNum: queryMaps.pageNum,
      pageSize: queryMaps.pageSize,
      typeName: typeVal,
      group: selectGroup ? selectGroup : tb_group,
      place: place ? place : tb_place,
    }
    this.setState({
      userdata: [],
    })
    setTimeout(() => {
      apis.WorkBench.getworkbenchbasedata(params).then((res) => {
        this.getUnhasTreated(res.data.list)
        this.setState({
          userdata: res.data.list,
          totalCount: res.data.total,
        })
      })
    }, 1)
  }
  //获取未就诊的患者列表
  getUnhasTreated = (data) => {
    let tempArr = data.filter((item) => item.hasTreated === 0)
    this.setState({
      unHasTreated: [...tempArr],
    })
  }
  //处理月视图，周视图,//处理table 头部汇总数据
  dealdata = (monthdata, weekdata, charts) => {
    const { setlocalQuery } = this.props.store
    let labellist = ["上旬", "中旬", "下旬"]
    let weekarr = []
    weekdata.forEach((item, i) => {
      item.count.forEach((items, index) => {
        let obj = {
          label: `第${index + 1}周`,
          type: `${item.projectName}`,
          value: Number.parseInt(`${items}`),
        }
        weekarr.push(obj)
      })
    })
    let montharr = []
    monthdata.forEach((item, i) => {
      labellist.forEach((lab, labindex) => {
        item.count.forEach((items, index) => {
          if (labindex === index) {
            let obj = {
              label: lab,
              type: `${item.projectName}`,
              value: Number.parseInt(`${items}`),
            }
            montharr.push(obj)
          }
        })
      })
    })
    let tableTitle = []
    charts.forEach((item) => {
      let obj = {
        projectName: item.projectName,
        percent: item.hasTreated + "/" + item.total,
      }
      let objNight = {
        projectName: item.projectName,
        percent: item.total,
      }
      if (item.projectName === "夜针") {
        tableTitle.push(objNight)
      } else {
        tableTitle.push(obj)
      }
    })
    //存入病人列表统计数据
    setlocalQuery(tableTitle, "patientList_Statis")
    this.setState({
      monthChart: montharr,
      weekChart: weekarr,
      Chartdata: this.state.ismonthCheck ? montharr : weekarr,
      tableTitle: tableTitle,
    })
  }
  //类型按钮切换
  setCurrentTab = (value) => {
    let data = ["周期一岗", "周期二岗"]
    if (data.includes(value)) {
      localStorage.setItem("typeVal", value)
      this.setState({
        curType: value,
      })
    } else {
      this.detailsTab(value)
      this.getCount()
    }
  }
  //除了周期一岗二岗的操作台
  detailsTab = (value) => {
    let { initOption } = this.state
    localStorage.setItem("typeVal", value)
    colorPro.forEach((item) => {
      if (item.typeName === value) {
        this.setColor(item.color)
      }
    })
    this.setState({
      curType: value,
      groups: this.selectItem(initOption, value, "groups"),
      places: this.selectItem(initOption, value, "places"),
      visitRoomSettingParams: this.selectItem(
        initOption,
        value,
        "visitRoomSettingParams"
      ),
    })
    this.initVisitPlace(
      this.selectItem(initOption, value, "visitRoomSettingParams")
    )
    this.initselectItem(
      this.selectItem(initOption, value, "groups"),
      this.selectItem(initOption, value, "places")
    )
  }
  //获取类型下，类别值
  setSecondItem = () => {
    const { pieCharts, chekedSecond } = this.state
    return (
      <div className="pieSecondType">
        {pieCharts.map((item, i) => {
          return (
            <span key={i}>
              {item.projectName === "夜针" ? null : (
                <span
                  key={i}
                  className={
                    chekedSecond === item.projectName ? "checked" : null
                  }
                  onClick={() => this.setTotal(item.projectName)}
                >
                  {item.projectName}
                </span>
              )}
            </span>
          )
        })}
      </div>
    )
  }
  //获取汇总数据
  setTotal = (val) => {
    let { pieCharts, perNum } = this.state
    let chekItem = pieCharts.filter((item) => item.projectName === val)
    perNum = (chekItem[0].hasTreated / chekItem[0].total) * 100
    this.setState({
      chekedSecond: val, //当前类型下的种类
      curNum: chekItem[0].hasTreated,
      totalNum: chekItem[0].total,
      perNum,
    })
  }
  //设置颜色
  setColor = (value) => {
    this.setState({
      color: value,
    })
  }
  //分页切换
  onPaginChange = (selectedPageNumber) => {
    const { updateQueryMap } = this.props.moredetail
    updateQueryMap({ pageNum: selectedPageNumber })
    this.getapidata()
  }
  //获取行数据
  getRowrecord = (record, index) => {
    this.setState({
      visible: true,
      patientsInfo: record,
    })
    //存入是否有配偶
    this.props.store.setSpousePid(record.spousePid ? 1 : 0)
  }
  //点击右箭头
  clickArrowRight = () => {
    let typeVal = localStorage.getItem("typeVal")
    const { typeTotal } = this.state
    if (typeTotal > 0 && typeVal !== "男科") {
      this.setState({
        visitRoomVisible: true,
      })
    } else if (typeVal === "男科") {
      this.props.history.push("/public/patients/detail")
    } else {
      message.warning("该项目暂无患者，请先预约！")
    }
  }
  //选择诊室确认
  visitRoomOk = () => {
    this.setState({
      visitRoomVisible: false,
    })
    this.props.history.push("/public/patients/detail")
  }
  //设置诊室弹窗
  getSettingModal = (flag) => {
    this.setState({
      settingModal: flag,
    })
  }
  //跳转至设置诊室页面
  goSetconcultingroom = () => {
    this.props.history.push("/public/patients/setconsultingroom")
  }
  //关闭基本信息弹框
  closeDrawer = () => {
    this.setState({
      visible: false,
    })
    //关闭弹窗时，保存基本信息
    this.PatientsInfo.saveInfo(true)
  }
  // 选择相应的地点诊室
  changeVisitRoom = (e) => {
    let { visitRooms, visitRoomSettingParams } = this.state
    localStorage.setItem("visitRoomKey", e.target.value)
    visitRooms.forEach((item, index) => {
      if (e.target.value === item.value) {
        localStorage.setItem("visitRoom", item.label)
      }
    })
    this.setPlaceAndVisit(visitRoomSettingParams, e.target.value)
  }

  //获取处方单/当天治疗单数据
  getModelData = (record) => {
    apis.MedicalAdvice.getMedicalAdvice({
      patientPid: record.pid,
      patientSex: record.sex,
      spousePid: record.spousePid,
      date: record.date,
      cycleNumber: record.cycleNumber,
      treatStage: record.treatStage,
      reservationUid: record.reservationUid,
      place: record.place,
      visitRoom: record.visitRoom,
    }).then((res) => {
      this.setState({
        prescription: res.data.prescription,
      })
      if (record.treatStage === 1 || record.treatStage === 0) {
        this.setState({
          showDrawTreat: true,
        })
      } else {
        this.setState({
          showDraw: true,
        })
      }
    })
  }
  //切换患者列表显示：全部 / 未就诊
  changeShowMark = () => {
    this.setState({
      showListMark: !this.state.showListMark,
    })
  }
  render() {
    let { queryMaps } = this.props.moredetail
    let {
      color,
      xAxis,
      ismonthCheck,
      curType,
      monthChart,
      weekChart,
      tableTitle,
      tb_group,
      tb_place,
      visible,
      groups,
      places,
      // date,
      // time,
      curNum,
      totalNum,
      Chartdata,
      userdata,
      totalCount,
      perNum,
      patientsInfo,
      visitRoomVisible,
      visitRooms,
      showDraw,
      prescription,
      showDrawTreat,
      showListMark,
      unHasTreated,
    } = this.state
    const userColumns = [
      {
        title: "姓名",
        key: "patientName",
        dataIndex: "patientName",
      },
      {
        title: "性别",
        key: "sex",
        dataIndex: "sex",
        width: 80,
        render: (sex) => <span>{sex === 1 ? "女" : "男"}</span>,
      },
      {
        title: "就诊卡号",
        key: "medicalCard",
        dataIndex: "medicalCard",
      },
      {
        title: "身份证号",
        key: "idNumber",
        dataIndex: "idNumber",
        width: 200,
      },
      {
        title: "手机号",
        key: "phone",
        dataIndex: "phone",
        width: 120,
      },
      {
        title: "预约",
        dataIndex: "sourceType",
        key: "sourceType",
        render: (text) => (
          <span style={{ color: text === 0 ? "#7AC3F6" : "#FFA25C" }}>
            {text === 0 ? "预约" : "现场"}
          </span>
        ),
      },
      {
        title: "状态",
        dataIndex: "hasTreated",
        key: "hasTreated",
        render: (text) => (
          <span style={{ color: text === 0 ? "#7AC3F6" : "#FFA25C" }}>
            {text === 0 ? "待就诊" : "已就诊"}
          </span>
        ),
      },
      // {
      //   title: "同意书",
      //   dataIndex: "agreeStage",
      //   key: "agreeStage",
      //   render: (text) => <CircleAgree title={8} />,
      // },
      {
        title: "操作",
        key: "hasTreated",
        dataIndex: "hasTreated",
        render: (text, record) =>
          text === 0 ? (
            <svg
              className="icon_workBench"
              aria-hidden="true"
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              <use xlinkHref="#icona-chakanchushi" />
            </svg>
          ) : (
            <svg
              className="icon_workBench"
              aria-hidden="true"
              onClick={(event) => {
                event.stopPropagation()
                this.getModelData(record)
              }}
            >
              <use xlinkHref="#iconkechakan" />
            </svg>
          ),
      },
    ]
    return (
      <div className="contentWrap work_bench">
        <BaseBread first={"工作台"} />
        <NavTabs
          defaultActiveKey={curType}
          style={{ marginTop: "-10px" }}
          onChange={(key) => this.setCurrentTab(key)}
        >
          <TabPane tab="卵泡监测" key="卵泡监测" />
          <TabPane tab="手术" key="手术" />
          <TabPane tab="专家门诊" key="专家门诊" />
          <TabPane tab="妇科" key="妇科" />
          <TabPane tab="男科" key="男科" />
          <TabPane tab="周期一岗" key="周期一岗" />
          <TabPane tab="周期二岗" key="周期二岗" />
        </NavTabs>
        {/* 设置系统时间开始 */}
        {/* <SetTime
          getCount={() => this.getCount()}
          initWorkStation={() => this.initWorkStation()}
        /> */}
        {/* 设置系统时间结束 */}
        <FloatDiv
          top="7.3em"
          right="2em"
          onClick={() => this.goSetconcultingroom()}
        >
          <SettingOutlined style={{ marginRight: "0.5em" }} />
          设置诊室
        </FloatDiv>
        {curType === "周期一岗" || curType === "周期二岗" ? (
          <DateTitleView style={{ margin: "0 0 0 0" }} title={"患者列表"}>
            <CyclePost curType={curType} />
          </DateTitleView>
        ) : (
          <div className="root">
            <div className="statistic">
              <DateTitleView title={"今日"} subtitle={`共${totalNum}人`}>
                <BaseProgress
                  circleWidth={130}
                  perNum={perNum}
                  curNum={curNum}
                  color={color}
                />
                <svg
                  className="icon_m"
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    float: "right",
                    margin: "5px 10px 10px 0",
                  }}
                  onClick={() => this.clickArrowRight()}
                >
                  <use xlinkHref="#icontiaozhuanjinru"></use>
                </svg>
                {this.setSecondItem()}
              </DateTitleView>
              <DateTitleView
                className="viewShowTitle"
                selectOption={
                  <>
                    <Button
                      type={ismonthCheck ? "primary" : null}
                      size="small"
                      className="viewShowTitleButton"
                      onClick={() =>
                        this.setState({
                          ismonthCheck: true,
                          Chartdata: monthChart,
                        })
                      }
                    >
                      月视图
                    </Button>
                    <Button
                      type={!ismonthCheck ? "primary" : null}
                      size="small"
                      onClick={() =>
                        this.setState({
                          ismonthCheck: false,
                          Chartdata: weekChart,
                        })
                      }
                    >
                      周视图
                    </Button>
                  </>
                }
              >
                <DemoBar
                  className="dataViewDemoBar"
                  datas={Chartdata}
                  colorlist={colorBar}
                  xAxis={xAxis}
                  label
                />
              </DateTitleView>
            </div>
            <div className="userlist">
              <DateTitleView
                title={
                  <>
                    <span
                      className={showListMark ? "show" : "hide"}
                      onClick={() => {
                        this.changeShowMark()
                      }}
                    >
                      全部患者
                    </span>
                    &nbsp;/&nbsp;
                    <span
                      className={showListMark ? "hide" : "show"}
                      onClick={() => {
                        this.changeShowMark()
                      }}
                    >
                      未就诊
                    </span>
                  </>
                }
                style={{ marginRight: 0 }}
              >
                <div className="tableGroup">
                  <FlexItem
                    marginleft={"10px"}
                    width={"40px"}
                    content="space-between"
                  >
                    <div>
                      {/* 地点 */}
                      <span>
                        <RadioGroup
                          options={this.changeSelect(places)}
                          style={{ width: 220 }}
                          value={tb_place}
                          onChange={async (e) => {
                            await this.setState({
                              tb_place: e.target.value,
                            })
                            this.getapidata(tb_group, e.target.value)
                          }}
                        />
                      </span>
                    </div>
                    <div>
                      {tableTitle.map((item, i) => {
                        return (
                          <div key={i}>
                            <span>{item.projectName}</span>
                            <span style={{ padding: "0 0.5em 0 0.2em" }}>
                              {item.percent}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    {curType === "卵泡监测" || curType === "手术" ? (
                      <div style={{ marginRight: "10px" }}>
                        <Select
                          options={this.changeSelect(groups)}
                          allowClear
                          value={tb_group}
                          style={{ width: 100, marginLeft: 15 }}
                          onChange={(val) => {
                            this.setState({
                              tb_group: val,
                            })
                            this.getapidata(val, tb_place)
                          }}
                        />
                      </div>
                    ) : null}
                  </FlexItem>
                  <BaseTable
                    columns={userColumns}
                    dataSource={showListMark ? userdata : unHasTreated}
                    size="middle"
                    align="center"
                    pagination={false}
                    scroll={{ y: `calc(100vh - 200px)` }}
                    rowKey={(record) => record.pid}
                    style={{
                      padding: "0 10px",
                      height: `calc(100vh - 155px)`,
                    }}
                    onRow={(record, index) => {
                      return {
                        onClick: (event) => this.getRowrecord(record, index),
                      }
                    }}
                  />
                  <div style={{ marginRight: "20px" }}>
                    <Pagin
                      pageSize={parseInt(queryMaps.pageSize, 10)}
                      total={totalCount}
                      current={parseInt(queryMaps.pageNum, 10)}
                      onChange={this.onPaginChange}
                    />
                  </div>
                </div>
              </DateTitleView>
            </div>
          </div>
        )}
        <NormalModal
          visible={visitRoomVisible}
          centered
          closable={false}
          title="选择诊室"
          onOk={() => this.visitRoomOk()}
          onCancel={() =>
            this.setState({
              visitRoomVisible: false,
            })
          }
        >
          <div style={{ padding: "10px 50px" }}>
            <Radio.Group
              options={visitRooms}
              defaultValue={localStorage.getItem("visitRoomKey")}
              checked={localStorage.getItem("visitRoomKey")}
              onChange={this.changeVisitRoom}
            />
          </div>
        </NormalModal>
        <BaseDrawer
          visible={visible}
          onclose={this.closeDrawer}
          width={980}
          bodyStyle={{ padding: "10px 8px 0 0" }}
          closable={false}
          placement="right"
        >
          <PatientsInfo
            name={"workbench"}
            close={() => {
              this.setState({
                visible: false,
              })
            }}
            open={() => {
              this.setState({
                visible: true,
              })
            }}
            record={patientsInfo}
            getData={this.getapidata}
            onRef={(ref) => {
              this.PatientsInfo = ref
            }}
          />
        </BaseDrawer>
        <Drawer
          visible={showDraw}
          closable={false}
          width="700px"
          onClose={() => {
            this.setState({
              showDraw: false,
            })
          }}
        >
          {<TreatListDay dataSourceTreatmentSheet={prescription} />}
        </Drawer>
        <Drawer
          visible={showDrawTreat}
          closable={false}
          width="700px"
          onClose={() => {
            this.setState({
              showDrawTreat: false,
            })
          }}
        >
          {<Prescription prescription={prescription} />}
        </Drawer>
      </div>
    )
  }
}
