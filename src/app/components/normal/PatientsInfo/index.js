import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { observable } from "mobx"
import { Select, Button, Input, DatePicker, message, Empty, Spin } from "antd"
import { LoadingDiv } from "@/app/components/base/baseDiv"
import {
  PlusOutlined,
  MinusOutlined,
  SearchOutlined,
  CheckOutlined,
} from "@ant-design/icons"
import { DashBtn } from "@/app/components/base/baseBtn"
import { DateTitleView } from "@/app/components/normal/Title"
import { FourItem } from "@/app/components/base/baseForms"
import { AddPatient } from "@/app/components/normal/AddPatient"
import { BaseModal } from "@/app/components/base/baseModal"
import { TitleP } from "@/app/components/base/baseP"
import { BaseInput } from "@/app/components/base/formStyles"
import { TableNomargin } from "@/app/components/base/baseTable"
import { checkArrisEmpty, renderOptions } from "@/app/utils/tool.js"
import { dateFormatDate } from "@/app/utils/const.js"
import { isMobile } from "@/app/utils/reg.js"
import styled from "styled-components"
import apis from "@/app/utils/apis"
import moment from "moment"

const BorderDashed = styled.div`
  border-top: 1px dashed #b8b8b8;
  width: 935px;
  margin: 10px 26px;
`
const SpanButton = styled.span`
  display: inline-block;
  width: 80px;
  height: 40px;
  background-color: #ffebdc;
  color: #f59a23;
  text-align: center;
  line-height: 40px;
  border-radius: 50px 0 0 50px;
  cursor: pointer;
`
const SpanTitle = styled.span`
  margin: 0 5px;
`
const { Option } = Select

