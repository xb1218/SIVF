import React from "react"
import { Select, Input, Radio, message } from "antd"
import { ThreeItem } from "@/app/components/base/baseForms.js"
import { NormalModal } from "@/app/components/base/baseModal.js"
import apis from "@/app/utils/apis"
import {
  isMobile,
  idNumber,
  checkPassport,
  checkOfficers,
} from "@/app/utils/reg"
import Store from "@/app/stores/appointment"
import "./index.scss"

const { Option } = Select

export class AddPatient extends React.Component {
  constructor(props) {
    super()
    this.store = Store.fromJS()
    this.state = {
      patientName: "",
      documentsType: "身份证",
      documents: "", //证件号
      sex: props.sex === undefined ? 1 : props.sex,
      phone: "",
      medicalCard: "",
      workStationType: props.type || null, //工作台类型
    }
  }
  //患者信息取值
  setAddObj = async (param, value) => {
    let { documentsType } = this.state
    this.setState({
      [param]: value,
    })
    //根据身份证号自动选男女
    if (documentsType === "身份证") {
      if (value.length === 18 || value.length === 15) {
        await this.setState({
          sex: this.getSex(value),
        })
      }
    }
  }

  //根据身份证号码获取 性别
  getSex = (idCard) => {
    //奇数为男，偶数为女
    // let sexMap = { 0: 1, 1: 0 }
    if (idCard.length === 15) {
      return idCard.substring(14, 15) % 2 ? 0 : 1
    } else if (idCard.length === 18) {
      return idCard.substring(14, 17) % 2 ? 0 : 1
    } else {
      // 不是15或者18,null
      return null
    }
  }
  //新建患者保存
  submit = () => {
    const {
      patientName,
      documentsType,
      documents,
      sex,
      phone,
      medicalCard,
      workStationType, //工作台类型
    } = this.state
    //填入项校验
    if (!patientName) {
      message.destroy()
      message.error("姓名不能为空")
      return
    }
    if (!documentsType) {
      message.destroy()
      message.error("请选择证件类型")
      return
    }
    if (documentsType === "身份证" && !idNumber(documents)) {
      message.destroy()
      message.error("证件号有误")
      return
    }
    if (documentsType === "护照" && !checkPassport(documents)) {
      message.destroy()
      message.error("证件号有误")
      return
    }
    if (documentsType === "军官证" && !checkOfficers(documents)) {
      message.destroy()
      message.error("证件号有误")
      return
    }
    if (!documents) {
      message.destroy()
      message.error("请输入证件号")
      return
    }
    if (!isMobile(phone)) {
      message.destroy()
      message.error("手机号有误")
      return
    }
    let obj = {
      pid: this.props.spouse ? this.props.patientPid : null,
      patientName,
      documentsType,
      documents,
      sex,
      phone,
      medicalCard: medicalCard ? medicalCard : null,
    }
    if (workStationType) {
      let param = {
        patientInfo: obj,
        workStationType,
        visitRoom: localStorage.getItem("room"),
        place: localStorage.getItem("place"),
      }
      //患者列表里的新建患者
      apis.Patients_list.addPatients(param).then((res) => {
        if (res.code === 200) {
          this.props.onCancel()
          //更新患者列表
          this.props.initFuc()
          // 清空数据
          this.emptyData()
          message.success("新建成功")
        } else if (res.code === 411) {
          message.destroy()
          message.error(res.message)
        }
      })
    } else if (this.props.spouse) {
      apis.Patients_info.addSpouse(obj).then((res) => {
        if (res.code === 200) {
          message.success("新建并关联配偶成功")
          // 清空数据
          this.emptyData()
          this.props.onCancel()
          this.props.updatePatient()
        } else {
          message.destroy()
          message.error(res.message)
        }
      })
    } else {
      // 预约管理的新建患者
      apis.Patients_search.addPatients(obj).then((res) => {
        if (res.code === 200) {
          message.success("新建成功")
          this.props.onOk(res.data)
        } else if (res.code === 411) {
          message.destroy()
          message.error(res.message)
        }
      })
    }
  }
  // 新建患者之后置空
  emptyData = () => {
    this.setState({
      patientName: "",
      documentsType: "身份证",
      documents: "", //证件号
      sex: 1,
      phone: "",
      medicalCard: "",
    })
    console.log("sss")
  }
  // 关闭弹框
  onCancel = () => {
    this.props.onCancel()
    this.emptyData()
  }
  render() {
    const { visible, width } = this.props
    const {
      sex,
      documentsType,
      patientName,
      documents,
      phone,
      medicalCard,
    } = this.state
    return (
      <NormalModal
        title="新建患者"
        visible={visible}
        width={width || "900px"}
        closable={false}
        onCancel={this.onCancel}
        onOk={() => this.submit()}
      >
        <div className="addpatient">
          <ThreeItem>
            <div style={{ width: "30%" }}>
              <span style={{ width: 100 }}>
                <b style={{ color: "#FF0000", marginRight: 4 }}>*</b>姓名:
              </span>
              <span>
                <Input
                  value={patientName}
                  onChange={(e) => {
                    this.setAddObj("patientName", e.target.value)
                  }}
                  style={{ width: 150 }}
                />
              </span>
            </div>
            <div style={{ width: "45%" }}>
              <span style={{ width: 130 }}>
                <b style={{ color: "#FF0000" }}>*</b>
                <Select
                  style={{ width: 85, textAlign: "left" }}
                  value={documentsType}
                  placeholder="身份证"
                  onChange={(value) => {
                    this.setAddObj("documentsType", value)
                  }}
                >
                  <Option value="身份证">身份证</Option>
                  <Option value="军官证">军官证</Option>
                  <Option value="护照">护照</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </span>
              <span>
                <Input
                  value={documents}
                  onChange={(e) => {
                    this.setAddObj("documents", e.target.value)
                  }}
                  style={{ width: 200 }}
                />
              </span>
            </div>
            <div style={{ width: "25%" }}>
              <span style={{ width: 35 }}>性别:</span>
              <span>
                <Radio.Group
                  value={sex}
                  onChange={(e) => {
                    this.setAddObj("sex", e.target.value)
                  }}
                >
                  <Radio value={0}>男</Radio>
                  <Radio value={1}>女</Radio>
                </Radio.Group>
              </span>
            </div>
          </ThreeItem>
          <ThreeItem>
            <div style={{ width: "30%" }}>
              <span style={{ width: 100 }}>
                <b style={{ color: "#FF0000", marginRight: 4 }}>*</b>手机号:
              </span>
              <span>
                <Input
                  value={phone}
                  onChange={(e) => {
                    this.setAddObj("phone", e.target.value)
                  }}
                  style={{ width: 150 }}
                />
              </span>
            </div>
            <div style={{ width: "45%" }}>
              <span style={{ width: 130 }}>就诊号:</span>
              <span>
                <Input
                  value={medicalCard}
                  onChange={(e) => {
                    this.setAddObj("medicalCard", e.target.value)
                  }}
                  style={{ width: 200 }}
                />
              </span>
            </div>
          </ThreeItem>
        </div>
      </NormalModal>
    )
  }
}
