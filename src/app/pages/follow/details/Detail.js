import React, { Component } from "react"
import {
  Row,
  Switch,
  Select,
  Radio,
  Button,
  InputNumber,
  Checkbox,
  Tabs,
  message,
} from "antd"
import styled from "styled-components"
import { PlusOutlined, MinusOutlined } from "@ant-design/icons"
import BaseSelect from "@/app/components/base/baseSelect"
import BaseAutoComplete from "@/app/components/base/baseAutoComplete"
import BaseDatepicker from "@/app/components/base/baseDatepicker"
import { BaseTable } from "@/app/components/base/baseTable"
import { DashBtn } from "@/app/components/base/baseBtn"
import { FontInput } from "@/app/components/base/baseFontInput"
import MaleIcon from "@/app/styles/image/follow-male.svg"
import FemaleIcon from "@/app/styles/image/follow-female.svg"
import "./index.scss"
import apis from "@/app/utils/apis"
import { inject, observer } from "mobx-react"
import moment from "moment"
import { observable } from "mobx"
import "moment/locale/zh-cn"

const { TabPane } = Tabs
const { Option } = Select

const StyledTabs = styled(Tabs)`
  &.ant-tabs.ant-tabs-top {
    width: 100%;
    .ant-tabs-nav {
      background: white;
      margin-bottom: 12px;

      .ant-tabs-nav-wrap {
        display: flex;
        align-items: center;
        background: #fff;
      }

      .ant-tabs-tab {
        display: flex;
        justify-content: center;
        color: #333333;
        width: 100px;
        height: 40px;
        background: white;
        font-size: 12px;
        margin-right: 0;

        .ant-tabs-tab-btn {
          font-weight: 400;
        }

        &.ant-tabs-tab-active {
          color: #59b4f4;
          background-color: #edf6fd;
        }
      }
    }
    .ant-tabs-content {
      padding: 0 14px 14px 14px;
      background: white;
      overflow: auto;
    }
  }
`

const MultipleSelect = styled(Select)`
  &.ant-select {
    font-size: 14px;
    width: ${(props) => props.width + "px"};
    height: ${(props) => (props.height || 36) + "px"};
    line-height: ${(props) => (props.height || 36) + "px"};

    .ant-select-selector {
      width: ${(props) => props.width + "px"};
      height: ${(props) => (props.height || 36) + "px"};
      line-height: ${(props) => (props.height || 36) + "px"};

      .ant-select-selection__rendered {
        width: ${(props) => props.width + "px"};
        height: ${(props) => (props.height || 36) + "px"};
        line-height: ${(props) => (props.height || 36) + "px"};

        .ant-select-selection-selected-value {
          width: ${(props) => props.width + "px"};
          height: ${(props) => (props.height || 36) + "px"};
          line-height: ${(props) => (props.height || 36) + "px"};
        }
      }
      .ant-select-selection-item {
        height: 20px;
        line-height: 20px;
      }
    }
  }
`

const DetailWarp = styled.div`
  padding: 0 20px;
  // height: calc(100vh - 256px);
  background: #fff;
`

const DetailContent = styled.div`
  padding-left: 100px;
`

const DetailTitle = styled.div`
  height: 40px;
  line-height: 40px;
  font-weight: 500;

  .leftborder {
    vertical-align: middle;
    display: inline-block;
    margin: 0 10px;
    width: 2px;
    height: 14px;
    background-color: #59b4f4;
  }
`

const BaseFormItem = styled(Row)`
  margin-bottom: 12px;
`

const AbnormalTop = styled(Row)`
  margin-top: 12px;
  height: 30px;
  background: #f6f6f6;
`

const BaseInputNumber = styled(InputNumber)`
  &.ant-input-number {
    .ant-input-number-input {
      height: 26px;
      line-height: 26px;
    }
  }
`
const BorderDash = styled.div`
  width: 100%;
  border-top: 1px dashed #bebebe;
  margin-top: 16px;
`

const BaseLabel = styled.div`
  flex-shrink: 0;
  height: 36px;
  display: flex;
  align-items: center;
  align-self: flex-start;
  font-size: 14px;
  width: ${(props) => props.width + "px"};
  justify-content: flex-end;

  &::after {
    content: "：";
  }
`

const freshRecovery = ["新鲜", "复苏", "新鲜+复苏"]
const AIH = ["AIH", "AID"]
moment.locale("zh-cn")
export default
@inject("follow")
@observer
class index extends Component {
  @observable curTabpane = "gestation"
  @observable pregnancyData = {
    earlyDate: moment().format("YYYY-MM-DD"),
    midDate: moment().format("YYYY-MM-DD"),
  }
  @observable index = 1
  @observable midIndex = 1
  @observable earlyUltrasoundPregnancyParams = []
  @observable pregnancyEarlyWeek = ""
  @observable pregnancyMidWeek = ""
  constructor(props) {
    super(props)
    this.state = {
      sex: "",
      babyTag: "",
      followStage: "",
      afterBirthOneData: {
        afterBirthExceptionDTOS: [],
      },
      afterBirthFiveData: {},
      tenBirthTenData: {},
      fifteenData: {},
      twentyData: {
        twentyFemaleEndocrineHormoneParams: [],
      },
    }
  }

  componentDidMount() {
    const { getPregnancy, getProduction, getAfterbirth } = this.props.follow
    const { surgeryDate, cycleType } = JSON.parse(
      localStorage.getItem("followrecord")
    )
    if (freshRecovery.includes(cycleType)) {
      let lastMenstruationDate = moment(surgeryDate).subtract(17, "days")
      const date = moment().diff(moment(lastMenstruationDate), "days") / 7
      this.pregnancyEarlyWeek = parseInt(date, 10)
      this.pregnancyMidWeek = parseInt(date, 10)
    }
    if (AIH.includes(cycleType)) {
      let lastMenstruationDate = moment(surgeryDate).subtract(14, "days")
      const date = moment().diff(moment(lastMenstruationDate), "days") / 7
      this.pregnancyEarlyWeek = parseInt(date, 10)
      this.pregnancyMidWeek = parseInt(date, 10)
    }
    getPregnancy()
    getProduction()
    getAfterbirth()
  }

  onSubmitPregnancy = () => {
    const { savePregnancy } = this.props.follow
    const { detailData } = this.props.follow
    if (
      detailData.pregnancyStatus &&
      detailData.pregnancyStatus.endingTag === null
    ) {
      message.error("请选择结局")
      return
    }
    if (
      detailData.pregnancyStatus &&
      detailData.pregnancyStatus.endingTag === 1 &&
      !detailData.pregnancyStatus.ending
    ) {
      message.error("请选择结局详情")
      return
    }
    savePregnancy()
  }

  setPregnancyData = (key, value) => {
    const { surgeryDate, cycleType } = JSON.parse(
      localStorage.getItem("followrecord")
    )
    if (key === "earlyDate" && !value) {
      this.pregnancyEarlyWeek = ""
    }
    if (key === "midDate" && !value) {
      this.pregnancyMidWeek = ""
    }
    if (key === "earlyDate" && value) {
      if (freshRecovery.includes(cycleType)) {
        let lastMenstruationDate = moment(surgeryDate).subtract(17, "days")
        const date =
          moment(value).diff(moment(lastMenstruationDate), "days") / 7
        this.pregnancyEarlyWeek = parseInt(date, 10)
      }
      if (AIH.includes(cycleType)) {
        let lastMenstruationDate = moment(surgeryDate).subtract(14, "days")
        const date = moment().diff(moment(lastMenstruationDate), "days") / 7
        this.pregnancyEarlyWeek = parseInt(date, 10)
      }
    }
    if (key === "midDate" && value) {
      if (freshRecovery.includes(cycleType)) {
        let lastMenstruationDate = moment(surgeryDate).subtract(17, "days")
        const date =
          moment(value).diff(moment(lastMenstruationDate), "days") / 7
        this.pregnancyMidWeek = parseInt(date, 10)
      }
      if (AIH.includes(cycleType)) {
        let lastMenstruationDate = moment(surgeryDate).subtract(14, "days")
        const date = moment().diff(moment(lastMenstruationDate), "days") / 7
        this.pregnancyMidWeek = parseInt(date, 10)
      }
    }
    this.pregnancyData[key] = value
  }

  handleProductionChange = (field, name, key, value, index) => {
    const { surgeryDate, cycleType } = JSON.parse(
      localStorage.getItem("followrecord")
    )
    const { productionDetailData } = this.props.follow

    if (name === "earlyUltrasoundPregnancyParams" && key === "date" && !value) {
      productionDetailData[field][name][index]["pregnancyWeeks"] = ""
    }
    if (name === "midUltrasoundPregnancyParams" && key === "date" && !value) {
      productionDetailData[field][name][index]["pregnancyWeeks"] = ""
    }
    if (name === "earlyUltrasoundPregnancyParams" && key === "date" && value) {
      if (freshRecovery.includes(cycleType)) {
        let lastMenstruationDate = moment(surgeryDate).subtract(17, "days")
        const date =
          moment(value).diff(moment(lastMenstruationDate), "days") / 7
        productionDetailData[field][name][index]["pregnancyWeeks"] = parseInt(
          date,
          10
        )
      }
      if (AIH.includes(cycleType)) {
        let lastMenstruationDate = moment(surgeryDate).subtract(14, "days")
        const date = moment().diff(moment(lastMenstruationDate), "days") / 7
        productionDetailData[field][name][index]["pregnancyWeeks"] = parseInt(
          date,
          10
        )
      }
    } else {
      productionDetailData[field][name][index][key] = value
    }

    if (name === "midUltrasoundPregnancyParams" && key === "date" && value) {
      if (freshRecovery.includes(cycleType)) {
        let lastMenstruationDate = moment(surgeryDate).subtract(17, "days")
        const date =
          moment(value).diff(moment(lastMenstruationDate), "days") / 7
        productionDetailData[field][name][index]["pregnancyWeeks"] = parseInt(
          date,
          10
        )
      }
      if (AIH.includes(cycleType)) {
        let lastMenstruationDate = moment(surgeryDate).subtract(14, "days")
        const date = moment().diff(moment(lastMenstruationDate), "days") / 7
        productionDetailData[field][name][index]["pregnancyWeeks"] = parseInt(
          date,
          10
        )
      }
    } else {
      productionDetailData[field][name][index][key] = value
    }

    this.forceUpdate()
  }

  mergeCelldata = (data) => {
    var objs = {},
      k,
      arr1 = []
    for (var i = 0, len = data.length; i < len; i++) {
      k = data[i].batchTag
      if (objs[k]) objs[k]++
      else objs[k] = 1
    }
    for (var o in objs) {
      for (let i = 0; i < objs[o]; i++) {
        if (i === 0) {
          arr1.push(objs[o])
        } else {
          arr1.push(0)
        }
      }
    }
    arr1.forEach((r, index) => {
      data[index]["num"] = r
    })
    return data
  }

  addEarlyPregnancy = () => {
    const { productionDetailData } = this.props.follow
    const earlyPregnancy =
      productionDetailData.earlyPregnancyParam.earlyUltrasoundPregnancyParams
    const batchTagList = earlyPregnancy.map((item) => {
      return item.batchTag
    })
    if (batchTagList.length === 0) {
      this.index = 1
    } else {
      const maxbatchTag = Math.max.apply(
        Math,
        earlyPregnancy.map((item) => {
          return item.batchTag
        })
      )
      this.index = maxbatchTag + 1
    }
    Array.from({
      length: parseInt(this.pregnancyData.fetuses, 10),
    }).forEach(() => {
      productionDetailData.earlyPregnancyParam.earlyUltrasoundPregnancyParams.push(
        { batchTag: this.index }
      )
    })
    this.index++
  }

  addMidPregnancy = () => {
    const { productionDetailData } = this.props.follow
    const midPregnancy =
      productionDetailData.midPregnancyParam.midUltrasoundPregnancyParams
    const batchTagList = midPregnancy.map((item) => {
      return item.batchTag
    })
    if (batchTagList.length === 0) {
      this.midIndex = 1
    } else {
      const maxbatchTag = Math.max.apply(
        Math,
        midPregnancy.map((item) => {
          return item.batchTag
        })
      )
      this.midIndex = maxbatchTag + 1
    }

    Array.from({
      length: parseInt(this.pregnancyData.fetuses, 10),
    }).forEach(() => {
      productionDetailData.midPregnancyParam.midUltrasoundPregnancyParams.push({
        batchTag: this.midIndex,
      })
    })
    this.midIndex++
  }

  addcomplicationDTOs = () => {
    const { detailData } = this.props.follow
    const complicationDTOs = detailData.complicationDTOs
    if (Array.isArray(complicationDTOs)) {
      complicationDTOs.push({ inspectionTime: "", complicationType: [] })
    }
  }

  deletecomplicationDTOs = (index) => {
    const { detailData } = this.props.follow
    const complicationDTOs = detailData.complicationDTOs
    complicationDTOs.splice(index, 1)
  }

  addProductionComplicationDTOs = () => {
    const { productionDetailData } = this.props.follow
    const complicationDTOs = productionDetailData.complicationDTOs
    if (Array.isArray(complicationDTOs)) {
      complicationDTOs.push({ inspectionTime: "", complicationType: [] })
    }
  }

  deleteProductionComplicationDTOs = (index) => {
    const { productionDetailData } = this.props.follow
    const complicationDTOs = productionDetailData.complicationDTOs
    complicationDTOs.splice(index, 1)
  }

  addDisease = () => {
    const { productionDetailData } = this.props.follow
    const antenatalScreeningAmniocentesisParams =
      productionDetailData.antenatalScreeningParam
        .antenatalScreeningAmniocentesisParams
    if (Array.isArray(antenatalScreeningAmniocentesisParams)) {
      antenatalScreeningAmniocentesisParams.push({})
    }
  }

  deleteDisease = (index) => {
    const { productionDetailData } = this.props.follow
    const antenatalScreeningAmniocentesisParams =
      productionDetailData.antenatalScreeningParam
        .antenatalScreeningAmniocentesisParams
    antenatalScreeningAmniocentesisParams.splice(index, 1)
  }

  handleDetailChange = (field, name, key, value, index) => {
    const { surgeryDate } = JSON.parse(localStorage.getItem("followrecord"))
    const { detailData } = this.props.follow
    if (field === "pregnancyTestRecordParam" && key === "date") {
      const date = moment(value).diff(moment(surgeryDate), "days")
      detailData[field][name][index]["afterDays"] = date ? date : ""
    }
    detailData[field][name][index][key] = value
    this.setSurvival()

    this.forceUpdate()
  }

  //分娩情况赋值  newbornConditionColumns
  setSurvival = () => {
    const { detailData, setDetailData } = this.props.follow
    const newbornConditionDTOs =
      detailData.parturitionParam.newbornConditionDTOs
    let tempData = newbornConditionDTOs.slice()
    //deathBirthNumber 死胎数
    let tempDeathBirthNumber = tempData.filter((item) => {
      return item.survival === "死胎"
    }).length
    //liveBirthNumber 活产数
    let tempLiveBirthNumber = tempData.filter((item) => {
      return item.survival === "活产"
    }).length
    //deathProductNumber 死产数
    let tempDeathProductNumber = tempData.filter((item) => {
      return item.survival === "死产"
    }).length

    setDetailData("parturitionParam", "deathBirthNumber", tempDeathBirthNumber)
    setDetailData("parturitionParam", "liveBirthNumber", tempLiveBirthNumber)
    setDetailData(
      "parturitionParam",
      "deathProductNumber",
      tempDeathProductNumber
    )
  }

  setInspectionDay = (value) => {
    const { surgeryDate, cycleType } = JSON.parse(
      localStorage.getItem("followrecord")
    )
    const { setDetailData, detailData } = this.props.follow
    const day = freshRecovery.includes(cycleType) ? 17 : 14
    const lastMenstruationDate = moment(surgeryDate).subtract(day, "days")
    const date = moment(value).diff(moment(lastMenstruationDate), "days")
    detailData.clinicalPeriodParam.gestationDays = date ? date : ""
    this.setWeekDays(
      "clinicalPeriodParam",
      "afterTransplantWeeks",
      "afterTransplantDays",
      value
    )
    setDetailData("clinicalPeriodParam", "inspectionDay", value)
  }

  setWeekDays = (field, week, day, value) => {
    const { surgeryDate } = JSON.parse(localStorage.getItem("followrecord"))
    const { detailData } = this.props.follow
    const transplantWeeks = moment(value).diff(moment(surgeryDate), "weeks")
    const transplantDays = moment(value).diff(moment(surgeryDate), "days")
    if (transplantWeeks > 0) {
      detailData[field][week] = transplantWeeks
      const days = transplantDays - transplantWeeks * 7
      detailData[field][day] = days === 0 ? "" : days
    } else if (transplantWeeks === 0 && transplantDays > 0) {
      detailData[field][week] = ""
      detailData[field][day] = transplantDays
    } else {
      detailData[field][week] = ""
      detailData[field][day] = ""
    }
  }

  handleParturitionChange = (value) => {
    const { setDetailData } = this.props.follow
    this.setWeekDays(
      "parturitionParam",
      "pregnancyWeekNumber",
      "pregnancyDayNumber",
      value
    )
    setDetailData("parturitionParam", "parturitionDate", value)
  }

  handleAbortionChange = (value) => {
    const { setDetailData } = this.props.follow
    this.setWeekDays(
      "abortionParam",
      "pregnancyWeekNumber",
      "pregnancyDayNumber",
      value
    )
    setDetailData("abortionParam", "abortionDate", value)
  }

  deletepColumns = (field, name, index) => {
    const { detailData } = this.props.follow
    //禁止全部删除
    if (detailData[field][name].length === 1) {
      message.warning("操作项不可删除")
    } else {
      detailData[field][name].splice(index, 1)
    }
    this.setSurvival()
    this.forceUpdate()
  }

  handleUltrasoundChange = (field, key, value, index) => {
    const { detailData } = this.props.follow
    detailData[field][index][key] = value
    this.forceUpdate()
  }

  deletepUltrasound = (field, index) => {
    const { detailData } = this.props.follow
    detailData[field].splice(index, 1)
    this.forceUpdate()
  }

  handleComplicationTypeChange = (field, key, value, index) => {
    const { detailData } = this.props.follow
    if (key === "complicationType") {
      detailData[field][index][key] = [...value]
    } else {
      detailData[field][index][key] = value
    }
  }

  handleProductionComplicationTypeChange = (field, key, value, index) => {
    const { productionDetailData } = this.props.follow
    if (key === "complicationType") {
      productionDetailData[field][index][key] = [...value]
    } else {
      productionDetailData[field][index][key] = value
    }
  }

  deleteEarlyPregnancyParam = (batchTag) => {
    const { productionDetailData } = this.props.follow
    const earlyUltrasoundPregnancyParams =
      productionDetailData.earlyPregnancyParam.earlyUltrasoundPregnancyParams
    const early = earlyUltrasoundPregnancyParams.filter(
      (item) => item.batchTag !== batchTag
    )
    productionDetailData.earlyPregnancyParam.earlyUltrasoundPregnancyParams.length = 0
    productionDetailData.earlyPregnancyParam.earlyUltrasoundPregnancyParams = early
  }

  deleteMidPregnancyParam = (batchTag) => {
    const { productionDetailData } = this.props.follow
    const midUltrasoundPregnancyParams =
      productionDetailData.midPregnancyParam.midUltrasoundPregnancyParams
    const mid = midUltrasoundPregnancyParams.filter(
      (item) => item.batchTag !== batchTag
    )
    productionDetailData.midPregnancyParam.midUltrasoundPregnancyParams.length = 0
    productionDetailData.midPregnancyParam.midUltrasoundPregnancyParams = mid
  }

  onChildStageChange = (event, record) => {
    // event.persist()
    this.setbirthData(record)
    this.setState({
      sex: record.sex,
      babyTag: record.babyTag,
      followStage: record.followStage,
    })
  }
  // babyTag不一定是从一1开始的，如果第一个孩子是死产死胎就会存在说babyTag是从2开始的
  setbirthData = (record) => {
    const { afterbirthDetailData } = this.props.follow
    const baby = afterbirthDetailData.filter(
      (item) => item.babyTag === record.babyTag
    )
    if (record.followStage === "一周岁") {
      console.log("一周岁")
      const afterBirthOneParam = baby[0].afterBirthOneParam
      this.setState({
        afterBirthOneData: {
          ...baby[0].afterBirthOneParam,
          ...{ babyTag: record.babyTag },
          ...{
            healthState:
              afterBirthOneParam.healthState === null
                ? "健康"
                : afterBirthOneParam.healthState,
          },
        },
      })
    } else if (record.followStage === "五周岁") {
      const afterBirthFiveParam = baby[0].afterBirthFiveParam
      this.setState({
        afterBirthFiveData: {
          ...baby[0].afterBirthFiveParam,
          ...{ babyTag: record.babyTag },
          ...{
            healthState:
              afterBirthFiveParam.healthState === null
                ? "健康"
                : afterBirthFiveParam.healthState,
          },
          ...{
            wearSchoolUniform:
              afterBirthFiveParam.wearSchoolUniform === null
                ? 1
                : afterBirthFiveParam.wearSchoolUniform,
          },
          ...{
            mimicry:
              afterBirthFiveParam.mimicry === null
                ? 1
                : afterBirthFiveParam.mimicry,
          },
          ...{
            sayThreeAntonyms:
              afterBirthFiveParam.sayThreeAntonyms === null
                ? 1
                : afterBirthFiveParam.sayThreeAntonyms,
          },
        },
      })
    } else if (record.followStage === "十周岁") {
      const afterBirthTenParam = baby[0].afterBirthTenParam
      this.setState({
        tenBirthTenData: {
          ...baby[0].afterBirthTenParam,
          ...{ babyTag: record.babyTag },
          ...{
            healthState:
              afterBirthTenParam.healthState === null
                ? "健康"
                : afterBirthTenParam.healthState,
          },
          ...{
            ejaculationOccurs:
              afterBirthTenParam.ejaculationOccurs === null
                ? 1
                : afterBirthTenParam.ejaculationOccurs,
          },
        },
      })
    } else if (record.followStage === "十五周岁") {
      if (record.sex === 0) {
        const fifteenMaleParam = baby[0].fifteenMaleParam
        this.setState({
          fifteenData: {
            ...baby[0].fifteenMaleParam,
            ...{ babyTag: record.babyTag },
            ...{
              healthState:
                fifteenMaleParam.healthState === null
                  ? "健康"
                  : fifteenMaleParam.healthState,
            },
            ...{
              laryngeal:
                fifteenMaleParam.laryngeal === null
                  ? "是"
                  : fifteenMaleParam.laryngeal,
            },
            ...{
              changeVoice:
                fifteenMaleParam.changeVoice === null
                  ? "是"
                  : fifteenMaleParam.changeVoice,
            },
            ...{
              beard:
                fifteenMaleParam.beard === null ? "是" : fifteenMaleParam.beard,
            },
            ...{
              pubicHair:
                fifteenMaleParam.pubicHair === null
                  ? "是"
                  : fifteenMaleParam.pubicHair,
            },
            ...{
              armpitHair:
                fifteenMaleParam.armpitHair === null
                  ? "是"
                  : fifteenMaleParam.armpitHair,
            },
          },
        })
      } else {
        const fifteenFemaleParam = baby[0].fifteenFemaleParam
        this.setState({
          fifteenData: {
            ...baby[0].fifteenFemaleParam,
            ...{ babyTag: record.babyTag },
            ...{
              healthState:
                fifteenFemaleParam.healthState === null
                  ? "健康"
                  : fifteenFemaleParam.healthState,
            },
            ...{
              menstruation:
                fifteenFemaleParam.menstruation === null
                  ? "月经规律"
                  : fifteenFemaleParam.menstruation,
            },
            ...{
              menstrualVolume:
                fifteenFemaleParam.menstrualVolume === null
                  ? "正常"
                  : fifteenFemaleParam.menstrualVolume,
            },
          },
        })
      }
    } else if (record.followStage === "二十周岁") {
      const femaleData = baby[0].twentyFemaleParam
      const maleData = baby[0].twentyMaleParam
      if (record.sex === 0) {
        this.setState({
          twentyData: {
            ...maleData,
            ...{ babyTag: record.babyTag },
            ...{
              healthState:
                maleData.healthState === null ? "健康" : maleData.healthState,
            },
          },
        })
      } else {
        if (femaleData.twentyFemaleEndocrineHormoneParams === null) {
          femaleData.twentyFemaleEndocrineHormoneParams = []
          femaleData.twentyFemaleEndocrineHormoneParams.push({})
        }
        this.setState({
          twentyData: {
            ...femaleData,
            ...{ babyTag: record.babyTag },
            ...{
              healthState:
                femaleData.healthState === null
                  ? "健康"
                  : femaleData.healthState,
            },
          },
        })
      }
    }
  }

