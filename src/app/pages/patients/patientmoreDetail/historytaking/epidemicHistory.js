// 流行病学史
import React, { Component } from "react"
import { Select, Switch } from "antd"
import { observer, inject } from "mobx-react"
import apis from "@/app/utils/apis.js"
import "./index.scss"

const { Option } = Select

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      options: [],
      haveList: false, //是否有数据
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.getOption()
  }

  // 获取下拉框
  getOption = () => {
    apis.Patients_dishistory.getDecOption().then((res) => {
      if (res.code === 200) {
        this.setState({
          options: res.data,
        })
        this.getDataList(res.data)
      }
    })
  }
  // 处理dataList的数据
  handleList = (data) => {
    let datas = []
    data.forEach((item, index) => {
      item.children &&
        item.children.forEach((itemc, indexc) => {
          datas.push({
            havingTag: null,
            epidemiologicHistoryName: item.optVal,
            epidemiologicHistoryDetail: itemc.optVal,
            children: [...item.children],
            typeChildren: this.getType(data),
          })
        })
    })
    this.setState({
      dataList: [...datas],
    })
  }
  // 获取所有病的类型
  getType = (datas) => {
    const data = []
    datas.forEach((item, index) => {
      data.push({
        label: item.optVal,
        value: item.optVal,
        optVal: item.optVal,
      })
    })
    return data
  }
  // 改变后面的下拉框
  changeSelectType = (val, index) => {
    const { dataList, options } = this.state
    options.forEach((item, i) => {
      if (val === item.optVal) {
        dataList.forEach((itemd, indexd) => {
          if (itemd.epidemiologicHistoryName === val) {
            itemd.children = [...item.children]
          }
        })
      }
    })
    this.setState({
      dataList: [...dataList],
    })
  }
  // 当有数据时处理数据
  handleHaveList = (data, res) => {
    data.forEach((item, index) => {
      res.forEach((itemr, inder) => {
        if (itemr.epidemiologicHistoryName === item.optVal) {
          itemr.children = [...item.children]
          itemr.typeChildren = this.getType(data)
        }
      })
    })
  }
  // 查询数据
  getDataList = (data) => {
    const { select_one } = this.props.store
    apis.Patients_dishistory.getEpidemic(select_one).then((res) => {
      if (res.code === 200) {
        if (res.data.length === 0) {
          this.handleList(data)
          this.setState({
            haveList: true,
          })
        } else {
          this.handleHaveList(data, res.data)
          this.setState({
            dataList: res.data,
            haveList: true,
          })
        }
      }
    })
  }
  // 保存数据
  saveList = () => {
    let { dataList } = this.state
    const { select_one } = this.props.store
    let data = {
      patientParam: { ...select_one },
      epidemiologicHistoryParams: dataList,
    }
    apis.Patients_dishistory.saveEpidemic(data).then((res) => {})
  }
  // 修改流行病学史
  modifyEpidemic = (item, index, parm, val) => {
    const { dataList } = this.state
    dataList.forEach((itemd, i) => {
      if (i === index) {
        if (parm === "havingTag") {
          item[parm] = val ? 1 : 0
        } else {
          item[parm] = val
        }
      }
    })
    this.setState({
      dataList: [...dataList],
    })
  }
  render() {
    const { dataList, haveList } = this.state
    return (
      <div>
        {haveList ? (
          <>
            {dataList.map((item, indexc) => {
              return (
                <div className="epidemicItemDiv" key={indexc}>
                  <Switch
                    className="swithItem"
                    checked={item.havingTag === 1 ? true : false}
                    checkedChildren="有"
                    unCheckedChildren="无"
                    onChange={(target) =>
                      this.modifyEpidemic(item, indexc, "havingTag", target)
                    }
                  />
                  <Select
                    style={{ width: "130px", marginRight: "20px" }}
                    value={item.epidemiologicHistoryName}
                    onChange={(val) => {
                      this.modifyEpidemic(
                        item,
                        indexc,
                        "epidemiologicHistoryName",
                        val
                      )
                      this.changeSelectType(val, indexc)
                    }}
                  >
                    {item.typeChildren &&
                      item.typeChildren.map((itemo, indexo) => {
                        return (
                          <Option value={itemo.optVal} key={itemo.optVal}>
                            {itemo.optVal}
                          </Option>
                        )
                      })}
                  </Select>
                  <Select
                    style={{ flex: 1 }}
                    value={item.epidemiologicHistoryDetail}
                    onChange={(val) =>
                      this.modifyEpidemic(
                        item,
                        indexc,
                        "epidemiologicHistoryDetail",
                        val
                      )
                    }
                  >
                    {item.children &&
                      item.children.map((itemi, indexi) => {
                        return (
                          <Option value={itemi.optVal} key={itemi.optVal}>
                            {itemi.optVal}
                          </Option>
                        )
                      })}
                  </Select>
                </div>
              )
            })}
          </>
        ) : null}
      </div>
    )
  }
}