export default
@inject("moredetail", "store")
@observer
class Index extends Component {
  @observable initFlag = false //请求数据成功否
  @observable isSpouse = false //配偶切换
  @observable patient1 = null
  @observable patient2 = null
  @observable info = {
    documentsInfos: [{}],
    positiveSignList: [],
    enterGroupList: [],
  }
  @observable ontoptInfoList = []
  @observable patientPid = null //当前患者的pid,新建时需要传
  constructor(props) {
    super(props)
    this.state = {
      addSpouseVisble: false, //是否关联配偶
      isSearch: false, //是否搜索
      isEmpty: false, //搜索后是否为空
      isAddSpouse: false, //是否要新增配偶
      isBatch: false, //是否要绑定,弹窗关闭
      searchWord: "", //搜索关键字
      patientsList: [], //搜索后列表
      spouse: { documentsInfos: [{}] }, //被选中的配偶
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    if (this.props.name === "frozen" || this.props.name === "follow") {
      let { femalePerson, malePerson } = this.props
      let patientParam = {
        patientPid: femalePerson.femalePid,
        patientSex: 1,
      }
      let patientParam2 = {
        patientPid: malePerson.malePid,
        patientSex: 0,
      }
      this.getInfos(patientParam, patientParam2)
    } else if (this.props.name === "workbench") {
      //工作台的基本信息
      this.getWorkbench(this.props.record)
    } else if (this.props.name === "basic") {
      this.getPersonInfo(this.props.sex)
    } else {
      this.getInfos()
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.getInfos()
    if (nextProps.record !== this.props.record) {
      this.getWorkbench(nextProps.record)
    }
  }
  //工作台的数据请求
  getWorkbench = (record) => {
    let patientParam = {
      patientPid: record.pid,
      patientSex: record.sex,
    }
    let patientParam2 = {
      patientPid: record.spousePid,
      patientSex: record.sex === 0 ? 1 : 0,
    }
    this.getInfos(patientParam, patientParam2)
  }
  //获取男女基本信息
  getInfos = (obj1, obj2) => {
    let { select_one, select_female, select_male } = this.props.store
    let params
    if (obj1) {
      if (obj1.patientPid === null) {
        params = obj2
        this.patientPid = obj2.patientPid
      } else if (obj2.patientPid === null) {
        params = obj1
        this.patientPid = obj1.patientPid
      } else {
        params = this.isSpouse ? obj2 : obj1
        this.patientPid = params.patientPid
      }
      this.patient1 = obj1
      this.patient2 = obj2
    } else {
      let patient = this.isSpouse
        ? select_one.patientSex
          ? select_male
          : select_female
        : select_one
      params = {
        patientPid: patient.patientPid,
        patientSex: patient.patientSex,
      }
      this.patientPid = params.patientPid
    }
    this.initInfo(params)
  }
  //获取一个人的基本信息
  getPersonInfo = (sex) => {
    let femalePatient = JSON.parse(localStorage.getItem("femalePatient"))
    let malePatient = JSON.parse(localStorage.getItem("malePatient"))
    if (sex) {
      this.initInfo(femalePatient)
    } else {
      this.initInfo(malePatient)
    }
  }
  initInfo = (params) => {
    apis.Patients_info.getInfo(params).then((res) => {
      res.data.baseInfoDTO.nation = res.data.baseInfoDTO.nation
        ? res.data.baseInfoDTO.nation
        : "汉族"
      this.info = res.data.baseInfoDTO
      this.ontoptInfoList = res.data.ontoptInfoList
      this.initFlag = true
    })
  }
  //关闭弹窗时和切换配偶时，保存用户信息
  saveInfo = (flag) => {
    let { saveInfo } = this.props.moredetail
    let params = {
      patientParam: {
        patientPid: this.info.pid,
        patientSex: this.info.sex,
      },
      baseInfoDTO: this.info,
    }
    if (this.info.phone) {
      if (!isMobile(this.info.phone)) {
        message.destroy()
        message.error("配偶电话格式错误")
        return
      }
    }
    if (this.info.spousePhone) {
      if (!isMobile(this.info.spousePhone)) {
        message.destroy()
        message.error("配偶电话格式错误")
        return
      }
    }
    //选中的人配偶保存
    saveInfo(params).then((res) => {
      if (flag) {
        this.props.close()
        this.isSpouse = false
        this.setState({
          addSpouseVisble: false,
        })
      } else {
        this.isSpouse = !this.isSpouse
        this.initFlag = false
        if (this.patient1 !== null) {
          this.getInfos(this.patient1, this.patient2)
        } else {
          this.getInfos()
        }
      }
    })
  }
  //数据变化
  setInheritVal = (val, param) => {
    this.info = { ...this.info, [param]: val }
  }
  //证件处理
  setDocumentsInfos = (val, param, num) => {
    this.info.documentsInfos.forEach((item, index) => {
      if (num === index) {
        switch (param) {
          case "documentsExpirationDate":
            return (item.documentsExpirationDate = val)
          case "documentsName":
            return (item.documentsName = val)
          default:
            return (item.documentsNum = val)
        }
      }
    })
  }
  //证件新增
  addcertificate = () => {
    let { documentsInfos } = this.info
    if (documentsInfos.length < 3) {
      documentsInfos.push({
        documentsName: "",
        documentsNum: "",
        documentsExpirationDate: "",
        isAdd: true,
      })
    } else {
      message.destroy()
      message.error("不可再添加证件")
    }
  }
  //证件删除
  deletecertificate = (index) => {
    let { documentsInfos } = this.info
    documentsInfos.splice(index, 1)
  }
  //搜索配偶
  searchSpouses = () => {
    let { searchWord } = this.state
    apis.Patients_info.searchSpouse({
      param: searchWord,
      sex: this.info.sex,
    }).then((res) => {
      if (!checkArrisEmpty(res.data)) {
        this.setState({
          isSearch: true,
          isEmpty: true,
          patientsList: res.data,
        })
      } else {
        this.setState({
          isSearch: true,
          isEmpty: false,
        })
      }
    })
  }
  //关联配偶
  batchSpouse = () => {
    let { spouse } = this.state
    let { select_one } = this.props.store
    let param
    if (this.patient1 === null) {
      param = {
        patientPid: select_one.patientPid,
        spousePid: spouse.pid,
      }
    } else {
      let patient =
        this.patient1.patientPid === null ? this.patient2 : this.patient1
      param = {
        patientPid: patient.patientPid,
        spousePid: spouse.pid,
      }
    }
    apis.Patients_info.batchSpouse(param).then((res) => {
      message.success("关联成功")
      this.props.store.setSpousePid(1)
      this.setVisble()
      this.props.close()
      this.isSpouse = false
    })
    this.updatePatient()
  }
  //关联配偶成功后，新建配偶成功后
  updatePatient = () => {
    this.setVisble()
    if (this.patient1 === null) {
      let obj = {
        workStationType: localStorage.getItem("typeVal"),
        visitRoom: localStorage.getItem("room"),
        place: localStorage.getItem("place"),
      }
      this.props.store.getPatientsList(obj)
    } else {
      this.props.getData()
    }
  }
  //判断字段初始化
  setVisble = () => {
    this.setState({
      addSpouseVisble: false, //是否关联配偶
      isSearch: false, //是否搜索
      isEmpty: false, //搜索后是否为空
      isAddSpouse: false, //是否要新增配偶
      isBatch: false, //是否要绑定,弹窗关闭
      searchWord: "", //搜索关键字
    })
  }
  render() {
    let { info, ontoptInfoList } = this
    let { haveSpousePid } = this.props.store
    const { name } = this.props
    let {
      addSpouseVisble,
      isSearch,
      isEmpty,
      isAddSpouse,
      isBatch,
      searchWord,
      patientsList,
      spouse,
    } = this.state
    let flagSign = !checkArrisEmpty(info.positiveSignList)
    let flagGroup = !checkArrisEmpty(info.enterGroupList)
    const SignList = (props) => {
      return props.list.map((item, index) => {
        return (
          <span style={{ padding: "0 3px", color: "red" }} key={index}>
            {item}
            {index !== props.list.length - 1 ? (
              <span style={{ padding: "0 3px", color: "black" }}>&</span>
            ) : null}
          </span>
        )
      })
    }
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
        title: "关联配偶",
        width: 60,
        align: "center",
        render: (text, record, index) => {
          return (
            <CheckOutlined
              style={{ color: "#59B4F4" }}
              onClick={async () => {
                this.props.close()
                this.isSpouse = false
                await this.setState({
                  isBatch: true,
                  spouse: record,
                })
              }}
            />
          )
        },
      },
    ]
    //配偶按钮的切换
    const SpouseButton = (props) => {
      return (
        <>
          {props.flag ? (
            <Button
              type="primary"
              size="small"
              onClick={() => this.saveInfo(false)}
            >
              配偶
            </Button>
          ) : (
            <Button
              size="small"
              onClick={() => {
                this.setState({ addSpouseVisble: true })
              }}
            >
              配偶
            </Button>
          )}
        </>
      )
    }
    return (
      <>
        {/* 基本信息页，配偶搜索页 */}
        {!addSpouseVisble ? (
          <DateTitleView
            title="基本信息"
            selectOption={
              <div>
                {flagSign || flagGroup ? (
                  <span style={{ margin: "0 10px" }}>
                    （
                    {flagSign ? (
                      <SignList list={info.positiveSignList} />
                    ) : null}
                    {flagGroup ? (
                      <>
                        | <SignList list={info.positiveSignList} />
                      </>
                    ) : null}
                    ）
                  </span>
                ) : (
                  <span style={{ margin: "0 10px" }}></span>
                )}
                {name && name === "basic" ? null : (
                  <>
                    {this.patient1 === null ? (
                      <SpouseButton flag={haveSpousePid} />
                    ) : (
                      <SpouseButton
                        flag={
                          this.patient1.patientPid && this.patient2.patientPid
                        }
                      />
                    )}
                  </>
                )}
                <Button
                  style={{ marginLeft: "20px" }}
                  type="primary"
                  size="small"
                  onClick={() => {
                    this.setState({ addSpouseVisble: true })
                  }}
                >
                  更换配偶
                </Button>
              </div>
            }
            style={{ marginRight: 0 }}
          >
            {this.initFlag ? (
              <>
                {info.documentsInfos.map((item, index) => {
                  return (
                    <FourItem key={index} style={{ marginLeft: 0 }}>
                      {index === 0 ? (
                        <div>
                          <span>姓名:</span>
                          <span style={{ marginRight: 15 }}>
                            <Input
                              value={info.patientName}
                              onChange={(e) =>
                                this.setInheritVal(
                                  e.target.value,
                                  "patientName"
                                )
                              }
                            />
                          </span>
                        </div>
                      ) : (
                        <div></div>
                      )}
                      {!item.isAdd ? (
                        <div style={{ width: "30%" }}>
                          <span>{item.documentsName}:</span>
                          <span
                            className="span_underline"
                            style={{ width: 200 }}
                          >
                            {item.documentsNum}
                          </span>
                        </div>
                      ) : null}

                      {item.isAdd ? (
                        <div style={{ width: "30%" }}>
                          <Select
                            style={{ width: 90 }}
                            onChange={(value) => {
                              this.setDocumentsInfos(
                                value,
                                "documentsName",
                                index
                              )
                            }}
                          >
                            <Option value="护照">护照</Option>
                            <Option value="其他">其他</Option>
                            <Option value="军官证">军官证</Option>
                            <Option value="身份证">身份证</Option>
                          </Select>
                          <Input
                            style={{ width: 180 }}
                            onChange={(e) => {
                              this.setDocumentsInfos(
                                e.target.value,
                                "documentsNum",
                                index
                              )
                            }}
                          />
                        </div>
                      ) : null}

                      {index === 0 ? (
                        <DashBtn style={{ marginLeft: 10 }}>
                          <PlusOutlined onClick={this.addcertificate} />
                        </DashBtn>
                      ) : item.isAdd ? (
                        <DashBtn style={{ marginLeft: 10 }}>
                          <MinusOutlined
                            onClick={() => this.deletecertificate(index)}
                          />
                        </DashBtn>
                      ) : (
                        <span style={{ width: 55 }}></span>
                      )}

                      <div style={{ width: "20%" }}>
                        <span style={{ width: 50 }}>到期日:</span>
                        <span>
                          <DatePicker
                            value={
                              item.documentsExpirationDate
                                ? moment(
                                    item.documentsExpirationDate,
                                    dateFormatDate
                                  )
                                : undefined
                            }
                            onChange={(date, datestring) => {
                              this.setDocumentsInfos(
                                datestring,
                                "documentsExpirationDate",
                                index
                              )
                            }}
                          />
                        </span>
                      </div>

                      {index === 0 ? (
                        <div style={{ width: "20%" }}>
                          <span style={{ width: 50 }}>出生:</span>
                          <span
                            className="span_underline"
                            style={{ width: 120, marginLeft: 10 }}
                          >
                            {info.birthday}
                          </span>
                        </div>
                      ) : null}
                    </FourItem>
                  )
                })}
                <FourItem style={{ marginLeft: 0 }}>
                  <div>
                    <span>民族:</span>
                    <span>
                      <Select
                        value={info.nation}
                        onChange={(value) => {
                          this.setInheritVal(value, "nation")
                        }}
                      >
                        {renderOptions(ontoptInfoList, "39")}
                      </Select>
                    </span>
                  </div>
                  <div style={{ width: "25%" }}>
                    <span>结婚证编号:</span>
                    <span>
                      <Input
                        value={info.marriageCertificateNumber}
                        onChange={(e) =>
                          this.setInheritVal(
                            e.target.value,
                            "marriageCertificateNumber"
                          )
                        }
                        style={{ width: 130 }}
                      />
                    </span>
                  </div>
                  <div style={{ width: "50%" }}>
                    <span>证件地址:</span>
                    <span>
                      <Input
                        value={info.address}
                        onChange={(e) =>
                          this.setInheritVal(e.target.value, "address")
                        }
                        style={{ width: 400 }}
                      />
                    </span>
                  </div>
                </FourItem>
                <BorderDashed />
                <FourItem style={{ marginLeft: 0 }}>
                  <div>
                    <span>病历号:</span>
                    <span>
                      <Input
                        value={info.medicalRecordNum}
                        onChange={(e) =>
                          this.setInheritVal(e.target.value, "medicalRecordNum")
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <span>就诊卡号:</span>
                    <span>
                      <Input
                        value={info.medicalCard}
                        onChange={(e) =>
                          this.setInheritVal(e.target.value, "medicalCard")
                        }
                      />
                    </span>
                  </div>
                  <div style={{ width: "50%" }}>
                    <span style={{ width: 110 }}>曾用名:</span>
                    <span>
                      <Input
                        value={info.usedName}
                        onChange={(e) =>
                          this.setInheritVal(e.target.value, "usedName")
                        }
                      />
                    </span>
                  </div>
                </FourItem>
                <FourItem style={{ marginLeft: 0 }}>
                  <div>
                    <span>电话:</span>
                    <span>
                      <Input
                        value={info.phone}
                        onChange={(e) =>
                          this.setInheritVal(e.target.value, "phone")
                        }
                      />
                    </span>
                  </div>
                  <div>
                    <span>配偶电话:</span>
                    <span>
                      <Input
                        value={info.spousePhone}
                        onChange={(e) =>
                          this.setInheritVal(e.target.value, "spousePhone")
                        }
                      />
                    </span>
                  </div>
                  <div style={{ width: "50%" }}>
                    <span style={{ width: 110 }}>住宅电话:</span>
                    <span>
                      <Input
                        value={info.homePhone}
                        onChange={(e) =>
                          this.setInheritVal(e.target.value, "homePhone")
                        }
                      />
                    </span>
                  </div>
                </FourItem>
                <FourItem style={{ marginLeft: 0 }}>
                  <div>
                    <span>职业:</span>
                    <span>
                      <Select
                        value={info.occupation}
                        onChange={(value) => {
                          this.setInheritVal(value, "occupation")
                        }}
                      >
                        {renderOptions(ontoptInfoList, "11")}
                      </Select>
                    </span>
                  </div>
                  <div>
                    <span>文化程度:</span>
                    <span>
                      <Select
                        value={info.education}
                        onChange={(value) => {
                          this.setInheritVal(value, "education")
                        }}
                      >
                        {renderOptions(ontoptInfoList, "10")}
                      </Select>
                    </span>
                  </div>
                  <div style={{ width: "50%" }}>
                    <span style={{ width: 110 }}>宗教信仰:</span>
                    <span>
                      <Select
                        value={info.religion}
                        onChange={(value) => {
                          this.setInheritVal(value, "religion")
                        }}
                      >
                        {renderOptions(ontoptInfoList, "13")}
                      </Select>
                    </span>
                  </div>
                </FourItem>
                <FourItem style={{ marginLeft: 0 }}>
                  <div>
                    <span>邮政编号:</span>
                    <span>
                      <span>
                        <Input
                          value={info.postalCode}
                          onChange={(e) =>
                            this.setInheritVal(e.target.value, "postalCode")
                          }
                        />
                      </span>
                    </span>
                  </div>
                  <div>
                    <span>家庭关系:</span>
                    <span>
                      <Select
                        value={info.familyRelation}
                        onChange={(value) => {
                          this.setInheritVal(value, "familyRelation")
                        }}
                      >
                        {renderOptions(ontoptInfoList, "14")}
                      </Select>
                    </span>
                  </div>
                  <div style={{ width: "50%" }}>
                    <span style={{ width: 110 }}>家庭年经济收入:</span>
                    <span>
                      <Select
                        value={info.annualHouseholdIncome}
                        onChange={(value) => {
                          this.setInheritVal(value, "annualHouseholdIncome")
                        }}
                      >
                        {renderOptions(ontoptInfoList, "16")}
                      </Select>
                    </span>
                  </div>
                </FourItem>
                <FourItem style={{ marginLeft: 0 }}>
                  <div style={{ width: "50%" }}>
                    <span>最长居住地:</span>
                    <span>
                      <Input
                        value={info.longLiveAddress}
                        onChange={(e) =>
                          this.setInheritVal(e.target.value, "longLiveAddress")
                        }
                        style={{ width: 373 }}
                      />
                    </span>
                  </div>
                  <div style={{ width: "50%" }}>
                    <span style={{ width: 110 }}>现住址:</span>
                    <span>
                      <Input
                        value={info.nowLiveAddress}
                        onChange={(e) =>
                          this.setInheritVal(e.target.value, "nowLiveAddress")
                        }
                        style={{ width: 353 }}
                      />
                    </span>
                  </div>
                </FourItem>
                <FourItem style={{ marginLeft: 0 }}>
                  <div style={{ width: "100%" }}>
                    <span>说明:</span>
                    <span>
                      <Input
                        value={info.explain}
                        onChange={(e) =>
                          this.setInheritVal(e.target.value, "explain")
                        }
                        style={{ width: 860 }}
                      />
                    </span>
                  </div>
                </FourItem>
              </>
            ) : (
              <LoadingDiv>
                <Spin />
              </LoadingDiv>
            )}
          </DateTitleView>
        ) : (
          <DateTitleView
            title="关联配偶"
            subtitle={
              <SpanButton
                onClick={() => {
                  this.setState({
                    addSpouseVisble: false,
                  })
                }}
              >
                基本信息
              </SpanButton>
            }
            style={{ marginRight: 0, textAlign: "left" }}
          >
            <BorderDashed />
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
                })
                this.props.close()
                this.isSpouse = false
              }}
            >
              新增配偶
            </Button>
            {/* 搜索患者 */}
            {isSearch ? (
              isEmpty ? (
                <TableNomargin
                  style={{ marginTop: 20, marginLeft: 20 }}
                  columns={listColumn}
                  dataSource={patientsList}
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
              )
            ) : null}
            {/* 新增患者配偶 */}
            <AddPatient
              visible={isAddSpouse}
              onCancel={() => {
                this.props.close()
                this.isSpouse = false
                this.setState({
                  isAddSpouse: false,
                  addSpouseVisble: false,
                })
              }}
              updatePatient={this.updatePatient}
              spouse={"配偶"}
              patientPid={this.patientPid}
            />
          </DateTitleView>
        )}
        <BaseModal
          title="关联配偶"
          width="400px"
          onCancel={() => {
            this.props.open()
            this.setState({
              isBatch: false,
            })
          }}
          onOk={this.batchSpouse}
          visible={isBatch}
          closable={false}
          center={"center"}
        >
          <TitleP>
            是否确定将
            <div>
              <SpanTitle>{info.patientName}</SpanTitle>
              <SpanTitle>{info.documentsInfos[0].documentsNum}</SpanTitle>
            </div>
            与
            <div>
              <SpanTitle>{spouse.patientName}</SpanTitle>
              <SpanTitle>{spouse.documentsInfos[0].documentsNum}</SpanTitle>
            </div>
            设为配偶
          </TitleP>
        </BaseModal>
      </>
    )
  }
}
