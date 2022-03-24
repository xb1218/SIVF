import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { Select, Row, message, Menu, Dropdown } from "antd"
import { withRouter } from "react-router-dom"
import { PlusOutlined } from "@ant-design/icons"
import { DashBtn } from "@/app/components/base/baseBtn"
import { BaseModal } from "@/app/components/base/baseModal"
import { AddPatient } from "@/app/components/normal/AddPatient"
import { BaseFormItem } from "../../../components/base/formStyles"
import GetMessage from "@/app/components/normal/ReceiveMessage"
import "./index.scss"
import apis from "@/app/utils/apis"

const { Option } = Select

let timeout
let currentValue

@inject("store")
@observer
class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      isInfo: false,
      isWord: false,
      patientData: [],
      data: [],
      value: undefined,
      addModal: false,
    }
  }
  //患者搜索
  handleSearch = async (value) => {
    await this.setState({
      isInfo: false,
      isWord: false,
      data: [],
    })
    if (value) {
      this.getPatients(value, (data) => this.setState({ data }))
    } else {
      this.setState({ data: [] })
    }
  }
  //option的选择
  handleChange = (value) => {
    this.setState({ value, isInfo: false, visible: false })
    this.colorPatient(value)
  }
  //渲染患者信息
  colorPatient = (value) => {
    apis.Patients_search.getPatients({ param: value }).then((res) => {
      this.setState({
        isInfo: true,
        patientData: res.data[0],
      })
    })
  }
  //获取患者下拉框信息
  getPatients = (value, callback) => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    currentValue = value
    let fake = () => {
      apis.Patients_search.getPatients({ param: value }).then((res) => {
        if (res.data === null) {
          this.setState({
            isWord: true,
          })
        } else {
          if (currentValue === value) {
            const data = []
            res.data.forEach((item) => {
              data.push({
                medicalCard: item.medicalCard,
                patientName: item.patientName,
                idNumber: item.idNumber,
                phone: item.phone,
              })
            })
            callback(data)
          }
        }
      })
    }
    timeout = setTimeout(fake, 300)
  }
  //添加患者
  addPerson = () => {
    this.setState({
      isInfo: true,
      visible: false,
    })
  }
  //下拉框onchange
  workTypeChange = (value) => {
    localStorage.setItem("typeVal")
    //获取患者列表数据
    this.props.store.getPatientsList(value)
  }
  //确定按钮
  submit = () => {}
  //取消
  cancel = () => {
    this.setState({
      visible: !this.state.visible,
      isInfo: false,
      value: null,
    })
  }
  //退出登录
  logoutFuc = () => {
    this.props.history.push("/public/login")
    localStorage.clear()
    apis.Auth.loginout().then((res) => {
      message.success(res.message)
    })
  }
  render() {
    //标题容器
    let { visible, isInfo, data, value, isWord, patientData } = this.state
    let typeVal = localStorage.getItem("typeVal")
    const options = data.map((item) => (
      <Option key={item.medicalCard + " " + item.patientName}>
        {item.medicalCard} {item.patientName}
      </Option>
    ))
    const SelectOption = () => {
      return (
        <Select
          style={{ width: 118 }}
          onChange={this.workTypeChange}
          defaultValue={typeVal}
        >
          <Option value="卵泡监测">卵泡监测</Option>
          <Option value="专家门诊">专家门诊</Option>
          <Option value="手术">手术</Option>
          <Option value="妇科">妇科</Option>
          <Option value="男科">男科</Option>
        </Select>
      )
    }

    const menu = (
      <Menu>
        <Menu.Item>密码修改</Menu.Item>
        <Menu.Item onClick={this.logoutFuc}>退出登录</Menu.Item>
      </Menu>
    )
    return (
      <div className="header">
        <div style={{ display: "flex" }}>
          <div className="head-item">
            <div className="page-header-logo" />
            <span style={{ fontSize: "24px" }}>IVF延展跟踪数据系统</span>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {/* 登陆者所接收到的信息 */}
          <div className="head-item" id="messages">
            <GetMessage />
          </div>

          <Dropdown overlay={menu}>
            <div
              className="head-item"
              style={{ marginLeft: "40px", marginRight: "20px" }}
            >
              <svg className="icon_head" aria-hidden="true">
                <use xlinkHref="#iconguanliyuanmorentouxiang"></use>
              </svg>
              <span>{localStorage.getItem("username")}</span>
            </div>
          </Dropdown>

          {localStorage.getItem("tag") === "true" ? (
            <div style={{ marginLeft: "20px", marginRight: "20px" }}>
              <SelectOption />
            </div>
          ) : null}
        </div>
        <BaseModal
          title="搜索"
          width="820px"
          onCancel={this.cancel}
          visible={visible}
          footer={null}
        >
          <BaseFormItem type="flex" style={{ margin: "10px", height: "40px" }}>
            <Select
              showSearch
              value={value}
              placeholder="请输入姓名/助记符/PID/手机号检索"
              style={{ width: 690 }}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleSearch}
              onChange={this.handleChange}
              notFoundContent={null}
            >
              {options}
            </Select>

            <div>
              <DashBtn
                height="30"
                style={{ marginLeft: "16px", width: "93px", cursor: "pointer" }}
                onClick={this.addPerson}
              >
                <PlusOutlined /> 新增患者
              </DashBtn>
            </div>
          </BaseFormItem>

          {isWord ? (
            <Row type="flex" align="middle" justify="center">
              <span style={{ color: "red", fontSize: "13px" }}>
                数据库中暂无该数据
              </span>
            </Row>
          ) : null}
        </BaseModal>

        {/*新增患者  */}
        <AddPatient
          visible={isInfo}
          onCancel={this.cancel}
          onOk={this.submit}
          patientData={patientData}
        />
      </div>
    )
  }
}
export default withRouter(Header)
