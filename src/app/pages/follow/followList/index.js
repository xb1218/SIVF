/* eslint-disable no-unused-vars */
import React, { Component } from "react"
import styled from "styled-components"
import { DateTitleView } from "@/app/components/normal/Title"
import { UserModal } from "@/app/components/base/baseModal"
import FollowForm from "@/app/components/normal/Detail/FollowForm"
import Pagin from "@/app/components/normal/Pagination"
import { BaseBtn } from "@/app/components/base/baseBtn.js"
import { BaseTable } from "@/app/components/base/baseTable"
import BaseBread from "@/app/components/base/baseBread"
import BaseSelect from "@/app/components/base/baseSelect.js"
import BaseDatepicker from "@/app/components/base/baseDatepicker.js"
import {
  DatePicker,
  Switch,
  Radio,
  Checkbox,
  Input,
  Row,
  message,
  Tabs,
  Select,
} from "antd"
import "../index.scss"
import moment from "moment"
import { inject, observer } from "mobx-react"
import { observable } from "mobx"
import apis from "@/app/utils/apis"

const { TabPane } = Tabs
const { RangePicker } = DatePicker
const { Option } = Select
const RadioGroup = Radio.Group

const Btn = styled(BaseBtn)`
  padding: 8px 7px;
  height: 26px;
  background: #59b4f4;
  border-radius: 2px;
`

const BaseInput = styled(Input)`
  &.ant-input {
    font-size: 14px;
    width: ${(props) => props.width + "px"};
    height: ${(props) => (props.height || 36) + "px"};
  }
`
const CheckboxGroupStyled = styled(RadioGroup)`
  &.ant-radio-group {
    .ant-radio-wrapper {
      margin-right: 12px;

      .ant-radio {
        display: none;
      }

      .ant-radio + span {
        background: white;
        margin-right: 12px;
        padding: 1px 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        margin: 0;
        color: #666666;
        font-weight: 400;
      }

      .ant-radio.ant-radio-checked + span {
        color: #59b4f4;
      }
    }
  }
`

const StyledTabs = styled(Tabs)`
  &.ant-tabs.ant-tabs-top {
    width: 100%;
    .ant-tabs-nav {
      background: white;
      margin-bottom: 12px;

      .ant-tabs-nav-wrap {
        display: flex;
        align-items: center;
        background: #fff;
      }

      .ant-tabs-tab {
        display: flex;
        justify-content: center;
        color: #333333;
        width: 100px;
        height: 40px;
        background: white;
        font-size: 12px;
        margin-right: 0;

        .ant-tabs-tab-btn {
          font-weight: 400;
        }

        &.ant-tabs-tab-active {
          color: #59b4f4;
          background-color: #edf6fd;
        }
      }
    }
  }
`
const LostContent = styled.div`
  text-align: left;
  span {
    display: inline-block;
    padding: 0 10px 10px 0;
  }
`
const FollowTop = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 12px;
`
const Bread = styled.div`
  width: 12px;
  height: 40px;
  background: #f0f2f5;
  margin-right: 12px;
`
const SearchWarp = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 0 12px;
`
const FilterWarp = styled.div`
  background: white;
  height: 100px;
  padding: 12px;
  margin-bottom: 12px;
`
const SpanLeft = styled.span`
  margin-left: 4em;
`
const SpanStyle = styled.span`
  display: inline-block;
  padding: 0px 7px;
  margin: 0 12px;
  cursor: pointer;
`
const SpanDate = styled.span`
  display: inline-block;
  padding: 0px 7px;
  margin: 0 16px;
  cursor: pointer;
  border-bottom: 1px solid #d9d9d9;
`
const SpanMargin = styled.span`
  display: inline-block;
  margin: 0 10px 0 0;
`

const dayMap = new Map([
  ["天", "days"],
  ["周", "weeks"],
  ["月", "months"],
])

const stageTypeMap = new Map([
  ["gestation", "0"],
  ["productionSieve", "1"],
  ["birthAfter", "2"],
])
const freshRecovery = ["新鲜", "复苏", "新鲜+复苏"]
const AIH = ["AIH", "AID"]

