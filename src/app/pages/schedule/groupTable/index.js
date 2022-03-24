import React, { Component } from "react"
import { Collapse } from "antd"
import { TableSchedule } from "@/app/components/base/baseTable"

const { Panel } = Collapse
export class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
    }
  }
  componentDidMount() {
    let { arry } = this.props
    this.handleDate(arry)
  }
  // 处理数据
  handleDate = (arry) => {
    arry.forEach((item, index) => {
      item.key = index
      item.sortedList.forEach((items, indexs) => {
        items.key = item.uid
        items.number = indexs + 1
      })
    })
    this.setState({
      dataSource: arry,
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.arry !== this.props.arry) {
      this.handleDate(nextProps.arry)
    }
  }
  render() {
    let { columns } = this.props
    let { dataSource } = this.state
    return (
      <div id="allDataDiv">
        {dataSource.map((item, index) => {
          return (
            <Collapse defaultActiveKey={[1, 2, 3]} key={index}>
              <Panel header={item.group} key={item.key}>
                <TableSchedule
                  columns={columns}
                  dataSource={item.sortedList}
                  pagination={false}
                  bordered
                />
              </Panel>
            </Collapse>
          )
        })}
      </div>
    )
  }
}

export default index
