import React, { Component, Fragment } from "react"
import { toJS } from "mobx"
import { observer, inject } from "mobx-react"
import { message, Radio } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { DashBtn } from "@/app/components/base/baseBtn"
import { BaseModal } from "@/app/components/base/baseModal"
import { TitleP } from "@/app/components/base/baseP"
import SurgeryOvum from "@/app/pages/patients/patientmoreDetail/surgeryOvum" //取卵手术
import SurgeryIUI from "@/app/pages/patients/patientmoreDetail/surgeryIUI" //iui手术
import SurgeryTransplant from "@/app/pages/patients/patientmoreDetail/surgeryTransplant" //移植手术
import SurgeryAfter from "@/app/pages/patients/patientmoreDetail/surgeryAfter"
import SurgeryGao from "@/app/pages/patients/patientmoreDetail/surgeryGao" //睾穿手术
import { checkArrisEmpty } from "@/app/utils/tool.js"
import styled from "styled-components"

const OperationArr = styled.div`
  z-index: 999;
  background-color: #fff;
  min-height: 30px;
  border-radius: 3px;
  box-shadow: 0px 0px 4px 0px rgba(191, 191, 191, 0.6);
  position: absolute;
  width: 350px;
  top: -10px;
  left: 210px;
  .operation {
    display: inline-block;
    width: 90px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    margin-left: 8px;
    .active {
      width: 50px;
      color: #59b4f4;
      text-decoration: underline;
    }
    .svg {
      display: inline-block;
      width: 1em;
    }
    .icon_record {
      display: none;
    }
  }
  .operation:hover {
    color: #59b4f4;
    cursor: pointer;
    text-decoration: none;
    .icon_record {
      display: inline;
      width: 1em;
      height: 1em;
    }
  }

  .line {
    width: 0;
    color: #d8d8d8;
  }
`
export default
@inject("store")
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false, //手术记录添加显示否
      deleteVisible: false, //删除手术弹框
      oprationRecord: "", //被选手术记录
      oprationRadio: "", //要添加的手术
      oprationArr: [], //手术tab数组
      deleteIndex: "", //要删除的位置
      deleteTitle: "", //要删除的标题
    }
  }
  componentDidMount() {
    let { patientCard } = this.props.store
    this.handleArr(toJS(patientCard.femaleOperationNames))
  }
  UNSAFE_componentWillReceiveProps(nextprops) {
    if (nextprops.arry !== this.props.arry) {
      this.handleArr(toJS(nextprops.arry))
    }
  }
  //处理手术记录字段
  handleArr = (arr) => {
    let Arr = []
    if (!checkArrisEmpty(arr)) {
      arr.forEach((item, index) => {
        if (Object.keys(item).length !== 0) {
          if (item[Object.keys(item)] > 1) {
            for (var i = 1; i <= item[Object.keys(item)]; i++) {
              Arr.push({
                title: Object.keys(item).toString() + i,
                checked: false,
              })
            }
          } else {
            Arr.push({
              title: Object.keys(item).toString() + 1,
              checked: false,
            })
          }
        }
      })
    }
    if (Arr.length > 0) {
      this.setState({
        oprationArr: Arr,
        oprationRecord: Arr[0].title,
      })
      Arr[0].checked = true
      this.judgeOperation(Arr[0].title) //重新加载时选中第一个，且初始化第一个
    } else {
      this.setState({
        oprationArr: [],
        oprationRecord: "",
      })
    }
  }
  //计算数组中某个元素的个数
  judgeElement = (arr, value) => {
    return arr.reduce(
      (a, v) =>
        v.title.substring(0, v.title.length - 1) === value ? a + 1 : a + 0,
      0
    )
  }
  //确定添加手术记录
  addOperate = () => {
    let { oprationRadio, oprationArr } = this.state
    let count = this.judgeElement(oprationArr, oprationRadio)
    let Arr = oprationArr
    Arr.map((item, index) => {
      return (item.checked = false)
    })
    Arr.push({ title: oprationRadio + (count + 1), checked: true })
    this.setState({
      visible: false,
      oprationArr: Arr,
      oprationRecord: oprationRadio + (count + 1),
    })
  }
  //确认删除手术
  deleteOperate = () => {
    let { deleteTitle, oprationArr } = this.state
    let title = deleteTitle.substring(0, deleteTitle.length - 1)
    if (oprationArr.length === 1) {
      message.error("不允许删除最后一个手术")
    } else {
      switch (title) {
        case "入院记录":
          this.SurgeryAfter && this.SurgeryAfter.delete()
          break
        case "IUI手术":
          this.SurgeryIUI && this.SurgeryIUI.delete()
          break
        case "取卵手术":
          this.SurgeryOvum && this.SurgeryOvum.delete()
          break
        case "取精手术":
          this.SurgeryGao && this.SurgeryGao.delete()
          break
        case "移植手术":
          this.SurgeryTransplant && this.SurgeryTransplant.delete()
          break
        default:
          break
      }
    }
    //弹框关闭
    this.setState({
      deleteVisible: false,
    })
  }
  //在删除请求成功后，删除一项
  deleteItem = () => {
    let { oprationArr, deleteIndex } = this.state
    let Arr = oprationArr
    Arr.splice(deleteIndex, 1)
    this.setState({
      oprationArr: Arr,
      oprationRecord: Arr[0].title,
    })
    Arr[0].checked = true
    this.judgeOperation(Arr[0].title)
  }
  //选中一个手术
  choseOperate = (value, index) => {
    let { oprationArr } = this.state
    let Arr = oprationArr
    Arr.map((item, index) => {
      return (item.checked = false)
    })
    Arr[index].checked = true
    this.setState({
      oprationArr: Arr,
      oprationRecord: value,
    })
    this.judgeOperation(value)
  }
  // 判断调用哪个手术的初始化
  judgeOperation = (val) => {
    if (val.indexOf("入院记录") !== -1) {
      this.SurgeryAfter && this.SurgeryAfter.getInitData(val)
    } else if (val.indexOf("IUI手术") !== -1) {
      this.SurgeryIUI && this.SurgeryIUI.getInitData(val)
    } else if (val.indexOf("取卵手术") !== -1) {
      this.SurgeryOvum && this.SurgeryOvum.getInitData(val)
    } else if (val.indexOf("取精手术") !== -1) {
      this.SurgeryGao && this.SurgeryGao.getInitData(val)
    } else if (val.indexOf("移植手术") !== -1) {
      this.SurgeryTransplant && this.SurgeryTransplant.getInitData(val)
    }
  }
  render() {
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
      textAlign: "left",
    }
    let {
      oprationRecord,
      oprationArr,
      visible,
      deleteVisible,
      deleteTitle,
    } = this.state
    let { style, Leave, Over } = this.props
    let { treat_stage } = this.props.store
    let record = oprationRecord.substring(0, oprationRecord.length - 1) //取手术字段名字
    return (
      <div>
        <OperationArr style={style} onMouseOver={Over} onMouseLeave={Leave}>
          {!checkArrisEmpty(oprationArr) ? (
            oprationArr.map((item, index) => {
              return (
                <Fragment key={index}>
                  <span className="operation">
                    <span
                      className={item.checked ? "active" : null}
                      onClick={(e) => {
                        e.preventDefault()
                        this.choseOperate(item.title, index)
                      }}
                    >
                      {item.title}
                    </span>
                    <span className="svg">
                      <sup>
                        <svg
                          className="icon_record"
                          aria-hidden="true"
                          onClick={() => {
                            this.setState({
                              deleteVisible: true,
                              deleteIndex: index,
                              deleteTitle: item.title,
                            })
                          }}
                        >
                          <use xlinkHref="#iconclose-circle" />
                        </svg>
                      </sup>
                    </span>
                  </span>
                  {(index + 1) % 3 !== 0 && index !== oprationArr.length - 1 ? (
                    <span className="line">|</span>
                  ) : null}
                  {index === oprationArr.length - 1 ? (
                    <DashBtn>
                      <PlusOutlined
                        onClick={() => {
                          this.setState({
                            visible: true,
                          })
                        }}
                      />
                    </DashBtn>
                  ) : null}
                </Fragment>
              )
            })
          ) : (
            <DashBtn>
              <PlusOutlined
                onClick={() => {
                  this.setState({
                    visible: true,
                  })
                }}
              />
            </DashBtn>
          )}
        </OperationArr>
        {record === "取卵手术" ? (
          <SurgeryOvum
            oprationRecord={oprationRecord}
            deleteItem={this.deleteItem}
            onRef={(ref) => (this.SurgeryOvum = ref)}
          />
        ) : record === "移植手术" ? (
          <SurgeryTransplant
            oprationRecord={oprationRecord}
            deleteItem={this.deleteItem}
            onRef={(ref) => (this.SurgeryTransplant = ref)}
          />
        ) : record === "入院记录" ? (
          <SurgeryAfter
            oprationRecord={oprationRecord}
            deleteItem={this.deleteItem}
            onRef={(ref) => (this.SurgeryAfter = ref)}
          />
        ) : record === "IUI手术" ? (
          <SurgeryIUI
            oprationRecord={oprationRecord}
            deleteItem={this.deleteItem}
            onRef={(ref) => (this.SurgeryIUI = ref)}
          />
        ) : record === "取精手术" ? (
          <SurgeryGao
            oprationRecord={oprationRecord}
            deleteItem={this.deleteItem}
            onRef={(ref) => (this.SurgeryGao = ref)}
          />
        ) : null}

        <BaseModal
          title="新增手术记录"
          width="300px"
          onCancel={() => {
            this.setState({
              visible: false,
            })
          }}
          onOk={this.addOperate}
          closable={false}
          visible={visible}
          center={"center"}
        >
          <Radio.Group
            onChange={(e) => {
              this.setState({
                oprationRadio: e.target.value,
              })
            }}
          >
            {/* IVF:取卵，入院，取精，移植 */}
            {treat_stage === 2 || treat_stage === 5 ? (
              <Radio style={radioStyle} value={"取卵手术"}>
                取卵手术
              </Radio>
            ) : null}
            {/* IUI:IUI,入院，取精 */}
            {treat_stage === 3 ? (
              <Radio style={radioStyle} value={"IUI手术"}>
                IUI手术
              </Radio>
            ) : null}
            {/* FET:移植，入院，取精 */}
            {treat_stage !== 3 ? (
              <Radio style={radioStyle} value={"移植手术"}>
                移植手术
              </Radio>
            ) : null}

            <Radio style={radioStyle} value={"入院记录"}>
              入院记录
            </Radio>
            <Radio style={radioStyle} value={"取精手术"}>
              取精手术
            </Radio>
          </Radio.Group>
        </BaseModal>

        <BaseModal
          title="提示"
          width="380px"
          onCancel={() => {
            this.setState({
              deleteVisible: false,
            })
          }}
          onOk={this.deleteOperate}
          closable={false}
          visible={deleteVisible}
          center={"center"}
        >
          <TitleP>是否确认删除"{deleteTitle}"记录</TitleP>
        </BaseModal>
      </div>
    )
  }
}
