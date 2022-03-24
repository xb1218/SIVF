import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import {
  Select,
  DatePicker,
  Radio,
  Switch,
  message,
  Button,
  Cascader,
} from "antd"
import { spermData, eggData, inseData } from "./defaultData"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { renderOptions } from "@/app/utils/tool.js"
import apis from "@/app/utils/apis"
import moment from "moment"
const dateFormat = "YYYY-MM-DD"

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: null,
      initflag: false,
      editFlag: false,
      editPanel: false,
    }
  }
  // 方案中的类型，IUI，复苏周期没有取卵，卵子冷冻没有取精
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    let { select_one } = this.props.store
    let select = JSON.parse(localStorage.getItem("patient"))
    this.getPlan(this.props.store.resumePeople ? select : select_one)
  }
  //获取方案信息
  getPlan = (data) => {
    let { select_one } = this.props.store
    apis.Patients_monitor.getPlanInit(data ? data : select_one).then((res) => {
      if (res.code === 200) {
        this.planData(res.data)
      }
    })
  }
  // 方案信息
  planData = (data) => {
    this.props.checkLmp(data.lmp)
    data.sperm = data.sperm ? data.sperm : "鲜夫精"
    if (data.artMethod === "新鲜周期") {
      data.egg = data.egg ? data.egg : "取卵"
      data.inseminationMethod = data.inseminationMethod
        ? data.inseminationMethod
        : "IVF"
    }
    this.setState({
      dataList: data,
      initflag: true,
      editPanel: data.edited,
    })
  }
  //输入框取值
  setObjVal = async (val, obj, param, parm) => {
    let { editPanel } = this.state
    let { editTag, editModalName } = this.props
    if (editTag === 0 && editModalName === "周期方案") {
    } else {
      if (editPanel === 0) {
        if (param === "planType") {
          obj[param] = val[1]
          obj[parm] = val[0]
        } else {
          obj[param] = val
        }
        await this.setState({
          obj,
        })
      } else {
        message.destroy()
        message.error("已有扳机，不可修改方案！")
      }
    }
  }
  //保存方法
  saveFuc = () => {
    let { dataList } = this.state
    let { select_one } = this.props.store
    let select = JSON.parse(localStorage.getItem("patient"))
    let obj = dataList
    if (obj.lmp) {
      obj.patientParam = this.props.store.resumePeople ? select : select_one
      apis.Patients_monitor.savePlane(obj).then((res) => {
        if (res.code === 200) {
          this.getPlan(this.props.store.resumePeople ? select : select_one)
          message.success(res.data)
          this.setState({ editFlag: false })
        }
      })
    } else {
      message.error("请选择LMP日期！")
    }
  }
  render() {
    let { dataList, editFlag, initflag } = this.state
    let { editTag, editModalName } = this.props
    const treeData = [
      {
        label: "自然周期",
        value: "自然周期",
      },
      {
        label: "刺激周期",
        value: "刺激周期",
        children: [
          {
            label: "长方案",
            value: "长方案",
          },
          {
            label: "短方案",
            value: "短方案",
          },
          {
            label: "拮抗方案",
            value: "拮抗方案",
          },
        ],
      },
      {
        label: "微刺激周期",
        value: "微刺激周期",
        children: [
          {
            label: "IUI方案",
            value: "IUI方案",
          },
        ],
      },
      {
        label: "内膜方案",
        value: "内膜方案",
        children: [
          {
            label: "人工周期",
            value: "人工周期",
          },
          {
            label: "降调人工周期",
            value: "降调人工周期",
          },
          {
            label: "自然周期",
            value: "自然周期",
          },
          {
            label: "促排周期",
            value: "促排周期",
          },
        ],
      },
    ]
    let { selectOption } = this.props
    return (
      <div>
        {initflag ? (
          <>
            <div
              style={{
                textAlign: "right",
                marginRight: "1em",
                height: "0",
              }}
            >
              {editFlag ? null : (
                <svg
                  className="icon_m"
                  aria-hidden="true"
                  onClick={() => {
                    this.setState({ editFlag: true })
                  }}
                >
                  <use xlinkHref="#iconedit-fill" />
                </svg>
              )}
            </div>
            {editFlag ? (
              <div className="editPlanDIV editPlan">
                <FlexItem marginleft={"1em"} className="editPlan">
                  <div>
                    <span>LMP:</span>
                    <span>
                      <DatePicker
                        defaultValue={
                          dataList.lmp ? moment(dataList.lmp, dateFormat) : null
                        }
                        value={
                          dataList.lmp ? moment(dataList.lmp, dateFormat) : null
                        }
                        onChange={(date, dateString) => {
                          this.setObjVal(dateString, dataList, "lmp")
                          this.props.checkLmp(dateString)
                        }}
                      />
                    </span>
                  </div>
                  <div>
                    <span>
                      <Select
                        placeholder="ART方式"
                        value={dataList.artMethod}
                        defaultValue={dataList.artMethod}
                        showArrow={false}
                        style={{ width: 100 }}
                        onChange={(value) => {
                          this.setObjVal(value, dataList, "artMethod")
                        }}
                      >
                        {renderOptions(selectOption, "40")}
                      </Select>
                    </span>
                  </div>
                  <div>
                    <Select
                      placeholder="治疗地点"
                      value={dataList.place}
                      defaultValue={dataList.place}
                      showArrow={false}
                      style={{ width: 100 }}
                      onChange={(value) =>
                        this.setObjVal(value, dataList, "place")
                      }
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
                      onChange={(value) =>
                        this.setObjVal(value, dataList, "group")
                      }
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
                        this.setObjVal(
                          value,
                          dataList,
                          "planType",
                          "planCycleType"
                        )
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
                      disabled={
                        dataList.artMethod === "卵子冷冻" ? true : false
                      }
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
                        dataList.artMethod === "IUI" ||
                        dataList.artMethod === "复苏周期"
                          ? true
                          : false
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
                        dataList.artMethod === "IUI" ||
                        dataList.artMethod === "复苏周期"
                          ? true
                          : false
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
                        dataList.artMethod === "IUI" ||
                        dataList.artMethod === "复苏周期"
                          ? true
                          : false
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
                        dataList.artMethod === "IUI" ||
                        dataList.artMethod === "复苏周期"
                          ? true
                          : false
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
                        dataList.artMethod === "IUI" ||
                        dataList.artMethod === "复苏周期"
                          ? true
                          : false
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
                        dataList.artMethod === "IUI" ||
                        dataList.artMethod === "复苏周期"
                          ? true
                          : false
                      }
                      checked={dataList.pgtA || 0}
                      onChange={(val) => {
                        this.setObjVal(val ? 1 : 0, dataList, "pgtA")
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        if (editTag === 0 && editModalName === "B超") {
                          message.error("该数据从修订记录获取，不可保存")
                        } else {
                          this.saveFuc()
                        }
                      }}
                    >
                      提交
                    </Button>
                  </div>
                </FlexItem>
              </div>
            ) : (
              <FlexItem marginleft={"1em"}>
                <div>
                  LMP：
                  <span className="span_underline" style={{ width: "100px" }}>
                    {dataList.lmp}
                  </span>
                </div>
                <div>
                  <span className="span_underline" style={{ width: 100 }}>
                    {dataList.artMethod}
                  </span>
                </div>

                <div>
                  <span className="span_underline" style={{ width: 180 }}>
                    {dataList.medicationPlan}
                  </span>
                </div>
                <div>
                  <span className="span_underline" style={{ width: 100 }}>
                    {dataList.inseminationMethod}
                  </span>
                </div>
                <div>
                  {dataList.sperm ? (
                    <span className="span_underline">{dataList.sperm}</span>
                  ) : null}
                </div>
                <div>
                  {dataList.egg ? (
                    <span className="span_underline">{dataList.egg}</span>
                  ) : null}
                </div>

                <div>
                  {dataList.ivm && dataList.ivm === 1 ? (
                    <span className="span_underline"> IVM</span>
                  ) : null}
                  {dataList.pgtSr && dataList.pgtSr === 1 ? (
                    <span className="span_underline">PGT-SR</span>
                  ) : null}
                  {dataList.pgtM && dataList.pgtM === 1 ? (
                    <span className="span_underline">PGT-M</span>
                  ) : null}
                  {dataList.pgtA && dataList.pgtA === 1 ? (
                    <span className="span_underline">PGT-A</span>
                  ) : null}
                </div>
                <div>
                  <span className="span_underline">{dataList.place}</span>
                </div>
                <div>
                  <span className="span_underline">{dataList.group}</span>
                </div>
              </FlexItem>
            )}
          </>
        ) : null}
      </div>
    )
  }
}
