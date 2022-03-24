import React, { Component } from "react"
import { SettingFilled } from "@ant-design/icons"
import apis from "@/app/utils/apis"
import {
  Radio,
  Button,
  Menu,
  Dropdown,
  Drawer,
  Divider,
  Select,
  message,
} from "antd"
import BaseBread from "@/app/components/base/baseBread"
import { LeftOutlined } from "@ant-design/icons"
import { BaseTable } from "@/app/components/base/baseTable"
import { BaseDiv } from "@/app/components/base/baseSpan"
import "./index.scss"
import WorkRole from "./setVisitProject"
import SetVisit from "./setVisitRoom"
import TodayVisitRoom from "./todayVisitRoom"

//引入单选按钮组
const RadioGroup = Radio.Group

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUid: null, //所点击行的当前uid
      showEdit: false, //是否显示编辑表格
      workTab: "main", //主界面
      workType: false, //抽屉是否可见
      workIndex: 0, //抽屉匿名是那种，1为诊室列表，0为工作角色
      placeData: [], //地点集合
      allDataList: [], //所有的集合
      selectOption: [], //修改时下拉框
      columns: [
        {
          title: " ",
          dataIndex: "first",
          align: "center",
          children: [
            {
              title: "诊室",
              dataIndex: "visitRoom",
            },
          ],
        },
        {
          title: "周一",
          dataIndex: "Mon",
          align: "center",
          children: [
            {
              title: "上午",
              dataIndex: "mondayAmTypeProject",
            },
            {
              title: "下午",
              dataIndex: "mondayPmTypeProject",
            },
          ],
        },
        {
          title: "周二",
          dataIndex: "Tue",
          align: "center",
          children: [
            {
              title: "上午",
              dataIndex: "tuesdayAmTypeProject",
            },
            {
              title: "下午",
              dataIndex: "tuesdayPmTypeProject",
            },
          ],
        },
        {
          title: "周三",
          dataIndex: "Wed",
          align: "center",
          children: [
            {
              title: "上午",
              dataIndex: "wednesdayAmTypeProject",
            },
            {
              title: "下午",
              dataIndex: "wednesdayPmTypeProject",
            },
          ],
        },
        {
          title: "周四",
          dataIndex: "Thu",
          align: "center",
          children: [
            {
              title: "上午",
              dataIndex: "thursdayAmTypeProject",
            },
            {
              title: "下午",
              dataIndex: "thursdayPmTypeProject",
            },
          ],
        },
        {
          title: "周五",
          dataIndex: "Fir",
          align: "center",
          children: [
            {
              title: "上午",
              dataIndex: "fridayAmTypeProject",
            },
            {
              title: "下午",
              dataIndex: "fridayPmTypeProject",
            },
          ],
        },
        {
          title: "周六",
          dataIndex: "Sat",
          align: "center",
          children: [
            {
              title: "上午",
              dataIndex: "saturdayAmTypeProject",
            },
            {
              title: "下午",
              dataIndex: "saturdayPmTypeProject",
            },
          ],
        },
        {
          title: "周日",
          dataIndex: "Sun",
          align: "center",
          children: [
            {
              title: "上午",
              dataIndex: "sundayAmTypeProject",
            },
            {
              title: "下午",
              dataIndex: "sundayPmTypeProject",
            },
          ],
        },
      ], //设置诊室主表格
      setData: [], //设置诊室主表格数据
      editData: [], //编辑数据
      checkPlace: null, //选中的单选框
    }
  }
  componentDidMount() {
    this.getSetConData()
  }
  // 找出所有的地点
  findPlace = (data) => {
    let { placeData } = this.state
    placeData = []
    let arry = []
    data.forEach((e, index) => {
      if (!arry.includes(e.place)) {
        arry.push(e.place)
        placeData.push({
          label: e.place,
          value: e.place,
        })
      }
    })
    this.setState({
      placeData: placeData,
      checkPlace: placeData[0] ? placeData[0].value : "",
    })
    if (placeData[0]) {
      this.checkPlaceList(placeData[0].value, data, "setData")
    }
  }
  // 找出所有符合选择的地点
  checkPlaceList = (checkPlace, data, parm) => {
    let list = []
    data.forEach((item, index) => {
      if (item.place === checkPlace) {
        list.push(item)
      }
    })
    this.setState({
      [parm]: list,
    })
  }
  //构造下拉框的值
  constructorOption = (data) => {
    let { selectOption } = this.state
    selectOption = []
    data.forEach((item, index) => {
      selectOption.push({
        value: item.typeProjectValue,
        label: item.typeProjectValue,
        uid: item.uid,
      })
    })
    this.setState({
      selectOption: selectOption,
    })
  }
  //获取设置诊室的初始化数据(主视图)
  getSetConData = () => {
    //获取设置诊室主表数据
    apis.WorkBench.getVisitRoom().then((res) => {
      if (res.data) {
        let arry = res.data.visitRoomProjectSettingList.filter(
          (item, index) => (item.key = item.uid)
        )
        this.setState({
          allDataList: arry,
        })
        this.constructorOption(res.data.typeProjectSettingVOList)
        this.findPlace(arry)
      }
    })
  }
  // 获取今日诊室
  getTodayData = () => {
    apis.WorkBench.getTodayVisitRoom().then((res) => {
      let arry = res.data.filter((item, index) => (item.key = item.uid))
      this.setState({
        allDataList: arry,
      })
      this.findPlace(arry)
    })
  }
  //控制抽屉的打开
  showDrawer = (value) => {
    this.setState({
      workIndex: value,
      workType: true,
    })
  }
  //控制抽屉的关闭
  onClose = () => {
    let { workTab } = this.state
    if (workTab === "main") {
      this.getSetConData()
    } else {
      this.getTodayData()
    }
    this.setState({
      workType: false,
    })
  }
  // 获取当前点击行的数据
  getRowrecord = (record, index) => {
    this.setState({
      editData: [record],
      currentUid: record.uid,
      showEdit: true,
    })
  }
  //返回工作台
  goback = () => {
    this.props.history.push("/public/patients/workbench")
  }
  // 切换不同地点进行查询
  changePlace = (e) => {
    let { allDataList } = this.state
    this.setState({
      checkPlace: e.target.value,
    })
    this.checkPlaceList(e.target.value, allDataList, "setData")
  }
  //  修改数据
  changeSelect = (record, parm, parmUId, val) => {
    let { editData } = this.state
    record[parm] = val
    this.changeUid(record, parmUId, val)
    this.setState({
      editData,
    })
  }
  // 修改数据，添加uid
  changeUid = (record, parm, val) => {
    let { selectOption } = this.state
    selectOption.forEach((item, index) => {
      if (val === item.value) {
        record[parm] = item.uid
      }
    })
  }
  // 切换今日诊室和主页面
  changeButton = (val) => {
    switch (val) {
      case "temporary":
        this.setState({
          workTab: "main",
        })
        this.getSetConData()
        break
      case "main":
        this.setState({
          workTab: "temporary",
        })
        this.getTodayData()
        break
      default:
        break
    }
  }
  handleSaveData = (data) => {
    let { currentUid, editData } = this.state
    data.forEach((item, index) => {
      if (item.uid === currentUid) {
        item = editData[0]
      }
    })
  }
  // 修改诊室完成
  saveChange = () => {
    let { setData, editData } = this.state
    this.handleSaveData(setData)
    this.setState({
      setData: setData,
      showEdit: false,
    })
    this.postSaveData(editData[0])
  }
  // 设置诊室后台接口
  postSaveData = (setData) => {
    let { workTab } = this.state
    if (workTab === "main") {
      apis.WorkBench.postVisitRoom(setData).then((res) => {
        message.success(res.message)
      })
    } else {
      apis.WorkBench.postTodayVisitRoom(setData).then((res) => {
        message.success(res.message)
      })
    }
  }
  render() {
    const {
      columns,
      setData,
      workIndex,
      placeData,
      editData,
      workTab,
      showEdit,
      checkPlace,
      selectOption,
      workType,
    } = this.state
    const editColumns = [
      {
        title: " ",
        dataIndex: "first",
        align: "center",
        children: [
          {
            title: "诊室",
            dataIndex: "visitRoom",
          },
        ],
      },
      {
        title: "周一",
        dataIndex: "Mon",
        align: "center",
        children: [
          {
            title: "上午",
            dataIndex: "mondayAmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.mondayAmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "mondayAmTypeProject",
                      "mondayAmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
          {
            title: "下午",
            dataIndex: "mondayPmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.mondayPmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "mondayPmTypeProject",
                      "mondayPmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
        ],
      },
      {
        title: "周二",
        dataIndex: "Tue",
        align: "center",
        children: [
          {
            title: "上午",
            dataIndex: "tuesdayAmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.tuesdayAmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "tuesdayAmTypeProject",
                      "tuesdayAmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
          {
            title: "下午",
            dataIndex: "tuesdayPmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.tuesdayPmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "tuesdayPmTypeProject",
                      "tuesdayPmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
        ],
      },
      {
        title: "周三",
        dataIndex: "Wed",
        align: "center",
        children: [
          {
            title: "上午",
            dataIndex: "wednesdayAmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.wednesdayAmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "wednesdayAmTypeProject",
                      "wednesdayAmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
          {
            title: "下午",
            dataIndex: "wednesdayPmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.wednesdayPmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "wednesdayPmTypeProject",
                      "wednesdayPmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
        ],
      },
      {
        title: "周四",
        dataIndex: "Thu",
        align: "center",
        children: [
          {
            title: "上午",
            dataIndex: "thursdayAmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.thursdayAmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "thursdayAmTypeProject",
                      "thursdayAmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
          {
            title: "下午",
            dataIndex: "thursdayPmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.thursdayPmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "thursdayPmTypeProject",
                      "thursdayPmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
        ],
      },
      {
        title: "周五",
        dataIndex: "Fir",
        align: "center",
        children: [
          {
            title: "上午",
            dataIndex: "fridayAmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.fridayAmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "fridayAmTypeProject",
                      "fridayAmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
          {
            title: "下午",
            dataIndex: "fridayPmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.fridayPmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "fridayPmTypeProject",
                      "fridayPmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
        ],
      },
      {
        title: "周六",
        dataIndex: "Sat",
        align: "center",
        children: [
          {
            title: "上午",
            dataIndex: "saturdayAmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.saturdayAmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "saturdayAmTypeProject",
                      "saturdayAmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
          {
            title: "下午",
            dataIndex: "saturdayPmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.saturdayPmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "saturdayPmTypeProject",
                      "saturdayPmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
        ],
      },
      {
        title: "周日",
        dataIndex: "Sun",
        align: "center",
        children: [
          {
            title: "上午",
            dataIndex: "sundayAmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.sundayAmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "sundayAmTypeProject",
                      "sundayAmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
          {
            title: "下午",
            dataIndex: "sundayPmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.sundayPmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    this.changeSelect(
                      record,
                      "sundayPmTypeProject",
                      "sundayPmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
        ],
      },
    ]
    return (
      <div className="contentWrap">
        <BaseBread
          first="工作台"
          icon={<LeftOutlined onClick={() => this.goback()} />}
        />
        <BaseDiv>
          <RadioGroup
            defaultValue={"1"}
            style={{ width: "70%" }}
            options={placeData}
            value={checkPlace}
            onChange={this.changePlace}
          />
          <Dropdown
            className="setButton"
            overlay={
              <Menu>
                <Menu.Item key="1" onClick={() => this.showDrawer(1)}>
                  诊室列表
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="2" onClick={() => this.showDrawer(2)}>
                  工作角色
                </Menu.Item>
              </Menu>
            }
          >
            <SettingFilled style={{ fontSize: "25px" }} />
          </Dropdown>
          <Button className="setButtontoday" type="primary">
            {workTab === "temporary" ? (
              <span onClick={() => this.changeButton("temporary")}>主界面</span>
            ) : null}
            {workTab === "main" ? (
              <span onClick={() => this.changeButton("main")}>
                今日临时诊室
              </span>
            ) : null}
          </Button>
        </BaseDiv>
        {workTab === "main" ? (
          <BaseDiv>
            <BaseTable
              bordered
              columns={columns}
              dataSource={setData}
              rowKey={(record) => record.uid}
              pagination={false}
              scroll={{ y: `calc(100vh - 250px)` }}
              onRow={(record, index) => {
                return {
                  onClick: () => this.getRowrecord(record, index),
                }
              }}
            />
            <div>
              {showEdit ? (
                <>
                  <Divider>编辑</Divider>
                  <div style={{ textAlign: "right" }}>
                    <svg
                      style={{ width: "2em", height: "2em" }}
                      aria-hidden="true"
                      onClick={this.saveChange}
                    >
                      <use xlinkHref="#iconcheck" />
                    </svg>
                  </div>
                  <BaseTable
                    bordered
                    columns={editColumns}
                    dataSource={editData}
                    scroll={{ y: `calc(100vh - 250px)` }}
                    pagination={false}
                  />
                </>
              ) : null}
            </div>
          </BaseDiv>
        ) : (
          <BaseDiv>
            <TodayVisitRoom
              getRowrecord={(record, index) => this.getRowrecord(record, index)}
              changeSelect={(record, parm, oarmuid, val) =>
                this.changeSelect(record, parm, oarmuid, val)
              }
              saveChange={this.saveChange}
              editData={editData}
              selectOption={selectOption}
              setData={setData}
              showEdit={showEdit}
            />
          </BaseDiv>
        )}
        <Drawer
          title={workIndex === 1 ? "诊室列表" : "工作角色"}
          placement="right"
          closable={false}
          onClose={() => this.onClose(1)}
          visible={workType}
          width={400}
        >
          {workIndex === 1 ? <SetVisit /> : <WorkRole />}
        </Drawer>
      </div>
    )
  }
}
