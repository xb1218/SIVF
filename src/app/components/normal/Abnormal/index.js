import React from "react"
import "./index.scss"
import { Input } from "antd"
import { BaseTable } from "@/app/components/base/baseTable"

export default class FollowForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      count: 2,
      checkedArry: [],
    }
  }
  // 多选item
  checkedItem = (item, _this) => {
    let { dataSource } = this.state
    const newData = {
      key: item.key,
      age: item.value,
      address: <Input allowClear={true} />,
    }
    item.checked = !item.checked
    if (item.checked === true) {
      this.setState({
        dataSource: [...dataSource, newData],
        count: item.key,
      })
    } else {
      dataSource = dataSource.filter((items) => items.ok === !item.ok)
    }
    _this.forceUpdate()
  }
  render() {
    const { dataSource } = this.state
    const _this = this
    const columns = [
      {
        title: "异常",
        dataIndex: "age",
      },
      {
        title: "说明",
        dataIndex: "address",
        editable: true,
      },
    ]
    return (
      <div className="contentsDiv">
        <div className="ItemDicv">
          {this.props.arry.map((item, index) => {
            return (
              <span
                className={item.checked === true ? "itemSelect" : "items"}
                onClick={() => this.checkedItem(item, _this)}
                key={index}
              >
                {item.value}
                <span
                  className={item.checked === true ? "sanjiao" : "null"}
                ></span>
              </span>
            )
          })}
        </div>
        <BaseTable
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    )
  }
}
