import React, { Component } from "react"
import { DatePicker, message, Select } from "antd"
import { observer, inject } from "mobx-react"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import { DateTitleView } from "@/app/components/normal/Title"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { Header, Content } from "./baseItemOperate"
import moment from "moment"
import apis from "@/app/utils/apis"
import { todayString, dateFormatDate } from "@/app/utils/const.js"
import { debounce } from "@/app/utils/tool.js"

export default
@inject("moredetail", "store", "inspection")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemTitle: props.itemTitle,
      addCheckSource: props.addCheckSource,
      addCheckId: props.addCheckId,
      operateData: props.operateData,
      versions:
        props.operateData.version !== null ? props.operateData.version : 1,
      inspectionListParams: [], //化验单项目
      otherInspectionProjectDTO: {}, //报告单
      version: "精液常规分析五版", //版本的切换
      degreeType: true, //浓度和精子密度的切换
      insepectOptions: [], //初始化下拉框
      fiveData: [], //五版数据
      fourData: [], //四版数据
      allCheckList: [], //所有化验单列表
    }
  }
  componentDidMount() {
    let { itemTitle, operateData, addCheckSource, addCheckId } = this.state
    let inspectionListParams = operateData.inspectionListParams
      ? operateData.inspectionListParams
      : []
    this.setState({
      inspectionListParams: this.pushIndex(inspectionListParams),
      otherInspectionProjectDTO: operateData.otherInspectionProjectDTO
        ? operateData.otherInspectionProjectDTO
        : {},
      degreeType: operateData.otherInspectionProjectDTO
        ? operateData.otherInspectionProjectDTO.concentration
          ? true
          : false
        : true,
    })
    //添加时，初始化要添加的项目
    if (!operateData.edit) {
      if (addCheckSource === 1) {
        this.getAddCheckData(addCheckId)
      } else {
        this.setProjectsInit(itemTitle)
      }
    }
    //初始化下拉框
    apis.ManCheck.getInsepectionOption().then((res) => {
      this.setState({
        insepectOptions: res.data,
      })
    })
    if (itemTitle === "精液常规分析" && operateData.inspectionListParams) {
      if (operateData.inspectionListParams.length === 3) {
        this.setState({
          fourData: operateData.inspectionListParams,
        })
      }
      if (operateData.inspectionListParams.length === 4) {
        this.setState({
          fiveData: operateData.inspectionListParams,
        })
      }
    }
    this.getAllList()
  }
  //获取化验单列表
  getAllList = () => {
    let tempData = []
    apis.ManCheck.getinspectiontype(this.selectPatient()).then((res) => {
      res.data.forEach((item) => {
        item.inspectionConfigDTOS.forEach((citem) => {
          tempData.push(citem)
        })
      })
      this.setState({
        allCheckList: [...tempData],
      })
    })
  }
  //获取手动新增化验单的化验项目等信息
  getAddCheckData = (val) => {
    apis.ManCheck.getAddCheckData(val).then((res) => {
      res.data.forEach((item) => {
        item.inspectionProjectValue = item.resultOptionType === 0 ? "阴性" : ""
        if (item.range !== "" && item.range !== null) {
          item.section1 = item.range.split("-")[0]
          item.section2 = item.range.split("-")[1]
        } else {
          item.section1 = ""
          item.section2 = ""
        }
        item.indexMark = item.resultOptionType === 0 ? 0 : 2
      })
      this.setState({
        inspectionListParams: [...res.data],
      })
    })
  }
  pushIndex = (data) => {
    let { addCheckSource } = this.state
    if (addCheckSource === 1) {
      if (data && data.length > 0) {
        data.forEach((item) => {
          if (item.range !== "" && item.range !== null) {
            item.section1 = item.range.split("-")[0]
            item.section2 = item.range.split("-")[1]
          } else {
            item.section1 = ""
            item.section2 = ""
          }
          item.indexMark =
            item.inspectionProjectValue === "阴性"
              ? 0
              : item.inspectionProjectValue === "阳性"
              ? 1
              : 2
        })
        return data
      } else {
        return data
      }
    } else {
      data &&
        data.forEach((item) => {
          if (item.range.indexOf("undefined") > -1) {
            item.range = ""
          }
          if (item.range !== "" && item.range !== null) {
            item.section1 = item.range.split("-")[0]
            item.section2 = item.range.split("-")[1]
          } else {
            item.section1 = ""
            item.section2 = ""
          }
        })
      return data
    }
  }
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setState({
      operateData: nextProps.operateData,
      inspectionListParams: this.pushIndex(
        nextProps.operateData.inspectionListParams
      ),
      itemTitle: nextProps.itemTitle,
      addCheckSource: nextProps.addCheckSource,
      addCheckId: nextProps.addCheckId,
    })
  }
  selectPatient = () => {
    let { selectPatient } = this.props.inspection
    let { select_one } = this.props.store
    return selectPatient(select_one, this.props.sex)
  }
  //关闭添加/修改页面
  close = () => {
    this.props.getData()
    this.props.close()
  }
  //录入值的变化
  setInheritVal = async (val, param) => {
    let { operateData } = this.state
    await this.setState({
      operateData: {
        ...operateData,
        [param]:
          val === "本院"
            ? 0
            : val === "外院"
            ? 1
            : val === "第三方检验"
            ? 2
            : val,
      },
    })
  }
  //报告单数据改变
  setReportValue = async (val, param) => {
    let { otherInspectionProjectDTO } = this.state
    await this.setState({
      otherInspectionProjectDTO: { ...otherInspectionProjectDTO, [param]: val },
    })
  }
  //添加时itemTitle的变化
  setItemTitle = (val, param) => {
    let { allCheckList } = this.state
    this.setState({
      itemTitle: val,
    })
    allCheckList.forEach((item) => {
      if (item.inspectionName === val) {
        if (item.source === 1) {
          this.getAddCheckData(item.id)
        } else {
          this.setProjectsInit(val)
        }
      }
    })
  }
  //表格式化验单项目初始化
  setProjectsInit = (val) => {
    let { version, fiveData, fourData } = this.state
    let { patientSex } = this.props.store
    if (val === "精液常规分析") {
      if (version === "精液常规分析五版") {
        let defaultObj = [
          {
            projectIndex: 1,
            inspectionProjectName: "a级",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: "25-100",
            projectException: null,
            section1: 25,
            section2: 100,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "b级",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: "25-100",
            projectException: null,
            section1: 25,
            section2: 100,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "c级",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: null,
            projectException: null,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "d级",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: null,
            projectException: null,
          },
        ]
        this.setState({
          inspectionListParams: fiveData.length > 0 ? fiveData : defaultObj,
        })
      }
      if (version === "精液常规分析四版") {
        let defaultData = [
          {
            projectIndex: 1,
            inspectionProjectName: "前向运动PR",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: null,
            projectException: null,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "NP",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: null,
            projectException: null,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "IM",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: null,
            projectException: null,
          },
        ]
        this.setState({
          inspectionListParams: fourData.length > 0 ? fourData : defaultData,
        })
      }
    } else if (val === "精液形态学分析") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "正常形态率",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: null,
            projectException: null,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "畸形率（%）",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: "0-30",
            projectException: null,
            section1: 0,
            section2: 30,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "头部畸形（%）",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: "0-30",
            projectException: null,
            section1: 0,
            section2: 30,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "尾部畸形（%）",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: "0-30",
            projectException: null,
            section1: 0,
            section2: 30,
          },
          {
            projectIndex: 5,
            inspectionProjectName: "混合畸形（%）",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: "0-30",
            projectException: null,
            section1: 0,
            section2: 30,
          },
          {
            projectIndex: 6,
            inspectionProjectName: "体部畸形（%）",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: "0-30",
            projectException: null,
            section1: 0,
            section2: 30,
          },
        ],
      })
    } else if (val === "抗精子抗体") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "精浆",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: null,
            projectException: 0,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "血清",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: null,
            projectException: 0,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "抗精子抗体其他",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: null,
            projectException: 0,
          },
        ],
      })
    } else if (val === "精子DNA碎片指数检测") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "DFI",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: "0-10",
            projectException: null,
            section1: 0,
            section2: 10,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "HDS",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: "0-20",
            projectException: null,
            section1: 0,
            section2: 20,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "顶体正常率",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: "75-100",
            projectException: null,
            section1: 75,
            section2: 100,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "顶体酶",
            inspectionProjectValue: null,
            unit: null,
            tips: null,
            range: null,
            projectException: null,
          },
          {
            projectIndex: 5,
            inspectionProjectName: "顶体酶活性",
            inspectionProjectValue: null,
            unit: null,
            tips: null,
            range: "15.29-58.15",
            projectException: null,
            section1: 15.29,
            section2: 58.15,
          },
          {
            projectIndex: 6,
            inspectionProjectName: "精子线粒体",
            inspectionProjectValue: null,
            unit: null,
            tips: null,
            range: null,
            projectException: null,
          },
        ],
      })
    } else if (val === "微生物检查") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "淋球菌",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "支原体",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "衣原体",
            inspectionProjectValue: "阴性（-）",
            unit: "",
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
        ],
      })
    } else if (val === "肝功能") {
      patientSex
        ? //女
          this.setState({
            inspectionListParams: [
              {
                projectIndex: 1,
                inspectionProjectName: "谷丙转氨酶",
                inspectionProjectValue: "阴性（-）",
                unit: "(U/L)",
                tips: null,
                range: "阴性（-）",
                projectException: 0,
              },
              {
                projectIndex: 2,
                inspectionProjectName: "巨细胞病毒",
                inspectionProjectValue: "阴性（-）",
                unit: "(U/L)",
                tips: null,
                range: "阴性（-）",
                projectException: 0,
              },
              {
                projectIndex: 3,
                inspectionProjectName: "谷草转氨酶",
                inspectionProjectValue: "阴性（-）",
                unit: "(U/L)",
                tips: null,
                range: "阴性（-）",
                projectException: 0,
              },
              {
                projectIndex: 4,
                inspectionProjectName: "谷氨酰转肽酶",
                inspectionProjectValue: "阴性（-）",
                unit: "(U/L)",
                tips: null,
                range: "阴性（-）",
                projectException: 0,
              },
              {
                projectIndex: 5,
                inspectionProjectName: "胆红素",
                inspectionProjectValue: "阴性（-）",
                unit: "（Umol/L）",
                tips: null,
                range: "阴性（-）",
                projectException: 0,
              },
            ],
          })
        : //男
          this.setState({
            inspectionListParams: [
              {
                projectIndex: 1,
                inspectionProjectName: "谷丙转氨酶",
                inspectionProjectValue: "阴性（-）",
                unit: "(U/L)",
                tips: null,
                range: "阴性（-）",
                projectException: 0,
              },
              {
                projectIndex: 2,
                inspectionProjectName: "谷草转氨酶",
                inspectionProjectValue: "阴性（-）",
                unit: "(U/L)",
                tips: null,
                range: "阴性（-）",
                projectException: 0,
              },
              {
                projectIndex: 3,
                inspectionProjectName: "谷氨酰转肽酶",
                inspectionProjectValue: "阴性（-）",
                unit: "(U/L)",
                tips: null,
                range: "阴性（-）",
                projectException: 0,
              },
            ],
          })
    } else if (val === "尿常规") {
      patientSex
        ? //女
          this.setState({
            inspectionListParams: [
              {
                projectIndex: 1,
                inspectionProjectName: "尿蛋白",
                inspectionProjectValue: "阴性（-）",
                unit: null,
                tips: null,
                range: "阴性（-）",
                projectException: 0,
              },
              {
                projectIndex: 2,
                inspectionProjectName: "隐血",
                inspectionProjectValue: "阴性（-）",
                unit: null,
                tips: null,
                range: "阴性（-）",
                projectException: 0,
              },
              {
                projectIndex: 3,
                inspectionProjectName: "尿糖",
                inspectionProjectValue: "阴性（-）",
                unit: null,
                tips: null,
                range: "阴性（-）",
                projectException: 0,
              },
              {
                projectIndex: 4,
                inspectionProjectName: "酮体",
                inspectionProjectValue: null,
                unit: "（KET）",
                tips: null,
                range: null,
                projectException: null,
              },
              {
                projectIndex: 5,
                inspectionProjectName: "红细胞",
                inspectionProjectValue: null,
                unit: "（aa）",
                tips: null,
                range: "0-3",
                projectException: null,
                section1: 0,
                section2: 3,
              },
              {
                projectIndex: 6,
                inspectionProjectName: "白细胞",
                inspectionProjectValue: null,
                unit: "（bb）",
                tips: null,
                range: "0-10",
                projectException: null,
                section1: 0,
                section2: 10,
              },
              {
                projectIndex: 7,
                inspectionProjectName: "病理管理",
                inspectionProjectValue: null,
                unit: "（cc）",
                tips: null,
                range: "0-1",
                projectException: null,
                section1: 0,
                section2: 1,
              },
            ],
          })
        : //男
          this.setState({
            inspectionListParams: [
              {
                projectIndex: 1,
                inspectionProjectName: "尿蛋白",
                inspectionProjectValue: "阴性（-）",
                unit: null,
                tips: null,
                range: "阴性（-）",
                projectException: 0,
              },
              {
                projectIndex: 2,
                inspectionProjectName: "酮体",
                inspectionProjectValue: null,
                unit: "（KET）",
                tips: null,
                range: null,
                projectException: null,
              },
              {
                projectIndex: 3,
                inspectionProjectName: "红细胞",
                inspectionProjectValue: null,
                unit: "（aa）",
                tips: null,
                range: "0-3",
                projectException: null,
                section1: 0,
                section2: 3,
              },
              {
                projectIndex: 4,
                inspectionProjectName: "白细胞",
                inspectionProjectValue: null,
                unit: "（bb）",
                tips: null,
                range: "0-10",
                projectException: null,
                section1: 0,
                section2: 10,
              },
              {
                projectIndex: 5,
                inspectionProjectName: "病理管理",
                inspectionProjectValue: null,
                unit: "（cc）",
                tips: null,
                range: "0-1",
                projectException: null,
                section1: 0,
                section2: 1,
              },
            ],
          })
    } else if (val === "电解质") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "尿酸",
            inspectionProjectValue: null,
            unit: "Umol/L",
            tips: null,
            range: patientSex ? "89-357" : "149-416",
            projectException: null,
            section1: patientSex ? "89" : "149",
            section2: patientSex ? "357" : "416",
          },
          {
            projectIndex: 2,
            inspectionProjectName: "钙",
            inspectionProjectValue: null,
            unit: "mmol/L",
            tips: null,
            range: "2.25-2.75",
            projectException: null,
            section1: 2.25,
            section2: 2.75,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "25羟维生素D",
            inspectionProjectValue: null,
            unit: "nmol/L",
            tips: null,
            range: "10-80",
            projectException: null,
            section1: 10,
            section2: 80,
          },
        ],
      })
    } else if (val === "C反应蛋白") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "GRP",
            inspectionProjectValue: null,
            unit: "mg/L",
            tips: null,
            range: null,
            projectException: null,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "hsCRP",
            inspectionProjectValue: null,
            unit: "mg/L",
            tips: null,
            range: null,
            projectException: null,
          },
        ],
      })
    } else if (val === "阴道分泌物") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "清洁度",
            inspectionProjectValue: null,
            unit: null,
            tips: null,
            range: "Ⅰ度,Ⅱ度",
            projectException: 0,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "分泌物抗精子抗体",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "加德纳",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
        ],
      })
    } else if (val === "淋球菌/支、衣原体") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "淋球菌",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "衣原体",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "解脲支原体",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "生殖支原体",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
        ],
      })
    } else if (val === "TORCH") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "IgM 弓形虫",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "IgM 风疹病毒",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "IgM 巨细胞病毒",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "IgM 单纯疱疹病毒I型",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 5,
            inspectionProjectName: "IgM 单纯疱疹病毒II型",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 6,
            inspectionProjectName: "IgG 弓形虫",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 7,
            inspectionProjectName: "IgG 风疹病毒",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 8,
            inspectionProjectName: "IgG 巨细胞病毒",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 9,
            inspectionProjectName: "IgG 单纯疱疹病毒I型",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 10,
            inspectionProjectName: "IgG 单纯疱疹病毒II型",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
        ],
      })
    } else if (val === "甲状腺") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "T3",
            inspectionProjectValue: null,
            unit: "(nmol/L)",
            tips: null,
            range: "0.9-1.8",
            projectException: null,
            section1: 0.9,
            section2: 1.8,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "T4",
            inspectionProjectValue: null,
            unit: "(nmol/L)",
            tips: null,
            range: "5.5-14.0",
            projectException: null,
            section1: 5.5,
            section2: 14,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "FT3",
            inspectionProjectValue: null,
            unit: "(pmol/L)",
            tips: null,
            range: "3.18-6",
            projectException: null,
            section1: 3.18,
            section2: 6,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "FT4",
            inspectionProjectValue: null,
            unit: "(pmol/L)",
            tips: null,
            range: "10-31",
            projectException: null,
            section1: 10,
            section2: 31,
          },
          {
            projectIndex: 5,
            inspectionProjectName: "TSH",
            inspectionProjectValue: null,
            unit: "(miu/L)",
            tips: null,
            range: "2-10",
            projectException: null,
            section1: 2,
            section2: 10,
          },
          {
            projectIndex: 6,
            inspectionProjectName: "TGAb",
            inspectionProjectValue: null,
            unit: "(IU/ml)",
            tips: null,
            range: "0-60",
            projectException: null,
            section1: 0,
            section2: 60,
          },
          {
            projectIndex: 7,
            inspectionProjectName: "TMAb",
            inspectionProjectValue: null,
            unit: "(U/ml)",
            tips: null,
            range: "0.0-2.10",
            projectException: null,
            section1: 0,
            section2: 2.1,
          },
          {
            projectIndex: 8,
            inspectionProjectName: "anti-tpo",
            inspectionProjectValue: null,
            unit: "(IU/ml)",
            tips: null,
            range: "0-34",
            projectException: null,
            section1: 0,
            section2: 34,
          },
        ],
      })
    } else if (val === "肿瘤标志物") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "GA125",
            inspectionProjectValue: null,
            unit: "(ng/ml)",
            tips: null,
            range: "0.1-35",
            projectException: null,
            section1: 0.1,
            section2: 35,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "GA199",
            inspectionProjectValue: null,
            unit: "(ng/ml)",
            tips: null,
            range: "0.1-27",
            projectException: null,
            section1: 0.1,
            section2: 27,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "HE4",
            inspectionProjectValue: null,
            unit: "(pmol/L)",
            tips: null,
            range: "0-55",
            projectException: null,
            section1: 0,
            section2: 55,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "CEA",
            inspectionProjectValue: null,
            unit: "(ug/L)",
            tips: null,
            range: "0-5",
            projectException: null,
            section1: 0,
            section2: 5,
          },
          {
            projectIndex: 5,
            inspectionProjectName: "AEP",
            inspectionProjectValue: null,
            unit: "(ng/ml)",
            tips: null,
            range: null,
            projectException: null,
          },
        ],
      })
    } else if (val === "性激素") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "FSH",
            inspectionProjectValue: null,
            unit: "(IU/L)",
            tips: null,
            range: "3.50-4.50",
            projectException: null,
            section1: 3.5,
            section2: 4.5,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "E2",
            inspectionProjectValue: null,
            unit: "(pmol/L)",
            tips: null,
            range: "0.00-146.10",
            projectException: null,
            section1: 0,
            section2: 146.1,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "P",
            inspectionProjectValue: null,
            unit: "(ng/ml)",
            tips: null,
            range: "0.6-86",
            projectException: null,
            section1: 0.6,
            section2: 86,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "PRL",
            inspectionProjectValue: null,
            unit: "(miu/L)",
            tips: null,
            range: "40.00-370.00",
            projectException: null,
            section1: 40,
            section2: 370,
          },
          {
            projectIndex: 5,
            inspectionProjectName: "LH",
            inspectionProjectValue: null,
            unit: "(IU/L)",
            tips: null,
            range: "1.50-9.30",
            projectException: null,
            section1: 1.5,
            section2: 9.3,
          },
          {
            projectIndex: 6,
            inspectionProjectName: "T",
            inspectionProjectValue: null,
            unit: "(ng/ml)",
            tips: null,
            range: "0.6-86",
            projectException: null,
            section1: 0.6,
            section2: 86,
          },
        ],
      })
    } else if (val === "血糖") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "空腹血糖",
            inspectionProjectValue: null,
            unit: "(VIU/ml)",
            tips: null,
            range: "3.9-6.1",
            projectException: null,
            section1: 3.9,
            section2: 6.1,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "服葡萄糖1h后血糖",
            inspectionProjectValue: null,
            unit: "(VIU/ml)",
            tips: null,
            range: "6.7-9.4",
            projectException: null,
            section1: 6.7,
            section2: 9.4,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "服葡萄糖2h后血糖",
            inspectionProjectValue: null,
            unit: "(VIU/ml)",
            tips: null,
            range: "0.0-7.8",
            projectException: null,
            section1: 0,
            section2: 7.8,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "服葡萄糖3h后血糖",
            inspectionProjectValue: null,
            unit: "(VIU/ml)",
            tips: null,
            range: "0.0-7.8",
            projectException: null,
            section1: 0,
            section2: 7.8,
          },
        ],
      })
    } else if (val === "凝血") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "PT",
            inspectionProjectValue: null,
            unit: "(s)",
            tips: null,
            range: "11-17",
            projectException: null,
            section1: 11,
            section2: 17,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "APTT",
            inspectionProjectValue: null,
            unit: "(s)",
            tips: null,
            range: "25-47",
            projectException: null,
            section1: 25,
            section2: 47,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "TT",
            inspectionProjectValue: null,
            unit: "(s)",
            tips: null,
            range: "12-19",
            projectException: null,
            section1: 12,
            section2: 19,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "Fib",
            inspectionProjectValue: null,
            unit: "(G/L)",
            tips: null,
            range: "2-4",
            projectException: null,
            section1: 2,
            section2: 4,
          },
          {
            projectIndex: 5,
            inspectionProjectName: "D-2聚体",
            inspectionProjectValue: null,
            unit: "(mg/l)",
            tips: null,
            range: "0-0.2",
            projectException: null,
            section1: 0,
            section2: 0.2,
          },
        ],
      })
    } else if (val === "血脂") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "甘油三脂",
            inspectionProjectValue: null,
            unit: "(TG) (mmol/L)",
            tips: null,
            range: "0.56-1.7",
            projectException: null,
            section1: 0.56,
            section2: 1.7,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "血清总胆固醇",
            inspectionProjectValue: null,
            unit: "(TC) (mmol/L)",
            tips: null,
            range: "2.8-5.17",
            projectException: null,
            section1: 2.8,
            section2: 5.17,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "高密度脂蛋白",
            inspectionProjectValue: null,
            unit: "(HDL) (mmol/L)",
            tips: null,
            range: "0.9-1.8",
            projectException: null,
            section1: 0.9,
            section2: 1.8,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "低密度脂蛋白",
            inspectionProjectValue: null,
            unit: "(LDL) (mmol/L)",
            tips: null,
            range: "2.1-3.1",
            projectException: null,
            section1: 2.1,
            section2: 3.1,
          },
          {
            projectIndex: 5,
            inspectionProjectName: "脂蛋白",
            inspectionProjectValue: null,
            unit: "(a) (mmol/L)",
            tips: null,
            range: null,
            projectException: null,
          },
        ],
      })
    } else if (val === "乙肝六项") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "HBsAg",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "HBsAb",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "HBeAg",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "HBeAb",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 5,
            inspectionProjectName: "HBcAb",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 6,
            inspectionProjectName: "HBcAb-IgM",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
        ],
      })
    } else if (val === "肾功能") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "血肌酐",
            inspectionProjectValue: "阴性（-）",
            unit: "(umol/L)",
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "血尿氮素",
            inspectionProjectValue: "阴性（-）",
            unit: "(mmol/L)",
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
        ],
      })
    } else if (val === "血常规") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "血红蛋白",
            inspectionProjectValue: null,
            unit: "(G/L)",
            tips: null,
            range: "110-160",
            projectException: null,
            section1: 110,
            section2: 160,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "红细胞计数",
            inspectionProjectValue: null,
            unit: "(×10^12/L)",
            tips: null,
            range: patientSex ? "3.5-5.0" : "4.0-5.5",
            projectException: null,
            section1: patientSex ? "3.5" : "4.0",
            section2: patientSex ? "5.0" : "5.5",
          },
          {
            projectIndex: 3,
            inspectionProjectName: "白细胞计数",
            inspectionProjectValue: null,
            unit: "(×10^9/L)",
            tips: null,
            range: "4.0-10.0",
            projectException: null,
            section1: 4,
            section2: 10,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "血细胞容积",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: patientSex ? "34-47" : "36-50",
            projectException: null,
            section1: patientSex ? "34" : "36",
            section2: patientSex ? "47" : "50",
          },
          {
            projectIndex: 5,
            inspectionProjectName: "血小板计数",
            inspectionProjectValue: null,
            unit: "(×10^9/L)",
            tips: null,
            range: "100-400",
            projectException: null,
            section1: 100,
            section2: 400,
          },
          {
            projectIndex: 6,
            inspectionProjectName: "平均红细胞体积",
            inspectionProjectValue: null,
            unit: "(fl)",
            tips: null,
            range: "80-100",
            projectException: null,
            section1: 80,
            section2: 100,
          },
          {
            projectIndex: 7,
            inspectionProjectName: "平均RBC血红蛋白量",
            inspectionProjectValue: null,
            unit: "(pg)",
            tips: null,
            range: "27-31",
            projectException: null,
            section1: 27,
            section2: 31,
          },
        ],
      })
    } else if (val === "梅毒") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "梅毒（TP）",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "梅毒（RPR）",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "梅毒（TRUST）",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "梅毒（TP-Ab）",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
        ],
      })
    } else if (val === "封闭抗体") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "CD3",
            inspectionProjectValue: null,
            unit: "ul",
            tips: null,
            range: "955-3680",
            projectException: null,
            section1: 955,
            section2: 3680,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "CD4",
            inspectionProjectValue: null,
            unit: "ul",
            tips: null,
            range: "450-1440",
            projectException: null,
            section1: 450,
            section2: 1440,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "CD8",
            inspectionProjectValue: null,
            unit: "ul",
            tips: null,
            range: "320-1250",
            projectException: null,
            section1: 320,
            section2: 1250,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "CD25",
            inspectionProjectValue: null,
            unit: null,
            tips: null,
            range: null,
            projectException: null,
          },
          {
            projectIndex: 5,
            inspectionProjectName: "封闭效率",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: null,
            projectException: null,
          },
        ],
      })
    } else if (val === "电泳") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "血红蛋白A",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: patientSex ? "110-150" : "120-160",
            projectException: null,
            section1: patientSex ? "110" : "120",
            section2: patientSex ? "150" : "160",
          },
          {
            projectIndex: 2,
            inspectionProjectName: "血红蛋白A2",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: patientSex ? "110-150" : "120-160",
            projectException: null,
            section1: patientSex ? "110" : "120",
            section2: patientSex ? "150" : "160",
          },
          {
            projectIndex: 3,
            inspectionProjectName: "血红蛋白F",
            inspectionProjectValue: null,
            unit: "(%)",
            tips: null,
            range: patientSex ? "110-150" : "120-160",
            projectException: null,
            section1: patientSex ? "110" : "120",
            section2: patientSex ? "150" : "160",
          },
        ],
      })
    } else if (val === "各种抗体") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "血清抗精子抗体",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 2,
            inspectionProjectName: "抗内膜抗体",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 3,
            inspectionProjectName: "抗心磷脂抗体",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 4,
            inspectionProjectName: "IgG",
            inspectionProjectValue: "阴性（-）",
            unit: "(U)",
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 5,
            inspectionProjectName: "IgM",
            inspectionProjectValue: "阴性（-）",
            unit: "(U)",
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 6,
            inspectionProjectName: "抗卵巢抗体",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 7,
            inspectionProjectName: "抗核抗体",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 8,
            inspectionProjectName: "宫颈粘液抗精子抗体",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 9,
            inspectionProjectName: "抗结核抗体",
            inspectionProjectValue: "阴性（-）",
            unit: null,
            tips: null,
            range: "阴性（-）",
            projectException: 0,
          },
          {
            projectIndex: 10,
            inspectionProjectName: "HCY",
            inspectionProjectValue: null,
            unit: "(umol/L)",
            tips: null,
            range: null,
            projectException: null,
          },
          {
            projectIndex: 11,
            inspectionProjectName: "抗核抗体滴度（ANA-T）",
            inspectionProjectValue: null,
            unit: null,
            tips: null,
            range: null,
            projectException: null,
          },
          {
            projectIndex: 12,
            inspectionProjectName: "抗双链DNA抗体（A-dsDNA）",
            inspectionProjectValue: null,
            unit: "(IU/ml)",
            tips: null,
            range: "70-90",
            projectException: null,
            section1: 70,
            section2: 90,
          },
          {
            projectIndex: 13,
            inspectionProjectName: "抗β2-糖蛋白1抗体测定（A-β 2-GP1）",
            inspectionProjectValue: null,
            unit: "(RU/ml)",
            tips: null,
            range: "0-20",
            projectException: null,
            section1: 0,
            section2: 20,
          },
          {
            projectIndex: 14,
            inspectionProjectName: "抗磷脂酰丝氨酸和凝血酶",
            inspectionProjectValue: null,
            unit: "(U/ml)",
            tips: null,
            range: null,
            projectException: null,
          },
        ],
      })
    } else if (val === "乙肝DNA") {
      this.setState({
        inspectionListParams: [
          {
            projectIndex: 1,
            inspectionProjectName: "乙型肝炎病毒脱氧核糖核酸",
            inspectionProjectValue: null,
            unit: "IU/ml",
            tips: null,
            range: "0-500",
            projectException: null,
            section1: 0,
            section2: 500,
          },
        ],
      })
    } else if (val === "尿道分泌物") {
      let tempParamsList = []
      let data = ["支原体", "衣原体", "淋球菌", "单纯疱疹病毒", "HPV"]
      data.forEach((item, index) => {
        let tempObj = {
          projectIndex: index + 1,
          inspectionProjectName: item,
          inspectionProjectValue: "阴性",
          unit: null,
          tips: null,
          range: "阴性",
          projectException: null,
          inspectionProjectDetail: "",
        }
        tempParamsList.push(tempObj)
      })
      this.setState({
        inspectionListParams: [...tempParamsList],
      })
    } else {
      this.setState({
        inspectionListParams: [],
      })
    }
  }
  // 判断是正常还是异常，单个区间
  judgeNormalSingle = (record, val) => {
    let rangeArr = []
    if (record.range) {
      rangeArr = record.range && record.range.split("-")
      if (val !== "" && val !== null) {
        if (val < parseFloat(rangeArr[0])) {
          record.tips = -1
          record.projectException = 1 //1是异常
        } else if (val > parseFloat(rangeArr[1])) {
          record.tips = 1
          record.projectException = 1
        } else {
          record.tips = 0
          record.projectException = 0
        }
      } else {
        record.tips = 0
        record.projectException = null
      }
    }
  }
  //新增化验单的修改值
  setProjectsValueAdd = (param, index, val) => {
    let { inspectionListParams } = this.state
    if (param === "inspectionProjectValue") {
      inspectionListParams[index].inspectionProjectValue = val
    } else if (param === "change") {
      inspectionListParams[index].inspectionProjectValue =
        inspectionListParams[index].indexMark === 0 ? "阳性" : "阴性"
      inspectionListParams[index].projectException =
        inspectionListParams[index].indexMark === 0 ? 1 : 0
      inspectionListParams[index].indexMark =
        inspectionListParams[index].indexMark === 0
          ? 1
          : inspectionListParams[index].indexMark === 1
          ? 0
          : inspectionListParams[index].indexMark
    } else if (param === "unit") {
      inspectionListParams[index].unit = val
    } else if (param === "section1" || param === "section2") {
      inspectionListParams[index][param] = val
    }
    this.setState({
      inspectionListParams: [...inspectionListParams],
    })
  }
  //表格式化验单项目值变化（）
  setProjectsValue = (record, val, param) => {
    let { inspectionListParams, itemTitle, version } = this.state
    let checkArr = [
      "尿道分泌物",
      "乙肝DNA",
      "性激素",
      "血糖",
      "凝血",
      "血脂",
      "电解质",
      "肿瘤标志物",
      "血常规",
      "尿常规",
      "封闭抗体",
      "各种抗体",
      "电泳",
      "精液形态学分析",
      "精子DNA碎片指数检测",
      "精液常规分析",
      "甲状腺",
    ]
    let normalArr = ["阴性（-）", "Ⅰ度", "Ⅱ度", "Ⅰ度,Ⅱ度", "阴性", "未查"]
    record[param] = val
    // 判断阴性阳性等
    // 判断表格中的值是否在区间中
    if (record.range) {
      if (checkArr.includes(itemTitle) && !normalArr.includes(record.range)) {
        this.judgeNormalSingle(record, val)
      } else {
        if (normalArr.includes(val)) {
          record.projectException = 0 //0是正常
        } else {
          record.projectException = 1
        }
      }
    } else {
      record.projectException = null
    }
    this.setState({
      inspectionListParams: [...inspectionListParams],
    })
    // 四五版的取值保存
    if (version === "精液常规分析五版") {
      this.setState({
        fiveData: [...inspectionListParams],
      })
    }
    if (version === "精液常规分析四版") {
      this.setState({
        fourData: [...inspectionListParams],
      })
    }
  }
  //浓度和精子密度的切换
  setDegreeType = async (val) => {
    await this.setState({
      degreeType: val,
    })
  }
  //版本的切换
  setVersion = async (val) => {
    await this.setState({
      version: val,
      versions:
        val === "精液常规分析四版" ? 0 : val === "精液常规分析五版" ? 1 : null,
    })
    this.setProjectsInit("精液常规分析")
  }
  //提交修改和添加
  submit = () => {
    let {
      operateData,
      inspectionListParams,
      itemTitle,
      otherInspectionProjectDTO,
      versions,
    } = this.state
    let checkArr = [
      "性激素",
      "血糖",
      "凝血",
      "血脂",
      "电解质",
      "肿瘤标志物",
      "血常规",
      "尿常规",
      "封闭抗体",
      "各种抗体",
      "电泳",
      "精液形态学分析",
      "精子DNA碎片指数检测",
      "精液常规分析",
      "甲状腺",
    ]
    let normalArr = ["阴性（-）", "Ⅰ度", "Ⅱ度", "Ⅰ度,Ⅱ度", "阴性", "未查"]
    let tempArr = []
    inspectionListParams.forEach((item) => {
      delete item.indexMark
      item.range =
        item.section1 !== "" &&
        item.section2 !== "" &&
        "section1" in item &&
        "section2" in item &&
        item.inspectionProjectValue !== "阴性" &&
        item.inspectionProjectValue !== "阳性"
          ? item.section1 + "-" + item.section2
          : item.range
      item.projectException =
        parseFloat(item.inspectionProjectValue) < parseFloat(item.section1) ||
        parseFloat(item.inspectionProjectValue) > parseFloat(item.section2) ||
        item.inspectionProjectValue === "阳性"
          ? 1
          : 0
      item.tips =
        parseFloat(item.inspectionProjectValue) < parseFloat(item.section1)
          ? -1
          : parseFloat(item.inspectionProjectValue) > parseFloat(item.section2)
          ? 1
          : 0
      item.unit =
        item.inspectionProjectValue !== "阴性" &&
        item.inspectionProjectValue !== "阳性"
          ? item.unit
          : ""
      delete item.section2
      delete item.section1
      tempArr.push(item)
    })
    this.setState({
      inspectionListParams: [...tempArr],
    })
    //重置projectException（是否异常）
    inspectionListParams.forEach((record) => {
      if (checkArr.includes(itemTitle) && !normalArr.includes(record.range)) {
        this.judgeNormalSingle(record, record.inspectionProjectValue)
      } else {
        if (record.range) {
          if (
            record.range.indexOf("-") > -1 &&
            !normalArr.includes(record.range)
          ) {
            if (
              parseFloat(record.inspectionProjectValue) >
                parseFloat(record.range.split("-")[1]) ||
              parseFloat(record.inspectionProjectValue) <
                parseFloat(record.range.split("-")[0])
            ) {
              record.projectException = 1
            } else {
              record.projectException = 0
            }
          } else {
            if (normalArr.includes(record.inspectionProjectValue)) {
              record.projectException = 0
            } else {
              record.projectException = 1
            }
          }
        } else {
          record.projectException = null
        }
      }
    })
    this.setState({
      inspectionListParams,
    })
    let params = {
      uid: operateData.uid,
      version: versions,
      date: operateData.date ? operateData.date : todayString,
      place: operateData.place || 0,
      inspectionName: itemTitle,
      inspectionListParams,
      patientParam: this.selectPatient(),
      otherInspectionProjectDTO,
    }
    if (params.inspectionName === "血型") {
      params.otherInspectionProjectDTO.rhFactor =
        params.otherInspectionProjectDTO.result
      params.otherInspectionProjectDTO.result = "正常"
    }
    if (operateData.edit) {
      debounce(
        apis.ManCheck.updateinspectiontdetail(params).then((res) => {
          if (res.code === 200) {
            this.props.close()
            this.props.getData()
            message.success("修改成功")
          }
        })
      )
      //修改方法
    } else {
      //添加方法
      debounce(
        apis.ManCheck.saveinspectiontdetail(params).then((res) => {
          if (res.code === 200) {
            this.props.close()
            this.props.getData()
            message.success("添加成功")
            // this.props.handleChoseItem()
          }
        })
      )
    }
  }
  // 判断头部是否需要换行
  judgeWrap = (val) => {
    let wrap = null
    let arr = [
      "HC2",
      "HPV",
      "胰岛素释放",
      "肝功能",
      "肾功能",
      "尿常规",
      "HIV",
      "HCV",
      "血型",
      "染色体",
      "染色体G带核型检查",
      "全基因拷贝数变异分析",
      "地贫",
      "精浆酶学分析",
      "尿道分泌物",
    ]
    if (arr.includes(val)) {
      wrap = true //换行
    } else {
      wrap = false //不换行
    }
    return wrap
  }
  render() {
    let { renderOptions } = this.props.moredetail
    let { selectInspectionType } = this.props.inspection
    let {
      operateData,
      inspectionListParams,
      otherInspectionProjectDTO,
      itemTitle,
      version,
      degreeType,
      insepectOptions,
    } = this.state
    operateData.place = operateData.place ? operateData.place : 0
    otherInspectionProjectDTO.result = otherInspectionProjectDTO.result
      ? otherInspectionProjectDTO.result
      : itemTitle === "地贫"
      ? "无"
      : itemTitle === "HC2" ||
        itemTitle === "HPV" ||
        itemTitle === "HIV" ||
        itemTitle === "HCV" ||
        itemTitle === "血型"
      ? "阴性（-）"
      : "正常" //结果
    otherInspectionProjectDTO.viscosity = otherInspectionProjectDTO.viscosity
      ? otherInspectionProjectDTO.viscosity
      : "适中" //精液常规分析的粘稠度
    otherInspectionProjectDTO.azfaArea = otherInspectionProjectDTO.azfaArea
      ? otherInspectionProjectDTO.azfaArea
      : 0 //AZF基因缺失检测
    otherInspectionProjectDTO.azfbArea = otherInspectionProjectDTO.azfbArea
      ? otherInspectionProjectDTO.azfbArea
      : 0
    otherInspectionProjectDTO.azfcArea = otherInspectionProjectDTO.azfcArea
      ? otherInspectionProjectDTO.azfcArea
      : 0
    otherInspectionProjectDTO.azfdArea = otherInspectionProjectDTO.azfdArea
      ? otherInspectionProjectDTO.azfdArea
      : 0
    otherInspectionProjectDTO.trichomonas = otherInspectionProjectDTO.trichomonas
      ? otherInspectionProjectDTO.trichomonas
      : 0 //阴道分泌物
    otherInspectionProjectDTO.mold = otherInspectionProjectDTO.mold
      ? otherInspectionProjectDTO.mold
      : 0
    otherInspectionProjectDTO.pseudomycetes = otherInspectionProjectDTO.pseudomycetes
      ? otherInspectionProjectDTO.pseudomycetes
      : 0
    otherInspectionProjectDTO.threadedCells = otherInspectionProjectDTO.threadedCells
      ? otherInspectionProjectDTO.threadedCells
      : 0
    return (
      <DateTitleView
        tips={!operateData.edit}
        title={
          operateData.edit ? (
            itemTitle
          ) : (
            <FlexItem>
              <Select
                value={itemTitle}
                style={{ width: "auto", textAlign: "left", marginLeft: 10 }}
                dropdownMatchSelectWidth={200}
                onChange={(value) => {
                  this.setItemTitle(value, "inspectionTitle")
                }}
              >
                {renderOptions(selectInspectionType, "1")}
              </Select>
            </FlexItem>
          )
        }
        selectOption={
          <div className="selectOptions" style={{ marginLeft: 0 }}>
            <FlexItem>
              <Select
                style={{ width: "auto", marginLeft: 0 }}
                dropdownMatchSelectWidth={100}
                value={
                  operateData.place === 0
                    ? "本院"
                    : operateData.place === 1
                    ? "外院"
                    : operateData.place === 2
                    ? "第三方检验"
                    : null
                }
                onChange={(value) => {
                  this.setInheritVal(value, "place")
                }}
              >
                {renderOptions(insepectOptions, "263")}
              </Select>
              {this.judgeWrap(itemTitle) ? null : (
                <Header
                  item={{ ...otherInspectionProjectDTO }}
                  checkType={itemTitle}
                  insepectOptions={insepectOptions}
                  setReportValue={this.setReportValue}
                />
              )}
            </FlexItem>
          </div>
        }
        subtitle={
          <>
            <span style={{ marginRight: 50 }}>
              <span className="checkdate">报告日期：</span>
              {operateData.edit ? (
                <span>{operateData.date}</span>
              ) : (
                <DatePicker
                  style={{ width: 130 }}
                  allowClear={false}
                  defaultValue={operateData.date}
                  value={
                    operateData.date
                      ? moment(operateData.date, dateFormatDate)
                      : moment(todayString, dateFormatDate)
                  }
                  onChange={(date, datestring) => {
                    this.setInheritVal(datestring, "date")
                  }}
                />
              )}
            </span>

            <CheckOutlined
              style={{ color: "#59B4F4", marginRight: 20 }}
              onClick={this.submit}
            />
            <CloseOutlined style={{ color: "red" }} onClick={this.close} />
          </>
        }
        style={{ marginRight: 0 }}
      >
        {this.judgeWrap(itemTitle) ? (
          <Header
            item={{ ...otherInspectionProjectDTO }}
            checkType={itemTitle}
            insepectOptions={insepectOptions}
            setReportValue={this.setReportValue}
          />
        ) : null}
        <div className="content">
          <Content
            item={{ ...otherInspectionProjectDTO }}
            inspectionListParams={inspectionListParams}
            checkType={itemTitle}
            version={version}
            degreeType={degreeType}
            insepectOptions={insepectOptions}
            setVersion={this.setVersion}
            setDegreeType={this.setDegreeType}
            setProjectsValue={this.setProjectsValue}
            setReportValue={this.setReportValue}
            edit={operateData.edit}
            setProjectsValueAdd={this.setProjectsValueAdd}
            addCheckSource={this.props.addCheckSource}
          />
        </div>
      </DateTitleView>
    )
  }
}
