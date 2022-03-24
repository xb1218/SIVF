import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import styled from "styled-components"
import config from "@/app/config"
import { BaseModal } from "@/app/components/base/baseModal"
import apis from "@/app/utils/apis"
import "./index.scss"
import { Checkbox, Button } from "antd"

const PatientContent = styled.div`
  background: #fff;
  border-radius: 2px;
  border-bottom: 10px;
  min-height: 500px;
  padding: 5px 10px;
`
const BaseTitle = styled.div`
  height: 40px;
  line-height: 40px;
  font-weight: 500;
  .leftborder {
    vertical-align: middle;
    display: inline-block;
    margin: 0 10px;
    width: 2px;
    height: 14px;
    background-color: #59b4f4;
  }
  > span {
    color: #333;
    font-weight: 400;
  }
`

export default
@observer
@inject("moredetail", "store")
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: 0, //0是已签署，1是需补签，2是待签
      showModalAdd: false, //是否显示添加知情同意书
      frameWorkData: [],
      currentIndex: 0, //当前选中的知情同意书类型
    }
  }
  componentDidMount() {
    this.getSiderData()
  }
  // 获取后台接口的数据
  getMessageData = (arr) => {
    let obj = {
      hospital: "1",
    }
    apis.collection.getAgreenData(obj).then((res) => {
      if (res.code === 200) {
        res.data.forEach((item) => {
          if (item.modelPath && item.modelPath !== "") {
            arr.forEach((list) => {
              if (item.type === list.type) {
                list.formwork.push(item)
                return
              }
            })
          }
        })
        this.setState({
          frameWorkData: arr,
        })
      }
    })
  }
  // 侧边栏数据
  getSiderData = () => {
    let arr = [
      { name: "门诊", abbreviation: "门", type: 1, formwork: [] },
      { name: "取卵", abbreviation: "取", type: 2, formwork: [] },
      { name: "IUI手术", abbreviation: "IUI", type: 3, formwork: [] },
      { name: "随访", abbreviation: "随", type: 4, formwork: [] },
      { name: "卵泡监测", abbreviation: "卵", type: 5, formwork: [] },
      { name: "冷冻", abbreviation: "冷", type: 6, formwork: [] },
      { name: "解冻", abbreviation: "解", type: 7, formwork: [] },
      { name: "移植", abbreviation: "移", type: 8, formwork: [] },
      { name: "囊胚", abbreviation: "囊", type: 9, formwork: [] },
      { name: "赠卵", abbreviation: "赠", type: 10, formwork: [] },
      { name: "PGT", abbreviation: "PGT", type: 12, formwork: [] },
      { name: "复苏周期", abbreviation: "复", type: 13, formwork: [] },
      { name: "科研", abbreviation: "科", type: 14, formwork: [] },
      { name: "手术", abbreviation: "手", type: 15, formwork: [] },
      { name: "新鲜周期", abbreviation: "新", type: 16, formwork: [] },
      { name: "其他", abbreviation: "其他", type: 11, formwork: [] },
    ]
    this.setState({
      frameWorkData: arr,
    })
    this.getMessageData(arr)
  }
  // 改变选中的类型
  changeStage = (val) => {
    let { stage } = this.state
    if (stage === val) {
      this.setState({
        stage: null,
      })
    } else {
      this.setState({
        stage: val,
      })
    }
  }
  // 跳转到签署当前知情同意书
  checkSignAgreen = () => {
    this.props.history.push("/public/signAgreen")
  }
  //弹出选择组套的弹框
  showAddModal = () => {
    this.setState({
      showModalAdd: true,
    })
  }
  // 选中的类型
  setCurrentIndex = (index) => {
    this.setState({
      currentIndex: index,
    })
  }
  // 不显示弹框
  notShowModal = () => {
    this.setState({
      showModalAdd: false,
    })
  }
  // 跳转到信息化采集
  jumpInfo = () => {}
  render() {
    let { stage, showModalAdd, frameWorkData, currentIndex } = this.state
    const idNumber = "411422199712162468"
    return (
      <PatientContent>
        <div className="agreeTltle">
          <BaseTitle>
            <div className="leftborder" />
            <span className="rightmargin">知情同意书</span>
          </BaseTitle>
          <div className="addButtonAgree" onClick={this.showAddModal}>
            +
          </div>
        </div>
        <div className="entryTitle" onClick={() => this.changeStage(0)}>
          <div>已签署</div>
          <div>3</div>
        </div>
        {stage === 0 ? (
          <div>
            <div className="agreeItem" onClick={this.checkSignAgreen}>
              体外受精-骨折移植（IVF-ET）技术助备份
            </div>
          </div>
        ) : null}
        <div className="entryTitle" onClick={() => this.changeStage(1)}>
          <div>需补签</div>
          <div>3</div>
        </div>
        {stage === 1 ? (
          <div>
            <div className="agreeItem notchecked">
              体外受精-骨折移植（IVF-ET）技术助备份
            </div>
          </div>
        ) : null}
        <div className="entryTitle" onClick={() => this.changeStage(2)}>
          <div>待签</div>
          <div>3</div>
        </div>
        {stage === 2 ? (
          <div>
            <div className="agreeItem notchecked">
              体外受精-骨折移植（IVF-ET）技术助备份
            </div>
          </div>
        ) : null}
        <BaseModal
          visible={showModalAdd}
          width={631}
          height={440}
          centered
          footer={null}
          onCancel={this.notShowModal}
          title="添加知情同意书"
        >
          <div className="addModalCountAgreen">
            <div className="agreenCount">
              {frameWorkData.map((item, index) => {
                return (
                  <div key={index}>
                    {item.formwork.length > 0 ? (
                      <>
                        <div className="argeenTitle" id={index}>
                          {item.name}
                        </div>
                        <Checkbox.Group className="columncheck">
                          {item.formwork.map((list, indexl) => {
                            return (
                              <Checkbox key={list.id} value={list.id}>
                                {list.templateFile}
                              </Checkbox>
                            )
                          })}
                        </Checkbox.Group>
                      </>
                    ) : null}
                  </div>
                )
              })}
            </div>
            <div className="addModalStaic">
              {frameWorkData.map((item, index) => {
                return (
                  <a
                    href={"#" + index}
                    key={index}
                    className={currentIndex === index ? " active" : ""}
                    onClick={() => this.setCurrentIndex(index)}
                  >
                    {item.name}
                  </a>
                )
              })}
            </div>
          </div>
        </BaseModal>
        <Button type="primary" className="fixedButton">
          <a
            target="_black"
            href={`${config.informationUrl}/home/input/consent/?idNumber=${idNumber}&&id=11&userName=bhf&hospitalName=1`}
          >
            签署
          </a>
        </Button>
      </PatientContent>
    )
  }
}