const ObserverTable = observer(({ columns, followData, rowKey }) => {
  return (
    <BaseTable
      style={{ width: "100%" }}
      pagination={false}
      columns={columns.filter((item) => item.filterType === 1)}
      dataSource={followData}
      rowKey
    />
  )
})

export default
@inject("follow")
@observer
class index extends Component {
  @observable frontDate = 0
  @observable transPlant = false
  @observable surgery = false
  @observable transPlantData = "新鲜"
  @observable surgeryData = []
  @observable transPlantStr = "移植日"
  @observable curTabpane = "gestation"
  @observable followDate = ""
  @observable dayUnit = "天"
  @observable day = ""
  @observable statusChecked = []
  @observable followGestationStage = 0
  @observable followProductionSieveStage = 3
  @observable followBirthAfterStage = 6
  constructor(props) {
    super(props)
    this.state = {
      follwStage: 0, //随访阶段
      followState: 0, //随访状态
      insStage: "人工授精", //授精类型
      insDateArry: [], //手术日期arry
      cycleType: "AIH", //周期类型
      startFollwDate: moment(new Date()).format("YYYY-MM-DD"), //随访时间开始
      endFollowDate: moment(new Date()).format("YYYY-MM-DD"), //随访时间结束
      lostInfo: {}, //弹窗传值
      lostVisit: 1, //师范按钮的选中与未选中
      delaylost: null, //加入失访列表弹框
      lostVisible: null, //加入随访列表弹框
      isShow: false, //随访履历是否显示
      nameNumber: "", //病例号或者是患者姓名
      temparr: [], //初始化日期
    }
  }
  // 点击失访按钮
  changeVisit = (record, val) => {
    if (val === true) {
      this.setState({
        lostInfo: record,
        delaylost: true,
      })
    } else {
      this.setState({
        lostInfo: record,
        lostVisible: true,
      })
    }
  }
  // 点击列入失访人员的确定
  delaylostOnok = () => {
    this.setState({
      delaylost: false,
      lostVisible: false,
    })
    let { lostInfo, data } = this.state
    //修改失访状态
    let body = lostInfo.cycleNumber
    apis.follow.alterloststatus(body).then((res) => {
      let { code } = res
      if (code !== 200) {
        message.error("修改状态失败")
      } else {
        message.success("修改成功")
        let cycleNumber = lostInfo.cycleNumber
        data.map((item, index) => {
          if (item.cycleNumber === cycleNumber) {
            data.splice(item)
          }
          return data
        })
        this.setState({
          data,
        })
      }
    })
  }
  // 关闭弹窗加入随访
  setVisible = () => {
    this.setState({
      visible: false,
      delaylost: false,
    })
  }
  // 失访建立联系
  onFinish = (fieldsValue) => {
    this.setState({
      lostVisit: "0",
      lostVisible: false,
    })
  }
  // 查看随访详情
  personDetails = (record) => {
    this.props.history.push("/public/follow/followDetail")
    localStorage.setItem("followrecord", JSON.stringify(record))
  }

