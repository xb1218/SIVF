import React, { Component } from "react"
import { observer } from "mobx-react"
import { message, Popover } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { BaseInput, BaseFormItem } from "@/app/components/base/formStyles"
import { BaseTable } from "@/app/components/base/baseTable"
import { DateTitleView } from "@/app/components/normal/Title"
import Pagination from "@/app/components/normal/Pagination"
import DeterMineDate from "@/app/components/normal/DetermineDate"
import { LeftSpan, RightSpan, ItemSpans } from "@/app/components/base/baseSpan"
import { handlOrderNumber } from "@/app/utils/tool.js"
import apis from "@/app/utils/apis.js"

export default
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalCount: 1, //数据总数
      typeData: ["卵泡监测", "手术", "专家门诊", "妇科", "男科"],
      groupData: [],
      recordData: null, //选中的行的数据
      pendingList: [], //pending表数据
      queryData: {
        nameNumber: null,
        projectType: "卵泡监测",
        group: "A组",
        pageNum: 1,
        pageSize: 15,
      }, //查询条件
    }
  }
  componentDidMount() {
    this.getAllGroup()
  }
  // 获取所有的组别
  getAllGroup = () => {
    apis.PatientList_pending.getAllGroups().then((res) => {
      this.setState({
        groupData: res.data,
      })
      this.initPage()
    })
  }
  // initPage
  initPage = (data) => {
    let { queryData } = this.state
    apis.PatientList_pending.getPendingList(data ? data : queryData).then(
      (res) => {
        handlOrderNumber(res.data, "list", "serialNumber")
        this.setState({ pendingList: res.data.list })
      }
    )
  }
  // 分页查询
  onPaginChange = (selectedPageNumber) => {
    const { updateOverviewQueryMap } = this.props.store
    let { queryData } = this.state
    queryData.pageNum = selectedPageNumber
    this.initPage(queryData)
    updateOverviewQueryMap({ pageNum: selectedPageNumber })
  }
  // 通过姓名或者病历号查询
  searchFuc = () => {
    let { queryData } = this.state
    this.initPage(queryData)
  }
  // 改变姓名或病历号
  changeName = (e) => {
    let { queryData } = this.state
    queryData.nameNumber = e.target.value
    this.setState({
      queryData: queryData,
    })
  }
  // 删除pending预约
  deletePending = (id) => {
    apis.PatientList_pending.deletePending(id).then((res) => {
      if (res.code === 200) {
        this.initPage()
        message.success("删除成功！")
      } else {
        message.error(res.mesage)
      }
    })
  }
  render() {
    let { pendingList, totalCount, typeData, groupData, queryData } = this.state
    let { pendingQueryMaps } = this.props.store
    const columns = [
      {
        title: "序号",
        dataIndex: "serialNumber",
        align: "center",
        render: (text, record) => <div>{text}</div>,
      },
      {
        title: "姓名",
        dataIndex: "patientName",
        align: "center",
        render: (text, record) => (
          <div>
            {text}
            {record.phone}
          </div>
        ),
      },
      {
        title: "病历号",
        dataIndex: "medicalCard",
        align: "center",
        render: (text, record) => <div>{text}</div>,
      },
      {
        title: "预约类型",
        dataIndex: "reservationType",
        align: "center",
        render: (text, record) => <div>{text}</div>,
      },
      {
        title: "预约项目",
        dataIndex: "reservationProject",
        align: "center",
        render: (text, record) => <div>{text}</div>,
      },
      {
        title: "日期",
        dataIndex: "dateDescription",
        align: "center",
        render: (text, record) => (
          <Popover
            placement="left"
            content={
              <DeterMineDate
                data={record}
                name="pending"
                initPage={this.initPage}
              />
            }
            trigger="click"
          >
            <span
              style={{
                color: "#59b4f4",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {text}
            </span>
          </Popover>
        ),
      },
      {
        title: "地点",
        dataIndex: "place",
        align: "center",
        render: (text, record) => <div>{text}</div>,
      },
      {
        title: "组别",
        dataIndex: "reservationGroup",
        align: "center",
        render: (text, record) => <div>{text}</div>,
      },
      {
        title: "操作",
        align: "center",
        render: (record, text) => (
          <svg
            className="icon_svg_delete"
            onClick={() => this.deletePending(record.uid)}
          >
            <use xlinkHref="#icondelete"></use>
          </svg>
        ),
      },
    ]
    return (
      <>
        <DateTitleView
          title={"筛选条件"}
          style={{
            transition: "height .5s",
            paddingBottom: "10px",
            overflow: "hidden",
            marginRight: 0,
          }}
        >
          <ItemSpans>
            <LeftSpan>类型：</LeftSpan>
            {typeData.map((item, index) => (
              <RightSpan
                key={index}
                onClick={() => {
                  queryData.projectType = item
                  this.initPage(queryData)
                }}
                className={item === queryData.projectType ? "btnDefault" : null}
              >
                {item}
              </RightSpan>
            ))}
          </ItemSpans>
          <ItemSpans>
            <LeftSpan>组别：</LeftSpan>
            {groupData.map((item, index) => (
              <RightSpan
                key={index}
                onClick={() => {
                  queryData.group = item
                  this.initPage(queryData)
                }}
                className={item === queryData.group ? "btnDefault" : null}
              >
                {item}
              </RightSpan>
            ))}
          </ItemSpans>
        </DateTitleView>
        <div style={{ marginTop: "10px" }}>
          <DateTitleView title={"Pending列表"} style={{ marginRight: "0" }}>
            <div style={{ padding: "0 10px" }}>
              <BaseFormItem type="flex" style={{ paddingLeft: "10px" }}>
                <BaseInput
                  style={{ width: "250px" }}
                  placeholder="请输入姓名/病历号检索"
                  suffix={<SearchOutlined onClick={this.searchFuc} />}
                  onChange={this.changeName}
                  onPressEnter={this.searchFuc}
                />
              </BaseFormItem>
              <BaseTable
                columns={columns}
                dataSource={pendingList}
                pagination={false}
              />
              <Pagination
                pageSize={parseInt(pendingQueryMaps.pageSize, 10)}
                total={totalCount}
                current={parseInt(pendingQueryMaps.pageNum, 10)}
                onChange={this.onPaginChange}
              />
            </div>
          </DateTitleView>
        </div>
      </>
    )
  }
}
