import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { Button, DatePicker, Select, Table, Input, message } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { DateTitleView } from "@/app/components/normal/Title"
import { FontInput } from "@/app/components/base/baseFontInput"
import PatientsCard from "@/app/components/normal/PatientsCard"
import Item from "@/app/components/normal/Item"
import styled from "styled-components"
import apis from "@/app/utils/apis"
import moment from "moment"

const SaveDiv = styled.div`
  background-color: #fff;
  margin: 0 10px;
  padding: 30px;
  border-top: 2px solid #59b4f4;
`
const ItemDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  line-height: 36px;
  .ant-btn {
    margin: 10px;
    width: 80px;
  }
`
const { Option } = Select

export default
@inject("frozenRenewal", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      registrationDate: moment(new Date(), "YYYY-MM-DD"), //登记日期
      frozenData: [], //续费列表
      frozenRenewalItem: {
        uidList: [],
        cycleNumber: null,
        femaleIdNumber: "",
        bigDates: [],
        bigDate: null,
        expiryDate: new Date(), //到期日
        registrationDate: this.registrationDate,
        renewalDuration: null,
        renewalUnit: "年",
        renewalMoney: null,
        registrant: null,
        renewalNote: "",
      }, //续费单元
      uidAndBigItem: {
        uid: "",
        bigdate: null,
      },
      uiAndBigdateList: [],
      frozenRenewalEntries: [], //续费后台数据
      registrant: null, //续费登记者
      uidList: [], //续费uid集合
      totalCount: null, //总数
      femaleIdNumber: "", //女方身份证号
      duiDate: moment(new Date()), //到期日
    }
  }
  componentDidMount() {
    this.getList()
  }
  // 选择了几个不同周期的数据，显示几行，生成周期数组
  selectCycle = (list) => {
    let { frozenData } = this.state
    let cycleNumberList = []
    list.forEach((item, index) => {
      frozenData.forEach((itemf, indexf) => {
        if (item === itemf.uid) {
          if (cycleNumberList.indexOf(itemf.cycleNumber)) {
            cycleNumberList.push(itemf.cycleNumber)
          }
        }
      })
    })
    return cycleNumberList
  }
  // 生成后台想要的数据(不同的周期不同的uidlist)
  generatingData = (uidList) => {
    let { frozenRenewalItem, frozenRenewalEntries } = this.state
    let cycleNumberList = this.selectCycle(uidList)
    let arry = this.getCycleUidlist(uidList)
    frozenRenewalEntries = []
    cycleNumberList.forEach((item, index) => {
      frozenRenewalEntries.push(frozenRenewalItem)
      frozenRenewalEntries = JSON.parse(JSON.stringify(frozenRenewalEntries))
      frozenRenewalEntries.forEach((itemf, indexf) => {
        if (indexf === index) {
          itemf.cycleNumber = item
        }
        arry.forEach((itema, indexa) => {
          if (
            itema.cycleNumber === itemf.cycleNumber &&
            !itemf.uidList.includes(itema.uid)
          ) {
            itemf.uidList.push(itema.uid)
            itemf.bigDates.push(itema.bigDate)
            itemf.bigDates.sort((a, b) => {
              return (
                parseInt(b.replace(/\D/g, ""), 10) -
                parseInt(a.replace(/\D/g, ""), 10)
              )
            })
            if (itemf.bigDates.length > 0) {
              itemf.bigDate = itemf.bigDates[0]
            }
          }
        })
      })
    })
    this.setState({
      frozenRenewalEntries: frozenRenewalEntries,
    })
  }
  // 生成带cycle的uidList
  getCycleUidlist = (uidList) => {
    let { frozenData } = this.state
    let arry = []
    frozenData.forEach((item, index) => {
      uidList.forEach((itemu, indexu) => {
        if (item.uid === itemu) {
          arry.push({
            cycleNumber: item.cycleNumber,
            uid: itemu,
            bigDate: item.expiryDate,
          })
        }
      })
    })
    return arry
  }
  //获取续费列表
  getList = () => {
    let { frozenRenewalItem } = this.state
    let select = JSON.parse(localStorage.getItem("selectPerson"))
    this.setState({
      frozenData: select.frozenTubeDTOList,
      totalCount: select.frozenTubeDTOList.length,
      femaleIdNumber: select.femaleIdNumber,
    })
    frozenRenewalItem.femaleIdNumber = select.femaleIdNumber
  }
  // 页面数据刷新
  showDetal = () => {
    let { frozenRenewalEntries, frozenData, uidList } = this.state
    frozenRenewalEntries.forEach((item, index) => {
      frozenData.forEach((itemf, indexf) => {
        if (item.cycleNumber === itemf.cycleNumber && uidList.indexOf(itemf.uid) > -1) {
          itemf.expiryDate = item.expiryDate
        }
      })
    })
    this.setState({
      frozenData: frozenData,
    })
  }
  // 缴费后台接口
  putPay = () => {
    let { frozenRenewalEntries } = this.state
    let json = {
      frozenRenewalEntries: frozenRenewalEntries,
    }
    apis.Frozen.renewal(json).then((res) => {
      this.showDetal()
      message.success(res.data)
    })
  }
  // 计算到期日期
  calculationDue = (item) => {
    switch (item.renewalUnit) {
      case "天":
        item.expiryDate = moment(new Date(item.bigDate))
          .add(item.renewalDuration, "days")
          .format("YYYY-MM-DD")
        break
      case "月":
        item.expiryDate = moment(new Date(item.bigDate))
          .add(item.renewalDuration, "months")
          .format("YYYY-MM-DD")
        break
      case "年":
        item.expiryDate = moment(new Date(item.bigDate))
          .add(item.renewalDuration, "years")
          .format("YYYY-MM-DD")
        break
      default:
        break
    }
  }
  //确定(提交续费)
  confirm = () => {
    this.putPay()
  }
  //取消(取消续费，不展示续费模块)
  cancel = () => {
    this.setState({
      uidList: [],
      frozenRenewalEntries: [],
    })
  }
  //选中的uid列表
  onSelectChange = (selectedRowKeys) => {
    this.setState({ uidList: selectedRowKeys })
    this.generatingData(selectedRowKeys)
  }
  //单位切换(select框的改变)
  unitChange = (value, item, parm) => {
    let { frozenRenewalEntries } = this.state
    item[parm] = value
    this.calculationDue(item)
    this.setState({
      frozenRenewalEntries: frozenRenewalEntries,
    })
  }
  // 改变输入框中的值
  changeInput = (e, item, parm) => {
    let { frozenRenewalEntries } = this.state
    if (parm !== "renewalNote") {
      item[parm] = e.target.value ? parseInt(e.target.value) : ""
    } else {
      item[parm] = e.target.value
    }
    if (parm === "renewalDuration") {
      this.calculationDue(item)
    }
    this.setState({
      frozenRenewalEntries: frozenRenewalEntries,
    })
  }
  // 改变日期
  changeDate = (date, dateString, item, parm) => {
    let { frozenRenewalEntries } = this.state
    item[parm] = dateString
    this.setState({
      frozenRenewalEntries: frozenRenewalEntries,
    })
  }
  // 添加登记日和登记人
  addRegistrant = (registrant, registrationDate) => {
    let { frozenRenewalEntries } = this.state
    frozenRenewalEntries.forEach((item, index) => {
      item.registrant = registrant
      item.registrationDate = registrationDate
    })
    this.setState({
      frozenRenewalEntries: frozenRenewalEntries,
    })
  }
  render() {
    const selectPerson = JSON.parse(localStorage.getItem("selectPerson"))
    const malePerson = {
      maleAge: selectPerson.maleAge,
      maleIdNumber: selectPerson.maleIdNumber,
      malePatientName: selectPerson.maleName,
      malePhone: selectPerson.malePhone,
      malePid: selectPerson.malePid,
    }
    const femalePerson = {
      femaleAge: selectPerson.femaleAge,
      femaleIdNumber: selectPerson.femaleIdNumber,
      femalePatientName: selectPerson.femaleName,
      femalePhone: selectPerson.femalePhone,
      femalePid: selectPerson.femalePid,
    }
    let { getRowSpan } = this.props.store
    let {
      registrant,
      frozenData,
      uidList,
      totalCount,
      frozenRenewalEntries,
      registrationDate,
    } = this.state
    let type = localStorage.getItem("type")
    let headTitle =
      type === "冻卵"
        ? "卵子（枚）"
        : type === "冻精"
        ? "精子（管）"
        : type === "卵巢组织"
        ? "卵巢组织（片）"
        : type === "冻胚"
        ? "胚胎（枚）"
        : null
    const rowSelection = {
      selectedRowKeys: uidList,
      onChange: this.onSelectChange,
    }
    const frozenColumns = [
      {
        dataIndex: "cycleNumber",
        key: "cycleNumber",
        title: "周期号",
      },
      {
        dataIndex: "frozenDate",
        key: "frozenDate",
        title: "冷冻日期",
      },
      {
        dataIndex: "expiryDate",
        key: "expiryDate",
        title: "到期日期",
      },
      {
        dataIndex: "frozenTubeNum",
        key: "frozenTubeNum",
        title: "管号",
      },
      {
        dataIndex: "amount",
        key: "amount",
        title: `${headTitle}`,
      },
      {
        dataIndex: "evaluation",
        key: "evaluation",
        title: "评分",
        className: type === "冻胚" ? null : "notshowcol",
      },
    ]
    return (
      <>
        <div
          style={{ padding: 10, alignItems: "center" }}
          onClick={() => this.props.history.push("/public/renewal/frozen")}
        >
          <ArrowLeftOutlined />
          <span style={{ paddingLeft: "10px" }}>续费</span>
        </div>
        <div style={{ margin: "0 10px 10px 10px" }}>
          <PatientsCard
            name="frozen"
            malePerson={malePerson}
            femalePerson={femalePerson}
          />
        </div>
        <DateTitleView
          title={`${type}情况（${totalCount}条）`}
          style={{ marginLeft: "10px" }}
        >
          <div style={{ padding: "0 20px", width: "100%" }}>
            <Table
              columns={frozenColumns}
              dataSource={getRowSpan(frozenData, "cycleNumber")}
              pagination={false}
              rowKey={(record) => record.uid}
              rowSelection={rowSelection}
            />
          </div>
        </DateTitleView>
        {uidList.length > 0 ? (
          <SaveDiv>
            {frozenRenewalEntries.map((item, index) => {
              return (
                <ItemDiv key={index}>
                  <Item title="周期号">
                    <span>{item.cycleNumber}</span>
                  </Item>
                  <Item title="续">
                    <Input
                      value={item.renewalDuration}
                      onChange={(e) =>
                        this.changeInput(e, item, "renewalDuration")
                      }
                    />
                    <Select
                      defaultValue={item.renewalUnit}
                      value={item.renewalUnit}
                      onChange={(value) =>
                        this.unitChange(value, item, "renewalUnit")
                      }
                      style={{ width: 60 }}
                    >
                      <Option value="年">年</Option>
                      <Option value="月">月</Option>
                      <Option value="天">天</Option>
                    </Select>
                  </Item>
                  <Item title="到期日">
                    <DatePicker
                      style={{ width: "130px" }}
                      defaultValue={
                        item.expiryDate ? moment(item.expiryDate) : ""
                      }
                      value={item.expiryDate ? moment(item.expiryDate) : ""}
                      onChange={(date, dateString) =>
                        this.changeDate(date, dateString, item, "expiryDate")
                      }
                    />
                  </Item>
                  <Item title="金额">
                    <FontInput
                      addonAfter="元"
                      value={item.renewalMoney}
                      onChange={(e) =>
                        this.changeInput(e, item, "renewalMoney")
                      }
                    />
                  </Item>
                  <Item title="说明" style={{ flex: 1 }}>
                    <Input
                      value={item.renewalNote}
                      onChange={(e) => this.changeInput(e, item, "renewalNote")}
                    />
                  </Item>
                </ItemDiv>
              )
            })}
            <ItemDiv>
              <Item title="登记日">
                <DatePicker
                  style={{ width: "170px" }}
                  value={registrationDate ? moment(registrationDate) : ""}
                  onChange={(date, dateString) => {
                    this.setState({ registrationDate: dateString })
                    this.addRegistrant(registrant, dateString)
                  }}
                />
              </Item>
              <Item title="登记者">
                <Select
                  placeholder="请选择"
                  defaultValue={registrant}
                  onChange={(value) => {
                    this.setState({ registrant: value })
                    this.addRegistrant(value, registrationDate)
                  }}
                  style={{ width: "130px" }}
                >
                  <Option value="王医生">王医生</Option>
                  <Option value="张医生">张医生</Option>
                  <Option value="马医生">马医生</Option>
                </Select>
              </Item>
              <Item>
                <div style={{ width: 130 }}></div>
              </Item>
            </ItemDiv>
            <ItemDiv style={{ justifyContent: "center" }}>
              <Button onClick={this.cancel}>取消</Button>
              <Button
                onClick={this.confirm}
                type="primary"
                style={{ marginLeft: "30px" }}
              >
                确认
              </Button>
            </ItemDiv>
          </SaveDiv>
        ) : null}
      </>
    )
  }
}
