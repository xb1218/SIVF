//套餐
import React, { Component } from "react"
import { Radio, message, Input, Select, Button, AutoComplete } from "antd"
import { observer, inject } from "mobx-react"
import { CONST_ONE } from "@/app/utils/const"
import moment from "moment"
import { NormalModal } from "@/app/components/base/baseModal"
import { BaseTable } from "@/app/components/base/baseTable"
import { medicalColums, checkColums } from "./defaultData"
import { maxDate, getEtDate, isSameHave } from "./medicalTool"
import apis from "@/app/utils/apis"

import "./index.scss"

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor() {
    super()
    this.state = {
      colums: [], //右边表头
      value: "medical0",
      packageName: null, //套餐名称
      addVisible: false, //添加组套弹框的显示与隐藏
      showTitle: false, //显示画面的title是否显示
      checkTitle: 0, //选中的title为今日
      type: 0, //0代表用药，1代表检查
      roleType: 0, //0普通用户，1管理员
      clinicTag: 1, //0代表门诊，1代表进周期
      useScopeTag: 0, //0=个人;1=全院
      dataSourceMedical: [
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
      ], //新建套餐用药数据
      dataSourceInspect: [
        {
          key: 0,
          inspectionItem: null,
          entrustment: null,
        },
      ], //新建套餐检查数据
      copyId: null, //复制套餐的id
      selectOptions: [], //下拉框的值
      inspectOption: [],
      cycleStartDate: "", //进周期时间
      eggDates: "", //取卵日期
      operationDate: "", //移植日
      drugeOption: [], //门诊用药下拉框
    }
  }
  // 初始化
  componentDidMount() {
    this.init()
    this.getCycle()
    this.getoptions()
    this.conversionOptions()
  }
  // 下拉框值的获取
  getoptions = () => {
    let { select_one } = this.props.store
    let { configMedicalAdvice } = this.props.moredetail
    configMedicalAdvice(select_one)
  }
  // 获取周期信息
  getCycle = () => {
    let { select_one } = this.props.store
    if (select_one.treatStage === 0 || select_one.treatStage === 1) return
    apis.MedicalAdvice.getCycleMessage(select_one).then((res) => {
      if (res.code === 200) {
        this.setState({
          cycleStartDate: res.data.cycleStartDate,
          eggDates: maxDate(res.data.eggDates),
          operationDate: getEtDate(res.data.operationDate),
        })
      }
    })
  }
  // 初始化套餐
  init = () => {
    let { value } = this.state
    let {
      outPatientMedicationPackages,
      cycleMedicationPackages,
    } = this.props.moredetail
    let { name } = this.props
    let data =
      name === CONST_ONE && cycleMedicationPackages[0]
        ? cycleMedicationPackages[0].medicationInfos
        : outPatientMedicationPackages[0]
        ? outPatientMedicationPackages[0].medicationInfos
        : []
    this.setState({
      colums: medicalColums,
      dataSource: data,
    })
    this.props.moredetail.setMentTyle = value
    this.props.moredetail.dataSetMent = data
  }
  // 切换表头
  changeColumns = (val) => {
    switch (val) {
      case 0:
        this.setState({
          showTitle: false,
          colums: medicalColums,
        })
        break
      case 1:
        this.setState({
          showTitle: true,
          colums: checkColums,
        })
        break
      default:
        break
    }
  }
  // 获得当前数据
  getNowData = (val, uid, data) => {
    this.props.moredetail.setMentTyle = val
    switch (val) {
      case 0:
        data.forEach((item, index) => {
          if (item.packageUid === uid) {
            this.setState({
              dataSource: item.medicationInfos,
            })
            this.props.moredetail.dataSetMent = item.medicationInfos
          }
        })
        break
      case 1:
        if (data[0].cycleCheckPackages) {
          data[0].cycleCheckPackages.forEach((item, index) => {
            if (item.packageUid === uid) {
              this.setState({
                dataSource: item.medicalAdviceCheckConfigs,
              })
              this.props.moredetail.dataSetMent = item.medicalAdviceCheckConfigs
            }
          })
        } else {
          data.forEach((item, index) => {
            if (item.packageUid === uid) {
              this.setState({
                dataSource: item.medicalAdviceCheckConfigs,
              })
              this.props.moredetail.dataSetMent = item.medicalAdviceCheckConfigs
            }
          })
        }
        break
      default:
        break
    }
  }
  // 切换
  change = (e, val, i, data) => {
    this.setState({
      value: e.target.value,
    })
    this.changeColumns(val) //切换表头和显示画面
    this.getNowData(val, i, data)
  }
  // 组套添加的弹框
  addShow = (val) => {
    this.setState({
      addVisible: true,
      type: val,
    })
    // 生成下拉框的值
    this.checkOptions(val)
  }
  // 初始化下拉框的值
  checkOptions = (val) => {
    //val中 0代表用药，1代表检查
    let { name } = this.props
    let {
      cycleCheckPackages,
      cycleMedicationPackages,
      outPatientMedicationPackages,
      outPatientCheckPackages,
    } = this.props.moredetail
    if (name) {
      if (val) {
        this.generateData(cycleCheckPackages)
      } else {
        this.generateData(cycleMedicationPackages)
      }
    } else {
      if (val) {
        this.generateData(outPatientCheckPackages)
      } else {
        this.generateData(outPatientMedicationPackages)
      }
    }
  }
  // 生成下拉框的值
  generateData = (data) => {
    let { selectOptions } = this.state
    selectOptions = []
    data &&
      data.forEach((item, index) => {
        selectOptions.push({
          value: item.packageUid,
          label: item.packageName,
        })
      })
    this.setState({
      selectOptions: [...selectOptions],
    })
  }
  // 确认新建套餐
  handleOkAdd = () => {
    let { type } = this.state
    if (type) {
      this.addInspectSource()
    } else {
      this.addMedicalSource()
    }
  }
  // 复制套餐
  copySetMeal = (id) => {
    let { type, dataSourceMedical, dataSourceInspect } = this.state
    let {
      outPatientMedicationPackages,
      cycleMedicationPackages,
      outPatientCheckPackages,
      cycleCheckPackages,
      name,
    } = this.props.moredetail
    if (name) {
      if (type) {
        dataSourceInspect = this.copyType(
          cycleCheckPackages,
          id,
          "medicalAdviceCheckConfigs"
        )
      } else {
        dataSourceMedical = this.copyType(
          cycleMedicationPackages,
          id,
          "medicationInfos"
        )
      }
    } else {
      if (type) {
        dataSourceInspect = this.copyType(
          outPatientCheckPackages,
          id,
          "medicalAdviceCheckConfigs"
        )
      } else {
        dataSourceMedical = this.copyType(
          outPatientMedicationPackages,
          id,
          "medicationInfos"
        )
      }
    }
    this.setState({
      dataSourceInspect: [...dataSourceInspect],
      dataSourceMedical: [...dataSourceMedical],
    })
  }
  // 根据不同的类型复制套餐
  copyType = (data, id, parm) => {
    let datas = []
    data &&
      data.forEach((item, index) => {
        if (item.packageUid === id) {
          datas = item[parm]
        }
      })
    return datas
  }
  // 添加套餐后台接口，用药
  addMedicalSource = () => {
    let { select_one } = this.props.store
    let { configMedicalAdvice } = this.props.moredetail
    let { name } = this.props
    let { packageName, useScopeTag, dataSourceMedical, roleType } = this.state
    let data = {
      roleType,
      packageName,
      clinicTag: name,
      useScopeTag,
      medicationVOList: dataSourceMedical,
    }
    if (packageName) {
      apis.AdminSet.addAdvice(data).then((res) => {
        if (res.code === 200) {
          this.setState({
            addVisible: false,
          })
          message.success("新建成功")
          if (configMedicalAdvice(select_one)) {
            this.init()
          } //初始化用药配置
        } else {
          message.error(res.message)
        }
      })
    } else {
      message.warning("请填写套餐名称")
    }
  }
  // 新建后台接口，检查
  addInspectSource = () => {
    let { select_one } = this.props.store
    let { configMedicalAdvice } = this.props.moredetail
    let { name } = this.props
    let { packageName, useScopeTag, dataSourceInspect, roleType } = this.state
    let data = {
      roleType,
      packageName,
      clinicTag: name,
      useScopeTag,
      checkVOList: dataSourceInspect,
    }
    // isSameHave(arry)为true则代表数据相同，没有重复值
    if (isSameHave(this.isHaveItem()) && packageName) {
      apis.AdminSet.addInspect(data).then((res) => {
        if (res.code === 200) {
          this.setState({
            addVisible: false,
          })
          message.success("新建成功")
          if (configMedicalAdvice(select_one)) {
            this.init()
            this.getoptions()
          } //初始化用药配置
        } else {
          message.error(res.message)
        }
      })
    } else {
      message.error(
        "添加了相同的检查项目或没有填写套餐名或没有添加检查项目，请修改"
      )
    }
  }
  // 获取所有的检查项目
  isHaveItem = () => {
    let { dataSourceInspect } = this.state
    let arry = []
    dataSourceInspect.forEach((item, index) => {
      arry.push(item.inspectionItem)
    })
    return arry
  }
  // 改变数据值
  changeInput = (val, record, parm) => {
    let { dataSourceMedical, dataSourceInspect } = this.state
    record[parm] = val
    this.setState({
      dataSourceMedical: [...dataSourceMedical],
      dataSourceInspect: [...dataSourceInspect],
    })
  }
  // 查找该药中对应的规格
  selectSpecification = (record) => {
    let { dataSourceMedical } = this.state
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
      dataSourceMedical: dataSourceMedical,
    })
  }
  // 选择项目名
  changeInspect = (val, record, index) => {
    let { dataSourceInspect } = this.state
    record.inspectionItem = val ? val.split(",")[0] : ""
    this.autoDisplayInspect(record)
    this.setState({
      dataSourceInspect: [...dataSourceInspect],
    })
  }
  // 自动显示(项目)
  autoDisplayInspect = (record) => {
    let { dataSourceInspect } = this.state
    let { medicalAdviceCheckConfig } = this.props.moredetail
    medicalAdviceCheckConfig.forEach((item, index) => {
      if (record.inspectionItem === item.inspectionItem) {
        record.uid = item.uid
        record.itemId = item.id
        record.entrustment = item.entrustment
        record.inspectionItem = item.inspectionItem
      }
    })
    this.setState({
      dataSourceInspect: [...dataSourceInspect],
    })
  }
  // 根据药的类型改变下拉框的值
  showSelect = (type) => {
    let { dataSourceMedical } = this.state
    let { selectDrugArry } = this.props.moredetail
    dataSourceMedical.forEach((item, i) => {
      selectDrugArry.forEach((items, indexs) => {
        if (items.type === type) {
          item.drugeOption = items.list
        }
      })
    })
    this.setState({
      dataSourceMedical: [...dataSourceMedical],
    })
  }
  // 选择药的类型
  handleDrugType = (val, record, parm, index) => {
    let { dataSourceMedical } = this.state
    record[parm] = val
    this.showSelect(val)
    this.setState({
      dataSource: [...dataSourceMedical],
    })
  }
  // 获取药名下拉选框焦点
  focusDrug = (record) => {
    this.showSelect(record.drugType)
  }
  // 选择药名
  changeDrug = (val, record, index) => {
    let { medicationConfig } = this.props.moredetail
    let { name } = this.props
    let { dataSourceMedical } = this.state
    record.id = val
    this.autoDisplay(record) //自动显示
    if (name) {
      this.showSelect(record.drugType) // 根据药的类型改变下拉框的值
    } else {
      record.drugType = 0
    }
    this.setState({
      dataSourceMedical: [...dataSourceMedical],
    })
    medicationConfig.forEach((item, index) => {
      if (item.needSolventTag === 1 && item.id === record.id) {
        this.addNewLine(dataSourceMedical, "isSolventTag")
      }
    })
  }
  // 自动显示(用药)
  autoDisplay = (record) => {
    let { medicationConfig } = this.props.moredetail
    let { dataSourceMedical } = this.state
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
    this.setState({
      dataSourceMedical: [...dataSourceMedical],
    })
  }
  // 添加新的一行
  addNewLine = (data, mark) => {
    let { type, dataSourceMedical, dataSourceInspect } = this.state
    if (type) {
      data.push({
        key: data.length,
        inspectionItem: null,
        entrustment: null,
      })
    } else {
      data.push({
        key: data.length,
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
    }
    // 添加删除按钮，若为最后一行，则添加新的一行

    this.setState({
      dataSourceMedical: [...dataSourceMedical],
      dataSourceInspect: [...dataSourceInspect],
    })
  }
  // 删除一行
  deleteLine = (data, index) => {
    let { dataSourceMedical, dataSourceInspect } = this.state
    data.splice(index, 1)
    this.setState({
      dataSourceMedical: [...dataSourceMedical],
      dataSourceInspect: [...dataSourceInspect],
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
  // 下拉框转换
  conversionOptionsInspect = () => {
    let { medicalAdviceCheckConfig } = this.props.moredetail
    let { inspectOption } = this.state
    inspectOption = []
    medicalAdviceCheckConfig.forEach((item, index) => {
      if (item.inspectionItem) {
        inspectOption.push({
          value: !item.entrustment
            ? item.inspectionItem
            : item.inspectionItem + "," + item.entrustment,
          label: !item.entrustment
            ? item.inspectionItem
            : item.inspectionItem + "," + item.entrustment,
        })
      }
    })
    this.setState({
      inspectOption: [...inspectOption],
    })
  }
  // 获取项目的焦点
  focusInspect = () => {
    this.conversionOptionsInspect()
  }
  // 在检查中选中作为哪个为有效期确定日
  focusTitle = (val) => {
    this.setState({
      checkTitle: val,
    })
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
  render() {
    let {
      renderOptions,
      ontoptInfoList,
      outPatientMedicationPackages,
      cycleMedicationPackages,
      outPatientCheckPackages,
      cycleCheckPackages,
    } = this.props.moredetail
    let { name } = this.props
    let medicationPackages =
      name === CONST_ONE
        ? cycleMedicationPackages
        : outPatientMedicationPackages
    let checkPackages =
      name === CONST_ONE ? cycleCheckPackages : outPatientCheckPackages
    let {
      value,
      colums,
      dataSource,
      addVisible,
      packageName,
      copyId,
      type,
      dataSourceMedical,
      dataSourceInspect,
      selectOptions,
      inspectOption,
      showTitle,
      checkTitle,
      cycleStartDate, //进周期时间
      eggDates, //取卵日期
      operationDate, //移植日
      drugeOption,
    } = this.state
    let columnCycle = [
      {
        title: "",
        dataIndex: "drugType",
        key: "drugType",
        width: 20,
        render: (text, record, index) => {
          return (
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
              <AutoComplete
                dropdownMatchSelectWidth={340}
                allowClear
                options={
                  record.isSolventTagMark && record.isSolventTagMark === 1
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
                onChange={(val) => this.changeInput(val, record, "tag")}
              />
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
            <Input
              style={{ width: "100%" }}
              value={record.amount}
              onChange={(e) => {
                this.changeInput(e.target.value, record, "amount")
              }}
            />
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
            <Input
              style={{ width: "100%" }}
              value={record.dose}
              onChange={(e) => {
                this.changeInput(e.target.value, record, "dose")
              }}
            />
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
            <Select
              dropdownMatchSelectWidth={100}
              value={record.frequency}
              style={{ width: "100%" }}
              onChange={(val) => this.changeInput(val, record, "frequency")}
            >
              {renderOptions(ontoptInfoList, "204")}
            </Select>
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
            <Input
              style={{ width: "100%" }}
              value={record.days}
              onChange={(e) => {
                this.changeInput(e.target.value, record, "days")
                this.returnDay(record)
              }}
            />
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
            <Select
              dropdownMatchSelectWidth={100}
              value={record.usage}
              style={{ width: "100%" }}
              onChange={(val) => this.changeInput(val, record, "usage")}
            >
              {renderOptions(ontoptInfoList, "205")}
            </Select>
          )
        },
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
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
                <svg
                  className="icon_svg"
                  aria-hidden="true"
                  onClick={() => this.addNewLine(dataSourceMedical)}
                >
                  <use xlinkHref="#iconjiahao1"></use>
                </svg>
              ) : (
                <svg
                  className="icon_svg"
                  aria-hidden="true"
                  onClick={() => this.deleteLine(dataSourceMedical, index)}
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
            <Input
              style={{ width: "98%" }}
              value={record.dose}
              onChange={(e) => {
                this.changeInput(e.target.value, record, "dose")
              }}
            />
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
            <Select
              dropdownMatchSelectWidth={100}
              value={record.frequency}
              style={{ width: "98%" }}
              onChange={(val) => this.changeInput(val, record, "frequency")}
            >
              {renderOptions(ontoptInfoList, "204")}
            </Select>
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
            <Input
              style={{ width: "98%" }}
              value={record.days}
              onChange={(e) => {
                this.changeInput(e.target.value, record, "days")
                this.returnDay(record)
              }}
            />
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
            <Select
              dropdownMatchSelectWidth={100}
              value={record.usage}
              style={{ width: "98%" }}
              onChange={(val) => this.changeInput(val, record, "usage")}
            >
              {renderOptions(ontoptInfoList, "205")}
            </Select>
          )
        },
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
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
                <svg
                  className="icon_svg"
                  aria-hidden="true"
                  onClick={() => this.addNewLine(dataSourceMedical)}
                >
                  <use xlinkHref="#iconjiahao1"></use>
                </svg>
              ) : (
                <svg
                  className="icon_svg"
                  aria-hidden="true"
                  onClick={() => this.deleteLine(dataSourceMedical, index)}
                >
                  <use xlinkHref="#iconjianhao"></use>
                </svg>
              )}
            </Button>
          )
        },
      },
    ]
    let columnsInspect = [
      {
        title: "检查项目",
        dataIndex: "inspectionItem",
        key: "inspectionItem",
        width: 150,
        verticalAlign: "left",
        render: (text, record, index) => {
          return (
            <AutoComplete
              dropdownMatchSelectWidth={350}
              allowClear
              options={inspectOption}
              value={record.inspectionItem}
              style={{ width: "90%" }}
              onChange={(val) => this.changeInspect(val, record, index)}
              onFocus={() => this.focusInspect(record)}
            />
          )
        },
      },
      {
        title: "嘱托",
        dataIndex: "entrustment",
        key: "entrustment",
        width: 200,
        render: (text, record) => {
          return (
            <Input
              value={record.entrustment}
              onChange={(e) => {
                this.changeInput(e.target.value, record, "entrustment")
              }}
            />
          )
        },
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
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
                <svg
                  className="icon_svg"
                  aria-hidden="true"
                  onClick={() => this.addNewLine(dataSourceInspect)}
                >
                  <use xlinkHref="#iconjiahao1"></use>
                </svg>
              ) : (
                <svg
                  className="icon_svg"
                  aria-hidden="true"
                  onClick={() => this.deleteLine(dataSourceInspect, index)}
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
      <div id="setModalDiv">
        <div className="modalLeft">
          <div className="modalDiv">
            <div className="drugDiv">
              用药
              <svg
                aria-hidden="true"
                className="setMealIcon"
                onClick={() => this.addShow(0)}
              >
                <use xlinkHref="#iconjiahao"></use>
              </svg>
            </div>
            <div>
              <Radio.Group onChange={this.onChange} value={value}>
                {medicationPackages.map((item, index) => (
                  <Radio
                    className="itemTerm"
                    value={"medical" + index}
                    onClick={(e) =>
                      this.change(e, 0, item.packageUid, medicationPackages)
                    }
                    key={index}
                  >
                    {item.packageName}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
            <div className="drugDiv">
              检查
              <svg
                aria-hidden="true"
                className="setMealIcon"
                onClick={() => this.addShow(1)}
              >
                <use xlinkHref="#iconjiahao"></use>
              </svg>
            </div>
            <div>
              <Radio.Group onChange={this.onChange} value={value}>
                {checkPackages &&
                  name === CONST_ONE &&
                  checkPackages[0] &&
                  checkPackages[0].cycleCheckPackages &&
                  checkPackages[0].cycleCheckPackages.map((item, index) => (
                    <Radio
                      className="itemTerm"
                      value={"inspect" + index}
                      onClick={(e) =>
                        this.change(e, 1, item.packageUid, checkPackages)
                      }
                      key={index}
                    >
                      {item.packageName}
                    </Radio>
                  ))}
                {name !== CONST_ONE &&
                  checkPackages &&
                  checkPackages.map((item, index) => (
                    <Radio
                      className="itemTerm"
                      value={"inspect" + index}
                      onClick={(e) =>
                        this.change(e, 1, item.packageUid, checkPackages)
                      }
                      key={index}
                    >
                      {item.packageName}
                    </Radio>
                  ))}
              </Radio.Group>
            </div>
          </div>
        </div>
        <div className="modalRgiht">
          {showTitle && (
            <div className="modalRightTitle">
              <div
                className={checkTitle === 0 ? "cursorPoint" : ""}
                onClick={() => this.focusTitle(0)}
              >
                今日 {moment(new Date()).format("YYYY-MM-DD")}
              </div>
              <div
                className={checkTitle === 1 ? "cursorPoint" : ""}
                onClick={() => this.focusTitle(1)}
              >
                {cycleStartDate && "进周期" + cycleStartDate}
              </div>
              <div
                className={checkTitle === 2 ? "cursorPoint" : ""}
                onClick={() => this.focusTitle(2)}
              >
                {eggDates && "取卵日" + eggDates}
              </div>
              <div
                className={checkTitle === 3 ? "cursorPoint" : ""}
                onClick={() => this.focusTitle(3)}
              >
                {operationDate && "移植日" + operationDate}
              </div>
            </div>
          )}
          <BaseTable
            columns={colums}
            dataSource={dataSource}
            pagination={false}
          />
        </div>
        <NormalModal
          visible={addVisible}
          centered
          closable={false}
          title="新建套餐"
          onOk={this.handleOkAdd}
          width="700px"
          height="350px"
          destroyOnClose
          onCancel={() => {
            this.setState({
              addVisible: false,
            })
          }}
        >
          <div className="addMeal">
            <div className="addMealTitle">
              <div className="titleDiv">
                <span className="paddingSpan">
                  <b style={{ color: "#FF0000" }}>*</b>
                  套餐名称:
                </span>
                <Input
                  style={{ width: "150px" }}
                  value={packageName}
                  onChange={(e) => {
                    this.setState({
                      packageName: e.target.value,
                    })
                  }}
                />
              </div>
              <div className="titleDiv">
                <span className="paddingSpan">复制套餐:</span>
                <Select
                  allowClear={false}
                  style={{ width: "150px" }}
                  options={selectOptions}
                  value={copyId}
                  onChange={(val) => {
                    this.setState({
                      copyId: val,
                    })
                    this.copySetMeal(val)
                  }}
                />
              </div>
            </div>
            <BaseTable
              columns={
                name && !type
                  ? columnCycle
                  : !name && !type
                  ? columnOut
                  : columnsInspect
              }
              dataSource={type ? dataSourceInspect : dataSourceMedical}
              pagination={false}
              style={{ height: "200px", overflow: "scroll" }}
            />
          </div>
        </NormalModal>
      </div>
    )
  }
}
