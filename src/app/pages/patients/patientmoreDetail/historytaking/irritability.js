import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Input, Switch } from "antd"
import { FlexItem } from "@/app/components/base/baseForms.js"

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: props.data,
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
    this.props.changeData(dataList, "allergicHistoryVO")
  }

  render() {
    let data = this.state.dataList
    return (
      <div>
        <FlexItem>
          <div>
            <span>过敏史</span>
            <Switch
              checked={data.allergyHistory}
              onChange={(val) => {
                this.setStaeData("allergyHistory", val ? 1 : 0)
              }}
            />
          </div>
          {data.allergyHistory ? (
            <>
              <div>
                <span>药物过敏原</span>
                <Input
                  value={data.drugAllergen}
                  defaultValue={data.drugAllergen}
                  onChange={(e) =>
                    this.setStaeData("drugAllergen", e.target.value)
                  }
                />
              </div>
              <div>
                <span>其他过敏原</span>
                <Input
                  value={data.otherAllergen}
                  defaultValue={data.otherAllergen}
                  onChange={(e) =>
                    this.setStaeData("otherAllergen", e.target.value)
                  }
                />
              </div>
            </>
          ) : null}
        </FlexItem>
      </div>
    )
  }
}
