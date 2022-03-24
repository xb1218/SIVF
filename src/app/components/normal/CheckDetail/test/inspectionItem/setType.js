import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { Select, Popover } from "antd"
import BaseSelect from "@/app/components/base/baseSelect"
import apis from "@/app/utils/apis"
import { message } from "antd"

const { Option } = Select

export default
@inject("store", "inspection")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectType: "", //分类所选的化验单类型
      selectName: "", //分类所选的化验单名称
      result: "", //选择框显示的结果
      typeNameList: [], //化验单类型、名称列表
      typeList: [], //化验单的类型列表
      nameList: [], //化验单名称列表
    }
  }

  componentDidMount = () => {
    this.getTypeList()
  }

  getTypeList = () => {
    let { typeAndNameList } = this.props
    let tempArr = []
    typeAndNameList.forEach((element) => {
      tempArr.push(element.inspectionType)
    })
    this.setState({
      typeList: [...tempArr],
      typeNameList: [...typeAndNameList],
    })
  }

  request = (mark, paramTitle, paramType, paramName) => {
    let { changeTab } = this.props
    let param = {}
    if (mark === 2) {
      param.otherSystemName = paramTitle
      param.sivfType = paramType
    } else {
      param.otherSystemName = paramTitle
      param.sivfType = paramType
      param.sivfName = paramName
    }
    apis.Patients_checkout.categoryname(param).then((res) => {
      if (res.code === 200) {
        message.success("设置成功！")
        changeTab("test")
      } else {
        message.warning("设置失败！")
      }
    })
  }

  changeType = (e) => {
    let { title } = this.props
    this.setState({
      selectType: e,
      selectName: "",
      result: e,
    })
    this.request(2, title, e, "")
  }

  changeName = (name, type) => {
    let { title } = this.props
    this.setState({
      selectName: name,
      selectType: type,
      result: name,
    })
    this.request(3, title, type, name)
  }

  render() {
    let { selectType, typeList } = this.state

    const Content = (props) => {
      let { typeNameList } = this.state
      let localList = []
      typeNameList.forEach((item) => {
        if (item.inspectionType === props.type) {
          let tempArr = []
          item.inspectionConfigDTOS.forEach((citem) => {
            tempArr.push(citem.inspectionName)
          })
          localList = [...tempArr]
        }
      })
      return (
        <>
          {localList.map((item, index) => {
            return (
              <div
                key={item + index}
                className="contentListStyle"
                onClick={(e) => {
                  e.stopPropagation()
                  e.nativeEvent.stopImmediatePropagation()
                  this.changeName(item, props.type)
                }}
              >
                {item}
              </div>
            )
          })}
        </>
      )
    }

    return (
      <>
        <span>分类：</span>
        <div className="lisSelect">
          <BaseSelect
            width={120}
            height={30}
            value={selectType}
            onChange={(e) => this.changeType(e)}
          >
            {typeList.map((item, index) => (
              <Option key={index} value={item}>
                <Popover
                  content={<Content type={item} />}
                  type="primary"
                  placement="right"
                  trigger="hover"
                >
                  <div className="typeListDiv">{item}</div>
                </Popover>
              </Option>
            ))}
          </BaseSelect>
        </div>
      </>
    )
  }
}
