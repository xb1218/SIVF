import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Spin } from "antd"
import { LoadingDiv } from "@/app/components/base/baseDiv"
import CheckItem from "./checkItem" //查的展示
import CheckItemOperate from "./checkItemOperate" //查的操作
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
      checkItems: [], //查
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
  //查的某一项详情
  getCheckItems = (value) => {
    let patient = this.selectPatient()
    let param = {
      videoName: value,
      ...patient,
    }
    //查询查的某一个详情
    apis.ManCheck.getimagedata(param).then((res) => {
      let data =
        value === "输卵管造影"
          ? res.data.hysterosalpingogramDTOS
          : value === "阴道B超"
          ? res.data.gynecologicalUltrasoundDTOs
          : value === "B超检查" && this.props.store.patientSex
          ? res.data.ultrasounds
          : res.data.otherVideoDTOS
      this.judgeActivationTag(data)
      this.setState({
        count: data.length,
        checkItems: data,
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

  //判断是否活动
  judgeActivationTag = (data) => {
    let { judgeActivationTag } = this.props.inspection
    let { sex } = this.props
    judgeActivationTag(sex, data)
  }

  render() {
    let { visible, initFlag, count, checkItems, operateData } = this.state
    let { itemTitle, sex } = this.props
    return (
      <div>
        {visible ? (
          initFlag ? (
            <CheckItem
              itemTitle={itemTitle}
              checkItems={checkItems}
              count={count}
              sex={sex}
              changeVisible={(item) => this.changeVisible(item)}
            />
          ) : (
            <LoadingDiv>
              <Spin />
            </LoadingDiv>
          )
        ) : initFlag ? (
          <CheckItemOperate
            itemTitle={itemTitle}
            operateData={operateData}
            sex={sex}
            close={this.close}
            getData={() => this.getCheckItems(itemTitle)}
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
