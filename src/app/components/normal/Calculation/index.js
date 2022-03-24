import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { FontDate, FontInput } from "@/app/components/base/baseFontInput"
import { Radio, Input, Tabs, Select, message } from "antd"
import moment from "moment"
import "./index.scss"
import { SwapOutlined } from "@ant-design/icons"

const { TabPane } = Tabs
export default
@inject("store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: null,
      weight: null,
      bmi: null,
      showBox: true,
      selectStage: "手术日",
      options: [
        { label: "IVF", value: "IVF" },
        { label: "IUI", value: "IUI" },
      ],
      checkOption: "IUI",
      dateString: "",
      pregnancyWeek: null,
      pregnancyDay: null,
      oldUnit: null, //单位转换之前的值
      newUnit: null, //单位转换之后的值
      uintData: [
        {
          name: "FSH",
          option: [{ value: "mIU/ml" }],
          oldValue: null,
          newValue: null,
          unitValue: "mIU/ml",
          afterUnit: "IU/L",
          transform: [{ unit: "mIU/ml", formula: 1 }],
        },
        {
          name: "E2",
          option: [{ value: "ng/L" }, { value: "pmol/L" }],
          oldValue: null,
          newValue: null,
          unitValue: "pmol/L",
          afterUnit: "pg/ml",
          transform: [
            { unit: "ng/L", formula: 1 },
            { unit: "pmol/L", formula: 0.27 },
          ],
        },
        {
          name: "P",
          option: [
            { value: "mmol/L" },
            { value: "nmol/L" },
            { value: "ug/L" },
            { value: "pg/L" },
          ],
          oldValue: null,
          newValue: null,
          unitValue: "mmol/L",
          afterUnit: "ng/ml",
          transform: [
            { unit: "nmol/L", formula: 0.31 },
            { unit: "ug/L", formula: 1 },
            { unit: "pg/L", formula: 1 },
            { unit: "mmol/L", formula: 0.00000031 },
          ],
        },
        {
          name: "PRL",
          option: [{ value: "ng/ml" }, { value: "uiu/ml" }, { value: "ug/L" }],
          oldValue: null,
          newValue: null,
          unitValue: "ug/L",
          afterUnit: "miu/L",
          transform: [
            { unit: "ng/ml", formula: 21.2 },
            { unit: "ug/L", formula: 21.2 },
            { unit: "uiu/ml", formula: 1 },
          ],
        },
        {
          name: "LH",
          option: [{ value: "mIU/ml" }],
          oldValue: null,
          newValue: null,
          unitValue: "mIU/ml",
          afterUnit: "IU/L",
          transform: [{ unit: "mIU/ml", formula: 1 }],
        },
        {
          name: "T",
          option: [{ value: "nmol/L" }, { value: "ng/dl" }, { value: "ug/L" }],
          oldValue: null,
          newValue: null,
          unitValue: "nmol/L",
          afterUnit: "ng/ml",
          transform: [
            { unit: "nmol/L", formula: 0.29 },
            { unit: "ug/L", formula: 1 },
            { unit: "ng/dl", formula: 0.01 },
          ],
        },
      ], //构造单位转换的数据
    }
  }
  // 计算BMI
  calcuBmi = (height, weight) => {
    if (height && weight) {
      this.setState({
        bmi: (
          parseInt(weight) /
          ((parseInt(height) * parseInt(height)) / 10000)
        ).toPrecision(3),
      })
    } else {
      this.setState({
        bmi: "",
      })
    }
  }
  // 计算孕周
  getInsemination = (val, type, selectStage) => {
    let diffDate14 = moment(new Date(val)).subtract(14, "days")
    let diffDate17 = moment(new Date(val)).subtract(17, "days")
    let changday = null
    if (selectStage === "手术日") {
      if (type === "IUI") {
        changday = moment(new Date()).diff(moment(diffDate14), "days")
      } else {
        changday = moment(new Date()).diff(moment(diffDate17), "days")
      }
    } else {
      changday = moment(new Date()).diff(moment(new Date(val)), "days")
    }
    this.setState({
      pregnancyWeek: parseInt(changday / 7, 10),
      pregnancyDay: changday % 7,
    })
  }
  // 改变身高体重
  changeInput = (target, parm) => {
    let { weight, height } = this.state
    if (parm === "weight") {
      this.setState({
        weight: target.value,
      })
      this.calcuBmi(height, target.value)
    } else if (parm === "height") {
      this.setState({
        height: target.value,
      })
      this.calcuBmi(target.value, weight)
    } else {
      this.setState({
        bmi: target.value,
      })
    }
  }
  // 选择的是末次月经还是手术日
  changeStage = (val) => {
    let { dateString, checkOption } = this.state
    this.setState({
      selectStage: val,
    })
    if (val === "手术日") {
      this.setState({
        showBox: true,
      })
    } else {
      this.setState({
        showBox: false,
      })
    }
    if (dateString) {
      this.getInsemination(dateString, checkOption, val)
    }
  }
  // 改变是ivf还是iui
  changeBox = (e) => {
    let { dateString, selectStage } = this.state
    this.setState({
      checkOption: e.target.value,
    })
    if (dateString) {
      this.getInsemination(dateString, e.target.value, selectStage)
    }
  }
  // 改变日期
  changeDate = (date, dateString) => {
    let { checkOption, selectStage } = this.state
    this.setState({
      dateString: dateString,
    })
    this.getInsemination(dateString, checkOption, selectStage)
  }
  // 单位转换中数值的改变结果
  changeUnitVale = (index, parm, val) => {
    let { uintData } = this.state
    uintData.forEach((item, i) => {
      if (i === index) {
        item[parm] = val
      }
    })
    this.setState({
      uintData,
    })
  }
  //点击单位转换的按钮
  transForm = (index) => {
    let { uintData } = this.state
    uintData.forEach((item, i) => {
      if (i === index) {
        if (Number(item.oldValue) + "" !== NaN + "") {
          item.transform.forEach((itemt, indext) => {
            if (itemt.unit === item.unitValue) {
              item.newValue = item.oldValue * itemt.formula
            }
          })
        } else {
          message.error("格式不正确，请输入数字！")
        }
      }
    })
    this.setState({
      uintData,
    })
  }
  render() {
    let {
      height,
      weight,
      bmi,
      options,
      checkOption,
      selectStage,
      showBox,
      dateString,
      pregnancyWeek,
      pregnancyDay,
      uintData,
    } = this.state
    return (
      <div id="divPaddingUnit">
        <Tabs defaultActiveKey="计算工具" onChange={this.callback}>
          <TabPane tab="计算工具" key="计算工具">
            <div className="divFlex">
              <div>
                <span className="spanMargin">体重：</span>
                <span className="fontInputWidth">
                  <FontInput
                    placeholder="请输入"
                    addonAfter="kg"
                    value={weight}
                    onChange={({ target }) =>
                      this.changeInput(target, "weight")
                    }
                  />
                </span>
              </div>
              <div>
                <span className="spanMargin">身高：</span>
                <span className="fontInputWidth">
                  <FontInput
                    placeholder="请输入"
                    addonAfter="cm"
                    value={height}
                    onChange={({ target }) =>
                      this.changeInput(target, "height")
                    }
                  />
                </span>
              </div>
              <div>
                <span className="spanMargin">BMI：</span>
                <span className="fontInputWidth">
                  <FontInput
                    placeholder="请输入"
                    value={bmi}
                    onChange={({ target }) => this.changeInput(target, "bmi")}
                  />
                </span>
              </div>
            </div>
            <div className="divFlex">
              <div>
                <span>
                  <span
                    onClick={() => this.changeStage("手术日")}
                    className={
                      selectStage === "手术日" ? "blueColor hand" : "hand"
                    }
                  >
                    手术日
                  </span>
                  /
                  <span
                    onClick={() => this.changeStage("末次月经")}
                    className={
                      selectStage === "末次月经" ? "blueColor hand" : "hand"
                    }
                  >
                    末次月经：
                  </span>
                </span>
              </div>
            </div>
            <div className="divFlex">
              {showBox ? (
                <span>
                  <Radio.Group
                    options={options}
                    defaultValue={checkOption}
                    onChange={this.changeBox}
                  />
                </span>
              ) : null}
            </div>
            <div className="divFlex">
              <div>
                <FontDate
                  allowClear={false}
                  value={dateString ? moment(new Date(dateString)) : ""}
                  onChange={this.changeDate}
                />
              </div>
              <span className="spanMargin">孕：</span>
              <span>
                <Input
                  placeholder="请输入"
                  addonAfter="周"
                  className="fontInputWidth"
                  value={pregnancyWeek}
                />
                <Input
                  placeholder="请输入"
                  addonAfter="天"
                  className="fontInputWidth"
                  value={pregnancyDay}
                />
              </span>
            </div>
          </TabPane>
          <TabPane tab="单位转换" key="单位转换">
            <Tabs defaultActiveKey="1" type="card">
              {uintData.map((item, index) => {
                return (
                  <TabPane tab={item.name} key={index + 1}>
                    <Input
                      style={{ width: "150px" }}
                      value={item.oldValue}
                      onChange={(e) =>
                        this.changeUnitVale(index, "oldValue", e.target.value)
                      }
                    />
                    <Select
                      value={item.unitValue}
                      options={item.option}
                      style={{ width: "100px" }}
                      onChange={(val) =>
                        this.changeUnitVale(index, "unitValue", val)
                      }
                    />
                    <SwapOutlined
                      className="iconUnit"
                      onClick={() => this.transForm(index)}
                    />
                    <Input
                      style={{ width: "195px" }}
                      value={item.newValue}
                      addonAfter={item.afterUnit}
                    />
                  </TabPane>
                )
              })}
            </Tabs>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
