import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Select, DatePicker, Radio, Switch, Cascader } from "antd"
import {
  spermData,
  eggData,
  inseData,
} from "@/app/pages/patients/patientmoreDetail/monitor/defaultData"
import { treeData } from "./defaultData"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { renderOptions } from "@/app/utils/tool.js"
import moment from "moment"
const dateFormat = "YYYY-MM-DD"

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: {},
      planType: "", //当前选中的治疗方案
    }
  }
  // 方案中的类型，IUI，复苏周期没有取卵，卵子冷冻没有取精
  componentDidMount() {
    this.havePlan()
  }
  UNSAFE_componentWillReceiveProps(nextprops) {
    if (this.props.dataSourceTreat !== nextprops.dataSourceTreat) {
      this.havePlan(nextprops.dataSourceTreat)
    }
  }
  // 获取初复诊选择的治疗方案
  havePlan = (datas) => {
    let { dataSourceTreat } = this.props
    let arry = ["IVF", "IUI", "FET"]
    let data = []
    let foreachData = datas ? datas : dataSourceTreat
    foreachData.forEach((item, index) => {
      if (arry.includes(item.treatmentProject)) {
        data.push(item.treatmentProject)
      }
    })
    this.setState({
      planType: data && data[0],
    })
  }
  // 修改方案
  setObjVal = (val, obj, param, parm) => {
    this.props.setObjVal(val, obj, param, parm)
  }
  render() {
    let { planType } = this.state
    let { dataList } = this.props
    let { selectOption } = this.props
    return (
      <div>
        <div className="regimenDiv">
          <div className="editPlanDIV editPlan">
            <FlexItem marginleft={"1em"} className="editPlan regimenItem">
              <div>
                <span>LMP:</span>
                <span>
                  <DatePicker
                    value={
                      dataList.lmp ? moment(dataList.lmp, dateFormat) : null
                    }
                    defaultValue={
                      dataList.lmp ? moment(dataList.lmp, dateFormat) : null
                    }
                    onChange={(date, dateString) => {
                      this.setObjVal(dateString, dataList, "lmp")
                    }}
                  />
                </span>
              </div>
              <div>
                <Select
                  placeholder="治疗地点"
                  value={dataList.place}
                  defaultValue={dataList.place}
                  showArrow={false}
                  style={{ width: 100 }}
                  onChange={(value) => this.setObjVal(value, dataList, "place")}
                >
                  {renderOptions(selectOption, "223")}
                </Select>
              </div>
              <div>
                <Select
                  placeholder="组别"
                  value={dataList.group}
                  defaultValue={dataList.group}
                  showArrow={false}
                  style={{ width: 100 }}
                  onChange={(value) => this.setObjVal(value, dataList, "group")}
                >
                  {renderOptions(selectOption, "222")}
                </Select>
              </div>
              <div>
                <Cascader
                  placeholder="方式类型"
                  allowClear={false}
                  value={[dataList.planCycleType, dataList.planType]}
                  options={treeData}
                  expandTrigger="hover"
                  onChange={(value) =>
                    this.setObjVal(value, dataList, "planType", "planCycleType")
                  }
                />
              </div>
              <div>
                <Select
                  placeholder="用药方案"
                  value={dataList.medicationPlan}
                  defaultValue={dataList.medicationPlan}
                  showArrow={false}
                  dropdownMatchSelectWidth={200}
                  style={{ width: 200 }}
                  onChange={(value) =>
                    this.setObjVal(value, dataList, "medicationPlan")
                  }
                >
                  {renderOptions(selectOption, "44")}
                </Select>
              </div>
            </FlexItem>
            <FlexItem className="editPlan">
              <div>
                <Radio.Group
                  options={spermData}
                  disabled={planType === "卵子冷冻" ? true : false}
                  onChange={(e) =>
                    this.setObjVal(e.target.value, dataList, "sperm")
                  }
                  defaultValue={dataList.sperm}
                  value={dataList.sperm}
                />
              </div>
              <div>
                <Radio.Group
                  options={eggData}
                  disabled={
                    planType === "IUI" || planType === "FET" ? true : false
                  }
                  onChange={(e) =>
                    this.setObjVal(e.target.value, dataList, "egg")
                  }
                  defaultValue={dataList.egg}
                  value={dataList.egg}
                />
              </div>
            </FlexItem>
            <FlexItem className="editPlan">
              <div>
                <Radio.Group
                  options={inseData}
                  disabled={
                    planType === "IUI" || planType === "FET" ? true : false
                  }
                  onChange={(e) =>
                    this.setObjVal(
                      e.target.value,
                      dataList,
                      "inseminationMethod"
                    )
                  }
                  defaultValue={dataList.inseminationMethod}
                  value={dataList.inseminationMethod}
                />
              </div>
              <div>
                <span> IVM</span>
                <Switch
                  disabled={
                    planType === "IUI" || planType === "FET" ? true : false
                  }
                  checked={dataList.ivm || 0}
                  onChange={(val) => {
                    this.setObjVal(val ? 1 : 0, dataList, "ivm")
                  }}
                />
              </div>
              <div>
                <span> PGT-SR</span>
                <Switch
                  disabled={
                    planType === "IUI" || planType === "FET" ? true : false
                  }
                  checked={dataList.pgtSr || 0}
                  onChange={(val) => {
                    this.setObjVal(val ? 1 : 0, dataList, "pgtSr")
                  }}
                />
              </div>
              <div>
                <span> PGT-M</span>
                <Switch
                  disabled={
                    planType === "IUI" || planType === "FET" ? true : false
                  }
                  checked={dataList.pgtM || 0}
                  onChange={(val) => {
                    this.setObjVal(val ? 1 : 0, dataList, "pgtM")
                  }}
                />
              </div>
              <div>
                <span> PGT-A</span>
                <Switch
                  disabled={
                    planType === "IUI" || planType === "FET" ? true : false
                  }
                  checked={dataList.pgtA || 0}
                  onChange={(val) => {
                    this.setObjVal(val ? 1 : 0, dataList, "pgtA")
                  }}
                />
              </div>
            </FlexItem>
          </div>
        </div>
      </div>
    )
  }
}
