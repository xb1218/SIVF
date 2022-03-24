import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { DatePicker, Button, Select, message } from "antd"
import moment from "moment"
import { DownOutlined, UpOutlined, SearchOutlined } from "@ant-design/icons"
import { BaseInput, BaseFormItem } from "@/app/components/base/formStyles"
import { LeftSpan, RightSpan, ItemSpans } from "@/app/components/base/baseSpan"
import { TableNomargin } from "@/app/components/base/baseTable"
import BaseBread from "@/app/components/base/baseBread"
import { DateTitleView } from "@/app/components/normal/Title"
import Pagination from "@/app/components/normal/Pagination"
import { BaseDrawer } from "@/app/components/base/baseDrawer.js"
import { handlOrderNumber } from "@/app/utils/tool.js"
import apis from "@/app/utils/apis"
import MoreDetail from "./moreDetail"
import "./index.scss"

const { RangePicker } = DatePicker
let todayString = moment(new Date()).format("YYYY-MM-DD")
const { Option } = Select

export default
@inject("moredetail", "store")
@observer
class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      detailType: 0, //0代表选择的是日期，1代表选择的是超期未返诊
      searchParams: null, //detailType为0的时候的筛选条件
      visitType: 0, //初复诊为0，进周期为1,IUI周期为2
      overDueItem: 0, //选中的超期未返诊的值
      visible: false,
      screenShow: true, //展开收起状态
      startdate: todayString, //开始手术日期
      enddate: todayString, //结束手术日期
      name: null,
      pageno: 1,
      searchQueryData: {
        clinicType: "初诊", //门诊类型
        iuiType: null,
        ivfType: null,
        fetType: null,
        groupType: [],
      },
      datasourceList: [],
      notFollow: [
        { value: "三个月", key: 0 },
        { value: "六个月", key: 1 },
        { value: "一年", key: 2 },
      ], //超期未返诊
      clinicTitle: ["初诊", "复诊", "自然"], // 门诊
      iuiTitle: ["进周期", "扳机", "IUI手术"], //iui
      ivfTitle: ["进周期", "降调节启动日", "GN启动日", "扳机", "取卵", "移植"], //ivf
      fetTitle: ["进周期", "黄体", "解冻", "移植"], //fet
      groupTitle: [
        { value: "PCOS", checked: false },
        { value: "POI", checked: false },
        { value: "围绝经期", checked: false },
      ], //入组
    }
  }
  componentDidMount() {
    this.props.moredetail.patinetsList = this.state.datasourceList
  }
  // 组别选中状态更改
  groupCheck = (index) => {
    let { groupTitle, searchQueryData } = this.state
    searchQueryData.groupType = []
    searchQueryData.clinicType = null
    groupTitle[index].checked = !groupTitle[index].checked
    groupTitle.filter((item) => {
      if (item.checked) {
        searchQueryData.groupType.push(item.value)
      }
      return null
    })
    // 判断当前是否有周期和周期类型
    this.setState({
      groupTitle,
      searchQueryData,
    })
  }
  //筛选条件取值
  setVal = (param, val) => {
    let { searchQueryData, groupTitle } = this.state
    if (param === "clinicType") {
      groupTitle = [
        { value: "PCOS", checked: false },
        { value: "POI", checked: false },
        { value: "围绝经期", checked: false },
      ]
    }
    for (let key in searchQueryData) {
      if (key === param) {
        searchQueryData[key] = val
      } else {
        if (param === "clinicType") {
          searchQueryData[key] = null
        } else {
          if (key !== "groupType") {
            searchQueryData[key] = null
          }
        }
      }
    }
    this.setState({
      searchQueryData,
      groupTitle,
    })
  }
  // 筛选日期 选中状态更改
  dateChange = (date, dateString) => {
    this.setState({
      startdate: dateString[0],
      enddate: dateString[1],
      detailType: 0,
    })
  }
  //点击查看详情->基本信息
  getPatientDetail = (record, sex) => {
    let paramobj = {
      cycleNumber: record.cycleNumber,
      patientPid: sex ? record.femalePid : record.malePid,
      patientSex: sex ? 1 : 0,
      spousePid: sex ? record.malePid : record.femalePid,
      date: record.saveDate, //补录日期
      treatStage: record.treatStage, //周期阶段
    }
    this.props.store.select_one = paramobj
    this.props.store.patientSex = sex ? 1 : 0
    this.setState({
      visible: true,
    })
  }
  // 筛选条件
  searchFuc = () => {
    let { detailType } = this.state
    if (detailType) {
      this.searchOverdue()
    } else {
      this.searchDate()
    }
  }
  // 筛选查询，超期未返诊
  searchOverdue = () => {
    let { putKeys } = this.props.moredetail
    let { name, searchQueryData, overDueItem, pageno } = this.state
    let obj = {
      overdueReturnTag: overDueItem,
      enterGroup: searchQueryData.groupType,
      nameNumber: name,
      pageNum: pageno,
      pageSize: 15,
    }
    apis.Patients_more.getOverduelist(obj).then((res) => {
      handlOrderNumber(res.data, "list", "orderNumber")
      putKeys(res.data.list)
      this.setState({
        datasourceList: res.data.list,
        visitType: 2,
      })
      this.props.moredetail.patinetsList = res.data
    })
  }
  //筛选查询，日期的筛选条件
  searchDate = () => {
    let { startdate, enddate, searchQueryData, name, pageno } = this.state
    let obj_state = null
    let currentType = null
    let obj_type = null
    let arr = ["初诊", "复诊", "ivfType", "iuiType", "fetType"]
    //取 周期阶段，周期类型值
    for (let key in searchQueryData) {
      if (searchQueryData[key] !== null && key !== "groupType") {
        if (key === "clinicType") {
          currentType = searchQueryData[key]
        } else {
          obj_state = searchQueryData[key]
          currentType = key
        }
      }
    }
    // 自然周期单独判断
    if (currentType === "自然") {
      obj_type = 6
    }
    //周期类型值转成对应数字
    arr.filter((item, index) => {
      if (item === currentType) {
        obj_type = index
      }
      return null
    })
    let obj = {
      startDate: startdate || todayString,
      endDate: enddate || todayString,
      treatTypeTag: searchQueryData.clinicType ? 0 : 1, //就诊标志（0=门诊；1=进周期）
      treatType: obj_type, // 治疗阶段0：初诊1：复诊2：IVF3:IUI4:FET,6:自然
      cycleState: obj_state, //周期阶段
      enterGroup: searchQueryData.groupType,
      nameNumber: name,
      pageNum: pageno,
      pageSize: 15,
    }
    this.setState({
      searchParams: obj,
    })
    let { setlocalQuery } = this.props.store
    setlocalQuery(obj, "patients_detail_query")
    if (obj.enterGroup && obj.enterGroup.length > 0) {
      if (obj_state) {
        this.getDataList(obj, obj_type)
      } else {
        message.warning("请选择哪一种周期类型!")
      }
    } else {
      this.getDataList(obj, obj_type)
    }
  }
  // 查询封装
  getDataList = (obj, obj_type) => {
    let { putKeys } = this.props.moredetail
    apis.Patients_more.getMorePatiens(obj).then((res) => {
      handlOrderNumber(res.data, "list", "orderNumber")
      putKeys(res.data.list)
      this.setState({
        datasourceList: res.data.list,
        visitType: obj_type,
      })
      this.props.moredetail.patinetsList = res.data
    })
  }
  //分页查询
  onPaginChange = (selectedPageNumber) => {
    let { searchParams } = this.state
    searchParams.pageNum = selectedPageNumber
    const { updateQueryMap, putKeys } = this.props.moredetail
    updateQueryMap({ pageNum: selectedPageNumber })
    // 刷新查询接口
    apis.Patients_more.getMorePatiens(searchParams).then((res) => {
      handlOrderNumber(res.data, "list", "orderNumber")
      putKeys(res.data.list)
      this.setState({
        datasourceList: res.data.list,
      })
      this.props.moredetail.patinetsList = res.data
    })
  }
  render() {
    let {
      clinicTitle,
      iuiTitle,
      ivfTitle,
      fetTitle,
      groupTitle,
      screenShow,
      searchQueryData,
      startdate,
      enddate,
      visible,
      visitType,
      notFollow,
      overDueItem,
      detailType,
    } = this.state
    const { queryMaps, patinetsList } = this.props.moredetail
    let { select_one } = this.props.store
    const datasourceList = patinetsList.list || [] //真实存放数据
    const totalCount = patinetsList.total || 1
    let clums = [
      {
        dataIndex: "orderNumber",
        title: "序号",
        key: "orderNumber",
        align: "center",
        width: 50,
      },
      {
        dataIndex: "medicalRecordNum",
        title: "病历号",
        key: "medicalRecordNum",
        align: "center",
        width: 80,
      },
      {
        dataIndex: "femaleName",
        title: "女方",
        key: "femaleName",
        align: "center",
        render: (text, record) => {
          return (
            <a
              href="#!"
              style={{ textDecoration: "underline" }}
              onClick={() => this.getPatientDetail(record, 1)}
            >
              {text}
              <span className="one_space" />
              {record.femalePhone}
            </a>
          )
        },
      },
      {
        dataIndex: "maleName",
        title: "男方",
        key: "maleName",
        align: "center",
        render: (text, record) => {
          return (
            <a
              href="#!"
              style={{ textDecoration: "underline" }}
              onClick={() => this.getPatientDetail(record, 0)}
            >
              {text}
              <span className="one_space" />
              {record.malePhone}
            </a>
          )
        },
      },
      {
        dataIndex: "eggRetrievalNumber",
        title: "取卵次数",
        key: "eggRetrievalNumber",
        align: "center",
        className: visitType === 2 || visitType === 4 ? null : "disShow",
        render: (text, recrd) => {
          return <span>{text ? text : 0}</span>
        },
      },
      {
        dataIndex: "transplantNumber",
        title: "移植次数",
        key: "transplantNumber",
        align: "center",
        className: visitType === 2 || visitType === 4 ? null : "disShow",
        render: (text, recrd) => {
          return <span>{text ? text : 0}</span>
        },
      },
      {
        dataIndex: "artMethod",
        title: "ART方式",
        key: "artMethod",
        align: "center",
        className:
          visitType === 2 || visitType === 3 || visitType === 4
            ? null
            : "disShow",
      },
      {
        dataIndex: "cycleType",
        title: "周期类型",
        key: "cycleType",
        align: "center",
        className:
          visitType === 2 || visitType === 3 || visitType === 4
            ? null
            : "disShow",
      },
      {
        dataIndex: "cycleResult",
        title: "周期结局",
        key: "cycleResult",
        align: "center",
        className:
          visitType === 2 || visitType === 3 || visitType === 4
            ? null
            : "disShow",
      },
      {
        title: "就诊日期",
        dataIndex: "visitDate",
        key: "visitDate",
        align: "center",
      },
    ]
    return (
      <div className="contentWrap">
        <BaseBread first="更多患者" />
        <div className="patientMore">
          <DateTitleView
            title="筛选条件"
            style={{
              transition: "height .5s",
              paddingBottom: "10px",
              overflow: "hidden",
              marginRight: 0,
            }}
            select={
              screenShow ? (
                <DownOutlined
                  onClick={() => this.setState({ screenShow: !screenShow })}
                />
              ) : (
                <UpOutlined
                  onClick={() => this.setState({ screenShow: !screenShow })}
                />
              )
            }
          >
            {screenShow ? (
              <>
                <ItemSpans>
                  <LeftSpan style={{ width: "130px" }}>
                    <Select
                      style={{ width: "98%" }}
                      value={detailType}
                      onChange={(val) =>
                        this.setState({
                          detailType: val,
                        })
                      }
                      // dropdownMatchSelectWidth={130}
                    >
                      <Option value={0}>日期</Option>
                      <Option value={1}>超期未返诊</Option>
                    </Select>
                  </LeftSpan>
                  {detailType ? (
                    <>
                      {notFollow.map((item, index) => (
                        <RightSpan
                          key={index}
                          onClick={() => {
                            this.setState({
                              overDueItem: item.key,
                              detailType: 1,
                            })
                          }}
                          className={
                            item.key === overDueItem ? "btnDefault" : null
                          }
                        >
                          {item.value}
                        </RightSpan>
                      ))}
                    </>
                  ) : (
                    <RightSpan>
                      <RangePicker
                        onChange={(date, dateString) =>
                          this.dateChange(date, dateString)
                        }
                        defaultValue={[
                          moment(startdate, "YYYY-MM-DD"),
                          moment(enddate, "YYYY-MM-DD"),
                        ]}
                        format={"YYYY-MM-DD"}
                      />
                    </RightSpan>
                  )}
                </ItemSpans>
                {detailType ? null : (
                  <>
                    <ItemSpans>
                      <LeftSpan>门诊：</LeftSpan>
                      {clinicTitle.map((item, index) => (
                        <RightSpan
                          style={{ width: "81px" }}
                          key={index}
                          onClick={() => this.setVal("clinicType", item)}
                          className={
                            item === searchQueryData.clinicType
                              ? "btnDefault"
                              : null
                          }
                        >
                          {item}
                        </RightSpan>
                      ))}
                    </ItemSpans>
                    <ItemSpans>
                      <LeftSpan>IUI：</LeftSpan>
                      {iuiTitle.map((item, index) => (
                        <RightSpan
                          key={index}
                          onClick={() => this.setVal("iuiType", item)}
                          className={
                            item === searchQueryData.iuiType
                              ? "btnDefault"
                              : null
                          }
                        >
                          {item}
                        </RightSpan>
                      ))}
                    </ItemSpans>
                    <ItemSpans>
                      <LeftSpan>IVF：</LeftSpan>
                      {ivfTitle.map((item, index) => (
                        <RightSpan
                          key={index}
                          onClick={() => this.setVal("ivfType", item)}
                          className={
                            item === searchQueryData.ivfType
                              ? "btnDefault"
                              : null
                          }
                        >
                          {item}
                        </RightSpan>
                      ))}
                    </ItemSpans>
                    <ItemSpans>
                      <LeftSpan>FET：</LeftSpan>
                      {fetTitle.map((item, index) => (
                        <RightSpan
                          key={index}
                          onClick={() => this.setVal("fetType", item)}
                          className={
                            item === searchQueryData.fetType
                              ? "btnDefault"
                              : null
                          }
                        >
                          {item}
                        </RightSpan>
                      ))}
                    </ItemSpans>
                  </>
                )}
                <ItemSpans>
                  <LeftSpan>入组：</LeftSpan>
                  {groupTitle.map((item, index) => (
                    <RightSpan
                      style={{ width: index === 0 ? "82px" : null }}
                      key={index}
                      onClick={() => {
                        this.groupCheck(index)
                      }}
                      className={
                        // searchQueryData.groupType && item.checked
                        item.checked === true ? "btnDefault" : null
                      }
                    >
                      {item.value}
                    </RightSpan>
                  ))}
                </ItemSpans>
                <Button
                  style={{ marginRight: "20px", float: "right" }}
                  type="primary"
                  size="small"
                  onClick={this.searchFuc}
                >
                  筛选
                </Button>
              </>
            ) : null}
          </DateTitleView>
          <DateTitleView title="患者列表" style={{ marginRight: 0 }}>
            <div style={{ padding: "0 10px", width: "100%" }}>
              <BaseFormItem type="flex" style={{ paddingLeft: "10px" }}>
                <BaseInput
                  style={{ width: "250px" }}
                  placeholder="请输入姓名 病历号检索"
                  suffix={<SearchOutlined onClick={this.searchFuc} />}
                  onChange={(e) => this.setState({ name: e.target.value })}
                  onPressEnter={this.searchFuc}
                />
              </BaseFormItem>
              <TableNomargin
                style={{ width: "100%", paddingLeft: "10px" }}
                columns={clums}
                pagination={false}
                dataSource={datasourceList}
              />
              <Pagination
                pageSize={parseInt(queryMaps.pageSize, 10)}
                total={totalCount}
                current={parseInt(queryMaps.pageNum, 10)}
                onChange={this.onPaginChange}
              />
            </div>
          </DateTitleView>
        </div>
        <BaseDrawer
          width={"80em"}
          visible={visible}
          onclose={() => {
            this.setState({ visible: false })
          }}
        >
          <MoreDetail selectPatient={select_one} />
        </BaseDrawer>
      </div>
    )
  }
}
