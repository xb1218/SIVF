import React, { Component } from "react"
import { DropTarget, DragDropContext } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"
import classnames from "classnames"
import DndItem from "./item"

const type = "item"
class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
    }
  }
  componentDidMount() {
    this.setState({
      list: this.props.list,
    })
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.list !== this.props.list) {
      this.setState({
        list: nextProps.list,
      })
    }
  }
  find = (id) => {
    const { list } = this.state
    const item = list.find((c) => `${c.id}` === id)
    return {
      item,
      index: list.indexOf(item),
    }
  }
  // 移动数组
  move = (id, toIndex) => {
    let { list } = this.state
    const { item, index } = this.find(id)
    list.splice(index, 1)
    list.splice(toIndex, 0, item)
    this.setState({
      list,
    })
  }
  // 改变数组排序
  change = (id, fromIndex) => {
    const { list } = this.state
    const { index: toIndex } = this.find(id)
    this.props.onDropEnd(list, fromIndex, toIndex)
  }
  // 点击数组
  onClick = (event) => {
    const { id } = event.currentTarget
    const { item } = this.find(id)
    this.props.onClick(item)
  }
  render() {
    const { list } = this.state
    let { connectDropTarget } = this.props
    return connectDropTarget(
      <ul id="list">
        {list.map((item, index) => (
          <li
            className={classnames("itemlist", { active: item.active })}
            key={item.id}
          >
            <div className="index">{index + 1}、</div>
            <DndItem
              className="info"
              id={`${item.id}`}
              item={item}
              find={this.find}
              move={this.move}
              change={this.change}
              onClick={this.onClick}
            />
          </li>
        ))}
      </ul>
    )
  }
}
const DndList = DropTarget(type, {}, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))(List)
// 将 HTMLBackend 作为参数传给 DragDropContext
export default DragDropContext(HTML5Backend)(DndList)
