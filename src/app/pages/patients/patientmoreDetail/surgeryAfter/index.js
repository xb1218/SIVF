import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import {
  Input,
  DatePicker,
  Radio,
  Select,
  Button,
  Checkbox,
  Row,
  TimePicker,
  message,
} from "antd"
import { DateTitleView } from "@/app/components/normal/Title"
import { FontInput } from "@/app/components/base/baseFontInput"
import { ThreeItem, FlexItem } from "@/app/components/base/baseForms.js"
import { checkArrisEmpty } from "@/app/utils/tool.js"
import {
  dateFormat,
  dateFormatDate,
  todayString,
  todayTime,
} from "@/app/utils/const.js"
import "./index.scss"
import moment from "moment"
import apis from "@/app/utils/apis"

const { TextArea } = Input

export default
@inject("moredetail", "store")
@observer
class SurgeryAfter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oprationRecord: props.oprationRecord, //手术字段
      bindData: {},
      initSelect: [], //初始化下拉框
    }
  }
  componentDidMount = () => {
    this.props.onRef && this.props.onRef(this)
    this.getInitData()
    this.initAfterSelect()
  }
  //获取下拉框值
  initAfterSelect = () => {
    apis.Patients_surgery.initSelectafter().then((res) => {
      this.setState({
        initSelect: res.data,
      })
    })
  }
  //初始化数据
  getInitData = (val) => {
    let { oprationRecord } = this.state
    let record = null
    if (val) {
      record = val.charAt(val.length - 1) //取手术记录次数
    } else {
      record = oprationRecord.charAt(oprationRecord.length - 1) //取手术记录次数
    }
    apis.Patients_surgery.initSurgeryafter(this.props.store.select_one).then(
      (res) => {
        if (!checkArrisEmpty(res.data) && res.data.length > record - 1) {
          this.setState({
            bindData: res.data[record - 1],
          })
        } else {
          //初始化添加数据
          this.setState({
            bindData: {
              wardDate: todayString,
              wardTime: todayTime,
              outlyingDate: todayString,
              outlyingTime: todayTime,
            },
          })
        }
      }
    )
  }
  //onChange事件
  setInheritVal = (val, param) => {
    let { bindData } = this.state
    let newTestData = Object.assign(bindData, { [param]: val })
    this.setState({
      bindData: newTestData,
    })
  }
  //新增,修改取卵术后
  save = () => {
    let { bindData } = this.state
    let data = Object.assign({}, bindData)
    data.patientParam = this.props.store.select_one
    let flag = data.uid ? true : false
    apis.Patients_surgery.addSurgeryafter(data).then((res) => {
      message.destroy()
      if (flag) {
        message.success("修改成功")
      } else {
        message.success("添加成功")
        this.props.store.initCard("patient")
      }
    })
  }
  //删除取卵术后
  delete = () => {
    let { bindData } = this.state
    if (!bindData.uid) {
      message.success("删除成功")
      this.props.deleteItem()
    } else {
      apis.Patients_surgery.delSurgeryafter(bindData.uid).then((res) => {
        if (res.code === 200) {
          message.success("删除成功")
          this.props.deleteItem()
        } else {
          message.error(res.message)
        }
      })
    }
  }
  render() {
    let { bindData, initSelect } = this.state
    let { renderOptions } = this.props.moredetail
    return (
      <div className="surgeryAfter">
        <DateTitleView
          title={<span className="surgeryChecked">入院记录</span>}
          style={{ marginRight: 0, marginBottom: 0 }}
        >
          <div className="subtitle">入病房</div>
          <ThreeItem>
            <div>
              <span>日期:</span>
              <span>
                <DatePicker
                  style={{ width: 150 }}
                  defaultValue={bindData.wardDate}
                  value={
                    bindData.wardDate
                      ? moment(bindData.wardDate, dateFormatDate)
                      : moment(todayString, dateFormatDate)
                  }
                  onChange={(date, datestring) => {
                    this.setInheritVal(datestring, "wardDate")
                  }}
                />
              </span>
            </div>
            <div>
              <span>时间:</span>
              <span>
                <TimePicker
                  style={{ width: 150 }}
                  defaultValue={bindData.wardTime}
                  value={
                    bindData.wardTime
                      ? moment(bindData.wardTime, dateFormat)
                      : moment(todayTime, dateFormat)
                  }
                  onChange={(date, datestring) => {
                    this.setInheritVal(datestring, "wardTime")
                  }}
                />
              </span>
            </div>
            <div>
              <span>步入病房:</span>
              <span>
                <Radio.Group
                  value={bindData.wardStep}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "wardStep")
                  }}
                >
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </Radio.Group>
              </span>
            </div>
          </ThreeItem>
          <ThreeItem>
            <div>
              <span>头晕:</span>
              <span>
                <Radio.Group
                  value={bindData.wardDizziness}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "wardDizziness")
                  }}
                >
                  <Radio value={1}>有</Radio>
                  <Radio value={0}>无</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>腹痛:</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.wardAbdominalPain}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "wardAbdominalPain")
                  }}
                >
                  {renderOptions(initSelect, "172")}
                </Select>
              </span>
            </div>
            <div>
              <span>阴道流血:</span>
              <span>
                <Radio.Group
                  value={bindData.wardVaginalBleeding}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "wardVaginalBleeding")
                  }}
                >
                  <Radio value={1}>有</Radio>
                  <Radio value={0}>无</Radio>
                </Radio.Group>
              </span>
            </div>
          </ThreeItem>
          <ThreeItem>
            <div>
              <span>阴道填塞纱布:</span>
              <span>
                <FontInput
                  addonAfter="块"
                  style={{ width: "150px" }}
                  value={bindData.wardVaginalTamponade}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "wardVaginalTamponade")
                  }}
                />
              </span>
            </div>
          </ThreeItem>
          <div className="subtitle">离病房</div>
          <ThreeItem>
            <div>
              <span>日期:</span>
              <span>
                <DatePicker
                  style={{ width: 150 }}
                  defaultValue={bindData.outlyingDate}
                  value={
                    bindData.outlyingDate
                      ? moment(bindData.outlyingDate, dateFormatDate)
                      : moment(todayString, dateFormatDate)
                  }
                  onChange={(date, dateString) => {
                    this.setInheritVal(dateString, "outlyingDate")
                  }}
                />
              </span>
            </div>
            <div>
              <span>时间:</span>
              <span>
                <TimePicker
                  style={{ width: 150 }}
                  defaultValue={bindData.outlyingTime}
                  value={
                    bindData.outlyingTime
                      ? moment(bindData.outlyingTime, dateFormat)
                      : moment(todayTime, dateFormat)
                  }
                  onChange={(date, datestring) => {
                    this.setInheritVal(datestring, "outlyingTime")
                  }}
                />
              </span>
            </div>
            <div>
              <span>头晕:</span>
              <span>
                <Radio.Group
                  value={bindData.outlyingDizziness}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "outlyingDizziness")
                  }}
                >
                  <Radio value={1}>有</Radio>
                  <Radio value={0}>无</Radio>
                </Radio.Group>
              </span>
            </div>
          </ThreeItem>
          <ThreeItem>
            <div>
              <span>阴道流血:</span>
              <span>
                <Radio.Group
                  value={bindData.outlyingVaginalBleeding}
                  onChange={(e) => {
                    this.setInheritVal(
                      e.target.value,
                      "outlyingVaginalBleeding"
                    )
                  }}
                >
                  <Radio value={1}>有</Radio>
                  <Radio value={0}>无</Radio>
                </Radio.Group>
              </span>
            </div>
            <div>
              <span>腹痛:</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.outlyingAbdominalPain}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "outlyingAbdominalPain")
                  }}
                >
                  {renderOptions(initSelect, "172")}
                </Select>
              </span>
            </div>
            <div>
              <span>腹部:</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.outlyingAbdominal}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "outlyingAbdominal")
                  }}
                >
                  {renderOptions(initSelect, "173")}
                </Select>
              </span>
            </div>
          </ThreeItem>
          <ThreeItem>
            <div>
              <span>阴道填塞纱布:</span>
              <span>
                <FontInput
                  addonAfter="块"
                  style={{ width: "150px" }}
                  value={bindData.outlyingVaginalTamponade}
                  onChange={(e) => {
                    this.setInheritVal(
                      e.target.value,
                      "outlyingVaginalTamponade"
                    )
                  }}
                />
              </span>
            </div>
            <div>
              <span>T:</span>
              <span>
                <FontInput
                  addonAfter="℃"
                  style={{ width: "150px" }}
                  value={bindData.outlyingT}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "outlyingT")
                  }}
                />
              </span>
            </div>
            <div>
              <span>P:</span>
              <span>
                <FontInput
                  addonAfter="次/分"
                  style={{ width: "150px" }}
                  value={bindData.outlyingP}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "outlyingP")
                  }}
                />
              </span>
            </div>
          </ThreeItem>
          <ThreeItem>
            <div>
              <span>R:</span>
              <span>
                <FontInput
                  addonAfter="次/分"
                  style={{ width: "150px" }}
                  value={bindData.outlyingR}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "outlyingR")
                  }}
                />
              </span>
            </div>
            <div style={{ width: "66%" }}>
              <span>BP</span>
              <span>
                <FontInput
                  addonAfter="mmHg"
                  style={{ width: 150 }}
                  value={bindData.outlyingBpMin}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "outlyingBpMin")
                  }}
                />
                <FontInput
                  addonAfter="mmHg"
                  style={{ width: 150, marginLeft: 100 }}
                  value={bindData.outlyingBpMax}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "outlyingBpMax")
                  }}
                />
              </span>
            </div>
          </ThreeItem>
          <FlexItem>
            <div>
              <span style={{ marginLeft: "65px" }}>其他:</span>
              <span>
                <TextArea
                  rows={4}
                  style={{ width: "calc(100vw - 520px)" }}
                  value={bindData.outlyingElse}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "outlyingElse")
                  }}
                />
              </span>
            </div>
          </FlexItem>
          <div className="subtitle">盆腔超声</div>
          <ThreeItem>
            <div>
              <span>左侧卵巢:</span>
              <span>
                <Input
                  style={{ width: 50 }}
                  value={bindData.leftOvaryLength}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "leftOvaryLength")
                  }}
                />
                <span className="spanTitle">*</span>

                <Input
                  style={{ width: 50 }}
                  value={bindData.leftOvaryWidth}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "leftOvaryWidth")
                  }}
                />
                <span className="spanTitle">*</span>
                <Input
                  style={{ width: 50 }}
                  value={bindData.leftOvaryHeight}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "leftOvaryHeight")
                  }}
                />
              </span>
            </div>
            <div>
              <span>右侧卵巢:</span>
              <span>
                <Input
                  style={{ width: 50 }}
                  value={bindData.rightOvaryLength}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "rightOvaryLength")
                  }}
                />
                <span className="spanTitle">*</span>

                <Input
                  style={{ width: 50 }}
                  value={bindData.rightOvaryWidth}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "rightOvaryWidth")
                  }}
                />
                <span className="spanTitle">*</span>
                <Input
                  style={{ width: 50 }}
                  value={bindData.rightOvaryHeight}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "rightOvaryHeight")
                  }}
                />
              </span>
            </div>
            <div>
              <span>盆腔积液:</span>
              <span>
                <FontInput
                  addonAfter="ml"
                  style={{ width: "150px" }}
                  value={bindData.pelvicEffusion}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "pelvicEffusion")
                  }}
                />
              </span>
            </div>
          </ThreeItem>
          <ThreeItem>
            <div>
              <span>内膜:</span>
              <span>
                <FontInput
                  addonAfter="mm"
                  style={{ width: "150px" }}
                  value={bindData.innerMembrane}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "innerMembrane")
                  }}
                />
              </span>
            </div>
            <div>
              <span>分型:</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.typing}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "typing")
                  }}
                >
                  {renderOptions(initSelect, "174")}
                </Select>
              </span>
            </div>
            <div>
              <span>其他:</span>
              <span>
                <Input
                  style={{ width: 150 }}
                  value={bindData.pelvicUltrasoundElse}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "pelvicUltrasoundElse")
                  }}
                />
              </span>
            </div>
          </ThreeItem>
          <div className="subtitle">离院后</div>
          <ThreeItem>
            <div style={{ width: "60%" }}>
              <span></span>
              <span>
                <Checkbox
                  checked={bindData.appropriateActivities}
                  onChange={(e) => {
                    this.setInheritVal(
                      e.target.checked ? 1 : 0,
                      "appropriateActivities"
                    )
                  }}
                >
                  适当活动
                </Checkbox>
                <Checkbox
                  checked={bindData.preventInfection}
                  onChange={(e) => {
                    this.setInheritVal(
                      e.target.checked ? 1 : 0,
                      "preventInfection"
                    )
                  }}
                >
                  预防感染
                </Checkbox>
                <Checkbox
                  checked={bindData.followUpAbnormalitiesTag}
                  onChange={(e) => {
                    this.setInheritVal(
                      e.target.checked ? 1 : 0,
                      "followUpAbnormalitiesTag"
                    )
                  }}
                >
                  异常情况随诊
                </Checkbox>
                {bindData.followUpAbnormalitiesTag ? (
                  <Select
                    style={{ width: 150 }}
                    value={bindData.followUpAbnormalities}
                    showArrow={false}
                    onChange={(value) => {
                      this.setInheritVal(value, "followUpAbnormalities")
                    }}
                  >
                    {renderOptions(initSelect, "175")}
                  </Select>
                ) : null}
              </span>
            </div>
          </ThreeItem>
          <FlexItem>
            <div>
              <span style={{ marginLeft: "37px" }}>术后用药:</span>
              <span>
                <Select
                  style={{ width: "calc(100vw - 520px)" }}
                  value={bindData.postoperativeMedication}
                  showArrow={false}
                  onChange={(value) => {
                    this.setInheritVal(value, "postoperativeMedication")
                  }}
                >
                  {renderOptions(initSelect, "176")}
                </Select>
              </span>
            </div>
          </FlexItem>
          <FlexItem>
            <div>
              <span style={{ marginLeft: "37px" }}>病历小结:</span>
              <span>
                <TextArea
                  rows={4}
                  style={{ width: "calc(100vw - 520px)" }}
                  value={bindData.medicalHistorySummary}
                  onChange={(e) => {
                    this.setInheritVal(e.target.value, "medicalHistorySummary")
                  }}
                />
              </span>
            </div>
          </FlexItem>
          <ThreeItem>
            <div></div>
            <div>
              <span>医生签名:</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.doctorSignature}
                  onChange={(value) => {
                    this.setInheritVal(value, "doctorSignature")
                  }}
                >
                  {renderOptions(initSelect, "177")}
                </Select>
              </span>
            </div>
            <div>
              <span>护士签名:</span>
              <span>
                <Select
                  style={{ width: 150 }}
                  value={bindData.nurseSignature}
                  onChange={(value) => {
                    this.setInheritVal(value, "nurseSignature")
                  }}
                >
                  {renderOptions(initSelect, "178")}
                </Select>
              </span>
            </div>
          </ThreeItem>
          <ThreeItem style={{ margin: "20px 0" }}>
            <div style={{ width: "100%" }}>
              <Row type="flex" align="middle" justify="center">
                <Button type="primary" onClick={this.save}>
                  保存
                </Button>
              </Row>
            </div>
          </ThreeItem>
        </DateTitleView>
      </div>
    )
  }
}
