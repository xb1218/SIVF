import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Tabs } from "antd"
import BodyCheck from "@/app/components/normal/CheckDetail/bodycheck/BodyCheck" //男女体格检查
import Test from "@/app/components/normal/CheckDetail/test/Test" //男女验
import Check from "@/app/components/normal/CheckDetail/check/Check" //男女查
import BaseAnchor from "@/app/components/base/baseAnchor.js"
import BaseAddCheck from "@/app/components/base/baseAddCheck.js"
import BaseList from "@/app/components/base/baseList.js"
import apis from "@/app/utils/apis"
import { checkArrisEmpty } from "@/app/utils/tool.js"
import TestSheet from "@/app/components/normal/TestSheet" //男女体格检查
import "./index.scss"
const { TabPane } = Tabs

export default
@inject("store", "inspection")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: "body", //tab的某一项
      dataList: [], //体的左侧选项
      inspectionType: [], //验的左侧列表
      checkList: [], //查的左侧选项
      itemTitle: null, //检查检验的一项
      typeIndex: 0, //化验单类型的索引
      itemIndex: 0, //化验单一项的索引
      dataMale: [
        { id: 1, inspectionName: "体格检查", checked: true },
        { id: 2, inspectionName: `男科检查`, checked: false },
      ], //男方
      dataFemale: [
        { id: 1, inspectionName: "体格检查", checked: true },
        { id: 2, inspectionName: `妇科检查`, checked: false },
      ], //女方选中的是体格检查还是女方检查
      checkFemale: [
        {
          inspectionType: "影像检查",
          inspectionConfigDTOS: [
            {
              id: 1,
              inspectionName: "阴道B超",
              inspectionCount: 0,
              isExpire: 0,
            },
            {
              id: 2,
              inspectionName: "妇科B超",
              inspectionCount: 0,
              isExpire: 0,
            },
            {
              id: 3,
              inspectionName: "B超检查",
              inspectionCount: 0,
              isExpire: 0,
            },
            {
              id: 4,
              inspectionName: "胸片",
              inspectionCount: 0,
              isExpire: 0,
            },
            {
              id: 5,
              inspectionName: "输卵管造影",
              inspectionCount: 0,
              isExpire: 0,
            },
            {
              id: 6,
              inspectionName: "输卵管通液",
              inspectionCount: 0,
              isExpire: 0,
            },
            {
              id: 7,
              inspectionName: "心电图",
              inspectionCount: 0,
              isExpire: 0,
            },
          ],
        },
        {
          inspectionType: "手术检查",
          inspectionConfigDTOS: [
            {
              id: 8,
              inspectionName: "宫腔镜",
              inspectionCount: 0,
              isExpire: 0,
            },
            {
              id: 9,
              inspectionName: "腹腔镜",
              inspectionCount: 0,
              isExpire: 0,
            },
            {
              id: 10,
              inspectionName: "阴道镜",
              inspectionCount: 0,
              isExpire: 0,
            },
            {
              id: 11,
              inspectionName: "子宫内膜活检",
              inspectionCount: 0,
              isExpire: 0,
            },
          ],
        },
      ],
      checkMale: [
        {
          inspectionType: "影像检查",
          inspectionConfigDTOS: [
            {
              id: 1,
              inspectionName: "B超检查",
              inspectionCount: 0,
              isExpire: 0,
            },
            {
              id: 2,
              inspectionName: "心电图",
              inspectionCount: 0,
              isExpire: 0,
            },
          ],
        },
      ],
      visible: false, //新增化验单弹窗
      addCheckId: 0,
      addCheckSource: -1,
      typeAndNameList: [], //化验单的类型和名称列表
    }
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.sex !== this.props.sex ||
      nextProps.currentKey !== this.props.currentKey ||
      nextProps.patientId !== this.props.patientId
    ) {
      this.initList()
    }
  }
  componentDidMount = () => {
    this.initList()
  }
  //初始化体格检查
  initList = async () => {
    let dataFemale = [
      { id: 1, inspectionName: "体格检查", checked: true },
      { id: 2, inspectionName: `妇科检查`, checked: false },
    ]
    let dataMale = [
      { id: 1, inspectionName: "体格检查", checked: true },
      { id: 2, inspectionName: `男科检查`, checked: false },
    ] //男方
    //体格检查
    let { sex } = this.props
    let { patientSex } = this.props.store
    let { handleList } = this.props.inspection
    let list = handleList(dataFemale, dataMale, sex, patientSex).map((item) => {
      return item
    })
    await this.setState({
      dataList: list,
      itemTitle: "体格检查",
    })
  }
  //tab栏的切换
  changeTab = async (activeKey) => {
    this.setState({
      visible: false
    })
    let { checkFemale, checkMale } = this.state
    let { sex } = this.props
    let { select_one, patientSex } = this.props.store
    let { handleList, selectPatient } = this.props.inspection
    await this.setState({ activeKey })
    if (activeKey === "test") {
      //验
      this.getInspectionType(selectPatient(select_one, sex))
    } else if (activeKey === "check") {
      //查
      this.getCheckList(handleList(checkFemale, checkMale, sex, patientSex))
    } else {
      this.initList()
    }
  }
  //左侧体格检查选中一项
  choseItem = async (key, value, index) => {
    let { dataList } = this.state
    let arr = dataList.map((item) => {
      return item
    })
    arr.forEach((item, ckey) => {
      item.checked = false
      if (ckey === index) {
        item.checked = true
      }
    })
    await this.setState({
      dataList: arr,
      itemTitle: value,
    })
    // 去调用子组件的方法
    this.BodyCheck.choseItem(key, value, index)
  }
  //验的列表
  getInspectionType = (param) => {
    let { handleInspectionType } = this.props.inspection
    apis.ManCheck.getinspectiontype(param).then((res) => {
      let data = res.data
      this.setState({
        addCheckSource: res.data[0].inspectionConfigDTOS[0].source
      })
      handleInspectionType(data, "test") //处理下拉框
      let handleData = this.handleTestCheck(data, "test") //初始化验的列表
      this.setState({ 
        inspectionType: handleData,
        typeAndNameList: res.data 
      })
    })
  }
  //查的列表
  getCheckList = (data) => {
    let { handleInspectionType } = this.props.inspection
    handleInspectionType(data, "check") //处理下拉框
    let handleData = this.handleTestCheck(data, "check")
    this.setState({ checkList: handleData })
  }
  //处理验和查的列表，第一项选中
  handleTestCheck = (data, type) => {
    data &&
      data.forEach((item, index) => {
        item.inspectionConfigDTOS.forEach((citem, cindex) => {
          citem.checked = false
          if (cindex === 0 && index === 0) {
            citem.checked = true
            if (type === "check") {
              //查
              this.Check.choseItem(citem.inspectionName)
            } else {
              //验
              this.Test.choseItem(citem.id, citem.inspectionName)
            }
            this.setState({
              itemTitle: citem.inspectionName,
              itemId: citem.id,
            })
          }
        })
      })
    return data
  }
  //处理验和查的列表哪项被那种
  handleChoseItem = (rid, rcindex, rindex, type, data) => {
    this.setState({
      visible: false
    })
    if (type === "check") {
      let { checkList } = this.state
      let handleData = this.choseCheckTestItem(
        checkList,
        rid,
        rcindex,
        rindex,
        type
      )
      this.setState({ checkList: handleData })
    } else {
      let { inspectionType } = this.state
      let handleData = this.choseCheckTestItem(
        checkArrisEmpty(data) ? inspectionType : data,
        rid,
        rcindex,
        rindex,
        type
      )
      this.setState({
        inspectionType: handleData,
        itemIndex: rcindex,
        typeIndex: rindex,
      })
    }
  }
  //查和验，选中一项，rindex:父项的index,rcindex:子项中的index
  choseCheckTestItem = (data, rid, rcindex, rindex, type) => {
    data.forEach((item, index) => {
      item.inspectionConfigDTOS.forEach((citem, cindex) => {
        citem.checked = false
        if (cindex === rcindex && index === rindex) {
          citem.checked = true
          if (type === "check") {
            this.Check.choseItem(citem.inspectionName)
          } else {
            this.Test.choseItem(rid, citem.inspectionName)
          }
          this.setState({
            itemTitle: citem.inspectionName,
            itemId: rid,
            addCheckSource: citem.source,
            addCheckId: citem.id
          })
        }
      })
    })
    return data
  }
  cancel = () => {
    this.setState({
      visible: false
    })
  }
  openModal = () => {
    this.setState({
      visible: true
    })
  }
  closeModal = () => {
    this.setState({
      visible: false
    })
    this.changeTab("test")
  }
  render() {
    let {
      activeKey,
      inspectionType,
      checkList,
      itemTitle,
      typeIndex,
      itemIndex,
      itemId,
      dataList,
      visible,
      addCheckSource,
      addCheckId,
      typeAndNameList
    } = this.state
    let { currentKey, sex, patientId } = this.props
    return (
      <div className="type">
        <div className="typeLeft">
          <Tabs
            defaultActiveKey="body"
            size="small"
            onChange={(activeKey) => this.changeTab(activeKey)}
          >
            <TabPane tab="体" key="body" className="tabpane">
                <BaseList
                  type="body"
                  dataSource={dataList}
                  choseItem={this.choseItem}
                />
            </TabPane>
            <TabPane tab="验" key="test" className="tabpaneTest">
              <BaseAnchor inspectionType={inspectionType}>
                {inspectionType.map((item, index) => {
                  return (
                    <BaseList
                      key={index}
                      type="test"
                      typeIndex={index}
                      header={<div>{item.inspectionType}</div>}
                      id={item.inspectionType.substring(0, 1)}
                      dataSource={item.inspectionConfigDTOS}
                      handleChoseItem={this.handleChoseItem}
                    />
                  )
                })}
                <BaseAddCheck openModal={this.openModal}/>
              </BaseAnchor>
            </TabPane>
            <TabPane tab="查" key="check" className="tabpane">
              {checkList.map((item, index) => {
                return (
                  <BaseList
                    key={index}
                    type="check"
                    typeIndex={index}
                    header={<div>{item.inspectionType}</div>}
                    dataSource={item.inspectionConfigDTOS}
                    handleChoseItem={this.handleChoseItem}
                  />
                )
              })}
            </TabPane>
          </Tabs>
        </div>
        <div className="typeRight">
          {activeKey === "body" && !visible ? (
            <BodyCheck
              onRef={(ref) => (this.BodyCheck = ref)}
              itemTitle={itemTitle}
              currentKey={currentKey}
              patientId={patientId}
              sex={sex}
            />
          ) : activeKey === "test" ? (
            <>
            <Test
              onRef={(ref) => (this.Test = ref)}
              currentKey={currentKey}
              patientId={patientId}
              itemTitle={itemTitle}
              typeIndex={typeIndex}
              itemIndex={itemIndex}
              itemId={itemId}
              sex={sex}
              handleChoseItem={this.handleChoseItem}
              showMark={visible}
              addCheckSource={addCheckSource}
              addCheckId={addCheckId}
              typeAndNameList={typeAndNameList}
              changeTab={this.changeTab}
            />
            <TestSheet 
              closeModal={this.closeModal}
              showMark={visible}
              inspectionType={inspectionType}
              sex={this.props.sex}
              getData={this.changeTab}
            />
            </>
          ) : activeKey === "check" && !visible ? (
            <Check
              onRef={(ref) => (this.Check = ref)}
              currentKey={currentKey}
              patientId={patientId}
              itemTitle={itemTitle}
              sex={sex}
            />
          ) : null
        }
        </div>
      </div>
    )
  }
}