  updateBirthData = (field, key, value) => {
    let data = Object.assign({}, this.state[field], {
      [key]: value,
    })
    this.setState({
      [field]: data,
    })
  }

  onabnormalChange = (field, name, checkedValues) => {
    const abnormalData = [...this.state[field].afterBirthExceptionDTOS]
    const checks = [...checkedValues]
    const abnormal = checks.map((item, index) => {
      return {
        exceptionalProjectName: item,
        explain: abnormalData[index] ? abnormalData[index].explain : "",
      }
    })
    this.setState({
      [field]: { ...this.state[field], ...{ [name]: abnormal } },
    })
  }

  updateAbnormalData = (field, key, value, index) => {
    const abnormalData = [...this.state[field].afterBirthExceptionDTOS]
    this.setState({
      [field]: {
        ...this.state[field],
        ...{
          afterBirthExceptionDTOS: abnormalData.map((item, i) =>
            i === index ? { ...item, explain: value } : item
          ),
        },
      },
    })
  }

  setRowClassName = (record) => {
    return record.babyTag === this.state.babyTag &&
      record.followStage === this.state.followStage
      ? "rowStyle"
      : ""
  }

  saveBirthOne = () => {
    const { saveBirthOne } = this.props.follow
    const obj = {
      afterBirthOneParam: this.state.afterBirthOneData,
    }
    saveBirthOne(obj)
  }

  saveBirthFive = () => {
    const { saveBirthFive } = this.props.follow
    const obj = {
      afterBirthFiveParam: this.state.afterBirthFiveData,
    }
    saveBirthFive(obj)
  }

  saveBirthTen = () => {
    const { saveBirthTen } = this.props.follow
    const obj = {
      afterBirthTenParam: this.state.tenBirthTenData,
    }
    saveBirthTen(obj)
  }
  saveFifteen = () => {
    const { saveFifteenMale, saveFifteenFemale } = this.props.follow
    const { sex } = this.state
    const obj =
      sex === 0
        ? { fifteenMaleParam: this.state.fifteenData }
        : { fifteenFemaleParam: this.state.fifteenData }
    sex === 0 ? saveFifteenMale(obj) : saveFifteenFemale(obj)
  }

  saveTwenty = () => {
    const { saveTWentyMale, saveTWentyFemale } = this.props.follow
    const { sex } = this.state
    if (sex === 1) {
      const data = { ...this.state.twentyData }
      this.filterEmptyData(data)
      const obj = { twentyFemaleParam: data }
      saveTWentyFemale(obj)
    } else {
      const obj = { twentyMaleParam: this.state.twentyData }
      saveTWentyMale(obj)
    }
  }

  filterEmptyData = (data) => {
    const { twentyFemaleEndocrineHormoneParams } = data
    const endocrineHormone = twentyFemaleEndocrineHormoneParams.filter((v) => {
      return (
        Object.values(v)
          .filter((item) => item !== "")
          .filter((d) => d !== null).length !== 0
      )
    })
    data.twentyFemaleEndocrineHormoneParams = endocrineHormone
  }

  onBlur = (record, index) => {
    const { detailData } = this.props.follow
    const detailDataLeng =
      detailData.pregnancyTestRecordParam.followUpBloodHormoneParams.length
    const lastData =
      detailData.pregnancyTestRecordParam.followUpBloodHormoneParams[
        detailDataLeng - 1
      ]
    const notEmpty = Object.values(lastData)
      .filter((item) => item !== "")
      .filter((d) => d !== null)
      .toString()
    const obj = {
      date: "",
      afterDays: "",
      hcg: "",
      p: "",
      e2: "",
      editTag: 1,
    }
    if (notEmpty !== "1") {
      detailData.pregnancyTestRecordParam.followUpBloodHormoneParams.push(obj)
    }
  }

  onUltrasoundBlur = (record, index) => {
    const { detailData } = this.props.follow
    const detailDataLeng = detailData.ultrasoundChartPregnancyParams.length
    const lastData =
      detailData.ultrasoundChartPregnancyParams[detailDataLeng - 1]
    const notEmpty = Object.values(lastData)
      .filter((item) => item !== "")
      .filter((d) => d !== null)
    const obj = {
      date: "",
      gestationalSacsNumber: "",
      monozygoticTwin: "",
      germ: "",
      fetalHeartCount: null,
      heartBudPulsation: "",
      gestationalSacSize: "",
    }
    if (notEmpty.length !== 0) {
      detailData.ultrasoundChartPregnancyParams.push(obj)
    }
  }
  onNewBornBlur = (record, index) => {
    const { detailData } = this.props.follow
    const detailDataLeng =
      detailData.parturitionParam.newbornConditionDTOs.length
    const lastData =
      detailData.parturitionParam.newbornConditionDTOs[detailDataLeng - 1]
    const notEmpty = Object.values(lastData)
      .filter((item) => item !== "")
      .filter((d) => d !== null)
    const obj = {
      survival: "",
      sex: null,
      apgarScore: "",
      weight: "",
      height: "",
      healthStatus: "",
      birthDefect: "",
      elseDescription: "",
    }
    if (notEmpty.length !== 0) {
      detailData.parturitionParam.newbornConditionDTOs.push(obj)
    }
  }

  onBloodHormonesBlur = (record, index) => {
    const endocrineHormone = [
      ...this.state.twentyData.twentyFemaleEndocrineHormoneParams,
    ]
    const detailDataLeng = endocrineHormone.length
    const lastData = endocrineHormone[detailDataLeng - 1]
    const notEmpty = Object.values(lastData)
      .filter((item) => item !== "")
      .filter((d) => d !== null)
    const obj = {
      date: "",
      e2: "",
      lh: "",
      fsh: "",
      p: "",
      amh: "",
      t: "",
    }
    if (notEmpty.length !== 0) {
      endocrineHormone.push(obj)
    }
    this.setState({
      twentyData: {
        ...this.state.twentyData,
        ...{ twentyFemaleEndocrineHormoneParams: endocrineHormone },
      },
    })
  }

  setCurTabpane = (key) => {
    const { detailData } = this.props.follow
    this.curTabpane = key
    if (key === "productionSieve") {
      this.setPregnancyData(
        "fetuses",
        detailData.clinicalPeriodParam.fetalHeartNumber
      )
      this.setPregnancyData(
        "midFetuses",
        detailData.clinicalPeriodParam.fetalHeartNumber
      )
    }
  }

  updateBloodHormonesData = (field, key, value, index) => {
    const bloodData = [...this.state[field].twentyFemaleEndocrineHormoneParams]
    this.setState({
      [field]: {
        ...this.state[field],
        ...{
          twentyFemaleEndocrineHormoneParams: bloodData.map((item, i) =>
            i === index ? { ...item, [key]: value } : item
          ),
        },
      },
    })
  }

  deleteBloodHormonesData = (field, index) => {
    const bloodData = [...this.state[field].twentyFemaleEndocrineHormoneParams]
    bloodData.splice(index, 1)
    this.setState({
      [field]: {
        ...this.state[field],
        ...{
          twentyFemaleEndocrineHormoneParams: bloodData,
        },
      },
    })
  }

