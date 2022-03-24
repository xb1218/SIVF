import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import moment from "moment"
import { BaseDiv } from "@/app/components/base/baseSpan"
import { BaseTable } from "@/app/components/base/baseTable"
import { Select, AutoComplete, Input, Button, message } from "antd"
import apis from "@/app/utils/apis"
import Sider from "../sider"

import "../index.scss"

export default
@inject("moredetail", "store")
@observer
class advice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      creatMark: false, //新建套餐标志
      clinicTag: 1, //0代表门诊，1代表进周期
      drugeOption: [], //非周期用药下拉框
      packageName: null, //套餐名
      editShow: true, //是否是编辑的状态
      useScopeTag: 1, //0个人，1全院
      dataSource: [
        {
          key: 0,
          drugType: 1,
          drugName: "",
          dose: "",
          unit: "",
          frequency: "",
          days: "",
          usage: "",
          eatStatus: "",
          eatDate: moment(new Date()),
          note: "",
          startNode: null,
          specification: "",
          tag: null,
          amount: "",
          remain: "",
          delete: false,
          canDel: 0,
          drugeOption: [],
        },
      ], //表格数据
      dataSourceTemp: [], //表格数据备份
      uid: null, //套餐uid
    }
  }
  componentDidMount() {
    let { medicalAdviceOptions } = this.props.moredetail
    medicalAdviceOptions() //初始化用药配置
  }
  // 转化为下拉框options
  conversionOptions = () => {
    let { drugeOption } = this.state
    let { medicationConfig } = this.props.moredetail
    drugeOption = []
    medicationConfig.forEach((item, index) => {
      if (item.drugType === 0) {
        drugeOption.push({
          value: item.id,
          label:
            item.drugName +
            ", " +
            item.tag +
            ", " +
            item.dose +
            ", " +
            item.frequency +
            ", " +
            item.usage,
          key: item.id,
        })
      }
    })
    this.setState({
      drugeOption: [...drugeOption],
    })
  }
  // 根据药的类型改变下拉框的值
  showSelect = (type, index) => {
    let { dataSource } = this.state
    let { selectDrugArry } = this.props.moredetail
    dataSource.forEach((item, i) => {
      selectDrugArry.forEach((items, indexs) => {
        if (items.type === type) {
          item.drugeOption = items.list
        }
      })
    })
  }
  // 选择药的类型
  handleDrugType = (val, record, parm, index) => {
    let { dataSource } = this.state
    record[parm] = val
    this.showSelect(val)
    this.setState({
      dataSource: [...dataSource],
    })
  }
  // 获取药名下拉选框焦点
  focusDrug = (record) => {
    this.showSelect(record.drugType)
    this.conversionOptions()
  }
  // 切换门诊或者进周期
  switchType = (val) => {
    this.setState({
      clinicTag: val,
    })
  }
  // 改变数据值
  changeInput = (val, record, parm) => {
    let { dataSource } = this.state
    record[parm] = val
    this.setState({
      dataSource: [...dataSource],
    })
  }
  // 查找该药中对应的规格
  selectSpecification = (record) => {
    let { dataSource } = this.state
    let { medicationConfig } = this.props.moredetail
    let obj = []
    medicationConfig.forEach((item, index) => {
      if (
        record.drugName === item.drugName &&
        record.drugType === item.drugType
      ) {
        obj.push({
          value: item.tag,
          label: item.tag,
          key: item.specification,
        })
      }
    })
    record.specificationOption = obj
    this.setState({
      dataSource: [...dataSource],
    })
  }
  // 添加一个套餐
  addMeal = () => {
    let { uid } = this.state
    if (uid) {
      this.updateSource()
    } else {
      this.addSource()
    }
  }
  // 添加套餐后台接口
  addSource = () => {
    let { packageName, clinicTag, useScopeTag, dataSource } = this.state
    let data = {
      roleType: 1,
      packageName,
      clinicTag,
      useScopeTag,
      medicationVOList: dataSource,
    }
    if (data.packageName !== null && data.medicationVOList[0]) {
      apis.AdminSet.addAdvice(data).then((res) => {
        if (res.code === 200) {
          this.setState({
            editShow: false,
          })
          this.Sider && this.Sider.getList(0, res.data)
          message.success("新建成功")
        } else {
          message.error(res.message)
        }
      })
    } else {
      message.warning("请填写完整信息！")
    }
  }
  // 修改套餐后台
  updateSource = () => {
    let { uid, packageName, clinicTag, dataSource, useScopeTag } = this.state
    let data = {
      uid,
      packageName,
      clinicTag,
      useScopeTag,
      medicationVOList: dataSource,
    }
    apis.AdminSet.modifyAdvice(data).then((res) => {
      if (res.code === 200) {
        this.Sider && this.Sider.getList(0, uid)
        this.setState({
          editShow: false,
        })
        message.success(res.data)
      } else {
        message.error(res.message)
      }
    })
  }
  // 选择药名
  changeDrug = (val, record, index) => {
    let { medicationConfig } = this.props.moredetail
    let { dataSource, clinicTag } = this.state
    record.id = val
    this.autoDisplay(record) //自动显示
    if (clinicTag) {
      this.showSelect(record.drugType) // 根据药的类型改变下拉框的值
    } else {
      record.drugType = 0
    }
    this.setState({
      dataSource: [...dataSource],
    })
    medicationConfig.forEach((item, index) => {
      if (item.needSolventTag === 1 && item.id === record.id) {
        this.addNewLine("isSolventTag")
      }
    })
  }
  // 添加新的一行
  addNewLine = (mark) => {
    let { dataSource } = this.state
    // 添加删除按钮，若为最后一行，则添加新的一行
    dataSource.push({
      key: dataSource.length,
      drugType: mark ? 0 : 1,
      drugName: "",
      dose: "",
      unit: "",
      frequency: "",
      days: "",
      usage: "",
      eatDate: moment(new Date()).format("YYYY-MM-DD"),
      eatStatus: "",
      remarks: "",
      startNode: null,
      delete: false,
      isSolventTagMark: mark ? 1 : 0,
    })
    this.setState({
      dataSource: [...dataSource],
    })
  }
  // 删除一行
  deleteLine = (index) => {
    let { dataSource } = this.state
    dataSource.splice(index, 1)
    this.setState({
      dataSource: [...dataSource],
    })
  }
  // 生成用药溶剂的下拉框
  genSolventConfig = () => {
    let { solventConfig } = this.props.moredetail
    let data = []
    solventConfig.forEach((item, index) => {
      data.push({
        label: `${item.drugName},${item.specification},${item.dose},${item.frequency},${item.usage},`,
        value: item.id,
      })
    })
    return data
  }
  // 自动显示(用药)
  autoDisplay = (record) => {
    let { medicationConfig } = this.props.moredetail
    let { dataSource } = this.state
    medicationConfig.forEach((item, index) => {
      if (item.id === record.id) {
        record.id = item.id
        record.drugId = item.id
        record.tag = item.tag
        record.drugName = item.drugName
        record.specification = item.specification
        record.drugType = item.drugType
        record.canSpell = item.canSpell
        record.dose = item.dose
        record.frequency = item.frequency
        record.usage = item.usage
        record.startNode = item.startNode
        record.eatDate = moment(new Date()).format("YYYY-MM-DD")
        record.eatStatus = "当日"
        record.days = 1
        record.amount = 1
        record.needSolventTag = item.needSolventTag
        record.isSolventTag = item.isSolventTag
      }
    })
    this.setState({ dataSource })
  }
  // 判断当前显示什么
  showJudge = (val) => {
    let data = null
    switch (val) {
      case 0:
        data = "非"
        break
      case 1:
        data = "周"
        break
      case 2:
        data = "扳"
        break
      case 3:
        data = "黄"
        break
      default:
        break
    }
    return data
  }
  //源数据和备份数据切换
  changeData = (mark) => {
    let { dataSource, dataSourceTemp } = this.state
    if (mark) {
      this.setState({
        dataSourceTemp: [...dataSource],
      })
    } else {
      this.setState({
        dataSource: [...dataSourceTemp],
        dataSourceTemp: [],
      })
    }
  }
  // 查看模式或编辑模式
  editShow = (val) => {
    this.setState({
      editShow: val,
    })
  }
  // 选中某一个套餐
  checkItem = (uid) => {
    apis.AdminSet.adviceDetails(uid).then((res) => {
      if (res.code === 200) {
        this.setState({
          uid: res.data.uid, //套餐uid
          packageName: res.data.packageName,
          useScopeTag: res.data.useScopeTag,
          dataSource: res.data.medicationVOList,
          clinicTag: res.data.clinicTag,
          editShow: false,
          creatMark: false, //新建套餐标志
        })
      }
    })
  }
  // 点击新建一个套餐
  addIcon = () => {
    this.setState({
      creatMark: true,
      editShow: true,
      packageName: null, //套餐名
      uid: null, //套餐uid
      dataSource: [
        {
          key: 0,
          drugType: 1,
          drugName: "",
          dose: "",
          unit: "",
          frequency: "",
          days: "",
          usage: "",
          eatStatus: "",
          eatDate: moment(new Date()),
          note: "",
          startNode: null,
          specification: "",
          tag: null,
          amount: "",
          remain: "",
          delete: false,
          canDel: 0,
          drugeOption: [],
        },
      ], //表格数据
    })
  }
  render() {
    let {
      drugeOption,
      clinicTag,
      dataSource,
      packageName,
      editShow,
      creatMark,
    } = this.state
    let { renderOptions, ontoptInfoList } = this.props.moredetail
    let columnCycle = [
      {
        title: "",
        dataIndex: "drugType",
        key: "drugType",
        width: 20,
        render: (text, record, index) => {
          return (
            <>
              {editShow ? (
                <Select
                  style={{ width: "100%" }}
                  value={record.drugType}
                  onChange={(val) =>
                    this.handleDrugType(val, record, "drugType", index)
                  }
                >
                  <Select.Option value={0}>非</Select.Option>
                  <Select.Option value={1}>周</Select.Option>
                  <Select.Option value={2}>扳</Select.Option>
                  <Select.Option value={3}>黄</Select.Option>
                </Select>
              ) : (
                <span>{this.showJudge(text)}</span>
              )}
            </>
          )
        },
      },
      {
        title: "药名",
        dataIndex: "drugName",
        key: "drugName",
        width: 100,
        render: (text, record, index) => {
          return (
            <>
              {editShow ? (
                <>
                  <AutoComplete
                    dropdownMatchSelectWidth={340}
                    allowClear
                    options={
                      record.isSolventTagMark === 1
                        ? this.genSolventConfig()
                        : record.drugeOption
                    }
                    value={record.drugName}
                    style={{ width: "49%" }}
                    onChange={(value) => {
                      this.changeDrug(value, record, index)
                    }}
                    onSearch={(val) => this.selectedDrug(val, record)}
                    onFocus={() => this.focusDrug(record)}
                  />
                  <Select
                    dropdownMatchSelectWidth={100}
                    options={record.specificationOption}
                    style={{ width: "49%", marginLeft: "2%" }}
                    value={record.tag}
                    onFocus={() => {
                      this.selectSpecification(record)
                    }}
                    onChange={(val) => this.changeSelect(val, record, "tag")}
                  />
                </>
              ) : (
                <span>
                  {text},{record.tag}
                </span>
              )}
            </>
          )
        },
      },
      {
        title: "数量",
        dataIndex: "amount",
        key: "amount",
        width: 35,
        render: (text, record) => {
          return (
            <>
              {editShow ? (
                <Input
                  style={{ width: "100%" }}
                  value={record.amount}
                  onChange={(e) => {
                    this.changeInput(e.target.value, record, "amount")
                  }}
                />
              ) : (
                <span>{text}</span>
              )}
            </>
          )
        },
      },
      {
        title: "用量",
        dataIndex: "dose",
        key: "dose",
        width: 55,
        render: (text, record) => {
          return (
            <>
              {editShow ? (
                <Input
                  style={{ width: "100%" }}
                  value={record.dose}
                  onChange={(e) => {
                    this.changeInput(e.target.value, record, "dose")
                  }}
                />
              ) : (
                <span>{text}</span>
              )}
            </>
          )
        },
      },
      {
        title: "频次",
        dataIndex: "frequency",
        key: "frequency",
        width: 65,
        render: (text, record) => {
          return (
            <>
              {editShow ? (
                <Select
                  dropdownMatchSelectWidth={100}
                  value={record.frequency}
                  style={{ width: "100%" }}
                  onChange={(val) => this.changeInput(val, record, "frequency")}
                >
                  {renderOptions(ontoptInfoList, "204")}
                </Select>
              ) : (
                <span>{text}</span>
              )}
            </>
          )
        },
      },
      {
        title: "天数",
        dataIndex: "days",
        key: "days",
        width: 35,
        render: (text, record) => {
          return (
            <>
              {editShow ? (
                <Input
                  style={{ width: "100%" }}
                  value={record.days}
                  onChange={(e) => {
                    this.changeInput(e.target.value, record, "days")
                  }}
                />
              ) : (
                <span>{text}</span>
              )}
            </>
          )
        },
      },
      {
        title: "用法",
        dataIndex: "usage",
        key: "usage",
        width: 65,
        render: (text, record) => {
          return (
            <>
              {editShow ? (
                <Select
                  dropdownMatchSelectWidth={100}
                  value={record.usage}
                  style={{ width: "100%" }}
                  onChange={(val) => this.changeInput(val, record, "usage")}
                >
                  {renderOptions(ontoptInfoList, "205")}
                </Select>
              ) : (
                <span>{text}</span>
              )}
            </>
          )
        },
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        className: editShow ? "null" : "disNow",
        width: 25,
        render: (text, record, index) => {
          return (
            <Button
              style={{
                border: "1px dashed #59b4f4",
                background: "#def0fd",
                borderRadius: "2px",
                padding: "2px 4px",
              }}
            >
              {index === 0 ? (
                <div>
                  <svg
                    className="icon_svg"
                    aria-hidden="true"
                    onClick={() => this.addNewLine()}
                  >
                    <use xlinkHref="#iconjiahao1"></use>
                  </svg>
                </div>
              ) : (
                <svg
                  className="icon_svg"
                  aria-hidden="true"
                  onClick={() => this.deleteLine(index)}
                >
                  <use xlinkHref="#iconjianhao"></use>
                </svg>
              )}
            </Button>
          )
        },
      },
    ]
    let columnOut = [
      {
        title: "药名",
        dataIndex: "drugName",
        key: "drugName",
        width: 80,
        render: (text, record, index) => {
          return (
            <>
              {editShow ? (
                <AutoComplete
                  dropdownMatchSelectWidth={300}
                  allowClear
                  options={drugeOption}
                  value={record.drugName}
                  style={{ width: "98%" }}
                  onChange={(value) => {
                    this.changeDrug(value, record, index)
                  }}
                  onSearch={(val) => this.selectedDrug(val, record)}
                  onFocus={() => this.focusDrug(record)}
                />
              ) : (
                <span>{text}</span>
              )}
            </>
          )
        },
      },
      {
        title: "用量",
        dataIndex: "dose",
        key: "dose",
        width: 64,
        render: (text, record) => {
          return (
            <>
              {editShow ? (
                <Input
                  style={{ width: "98%" }}
                  value={record.dose}
                  onChange={(e) => {
                    this.changeInput(e.target.value, record, "dose")
                  }}
                />
              ) : (
                <span>{text}</span>
              )}
            </>
          )
        },
      },
      {
        title: "频次",
        dataIndex: "frequency",
        key: "frequency",
        width: 42,
        render: (text, record) => {
          return (
            <>
              {editShow ? (
                <Select
                  dropdownMatchSelectWidth={100}
                  value={record.frequency}
                  style={{ width: "98%" }}
                  onChange={(val) => this.changeInput(val, record, "frequency")}
                >
                  {renderOptions(ontoptInfoList, "204")}
                </Select>
              ) : (
                <span>{text}</span>
              )}
            </>
          )
        },
      },
      {
        title: "天数",
        dataIndex: "days",
        key: "days",
        width: 28,
        render: (text, record) => {
          return (
            <>
              {editShow ? (
                <Input
                  style={{ width: "98%" }}
                  value={record.days}
                  onChange={(e) => {
                    this.changeInput(e.target.value, record, "days")
                  }}
                />
              ) : (
                <span>{text}</span>
              )}
            </>
          )
        },
      },
      {
        title: "用法",
        dataIndex: "usage",
        key: "usage",
        width: 64,
        render: (text, record) => {
          return (
            <>
              {editShow ? (
                <Select
                  dropdownMatchSelectWidth={100}
                  value={record.usage}
                  style={{ width: "98%" }}
                  onChange={(val) => this.changeInput(val, record, "usage")}
                >
                  {renderOptions(ontoptInfoList, "205")}
                </Select>
              ) : (
                <span>{text}</span>
              )}
            </>
          )
        },
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        className: editShow ? "null" : "disNow",
        width: 25,
        render: (text, record, index) => {
          return (
            <Button
              style={{
                border: "1px dashed #59b4f4",
                background: "#def0fd",
                borderRadius: "2px",
                padding: "2px 4px",
              }}
            >
              {index === 0 ? (
                <div>
                  <svg
                    className="icon_svg"
                    aria-hidden="true"
                    onClick={() => this.addNewLine()}
                  >
                    <use xlinkHref="#iconjiahao1"></use>
                  </svg>
                </div>
              ) : (
                <svg
                  className="icon_svg"
                  aria-hidden="true"
                  onClick={() => this.deleteLine(index)}
                >
                  <use xlinkHref="#iconjianhao"></use>
                </svg>
              )}
            </Button>
          )
        },
      },
    ]
    return (
      <div id="adminSet">
        <BaseDiv className="leftset">
          <Sider
            style={{ marginBottom: 0 }}
            type={0}
            checkItem={(uid) => this.checkItem(uid)}
            addIcon={() => this.addIcon()}
            onRef={(ref) => (this.Sider = ref)}
          />
        </BaseDiv>
        <BaseDiv className="rightShow">
          <div id="rightMealTitle">
            <div className="mealTitle">
              <span>
                <Input
                  value={packageName}
                  placeholder="请输入套餐名"
                  bordered={false}
                  className="inputMeal"
                  onChange={(e) => {
                    this.setState({
                      packageName: e.target.value,
                    })
                  }}
                />
              </span>
              {editShow ? (
                <>
                  <span
                    className={
                      clinicTag
                        ? "mealTitleSpan"
                        : "mealTitleSpan mealTitleSpanCheck"
                    }
                    onClick={() => this.switchType(0)}
                  >
                    门诊
                  </span>
                  |
                  <span
                    className={
                      clinicTag
                        ? "mealTitleSpan mealTitleSpanCheck"
                        : "mealTitleSpan "
                    }
                    onClick={() => this.switchType(1)}
                  >
                    周期
                  </span>
                </>
              ) : (
                <span className="mealTitleSpanCheck">
                  {clinicTag ? "周期" : "门诊"}
                </span>
              )}
            </div>
            <div>
              {editShow ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="icon_s cursorIcon"
                    style={{ marginRight: "35px" }}
                    onClick={() => {
                      this.editShow(false)
                      this.changeData(false)
                      if (creatMark) {
                        this.checkItem(this.props.store.adminAdviceUid)
                      }
                    }}
                  >
                    <use xlinkHref="#iconcancel"></use>
                  </svg>
                  <svg
                    aria-hidden="true"
                    className="icon_s cursorIcon"
                    onClick={() => {
                      this.addMeal(false)
                    }}
                  >
                    <use xlinkHref="#iconconfirm"></use>
                  </svg>
                </>
              ) : null}
            </div>
          </div>
          <BaseTable
            columns={clinicTag ? columnCycle : columnOut}
            dataSource={dataSource}
            pagination={false}
          />
          <div className="bottomTable">
            {editShow ? null : (
              <svg
                aria-hidden="true"
                className="icon_m cursorIcon"
                onClick={() => {
                  this.editShow(true)
                  this.changeData(true)
                }}
              >
                <use xlinkHref="#iconeditor"></use>
              </svg>
            )}
          </div>
        </BaseDiv>
      </div>
    )
  }
}
