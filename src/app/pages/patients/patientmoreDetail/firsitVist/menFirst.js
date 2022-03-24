import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { DatePicker, Select, Input, Switch, Button } from "antd"
import { renderOptions } from "@/app/utils/tool.js"
import { todayString } from "@/app/utils/const.js"
import apis from "@/app/utils/apis.js"
import moment from "moment"
import { FlexItem } from "@/app/components/base/baseForms"

const dateFormat = "YYYY-MM-DD"

//月经史
export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: {},
      optionsData: [], //下拉框的值
    }
  }
  componentDidMount() {
    this.initOption()
    this.getMenValue()
    this.props.onRef && this.props.onRef(this)
  }
  // 病史下拉框
  initOption = () => {
    apis.Patients_dishistory.initOptions().then((res) => {
      this.setState({
        optionsData: res.data,
      })
    })
  }
  // 获取病史的值
  getMenValue = () => {
    let { select_one } = this.props.store
    apis.Mensturation.getHistory(select_one).then((res) => {
      if (res.code === 200) {
        let data = res.data.lastMenstrualDate
        res.data.lastMenstrualDate = data
          ? data
          : moment(new Date()).format("YYYY-MM-DD")
        this.setState({
          dataList: res.data,
        })
      }
    })
  }
  // 病史的保存
  saveMen = () => {
    let { dataList } = this.state
    let { select_one } = this.props.store
    let obj = {
      patientParam: select_one,
      ...dataList,
    }
    apis.Mensturation.saveHistory(obj).then((res) => {
      if (res.code === 200) {
        this.props.initPage()
      }
    })
  }
  //改变state中data值
  setStaeData = (param, val) => {
    const { dataList } = this.state
    if (
      param === "cycleMin" ||
      param === "cycleMax" ||
      param === "menstruationMin" ||
      param === "menstruationMax"
    ) {
      if (val) {
        dataList[param] = parseInt(val)
      } else {
        dataList[param] = null
      }
    } else {
      dataList[param] = val
    }
    this.setState({
      dataList,
    })
  }

  render() {
    let data = this.state.dataList
    let { optionsData } = this.state
    return (
      <div>
        <FlexItem>
          <div>
            <span>月经规律</span>
            <Select
              value={data.menstrualStatus}
              defaultValue={data.menstrualStatus}
              style={{ width: "100px" }}
              onChange={(val) => this.setStaeData("menstrualStatus", val)}
            >
              {renderOptions(optionsData, "230")}
            </Select>
          </div>
          <div>
            <span>初潮</span>
            <Input
              addonAfter="岁"
              value={data.menarcheAge}
              defaultValue={data.menarcheAge}
              onChange={(e) => this.setStaeData("menarcheAge", e.target.value)}
            />
          </div>
          <div>
            <span>末次月经</span>
            <DatePicker
              value={
                data.lastMenstrualDate
                  ? moment(data.lastMenstrualDate, dateFormat)
                  : moment(todayString, dateFormat)
              }
              defaultValue={
                data.lastMenstrualDate
                  ? moment(data.lastMenstrualDate, dateFormat)
                  : moment(todayString, dateFormat)
              }
              onChange={(date, dateString) =>
                this.setStaeData("lastMenstrualDate", dateString)
              }
            />
          </div>
        </FlexItem>
        <FlexItem>
          <div>
            <span>周期</span>
            <Input
              addonAfter="天"
              value={data.cycleMin}
              defaultValue={data.cycleMin}
              onChange={(e) => this.setStaeData("cycleMin", e.target.value)}
            />
            至
            <Input
              addonAfter="天"
              value={data.cycleMax}
              defaultValue={data.cycleMax}
              onChange={(e) => this.setStaeData("cycleMax", e.target.value)}
            />
          </div>
          <div>
            <span>经期</span>
            <Input
              addonAfter="天"
              value={data.menstruationMin}
              defaultValue={data.menstruationMin}
              onChange={(e) =>
                this.setStaeData("menstruationMin", e.target.value)
              }
            />
            至
            <Input
              addonAfter="天"
              value={data.menstruationMax}
              defaultValue={data.menstruationMax}
              onChange={(e) =>
                this.setStaeData("menstruationMax", e.target.value)
              }
            />
          </div>
          <div>
            <span>月经量</span>
            <Select
              style={{ width: "100px" }}
              value={data.menstrualVolume}
              defaultValue={data.menstrualVolume}
              onChange={(val) => this.setStaeData("menstrualVolume", val)}
            >
              {renderOptions(optionsData, "234")}
            </Select>
          </div>
          <div>
            <span>痛经</span>
            <Select
              style={{ width: "100px" }}
              value={data.dysmenorrheaDegree}
              defaultValue={data.dysmenorrheaDegree}
              onChange={(val) => this.setStaeData("dysmenorrheaDegree", val)}
            >
              {renderOptions(optionsData, "38")}
            </Select>
          </div>
        </FlexItem>
        {data.menstrualStatus !== "月经规律" ? (
          <FlexItem>
            <div>
              <Input
                addonAfter="岁"
                value={data.irregularAge}
                defaultValue={data.irregularAge}
                onChange={(e) =>
                  this.setStaeData("irregularAge", e.target.value)
                }
              />
              <span className="rightText">开始不规律</span>
            </div>
            <div>
              <span style={{ width: "45px" }}>治疗过</span>
              <Switch
                checked={data.regularTreated}
                onChange={(val) => {
                  this.setStaeData("regularTreated", val ? 1 : 0)
                }}
              />
            </div>
            {data.regularTreated ? (
              <>
                <div>
                  <Input
                    addonAfter="岁"
                    value={data.regularTreatAge}
                    defaultValue={data.regularTreatAge}
                    onChange={(e) =>
                      this.setStaeData(
                        "regularTreatAge",
                        e.target.value ? parseInt(e.target.value) : ""
                      )
                    }
                  />
                  <span className="rightText">开始治疗</span>
                </div>
                <div>
                  <span style={{ width: "30px" }} className="rightText">
                    时长
                  </span>
                  <Input
                    addonAfter="年"
                    value={data.regularTreatYear}
                    defaultValue={data.regularTreatYear}
                    onChange={(e) =>
                      this.setStaeData(
                        "regularTreatYear",
                        e.target.value ? parseInt(e.target.value) : ""
                      )
                    }
                  />
                </div>
                <div>
                  <span className="rightText" style={{ width: "30px" }}>
                    方法
                  </span>
                  <Select
                    style={{ width: "100px" }}
                    value={data.regularTreatMethod}
                    defaultValue={data.regularTreatMethod}
                    onChange={(val) =>
                      this.setStaeData("regularTreatMethod", val)
                    }
                  >
                    {renderOptions(optionsData, "233")}
                  </Select>
                </div>
              </>
            ) : null}

            <div>
              <span>逐渐正常</span>
              <Switch
                checked={data.irregularToNormal}
                onChange={(val) => {
                  this.setStaeData("irregularToNormal", val ? 1 : 0)
                }}
              />
            </div>
            {data.irregularToNormal ? (
              <div>
                <Input
                  addonAfter="岁"
                  value={data.toNormalAge}
                  defaultValue={data.toNormalAge}
                  onChange={(e) =>
                    this.setStaeData(
                      "toNormalAge",
                      e.target.value ? parseInt(e.target.value) : ""
                    )
                  }
                />
                <span className="rightText">转为正常</span>
              </div>
            ) : null}
          </FlexItem>
        ) : null}
        {data.menstrualStatus === "绝经" ? (
          <FlexItem marginleft={"1em"}>
            <div>
              <span className="rightText" style={{ width: "30px" }}>
                绝经
              </span>
              <Input
                addonAfter="岁"
                value={data.menopauseAge}
                defaultValue={data.menopauseAge}
                onChange={(e) =>
                  this.setStaeData(
                    "menopauseAge",
                    e.target.value ? parseInt(e.target.value) : ""
                  )
                }
              />
            </div>
            <div>
              <Input
                addonAfter="岁"
                value={data.irregularAge}
                defaultValue={data.irregularAge}
                onChange={(e) =>
                  this.setStaeData(
                    "irregularAge",
                    e.target.value ? parseInt(e.target.value) : ""
                  )
                }
              />
              <span className="rightText" style={{ width: "90px" }}>
                开始月经异常
              </span>
            </div>
            <div>
              <span style={{ width: "100px" }} className="rightText">
                绝经前异常表现
              </span>
              <Select
                style={{ width: "100px" }}
                value={data.abnormalPerformance}
                defaultValue={data.abnormalPerformance}
                onChange={(val) => this.setStaeData("abnormalPerformance", val)}
              >
                {renderOptions(optionsData, "83")}
              </Select>
            </div>
            <div>
              <span style={{ width: "130px" }} className="rightText">
                绝经前月经维持方式
              </span>
              <Select
                style={{ width: "100px" }}
                value={data.maintenanceMode}
                defaultValue={data.maintenanceMode}
                onChange={(val) => this.setStaeData("maintenanceMode", val)}
              >
                {renderOptions(optionsData, "84")}
              </Select>
            </div>
            <div>
              <span style={{ width: "100px" }} className="rightText">
                绝经后阴道出血
              </span>
              <Switch
                checked={data.vaginalBleeding}
                onChange={(val) => {
                  this.setStaeData("vaginalBleeding", val ? 1 : 0)
                }}
              />
            </div>
            <div>
              <span style={{ width: "100px" }} className="rightText">
                绝经后阴道流液
              </span>
              <Switch
                checked={data.vaginalWater}
                onChange={(val) => {
                  this.setStaeData("vaginalWater", val ? 1 : 0)
                }}
              />
            </div>
            <div>
              <span style={{ width: "200px" }} className="rightText">
                伴潮热，盗汗，暴躁易怒等症状
              </span>
              <Switch
                checked={data.hotFlashNightSweat}
                onChange={(val) => {
                  this.setStaeData("hotFlashNightSweat", val ? 1 : 0)
                }}
              />
            </div>
          </FlexItem>
        ) : null}
        <Button
          type="primary"
          size="small"
          className="menButton"
          onClick={this.saveMen}
        >
          保存
        </Button>
      </div>
    )
  }
}