  renderbirth = () => {
    const { renderOptions, optionsAfterbirth } = this.props.follow
    const {
      followStage,
      afterBirthOneData,
      afterBirthFiveData,
      tenBirthTenData,
      fifteenData,
      twentyData,
    } = this.state
    const abnormalOption = [
      { label: "发育", value: "发育" },
      { label: "智力", value: "智力" },
      { label: "活动", value: "活动" },
      { label: "视力", value: "视力" },
      { label: "听力", value: "听力" },
      { label: "贫血", value: "贫血" },
      { label: "佝偻病", value: "佝偻病" },
      { label: "畸形", value: "畸形" },
      { label: "其他疾病", value: "其他疾病" },
    ]
    const bloodHormonesColumns = [
      {
        title: "日期",
        width: "20%",
        dataIndex: "date",
        render: (text, record, index) => {
          return (
            <BaseDatepicker
              height={26}
              value={record.date ? moment(record.date) : ""}
              onBlur={() => this.onBloodHormonesBlur(record, index)}
              onChange={(date, dateString) =>
                this.updateBloodHormonesData(
                  "twentyData",
                  "date",
                  dateString,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "E2(pmol/L)",
        dataIndex: "e2",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.e2}
              onBlur={() => this.onBloodHormonesBlur(record, index)}
              onChange={(e) =>
                this.updateBloodHormonesData(
                  "twentyData",
                  "e2",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "LH(IU/L)",
        dataIndex: "lh",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.lh}
              onBlur={() => this.onBloodHormonesBlur(record, index)}
              onChange={(e) =>
                this.updateBloodHormonesData(
                  "twentyData",
                  "lh",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "FSH(IU/L)",
        dataIndex: "fsh",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.fsh}
              onBlur={() => this.onBloodHormonesBlur(record, index)}
              onChange={(e) =>
                this.updateBloodHormonesData(
                  "twentyData",
                  "fsh",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "P(ng/ml)",
        dataIndex: "p",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.p}
              onBlur={() => this.onBloodHormonesBlur(record, index)}
              onChange={(e) =>
                this.updateBloodHormonesData(
                  "twentyData",
                  "p",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "AMH(ng/ml)",
        dataIndex: "amh",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.amh}
              onBlur={() => this.onBloodHormonesBlur(record, index)}
              onChange={(e) =>
                this.updateBloodHormonesData(
                  "twentyData",
                  "amh",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "T(nmol/L)",
        dataIndex: "t",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.t}
              onBlur={() => this.onBloodHormonesBlur(record, index)}
              onChange={(e) =>
                this.updateBloodHormonesData(
                  "twentyData",
                  "t",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "",
        dataIndex: "opera",
        render: (text, record, index) => {
          return (
            <DashBtn>
              <MinusOutlined
                onClick={() =>
                  this.deleteBloodHormonesData("twentyData", index)
                }
              />
            </DashBtn>
          )
        },
      },
    ]
    switch (followStage) {
      case "一周岁":
        return (
          <>
            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">一周岁</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>基础检查</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>健康状况</BaseLabel>
                  <BaseSelect
                    width={120}
                    height={26}
                    value={afterBirthOneData.healthState}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "healthState",
                        e
                      )
                    }
                  >
                    {renderOptions(optionsAfterbirth, "103")}
                  </BaseSelect>
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>身长</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={afterBirthOneData.height}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "height",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                  <BaseLabel width={70}>体重</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={afterBirthOneData.weight}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "weight",
                        e.target.value
                      )
                    }
                  />
                  <div>kg</div>
                  <BaseLabel width={70}>头围</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={afterBirthOneData.headCircumference}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "headCircumference",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                  <BaseLabel width={70}>坐高</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={afterBirthOneData.sitHigh}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "sitHigh",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                </BaseFormItem>
              </DetailContent>
              <BorderDash />
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>发育情况</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>前囟闭合</BaseLabel>
                  <Switch
                    checked={afterBirthOneData.fontanelClosure}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "fontanelClosure",
                        +e
                      )
                    }
                  />

                  {afterBirthOneData.fontanelClosure === 1 && (
                    <>
                      <BaseLabel width={70}>闭合</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 80, marginRight: 12 }}
                        value={afterBirthOneData.fontanelClosureMonth}
                        onChange={(e) =>
                          this.updateBirthData(
                            "afterBirthOneData",
                            "fontanelClosureMonth",
                            e
                          )
                        }
                      />
                      <div>月</div>
                    </>
                  )}
                  {(afterBirthOneData.fontanelClosure === 0 ||
                    afterBirthOneData.fontanelClosure === undefined ||
                    afterBirthOneData.fontanelClosure === null) && (
                    <>
                      <BaseLabel width={70}>大小</BaseLabel>
                      <FontInput
                        style={{ width: 80, marginRight: 12 }}
                        value={afterBirthOneData.fontanelClosureSize}
                        onChange={(e) =>
                          this.updateBirthData(
                            "afterBirthOneData",
                            "fontanelClosureSize",
                            e.target.value
                          )
                        }
                      />
                      <div>cm</div>
                    </>
                  )}

                  <BaseLabel width={90}>后囟闭合</BaseLabel>
                  <Switch
                    checked={afterBirthOneData.breechClosure}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "breechClosure",
                        +e
                      )
                    }
                  />
                  {afterBirthOneData.breechClosure === 1 && (
                    <>
                      <BaseLabel width={70}>闭合</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 80, marginRight: 12 }}
                        value={afterBirthOneData.breechClosureMonth}
                        onChange={(e) =>
                          this.updateBirthData(
                            "afterBirthOneData",
                            "breechClosureMonth",
                            e
                          )
                        }
                      />
                      <div>月</div>
                    </>
                  )}
                  {(afterBirthOneData.breechClosure === 0 ||
                    afterBirthOneData.breechClosure === undefined ||
                    afterBirthOneData.breechClosure === null) && (
                    <>
                      <BaseLabel width={70}>大小</BaseLabel>
                      <FontInput
                        style={{ width: 80, marginRight: 12 }}
                        value={afterBirthOneData.breechClosureSize}
                        onChange={(e) =>
                          this.updateBirthData(
                            "afterBirthOneData",
                            "breechClosureSize",
                            e.target.value
                          )
                        }
                      />
                      <div>cm</div>
                    </>
                  )}
                </BaseFormItem>

                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>出生后</BaseLabel>
                  <BaseInputNumber
                    min={0}
                    style={{ width: 90, marginRight: 12 }}
                    value={afterBirthOneData.teething}
                    onChange={(e) =>
                      this.updateBirthData("afterBirthOneData", "teething", e)
                    }
                  />
                  <div>月出牙</div>
                  <BaseInputNumber
                    min={0}
                    style={{ width: 90, margin: "0 12px" }}
                    value={afterBirthOneData.learnToWalk}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "learnToWalk",
                        e
                      )
                    }
                  />
                  <div>月学会走路</div>
                  <BaseInputNumber
                    min={0}
                    style={{ width: 90, margin: "0 12px" }}
                    value={afterBirthOneData.speakSimpleWords}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "speakSimpleWords",
                        e
                      )
                    }
                  />
                  <div>月会说简单的词</div>
                </BaseFormItem>
              </DetailContent>
              <BorderDash />
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>喂养情况</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>母乳喂养</BaseLabel>
                  <Switch
                    checked={afterBirthOneData.breastFeeding}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "breastFeeding",
                        +e
                      )
                    }
                  />
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>喂养时长</BaseLabel>
                  <BaseInputNumber
                    min={0}
                    style={{ width: 90, marginRight: 12 }}
                    value={afterBirthOneData.feedingTime}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "feedingTime",
                        e
                      )
                    }
                  />
                  <div>月</div>
                  <div style={{ marginLeft: 24 }}>出生后</div>
                  <BaseInputNumber
                    min={0}
                    style={{ width: 90, margin: "0 12px" }}
                    value={afterBirthOneData.weaningTime}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "weaningTime",
                        e
                      )
                    }
                  />
                  <div>月断奶</div>
                  <div style={{ marginLeft: 24 }}>出生后</div>
                  <BaseInputNumber
                    min={0}
                    style={{ width: 90, margin: "0 12px" }}
                    value={afterBirthOneData.complementaryFoods}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "complementaryFoods",
                        e
                      )
                    }
                  />
                  <div>月添加辅食</div>
                  <div style={{ marginLeft: 24 }}>产妇分娩后第</div>
                  <BaseInputNumber
                    min={0}
                    style={{ width: 90, margin: "0 12px" }}
                    value={afterBirthOneData.motherMenstrualCycle}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthOneData",
                        "motherMenstrualCycle",
                        e
                      )
                    }
                  />
                  <div>月来月经</div>
                </BaseFormItem>
              </DetailContent>

              <BorderDash />
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>异常项目</div>
              </BaseFormItem>
              <DetailContent>
                <Checkbox.Group
                  options={abnormalOption}
                  onChange={(checkedValues) =>
                    this.onabnormalChange(
                      "afterBirthOneData",
                      "afterBirthExceptionDTOS",
                      checkedValues
                    )
                  }
                  value={(afterBirthOneData.afterBirthExceptionDTOS || []).map(
                    (item) => item.exceptionalProjectName
                  )}
                />
                <AbnormalTop type="flex" align="middle">
                  <div style={{ width: 120, textAlign: "center" }}>
                    异常项目
                  </div>
                  <div>说明</div>
                </AbnormalTop>
                {(afterBirthOneData.afterBirthExceptionDTOS || []).map(
                  (abnormal, index) => (
                    <Row
                      key={index}
                      type="flex"
                      align="middle"
                      style={{
                        padding: "4px 0",
                        borderBottom: "1px solid #F6F6F6",
                      }}
                    >
                      <div style={{ width: 120, textAlign: "center" }}>
                        {abnormal.exceptionalProjectName}
                      </div>
                      <FontInput
                        style={{ width: 600 }}
                        value={abnormal.explain}
                        onChange={(e) =>
                          this.updateAbnormalData(
                            "afterBirthOneData",
                            "explain",
                            e.target.value,
                            index
                          )
                        }
                      />
                    </Row>
                  )
                )}
              </DetailContent>
            </DetailContent>
            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">随访</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <BaseLabel width={70}>随访日</BaseLabel>
                <BaseDatepicker
                  height={26}
                  value={
                    afterBirthOneData.followDate
                      ? moment(afterBirthOneData.followDate)
                      : ""
                  }
                  onChange={(date, dateString) =>
                    this.updateBirthData(
                      "afterBirthOneData",
                      "followDate",
                      dateString
                    )
                  }
                />
                <BaseLabel width={70}>随访人</BaseLabel>
                <BaseSelect
                  width={120}
                  height={26}
                  value={afterBirthOneData.followPerson}
                  onChange={(e) =>
                    this.updateBirthData("afterBirthOneData", "followPerson", e)
                  }
                >
                  {renderOptions(optionsAfterbirth, "198")}
                </BaseSelect>
              </BaseFormItem>
            </DetailContent>
            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">复核</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <BaseLabel width={70}>复核日</BaseLabel>
                <BaseDatepicker
                  height={26}
                  value={
                    afterBirthOneData.reviewDate
                      ? moment(afterBirthOneData.reviewDate)
                      : ""
                  }
                  onChange={(date, dateString) =>
                    this.updateBirthData(
                      "afterBirthOneData",
                      "reviewDate",
                      dateString
                    )
                  }
                />
                <BaseLabel width={70}>核对人</BaseLabel>
                <BaseSelect
                  width={120}
                  height={26}
                  value={afterBirthOneData.reviewPerson}
                  onChange={(e) =>
                    this.updateBirthData("afterBirthOneData", "reviewPerson", e)
                  }
                >
                  {renderOptions(optionsAfterbirth, "198")}
                </BaseSelect>
              </BaseFormItem>
              <BaseFormItem
                type="flex"
                align="middle"
                justify="center"
                style={{ paddingBottom: 30 }}
              >
                <Button type="primary" onClick={() => this.saveBirthOne()}>
                  保存
                </Button>
              </BaseFormItem>
            </DetailContent>
          </>
        )
      case "五周岁":
        return (
          <>
            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">五周岁</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>基础检查</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>健康状况</BaseLabel>
                  <BaseSelect
                    width={120}
                    height={26}
                    value={afterBirthFiveData.healthState}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthFiveData",
                        "healthState",
                        e
                      )
                    }
                  >
                    {renderOptions(optionsAfterbirth, "103")}
                  </BaseSelect>
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>身长</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={afterBirthFiveData.height}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthFiveData",
                        "height",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                  <BaseLabel width={70}>体重</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={afterBirthFiveData.weight}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthFiveData",
                        "weight",
                        e.target.value
                      )
                    }
                  />
                  <div>kg</div>
                  <BaseLabel width={70}>头围</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={afterBirthFiveData.headCircumference}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthFiveData",
                        "headCircumference",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                  <BaseLabel width={70}>坐高</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={afterBirthFiveData.sitHigh}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthFiveData",
                        "sitHigh",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                  <BaseLabel width={70}>胸围</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={afterBirthFiveData.bust}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthFiveData",
                        "bust",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                  <BaseLabel width={70}>牙齿</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={afterBirthFiveData.tooth}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthFiveData",
                        "tooth",
                        e.target.value
                      )
                    }
                  />
                  <div>个</div>
                </BaseFormItem>
              </DetailContent>

              <BorderDash />
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>异常项目</div>
              </BaseFormItem>
              <DetailContent>
                <Checkbox.Group
                  options={abnormalOption}
                  onChange={(checkedValues) =>
                    this.onabnormalChange(
                      "afterBirthFiveData",
                      "afterBirthExceptionDTOS",
                      checkedValues
                    )
                  }
                  value={(afterBirthFiveData.afterBirthExceptionDTOS || []).map(
                    (item) => item.exceptionalProjectName
                  )}
                />
                <AbnormalTop type="flex" align="middle">
                  <div style={{ width: 120, textAlign: "center" }}>
                    异常项目
                  </div>
                  <div>说明</div>
                </AbnormalTop>
                {(afterBirthFiveData.afterBirthExceptionDTOS || []).map(
                  (abnormal, index) => (
                    <Row
                      key={index}
                      type="flex"
                      align="middle"
                      style={{
                        padding: "4px 0",
                        borderBottom: "1px solid #F6F6F6",
                      }}
                    >
                      <div style={{ width: 120, textAlign: "center" }}>
                        {abnormal.exceptionalProjectName}
                      </div>
                      <FontInput
                        style={{ width: 600 }}
                        value={abnormal.explain}
                        onChange={(e) =>
                          this.updateAbnormalData(
                            "afterBirthFiveData",
                            "explain",
                            e.target.value,
                            index
                          )
                        }
                      />
                    </Row>
                  )
                )}
              </DetailContent>
              <BorderDash />
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>能力基本情况</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>社交</BaseLabel>
                  <BaseSelect
                    width={120}
                    height={26}
                    value={afterBirthFiveData.socialize}
                    onChange={(e) =>
                      this.updateBirthData("afterBirthFiveData", "socialize", e)
                    }
                  >
                    {renderOptions(optionsAfterbirth, "240")}
                  </BaseSelect>
                  <BaseLabel width={70}>打架</BaseLabel>
                  <BaseSelect
                    width={120}
                    height={26}
                    value={afterBirthFiveData.scuffle}
                    onChange={(e) =>
                      this.updateBirthData("afterBirthFiveData", "scuffle", e)
                    }
                  >
                    {renderOptions(optionsAfterbirth, "22")}
                  </BaseSelect>
                  <BaseLabel width={110}>自己穿校服</BaseLabel>
                  <Switch
                    checked={afterBirthFiveData.wearSchoolUniform}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthFiveData",
                        "wearSchoolUniform",
                        +e
                      )
                    }
                  />
                  <BaseLabel width={100}>模仿画面</BaseLabel>
                  <Switch
                    checked={afterBirthFiveData.mimicry}
                    onChange={(e) =>
                      this.updateBirthData("afterBirthFiveData", "mimicry", +e)
                    }
                  />
                  <BaseLabel width={140}>说出三组反义词</BaseLabel>
                  <Switch
                    checked={afterBirthFiveData.sayThreeAntonyms}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthFiveData",
                        "sayThreeAntonyms",
                        +e
                      )
                    }
                  />
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={140}>神经心理发育评价</BaseLabel>
                  <FontInput
                    style={{ width: 600 }}
                    value={afterBirthFiveData.neuropsychologicalDevelopmental}
                    onChange={(e) =>
                      this.updateBirthData(
                        "afterBirthFiveData",
                        "neuropsychologicalDevelopmental",
                        e.target.value
                      )
                    }
                  />
                </BaseFormItem>
              </DetailContent>
            </DetailContent>

            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">随访</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <BaseLabel width={70}>随访日</BaseLabel>
                <BaseDatepicker
                  height={26}
                  value={
                    afterBirthFiveData.followDate
                      ? moment(afterBirthFiveData.followDate)
                      : ""
                  }
                  onChange={(date, dateString) =>
                    this.updateBirthData(
                      "afterBirthFiveData",
                      "followDate",
                      dateString
                    )
                  }
                />
                <BaseLabel width={70}>随访人</BaseLabel>
                <BaseSelect
                  width={120}
                  height={26}
                  value={afterBirthFiveData.followPerson}
                  onChange={(e) =>
                    this.updateBirthData(
                      "afterBirthFiveData",
                      "followPerson",
                      e
                    )
                  }
                >
                  {renderOptions(optionsAfterbirth, "198")}
                </BaseSelect>
              </BaseFormItem>
            </DetailContent>
            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">复核</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <BaseLabel width={70}>复核日</BaseLabel>
                <BaseDatepicker
                  height={26}
                  value={
                    afterBirthFiveData.reviewDate
                      ? moment(afterBirthFiveData.reviewDate)
                      : ""
                  }
                  onChange={(date, dateString) =>
                    this.updateBirthData(
                      "afterBirthFiveData",
                      "reviewDate",
                      dateString
                    )
                  }
                />
                <BaseLabel width={70}>核对人</BaseLabel>
                <BaseSelect
                  width={120}
                  height={26}
                  value={afterBirthFiveData.reviewPerson}
                  onChange={(e) =>
                    this.updateBirthData(
                      "afterBirthFiveData",
                      "reviewPerson",
                      e
                    )
                  }
                >
                  {renderOptions(optionsAfterbirth, "198")}
                </BaseSelect>
              </BaseFormItem>
              <BaseFormItem
                type="flex"
                align="middle"
                justify="center"
                style={{ paddingBottom: 30 }}
              >
                <Button type="primary" onClick={() => this.saveBirthFive()}>
                  保存
                </Button>
              </BaseFormItem>
            </DetailContent>
          </>
        )
      case "十周岁":
        return (
          <>
            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">十周岁</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>基础检查</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>健康状况</BaseLabel>
                  <BaseSelect
                    width={120}
                    height={26}
                    value={tenBirthTenData.healthState}
                    onChange={(e) =>
                      this.updateBirthData("tenBirthTenData", "healthState", e)
                    }
                  >
                    {renderOptions(optionsAfterbirth, "103")}
                  </BaseSelect>
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>身长</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={tenBirthTenData.height}
                    onChange={(e) =>
                      this.updateBirthData(
                        "tenBirthTenData",
                        "height",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                  <BaseLabel width={70}>体重</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={tenBirthTenData.weight}
                    onChange={(e) =>
                      this.updateBirthData(
                        "tenBirthTenData",
                        "weight",
                        e.target.value
                      )
                    }
                  />
                  <div>kg</div>
                  <BaseLabel width={70}>头围</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={tenBirthTenData.headCircumference}
                    onChange={(e) =>
                      this.updateBirthData(
                        "tenBirthTenData",
                        "headCircumference",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                  <BaseLabel width={70}>胸围</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={tenBirthTenData.sitHigh}
                    onChange={(e) =>
                      this.updateBirthData(
                        "tenBirthTenData",
                        "sitHigh",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                </BaseFormItem>
              </DetailContent>

              <BorderDash />
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>发育情况</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>换牙</BaseLabel>
                  <Switch
                    checked={tenBirthTenData.growTeeth}
                    onChange={(e) =>
                      this.updateBirthData("tenBirthTenData", "growTeeth", +e)
                    }
                  />
                  {tenBirthTenData.growTeeth === 1 && (
                    <>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 80, margin: "0 12px 0 24px" }}
                        value={tenBirthTenData.growTeethAge}
                        onChange={(e) =>
                          this.updateBirthData(
                            "tenBirthTenData",
                            "growTeethAge",
                            e
                          )
                        }
                      />
                      <div>岁换牙</div>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 80, margin: "0 12px 0 24px" }}
                        value={tenBirthTenData.adultTooth}
                        onChange={(e) =>
                          this.updateBirthData(
                            "tenBirthTenData",
                            "adultTooth",
                            e
                          )
                        }
                      />
                      <div>颗恒牙</div>
                    </>
                  )}
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>发育异常</BaseLabel>
                  <Switch
                    checked={tenBirthTenData.developmentalAbnormality}
                    onChange={(e) =>
                      this.updateBirthData(
                        "tenBirthTenData",
                        "developmentalAbnormality",
                        +e
                      )
                    }
                  />
                  {tenBirthTenData.developmentalAbnormality === 1 && (
                    <FontInput
                      style={{ width: 600, marginLeft: 24 }}
                      value={tenBirthTenData.developmentalAbnormalityDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "tenBirthTenData",
                          "developmentalAbnormalityDetail",
                          e.target.value
                        )
                      }
                    />
                  )}
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>疾病发生</BaseLabel>
                  <Switch
                    checked={tenBirthTenData.diseaseOccurrence}
                    onChange={(e) =>
                      this.updateBirthData(
                        "tenBirthTenData",
                        "diseaseOccurrence",
                        +e
                      )
                    }
                  />
                  {tenBirthTenData.diseaseOccurrence === 1 && (
                    <FontInput
                      style={{ width: 600, marginLeft: 24 }}
                      value={tenBirthTenData.diseaseOccurrenceDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "tenBirthTenData",
                          "diseaseOccurrenceDetail",
                          e.target.value
                        )
                      }
                    />
                  )}
                </BaseFormItem>
                {this.state.sex === 0 ? (
                  <BaseFormItem type="flex" align="middle">
                    <BaseLabel width={70}>遗精出现</BaseLabel>
                    <Switch
                      checked={tenBirthTenData.ejaculationOccurs}
                      onChange={(e) =>
                        this.updateBirthData(
                          "tenBirthTenData",
                          "ejaculationOccurs",
                          +e
                        )
                      }
                    />
                    {tenBirthTenData.ejaculationOccurs === 1 && (
                      <>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, margin: "0 12px 0 24px" }}
                          value={tenBirthTenData.ejaculationOccursAge}
                          onChange={(e) =>
                            this.updateBirthData(
                              "tenBirthTenData",
                              "ejaculationOccursAge",
                              e
                            )
                          }
                        />
                        <div>岁</div>
                      </>
                    )}
                  </BaseFormItem>
                ) : (
                  <BaseFormItem type="flex" align="middle">
                    <BaseLabel width={70}>月经初潮</BaseLabel>
                    <Switch
                      checked={tenBirthTenData.menstruation}
                      onChange={(e) =>
                        this.updateBirthData(
                          "tenBirthTenData",
                          "menstruation",
                          +e
                        )
                      }
                    />
                    {tenBirthTenData.menstruation === 1 && (
                      <>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, margin: "0 12px 0 24px" }}
                          value={tenBirthTenData.menstruationAge}
                          onChange={(e) =>
                            this.updateBirthData(
                              "tenBirthTenData",
                              "menstruationAge",
                              e
                            )
                          }
                        />
                        <div>岁</div>
                      </>
                    )}
                  </BaseFormItem>
                )}
              </DetailContent>
              <BorderDash />
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>能力基本情况</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>学习成绩</BaseLabel>
                  <BaseSelect
                    width={120}
                    height={26}
                    value={tenBirthTenData.academicPerformance}
                    onChange={(e) =>
                      this.updateBirthData(
                        "tenBirthTenData",
                        "academicPerformance",
                        e
                      )
                    }
                  >
                    {renderOptions(optionsAfterbirth, "241")}
                  </BaseSelect>
                  <BaseLabel width={90}>体育锻炼</BaseLabel>
                  <BaseSelect
                    width={120}
                    height={26}
                    value={tenBirthTenData.physicalExercise}
                    onChange={(e) =>
                      this.updateBirthData(
                        "tenBirthTenData",
                        "physicalExercise",
                        e
                      )
                    }
                  >
                    {renderOptions(optionsAfterbirth, "22")}
                  </BaseSelect>
                  <BaseLabel width={100}>与同学关系</BaseLabel>
                  <BaseSelect
                    width={120}
                    height={26}
                    value={tenBirthTenData.relationsWithClassmates}
                    onChange={(e) =>
                      this.updateBirthData(
                        "tenBirthTenData",
                        "relationsWithClassmates",
                        e
                      )
                    }
                  >
                    {renderOptions(optionsAfterbirth, "242")}
                  </BaseSelect>
                  <BaseLabel width={235}>
                    忧郁或绝望(≥2w）影响正常生活
                  </BaseLabel>
                  <Switch
                    checked={tenBirthTenData.depressionDespair}
                    onChange={(e) =>
                      this.updateBirthData(
                        "tenBirthTenData",
                        "depressionDespair",
                        +e
                      )
                    }
                  />
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>说明</BaseLabel>
                  <FontInput
                    style={{ width: 600 }}
                    value={tenBirthTenData.note}
                    onChange={(e) =>
                      this.updateBirthData(
                        "tenBirthTenData",
                        "note",
                        e.target.value
                      )
                    }
                  />
                </BaseFormItem>
              </DetailContent>
            </DetailContent>

            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">随访</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <BaseLabel width={70}>随访日</BaseLabel>
                <BaseDatepicker
                  height={26}
                  value={
                    tenBirthTenData.followDate
                      ? moment(tenBirthTenData.followDate)
                      : ""
                  }
                  onChange={(date, dateString) =>
                    this.updateBirthData(
                      "tenBirthTenData",
                      "followDate",
                      dateString
                    )
                  }
                />
                <BaseLabel width={70}>随访人</BaseLabel>
                <BaseSelect
                  width={120}
                  height={26}
                  value={tenBirthTenData.followPerson}
                  onChange={(e) =>
                    this.updateBirthData("tenBirthTenData", "followPerson", e)
                  }
                >
                  {renderOptions(optionsAfterbirth, "198")}
                </BaseSelect>
              </BaseFormItem>
            </DetailContent>
            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">复核</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <BaseLabel width={70}>复核日</BaseLabel>
                <BaseDatepicker
                  height={26}
                  value={
                    tenBirthTenData.reviewDate
                      ? moment(tenBirthTenData.reviewDate)
                      : ""
                  }
                  onChange={(date, dateString) =>
                    this.updateBirthData(
                      "tenBirthTenData",
                      "reviewDate",
                      dateString
                    )
                  }
                />
                <BaseLabel width={70}>核对人</BaseLabel>
                <BaseSelect
                  width={120}
                  height={26}
                  value={tenBirthTenData.reviewPerson}
                  onChange={(e) =>
                    this.updateBirthData("tenBirthTenData", "reviewPerson", e)
                  }
                >
                  {renderOptions(optionsAfterbirth, "198")}
                </BaseSelect>
              </BaseFormItem>
              <BaseFormItem
                type="flex"
                align="middle"
                justify="center"
                style={{ paddingBottom: 30 }}
              >
                <Button type="primary" onClick={() => this.saveBirthTen()}>
                  保存
                </Button>
              </BaseFormItem>
            </DetailContent>
          </>
        )
      case "十五周岁":
        return (
          <>
            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">十五周岁</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>基础检查</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>健康状况</BaseLabel>
                  <BaseSelect
                    width={120}
                    height={26}
                    value={fifteenData.healthState}
                    onChange={(e) =>
                      this.updateBirthData("fifteenData", "healthState", e)
                    }
                  >
                    {renderOptions(optionsAfterbirth, "103")}
                  </BaseSelect>
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>身长</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={fifteenData.height}
                    onChange={(e) =>
                      this.updateBirthData(
                        "fifteenData",
                        "height",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                  <BaseLabel width={70}>体重</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={fifteenData.weight}
                    onChange={(e) =>
                      this.updateBirthData(
                        "fifteenData",
                        "weight",
                        e.target.value
                      )
                    }
                  />
                  <div>kg</div>
                  {this.state.sex === 0 ? (
                    <>
                      <BaseLabel width={70}>腰围</BaseLabel>
                      <FontInput
                        style={{ width: 90, marginRight: 12 }}
                        value={fifteenData.waist}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "waist",
                            e.target.value
                          )
                        }
                      />
                      <div>cm</div>
                    </>
                  ) : (
                    <>
                      <BaseLabel width={70}>胸围</BaseLabel>
                      <FontInput
                        style={{ width: 90, marginRight: 12 }}
                        value={fifteenData.bust}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "bust",
                            e.target.value
                          )
                        }
                      />
                      <div>cm</div>
                      <BaseLabel width={70}>臀围</BaseLabel>
                      <FontInput
                        style={{ width: 90, marginRight: 12 }}
                        value={fifteenData.hipCircumference}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "hipCircumference",
                            e.target.value
                          )
                        }
                      />
                      <div>cm</div>
                    </>
                  )}
                </BaseFormItem>
              </DetailContent>

              <BorderDash />
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>基本信息</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={120}>打架</BaseLabel>
                  <BaseSelect
                    width={120}
                    height={26}
                    value={fifteenData.fight}
                    onChange={(e) =>
                      this.updateBirthData("fifteenData", "fight", e)
                    }
                  >
                    {renderOptions(optionsAfterbirth, "243")}
                  </BaseSelect>
                  <BaseLabel width={70}>逃课</BaseLabel>
                  <Switch
                    checked={fifteenData.skipClass}
                    onChange={(e) =>
                      this.updateBirthData("fifteenData", "skipClass", +e)
                    }
                  />
                  <BaseLabel width={90}>离家出走</BaseLabel>
                  <Switch
                    checked={fifteenData.leaveHome}
                    onChange={(e) =>
                      this.updateBirthData("fifteenData", "leaveHome", +e)
                    }
                  />
                  <BaseLabel width={90}>自杀倾向</BaseLabel>
                  <Switch
                    checked={fifteenData.suicidalTendency}
                    onChange={(e) =>
                      this.updateBirthData(
                        "fifteenData",
                        "suicidalTendency",
                        +e
                      )
                    }
                  />
                  <BaseLabel width={90}>自杀行为</BaseLabel>
                  <Switch
                    checked={fifteenData.suicides}
                    onChange={(e) =>
                      this.updateBirthData("fifteenData", "suicides", +e)
                    }
                  />
                  <BaseLabel width={235}>忧郁或绝望≥2w影响正常生活</BaseLabel>
                  <Switch
                    checked={fifteenData.depressionDespair}
                    onChange={(e) =>
                      this.updateBirthData(
                        "fifteenData",
                        "depressionDespair",
                        +e
                      )
                    }
                  />
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={120}>外伤史</BaseLabel>
                  <Switch
                    checked={fifteenData.traumaHistory}
                    onChange={(e) =>
                      this.updateBirthData("fifteenData", "traumaHistory", +e)
                    }
                  />
                  {fifteenData.traumaHistory === 1 && (
                    <FontInput
                      style={{ width: 200, marginLeft: 24 }}
                      value={fifteenData.traumaHistoryDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "fifteenData",
                          "traumaHistoryDetail",
                          e.target.value
                        )
                      }
                    />
                  )}

                  <BaseLabel width={120}>手术史</BaseLabel>
                  <Switch
                    checked={fifteenData.surgicalHistory}
                    onChange={(e) =>
                      this.updateBirthData("fifteenData", "surgicalHistory", +e)
                    }
                  />
                  {fifteenData.surgicalHistory === 1 && (
                    <FontInput
                      style={{ width: 200, marginLeft: 24 }}
                      value={fifteenData.surgicalHistoryDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "fifteenData",
                          "surgicalHistoryDetail",
                          e.target.value
                        )
                      }
                    />
                  )}
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={120}>泌尿生殖手术史</BaseLabel>
                  <Switch
                    checked={fifteenData.genitourinarySurgeryHistory}
                    onChange={(e) =>
                      this.updateBirthData(
                        "fifteenData",
                        "genitourinarySurgeryHistory",
                        +e
                      )
                    }
                  />
                  {fifteenData.genitourinarySurgeryHistory === 1 && (
                    <FontInput
                      style={{ width: 200, marginLeft: 24 }}
                      value={fifteenData.genitourinarySurgeryHistoryDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "fifteenData",
                          "genitourinarySurgeryHistoryDetail",
                          e.target.value
                        )
                      }
                    />
                  )}
                  <BaseLabel width={120}>泌尿生殖外伤史</BaseLabel>
                  <Switch
                    checked={fifteenData.genitourinaryTraumaHistory}
                    onChange={(e) =>
                      this.updateBirthData(
                        "fifteenData",
                        "genitourinaryTraumaHistory",
                        +e
                      )
                    }
                  />
                  {fifteenData.genitourinaryTraumaHistory === 1 && (
                    <FontInput
                      style={{ width: 200, marginLeft: 24 }}
                      value={fifteenData.genitourinaryTraumaHistoryDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "fifteenData",
                          "genitourinaryTraumaHistoryDetail",
                          e.target.value
                        )
                      }
                    />
                  )}
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={120}>性行为</BaseLabel>
                  <Switch
                    checked={fifteenData.sexuality}
                    onChange={(e) =>
                      this.updateBirthData("fifteenData", "sexuality", +e)
                    }
                  />
                  {fifteenData.sexuality === 1 && (
                    <>
                      <div style={{ marginLeft: 30 }}>第一次性行为</div>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 80, margin: "0 12px" }}
                        value={fifteenData.sexualityAge}
                        onChange={(e) =>
                          this.updateBirthData("fifteenData", "sexualityAge", e)
                        }
                      />
                      <div>岁</div>
                    </>
                  )}

                  {this.state.sex === 0 && (
                    <>
                      <BaseLabel width={70}>遗精</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={fifteenData.seminalEmission}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "seminalEmission",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "244")}
                      </BaseSelect>
                      {fifteenData.seminalEmission === "是" && (
                        <>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80, margin: "0 12px 0 24px" }}
                            value={fifteenData.seminalEmissionAge}
                            onChange={(e) =>
                              this.updateBirthData(
                                "fifteenData",
                                "seminalEmissionAge",
                                e
                              )
                            }
                          />
                          <div>岁</div>
                        </>
                      )}
                    </>
                  )}
                </BaseFormItem>
              </DetailContent>

              {this.state.sex === 1 && (
                <>
                  <BorderDash />
                  <BaseFormItem type="flex" align="middle">
                    <div style={{ color: "#5CB5F3" }}>月经情况</div>
                  </BaseFormItem>
                  <DetailContent>
                    <BaseFormItem type="flex" align="middle">
                      <BaseSelect
                        width={120}
                        height={26}
                        value={fifteenData.menstruation}
                        onChange={(e) =>
                          this.updateBirthData("fifteenData", "menstruation", e)
                        }
                      >
                        {renderOptions(optionsAfterbirth, "247")}
                      </BaseSelect>
                      {fifteenData.menstruation !== "无月经史" && (
                        <>
                          <BaseLabel width={70}>初潮</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 60, marginRight: 12 }}
                            value={fifteenData.menarcheAge}
                            onChange={(e) =>
                              this.updateBirthData(
                                "fifteenData",
                                "menarcheAge",
                                e
                              )
                            }
                          />
                          <div>岁</div>
                          <BaseLabel width={100}>末次月经</BaseLabel>
                          <BaseDatepicker
                            height={26}
                            value={
                              fifteenData.lastMenstrualDate
                                ? moment(fifteenData.lastMenstrualDate)
                                : ""
                            }
                            onChange={(date, dateString) =>
                              this.updateBirthData(
                                "fifteenData",
                                "lastMenstrualDate",
                                dateString
                              )
                            }
                          />
                          <BaseLabel width={70}>周期</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 60 }}
                            value={fifteenData.cycleMin}
                            onChange={(e) =>
                              this.updateBirthData("fifteenData", "cycleMin", e)
                            }
                          />
                          <div style={{ margin: "0 12px" }}>-</div>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 60 }}
                            value={fifteenData.cycleMax}
                            onChange={(e) =>
                              this.updateBirthData("fifteenData", "cycleMax", e)
                            }
                          />
                          <BaseLabel width={70}>经期</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 60 }}
                            value={fifteenData.menstruationMin}
                            onChange={(e) =>
                              this.updateBirthData(
                                "fifteenData",
                                "menstruationMin",
                                e
                              )
                            }
                          />
                          <div style={{ margin: "0 12px" }}>-</div>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 60 }}
                            value={fifteenData.menstruationMax}
                            onChange={(e) =>
                              this.updateBirthData(
                                "fifteenData",
                                "menstruationMax",
                                e
                              )
                            }
                          />
                        </>
                      )}
                    </BaseFormItem>
                    {fifteenData.menstruation !== "无月经史" && (
                      <>
                        <BaseFormItem type="flex" align="middle">
                          <BaseLabel width={70}>月经量</BaseLabel>
                          <BaseSelect
                            width={120}
                            height={26}
                            value={fifteenData.menstrualVolume}
                            onChange={(e) =>
                              this.updateBirthData(
                                "fifteenData",
                                "menstrualVolume",
                                e
                              )
                            }
                          >
                            {renderOptions(optionsAfterbirth, "234")}
                          </BaseSelect>
                          <BaseLabel width={70}>痛经</BaseLabel>
                          <BaseSelect
                            width={120}
                            height={26}
                            value={fifteenData.dysmenorrhea}
                            onChange={(e) =>
                              this.updateBirthData(
                                "fifteenData",
                                "dysmenorrhea",
                                e
                              )
                            }
                          >
                            {renderOptions(optionsAfterbirth, "245")}
                          </BaseSelect>
                        </BaseFormItem>
                        <BaseFormItem type="flex" align="middle">
                          <BaseLabel width={70}>新发疾病</BaseLabel>
                          <Switch
                            checked={fifteenData.newDisease}
                            onChange={(e) =>
                              this.updateBirthData(
                                "fifteenData",
                                "newDisease",
                                +e
                              )
                            }
                          />
                          {fifteenData.newDisease === 1 && (
                            <FontInput
                              style={{ width: 220, marginLeft: 12 }}
                              value={fifteenData.newDiseaseDatail}
                              onChange={(e) =>
                                this.updateBirthData(
                                  "fifteenData",
                                  "newDiseaseDatail",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </BaseFormItem>
                      </>
                    )}
                    {fifteenData.menstruation === "月经不规律" && (
                      <BaseFormItem type="flex" align="middle">
                        <BaseInputNumber
                          min={0}
                          style={{ width: 60, marginRight: 12 }}
                          value={fifteenData.irregularAge}
                          onChange={(e) =>
                            this.updateBirthData(
                              "fifteenData",
                              "irregularAge",
                              e
                            )
                          }
                        />
                        <div>岁开始不规律</div>
                        <BaseLabel width={70}>治疗过</BaseLabel>
                        <Switch
                          checked={fifteenData.regularTreated}
                          onChange={(e) =>
                            this.updateBirthData(
                              "fifteenData",
                              "regularTreated",
                              +e
                            )
                          }
                        />
                        <BaseInputNumber
                          min={0}
                          style={{ width: 60, margin: "0 12px" }}
                          value={fifteenData.regularTreatAge}
                          onChange={(e) =>
                            this.updateBirthData(
                              "fifteenData",
                              "regularTreatAge",
                              e
                            )
                          }
                        />
                        <div>岁开始治疗</div>
                        <BaseLabel width={70}>时长</BaseLabel>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 60, marginRight: 12 }}
                          value={fifteenData.regularTreatYear}
                          onChange={(e) =>
                            this.updateBirthData(
                              "fifteenData",
                              "regularTreatYear",
                              e
                            )
                          }
                        />
                        <div>年</div>
                        <BaseLabel width={70}>方法</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={fifteenData.regularTreatMethod}
                          onChange={(e) =>
                            this.updateBirthData(
                              "fifteenData",
                              "regularTreatMethod",
                              e
                            )
                          }
                        >
                          {renderOptions(optionsAfterbirth, "233")}
                        </BaseSelect>
                        <BaseLabel width={90}>逐渐正常</BaseLabel>
                        <Switch
                          checked={fifteenData.irregularToNormal}
                          onChange={(e) =>
                            this.updateBirthData(
                              "fifteenData",
                              "irregularToNormal",
                              +e
                            )
                          }
                        />
                        <BaseInputNumber
                          min={0}
                          style={{ width: 60, margin: "0 12px" }}
                          value={fifteenData.toNormalAge}
                          onChange={(e) =>
                            this.updateBirthData(
                              "fifteenData",
                              "toNormalAge",
                              e
                            )
                          }
                        />
                        <div>岁转为正常</div>
                      </BaseFormItem>
                    )}
                  </DetailContent>
                </>
              )}

              <BorderDash />
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>第二性征</div>
              </BaseFormItem>
              <DetailContent>
                {this.state.sex === 0 && (
                  <BaseFormItem type="flex" align="middle">
                    <BaseLabel width={70}>喉结</BaseLabel>
                    <BaseSelect
                      width={120}
                      height={26}
                      value={fifteenData.laryngeal}
                      onChange={(e) =>
                        this.updateBirthData("fifteenData", "laryngeal", e)
                      }
                    >
                      {renderOptions(optionsAfterbirth, "244")}
                    </BaseSelect>
                    {fifteenData.laryngeal === "是" && (
                      <>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, margin: "0 12px 0 24px" }}
                          value={fifteenData.laryngealAge}
                          onChange={(e) =>
                            this.updateBirthData(
                              "fifteenData",
                              "laryngealAge",
                              e
                            )
                          }
                        />
                        <div>岁</div>
                      </>
                    )}

                    <BaseLabel width={70}>变声</BaseLabel>
                    <BaseSelect
                      width={120}
                      height={26}
                      value={fifteenData.changeVoice}
                      onChange={(e) =>
                        this.updateBirthData("fifteenData", "changeVoice", e)
                      }
                    >
                      {renderOptions(optionsAfterbirth, "244")}
                    </BaseSelect>
                    {fifteenData.changeVoice === "是" && (
                      <>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, margin: "0 12px 0 24px" }}
                          value={fifteenData.changeVoiceAge}
                          onChange={(e) =>
                            this.updateBirthData(
                              "fifteenData",
                              "changeVoiceAge",
                              e
                            )
                          }
                        />
                        <div>岁</div>
                      </>
                    )}

                    <BaseLabel width={70}>胡须</BaseLabel>
                    <BaseSelect
                      width={120}
                      height={26}
                      value={fifteenData.beard}
                      onChange={(e) =>
                        this.updateBirthData("fifteenData", "beard", e)
                      }
                    >
                      {renderOptions(optionsAfterbirth, "244")}
                    </BaseSelect>
                    {fifteenData.beard === "是" && (
                      <>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, margin: "0 12px 0 24px" }}
                          value={fifteenData.beardAge}
                          onChange={(e) =>
                            this.updateBirthData("fifteenData", "beardAge", e)
                          }
                        />
                        <div>岁</div>
                      </>
                    )}
                  </BaseFormItem>
                )}

                <BaseFormItem type="flex" align="middle">
                  {this.state.sex === 1 && (
                    <>
                      <BaseLabel width={70}>乳房发育</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={fifteenData.breastsDevelopSituation}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "breastsDevelopSituation",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "244")}
                      </BaseSelect>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 80, margin: "0 12px 0 24px" }}
                        value={fifteenData.breastsDevelopAge}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "breastsDevelopAge",
                            e
                          )
                        }
                      />
                      <div>岁</div>
                      <BaseLabel width={70}>腋毛</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={fifteenData.armpitHairDevelopSituation}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "armpitHairDevelopSituation",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "244")}
                      </BaseSelect>
                      {fifteenData.armpitHairDevelopSituation === "是" && (
                        <>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80, margin: "0 12px 0 24px" }}
                            value={fifteenData.armpitHairDevelopAge}
                            onChange={(e) =>
                              this.updateBirthData(
                                "fifteenData",
                                "armpitHairDevelopAge",
                                e
                              )
                            }
                          />
                          <div>岁</div>
                        </>
                      )}
                      <BaseLabel width={70}>阴毛</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={fifteenData.pubicHairDevelopSituation}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "pubicHairDevelopSituation",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "244")}
                      </BaseSelect>
                      {fifteenData.pubicHairDevelopSituation === "是" && (
                        <>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80, margin: "0 12px 0 24px" }}
                            value={fifteenData.pubicHairDevelopAge}
                            onChange={(e) =>
                              this.updateBirthData(
                                "fifteenData",
                                "pubicHairDevelopAge",
                                e
                              )
                            }
                          />
                          <div>岁</div>
                        </>
                      )}
                    </>
                  )}
                  {this.state.sex === 0 && (
                    <>
                      <BaseLabel width={70}>腋毛</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={fifteenData.armpitHair}
                        onChange={(e) =>
                          this.updateBirthData("fifteenData", "armpitHair", e)
                        }
                      >
                        {renderOptions(optionsAfterbirth, "244")}
                      </BaseSelect>
                      {fifteenData.armpitHair === "是" && (
                        <>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80, margin: "0 12px 0 24px" }}
                            value={fifteenData.armpitHairAge}
                            onChange={(e) =>
                              this.updateBirthData(
                                "fifteenData",
                                "armpitHairAge",
                                e
                              )
                            }
                          />
                          <div>岁</div>
                        </>
                      )}

                      <BaseLabel width={70}>阴毛</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={fifteenData.pubicHair}
                        onChange={(e) =>
                          this.updateBirthData("fifteenData", "pubicHair", e)
                        }
                      >
                        {renderOptions(optionsAfterbirth, "244")}
                      </BaseSelect>
                      {fifteenData.pubicHair === "是" && (
                        <>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80, margin: "0 12px 0 24px" }}
                            value={fifteenData.pubicHairAge}
                            onChange={(e) =>
                              this.updateBirthData(
                                "fifteenData",
                                "pubicHairAge",
                                e
                              )
                            }
                          />
                          <div>岁</div>
                        </>
                      )}
                    </>
                  )}
                </BaseFormItem>
              </DetailContent>
              <BorderDash />
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>体格检查</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>痤疮</BaseLabel>
                  <Switch
                    checked={fifteenData.acne}
                    onChange={(e) =>
                      this.updateBirthData("fifteenData", "acne", +e)
                    }
                  />
                  {fifteenData.acne === 1 && (
                    <FontInput
                      style={{ width: 220, marginLeft: 12 }}
                      value={fifteenData.acneSpecificPart}
                      onChange={(e) =>
                        this.updateBirthData(
                          "fifteenData",
                          "acneSpecificPart",
                          e.target.value
                        )
                      }
                    />
                  )}

                  {this.state.sex === 1 && (
                    <>
                      <BaseLabel width={110}>皮肤油腻/油乳</BaseLabel>
                      <Switch
                        checked={fifteenData.seborrheicSkin}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "seborrheicSkin",
                            +e
                          )
                        }
                      />
                    </>
                  )}
                  <BaseLabel width={70}>乳房</BaseLabel>
                  <FontInput
                    style={{ width: 120 }}
                    value={fifteenData.breastsDetail}
                    onChange={(e) =>
                      this.updateBirthData(
                        "fifteenData",
                        "breastsDetail",
                        e.target.value
                      )
                    }
                  />
                  {this.state.sex === 0 && (
                    <>
                      <BaseLabel width={90}>阴毛分布</BaseLabel>
                      <Radio.Group
                        value={fifteenData.pubicHairDistribution}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "pubicHairDistribution",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                    </>
                  )}
                </BaseFormItem>
                {this.state.sex === 1 && (
                  <BaseFormItem type="flex" align="middle">
                    <BaseLabel width={70}>腋毛</BaseLabel>
                    <FontInput
                      style={{ width: 220 }}
                      value={fifteenData.armpitHairDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "fifteenData",
                          "armpitHairDetail",
                          e.target.value
                        )
                      }
                    />
                    <BaseLabel width={70}>阴毛</BaseLabel>
                    <FontInput
                      style={{ width: 220 }}
                      value={fifteenData.pubicHairDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "fifteenData",
                          "pubicHairDetail",
                          e.target.value
                        )
                      }
                    />
                  </BaseFormItem>
                )}
                {this.state.sex === 0 && (
                  <>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={70}>阴茎长度</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 60, marginRight: "12px" }}
                        value={fifteenData.penisLength}
                        onChange={(e) =>
                          this.updateBirthData("fifteenData", "penisLength", e)
                        }
                      />
                      <div>cm</div>
                      <BaseLabel width={70}>周径</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 60, marginRight: "12px" }}
                        value={fifteenData.circumference}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "circumference",
                            e
                          )
                        }
                      />
                      <div>cm</div>
                      <BaseLabel width={90}>睾丸容积</BaseLabel>
                      <BaseLabel width={50}>左侧</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 60, marginRight: "12px" }}
                        value={fifteenData.testicularVolumeLeft}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "testicularVolumeLeft",
                            e
                          )
                        }
                      />
                      <div>cm</div>
                      <BaseLabel width={50}>右侧</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 60, marginRight: "12px" }}
                        value={fifteenData.testicularVolumeRight}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "testicularVolumeRight",
                            e
                          )
                        }
                      />
                      <div>cm</div>
                      <BaseLabel width={100}>质地和弹性</BaseLabel>
                      <Radio.Group
                        value={fifteenData.textureElasticity}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "textureElasticity",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={70}>附睾结节</BaseLabel>
                      <Switch
                        checked={fifteenData.epididymalNodule}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "epididymalNodule",
                            +e
                          )
                        }
                      />
                      <BaseLabel width={70}>输精管</BaseLabel>
                      <BaseLabel width={50}>存在</BaseLabel>
                      <Switch
                        checked={fifteenData.vasDeferens}
                        onChange={(e) =>
                          this.updateBirthData("fifteenData", "vasDeferens", +e)
                        }
                      />
                      <BaseLabel width={50}>结节</BaseLabel>
                      <Switch
                        checked={fifteenData.nodules}
                        onChange={(e) =>
                          this.updateBirthData("fifteenData", "nodules", +e)
                        }
                      />
                      <BaseLabel width={110}>精索静脉曲张</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={fifteenData.spermaticCord}
                        onChange={(e) =>
                          this.updateBirthData(
                            "fifteenData",
                            "spermaticCord",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "245")}
                      </BaseSelect>
                      <BaseLabel width={70}>包皮</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={fifteenData.foreskin}
                        onChange={(e) =>
                          this.updateBirthData("fifteenData", "foreskin", e)
                        }
                      >
                        {renderOptions(optionsAfterbirth, "246")}
                      </BaseSelect>
                    </BaseFormItem>
                  </>
                )}
              </DetailContent>
            </DetailContent>

            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">随访</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <BaseLabel width={70}>随访日</BaseLabel>
                <BaseDatepicker
                  height={26}
                  value={
                    fifteenData.followDate ? moment(fifteenData.followDate) : ""
                  }
                  onChange={(date, dateString) =>
                    this.updateBirthData(
                      "fifteenData",
                      "followDate",
                      dateString
                    )
                  }
                />
                <BaseLabel width={70}>随访人</BaseLabel>
                <BaseSelect
                  width={120}
                  height={26}
                  value={fifteenData.followPerson}
                  onChange={(e) =>
                    this.updateBirthData("fifteenData", "followPerson", e)
                  }
                >
                  {renderOptions(optionsAfterbirth, "198")}
                </BaseSelect>
              </BaseFormItem>
            </DetailContent>
            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">复核</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <BaseLabel width={70}>复核日</BaseLabel>
                <BaseDatepicker
                  height={26}
                  value={
                    fifteenData.reviewDate ? moment(fifteenData.reviewDate) : ""
                  }
                  onChange={(date, dateString) =>
                    this.updateBirthData(
                      "fifteenData",
                      "reviewDate",
                      dateString
                    )
                  }
                />
                <BaseLabel width={70}>核对人</BaseLabel>
                <BaseSelect
                  width={120}
                  height={26}
                  value={fifteenData.reviewPerson}
                  onChange={(e) =>
                    this.updateBirthData("fifteenData", "reviewPerson", e)
                  }
                >
                  {renderOptions(optionsAfterbirth, "198")}
                </BaseSelect>
              </BaseFormItem>
              <BaseFormItem
                type="flex"
                align="middle"
                justify="center"
                style={{ paddingBottom: 30 }}
              >
                <Button type="primary" onClick={() => this.saveFifteen()}>
                  保存
                </Button>
              </BaseFormItem>
            </DetailContent>
          </>
        )
      case "二十周岁":
        return (
          <>
            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">二十周岁</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>基础检查</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>健康状况</BaseLabel>
                  <BaseSelect
                    width={120}
                    height={26}
                    value={twentyData.healthState}
                    onChange={(e) =>
                      this.updateBirthData("twentyData", "healthState", e)
                    }
                  >
                    {renderOptions(optionsAfterbirth, "103")}
                  </BaseSelect>
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>身长</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={twentyData.height}
                    onChange={(e) =>
                      this.updateBirthData(
                        "twentyData",
                        "height",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                  <BaseLabel width={70}>体重</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={twentyData.weight}
                    onChange={(e) =>
                      this.updateBirthData(
                        "twentyData",
                        "weight",
                        e.target.value
                      )
                    }
                  />
                  <div>kg</div>
                  <BaseLabel width={70}>腰围</BaseLabel>
                  <FontInput
                    style={{ width: 90, marginRight: 12 }}
                    value={twentyData.waist}
                    onChange={(e) =>
                      this.updateBirthData(
                        "twentyData",
                        "waist",
                        e.target.value
                      )
                    }
                  />
                  <div>cm</div>
                  {this.state.sex === 1 && (
                    <>
                      <BaseLabel width={70}>体脂比</BaseLabel>
                      <FontInput
                        style={{ width: 90, marginRight: 12 }}
                        value={twentyData.bodyFatRatio}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "bodyFatRatio",
                            e.target.value
                          )
                        }
                      />
                      <BaseLabel width={70}>臀围</BaseLabel>
                      <FontInput
                        style={{ width: 90, marginRight: 12 }}
                        value={twentyData.hipCircumference}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "hipCircumference",
                            e.target.value
                          )
                        }
                      />
                      <div>cm</div>
                      <BaseLabel width={70}>P</BaseLabel>
                      <FontInput
                        style={{ width: 90, marginRight: 12 }}
                        value={twentyData.p}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "p",
                            e.target.value
                          )
                        }
                      />
                      <div>次/分</div>
                      <BaseLabel width={70}>BP</BaseLabel>
                      <FontInput
                        style={{ width: 60 }}
                        value={twentyData.bpMin}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "bpMin",
                            e.target.value
                          )
                        }
                      />
                      <div style={{ margin: "0 12px" }}>-</div>
                      <FontInput
                        style={{ width: 60, marginRight: 12 }}
                        value={twentyData.bpMax}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "bpMax",
                            e.target.value
                          )
                        }
                      />
                      <div>mmHg</div>
                    </>
                  )}
                </BaseFormItem>
              </DetailContent>
              <BorderDash />
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>基本信息</div>
              </BaseFormItem>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={120}>外伤史</BaseLabel>
                  <Switch
                    checked={twentyData.traumaHistory}
                    onChange={(e) =>
                      this.updateBirthData("twentyData", "traumaHistory", +e)
                    }
                  />
                  {twentyData.traumaHistory === 1 && (
                    <FontInput
                      style={{ width: 200, marginLeft: 12 }}
                      value={twentyData.traumaHistoryDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "traumaHistoryDetail",
                          e.target.value
                        )
                      }
                    />
                  )}

                  <BaseLabel width={120}>手术史</BaseLabel>
                  <Switch
                    checked={twentyData.surgicalHistory}
                    onChange={(e) =>
                      this.updateBirthData("twentyData", "surgicalHistory", +e)
                    }
                  />
                  {twentyData.surgicalHistory === 1 && (
                    <FontInput
                      style={{ width: 200, marginLeft: 12 }}
                      value={twentyData.surgicalHistoryDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "surgicalHistoryDetail",
                          e.target.value
                        )
                      }
                    />
                  )}
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={120}>泌尿生殖手术史</BaseLabel>
                  <Switch
                    checked={twentyData.genitourinarySurgeryHistory}
                    onChange={(e) =>
                      this.updateBirthData(
                        "twentyData",
                        "genitourinarySurgeryHistory",
                        +e
                      )
                    }
                  />
                  {twentyData.genitourinarySurgeryHistory === 1 && (
                    <FontInput
                      style={{ width: 200, marginLeft: 12 }}
                      value={twentyData.genitourinarySurgeryHistoryDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "genitourinarySurgeryHistoryDetail",
                          e.target.value
                        )
                      }
                    />
                  )}

                  <BaseLabel width={120}>泌尿生殖外伤史</BaseLabel>
                  <Switch
                    checked={twentyData.genitourinaryTraumaHistory}
                    onChange={(e) =>
                      this.updateBirthData(
                        "twentyData",
                        "genitourinaryTraumaHistory",
                        +e
                      )
                    }
                  />
                  {twentyData.genitourinaryTraumaHistory === 1 && (
                    <FontInput
                      style={{ width: 200, marginLeft: 12 }}
                      value={twentyData.genitourinaryTraumaHistoryDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "genitourinaryTraumaHistoryDetail",
                          e.target.value
                        )
                      }
                    />
                  )}
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={120}>性行为</BaseLabel>
                  <Switch
                    checked={twentyData.sexuality}
                    onChange={(e) =>
                      this.updateBirthData("twentyData", "sexuality", +e)
                    }
                  />
                  {twentyData.sexuality === 1 && (
                    <>
                      <div style={{ marginLeft: 12 }}>第一次性行为</div>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 80, margin: "0 12px" }}
                        value={twentyData.sexualityAge}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "sexualityAge", e)
                        }
                      />
                      <div>岁</div>
                    </>
                  )}
                </BaseFormItem>
                {this.state.sex === 0 && (
                  <>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>长期服用棉籽油</BaseLabel>
                      <Switch
                        checked={twentyData.longTermCottonseedOilHistory}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "longTermCottonseedOilHistory",
                            +e
                          )
                        }
                      />
                      {twentyData.longTermCottonseedOilHistory === 1 && (
                        <>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80, margin: "0 12px" }}
                            value={twentyData.longTermCottonseedOilHistoryYear}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "longTermCottonseedOilHistoryYear",
                                e
                              )
                            }
                          />
                          <div>岁</div>
                        </>
                      )}

                      <BaseLabel width={214}>腮腺炎病史</BaseLabel>
                      <Switch
                        checked={twentyData.mumpsHistory}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "mumpsHistory", +e)
                        }
                      />
                      {twentyData.mumpsHistory === 1 && (
                        <>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80, margin: "0 12px" }}
                            value={twentyData.mumpsHistoryYear}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "mumpsHistoryYear",
                                e
                              )
                            }
                          />
                          <div>岁</div>
                        </>
                      )}
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>就医病史</BaseLabel>
                      <Switch
                        checked={twentyData.medicalHistory}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "medicalHistory",
                            +e
                          )
                        }
                      />
                      {twentyData.medicalHistory === 1 && (
                        <FontInput
                          style={{ width: 200, marginLeft: 12 }}
                          value={twentyData.medicalHistoryName}
                          onChange={(e) =>
                            this.updateBirthData(
                              "twentyData",
                              "medicalHistoryName",
                              e.target.value
                            )
                          }
                        />
                      )}

                      <BaseLabel width={120}>治疗</BaseLabel>
                      <Switch
                        checked={twentyData.treatment}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "treatment", +e)
                        }
                      />
                      {twentyData.treatment === 1 && (
                        <>
                          <BaseSelect
                            style={{ marginLeft: 12 }}
                            width={120}
                            height={26}
                            value={twentyData.treatmentMethod}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "treatmentMethod",
                                e
                              )
                            }
                          >
                            {renderOptions(optionsAfterbirth, "249")}
                          </BaseSelect>
                          <FontInput
                            style={{ width: 200, marginLeft: 24 }}
                            value={twentyData.treatmentDetail}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "treatmentDetail",
                                e.target.value
                              )
                            }
                          />
                        </>
                      )}
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>手淫史</BaseLabel>
                      <Switch
                        checked={twentyData.masturbationHistory}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "masturbationHistory",
                            +e
                          )
                        }
                      />
                      {twentyData.masturbationHistory === 1 && (
                        <>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80, margin: "0 12px" }}
                            value={twentyData.masturbationHistoryAge}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "masturbationHistoryAge",
                                e
                              )
                            }
                          />
                          <div>岁</div>
                          <BaseLabel width={70}>持续</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80, marginRight: 12 }}
                            value={twentyData.masturbationHistoryYears}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "masturbationHistoryYears",
                                e
                              )
                            }
                          />
                          <div>年</div>
                          <BaseLabel width={90}>手淫频率</BaseLabel>
                          <BaseSelect
                            width={120}
                            height={26}
                            value={twentyData.masturbationFrequency}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "masturbationFrequency",
                                e
                              )
                            }
                          >
                            {renderOptions(optionsAfterbirth, "248")}
                          </BaseSelect>
                        </>
                      )}
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>精液常规分析</BaseLabel>
                      <Switch
                        checked={twentyData.routineSemenAnalysis}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "routineSemenAnalysis",
                            +e
                          )
                        }
                      />
                      {twentyData.routineSemenAnalysis === 1 && (
                        <>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80, margin: "0 12px" }}
                            value={twentyData.routineSemenAnalysisTimes}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "routineSemenAnalysisTimes",
                                e
                              )
                            }
                          />
                          <div>次</div>
                          <BaseLabel width={70}>结果</BaseLabel>
                          <Radio.Group
                            value={twentyData.routineSemenAnalysisResult}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "routineSemenAnalysisResult",
                                e.target.value
                              )
                            }
                          >
                            <Radio value={1}>正常</Radio>
                            <Radio value={0}>异常</Radio>
                          </Radio.Group>
                        </>
                      )}

                      <BaseLabel width={120}>精液异常治疗</BaseLabel>
                      <Switch
                        checked={twentyData.semenAbnormalitiesTreatment}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "semenAbnormalitiesTreatment",
                            +e
                          )
                        }
                      />
                      {twentyData.semenAbnormalitiesTreatment === 1 && (
                        <>
                          <BaseLabel width={90}>治疗结果</BaseLabel>
                          <Radio.Group
                            value={twentyData.semenAbnormalitiesTreatmentResult}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "semenAbnormalitiesTreatmentResult",
                                e.target.value
                              )
                            }
                          >
                            <Radio value={1}>正常</Radio>
                            <Radio value={0}>异常</Radio>
                          </Radio.Group>
                        </>
                      )}
                    </BaseFormItem>
                  </>
                )}
              </DetailContent>
              {this.state.sex === 1 && (
                <>
                  <BorderDash />
                  <BaseFormItem type="flex" align="middle">
                    <div style={{ color: "#5CB5F3" }}>月经情况</div>
                  </BaseFormItem>
                  <DetailContent>
                    <BaseFormItem type="flex" align="middle">
                      <BaseSelect
                        width={120}
                        height={26}
                        value={twentyData.menstruation}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "menstruation", e)
                        }
                      >
                        {renderOptions(optionsAfterbirth, "253")}
                      </BaseSelect>
                      {twentyData.menstruation !== "无月经史" && (
                        <>
                          <BaseLabel width={70}>初潮</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 60, marginRight: 12 }}
                            value={twentyData.menarcheAge}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "menarcheAge",
                                e
                              )
                            }
                          />
                          <div>岁</div>
                          <BaseLabel width={100}>末次月经</BaseLabel>
                          <BaseDatepicker
                            height={26}
                            value={
                              twentyData.lastMenstrualDate
                                ? moment(twentyData.lastMenstrualDate)
                                : ""
                            }
                            onChange={(date, dateString) =>
                              this.updateBirthData(
                                "twentyData",
                                "lastMenstrualDate",
                                dateString
                              )
                            }
                          />
                          <BaseLabel width={70}>周期</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 60 }}
                            value={twentyData.cycleMin}
                            onChange={(e) =>
                              this.updateBirthData("twentyData", "cycleMin", e)
                            }
                          />
                          <div style={{ margin: "0 12px" }}>-</div>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 60 }}
                            value={twentyData.cycleMax}
                            onChange={(e) =>
                              this.updateBirthData("twentyData", "cycleMax", e)
                            }
                          />
                          <BaseLabel width={70}>经期</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 60 }}
                            value={twentyData.menstruationMin}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "menstruationMin",
                                e
                              )
                            }
                          />
                          <div style={{ margin: "0 12px" }}>-</div>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 60 }}
                            value={twentyData.menstruationMax}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "menstruationMax",
                                e
                              )
                            }
                          />
                        </>
                      )}
                    </BaseFormItem>
                    {twentyData.menstruation === "月经不规律" && (
                      <BaseFormItem type="flex" align="middle">
                        <BaseInputNumber
                          style={{ width: 60, marginRight: 12 }}
                          value={twentyData.irregularAge}
                          onChange={(e) =>
                            this.updateBirthData(
                              "twentyData",
                              "irregularAge",
                              e
                            )
                          }
                        />
                        <div>岁开始不规律</div>
                        <BaseLabel width={70}>治疗过</BaseLabel>
                        <Switch
                          checked={twentyData.regularTreated}
                          onChange={(e) =>
                            this.updateBirthData(
                              "twentyData",
                              "regularTreated",
                              +e
                            )
                          }
                        />
                        {twentyData.regularTreated === 1 && (
                          <>
                            <BaseInputNumber
                              min={0}
                              style={{ width: 60, margin: "0 12px" }}
                              value={twentyData.regularTreatAge}
                              onChange={(e) =>
                                this.updateBirthData(
                                  "twentyData",
                                  "regularTreatAge",
                                  e
                                )
                              }
                            />
                            <div>岁开始治疗</div>
                          </>
                        )}

                        <BaseLabel width={70}>时长</BaseLabel>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 60, marginRight: 12 }}
                          value={twentyData.regularTreatYear}
                          onChange={(e) =>
                            this.updateBirthData(
                              "twentyData",
                              "regularTreatYear",
                              e
                            )
                          }
                        />
                        <div>年</div>
                        <BaseLabel width={70}>方法</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={twentyData.regularTreatMethod}
                          onChange={(e) =>
                            this.updateBirthData(
                              "twentyData",
                              "regularTreatMethod",
                              e
                            )
                          }
                        >
                          {renderOptions(optionsAfterbirth, "233")}
                        </BaseSelect>
                        <BaseLabel width={90}>逐渐正常</BaseLabel>
                        <Switch
                          checked={twentyData.irregularToNormal}
                          onChange={(e) =>
                            this.updateBirthData(
                              "twentyData",
                              "irregularToNormal",
                              +e
                            )
                          }
                        />
                        {twentyData.irregularToNormal === 1 && (
                          <>
                            <BaseInputNumber
                              min={0}
                              style={{ width: 60, margin: "0 12" }}
                              value={twentyData.toNormalAge}
                              onChange={(e) =>
                                this.updateBirthData(
                                  "twentyData",
                                  "toNormalAge",
                                  e
                                )
                              }
                            />
                            <div>岁转为正常</div>
                          </>
                        )}
                      </BaseFormItem>
                    )}
                    {twentyData.menstruation !== "无月经史" && (
                      <>
                        <BaseFormItem type="flex" align="middle">
                          <BaseLabel width={70}>月经量</BaseLabel>
                          <BaseSelect
                            width={120}
                            height={26}
                            value={twentyData.menstrualVolume}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "menstrualVolume",
                                e
                              )
                            }
                          >
                            {renderOptions(optionsAfterbirth, "234")}
                          </BaseSelect>
                          <BaseLabel width={70}>痛经</BaseLabel>
                          <BaseSelect
                            width={120}
                            height={26}
                            value={twentyData.dysmenorrhea}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "dysmenorrhea",
                                e
                              )
                            }
                          >
                            {renderOptions(optionsAfterbirth, "245")}
                          </BaseSelect>
                        </BaseFormItem>
                      </>
                    )}
                  </DetailContent>
                </>
              )}

              <BorderDash />
              <BaseFormItem type="flex" align="middle">
                <div style={{ color: "#5CB5F3" }}>体格检查</div>
              </BaseFormItem>
              {this.state.sex === 0 ? (
                <DetailContent>
                  <BaseFormItem type="flex" align="middle">
                    <BaseLabel width={120}>痤疮</BaseLabel>
                    <Switch
                      checked={twentyData.acne}
                      onChange={(e) =>
                        this.updateBirthData("twentyData", "acne", +e)
                      }
                    />
                    {twentyData.acne === 1 && (
                      <FontInput
                        style={{ width: 200, marginLeft: 12 }}
                        value={twentyData.acnePart}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "acnePart",
                            e.target.value
                          )
                        }
                      />
                    )}

                    <BaseLabel width={70}>乳房</BaseLabel>
                    <FontInput
                      style={{ width: 200 }}
                      value={twentyData.breastDetail}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "breastDetail",
                          e.target.value
                        )
                      }
                    />
                    <BaseLabel width={90}>阴毛</BaseLabel>
                    <Radio.Group
                      value={twentyData.pubicHair}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "pubicHair",
                          e.target.value
                        )
                      }
                    >
                      <Radio value={1}>正常</Radio>
                      <Radio value={0}>异常</Radio>
                    </Radio.Group>
                  </BaseFormItem>
                  <BaseFormItem type="flex" align="middle">
                    <BaseLabel width={120}>阴茎长度</BaseLabel>
                    <BaseInputNumber
                      min={0}
                      style={{ width: 80, marginRight: 12 }}
                      value={twentyData.penisLength}
                      onChange={(e) =>
                        this.updateBirthData("twentyData", "penisLength", e)
                      }
                    />
                    <div>cm</div>
                    <BaseLabel width={70}>周径</BaseLabel>
                    <BaseInputNumber
                      min={0}
                      style={{ width: 80, marginRight: 12 }}
                      value={twentyData.circumference}
                      onChange={(e) =>
                        this.updateBirthData("twentyData", "circumference", e)
                      }
                    />
                    <div>cm</div>
                    <BaseLabel width={70}>睾丸容积</BaseLabel>
                    <BaseLabel width={70}>左侧</BaseLabel>
                    <BaseInputNumber
                      min={0}
                      style={{ width: 80, marginRight: 12 }}
                      value={twentyData.testicularVolumeLeft}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "testicularVolumeLeft",
                          e
                        )
                      }
                    />
                    <div>ml</div>
                    <BaseLabel width={70}>右侧</BaseLabel>
                    <BaseInputNumber
                      min={0}
                      style={{ width: 80, marginRight: 12 }}
                      value={twentyData.testicularVolumeRight}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "testicularVolumeRight",
                          e
                        )
                      }
                    />
                    <div>ml</div>
                    <BaseLabel width={90}>质地和弹性</BaseLabel>
                    <Radio.Group
                      value={twentyData.textureElasticity}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "textureElasticity",
                          e.target.value
                        )
                      }
                    >
                      <Radio value={1}>正常</Radio>
                      <Radio value={0}>异常</Radio>
                    </Radio.Group>
                  </BaseFormItem>
                  <BaseFormItem type="flex" align="middle">
                    <BaseLabel width={120}>附睾结节</BaseLabel>
                    <Switch
                      checked={twentyData.epididymalNodule}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "epididymalNodule",
                          +e
                        )
                      }
                    />
                    <BaseLabel width={70}>输精管</BaseLabel>
                    <BaseLabel width={70}>存在</BaseLabel>
                    <Switch
                      checked={twentyData.vasDeferens}
                      onChange={(e) =>
                        this.updateBirthData("twentyData", "vasDeferens", +e)
                      }
                    />
                    <BaseLabel width={70}>结节</BaseLabel>
                    <Switch
                      checked={twentyData.nodules}
                      onChange={(e) =>
                        this.updateBirthData("twentyData", "nodules", +e)
                      }
                    />
                    <BaseLabel width={120}>精索静脉曲张</BaseLabel>
                    <BaseSelect
                      style={{ margin: "0 12px" }}
                      width={120}
                      height={26}
                      value={twentyData.spermaticCord}
                      onChange={(e) =>
                        this.updateBirthData("twentyData", "spermaticCord", e)
                      }
                    >
                      {renderOptions(optionsAfterbirth, "245")}
                    </BaseSelect>
                    <BaseLabel width={70}>包皮</BaseLabel>
                    <BaseSelect
                      width={120}
                      height={26}
                      value={twentyData.foreskin}
                      onChange={(e) =>
                        this.updateBirthData("twentyData", "foreskin", e)
                      }
                    >
                      {renderOptions(optionsAfterbirth, "246")}
                    </BaseSelect>
                  </BaseFormItem>
                </DetailContent>
              ) : (
                <DetailContent>
                  <BaseFormItem type="flex" align="middle">
                    <BaseLabel width={120}>体态</BaseLabel>
                    <BaseSelect
                      width={120}
                      height={26}
                      value={twentyData.physique}
                      onChange={(e) =>
                        this.updateBirthData("twentyData", "physique", e)
                      }
                    >
                      {renderOptions(optionsAfterbirth, "254")}
                    </BaseSelect>
                    <BaseLabel width={70}>痤疮</BaseLabel>
                    <Switch
                      checked={twentyData.acne}
                      onChange={(e) =>
                        this.updateBirthData("twentyData", "acne", +e)
                      }
                    />
                    <BaseLabel width={90}>黑棘皮症</BaseLabel>
                    <Switch
                      checked={twentyData.acanthosisNigricans}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "acanthosisNigricans",
                          +e
                        )
                      }
                    />
                  </BaseFormItem>
                  <BaseFormItem type="flex" align="middle">
                    <BaseLabel width={120}>发育情况</BaseLabel>
                    <Radio.Group
                      value={twentyData.developmentStatus}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "developmentStatus",
                          e.target.value
                        )
                      }
                    >
                      <Radio value={1}>正常</Radio>
                      <Radio value={0}>异常</Radio>
                    </Radio.Group>
                    <BaseLabel width={70}>乳房</BaseLabel>
                    <FontInput
                      style={{ width: 200 }}
                      value={twentyData.breast}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "breast",
                          e.target.value
                        )
                      }
                    />
                    <BaseLabel width={90}>多毛评分</BaseLabel>
                    <FontInput
                      style={{ width: 80 }}
                      value={twentyData.polychromeScore}
                      onChange={(e) =>
                        this.updateBirthData(
                          "twentyData",
                          "polychromeScore",
                          e.target.value
                        )
                      }
                    />
                  </BaseFormItem>
                </DetailContent>
              )}

              {this.state.sex === 0 && (
                <>
                  <BorderDash />
                  <BaseFormItem type="flex" align="middle">
                    <div style={{ color: "#5CB5F3" }}>精液分析</div>
                  </BaseFormItem>
                  <DetailContent>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={70}>日期</BaseLabel>
                      <BaseDatepicker
                        height={26}
                        value={
                          twentyData.semenAnalysisDate
                            ? moment(twentyData.semenAnalysisDate)
                            : ""
                        }
                        onChange={(date, dateString) =>
                          this.updateBirthData(
                            "twentyData",
                            "semenAnalysisDate",
                            dateString
                          )
                        }
                      />
                      <BaseLabel width={70}>禁欲</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 60, marginRight: "12px" }}
                        value={twentyData.abstinenceDays}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "abstinenceDays",
                            e
                          )
                        }
                      />
                      <div>天</div>
                      <BaseLabel width={90}>液化状态</BaseLabel>
                      <BaseSelect
                        style={{ marginRight: "12px" }}
                        width={120}
                        height={26}
                        value={twentyData.liquefaction}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "liquefaction", e)
                        }
                      >
                        {renderOptions(optionsAfterbirth, "250")}
                      </BaseSelect>
                      <BaseLabel width={70}>液化时间</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 60, marginRight: "12px" }}
                        value={twentyData.liquefactionTime}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "liquefactionTime",
                            e
                          )
                        }
                      />
                      <div>min</div>
                      <BaseLabel width={50}>色</BaseLabel>
                      <BaseSelect
                        style={{ marginRight: "12px" }}
                        width={120}
                        height={26}
                        value={twentyData.semenColor}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "semenColor", e)
                        }
                      >
                        {renderOptions(optionsAfterbirth, "251")}
                      </BaseSelect>
                      <BaseLabel width={70}>粘稠度</BaseLabel>
                      <BaseSelect
                        style={{ marginRight: "12px" }}
                        width={120}
                        height={26}
                        value={twentyData.viscosity}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "viscosity", e)
                        }
                      >
                        {renderOptions(optionsAfterbirth, "252")}
                      </BaseSelect>
                      <BaseLabel width={50}>PH</BaseLabel>
                      <FontInput
                        style={{ width: 60 }}
                        value={twentyData.ph}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "ph",
                            e.target.value
                          )
                        }
                      />
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={70}>精液量</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 60, marginRight: "12px" }}
                        value={twentyData.semenVolume}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "semenVolume", e)
                        }
                      />
                      <div>ml</div>
                      <BaseLabel width={70}>浓度</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 60, marginRight: "12px" }}
                        value={twentyData.concentration}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "concentration", e)
                        }
                      />
                      <div>x10^6/ml</div>
                      <BaseLabel width={70}>存活率</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 60, marginRight: "12px" }}
                        value={twentyData.survivalRate}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "survivalRate", e)
                        }
                      />
                      <div>%</div>
                      <BaseLabel width={100}>前向运动PR</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 60, marginRight: "12px" }}
                        value={twentyData.pr}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "pr", e)
                        }
                      />
                      <div>%</div>
                      <BaseLabel width={50}>NP</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 60, marginRight: "12px" }}
                        value={twentyData.np}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "np", e)
                        }
                      />
                      <div>%</div>
                      <BaseLabel width={50}>IM</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 60, marginRight: "12px" }}
                        value={twentyData.im}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "im", e)
                        }
                      />
                      <div>%</div>
                      <BaseLabel width={50}>活力</BaseLabel>
                      <FontInput
                        style={{ width: 60 }}
                        value={twentyData.vitality}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "vitality",
                            e.target.value
                          )
                        }
                      />
                    </BaseFormItem>
                  </DetailContent>
                </>
              )}
              {this.state.sex === 1 && (
                <>
                  <BorderDash />
                  <BaseFormItem type="flex" align="middle">
                    <div style={{ color: "#5CB5F3" }}>妇科检查</div>
                  </BaseFormItem>
                  <DetailContent>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>外阴</BaseLabel>
                      <BaseLabel width={50}>发育</BaseLabel>
                      <Radio.Group
                        value={twentyData.vulvalDevelopment}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "vulvalDevelopment",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                      <BaseLabel width={70}>阴毛分布</BaseLabel>
                      <Radio.Group
                        value={twentyData.pubicHairDistribution}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "pubicHairDistribution",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                      <BaseLabel width={50}>形态</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={twentyData.pubicHairPattern}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "pubicHairPattern",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "255")}
                      </BaseSelect>
                      <BaseLabel width={70}>畸形</BaseLabel>
                      <Switch
                        checked={twentyData.pubicHairDeformity}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "pubicHairDeformity",
                            +e
                          )
                        }
                      />
                      {twentyData.pubicHairDeformity === 1 && (
                        <>
                          <BaseLabel width={50}>说明</BaseLabel>
                          <FontInput
                            style={{ width: 200 }}
                            value={twentyData.pubicHairDeformityDatail}
                            onChange={(e) =>
                              this.updateBirthData(
                                "twentyData",
                                "pubicHairDeformityDatail",
                                e.target.value
                              )
                            }
                          />
                        </>
                      )}
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>阴道</BaseLabel>
                      <Radio.Group
                        value={twentyData.vaginal}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "vaginal",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>通畅</Radio>
                        <Radio value={0}>不通畅</Radio>
                      </Radio.Group>
                      <BaseLabel width={90}>分泌物</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={twentyData.vaginalDischarge}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "vaginalDischarge",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "256")}
                      </BaseSelect>
                      <BaseLabel width={70}>黏膜</BaseLabel>
                      <Radio.Group
                        value={twentyData.mucosa}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "mucosa",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                      <BaseLabel width={70}>气味</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={twentyData.scent}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "scent", e)
                        }
                      >
                        {renderOptions(optionsAfterbirth, "64")}
                      </BaseSelect>
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>宫颈</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={twentyData.cervix}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "cervix", e)
                        }
                      >
                        {renderOptions(optionsAfterbirth, "257")}
                      </BaseSelect>
                      <BaseLabel width={70}>肥大</BaseLabel>
                      <Switch
                        checked={twentyData.hypertrophy}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "hypertrophy", +e)
                        }
                      />
                      <BaseLabel width={70}>举痛</BaseLabel>
                      <Switch
                        checked={twentyData.painLifting}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "painLifting", +e)
                        }
                      />
                      <BaseLabel width={100}>接触性出血</BaseLabel>
                      <Switch
                        checked={twentyData.contactBlood}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "contactBlood", +e)
                        }
                      />
                      <BaseLabel width={70}>息肉</BaseLabel>
                      <Switch
                        checked={twentyData.polyp}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "polyp", +e)
                        }
                      />
                      <BaseLabel width={90}>纳氏囊肿</BaseLabel>
                      <Switch
                        checked={twentyData.nanaCyst}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "nanaCyst", +e)
                        }
                      />
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>宫体</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={twentyData.palaceBody}
                        onChange={(e) =>
                          this.updateBirthData("twentyData", "palaceBody", e)
                        }
                      >
                        {renderOptions(optionsAfterbirth, "69")}
                      </BaseSelect>
                      <BaseLabel width={70}>大小</BaseLabel>
                      <Radio.Group
                        value={twentyData.palaceBodySize}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "palaceBodySize",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                      <BaseLabel width={70}>质地</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={twentyData.palaceBodyTexture}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "palaceBodyTexture",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "71")}
                      </BaseSelect>
                      <BaseLabel width={70}>活动度</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={twentyData.palaceBodyMobility}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "palaceBodyMobility",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "73")}
                      </BaseSelect>
                      <BaseLabel width={70}>压痛</BaseLabel>
                      <Switch
                        checked={twentyData.palaceBodyPressurePain}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "palaceBodyPressurePain",
                            +e
                          )
                        }
                      />
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>附件</BaseLabel>
                      <BaseLabel width={50}>左侧</BaseLabel>
                      <Radio.Group
                        value={twentyData.leftAttachment}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftAttachment",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                      <BaseLabel width={50}>压痛</BaseLabel>
                      <Switch
                        checked={twentyData.leftAttachmentPressurePain}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftAttachmentPressurePain",
                            +e
                          )
                        }
                      />
                      <BaseLabel width={70}>增厚</BaseLabel>
                      <Switch
                        checked={twentyData.leftAttachmentThicken}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftAttachmentThicken",
                            +e
                          )
                        }
                      />
                      <BaseLabel width={70}>肿块</BaseLabel>
                      <Switch
                        checked={twentyData.leftAttachmentLump}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftAttachmentLump",
                            +e
                          )
                        }
                      />
                      <BaseLabel width={70}>右侧</BaseLabel>
                      <Radio.Group
                        value={twentyData.rightAttachment}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightAttachment",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                      <BaseLabel width={70}>压痛</BaseLabel>
                      <Switch
                        checked={twentyData.rightAttachmentPressurePain}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightAttachmentPressurePain",
                            +e
                          )
                        }
                      />
                      <BaseLabel width={70}>增厚</BaseLabel>
                      <Switch
                        checked={twentyData.rightAttachmentThicken}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightAttachmentThicken",
                            +e
                          )
                        }
                      />
                      <BaseLabel width={70}>肿块</BaseLabel>
                      <Switch
                        checked={twentyData.rightAttachmentLump}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightAttachmentLump",
                            +e
                          )
                        }
                      />
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>说明</BaseLabel>
                      <FontInput
                        style={{ width: 600 }}
                        value={twentyData.gnecologicalExaminationDetail}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "gnecologicalExaminationDetail",
                            e.target.value
                          )
                        }
                      />
                    </BaseFormItem>
                  </DetailContent>
                  <BorderDash />
                  <BaseFormItem type="flex" align="middle">
                    <div style={{ color: "#5CB5F3" }}>辅助检查</div>
                  </BaseFormItem>
                  <DetailContent>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>内分泌</BaseLabel>
                      <BaseTable
                        style={{ width: 720 }}
                        columns={bloodHormonesColumns}
                        dataSource={twentyData.twentyFemaleEndocrineHormoneParams.slice()}
                        rowKey={(record) => record.uid}
                        pagination={false}
                        bordered
                      />
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>B超检查</BaseLabel>
                      <BaseLabel width={70}>子宫</BaseLabel>
                      <FontInput
                        style={{ width: 50 }}
                        value={twentyData.uterusLength}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "uterusLength",
                            e.target.value
                          )
                        }
                      />
                      <div style={{ margin: "0 4px" }}>*</div>
                      <FontInput
                        style={{ width: 50 }}
                        value={twentyData.uterusWide}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "uterusWide",
                            e.target.value
                          )
                        }
                      />
                      <div style={{ margin: "0 4px" }}>*</div>
                      <FontInput
                        style={{ width: 50 }}
                        value={twentyData.uterusHeight}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "uterusHeight",
                            e.target.value
                          )
                        }
                      />
                      <div style={{ margin: "0 4px" }}>cm</div>
                      <BaseLabel width={70}>内膜</BaseLabel>
                      <FontInput
                        style={{ width: 50, marginRight: 24 }}
                        value={twentyData.innerMembrane}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "innerMembrane",
                            e.target.value
                          )
                        }
                      />
                      <div>cm</div>
                      <BaseLabel width={70}>形态</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={twentyData.endothelialMorphology}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "endothelialMorphology",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "226")}
                      </BaseSelect>
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>左卵巢</BaseLabel>
                      <FontInput
                        style={{ width: 50 }}
                        value={twentyData.leftOvaryLenght}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftOvaryLenght",
                            e.target.value
                          )
                        }
                      />
                      <div style={{ margin: "0 4px" }}>*</div>
                      <FontInput
                        style={{ width: 50 }}
                        value={twentyData.leftOvaryWide}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftOvaryWide",
                            e.target.value
                          )
                        }
                      />
                      <div style={{ margin: "0 4px" }}>*</div>
                      <FontInput
                        style={{ width: 50 }}
                        value={twentyData.leftOvaryHeight}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftOvaryHeight",
                            e.target.value
                          )
                        }
                      />
                      <div style={{ margin: "0 4px" }}>cm</div>
                      <BaseLabel width={90}>优势卵泡</BaseLabel>
                      <FontInput
                        style={{ width: 50, marginRight: 24 }}
                        value={twentyData.leftOvaryDominantFollicle}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftOvaryDominantFollicle",
                            e.target.value
                          )
                        }
                      />
                      <div>cm</div>
                      <BaseLabel width={70}>卵泡</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 50, marginRight: "12px" }}
                        value={twentyData.leftOvaryFollicleNumber}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftOvaryFollicleNumber",
                            e
                          )
                        }
                      />
                      <div>个</div>
                      <BaseLabel width={70}>窦卵泡</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 50, marginRight: "12px" }}
                        value={twentyData.leftOvarySinusFollicleNumber}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftOvarySinusFollicleNumber",
                            e
                          )
                        }
                      />
                      <div>个</div>
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>右卵巢</BaseLabel>
                      <FontInput
                        style={{ width: 50 }}
                        value={twentyData.rightOvaryLenght}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightOvaryLenght",
                            e.target.value
                          )
                        }
                      />
                      <div style={{ margin: "0 4px" }}>*</div>
                      <FontInput
                        style={{ width: 50 }}
                        value={twentyData.rightOvaryWide}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightOvaryWide",
                            e.target.value
                          )
                        }
                      />
                      <div style={{ margin: "0 4px" }}>*</div>
                      <FontInput
                        style={{ width: 50 }}
                        value={twentyData.rightOvaryHeight}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightOvaryHeight",
                            e.target.value
                          )
                        }
                      />
                      <div style={{ margin: "0 4px" }}>cm</div>
                      <BaseLabel width={90}>优势卵泡</BaseLabel>
                      <FontInput
                        style={{ width: 50, marginRight: 24 }}
                        value={twentyData.rightOvaryDominantFollicle}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightOvaryDominantFollicle",
                            e.target.value
                          )
                        }
                      />
                      <div>cm</div>
                      <BaseLabel width={70}>卵泡</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 50, marginRight: "12px" }}
                        value={twentyData.rightOvaryFollicleNumber}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightOvaryFollicleNumber",
                            e
                          )
                        }
                      />
                      <div>个</div>
                      <BaseLabel width={70}>窦卵泡</BaseLabel>
                      <BaseInputNumber
                        min={0}
                        style={{ width: 50, marginRight: "12px" }}
                        value={twentyData.rightOvarySinusFollicleNumber}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightOvarySinusFollicleNumber",
                            e
                          )
                        }
                      />
                      <div>个</div>
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>备注</BaseLabel>
                      <FontInput
                        style={{ width: 600 }}
                        value={twentyData.ultrasoundRemark}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "ultrasoundRemark",
                            e.target.value
                          )
                        }
                      />
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>输卵管造影</BaseLabel>
                      <BaseLabel width={50}>方式</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={twentyData.fallopianTubeImagingMethod}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "fallopianTubeImagingMethod",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "282")}
                      </BaseSelect>
                      <BaseLabel width={70}>形态</BaseLabel>
                      <Radio.Group
                        value={twentyData.fallopianTubeImagingPattern}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "fallopianTubeImagingPattern",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                      <FontInput
                        style={{ width: 300 }}
                        value={twentyData.fallopianTubeDetail}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "fallopianTubeDetail",
                            e.target.value
                          )
                        }
                      />
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>左侧输卵管</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={twentyData.leftFallopianTube}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftFallopianTube",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "280")}
                      </BaseSelect>
                      <BaseLabel width={70}>形态</BaseLabel>
                      <Radio.Group
                        value={twentyData.leftFallopianTubePattern}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftFallopianTubePattern",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                      <FontInput
                        style={{ width: 300 }}
                        value={twentyData.leftFallopianTubeDetail}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "leftFallopianTubeDetail",
                            e.target.value
                          )
                        }
                      />
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>右侧输卵管</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={twentyData.rightFallopianTube}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightFallopianTube",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsAfterbirth, "280")}
                      </BaseSelect>
                      <BaseLabel width={70}>形态</BaseLabel>
                      <Radio.Group
                        value={twentyData.rightFallopianTubePattern}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightFallopianTubePattern",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                      <FontInput
                        style={{ width: 300 }}
                        value={twentyData.rightFallopianTubeDetail}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "rightFallopianTubeDetail",
                            e.target.value
                          )
                        }
                      />
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={120}>说明</BaseLabel>
                      <FontInput
                        style={{ width: 300 }}
                        value={twentyData.medicalHistoryDescription}
                        onChange={(e) =>
                          this.updateBirthData(
                            "twentyData",
                            "medicalHistoryDescription",
                            e.target.value
                          )
                        }
                      />
                    </BaseFormItem>
                  </DetailContent>
                </>
              )}
            </DetailContent>
            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">随访</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <BaseLabel width={70}>随访日</BaseLabel>
                <BaseDatepicker
                  height={26}
                  value={
                    twentyData.followDate ? moment(twentyData.followDate) : ""
                  }
                  onChange={(date, dateString) =>
                    this.updateBirthData("twentyData", "followDate", dateString)
                  }
                />
                <BaseLabel width={70}>随访人</BaseLabel>
                <BaseSelect
                  width={120}
                  height={26}
                  value={twentyData.followPerson}
                  onChange={(e) =>
                    this.updateBirthData("twentyData", "followPerson", e)
                  }
                >
                  {renderOptions(optionsAfterbirth, "198")}
                </BaseSelect>
              </BaseFormItem>
            </DetailContent>
            <BorderDash />
            <DetailTitle>
              <div className="leftborder" />
              <span className="rightmargin">复核</span>
            </DetailTitle>
            <DetailContent>
              <BaseFormItem type="flex" align="middle">
                <BaseLabel width={70}>复核日</BaseLabel>
                <BaseDatepicker
                  height={26}
                  value={
                    twentyData.reviewDate ? moment(twentyData.reviewDate) : ""
                  }
                  onChange={(date, dateString) =>
                    this.updateBirthData("twentyData", "reviewDate", dateString)
                  }
                />
                <BaseLabel width={70}>核对人</BaseLabel>
                <BaseSelect
                  width={120}
                  height={26}
                  value={twentyData.reviewPerson}
                  onChange={(e) =>
                    this.updateBirthData("twentyData", "reviewPerson", e)
                  }
                >
                  {renderOptions(optionsAfterbirth, "198")}
                </BaseSelect>
              </BaseFormItem>
              <BaseFormItem
                type="flex"
                align="middle"
                justify="center"
                style={{ paddingBottom: 30 }}
              >
                <Button type="primary" onClick={() => this.saveTwenty()}>
                  保存
                </Button>
              </BaseFormItem>
            </DetailContent>
          </>
        )
      default:
        return null
    }
  }
  // 查找出不是今天的数据
  getNotDay = () => {
    let { detailData } = this.props.follow
    let datas = []
    let oldData = [
      ...detailData.pregnancyTestRecordParam.followUpBloodHormoneParams,
    ]
    oldData.forEach((item, index) => {
      if (item.date !== moment(new Date()).format("YYYY-MM-DD")) {
        datas.push({ ...item })
      }
    })
    return datas
  }
  // 获取LIS数据
  getLis = () => {
    let { detailData } = this.props.follow
    const { surgeryDate } = JSON.parse(localStorage.getItem("followrecord"))
    let pid = JSON.parse(localStorage.getItem("followrecord")).pid
    let obj = {
      date: moment(new Date()).format("YYYY-MM-DD"),
    }
    let datas = []
    apis.getList.getAllBloodList(pid, obj).then((res) => {
      if (res.code === 200) {
        if (res.data !== null) {
          res.data.forEach((item, index) => {
            datas.push({
              ...item,
              date: item.visitDate,
              afterDays: moment(item.visitDate).diff(
                moment(surgeryDate),
                "days"
              ),
            })
          })
          detailData.pregnancyTestRecordParam.followUpBloodHormoneParams = [
            ...datas,
            ...this.getNotDay(),
          ]
        } else {
          message.warning("今日没有LIS数据！")
        }
      } else {
        message.error(res.message)
      }
    })
  }

  render() {
    const { page } = this.props
    const {
      setDetailData,
      detailData,
      afterbirthDetailData,
      setProductionDetailData,
      productionDetailData,
      renderOptions,
      optionsPregnancy,
      optionsProduction,
      saveEarlyPregnancy,
      saveMidPregnancy,
      saveScreening,
    } = this.props.follow
    const complicationDTOs = detailData.complicationDTOs
    const productionComplicationDTOs = productionDetailData.complicationDTOs
    const followUpBloodHormoneParams =
      detailData.pregnancyTestRecordParam.followUpBloodHormoneParams || []
    const ultrasoundChartPregnancyParams =
      detailData.ultrasoundChartPregnancyParams
    const newbornConditionDTOs =
      detailData.parturitionParam.newbornConditionDTOs
    const earlyUltrasoundPregnancyParams =
      productionDetailData.earlyPregnancyParam.earlyUltrasoundPregnancyParams
    const midUltrasoundPregnancyParams =
      productionDetailData.midPregnancyParam.midUltrasoundPregnancyParams
    const antenatalScreeningAmniocentesisParams =
      productionDetailData.antenatalScreeningParam
        .antenatalScreeningAmniocentesisParams
    const columns = [
      {
        title: "日期",
        width: "26%",
        dataIndex: "date",
        render: (text, record, index) => {
          return (
            <>
              {record.editTag === 1 ? (
                <BaseDatepicker
                  height={26}
                  value={record.date ? moment(record.date) : ""}
                  onBlur={() => this.onBlur(record, index)}
                  onChange={(date, dateString) =>
                    this.handleDetailChange(
                      "pregnancyTestRecordParam",
                      "followUpBloodHormoneParams",
                      "date",
                      dateString,
                      index
                    )
                  }
                />
              ) : (
                <div>{text}</div>
              )}
            </>
          )
        },
      },
      {
        title: "受精/移植后",
        width: "18%",
        dataIndex: "afterDays",
        render: (text, record, index) => {
          return (
            <>
              <FontInput
                height={26}
                value={record.afterDays}
                readOnly={record.date}
                onBlur={() => this.onBlur(record, index)}
                onChange={(e) =>
                  this.handleDetailChange(
                    "pregnancyTestRecordParam",
                    "followUpBloodHormoneParams",
                    "afterDays",
                    e.target.value,
                    index
                  )
                }
              />
            </>
          )
        },
      },
      {
        title: "血HCG(mIUml)",
        width: "20%",
        dataIndex: "hcg",
        render: (text, record, index) => {
          return (
            <>
              {record.editTag === 1 ? (
                <FontInput
                  height={26}
                  value={record.hcg}
                  onBlur={() => this.onBlur(record, index)}
                  onChange={(e) =>
                    this.handleDetailChange(
                      "pregnancyTestRecordParam",
                      "followUpBloodHormoneParams",
                      "hcg",
                      e.target.value,
                      index
                    )
                  }
                />
              ) : (
                <div>{text}</div>
              )}
            </>
          )
        },
      },
      {
        title: "P(ngml)",
        dataIndex: "p",
        render: (text, record, index) => {
          return (
            <>
              {record.editTag === 1 ? (
                <FontInput
                  height={26}
                  value={record.p}
                  onBlur={() => this.onBlur(record, index)}
                  onChange={(e) =>
                    this.handleDetailChange(
                      "pregnancyTestRecordParam",
                      "followUpBloodHormoneParams",
                      "p",
                      e.target.value,
                      index
                    )
                  }
                />
              ) : (
                <div>{text}</div>
              )}
            </>
          )
        },
      },
      {
        title: "E2(pmolL)",
        dataIndex: "e2",
        render: (text, record, index) => {
          return (
            <>
              {record.editTag === 1 ? (
                <FontInput
                  height={26}
                  value={record.e2}
                  onBlur={() => this.onBlur(record, index)}
                  onChange={(e) =>
                    this.handleDetailChange(
                      "pregnancyTestRecordParam",
                      "followUpBloodHormoneParams",
                      "e2",
                      e.target.value,
                      index
                    )
                  }
                />
              ) : (
                <div>{text}</div>
              )}
            </>
          )
        },
      },
      {
        title: "",
        dataIndex: "",
        render: (text, record, index) => {
          return (
            <>
              {record.editTag === 1 ? (
                <DashBtn>
                  <MinusOutlined
                    onClick={() =>
                      this.deletepColumns(
                        "pregnancyTestRecordParam",
                        "followUpBloodHormoneParams",
                        index
                      )
                    }
                  />
                </DashBtn>
              ) : null}
            </>
          )
        },
      },
    ]
    const UltrasoundColumns = [
      {
        title: "日期",
        width: "20%",
        dataIndex: "date",
        render: (text, record, index) => {
          return (
            <BaseDatepicker
              height={26}
              value={record.date ? moment(record.date) : ""}
              onBlur={() => this.onUltrasoundBlur(record, index)}
              onChange={(date, dateString) =>
                this.handleUltrasoundChange(
                  "ultrasoundChartPregnancyParams",
                  "date",
                  dateString,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "孕囊数",
        dataIndex: "gestationalSacsNumber",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.gestationalSacsNumber}
              onBlur={() => this.onUltrasoundBlur(record, index)}
              onChange={(e) =>
                this.handleUltrasoundChange(
                  "ultrasoundChartPregnancyParams",
                  "gestationalSacsNumber",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "单卵双胚",
        dataIndex: "monozygoticTwin",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.monozygoticTwin}
              onBlur={() => this.onUltrasoundBlur(record, index)}
              onChange={(e) =>
                this.handleUltrasoundChange(
                  "ultrasoundChartPregnancyParams",
                  "monozygoticTwin",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "胚芽",
        dataIndex: "germ",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.germ}
              onBlur={() => this.onUltrasoundBlur(record, index)}
              onChange={(e) =>
                this.handleUltrasoundChange(
                  "ultrasoundChartPregnancyParams",
                  "germ",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "胎心数",
        dataIndex: "fetalHeartCount",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.fetalHeartCount}
              onBlur={() => this.onUltrasoundBlur(record, index)}
              onChange={(e) =>
                this.handleUltrasoundChange(
                  "ultrasoundChartPregnancyParams",
                  "fetalHeartCount",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "心芽搏动",
        dataIndex: "heartBudPulsation",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.heartBudPulsation}
              onBlur={() => this.onUltrasoundBlur(record, index)}
              onChange={(e) =>
                this.handleUltrasoundChange(
                  "ultrasoundChartPregnancyParams",
                  "heartBudPulsation",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "孕囊大小",
        dataIndex: "gestationalSacSize",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.gestationalSacSize}
              onBlur={() => this.onUltrasoundBlur(record, index)}
              onChange={(e) =>
                this.handleUltrasoundChange(
                  "ultrasoundChartPregnancyParams",
                  "gestationalSacSize",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "",
        dataIndex: "",
        render: (text, record, index) => {
          return (
            <>
              <DashBtn>
                <MinusOutlined
                  onClick={() =>
                    this.deletepUltrasound(
                      "ultrasoundChartPregnancyParams",
                      index
                    )
                  }
                />
              </DashBtn>
            </>
          )
        },
      },
    ]

    const newbornConditionColumns = [
      {
        title: "存活情况",
        dataIndex: "survival",
        render: (text, record, index) => {
          return (
            <BaseSelect
              height={26}
              width={100}
              value={record.survival}
              onBlur={() => this.onNewBornBlur(record, index)}
              onChange={(e) =>
                this.handleDetailChange(
                  "parturitionParam",
                  "newbornConditionDTOs",
                  "survival",
                  e,
                  index
                )
              }
            >
              {renderOptions(optionsPregnancy, "100")}
            </BaseSelect>
          )
        },
      },
      {
        title: "性别",
        dataIndex: "sex",
        render: (text, record, index) => {
          return (
            <Select
              height={26}
              style={{ width: 80 }}
              value={record.sex}
              onBlur={() => this.onNewBornBlur(record, index)}
              onChange={(e) =>
                this.handleDetailChange(
                  "parturitionParam",
                  "newbornConditionDTOs",
                  "sex",
                  e,
                  index
                )
              }
            >
              <Option key={0} value={0}>
                男
              </Option>
              <Option key={1} value={1}>
                女
              </Option>
            </Select>
          )
        },
      },
      {
        title: "Apgar评分",
        width: "15%",
        dataIndex: "apgarScore",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.apgarScore}
              onBlur={() => this.onNewBornBlur(record, index)}
              onChange={(e) =>
                this.handleDetailChange(
                  "parturitionParam",
                  "newbornConditionDTOs",
                  "apgarScore",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "体重(g)",
        width: "15%",
        dataIndex: "weight",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.weight}
              onBlur={() => this.onNewBornBlur(record, index)}
              onChange={(e) =>
                this.handleDetailChange(
                  "parturitionParam",
                  "newbornConditionDTOs",
                  "weight",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "身长(cm)",
        width: "15%",
        dataIndex: "height",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.height}
              onBlur={() => this.onNewBornBlur(record, index)}
              onChange={(e) =>
                this.handleDetailChange(
                  "parturitionParam",
                  "newbornConditionDTOs",
                  "height",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "健康状况",
        width: "15%",
        dataIndex: "healthStatus",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.healthStatus}
              onBlur={() => this.onNewBornBlur(record, index)}
              onChange={(e) =>
                this.handleDetailChange(
                  "parturitionParam",
                  "newbornConditionDTOs",
                  "healthStatus",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "出生缺陷",
        width: "15%",
        dataIndex: "birthDefect",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.birthDefect}
              onBlur={() => this.onNewBornBlur(record, index)}
              onChange={(e) =>
                this.handleDetailChange(
                  "parturitionParam",
                  "newbornConditionDTOs",
                  "birthDefect",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "其他",
        width: "25%",
        dataIndex: "elseDescription",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.elseDescription}
              onBlur={() => this.onNewBornBlur(record, index)}
              onChange={(e) =>
                this.handleDetailChange(
                  "parturitionParam",
                  "newbornConditionDTOs",
                  "elseDescription",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "",
        dataIndex: "",
        render: (text, record, index) => {
          return (
            <>
              <DashBtn>
                <MinusOutlined
                  onClick={() =>
                    this.deletepColumns(
                      "parturitionParam",
                      "newbornConditionDTOs",
                      index
                    )
                  }
                />
              </DashBtn>
            </>
          )
        },
      },
    ]

    const earlyPregnancyColumns = [
      {
        title: "日期",
        width: "20%",
        dataIndex: "date",
        render: (text, record, index) => {
          if (!record.date) {
            record.date = moment(new Date()).format("YYYY-MM-DD")
          }
          return (
            <BaseDatepicker
              height={26}
              value={moment(record.date)}
              onChange={(date, dateString) =>
                this.handleProductionChange(
                  "earlyPregnancyParam",
                  "earlyUltrasoundPregnancyParams",
                  "date",
                  dateString,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "孕期(周)",
        width: "15%",
        dataIndex: "pregnancyWeeks",
        render: (text, record, index) => {
          return <div>{text}</div>
        },
      },
      {
        title: "BPD(cm)",
        dataIndex: "bpd",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.bpd}
              onChange={(e) =>
                this.handleProductionChange(
                  "earlyPregnancyParam",
                  "earlyUltrasoundPregnancyParams",
                  "bpd",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "CRL(cm)",
        dataIndex: "crl",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.crl}
              onChange={(e) =>
                this.handleProductionChange(
                  "earlyPregnancyParam",
                  "earlyUltrasoundPregnancyParams",
                  "crl",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "NT(cm)",
        dataIndex: "nt",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.nt}
              onChange={(e) =>
                this.handleProductionChange(
                  "earlyPregnancyParam",
                  "earlyUltrasoundPregnancyParams",
                  "nt",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "其他",
        width: "20%",
        dataIndex: "elseRecord",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.elseRecord}
              onChange={(e) =>
                this.handleProductionChange(
                  "earlyPregnancyParam",
                  "earlyUltrasoundPregnancyParams",
                  "elseRecord",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "",
        dataIndex: "a",
        render: (text, record, index) => {
          const obj = {
            children: (
              <DashBtn>
                <MinusOutlined
                  onClick={() =>
                    this.deleteEarlyPregnancyParam(record.batchTag)
                  }
                />
              </DashBtn>
            ),
            props: {},
          }
          obj.props.rowSpan = record.num
          return obj
        },
      },
    ]

    const midPregnancyColumns = [
      {
        title: "日期",
        width: "20%",
        dataIndex: "date",
        render: (text, record, index) => {
          if (!record.date) {
            record.date = moment(new Date()).format("YYYY-MM-DD")
          }
          return (
            <BaseDatepicker
              height={26}
              value={moment(record.date)}
              onChange={(date, dateString) =>
                this.handleProductionChange(
                  "midPregnancyParam",
                  "midUltrasoundPregnancyParams",
                  "date",
                  dateString,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "孕期(周)",
        width: "12%",
        dataIndex: "pregnancyWeeks",
        render: (text, record, index) => {
          return <div>{text}</div>
        },
      },
      {
        title: "BPD(cm)",
        dataIndex: "bpd",
        width: "8%",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.bpd}
              onChange={(e) =>
                this.handleProductionChange(
                  "midPregnancyParam",
                  "midUltrasoundPregnancyParams",
                  "bpd",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "AFI(cm)",
        dataIndex: "afi",
        width: "8%",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.afi}
              onChange={(e) =>
                this.handleProductionChange(
                  "midPregnancyParam",
                  "midUltrasoundPregnancyParams",
                  "afi",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "羊水量",
        width: "8%",
        dataIndex: "amnioticFluidVolume",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.amnioticFluidVolume}
              onChange={(e) =>
                this.handleProductionChange(
                  "midPregnancyParam",
                  "midUltrasoundPregnancyParams",
                  "amnioticFluidVolume",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "最大羊水量深度(cm)",
        width: "18%",
        dataIndex: "maxAmnioticFluidDepth",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.maxAmnioticFluidDepth}
              onChange={(e) =>
                this.handleProductionChange(
                  "midPregnancyParam",
                  "midUltrasoundPregnancyParams",
                  "maxAmnioticFluidDepth",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "股骨(cm)",
        width: "9%",
        dataIndex: "femur",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.femur}
              onChange={(e) =>
                this.handleProductionChange(
                  "midPregnancyParam",
                  "midUltrasoundPregnancyParams",
                  "femur",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "其他",
        width: "22%",
        dataIndex: "elseRecord",
        render: (text, record, index) => {
          return (
            <FontInput
              value={record.elseRecord}
              onChange={(e) =>
                this.handleProductionChange(
                  "midPregnancyParam",
                  "midUltrasoundPregnancyParams",
                  "elseRecord",
                  e.target.value,
                  index
                )
              }
            />
          )
        },
      },
      {
        title: "",
        width: "3%",
        dataIndex: "a",
        render: (text, record, index) => {
          const obj = {
            children: (
              <DashBtn>
                <MinusOutlined
                  onClick={() => this.deleteMidPregnancyParam(record.batchTag)}
                />
              </DashBtn>
            ),
            props: {},
          }
          obj.props.rowSpan = record.num
          return obj
        },
      },
    ]

    const afterbirthColumns = [
      {
        title: "阶段",
        dataIndex: "followStage",
        render: (text, record) => {
          return <div>{text}</div>
        },
      },
      {
        title: "状态",
        dataIndex: "followState",
        render: (text, record, index) => {
          return (
            <div>
              {text === 0 ? (
                <span style={{ color: "#FFA25C" }}>待随访</span>
              ) : text === 1 ? (
                <span style={{ color: "#59B4F4" }}>已随访</span>
              ) : (
                <span style={{ color: "#999999" }}>已过期</span>
              )}
            </div>
          )
        },
      },
      {
        title: "随访日",
        dataIndex: "followDate",
        render: (text, record, index) => {
          return <div>{text}</div>
        },
      },
      {
        title: "随访人",
        dataIndex: "followPerson",
        render: (text, record, index) => {
          return <div>{text}</div>
        },
      },
    ]

    return (
      <div className="followDetail">
        <StyledTabs
          onChange={(key) => this.setCurTabpane(key)}
          activeKey={this.curTabpane}
          name={page}
        >
          <TabPane tab="妊娠" key="gestation">
            <DetailWarp>
              <DetailTitle>
                <div className="leftborder" />
                <span className="rightmargin">验孕记录</span>
              </DetailTitle>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>月经来潮</BaseLabel>
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    checked={
                      detailData.pregnancyTestRecordParam.menstrualFlowFlag
                    }
                    onChange={(e) =>
                      setDetailData(
                        "pregnancyTestRecordParam",
                        "menstrualFlowFlag",
                        +e
                      )
                    }
                  />
                  {detailData.pregnancyTestRecordParam.menstrualFlowFlag ===
                    1 && (
                    <>
                      <BaseLabel width={70}>日期</BaseLabel>
                      <BaseDatepicker
                        height={26}
                        value={
                          detailData.pregnancyTestRecordParam &&
                          detailData.pregnancyTestRecordParam.menstrualFlowDate
                            ? moment(
                                detailData.pregnancyTestRecordParam
                                  .menstrualFlowDate
                              )
                            : ""
                        }
                        onChange={(date, dateString) =>
                          setDetailData(
                            "pregnancyTestRecordParam",
                            "menstrualFlowDate",
                            dateString
                          )
                        }
                      />
                    </>
                  )}
                </BaseFormItem>

                <BaseFormItem type="flex" align="middle">
                  <Button
                    type="primary"
                    style={{ margin: "-42px 10px 0 0" }}
                    onClick={this.getLis}
                  >
                    LIS 获取
                  </Button>
                  <BaseTable
                    style={{ width: 565 }}
                    columns={columns}
                    dataSource={followUpBloodHormoneParams.slice()}
                    rowKey={(record) => record.uid}
                    pagination={false}
                    bordered
                  />
                </BaseFormItem>

                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>阴道流血</BaseLabel>
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    checked={
                      detailData.pregnancyTestRecordParam.vaginalBleedingFlag
                    }
                    onChange={(e) =>
                      setDetailData(
                        "pregnancyTestRecordParam",
                        "vaginalBleedingFlag",
                        +e
                      )
                    }
                  />
                  {detailData.pregnancyTestRecordParam.vaginalBleedingFlag ===
                    1 && (
                    <>
                      <BaseLabel width={90}>治疗方式</BaseLabel>

                      <BaseSelect
                        width={120}
                        height={26}
                        value={detailData.pregnancyTestRecordParam.treatment}
                        onChange={(e) =>
                          setDetailData(
                            "pregnancyTestRecordParam",
                            "treatment",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsPregnancy, "236")}
                      </BaseSelect>
                    </>
                  )}

                  <BaseLabel width={70}>腹胀</BaseLabel>
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    checked={
                      detailData.pregnancyTestRecordParam.abdominalDistention
                    }
                    onChange={(e) =>
                      setDetailData(
                        "pregnancyTestRecordParam",
                        "abdominalDistention",
                        +e
                      )
                    }
                  />
                  <BaseLabel width={70}>腹痛</BaseLabel>
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    checked={detailData.pregnancyTestRecordParam.abdominalPain}
                    onChange={(e) =>
                      setDetailData(
                        "pregnancyTestRecordParam",
                        "abdominalPain",
                        +e
                      )
                    }
                  />
                </BaseFormItem>
              </DetailContent>
              {detailData.pregnancyStatus &&
                detailData.pregnancyStatus.endingTag === 1 && (
                  <>
                    <BorderDash />
                    <DetailTitle>
                      <div className="leftborder" />
                      <span className="rightmargin">B超记录</span>
                    </DetailTitle>
                    <DetailContent>
                      <BaseFormItem type="flex" align="middle">
                        <BaseTable
                          style={{ width: 720 }}
                          columns={UltrasoundColumns}
                          dataSource={ultrasoundChartPregnancyParams.slice()}
                          rowKey={(record) => record.uid}
                          pagination={false}
                          bordered
                        />
                      </BaseFormItem>
                    </DetailContent>
                  </>
                )}
              <BorderDash />
              <DetailTitle>
                <div className="leftborder" />
                <span className="rightmargin">妊娠情况</span>
              </DetailTitle>
              <DetailContent>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>结局</BaseLabel>
                  <Radio.Group
                    value={
                      detailData.pregnancyStatus &&
                      detailData.pregnancyStatus.endingTag
                    }
                    onChange={(e) =>
                      setDetailData(
                        "pregnancyStatus",
                        "endingTag",
                        e.target.value
                      )
                    }
                  >
                    <Radio value={1}>妊娠</Radio>
                    <Radio value={0}>未孕</Radio>
                  </Radio.Group>
                  {detailData.pregnancyStatus &&
                    detailData.pregnancyStatus.endingTag === 1 && (
                      <BaseSelect
                        width={120}
                        height={26}
                        value={
                          detailData.pregnancyStatus &&
                          detailData.pregnancyStatus.ending
                        }
                        onChange={(e) => {
                          setDetailData("pregnancyStatus", "ending", e)
                        }}
                      >
                        {renderOptions(optionsPregnancy, "237")}
                      </BaseSelect>
                    )}
                </BaseFormItem>
                <BaseFormItem type="flex" align="middle">
                  <BaseLabel width={70}>随访日</BaseLabel>

                  <BaseDatepicker
                    height={26}
                    value={
                      detailData.pregnancyStatus &&
                      detailData.pregnancyStatus.followDate
                        ? moment(detailData.pregnancyStatus.followDate)
                        : ""
                    }
                    onChange={(date, dateString) =>
                      setDetailData("pregnancyStatus", "followDate", dateString)
                    }
                  />
                  <BaseLabel width={120}>随访人</BaseLabel>
                  <BaseSelect
                    width={120}
                    height={26}
                    value={
                      detailData.pregnancyStatus &&
                      detailData.pregnancyStatus.followPerson
                    }
                    onChange={(e) =>
                      setDetailData("pregnancyStatus", "followPerson", e)
                    }
                  >
                    {renderOptions(optionsPregnancy, "198")}
                  </BaseSelect>
                </BaseFormItem>
              </DetailContent>
              {detailData.pregnancyStatus &&
                (detailData.pregnancyStatus.ending === "妊娠" ||
                  detailData.pregnancyStatus.ending === "流产" ||
                  detailData.pregnancyStatus.ending === "分娩") &&
                detailData.pregnancyStatus.endingTag === 1 && (
                  <>
                    <BorderDash />
                    <DetailTitle>
                      <div className="leftborder" />
                      <span className="rightmargin">临床妊娠</span>
                    </DetailTitle>
                    <DetailContent>
                      <BaseFormItem type="flex" align="middle">
                        <BaseLabel width={70}>妊娠类型</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={
                            detailData.clinicalPeriodParam &&
                            detailData.clinicalPeriodParam.pregnancyType
                          }
                          onChange={(e) =>
                            setDetailData(
                              "clinicalPeriodParam",
                              "pregnancyType",
                              e
                            )
                          }
                        >
                          {renderOptions(optionsPregnancy, "92")}
                        </BaseSelect>
                        <BaseLabel width={70}>检查日</BaseLabel>
                        <BaseDatepicker
                          height={26}
                          value={
                            detailData.clinicalPeriodParam.inspectionDay
                              ? moment(
                                  detailData.clinicalPeriodParam.inspectionDay
                                )
                              : ""
                          }
                          onChange={(date, dateString) =>
                            this.setInspectionDay(dateString)
                          }
                        />
                        <BaseLabel width={70}>移植后</BaseLabel>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, marginRight: 12 }}
                          value={
                            detailData.clinicalPeriodParam.afterTransplantWeeks
                          }
                          onChange={(e) =>
                            setDetailData(
                              "clinicalPeriodParam",
                              "afterTransplantWeeks",
                              e
                            )
                          }
                        />
                        <span>周</span>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, margin: "0 12px" }}
                          value={
                            detailData.clinicalPeriodParam.afterTransplantDays
                          }
                          onChange={(e) =>
                            setDetailData(
                              "clinicalPeriodParam",
                              "afterTransplantDays",
                              e
                            )
                          }
                        />
                        <span>天</span>
                        <BaseLabel width={90}>妊娠天数</BaseLabel>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80 }}
                          value={detailData.clinicalPeriodParam.gestationDays}
                          readOnly={
                            detailData.clinicalPeriodParam.inspectionDay
                          }
                          onChange={(e) =>
                            setDetailData(
                              "clinicalPeriodParam",
                              "gestationDays",
                              e
                            )
                          }
                        />
                      </BaseFormItem>
                      {detailData.clinicalPeriodParam.pregnancyType !==
                        "宫外妊娠" && (
                        <BaseFormItem type="flex" align="middle">
                          <BaseLabel width={90}>宫内孕囊数</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80 }}
                            readOnly
                            value={
                              detailData.clinicalPeriodParam
                                .intrauterineSacsNumber
                            }
                            onChange={(e) =>
                              setDetailData(
                                "clinicalPeriodParam",
                                "intrauterineSacsNumber",
                                e
                              )
                            }
                          />
                          <BaseLabel width={70}>胎心数</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80 }}
                            readOnly
                            value={
                              detailData.clinicalPeriodParam.fetalHeartNumber
                            }
                            onChange={(e) =>
                              setDetailData(
                                "clinicalPeriodParam",
                                "fetalHeartNumber",
                                e
                              )
                            }
                          />
                          <Checkbox
                            style={{ marginLeft: 24 }}
                            checked={
                              detailData.clinicalPeriodParam.monozygoticTwinTag
                            }
                            onChange={(e) =>
                              setDetailData(
                                "clinicalPeriodParam",
                                "monozygoticTwinTag",
                                +e.target.checked
                              )
                            }
                          >
                            单卵双胎
                          </Checkbox>
                          <BaseLabel width={70}>诊断</BaseLabel>
                          <BaseSelect
                            width={120}
                            height={26}
                            value={
                              detailData.clinicalPeriodParam &&
                              detailData.clinicalPeriodParam.diagnosis
                            }
                            onChange={(e) =>
                              setDetailData(
                                "clinicalPeriodParam",
                                "diagnosis",
                                e
                              )
                            }
                          >
                            {renderOptions(optionsPregnancy, "91")}
                          </BaseSelect>
                          {detailData.clinicalPeriodParam.pregnancyType ===
                            "宫内妊娠" && (
                            <>
                              <BaseLabel width={90}>说明</BaseLabel>
                              <FontInput
                                style={{ width: 680 }}
                                value={
                                  detailData.clinicalPeriodParam &&
                                  detailData.clinicalPeriodParam.description
                                }
                                onChange={(e) =>
                                  setDetailData(
                                    "clinicalPeriodParam",
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </>
                          )}
                        </BaseFormItem>
                      )}

                      {(detailData.clinicalPeriodParam.pregnancyType ===
                        "宫内外妊娠" ||
                        detailData.clinicalPeriodParam.pregnancyType ===
                          "宫外妊娠") && (
                        <>
                          <BaseFormItem type="flex" align="middle">
                            <div style={{ color: "#5CB5F3" }}>异位妊娠</div>
                            <BaseLabel width={90}>检查日</BaseLabel>
                            <BaseDatepicker
                              height={26}
                              value={
                                detailData.clinicalPeriodParam
                                  .ectopicPregnancyDate
                                  ? moment(
                                      detailData.clinicalPeriodParam
                                        .ectopicPregnancyDate
                                    )
                                  : ""
                              }
                              onChange={(date, dateString) =>
                                setDetailData(
                                  "clinicalPeriodParam",
                                  "ectopicPregnancyDate",
                                  dateString
                                )
                              }
                            />
                            <BaseLabel width={90}>宫外胎数</BaseLabel>
                            <BaseInputNumber
                              min={0}
                              style={{ width: 80 }}
                              value={
                                detailData.clinicalPeriodParam
                                  .ectopicFetusesNumber
                              }
                              onChange={(e) =>
                                setDetailData(
                                  "clinicalPeriodParam",
                                  "ectopicFetusesNumber",
                                  e
                                )
                              }
                            />
                            <BaseLabel width={90}>妊娠部位</BaseLabel>
                            <BaseSelect
                              width={120}
                              height={26}
                              value={
                                detailData.clinicalPeriodParam &&
                                detailData.clinicalPeriodParam.pregnancySite
                              }
                              onChange={(e) =>
                                setDetailData(
                                  "clinicalPeriodParam",
                                  "pregnancySite",
                                  e
                                )
                              }
                            >
                              {renderOptions(optionsPregnancy, "220")}
                            </BaseSelect>
                            <BaseLabel width={90}>治疗方式</BaseLabel>
                            <BaseSelect
                              width={120}
                              height={26}
                              value={
                                detailData.clinicalPeriodParam &&
                                detailData.clinicalPeriodParam.treatmentModality
                              }
                              onChange={(e) =>
                                setDetailData(
                                  "clinicalPeriodParam",
                                  "treatmentModality",
                                  e
                                )
                              }
                            >
                              {renderOptions(optionsPregnancy, "94")}
                            </BaseSelect>
                          </BaseFormItem>
                          <BaseFormItem type="flex" align="middle">
                            <BaseLabel width={90}>说明</BaseLabel>
                            <FontInput
                              style={{ width: 680 }}
                              height={26}
                              value={
                                detailData.clinicalPeriodParam &&
                                detailData.clinicalPeriodParam.description
                              }
                              onChange={(e) =>
                                setDetailData(
                                  "clinicalPeriodParam",
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </BaseFormItem>
                        </>
                      )}
                      {detailData.clinicalPeriodParam.pregnancyType ===
                        "宫内妊娠" && (
                        <>
                          <BaseFormItem type="flex" align="middle">
                            <Checkbox
                              style={{ marginLeft: 24 }}
                              checked={
                                detailData.clinicalPeriodParam
                                  .surgicalFetalReductionTag
                              }
                              onChange={(e) =>
                                setDetailData(
                                  "clinicalPeriodParam",
                                  "surgicalFetalReductionTag",
                                  +e.target.checked
                                )
                              }
                            >
                              手术减胎
                            </Checkbox>
                            <div>减胎数</div>
                            <BaseInputNumber
                              min={0}
                              style={{ width: 80, marginLeft: 12 }}
                              value={
                                detailData.clinicalPeriodParam
                                  .surgicalFetalReductionNumber
                              }
                              onChange={(e) =>
                                setDetailData(
                                  "clinicalPeriodParam",
                                  "surgicalFetalReductionNumber",
                                  e
                                )
                              }
                            />

                            <Checkbox
                              style={{ marginLeft: 24 }}
                              checked={
                                detailData.clinicalPeriodParam
                                  .naturalTireReductionTag
                              }
                              onChange={(e) =>
                                setDetailData(
                                  "clinicalPeriodParam",
                                  "naturalTireReductionTag",
                                  +e.target.checked
                                )
                              }
                            >
                              自然减胎
                            </Checkbox>
                            <div>减胎数</div>
                            <BaseInputNumber
                              min={0}
                              style={{ width: 80, marginLeft: 12 }}
                              value={
                                detailData.clinicalPeriodParam
                                  .naturalTireReductionNumber
                              }
                              onChange={(e) =>
                                setDetailData(
                                  "clinicalPeriodParam",
                                  "naturalTireReductionNumber",
                                  e
                                )
                              }
                            />
                          </BaseFormItem>
                        </>
                      )}
                    </DetailContent>
                  </>
                )}
              {detailData.pregnancyStatus &&
                detailData.pregnancyStatus.ending === "流产" &&
                detailData.pregnancyStatus &&
                detailData.pregnancyStatus.endingTag !== 0 && (
                  <>
                    <BorderDash />
                    <DetailTitle>
                      <div className="leftborder" />
                      <span className="rightmargin">流产</span>
                    </DetailTitle>
                    <DetailContent>
                      <BaseFormItem type="flex" align="middle">
                        <BaseLabel width={70}>日期</BaseLabel>
                        <BaseDatepicker
                          height={26}
                          value={
                            detailData.abortionParam &&
                            detailData.abortionParam.abortionDate
                              ? moment(detailData.abortionParam.abortionDate)
                              : ""
                          }
                          onChange={(date, dateString) =>
                            this.handleAbortionChange(dateString)
                          }
                        />
                        <BaseLabel width={70}>移植后</BaseLabel>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, marginRight: 12 }}
                          value={
                            detailData.abortionParam &&
                            detailData.abortionParam.pregnancyWeekNumber
                          }
                          onChange={(e) =>
                            setDetailData(
                              "abortionParam",
                              "pregnancyWeekNumber",
                              e
                            )
                          }
                        />
                        <span>周</span>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, margin: "0 12px" }}
                          value={
                            detailData.abortionParam &&
                            detailData.abortionParam.pregnancyDayNumber
                          }
                          onChange={(e) =>
                            setDetailData(
                              "abortionParam",
                              "pregnancyDayNumber",
                              e
                            )
                          }
                        />
                        <span>天</span>
                        <BaseLabel width={90}>流产类型</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={
                            detailData.abortionParam &&
                            detailData.abortionParam.abortionType
                          }
                          onChange={(e) =>
                            setDetailData("abortionParam", "abortionType", e)
                          }
                        >
                          {renderOptions(optionsPregnancy, "86")}
                        </BaseSelect>
                        <BaseLabel width={90}>流产方式</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={
                            detailData.abortionParam &&
                            detailData.abortionParam.abortionMethod
                          }
                          onChange={(e) =>
                            setDetailData("abortionParam", "abortionMethod", e)
                          }
                        >
                          {renderOptions(optionsPregnancy, "87")}
                        </BaseSelect>
                        <BaseLabel width={90}>流产原因</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={
                            detailData.abortionParam &&
                            detailData.abortionParam.abortionReason
                          }
                          onChange={(e) =>
                            setDetailData("abortionParam", "abortionReason", e)
                          }
                        >
                          {renderOptions(optionsPregnancy, "88")}
                        </BaseSelect>
                      </BaseFormItem>
                      {detailData.abortionParam.abortionReason === "畸形" && (
                        <BaseFormItem type="flex" align="middle">
                          <BaseLabel width={90}>畸形数</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 80, margin: "0 12px" }}
                            value={
                              detailData.abortionParam &&
                              detailData.abortionParam.deformityNumber
                            }
                            onChange={(e) =>
                              setDetailData(
                                "abortionParam",
                                "deformityNumber",
                                e
                              )
                            }
                          />
                          <BaseLabel width={90}>类型</BaseLabel>
                          <BaseSelect
                            width={120}
                            height={26}
                            value={
                              detailData.abortionParam &&
                              detailData.abortionParam.deformityType
                            }
                            onChange={(e) =>
                              setDetailData("abortionParam", "deformityType", e)
                            }
                          >
                            {renderOptions(optionsPregnancy, "89")}
                          </BaseSelect>
                          <BaseLabel width={90}>说明</BaseLabel>
                          <FontInput
                            style={{ width: 580 }}
                            value={
                              detailData.abortionParam &&
                              detailData.abortionParam.description
                            }
                            onChange={(e) =>
                              setDetailData(
                                "abortionParam",
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </BaseFormItem>
                      )}
                    </DetailContent>
                  </>
                )}

              {detailData.pregnancyStatus &&
                detailData.pregnancyStatus.ending === "分娩" &&
                detailData.pregnancyStatus &&
                detailData.pregnancyStatus.endingTag !== 0 && (
                  <>
                    <BorderDash />
                    <DetailTitle>
                      <div className="leftborder" />
                      <span className="rightmargin">分娩</span>
                    </DetailTitle>
                    <DetailContent>
                      <BaseFormItem type="flex" align="middle">
                        <BaseLabel width={70}>日期</BaseLabel>
                        <BaseDatepicker
                          height={26}
                          value={
                            detailData.parturitionParam &&
                            detailData.parturitionParam.parturitionDate
                              ? moment(
                                  detailData.parturitionParam.parturitionDate
                                )
                              : ""
                          }
                          onChange={(date, dateString) =>
                            this.handleParturitionChange(dateString)
                          }
                        />
                        <BaseLabel width={70}>移植后</BaseLabel>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, marginRight: 12 }}
                          value={
                            detailData.parturitionParam &&
                            detailData.parturitionParam.pregnancyWeekNumber
                          }
                          onChange={(e) =>
                            setDetailData(
                              "parturitionParam",
                              "pregnancyWeekNumber",
                              e
                            )
                          }
                        />
                        <span>周</span>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, margin: "0 12px" }}
                          value={
                            detailData.parturitionParam &&
                            detailData.parturitionParam.pregnancyDayNumber
                          }
                          onChange={(e) =>
                            setDetailData(
                              "parturitionParam",
                              "pregnancyDayNumber",
                              e
                            )
                          }
                        />
                        <span>天</span>
                        <BaseLabel width={70}>类型</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={
                            detailData.parturitionParam &&
                            detailData.parturitionParam.parturitionType
                          }
                          onChange={(e) =>
                            setDetailData(
                              "parturitionParam",
                              "parturitionType",
                              e
                            )
                          }
                        >
                          {renderOptions(optionsPregnancy, "238")}
                        </BaseSelect>
                        <BaseLabel width={70}>方式</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={
                            detailData.parturitionParam &&
                            detailData.parturitionParam.parturitionMethod
                          }
                          onChange={(e) =>
                            setDetailData(
                              "parturitionParam",
                              "parturitionMethod",
                              e
                            )
                          }
                        >
                          {renderOptions(optionsPregnancy, "35")}
                        </BaseSelect>
                        <BaseLabel width={70}>医院</BaseLabel>
                        <BaseAutoComplete
                          width={120}
                          height={26}
                          value={
                            detailData.parturitionParam &&
                            detailData.parturitionParam.hospital
                          }
                          onChange={(e) =>
                            setDetailData("parturitionParam", "hospital", e)
                          }
                        >
                          {renderOptions(optionsPregnancy, "229")}
                        </BaseAutoComplete>
                      </BaseFormItem>
                      <BaseFormItem type="flex" align="middle">
                        <BaseLabel width={70}>活产数</BaseLabel>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, marginRight: 12 }}
                          value={
                            detailData.parturitionParam &&
                            detailData.parturitionParam.liveBirthNumber
                          }
                          disabled
                        />
                        <BaseLabel width={70}>死胎数</BaseLabel>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, marginRight: 12 }}
                          value={
                            detailData.parturitionParam &&
                            detailData.parturitionParam.deathBirthNumber
                          }
                          disabled
                        />
                        <BaseLabel width={70}>死产数</BaseLabel>
                        <BaseInputNumber
                          min={0}
                          style={{ width: 80, marginRight: 12 }}
                          value={
                            detailData.parturitionParam &&
                            detailData.parturitionParam.deathProductNumber
                          }
                          disabled
                        />
                      </BaseFormItem>
                      <BaseFormItem type="flex" align="middle">
                        <BaseTable
                          style={{ width: 720 }}
                          columns={newbornConditionColumns}
                          dataSource={newbornConditionDTOs.slice()}
                          rowKey={(record) => record.uid}
                          pagination={false}
                          bordered
                        />
                      </BaseFormItem>
                    </DetailContent>
                  </>
                )}

              <BorderDash />
              <DetailTitle>
                <div className="leftborder" />
                <span className="rightmargin">并发症</span>
              </DetailTitle>
              <DetailContent>
                {complicationDTOs.map((item, index) => (
                  <BaseFormItem type="flex" align="middle" key={index}>
                    <BaseLabel width={70}>检查日</BaseLabel>
                    <BaseDatepicker
                      height={26}
                      value={
                        item.inspectionTime ? moment(item.inspectionTime) : ""
                      }
                      onChange={(date, dateString) =>
                        this.handleComplicationTypeChange(
                          "complicationDTOs",
                          "inspectionTime",
                          dateString,
                          index
                        )
                      }
                    />
                    <BaseLabel width={120}>并发症类型</BaseLabel>
                    <MultipleSelect
                      width={600}
                      height={26}
                      mode="multiple"
                      allowClear
                      style={{ marginRight: 16 }}
                      value={item.complicationType}
                      onChange={(e) =>
                        this.handleComplicationTypeChange(
                          "complicationDTOs",
                          "complicationType",
                          e,
                          index
                        )
                      }
                    >
                      {renderOptions(optionsPregnancy, "104")}
                    </MultipleSelect>
                    {index === 0 ? (
                      <DashBtn>
                        <PlusOutlined onClick={this.addcomplicationDTOs} />
                      </DashBtn>
                    ) : (
                      <DashBtn>
                        <MinusOutlined
                          onClick={() => this.deletecomplicationDTOs(index)}
                        />
                      </DashBtn>
                    )}
                  </BaseFormItem>
                ))}
              </DetailContent>

              <BorderDash />
              <DetailTitle>
                <div className="leftborder" />
                <span className="rightmargin">复核</span>
              </DetailTitle>
              <DetailContent>
                <BaseFormItem
                  type="flex"
                  align="middle"
                  justify="space-between"
                >
                  <Row type="flex" align="middle">
                    <BaseLabel width={70}>复核日</BaseLabel>
                    <BaseDatepicker
                      height={26}
                      value={
                        detailData.pregnancyStatus &&
                        detailData.pregnancyStatus.reviewDate
                          ? moment(detailData.pregnancyStatus.reviewDate)
                          : ""
                      }
                      onChange={(date, dateString) =>
                        setDetailData(
                          "pregnancyStatus",
                          "reviewDate",
                          dateString
                        )
                      }
                    />
                  </Row>
                  <Row type="flex" align="middle">
                    <BaseLabel width={120}>核对人</BaseLabel>
                    <BaseSelect
                      width={120}
                      height={26}
                      value={
                        detailData.pregnancyStatus &&
                        detailData.pregnancyStatus.reviewPerson
                      }
                      onChange={(e) =>
                        setDetailData("pregnancyStatus", "reviewPerson", e)
                      }
                    >
                      {renderOptions(optionsPregnancy, "198")}
                    </BaseSelect>
                  </Row>
                </BaseFormItem>
                <BaseFormItem
                  type="flex"
                  align="middle"
                  justify="center"
                  style={{ paddingBottom: 30 }}
                >
                  <Button
                    type="primary"
                    onClick={() => this.onSubmitPregnancy()}
                  >
                    保存
                  </Button>
                </BaseFormItem>
              </DetailContent>
            </DetailWarp>
          </TabPane>

          {detailData.pregnancyStatus &&
            detailData.pregnancyStatus.endingTag !== 0 && (
              <TabPane tab="产筛" key="productionSieve">
                <DetailWarp>
                  <DetailTitle>
                    <div className="leftborder" />
                    <span className="rightmargin">孕早期</span>
                  </DetailTitle>
                  <DetailContent>
                    <div style={{ width: 880 }}>
                      <BaseFormItem
                        type="flex"
                        align="middle"
                        justify="space-between"
                      >
                        <div style={{ color: "#5CB5F3" }}>B超记录</div>
                        <Row type="flex" align="middle">
                          <BaseLabel width={70}>日期</BaseLabel>
                          <BaseDatepicker
                            height={26}
                            value={
                              this.pregnancyData && this.pregnancyData.earlyDate
                                ? moment(this.pregnancyData.earlyDate)
                                : ""
                            }
                            onChange={(date, dateString) =>
                              this.setPregnancyData("earlyDate", dateString)
                            }
                          />
                          <BaseLabel width={70}>孕期</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 60, marginRight: 12 }}
                            value={this.pregnancyEarlyWeek}
                            onChange={(e) =>
                              setDetailData(
                                "clinicalPeriodParam",
                                "afterTransplantWeeks",
                                e
                              )
                            }
                          />
                          <span>周</span>
                          <BaseLabel width={70}>胎数</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 100, marginRight: 12 }}
                            value={this.pregnancyData.fetuses}
                            readOnly={
                              detailData.clinicalPeriodParam.fetalHeartNumber
                            }
                            onChange={(e) =>
                              this.setPregnancyData("fetuses", e)
                            }
                          />

                          <DashBtn>
                            <PlusOutlined onClick={this.addEarlyPregnancy} />
                          </DashBtn>
                        </Row>
                      </BaseFormItem>
                      <BaseFormItem type="flex" align="middle">
                        <BaseTable
                          style={{ width: 880 }}
                          columns={earlyPregnancyColumns}
                          dataSource={this.mergeCelldata(
                            earlyUltrasoundPregnancyParams.slice()
                          )}
                          rowKey={(record) => record.uid}
                          pagination={false}
                          bordered
                        />
                      </BaseFormItem>
                      <BaseFormItem type="flex" align="middle">
                        <BaseLabel width={70}>双胎分型</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={
                            productionDetailData.earlyPregnancyParam
                              .twinTireSplitting
                          }
                          onChange={(e) =>
                            setProductionDetailData(
                              "earlyPregnancyParam",
                              "twinTireSplitting",
                              e
                            )
                          }
                        >
                          {renderOptions(optionsProduction, "95")}
                        </BaseSelect>
                        <BaseLabel width={70}>说明</BaseLabel>
                        <FontInput
                          style={{ width: 416 }}
                          value={
                            productionDetailData.earlyPregnancyParam &&
                            productionDetailData.earlyPregnancyParam
                              .earlyPregnancyExplain
                          }
                          onChange={(e) =>
                            setProductionDetailData(
                              "earlyPregnancyParam",
                              "earlyPregnancyExplain",
                              e.target.value
                            )
                          }
                        />
                      </BaseFormItem>
                      <BaseFormItem type="flex" align="middle">
                        <BaseLabel width={70}>随访日</BaseLabel>
                        <BaseDatepicker
                          height={26}
                          value={
                            productionDetailData.earlyPregnancyParam.followDate
                              ? moment(
                                  productionDetailData.earlyPregnancyParam
                                    .followDate
                                )
                              : ""
                          }
                          onChange={(date, dateString) =>
                            setProductionDetailData(
                              "earlyPregnancyParam",
                              "followDate",
                              dateString
                            )
                          }
                        />
                        <BaseLabel width={70}>随访者</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={
                            productionDetailData.earlyPregnancyParam &&
                            productionDetailData.earlyPregnancyParam
                              .followPerson
                          }
                          onChange={(e) =>
                            setProductionDetailData(
                              "earlyPregnancyParam",
                              "followPerson",
                              e
                            )
                          }
                        >
                          {renderOptions(optionsProduction, "198")}
                        </BaseSelect>
                      </BaseFormItem>
                      <BaseFormItem type="flex" align="middle" justify="center">
                        <Button
                          type="primary"
                          onClick={() => saveEarlyPregnancy()}
                        >
                          保存
                        </Button>
                      </BaseFormItem>
                    </div>
                  </DetailContent>

                  <BorderDash />
                  <DetailTitle>
                    <div className="leftborder" />
                    <span className="rightmargin">孕中期</span>
                  </DetailTitle>
                  <DetailContent>
                    <div style={{ width: 880 }}>
                      <BaseFormItem
                        type="flex"
                        align="middle"
                        justify="space-between"
                      >
                        <div style={{ color: "#5CB5F3" }}>B超记录</div>
                        <Row type="flex" align="middle">
                          <BaseLabel width={70}>日期</BaseLabel>
                          <BaseDatepicker
                            height={26}
                            value={
                              this.pregnancyData && this.pregnancyData.midDate
                                ? moment(this.pregnancyData.midDate)
                                : null
                            }
                            onChange={(date, dateString) =>
                              this.setPregnancyData("midDate", dateString)
                            }
                          />
                          <BaseLabel width={70}>孕期</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 60, marginRight: 12 }}
                            value={this.pregnancyMidWeek}
                            onChange={(e) =>
                              setDetailData(
                                "clinicalPeriodParam",
                                "afterTransplantWeeks",
                                e
                              )
                            }
                          />
                          <span>周</span>
                          <BaseLabel width={70}>胎数</BaseLabel>
                          <BaseInputNumber
                            min={0}
                            style={{ width: 100, marginRight: 12 }}
                            value={this.pregnancyData.midFetuses}
                            readOnly={
                              detailData.clinicalPeriodParam.fetalHeartNumber
                            }
                            onChange={(e) =>
                              this.setPregnancyData("midFetuses", e)
                            }
                          />

                          <DashBtn>
                            <PlusOutlined onClick={this.addMidPregnancy} />
                          </DashBtn>
                        </Row>
                      </BaseFormItem>
                      <BaseFormItem type="flex" align="middle">
                        <BaseTable
                          style={{ width: 880 }}
                          columns={midPregnancyColumns}
                          dataSource={this.mergeCelldata(
                            midUltrasoundPregnancyParams.slice()
                          )}
                          rowKey={(record) => record.uid}
                          pagination={false}
                          bordered
                        />
                      </BaseFormItem>
                      <BaseFormItem type="flex" align="middle">
                        <BaseLabel width={70}>双胎分型</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={
                            productionDetailData.midPregnancyParam
                              .twinTireSplitting
                          }
                          onChange={(e) =>
                            setProductionDetailData(
                              "midPregnancyParam",
                              "twinTireSplitting",
                              e
                            )
                          }
                        >
                          {renderOptions(optionsProduction, "95")}
                        </BaseSelect>
                        <BaseLabel width={70}>说明</BaseLabel>
                        <FontInput
                          style={{ width: 416 }}
                          value={
                            productionDetailData.midPregnancyParam &&
                            productionDetailData.midPregnancyParam
                              .midPregnancyExplain
                          }
                          onChange={(e) =>
                            setProductionDetailData(
                              "midPregnancyParam",
                              "midPregnancyExplain",
                              e.target.value
                            )
                          }
                        />
                      </BaseFormItem>
                      <BaseFormItem type="flex" align="middle">
                        <BaseLabel width={70}>随访日</BaseLabel>
                        <BaseDatepicker
                          height={26}
                          value={
                            productionDetailData.midPregnancyParam.followDate
                              ? moment(
                                  productionDetailData.midPregnancyParam
                                    .followDate
                                )
                              : ""
                          }
                          onChange={(date, dateString) =>
                            setProductionDetailData(
                              "midPregnancyParam",
                              "followDate",
                              dateString
                            )
                          }
                        />
                        <BaseLabel width={70}>随访者</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={
                            productionDetailData.midPregnancyParam &&
                            productionDetailData.midPregnancyParam.followPerson
                          }
                          onChange={(e) =>
                            setProductionDetailData(
                              "midPregnancyParam",
                              "followPerson",
                              e
                            )
                          }
                        >
                          {renderOptions(optionsProduction, "198")}
                        </BaseSelect>
                      </BaseFormItem>
                      <BaseFormItem type="flex" align="middle" justify="center">
                        <Button
                          type="primary"
                          onClick={() => saveMidPregnancy()}
                        >
                          保存
                        </Button>
                      </BaseFormItem>
                    </div>
                  </DetailContent>
                  <BorderDash />
                  <DetailTitle>
                    <div className="leftborder" />
                    <span className="rightmargin">产前筛查</span>
                  </DetailTitle>
                  <DetailContent>
                    <BaseFormItem type="flex" align="middle">
                      <div style={{ color: "#5CB5F3" }}>唐氏筛查</div>
                      <Switch
                        checked={
                          productionDetailData.antenatalScreeningParam
                            .downScreening
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "downScreening",
                            +e
                          )
                        }
                      />
                      <BaseLabel width={150}>18三体综合征风险值</BaseLabel>
                      <FontInput
                        style={{ width: 60 }}
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .eighteenRiskValue
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "eighteenRiskValue",
                            e.target.value
                          )
                        }
                      />
                      <BaseLabel width={70}>结果</BaseLabel>
                      <Radio.Group
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .eighteenRiskValueResult
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "eighteenRiskValueResult",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>高风险</Radio>
                        <Radio value={0}>低风险</Radio>
                      </Radio.Group>
                    </BaseFormItem>
                    <BaseFormItem
                      type="flex"
                      align="middle"
                      style={{ paddingLeft: 100 }}
                    >
                      <BaseLabel width={150}>21三体综合征风险值</BaseLabel>
                      <FontInput
                        style={{ width: 60 }}
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .twentyOneRiskValue
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "twentyOneRiskValue",
                            e.target.value
                          )
                        }
                      />
                      <BaseLabel width={70}>结果</BaseLabel>
                      <Radio.Group
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .twentyOneRiskValueResult
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "twentyOneRiskValueResult",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>高风险</Radio>
                        <Radio value={0}>低风险</Radio>
                      </Radio.Group>
                    </BaseFormItem>
                    <BaseFormItem
                      type="flex"
                      align="middle"
                      style={{ paddingLeft: 100 }}
                    >
                      <BaseLabel width={250}>
                        开放性神经缺陷(ONTD或NTD)风险值
                      </BaseLabel>
                      <FontInput
                        style={{ width: 60 }}
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .openNeuralTubeDefect
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "openNeuralTubeDefect",
                            e.target.value
                          )
                        }
                      />
                      <BaseLabel width={70}>结果</BaseLabel>
                      <Radio.Group
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .openNeuralTubeDefectResult
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "openNeuralTubeDefectResult",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>高风险</Radio>
                        <Radio value={0}>低风险</Radio>
                      </Radio.Group>
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <div style={{ color: "#5CB5F3" }}>无创DNA</div>
                      <Switch
                        checked={
                          productionDetailData.antenatalScreeningParam
                            .nonInvasiveDna
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "nonInvasiveDna",
                            +e
                          )
                        }
                      />
                      <BaseLabel width={150}>13三体综合征风险值</BaseLabel>
                      <FontInput
                        style={{ width: 60 }}
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .thirteenRiskIndex
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "thirteenRiskIndex",
                            e.target.value
                          )
                        }
                      />
                      <BaseLabel width={70}>结果</BaseLabel>
                      <Radio.Group
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .thirteenRiskIndexResult
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "thirteenRiskIndexResult",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>高风险</Radio>
                        <Radio value={0}>低风险</Radio>
                      </Radio.Group>
                    </BaseFormItem>
                    <BaseFormItem
                      type="flex"
                      align="middle"
                      style={{ paddingLeft: 100 }}
                    >
                      <BaseLabel width={150}>18三体综合征风险值</BaseLabel>
                      <FontInput
                        style={{ width: 60 }}
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .eighteenRiskInsex
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "eighteenRiskInsex",
                            e.target.value
                          )
                        }
                      />
                      <BaseLabel width={70}>结果</BaseLabel>
                      <Radio.Group
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .eighteenRiskInsexResult
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "eighteenRiskInsexResult",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>高风险</Radio>
                        <Radio value={0}>低风险</Radio>
                      </Radio.Group>
                    </BaseFormItem>
                    <BaseFormItem
                      type="flex"
                      align="middle"
                      style={{ paddingLeft: 100 }}
                    >
                      <BaseLabel width={150}>21三体综合征风险值</BaseLabel>
                      <FontInput
                        style={{ width: 60 }}
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .twentyOneRiskInsex
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "twentyOneRiskInsex",
                            e.target.value
                          )
                        }
                      />
                      <BaseLabel width={70}>结果</BaseLabel>
                      <Radio.Group
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .twentyOneRiskInsexResult
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "twentyOneRiskInsexResult",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>高风险</Radio>
                        <Radio value={0}>低风险</Radio>
                      </Radio.Group>
                    </BaseFormItem>
                    <BaseFormItem type="flex" align="middle">
                      <div style={{ color: "#5CB5F3" }}>羊水穿刺</div>
                      <Switch
                        checked={
                          productionDetailData.antenatalScreeningParam
                            .amniocentesis
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "amniocentesis",
                            +e
                          )
                        }
                      />
                      <BaseLabel width={150}>染色体核型分析</BaseLabel>
                      <Radio.Group
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .fluidCellChromosomes
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "fluidCellChromosomes",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                      {productionDetailData.antenatalScreeningParam &&
                        productionDetailData.antenatalScreeningParam
                          .fluidCellChromosomes === 0 && (
                          <>
                            <BaseLabel width={50}>说明</BaseLabel>
                            <FontInput
                              style={{ width: 280 }}
                              value={
                                productionDetailData.antenatalScreeningParam &&
                                productionDetailData.antenatalScreeningParam
                                  .fluidCellChromosomesExplain
                              }
                              onChange={(e) =>
                                setProductionDetailData(
                                  "antenatalScreeningParam",
                                  "fluidCellChromosomesExplain",
                                  e.target.value
                                )
                              }
                            />
                          </>
                        )}
                    </BaseFormItem>
                    <BaseFormItem
                      type="flex"
                      align="middle"
                      style={{ paddingLeft: 100 }}
                    >
                      <BaseLabel width={160}>全基因拷贝数变异分析</BaseLabel>
                      <Switch
                        checked={
                          productionDetailData.antenatalScreeningParam
                            .fluidCellWholeGenome
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "fluidCellWholeGenome",
                            +e
                          )
                        }
                      />
                      <BaseLabel width={70}>日期</BaseLabel>
                      <BaseDatepicker
                        height={26}
                        value={
                          productionDetailData.antenatalScreeningParam.testDate
                            ? moment(
                                productionDetailData.antenatalScreeningParam
                                  .testDate
                              )
                            : ""
                        }
                        onChange={(date, dateString) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "testDate",
                            dateString
                          )
                        }
                      />
                      <BaseLabel width={70}>方法</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={
                          productionDetailData.antenatalScreeningParam
                            .testMethod
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "testMethod",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsProduction, "97")}
                      </BaseSelect>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={
                          productionDetailData.antenatalScreeningParam.chipType
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "chipType",
                            e
                          )
                        }
                      >
                        {productionDetailData.antenatalScreeningParam
                          .testMethod === "高通量测序"
                          ? renderOptions(optionsProduction, "320")
                          : renderOptions(optionsProduction, "98")}
                      </BaseSelect>
                      <BaseLabel width={70}>结果</BaseLabel>
                      <Radio.Group
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .wholeGenomeResult
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "wholeGenomeResult",
                            e.target.value
                          )
                        }
                      >
                        <Radio value={1}>正常</Radio>
                        <Radio value={0}>异常</Radio>
                      </Radio.Group>
                      {productionDetailData.antenatalScreeningParam &&
                        productionDetailData.antenatalScreeningParam
                          .wholeGenomeResult === 0 && (
                          <>
                            <BaseLabel width={50}>说明</BaseLabel>
                            <FontInput
                              style={{ width: 280 }}
                              value={
                                productionDetailData.antenatalScreeningParam &&
                                productionDetailData.antenatalScreeningParam
                                  .exceptionResult
                              }
                              onChange={(e) =>
                                setProductionDetailData(
                                  "antenatalScreeningParam",
                                  "exceptionResult",
                                  e.target.value
                                )
                              }
                            />
                          </>
                        )}
                    </BaseFormItem>
                    <BaseFormItem
                      type="flex"
                      align="middle"
                      style={{ paddingLeft: 100 }}
                    >
                      <BaseLabel width={100}>单基因检测</BaseLabel>
                      <Switch
                        checked={
                          productionDetailData.antenatalScreeningParam
                            .fluidCellSingleGene
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "fluidCellSingleGene",
                            +e
                          )
                        }
                      />
                      <BaseLabel width={70}>结果</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={
                          productionDetailData.antenatalScreeningParam
                            .singleGeneResult
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "singleGeneResult",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsProduction, "99")}
                      </BaseSelect>
                    </BaseFormItem>
                    {antenatalScreeningAmniocentesisParams.map(
                      (item, index) => (
                        <BaseFormItem
                          type="flex"
                          align="middle"
                          key={index}
                          style={{ paddingLeft: 100 }}
                        >
                          <BaseLabel width={70}>致病基因</BaseLabel>
                          <FontInput
                            style={{ width: 200 }}
                            height={26}
                            value={item.diseaseCausingGene}
                            onChange={(e) =>
                              this.handleProductionChange(
                                "antenatalScreeningParam",
                                "antenatalScreeningAmniocentesisParams",
                                "diseaseCausingGene",
                                e.target.value,
                                index
                              )
                            }
                          />
                          <BaseLabel width={120}>具体位点</BaseLabel>
                          <FontInput
                            style={{ width: 200, marginRight: 16 }}
                            height={26}
                            value={item.specificLocation}
                            onChange={(e) =>
                              this.handleProductionChange(
                                "antenatalScreeningParam",
                                "antenatalScreeningAmniocentesisParams",
                                "specificLocation",
                                e.target.value,
                                index
                              )
                            }
                          />
                          {index === 0 ? (
                            <DashBtn>
                              <PlusOutlined onClick={this.addDisease} />
                            </DashBtn>
                          ) : (
                            <DashBtn>
                              <MinusOutlined
                                onClick={() => this.deleteDisease(index)}
                              />
                            </DashBtn>
                          )}
                        </BaseFormItem>
                      )
                    )}
                    <BaseFormItem type="flex" align="middle">
                      <BaseLabel width={70}>随访日</BaseLabel>
                      <BaseDatepicker
                        height={26}
                        value={
                          productionDetailData.antenatalScreeningParam
                            .followDate
                            ? moment(
                                productionDetailData.antenatalScreeningParam
                                  .followDate
                              )
                            : ""
                        }
                        onChange={(date, dateString) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "followDate",
                            dateString
                          )
                        }
                      />
                      <BaseLabel width={70}>随访人</BaseLabel>
                      <BaseSelect
                        width={120}
                        height={26}
                        value={
                          productionDetailData.antenatalScreeningParam &&
                          productionDetailData.antenatalScreeningParam
                            .followPerson
                        }
                        onChange={(e) =>
                          setProductionDetailData(
                            "antenatalScreeningParam",
                            "followPerson",
                            e
                          )
                        }
                      >
                        {renderOptions(optionsProduction, "198")}
                      </BaseSelect>
                    </BaseFormItem>
                  </DetailContent>
                  <BorderDash />
                  <DetailTitle>
                    <div className="leftborder" />
                    <span className="rightmargin">并发症</span>
                  </DetailTitle>
                  <DetailContent>
                    {productionComplicationDTOs.map((item, index) => (
                      <BaseFormItem type="flex" align="middle" key={index}>
                        <BaseLabel width={70}>检查日</BaseLabel>
                        <BaseDatepicker
                          height={26}
                          value={
                            item.inspectionTime
                              ? moment(item.inspectionTime)
                              : ""
                          }
                          onChange={(date, dateString) =>
                            this.handleProductionComplicationTypeChange(
                              "complicationDTOs",
                              "inspectionTime",
                              dateString,
                              index
                            )
                          }
                        />
                        <BaseLabel width={120}>并发症类型</BaseLabel>
                        <MultipleSelect
                          width={600}
                          height={26}
                          mode="multiple"
                          allowClear
                          style={{ marginRight: 16 }}
                          value={item.complicationType}
                          onChange={(e) =>
                            this.handleProductionComplicationTypeChange(
                              "complicationDTOs",
                              "complicationType",
                              e,
                              index
                            )
                          }
                        >
                          {renderOptions(optionsProduction, "104")}
                        </MultipleSelect>
                        {index === 0 ? (
                          <DashBtn>
                            <PlusOutlined
                              onClick={this.addProductionComplicationDTOs}
                            />
                          </DashBtn>
                        ) : (
                          <DashBtn>
                            <MinusOutlined
                              onClick={() =>
                                this.deleteProductionComplicationDTOs(index)
                              }
                            />
                          </DashBtn>
                        )}
                      </BaseFormItem>
                    ))}
                  </DetailContent>

                  <BorderDash />
                  <DetailTitle>
                    <div className="leftborder" />
                    <span className="rightmargin">复核</span>
                  </DetailTitle>
                  <DetailContent>
                    <BaseFormItem
                      type="flex"
                      align="middle"
                      justify="space-between"
                    >
                      <Row type="flex" align="middle">
                        <BaseLabel width={70}>复核日</BaseLabel>
                        <BaseDatepicker
                          height={26}
                          value={
                            productionDetailData.reviewInfo &&
                            productionDetailData.reviewInfo.reviewDate
                              ? moment(
                                  productionDetailData.reviewInfo.reviewDate
                                )
                              : ""
                          }
                          onChange={(date, dateString) =>
                            setProductionDetailData(
                              "reviewInfo",
                              "reviewDate",
                              dateString
                            )
                          }
                        />
                      </Row>
                      <Row type="flex" align="middle">
                        <BaseLabel width={120}>核对人</BaseLabel>
                        <BaseSelect
                          width={120}
                          height={26}
                          value={
                            productionDetailData.reviewInfo &&
                            productionDetailData.reviewInfo.reviewPerson
                          }
                          onChange={(e) =>
                            setProductionDetailData(
                              "reviewInfo",
                              "reviewPerson",
                              e
                            )
                          }
                        >
                          {renderOptions(optionsProduction, "198")}
                        </BaseSelect>
                      </Row>
                    </BaseFormItem>
                    <BaseFormItem
                      type="flex"
                      align="middle"
                      justify="center"
                      style={{ paddingBottom: 30 }}
                    >
                      <Button type="primary" onClick={() => saveScreening()}>
                        保存
                      </Button>
                    </BaseFormItem>
                  </DetailContent>
                </DetailWarp>
              </TabPane>
            )}

          {detailData.pregnancyStatus &&
            detailData.pregnancyStatus.endingTag !== 0 && (
              <TabPane tab="出生后" key="birthAfter">
                <DetailWarp>
                  <Row type="flex" align="middle">
                    {afterbirthDetailData.map((child) => (
                      <div
                        style={{ margin: "12px 24px 0 0" }}
                        key={child.babyTag}
                      >
                        <Row type="flex" align="middle">
                          {child.sex === 0 ? (
                            <div>
                              <img
                                src={MaleIcon}
                                alt=""
                                style={{ marginRight: 12 }}
                              />
                              子代男
                            </div>
                          ) : (
                            <div>
                              <img
                                src={FemaleIcon}
                                alt=""
                                style={{ marginRight: 12 }}
                              />
                              子代女
                            </div>
                          )}

                          <div style={{ margin: "0 16px" }}>
                            {child.parturitionDate}
                          </div>
                          <div>1周岁</div>
                        </Row>
                        <BaseTable
                          style={{ width: 300 }}
                          columns={afterbirthColumns}
                          dataSource={child.followUpChildStageInfos}
                          pagination={false}
                          bordered
                          rowKey={(record) => record.followStage}
                          rowClassName={this.setRowClassName}
                          // rowClassName={"rowStyle"}
                          onRow={(record) => {
                            return {
                              onClick: (event) =>
                                this.onChildStageChange(event, record),
                            }
                          }}
                        />
                      </div>
                    ))}
                  </Row>
                  {this.renderbirth()}
                </DetailWarp>
              </TabPane>
            )}
        </StyledTabs>
      </div>
    )
  }
}
