import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import CheckItem from "./checkItem/index"

export default
@inject("store", "inspection")
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemTitle: props.itemTitle, //查的某一项名字
    }
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.sex !== this.props.sex ||
      nextProps.currentKey !== this.props.currentKey ||
      nextProps.patientId !== this.props.patientId
    ) {
      this.choseItem(this.props.itemTitle)
    }
  }
  componentDidMount() {
    this.props.onRef(this)
  }
  //选中列表中的一项
  choseItem = async (value) => {
    let { initNum } = this.props.inspection
    let { sex } = this.props
    await this.setState({
      itemTitle: value,
    })
    this.CheckItem.getCheckItems(value)
    this.CheckItem.close()
    if (sex === null) {
      initNum()
    }
  }

  render() {
    let { itemTitle } = this.state
    let { sex } = this.props
    return (
      <div>
        <CheckItem
          onRef={(ref) => (this.CheckItem = ref)}
          itemTitle={itemTitle}
          sex={sex}
        />
      </div>
    )
  }
}