  componentDidMount() {
    const { updateQueryMap, getfollowList } = this.props.follow
    this.followDate = moment(new Date()).subtract(
      (this.day = AIH.includes(this.transPlantData) ? "13" : "14"),
      dayMap.get(this.dayUnit)
    )
    updateQueryMap({
      stageType: "0",
      cycleType: "新鲜",
      followFlags: "",
      surgeryStartDate: moment(this.followDate).format("YYYY-MM-DD"),
    })
    getfollowList()
  }
  // 筛选新鲜，复苏，新鲜+复苏，transPlantStr为移植日，手术日，待随访
  onFilterChange = (e) => {
    const { updateQueryMap, getfollowList } = this.props.follow
    // 新鲜，复苏，新鲜+复苏
    if (freshRecovery.includes(e)) {
      this.transPlantStr = "移植日"
      this.day = "14"
      this.followDate = moment(new Date()).subtract(
        this.day,
        dayMap.get(this.dayUnit)
      )
    }
    // AIH,AID
    if (AIH.includes(e)) {
      this.transPlantStr = "手术日"
      this.day = "13"
      this.followDate = moment(new Date()).subtract(
        this.day,
        dayMap.get(this.dayUnit)
      )
    }
    this.transPlantData = e
    // 妊娠
    if (this.curTabpane === "gestation") {
      updateQueryMap({
        cycleType: e,
        surgeryStartDate: moment(this.followDate).format("YYYY-MM-DD"),
      })
    } else if (this.curTabpane === "productionSieve") {
      updateQueryMap({
        cycleType: e,
        surgeryStartDate: "",
      })
    } else if (this.curTabpane === "birthAfter") {
      updateQueryMap({
        cycleType: e,
        surgeryStartDate: "",
      })
    }
    getfollowList()
  }
  // 筛选移植日，待随访，手术日
  transPlantChange = (e) => {
    let type = ""
    const { updateQueryMap, getfollowList } = this.props.follow
    if (this.curTabpane === "gestation") {
      type = this.followGestationStage
    } else if (this.curTabpane === "productionSieve") {
      type = this.followProductionSieveStage
    } else if (this.curTabpane === "birthAfter") {
      type = this.followBirthAfterStage
    }
    this.transPlantStr = e
    if (e === "移植日" || e === "手术日") {
      updateQueryMap({
        surgeryStartDate: moment(this.followDate).format("YYYY-MM-DD"),
        followStage: null,
      })
    } else {
      updateQueryMap({
        surgeryStartDate: "",
        followStage: type,
      })
    }
    getfollowList()
  }

  setCurTabpane = (key) => {
    const { updateQueryMap, getfollowList, queryMaps } = this.props.follow
    this.curTabpane = key
    let tempObj = {
      target: {
        value: key === "productionSieve" ? 3 : 6,
      },
    }
    if (key === "gestation") {
      updateQueryMap({
        stageType: stageTypeMap.get(key),
        followStage: "",
        surgeryStartDate: moment(this.followDate).format("YYYY-MM-DD"),
      })
    } else if (key === "productionSieve") {
      updateQueryMap({
        stageType: stageTypeMap.get(key),
        surgeryStartDate: "",
        followStage: "3",
      })
      this.stageChange(tempObj)
    } else {
      updateQueryMap({
        stageType: stageTypeMap.get(key),
        followStage: "6",
        surgeryStartDate: "",
      })
      this.stageChange(tempObj)
    }
    getfollowList()
  }

