import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Switch, Select, Input } from "antd"
import { FlexItem } from "@/app/components/base/baseForms"

const { TextArea } = Input
const { Option } = Select

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: { ...props.data },
      dateList: ["年", "月", "日"]
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        dataList: nextProps.data,
      })
    }
  }
  //改变state中data值
  setStaeData = (param, val) => {
    const { dataList } = this.state
    dataList[param] = val
    this.setState({
      dataList,
    })
    this.props.changeData(dataList, "personalHistoryVO")
  }

  render() {
    let { renderOptions } = this.props.moredetail
    const { optionsData } = this.props
    let { dateList } = this.state
    let data = this.state.dataList
    return (
      <div>
        <FlexItem>
          <div>
            <span>健康状况</span>
            <span style={{ marginLeft: "15px" }}>过去</span>
            <Select
              showArrow={false}
              style={{ width: 70 }}
              value={data.pastHealth}
              onChange={(val) => {
                this.setStaeData("pastHealth", val)
              }}
            >
              {renderOptions(optionsData, "239")}
            </Select>
            <span style={{ marginLeft: "15px" }}>现在</span>
            <Select
              showArrow={false}
              style={{ width: 70 }}
              value={data.currentHealth}
              onChange={(val) => {
                this.setStaeData("currentHealth", val)
              }}
            >
              {renderOptions(optionsData, "239")}
            </Select>
          </div>
          <div>
            <span>吸毒</span>
            <Switch
              checked={data.drugs}
              onChange={(val) => {
                this.setStaeData("drugs", val ? 1 : 0)
              }}
            />
          </div>
          <div>
            <span>出生缺陷</span>
            <Switch
              checked={data.birthDefect}
              onChange={(val) => {
                this.setStaeData("birthDefect", val ? 1 : 0)
              }}
            />
          </div>
          <div>
            <span>习惯用药</span>
            <Switch
              checked={data.habitualDrug}
              onChange={(val) => {
                this.setStaeData("habitualDrug", val ? 1 : 0)
              }}
            />
          </div>
        </FlexItem>
        <FlexItem>
          <div>
            <span>吸烟</span>
            <Switch
              checked={data.smokingTag}
              onChange={(val) => {
                this.setStaeData("smokingTag", val ? 1 : 0)
              }}
            />
          </div>
          <div>
            <span style={{ width: "60px" }}>被动吸烟</span>
            <Select
              showArrow={false}
              style={{ width: "120px" }}
              value={data.passiveSmokingFrequency}
              onChange={(val) => {
                this.setStaeData("passiveSmokingFrequency", val)
              }}
            >
              {renderOptions(optionsData, "215")}
            </Select>
          </div>
          <div>
            <span>饮酒</span>
            <Switch
              checked={data.alcoholTag}
              onChange={(val) => {
                this.setStaeData("alcoholTag", val ? 1 : 0)
              }}
            />
          </div>
          <div>
            <span>婚外性生活史</span>
            <Switch
              checked={data.outsideMarriageSex}
              onChange={(val) => {
                this.setStaeData("outsideMarriageSex", val ? 1 : 0)
              }}
            />
          </div>
          <div>
            <span style={{ width: 100 }}>重大精神刺激史</span>
            <Switch
              checked={data.mentalStimulation}
              onChange={(val) => {
                this.setStaeData("mentalStimulation", val ? 1 : 0)
              }}
            />
          </div>
        </FlexItem>
        {data.smokingTag ? (
          <FlexItem className="related_line">
            <div>
              <span>吸烟情况</span>
              <Select
                showArrow={false}
                style={{ width: 70 }}
                value={data.smokingHistory}
                defaultValue={data.smokingHistory}
                onChange={(val) => {
                  this.setStaeData("smokingHistory", val)
                }}
              >
                {renderOptions(optionsData, "214")}
              </Select>
            </div>
            {
              data.smokingHistory === "曾经" ? 
              <div style={{ marginRight: "12px" }}>
                <span>戒烟</span>
                <Input
                  style={{ width: 50 }}
                  value={data.noSmokingYear}
                  defaultValue={data.noSmokingYear}
                  onChange={(e) =>
                    this.setStaeData("noSmokingYear", e.target.value)
                  }
                />
                <Select
                style={{ width: 70 }}
                value={data.noSmokingFlg || "年"}
                onChange={(val) => {
                  this.setStaeData("noSmokingFlg", val)
                }}
              >
                {
                  dateList.map(item => {
                    return(
                      <Option value={item} key={item}>{item}</Option>
                    )
                  })
                }
              </Select>
              </div>: null
            }
            <div>
              <span>烟龄</span>
              <Input
                addonAfter="年"
                value={data.smokingHours}
                defaultValue={data.smokingHours}
                onChange={(e) =>
                  this.setStaeData("smokingHours", e.target.value)
                }
              />
            </div>
            <div style={{ marginRight: "12px" }}>
              <span>平均</span>
              <Input
                addonAfter="支/天"
                value={data.smokingEveryday}
                defaultValue={data.smokingEveryday}
                onChange={(e) =>
                  this.setStaeData("smokingEveryday", e.target.value)
                }
              />
            </div>
            <div>
              <span>戒烟前</span>
              <Input
                addonAfter="支/天"
                value={data.noSmokingEveryday}
                defaultValue={data.noSmokingEveryday}
                onChange={(e) =>
                  this.setStaeData("noSmokingEveryday", e.target.value)
                }
              />
            </div>
          </FlexItem>
        ) : null}

        {data.alcoholTag ? (
          <FlexItem className="related_line">
            <div>
              <span>饮酒情况</span>
              <Select
                style={{ width: "130px" }}
                dropdownMatchSelectWidth={200}
                showArrow={false}
                value={data.alcoholConsumption}
                defaultValue={data.alcoholConsumption}
                onChange={(val) => {
                  this.setStaeData("alcoholConsumption", val)
                }}
              >
                {renderOptions(optionsData, "21")}
              </Select>
              {
                data.alcoholConsumption === "戒酒" ? 
                <>
                  <Input
                    style={{ width: 50 }}
                    value={data.drinkConditionYear}
                    defaultValue={data.drinkConditionYear}
                    onChange={(e) =>
                      this.setStaeData("drinkConditionYear", e.target.value)
                    }
                  />
                  <Select
                    style={{ width: 70 }}
                    value={data.drinkConditionFlg || "年"}
                    onChange={(val) => {
                      this.setStaeData("drinkConditionFlg", val)
                    }}
                  >
                    {
                      dateList.map(item => {
                        return(
                          <Option value={item} key={item}>{item}</Option>
                        )
                      })
                    }
                  </Select>
                </>
                : null
              }
            </div>
            <div>
              <span>习惯饮酒</span>
              <Input
                addonAfter="岁"
                value={data.alcoholAge}
                defaultValue={data.alcoholAge}
                onChange={(e) => this.setStaeData("alcoholAge", e.target.value)}
              />
            </div>
            <div>
            <span>饮酒</span>
            <Input
              style={{ width: 50 }}
              value={data.drinkYear}
              defaultValue={data.drinkYear}
              onChange={(e) =>
                this.setStaeData("drinkYear", e.target.value)
              }
            />
            <Select
              style={{ width: 70 }}
              value={data.drinkFlg || "年"}
              onChange={(val) => {
                this.setStaeData("drinkFlg", val)
              }}
            >
              {
                dateList.map(item => {
                  return(
                    <Option value={item} key={item}>{item}</Option>
                  )
                })
              }
            </Select>
            </div>
            <div>
              <Input
                addonAfter="次/周"
                value={data.drinkTimeWeek}
                defaultValue={data.drinkTimeWeek}
                onChange={(e) => this.setStaeData("drinkTimeWeek", e.target.value)}
              />
            </div>
            <div>
              <Input
                addonAfter="ml/次"
                value={data.drinkManyOnce}
                defaultValue={data.drinkManyOnce}
                onChange={(e) => this.setStaeData("drinkManyOnce", e.target.value)}
              />
            </div>
            <div>
              <span>酗酒</span>
              <Switch
                checked={data.alcoholism}
                onChange={(val) => {
                  this.setStaeData("alcoholism", val ? 1 : 0)
                }}
              />
            </div>
          </FlexItem>
        ) : null}

        <FlexItem>
          <div>
            <span>职业</span>
            <Select
              showArrow={false}
              style={{ width: 130 }}
              value={data.occupation}
              defaultValue={data.occupation}
              onChange={(val) => {
                this.setStaeData("occupation", val)
              }}
            >
              {renderOptions(optionsData, "11")}
            </Select>
            <Input
              style={{ width: 120 }}
              value={data.jobDescription}
              defaultValue={data.jobDescription}
              onChange={(e) =>
                this.setStaeData("jobDescription", e.target.value)
              }
            />
          </div>
          <div>
            <span>工作类型</span>
            <Select
              showArrow={false}
              style={{ width: 130 }}
              value={data.workType}
              defaultValue={data.workType}
              onChange={(val) => {
                this.setStaeData("workType", val)
              }}
            >
              {renderOptions(optionsData, "18")}
            </Select>
          </div>
          <div>
            <span>每周熬夜</span>
            <Select
              showArrow={false}
              style={{ width: 130 }}
              value={data.stayUpLate}
              onChange={(val) => {
                this.setStaeData("stayUpLate", val)
              }}
            >
              {renderOptions(optionsData, "216")}
            </Select>
          </div>
          <div>
            <span>睡眠</span>
            <Select
              showArrow={false}
              style={{ width: "120px" }}
              value={data.sleepConditions}
              onChange={(val) => {
                this.setStaeData("sleepConditions", val)
              }}
            >
              {renderOptions(optionsData, "217")}
            </Select>
          </div>
          <div>
            <span>药物帮助睡眠</span>
            <Switch
              checked={data.helpSleep}
              onChange={(val) => {
                this.setStaeData("helpSleep", val ? 1 : 0)
              }}
            />
          </div>
        </FlexItem>
        {data.workType === "夜班" || data.workType === "倒班" ? (
          <FlexItem>
            <div className="related_line">
              <span>夜班频率</span>
              <Input
                style={{ width: "80px" }}
                value={data.nightShiftFrequency}
                defaultValue={data.nightShiftFrequency}
                onChange={(e) =>
                  this.setStaeData("nightShiftFrequency", e.target.value)
                }
              />
              <Select
                showArrow={false}
                style={{ width: "80px" }}
                value={data.nightShiftUnit}
                defaultValue={data.nightShiftUnit}
                onChange={(val) => {
                  this.setStaeData("nightShiftUnit", val)
                }}
              >
                <Select.Option value="周">次/周</Select.Option>
                <Select.Option value="月">次/月</Select.Option>
                <Select.Option value="年">次/年</Select.Option>
              </Select>
            </div>
            {data.helpSleep ? (
              <>
                <div className="related_line">
                  <span>助眠用药</span>
                  <Input
                    style={{ width: "80px" }}
                    value={data.helpSleepMedicine}
                    defaultValue={data.helpSleepMedicine}
                    onChange={(e) =>
                      this.setStaeData("helpSleepMedicine", e.target.value)
                    }
                  />
                </div>
                <div className="related_line">
                  <span>频次</span>
                  <Input
                    addonAfter="次/周"
                    value={data.helpSleepNumber}
                    defaultValue={data.helpSleepNumber}
                    onChange={(e) =>
                      this.setStaeData("helpSleepNumber", e.target.value)
                    }
                  />
                </div>
              </>
            ) : null}
          </FlexItem>
        ) : null}
        <FlexItem>
          <div>
            <span>环境</span>
            <Select
              showArrow={false}
              style={{ width: 200 }}
              value={data.workEnvironment}
              onChange={(val) => {
                this.setStaeData("workEnvironment", val)
              }}
            >
              {renderOptions(optionsData, "19")}
            </Select>
          </div>
          <div>
            <span>染发烫发</span>
            <Select
              showArrow={false}
              style={{ width: "120px" }}
              value={data.dyePermHair}
              onChange={(val) => {
                this.setStaeData("dyePermHair", val)
              }}
            >
              {renderOptions(optionsData, "22")}
            </Select>
          </div>
          <div>
            <span style={{ width: 120 }}>接触生殖毒性物质</span>
            <Switch
              checked={data.reproductiveToxicants}
              onChange={(val) => {
                this.setStaeData("reproductiveToxicants", val ? 1 : 0)
              }}
            />
          </div>
          <div>
            <span>接触放射线</span>
            <Switch
              checked={data.radiation}
              onChange={(val) => {
                this.setStaeData("radiation", val ? 1 : 0)
              }}
            />
          </div>
        </FlexItem>
        <FlexItem>
          <div>
            <span>泡澡或桑拿</span>
            <Switch
              checked={data.habitualBaths}
              onChange={(val) => {
                this.setStaeData("habitualBaths", val ? 1 : 0)
              }}
            />
          </div>
          <div>
            <span>长期食用棉籽油</span>
            <Select
              showArrow={false}
              style={{ width: 150 }}
              value={data.cottonseedOil}
              onChange={(val) => {
                this.setStaeData("cottonseedOil", val)
              }}
            >
              {renderOptions(optionsData, "23")}
            </Select>
          </div>
          <div>
            <span>经常喝咖啡</span>
            <Select
              showArrow={false}
              style={{ width: "145px" }}
              value={data.drinkCoffeeRegularly}
              onChange={(val) => {
                this.setStaeData("drinkCoffeeRegularly", val)
              }}
            >
              {renderOptions(optionsData, "23")}
            </Select>
          </div>
          <div>
            <span>经常喝茶</span>
            <Select
              showArrow={false}
              style={{ width: 150 }}
              value={data.drinkTeaRegularly}
              onChange={(val) => {
                this.setStaeData("drinkTeaRegularly", val)
              }}
            >
              {renderOptions(optionsData, "23")}
            </Select>
          </div>
        </FlexItem>
        <FlexItem style={{ height: "60px" }}>
          <div style={{ width: "100%" }}>
            <span>其他</span>
            <TextArea
              rows={2}
              style={{ width: "90%" }}
              value={data.others}
              defaultValue={data.others}
              onChange={(e) => this.setStaeData("others", e.target.value)}
            />
          </div>
        </FlexItem>
      </div>
    )
  }
}
