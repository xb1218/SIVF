import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { observable } from "mobx"
import { DatePicker, Button, Select } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import BaseBread from "@/app/components/base/baseBread"
import { DateTitleView } from "@/app/components/normal/Title"
import { RightSpan } from "@/app/components/base/baseSpan"
import { BaseInput, BaseFormItem } from "@/app/components/base/formStyles"
import { BaseTable } from "@/app/components/base/baseTable"
import BaseSelect from "@/app/components/base/baseSelect.js"
import Pagin from "@/app/components/normal/Pagination"
import "../index.scss"
import styled from "styled-components"
import moment from "moment"
import apis from "@/app/utils/apis"
import Resume from "./resume.js"

const FilterWarp = styled.div`
  display: flex;
  padding: 12px;
  flex-direction: column;
  width: -webkit-fill-available;
  background-color: white;
  border-radius: 2px;
  margin-bottom: 10px;
  > div {
    height: 40px;
    line-height: 40px;
  }
`
const { Option } = Select
const { RangePicker } = DatePicker

export default
@inject("frozenRenewal", "store")
@observer
class index extends Component {
  @observable date = 0
  constructor(props) {
    super(props)
    this.state = {
      listData: [], //
      //筛选类型
      dataValue: [
        { value: "冻胚", checked: true },
        { value: "冻卵", checked: false },
        { value: "冻精", checked: false },
        { value: "卵巢组织", checked: false },
      ],
      //距到期
      dateTitle: [
        { value: "一周", checked: true },
        { value: "一个月", checked: false },
        { value: "二个月", checked: false },
        { value: "三个月", checked: false },
      ],
      totalCount: 20,
      frozenStart: moment(new Date("2020-03-17")).format("YYYY-MM-DD"),
      frozenEnd: moment(new Date()).format("YYYY-MM-DD"),
      expireDay: 0, //距到期日，（0:一周1:一个月2:二个月3:三个月4:逾期）
      frozenOrExpireTag: 0, //冷冻日or到期日标记（冷冻日=0；到期日和逾期=1）
      type: "冻胚", //类别（冻胚冻卵冻精卵巢组织）
      name: null, //筛选条件姓名
    }
  }
  //初始化
  componentDidMount() {
    this.getFronzenInfo()
  }
  //获取列表信息
  getFronzenInfo = () => {
    let { queryMaps } = this.props.frozenRenewal
    let {
      frozenStart,
      frozenEnd,
      expireDay,
      name,
      type,
      frozenOrExpireTag,
    } = this.state
    let parsms = {
      frozenStart,
      frozenEnd,
      expireDay,
      frozenOrExpireTag,
      name,
      type,
      pageNum: queryMaps.pageNum,
      pageSize: queryMaps.pageSize,
    }
    apis.Frozen.getFronzenInfo(parsms).then((res) => {
      this.setState({
        listData: res.data.list,
        totalCount: res.data.total,
      })
    })
  }
  //查看续费详情
  personRenewal = (record, index) => {
    let { setSelectedPerson, type } = this.props.frozenRenewal
    let { setlocalQuery, select_one } = this.props.store
    let rec = JSON.stringify(record)
    let parm = {
      patientPid: record.femalePid ? record.femalePid : record.malePid,
      patientSex: record.femalePid ? 1 : 0,
    }
    setlocalQuery(parm, select_one)
    localStorage.setItem("selectPerson", rec) //将选中的人的信息存入缓存
    localStorage.setItem("type", type)
    setSelectedPerson(record)
    this.props.history.push("/public/renewal/renewal")
  }
  //查看履历
  personResume = (record, index) => {
    //请求获取履历接口,接口请求成功后
    let { setResumeList, setResume } = this.props.frozenRenewal
    let data = {
      femaleIdNumber: record.femaleIdNumber,
    }
    apis.Frozen.getFronzenResume(data).then((res) => {
      setResumeList(res.data)
      setResume()
    })
  }
  //条件切换
  changeChecked = (data, index, val, str) => {
    let { dateTitle, dataValue } = this.state
    let { setSelectedType } = this.props.frozenRenewal
    data.forEach((item, index) => {
      item.checked = false
    })
    data[index].checked = true
    if (str === "dataValue") {
      this.setState({
        dataValue: [...dataValue],
        type: val,
      })
      setSelectedType(val)
    } else {
      this.setState({
        dateTitle: [...dateTitle],
        expireDay: index,
      })
    }
  }
  //名字改变(搜索框)
  changeName = (e) => {
    this.setState({
      name: e.target.value,
    })
  }
  //类型切换
  changefrozenOrExpireTag = (val) => {
    this.setState({
      frozenOrExpireTag: val,
    })
    if (val === 2) {
      this.setState({
        expireDay: 4,
      })
    }
  }
  // 手术日期
  freeDateChange = (date, dateString) => {
    this.setState({
      frozenStart: dateString[0],
      frozenEnd: dateString[1],
    })
  }
  //分页跳转
  onPaginChange = (selectedPageNumber) => {
    const { updateQueryMap } = this.props.frozenRenewal
    updateQueryMap({ pageNum: selectedPageNumber })
    this.getFronzenInfo()
  }
  render() {
    const {
      frozenStart,
      frozenEnd,
      listData,
      dataValue,
      dateTitle,
      totalCount,
      frozenOrExpireTag,
      type,
    } = this.state
    let { queryMaps } = this.props.frozenRenewal
    const columns = [
      {
        dataIndex: "earliestFrozenDate",
        title: "冷冻日期",
        key: "earliestFrozenDate",
        align: "center",
      },
      {
        dataIndex: "femaleName",
        title: "女方",
        key: "femaleName",
        align: "center",
      },
      {
        dataIndex: "maleName",
        title: "男方",
        key: "maleName",
        align: "center",
      },
      {
        dataIndex: "femalePhone",
        title: "联系电话",
        key: "femalePhone",
        align: "center",
      },
      {
        dataIndex: "homeTelephone",
        title: "家庭电话",
        key: "homeTelephone",
        align: "center",
      },
      {
        dataIndex: "lastExpiryDate",
        title: "到期日期",
        key: "lastExpiryDate",
        width: "14%",
        align: "center",
      },
      {
        dataIndex: "Doit",
        title: "操作",
        key: "Doit",
        align: "center",
        render: (text, record, index) => {
          return (
            <span>
              <span
                style={{
                  textDecoration: "underline",
                  color: "#FFA25C",
                  cursor: "pointer",
                }}
                onClick={() => this.personRenewal(record, index)}
              >
                续费
              </span>
              <span
                style={{
                  textDecoration: "underline",
                  color: "#59B4F4",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
                onClick={() => this.personResume(record, index)}
              >
                履历
              </span>
            </span>
          )
        },
      },
    ]
    return (
      <div className="frozenRenewal contentWrap">
        <BaseBread first="冷冻管理" />
        <FilterWarp>
          <div>
            {dataValue.map((item, index) => (
              <RightSpan
                key={index}
                style={{ paddingLeft: 10 }}
                onClick={() =>
                  this.changeChecked(dataValue, index, item.value, "dataValue")
                }
                className={item.checked === true ? "textBlue" : null}
              >
                {item.value}
              </RightSpan>
            ))}
          </div>
          <div>
            <BaseSelect
              width={100}
              height={30}
              style={{ marginLeft: 10 }}
              value={frozenOrExpireTag}
              onChange={this.changefrozenOrExpireTag}
            >
              <Option key={0} value={0}>
                冷冻日
              </Option>
              <Option key={1} value={1}>
                距到期
              </Option>
              <Option key={2} value={2}>
                逾期
              </Option>
            </BaseSelect>
            {frozenOrExpireTag === 1 ? (
              dateTitle.map((item, index) => (
                <RightSpan
                  key={index}
                  onClick={() =>
                    this.changeChecked(
                      dateTitle,
                      index,
                      item.value,
                      "dataTitle"
                    )
                  }
                  className={item.checked === true ? "textBlue" : null}
                >
                  {item.value}
                </RightSpan>
              ))
            ) : frozenOrExpireTag === 0 ? (
              <RightSpan>
                <RangePicker
                  onChange={this.freeDateChange}
                  defaultValue={[
                    moment(frozenStart, "YYYY-MM-DD"),
                    moment(frozenEnd, "YYYY-MM-DD"),
                  ]}
                  format={"YYYY-MM-DD"}
                />
              </RightSpan>
            ) : null}
            <Button
              style={{ float: "right" }}
              type="primary"
              onClick={this.getFronzenInfo}
            >
              筛选
            </Button>
          </div>
        </FilterWarp>
        <DateTitleView
          title={type + "列表"}
          style={{ marginRight: 0, marginBottom: 0 }}
          selectOption={
            <BaseFormItem type="flex" style={{ paddingLeft: "20px" }}>
              <BaseInput
                width="250"
                placeholder="请输入姓名/助记符检索"
                suffix={<SearchOutlined onClick={this.getFronzenInfo} />}
                onChange={this.changeName}
                onPressEnter={this.getFronzenInfo}
              />
            </BaseFormItem>
          }
        >
          <div
            style={{
              padding: "0 10px",
              width: "100%",
              height: "calc(100vh - 20px)",
            }}
          >
            {/* 列表 */}
            <BaseTable
              rowKey="idNumber"
              style={{ width: "100%" }}
              columns={columns}
              pagination={false}
              dataSource={listData}
            />
            <Pagin
              pageSize={parseInt(queryMaps.pageSize, 10)}
              total={totalCount}
              current={parseInt(queryMaps.pageNum, 10)}
              onChange={this.onPaginChange}
            />
          </div>
        </DateTitleView>
        <Resume />
      </div>
    )
  }
}