  onDayChange = (key, value) => {
    const { updateQueryMap, getfollowList } = this.props.follow
    this[key] = value
    if (this.day && this.dayUnit) {
      this.followDate = moment(new Date()).subtract(
        this.day,
        dayMap.get(this.dayUnit)
      )
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
    updateQueryMap({
      surgeryStartDate: moment(this.followDate).format("YYYY-MM-DD"),
    })
    this.timer = setTimeout(() => {
      this.timer = null
      getfollowList()
    }, 500)
  }

  onDateChange = (key, value) => {
    const { updateQueryMap, getfollowList } = this.props.follow
    const date = moment(new Date()).diff(value, "days")
    this.day = date
    this[key] = value
    updateQueryMap({ surgeryStartDate: value })
    getfollowList()
  }

  statusChange = (e) => {
    const { updateQueryMap, getfollowList } = this.props.follow
    this.statusChecked = [...e]
    updateQueryMap({ followFlags: [...e] })
    getfollowList()
  }

  onKeywordsChange = (e) => {
    const { updateNameNumber, bynamefollowList } = this.props.follow
    updateNameNumber(e)
    bynamefollowList()
  }

  stageChange = (e) => {
    const { updateQueryMap, getfollowList } = this.props.follow
    if (this.curTabpane === "gestation") {
      this.followGestationStage = e.target.value
    } else if (this.curTabpane === "productionSieve") {
      this.followProductionSieveStage = e.target.value
    } else if (this.curTabpane === "birthAfter") {
      this.followBirthAfterStage = e.target.value
    }
    updateQueryMap({ followStage: e.target.value, surgeryStartDate: "" })
    getfollowList()
  }

  filterBtn = () => {
    const { queryMaps, updateQueryMap, getfollowList } = this.props.follow
    getfollowList()
  }

  render() {
    const column = [
      {
        dataIndex: "number",
        title: "序号",
        key: "number",
        align: "center",
        filterType: 1,
        render: (text, record, index) => {
          return <span>{index + 1}</span>
        },
      },
      {
        dataIndex: "femaleName",
        title: "女方",
        key: "femaleName",
        align: "center",
        filterType: 1,
        render: (text, record) => {
          return <span>{text}</span>
        },
      },
      {
        dataIndex: "femalePhone",
        title: "女方电话",
        key: "femalePhone",
        align: "center",
        filterType: 1,
        render: (text, record) => {
          return <span>{text}</span>
        },
      },
      {
        dataIndex: "maleName",
        title: "男方",
        key: "maleName",
        align: "center",
        filterType: 1,
        render: (text, record) => {
          return <span>{text}</span>
        },
      },
      {
        dataIndex: "malePhone",
        title: "男方电话",
        key: "malePhone",
        align: "center",
        filterType: 1,
        render: (text, record) => {
          return <span>{text}</span>
        },
      },
      {
        dataIndex: "stage",
        title: "随访阶段",
        key: "stage",
        align: "center",
        filterType: 1,
        render: (text, record) => {
          return <span>{text}</span>
        },
      },
      {
        dataIndex: "followPerson",
        title: "随访者",
        key: "followPerson",
        align: "center",
        filterType: 1,
        render: (text, record) => {
          return <span>{text}</span>
        },
      },
      {
        dataIndex: "result",
        title: "随访结果",
        key: "result",
        align: "center",
        filterType: 1,
        render: (text, record) => {
          return <span>{text}</span>
        },
      },
      {
        dataIndex: "followDate",
        title: "随访日",
        key: "followDate",
        align: "center",
        filterType: 0,
        render: (text, record) => {
          return <span>{text}</span>
        },
      },
      {
        dataIndex: "followStatus",
        title: "状态",
        key: "followStatus",
        align: "center",
        filterType: 1,
        render: (text, record) => {
          return <span>{text}</span>
        },
      },
      {
        dataIndex: "details",
        title: "操作",
        key: "details",
        align: "center",
        filterType: 1,
        render: (text, record, index) => {
          return (
            <span
              style={{
                textDecoration: "underline",
                color: "#59B4F4",
                cursor: "pointer",
              }}
              onClick={() => this.personDetails(record, index)}
            >
              详情
            </span>
          )
        },
      },
    ]
    const filterOption = [
      { label: "新鲜", value: "新鲜", level: 1 },
      { label: "复苏", value: "复苏", level: 1 },
      { label: "新鲜+复苏", value: "新鲜+复苏", level: 1 },
      { label: "AIH", value: "AIH", level: 2 },
      { label: "AID", value: "AID", level: 2 },
    ]
    const stageOption = [
      { label: "生化期", value: 0 },
      { label: "临床期", value: 1 },
      { label: "分娩期", value: 2 },
    ]
    const productionSieveStageOption = [
      { label: "孕早期", value: 3 },
      { label: "孕中期", value: 4 },
      { label: "产前筛查", value: 5 },
    ]
    const birthAfterStageOption = [
      { label: "1周岁", value: 6 },
      { label: "5周岁", value: 7 },
      { label: "10周岁", value: 8 },
      { label: "15周岁", value: 9 },
      { label: "20周岁", value: 10 },
    ]
    const statusOption = [
      { label: "待随访", value: "0" },
      { label: "已随访", value: "1" },
    ]
    let { delaylost, lostInfo, lostVisible, clums, data } = this.state
    const { Search } = Input
    let { queryMaps, totalCount, followList } = this.props.follow
    const tabBar = (
      <SearchWarp>
        <Bread />
        <Search
          placeholder="请输入姓名/电话搜索"
          onSearch={(e) => {
            this.onKeywordsChange(e)
          }}
          enterButton
        />
      </SearchWarp>
    )

    return (
      <div className="contentWrap">
        <div className="follow">
          <BaseBread first="随访记录" />
          <FollowTop>
            <StyledTabs
              onChange={(key) => this.setCurTabpane(key)}
              activeKey={this.curTabpane}
              tabBarExtraContent={tabBar}
            >
              <TabPane tab="妊娠" key="gestation">
                <FilterWarp>
                  <BaseSelect
                    width={110}
                    height={26}
                    onChange={(e) => this.onFilterChange(e)}
                    value={this.transPlantData}
                  >
                    {filterOption.map((item, index) => (
                      <Option key={index} value={item.value}>
                        {item.value}
                      </Option>
                    ))}
                  </BaseSelect>

                  <Row
                    type="flex"
                    align="middle"
                    justify="space-between"
                    style={{ marginTop: 16 }}
                  >
                    <Row type="flex">
                      <BaseSelect
                        width={110}
                        height={26}
                        onChange={(e) => this.transPlantChange(e)}
                        value={this.transPlantStr}
                      >
                        {AIH.includes(this.transPlantData) && (
                          <Option key={0} value="手术日">
                            手术日
                          </Option>
                        )}
                        {freshRecovery.includes(this.transPlantData) && (
                          <Option key={0} value="移植日">
                            移植日
                          </Option>
                        )}

                        <Option key={1} value="待随访">
                          待随访
                        </Option>
                      </BaseSelect>
                      {(this.transPlantStr === "移植日" ||
                        this.transPlantStr === "手术日") && (
                        <Row
                          type="flex"
                          align="middle"
                          style={{ marginLeft: 24 }}
                        >
                          <BaseInput
                            width={60}
                            height={26}
                            onChange={(e) =>
                              this.onDayChange("day", e.target.value)
                            }
                            value={this.day}
                          />
                          <BaseSelect
                            width={56}
                            height={26}
                            onChange={(e) => this.onDayChange("dayUnit", e)}
                            value={this.dayUnit}
                          >
                            <Option key={0} value="天">
                              天
                            </Option>
                            <Option key={1} value="周">
                              周
                            </Option>
                            <Option key={2} value="月">
                              月
                            </Option>
                          </BaseSelect>
                          <div style={{ marginLeft: 10 }}>前</div>
                          <BaseDatepicker
                            allowClear={false}
                            style={{ marginLeft: 24, width: 130, height: 26 }}
                            onChange={(date, dateString) =>
                              this.onDateChange("followDate", dateString)
                            }
                            value={this.followDate && moment(this.followDate)}
                          />
                        </Row>
                      )}
                      {this.transPlantStr === "待随访" && (
                        <Row
                          type="flex"
                          align="middle"
                          style={{ marginLeft: 24 }}
                        >
                          <CheckboxGroupStyled
                            options={stageOption}
                            onChange={this.stageChange}
                            value={this.followGestationStage}
                          />
                        </Row>
                      )}
                    </Row>
                    <Row type="flex" align="middle">
                      <Btn onClick={() => this.filterBtn()}>筛选</Btn>
                    </Row>
                  </Row>
                </FilterWarp>
              </TabPane>
              <TabPane tab="产筛" key="productionSieve">
                <FilterWarp>
                  <BaseSelect
                    width={110}
                    height={26}
                    onChange={(e) => this.onFilterChange(e)}
                    value={this.transPlantData}
                  >
                    {filterOption.map((item, index) => (
                      <Option key={index} value={item.value}>
                        {item.value}
                      </Option>
                    ))}
                  </BaseSelect>

                  <Row type="flex" align="middle" justify="space-between">
                    <Row
                      type="flex"
                      align="middle"
                      style={{ margin: "22px 0 0 -18px" }}
                    >
                      <CheckboxGroupStyled
                        options={productionSieveStageOption}
                        onChange={this.stageChange}
                        value={this.followProductionSieveStage}
                      />
                    </Row>
                    <Row type="flex" align="middle">
                      <Btn onClick={() => this.filterBtn()}>筛选</Btn>
                    </Row>
                  </Row>
                </FilterWarp>
              </TabPane>
              <TabPane tab="出生后" key="birthAfter">
                <FilterWarp>
                  <BaseSelect
                    width={110}
                    height={26}
                    onChange={(e) => this.onFilterChange(e)}
                    value={this.transPlantData}
                  >
                    {filterOption.map((item, index) => (
                      <Option key={index} value={item.value}>
                        {item.value}
                      </Option>
                    ))}
                  </BaseSelect>
                  {/* <Select
                    mode="multiple"
                    value={this.transPlantData}
                    style={{ width: 280, height: 26 }}
                    onChange={(e) => this.onFilterChange(e)}
                  >
                    {filterOption.map((item) => (
                      <Option
                        key={item.key}
                        value={item.value}
                        disabled={
                          this.transPlant
                            ? item.level === 2
                            : this.surgery
                            ? item.level === 1
                            : false
                        }
                      >
                        {item.value}
                      </Option>
                    ))}
                  </Select> */}
                  <Row type="flex" align="middle" justify="space-between">
                    <Row
                      type="flex"
                      align="middle"
                      style={{ margin: "22px 0 0 -18px" }}
                    >
                      <CheckboxGroupStyled
                        options={birthAfterStageOption}
                        onChange={this.stageChange}
                        value={this.followBirthAfterStage}
                      />
                    </Row>
                    <Row type="flex" align="middle">
                      <Btn onClick={() => this.filterBtn()}>筛选</Btn>
                    </Row>
                  </Row>
                </FilterWarp>
              </TabPane>
            </StyledTabs>
          </FollowTop>

          <DateTitleView
            title="患者列表"
            style={{ marginRight: 0, marginBottom: 0 }}
          >
            <div style={{ margin: "-30px 0 0 100px", textAlign: "left" }}>
              <Checkbox.Group
                value={this.statusChecked}
                onChange={this.statusChange}
                options={statusOption}
              ></Checkbox.Group>
            </div>

            <div
              style={{
                padding: "0 10px",
                width: "100%",
                height: "calc(100vh - 20px)",
              }}
            >
              <ObserverTable
                columns={column}
                followData={followList}
                rowKey={(record) => record.pid}
              />
              <Pagin
                pageSize={parseInt(queryMaps.pageSize, 10)}
                total={totalCount}
                current={parseInt(queryMaps.pageNum, 10)}
                onChange={this.onPaginChange}
              />
            </div>
          </DateTitleView>
        </div>

        {/* 随访详情 */}
        {/* 弹框 */}
        <UserModal
          centered
          title="是否将该患者列为失访人员？"
          visible={lostVisible}
          closable={false}
          onCancel={() =>
            this.setState({
              lostVisible: false,
            })
          }
          onOk={this.delaylostOnok}
          destroyOnClose={true}
          width={300}
        >
          <LostContent>
            <SpanLeft>男方:</SpanLeft>
            <span>
              &nbsp;&nbsp;{lostInfo.maleName}
              &nbsp;&nbsp;{lostInfo.malePhone}
            </span>
          </LostContent>
          <LostContent>
            <SpanLeft>女方:</SpanLeft>
            <span>
              &nbsp;&nbsp;{lostInfo.femaleName}
              &nbsp;&nbsp;{lostInfo.femalePhone}
            </span>
          </LostContent>
        </UserModal>

        <UserModal
          centered
          title="将与该患者建立联系,请选择随访阶段"
          visible={delaylost}
          closable={false}
          destroyOnClose
          width={450}
          footer={null}
        >
          <FollowForm
            lostInfo={this.state.lostInfo}
            setVisible={this.setVisible}
            onFinish={this.onFinish}
          />
        </UserModal>
      </div>
    )
  }
}
