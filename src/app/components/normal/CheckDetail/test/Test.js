import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import InspectionItem from "./inspectionItem/index"

export default
@inject("store", "inspection")
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemTitle: props.itemTitle, //验的某一项名字
    }
  }
  componentDidMount() {
    this.props.onRef(this)
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.sex !== this.props.sex ||
      nextProps.currentKey !== this.props.currentKey ||
      nextProps.patientId !== this.props.patientId
    ) {
      this.choseItem(null, this.props.itemTitle)
      this.InspectionItem.handleChoseItem()
    }
  }
  //选中列表中的一项
  choseItem = async (id, value) => {
    let { initNum } = this.props.inspection
    let { sex } = this.props
    await this.setState({
      itemTitle: value,
    })
    this.InspectionItem.getInspectionItems(value)
    this.InspectionItem.close()
    if (sex === null) {
      initNum()
    }
  }

  render() {
    let { itemTitle } = this.state
    let {
      itemIndex, 
      typeIndex, 
      handleChoseItem, 
      itemId, 
      sex, 
      showMark, 
      addCheckId, 
      addCheckSource, 
      typeAndNameList,
      changeTab, 
    } = this.props
    return (
      <>
      {
        showMark ? null :
        <div>
          <InspectionItem
            onRef={(ref) => (this.InspectionItem = ref)}
            itemTitle={itemTitle}
            itemIndex={itemIndex}
            typeIndex={typeIndex}
            itemId={itemId}
            handleChoseItem={handleChoseItem}
            sex={sex}
            addCheckSource={addCheckSource}
            addCheckId={addCheckId}
            typeAndNameList={typeAndNameList}
            changeTab={changeTab}
          /> 
        </div>
      }
      </>
    )
  }
}
