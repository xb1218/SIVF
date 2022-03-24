import React, { Component } from "react"
import styled from "styled-components"
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { inject, observer } from "mobx-react"
import moment from "moment"
import { Button, Radio, Select } from "antd"
import { BaseDiv } from "@/app/components/base/baseSpan"

const Item = styled.div`
  padding-right: 16px;
`
const BlankView = styled.div`
  display: flex;
  align-items: baseline;
  background-color: white;
  margin: 5px 0px;
`
export default
@inject("schedule", "moredetail")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opudate: moment(new Date()).add(2, "days").format("YYYY-MM-DD"), //opu日期
      date: moment(new Date()).format("YYYY-MM-DD"), //移植或iui
      hcgdate: moment(new Date()).format("YYYY-MM-DD"), //hcg日期
      place: "河西分院", //地点
      showopu: moment().add("2", "days").format("YYYY-MM-DD"), //显示的取卵日
      showhcg: moment().format("YYYY-MM-DD"), //显示的hcg日
      groupVal: "A组", //组别,传空代表查询所有
      cycleType: "ivf", //周期类型
      options: [
        { label: "所有人", value: "" },
        { label: "A组", value: "A组" },
        { label: "B组", value: "B组" },
        { label: "C组", value: "C组" },
      ],
      checkGroup: false, //是否选择了所有组
    }
  }
  componentDidMount() {
    let { getSelectOption } = this.props.schedule
    getSelectOption()
  }
  // 组别的改变
  changeGroup = (e) => {
    this.setState({
      groupVal: e.target.value,
    })
    //当选择的value为空时，则选择了所有人
    if (e.target.value === "") {
      this.setState({
        checkGroup: true,
      })
    } else {
      this.setState({
        checkGroup: false,
      })
    }
  }
  // 周期类型的改变
  selectType = (e) => {
    this.setState({
      cycleType: e.target.value,
    })
  }
  // 地点的改变
  changeplace = (val) => {
    this.setState({
      place: val,
    })
  }
  // 筛选条件的改变
  selectData = () => {
    let {
      hcgdate,
      showopu,
      groupVal,
      cycleType,
      opudate,
      showhcg,
      date,
      place,
    } = this.state
    let { name } = this.props
    let data = {}
    switch (name) {
      case "hcg":
        data = {
          type: "hcg",
          hcgDate: hcgdate,
          eggDate: showopu,
          place: place,
        }
        break
      case "opu":
        data = {
          type: "opu",
          eggDate: opudate,
          hcgDate: showhcg,
          place: place,
        }
        break
      case "iui":
        data = {
          iuiPlantDate: date,
          place: place,
        }
        break
      case "et":
        data = {
          plantDate: date,
          cycleType: cycleType,
          place: place,
        }
        break
      default:
        break
    }
    data.groups = groupVal
    return data
  }
  // 点击筛选
  searchList = () => {
    let { checkGroup } = this.state
    this.props.search(this.selectData(), checkGroup)
  }
  // 日期控件向前一天
  setYesterdayDate = (parm, val) => {
    this.setState({
      [parm]: moment(val).subtract(1, "days").format("YYYY-MM-DD"),
    })
    if (parm === "opudate") {
      this.setState({
        hcgdate: moment(val).subtract(3, "days").format("YYYY-MM-DD"),
        showopu: moment(val).subtract(1, "days").format("YYYY-MM-DD"),
        showhcg: moment(val).subtract(3, "days").format("YYYY-MM-DD"),
      })
    }
    if (parm === "hcgdate") {
      this.setState({
        opudate: moment(val).add(1, "days").format("YYYY-MM-DD"),
        showopu: moment(val).add(1, "days").format("YYYY-MM-DD"),
        showhcg: moment(val).subtract(1, "days").format("YYYY-MM-DD"),
      })
    }
  }
  // 日期控件向后一天
  setTomorrowDate = (parm, val) => {
    this.setState({
      [parm]: moment(val).add(1, "days").format("YYYY-MM-DD"),
    })
    if (parm === "opudate") {
      this.setState({
        hcgdate: moment(val).subtract(1, "days").format("YYYY-MM-DD"),
        showopu: moment(val).add(1, "days").format("YYYY-MM-DD"),
        showhcg: moment(val).subtract(1, "days").format("YYYY-MM-DD"),
      })
    }
    if (parm === "hcgdate") {
      this.setState({
        opudate: moment(val).add(3, "days").format("YYYY-MM-DD"),
        showopu: moment(val).add(3, "days").format("YYYY-MM-DD"),
        showhcg: moment(val).add(1, "days").format("YYYY-MM-DD"),
      })
    }
  }
  render() {
    const {
      date,
      hcgdate,
      showopu,
      showhcg,
      options,
      place,
      opudate,
      groupVal,
    } = this.state
    const { name, type } = this.props
    let { selectList } = this.props.schedule
    let { renderOptions } = this.props.moredetail
    return (
      <div>
        {name === "opu" || name === "hcg" ? (
          <div>
            <BaseDiv>
              <BlankView styled={{ display: "flex", position: "relative" }}>
                {type === "opu" ? (
                  <React.Fragment>
                    <Item>
                      取卵日：
                      <LeftOutlined
                        style={{ marginRight: 4 }}
                        onClick={() =>
                          this.setYesterdayDate("opudate", opudate)
                        }
                      />
                      {moment(opudate).format("YYYY-MM-DD")}
                      <RightOutlined
                        onClick={() => this.setTomorrowDate("opudate", opudate)}
                        style={{ marginLeft: 4 }}
                      />
                    </Item>
                    <Item>
                      HCG日：
                      <span>{showhcg}</span>
                    </Item>
                  </React.Fragment>
                ) : null}
                {type === "hcg" ? (
                  <React.Fragment>
                    <Item>
                      HCG日：
                      <LeftOutlined
                        style={{ marginRight: 4 }}
                        onClick={() =>
                          this.setYesterdayDate("hcgdate", hcgdate)
                        }
                      />
                      {moment(hcgdate).format("YYYY-MM-DD")}
                      <RightOutlined
                        onClick={() => this.setTomorrowDate("hcgdate", hcgdate)}
                        style={{ marginLeft: 4 }}
                      />
                    </Item>
                    <Item>
                      取卵日：
                      <span>{showopu}</span>
                    </Item>
                  </React.Fragment>
                ) : null}
                <Item>
                  <span>地点：</span>
                  <Select
                    value={place}
                    onChange={this.changeplace}
                    style={{ width: "130px" }}
                  >
                    {selectList ? renderOptions(selectList, "223") : null}
                  </Select>
                </Item>
                <Item>
                  <span>组别：</span>
                  <span style={{ display: "inline-block" }}>
                    <Radio.Group
                      options={options}
                      defaultValue="A组"
                      optionType="button"
                      value={groupVal}
                      onChange={this.changeGroup}
                    />
                  </span>
                </Item>
                <Item style={{ marginLeft: "auto" }}>
                  <Button type="primary" onClick={this.searchList} size="small">
                    筛选
                  </Button>
                </Item>
              </BlankView>
            </BaseDiv>
          </div>
        ) : null}
        {/* 移植和iui */}
        {name === "et" || name === "iui" ? (
          <div>
            <BaseDiv>
              <BlankView styled={{ display: "flex", position: "relative" }}>
                {name === "et" ? (
                  <Item>
                    移植日：
                    <LeftOutlined
                      style={{ marginRight: 4 }}
                      onClick={() => this.setYesterdayDate("date", date)}
                    />
                    {moment(date).format("YYYY-MM-DD")}
                    <RightOutlined
                      onClick={() => this.setTomorrowDate("date", date)}
                      style={{ marginLeft: 4 }}
                    />
                  </Item>
                ) : null}
                {type === "operation" ? (
                  <Item>
                    IUI手术日：
                    <LeftOutlined
                      style={{ marginRight: 4 }}
                      onClick={() => this.setYesterdayDate("date", date)}
                    />
                    {moment(date).format("YYYY-MM-DD")}
                    <RightOutlined
                      onClick={() => this.setTomorrowDate("date", date)}
                      style={{ marginLeft: 4 }}
                    />
                  </Item>
                ) : null}
                {type === "trigger" ? (
                  <Item>
                    扳机日：
                    <LeftOutlined
                      style={{ marginRight: 4 }}
                      onClick={() => this.setYesterdayDate("date", date)}
                    />
                    {moment(date).format("YYYY-MM-DD")}
                    <RightOutlined
                      onClick={() => this.setTomorrowDate("date", date)}
                      style={{ marginLeft: 4 }}
                    />
                  </Item>
                ) : null}
                <Item>
                  <span>地点：</span>
                  <Select
                    value={place}
                    onChange={this.changeplace}
                    style={{ width: "130px" }}
                  >
                    {selectList ? renderOptions(selectList, "223") : null}
                  </Select>
                </Item>
                <Item>
                  <span>组别：</span>
                  <span style={{ display: "inline-block" }}>
                    <Radio.Group
                      options={options}
                      defaultValue="A组"
                      optionType="button"
                      onChange={this.changeGroup}
                    />
                  </span>
                </Item>
                {name === "et" ? (
                  <Item>
                    <Radio.Group defaultValue="ivf" onChange={this.selectType}>
                      <Radio.Button value="ivf">
                        新鲜周期（含新鲜+复苏）
                      </Radio.Button>
                      <Radio.Button value="fet">复苏周期</Radio.Button>
                    </Radio.Group>
                  </Item>
                ) : null}

                <Item style={{ marginLeft: "auto", paddingRight: 5 }}>
                  <Button type="primary" onClick={this.searchList} size="small">
                    筛选
                  </Button>
                </Item>
              </BlankView>
            </BaseDiv>
          </div>
        ) : null}
      </div>
    )
  }
}
