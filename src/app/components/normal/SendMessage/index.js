// 发送留言
import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Input, Select, Button, message } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import apis from "@/app/utils/apis"
import "./index.scss"

const { TextArea } = Input
export default
@inject("store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: null, //留言信息
      toIds: [], //收件人集合
      userData: [], //用户集合
      sendsMessage: [], //自己发送的消息
    }
  }
  componentDidMount() {
    this.getUsers()
    this.getMessage()
  }
  // 获取用户的下拉框
  getUsers = () => {
    apis.Message.userMessage().then((res) => {
      if (res.code === 200) {
        let data = []
        res.data.map((item, index) => {
          data.push({
            value: item.id,
            label: item.username,
          })
          return data
        })
        this.setState({
          userData: data,
        })
      }
    })
  }
  //发送留言
  sendMessage = () => {
    let { toIds, messages } = this.state
    let data = {
      toIds,
      message: messages,
    }
    if (messages && toIds.length > 0) {
      apis.Message.addMessage(data).then((res) => {
        if (res.code === 200) {
          message.success(res.data)
          this.getMessage()
          this.setState({
            toIds: [],
            messages: null,
          })
        } else {
          message.error(res.message)
        }
      })
    } else {
      message.error("请选择接收人和填写发送内容！")
    }
  }
  // 自己发送的有哪些消息
  getMessage = () => {
    apis.Message.postMessage().then((res) => {
      if (res.code === 200) {
        this.setState({
          sendsMessage: res.data,
        })
      }
    })
  }
  // 隐藏留言功能
  notShow = () => {
    this.props.notShowMessage()
  }
  // 输入框中的改变
  changeData = (parm, val) => {
    this.setState({
      [parm]: val,
    })
  }

  render() {
    let { showMessage } = this.props
    let { messages, userData, toIds, sendsMessage } = this.state
    return (
      <>
        {showMessage ? (
          <div id="messageDiv">
            <div className="messageTitle">
              <span className="notShowMessage">留言</span>
              <span>
                <CloseOutlined
                  className="notShowMessage"
                  onClick={this.notShow}
                />
              </span>
            </div>
            <div className="messageCount">
              {sendsMessage.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="timeDiv">{item.fromTime}</div>
                    <div className="doctorDiv">
                      {item.toNames.map((items) => {
                        return <span className="doctorSpan">{items}</span>
                      })}
                    </div>
                    <div className="messageDivs">{item.message}</div>
                  </div>
                )
              })}
            </div>
            <div className="messageBottom">
              <TextArea
                rows={4}
                bordered={false}
                value={messages}
                onChange={(e) => {
                  this.changeData("messages", e.target.value)
                }}
              />
              <div className="bottomSend">
                <span>发送给：</span>
                <span>
                  <Select
                    className="selectWrap"
                    mode="multiple"
                    value={toIds}
                    style={{ width: "260px", marginRight: "10px" }}
                    options={userData}
                    onChange={(val) => {
                      this.changeData("toIds", val)
                    }}
                  />
                </span>
                <span>
                  <Button
                    size="small"
                    type="primary"
                    onClick={this.sendMessage}
                  >
                    发送
                  </Button>
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </>
    )
  }
}
