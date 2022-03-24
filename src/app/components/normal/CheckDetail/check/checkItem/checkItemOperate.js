import React, { Component } from "react"
import { DatePicker, Select, message } from "antd"
import { observer, inject } from "mobx-react"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import { DateTitleView } from "@/app/components/normal/Title"
import { FlexItem } from "@/app/components/base/baseForms.js"
import ContentOperate from "./contentOperate" //操作内容
import { todayString, dateFormatDate } from "@/app/utils/const.js"
import { renderOptions, debounce } from "@/app/utils/tool.js"

import moment from "moment"
import apis from "@/app/utils/apis"

export default
@inject("moredetail", "store", "inspection")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemTitle: props.itemTitle,
      operateData: props.operateData,
      ultrasounds: props.operateData.ultrasounds,
      options: [],
      bType: "胸部B超",
    }
  }
  componentDidMount() {
    //初始化下拉框
    apis.ManCheck.getImageOption().then((res) => {
      this.setState({
        options: res.data,
      })
    })
  }
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setState({
      operateData: nextProps.operateData,
      itemTitle: nextProps.itemTitle,
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
  //B超检查修改时
  setUltrasounds = async (index, proIndex, param, value) => {
    let { ultrasounds } = this.state
    let arr = ultrasounds
    arr.map((uitems, uindexs) => {
      return uitems.otherVideoDTOS.map((uitem, uindex) => {
        if (uindexs === index && uindex === proIndex) {
          uitem[param] = value
        }
        return uitem[param]
      })
    })
    await this.setState({
      ultrasounds: arr,
    })
  }
  //提交修改和添加
  submit = () => {
    let { operateData, itemTitle, bType, ultrasounds } = this.state
    let { patientSex } = this.props.store
    let { sex } = this.props
    let sexFlag = sex === null ? patientSex : sex
    let btype = itemTitle === "B超检查" && sexFlag ? bType : null
    let date = operateData.date ? operateData.date : todayString
    let params = {
      patientParam: this.selectPatient(),
      otherVideoDTO:
        itemTitle === "输卵管造影" ||
        itemTitle === "阴道B超" ||
        (itemTitle === "B超检查" && operateData.edit && sexFlag)
          ? null
          : { ...operateData, videoType: itemTitle, bType: btype, date },
      hysterosalpingogramDTO:
        itemTitle === "输卵管造影" ? { ...operateData, date } : null,
      gynecologicalUltrasoundDTO:
        itemTitle === "阴道B超"
          ? {
              ...operateData,
              date,
            }
          : null,
      ultrasounds:
        itemTitle === "B超检查" && operateData.edit && sexFlag
          ? ultrasounds
          : null,
    }
    if (operateData.edit) {
      //修改方法
      debounce(
        apis.ManCheck.updateimagedata(params).then((res) => {
          if (res.code === 200) {
            this.props.close()
            this.props.getData()
            message.success("修改成功")
          }
        })
      )
    } else {
      //添加方法
      debounce(
        apis.ManCheck.saveimagedata(params).then((res) => {
          if (res.code === 200) {
            this.props.close()
            this.props.getData()
            message.success("添加成功")
          }
        })
      )
    }
  }

  render() {
    let { patientSex } = this.props.store
    let { selectCheckType } = this.props.inspection
    let { sex } = this.props
    let { operateData, itemTitle, bType, ultrasounds, options } = this.state
    let flag =
      sex === null
        ? itemTitle === "B超检查" && patientSex
        : itemTitle === "B超检查" && sex
    operateData.place = operateData.place ? operateData.place : 0
    operateData.result = operateData.result ? operateData.result : 0 //B超检查
    operateData.uterusMorphology = operateData.uterusMorphology
      ? operateData.uterusMorphology
      : 0 //输卵管造影
    operateData.rightFallopianTube = operateData.rightFallopianTube
      ? operateData.rightFallopianTube
      : "通畅" //输卵管造影
    operateData.leftFallopianTube = operateData.leftFallopianTube
      ? operateData.leftFallopianTube
      : "通畅" //输卵管造影
    operateData.rightFallopianTubeMorphology = operateData.rightFallopianTubeMorphology
      ? operateData.rightFallopianTubeMorphology
      : 0 //输卵管造影
    operateData.leftFallopianTubeMorphology = operateData.leftFallopianTubeMorphology
      ? operateData.leftFallopianTubeMorphology
      : 0 //输卵管造影
    operateData.spt = operateData.spt ? operateData.spt : 0 //阴道镜
    operateData.cervicitis = operateData.cervicitis ? operateData.cervicitis : 0 //阴道镜
    operateData.tz = operateData.tz ? operateData.tz : 0 //阴道镜
    operateData.detail =
      itemTitle === "输卵管通液" && !operateData.detail
        ? "通畅"
        : operateData.detail
    return (
      <DateTitleView
        flag={!operateData.edit}
        title={
          operateData.edit ? (
            itemTitle
          ) : flag ? (
            <Select
              value={bType}
              style={{ width: 150, textAlign: "left", marginLeft: 10 }}
              onChange={(value) => {
                this.setState({
                  bType: value,
                })
              }}
            >
              <Select.Option key={0} value="胸部B超">
                胸部B超
              </Select.Option>
              <Select.Option key={1} value="乳腺彩超">
                乳腺彩超
              </Select.Option>
              <Select.Option key={2} value="心脏彩超">
                心脏彩超
              </Select.Option>
              <Select.Option key={3} value="四维彩超">
                四维彩超
              </Select.Option>
              <Select.Option key={4} value="腹部彩超">
                腹部彩超
              </Select.Option>
              <Select.Option key={5} value="甲状腺及淋巴超声">
                甲状腺及淋巴超声
              </Select.Option>
            </Select>
          ) : (
            <Select
              value={itemTitle}
              style={{ width: 150, textAlign: "left", marginLeft: 10 }}
              onChange={(value) => {
                this.setState({
                  itemTitle: value,
                })
              }}
            >
              {renderOptions(selectCheckType, "1")}
            </Select>
          )
        }
        selectOption={
          <div className="selectOptions" style={{ marginLeft: 0 }}>
            {flag ? null : (
              <span>
                <span className="checkdate">检查日期：</span>
                {operateData.edit ? (
                  <span>{operateData.date}</span>
                ) : (
                  <DatePicker
                    style={{ width: 150 }}
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
            )}
            {operateData.edit ? null : (
              <FlexItem>
                <Select
                  style={{ width: 120, marginLeft: 20 }}
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
                  {renderOptions(options, "263")}
                </Select>
              </FlexItem>
            )}
          </div>
        }
        subtitle={
          <>
            <CheckOutlined
              style={{ color: "#59B4F4", marginRight: 20 }}
              onClick={this.submit}
            />
            <CloseOutlined style={{ color: "red" }} onClick={this.close} />
          </>
        }
        style={{ marginRight: 0 }}
      >
        <div className="content">
          <ContentOperate
            item={{ ...operateData }}
            ultrasounds={ultrasounds}
            checkType={itemTitle}
            bType={bType}
            options={options}
            sex={sex}
            setInheritVal={this.setInheritVal}
            setUltrasounds={this.setUltrasounds}
          />
        </div>
      </DateTitleView>
    )
  }
}
