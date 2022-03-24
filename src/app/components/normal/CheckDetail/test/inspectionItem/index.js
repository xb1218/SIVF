import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Spin } from "antd"
import { LoadingDiv } from "@/app/components/base/baseDiv"
import InspectionItem from "./inspectionItem" //验的展示
import InspectionItemOperate from "./inspectionItemOperate" //验的操作
import apis from "@/app/utils/apis"

export default
@inject("store", "inspection")
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      initFlag: false,
      count: 0,
      inspectionItems: [], //化验单项目
      operateData: {}, //操作数据
    }
  }
  componentDidMount() {
    this.props.onRef(this)
  }

  selectPatient = () => {
    let { selectPatient } = this.props.inspection
    let { select_one } = this.props.store
    return selectPatient(select_one, this.props.sex)
  }
  //化验单某一项详情
  getInspectionItems = (value) => {
    let patient = this.selectPatient()
    let param = {
      source: this.props.addCheckSource,
      inspectionName: value,
      ...patient,
    }
    apis.ManCheck.getinspectiontdetail(param).then((res) => {
      this.judgeActivationTag(res.data)
      this.setState({
        count: res.data.length,
        inspectionItems: res.data,
        initFlag: true,
      })
    })
  }
  //切换到添加和修改页面
  changeVisible = (item) => {
    let { visible } = this.state
    this.setState({
      operateData: item,
      visible: !visible,
    })
  }
  //关闭添加和修改
  close = () => {
    this.setState({
      visible: true,
    })
  }
  handleChoseItem = () => {
    let { itemIndex, typeIndex, itemId } = this.props
    apis.ManCheck.getinspectiontype(this.selectPatient()).then((res) => {
      let data = res.data
      this.props.handleChoseItem(itemId, itemIndex, typeIndex, "test", data)
    })
  }

  //判断是否活动
  judgeActivationTag = (data) => {
    let { judgeActivationTag } = this.props.inspection
    let { sex } = this.props
    judgeActivationTag(sex, data)
  }

  render() {
    let { visible, initFlag, count, inspectionItems, operateData } = this.state
    let { itemTitle, sex, addCheckSource, addCheckId, typeAndNameList, changeTab } = this.props
    return (
      <div>
        {visible ? (
          initFlag ? (
            <InspectionItem
              itemTitle={itemTitle}
              inspectionItems={inspectionItems}
              count={count}
              sex={sex}
              changeVisible={this.changeVisible}
              addCheckSource={addCheckSource}
              addCheckId={addCheckId}
              typeAndNameList={typeAndNameList}
              changeTab={changeTab}
            />
          ) : (
            <LoadingDiv>
              <Spin />
            </LoadingDiv>
          )
        ) : initFlag ? (
          <InspectionItemOperate
            itemTitle={itemTitle}
            operateData={operateData}
            close={this.close}
            getData={() => this.getInspectionItems(itemTitle)}
            handleChoseItem={this.handleChoseItem}
            sex={sex}
            addCheckSource={addCheckSource}
            addCheckId={addCheckId}
          />
        ) : (
          <LoadingDiv>
            <Spin />
          </LoadingDiv>
        )}
      </div>
    )
  }
}
