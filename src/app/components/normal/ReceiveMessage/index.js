// 查看留言消息记录
import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Popover, Divider } from "antd"
import apis from "@/app/utils/apis"
import "./index.scss"

export default
@inject("store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      unreadMessageNumber: 0, //未读信息条数
      receiveMessageVOList: [], //要显示的留言list
      allMessageList: [], //已读的留言
      unReadMessageList: [], //未读的信息条数
      allListShow: false, //是否显示全部的信息
    }
  }
  componentDidMount() {
    this.getMessage()
  }
  // 查询收到的信息条数
  getMessage = () => {
    apis.Message.getMessage().then((res) => {
      if (res.code === 200) {
        this.setState({
          unReadMessageList: res.data.receiveMessageVOList.slice(
            0,
            res.data.unreadMessageNumber
          ),
          receiveMessageVOList: res.data.receiveMessageVOList.slice(
            0,
            res.data.unreadMessageNumber
          ),
          allMessageList: res.data.receiveMessageVOList,
          unreadMessageNumber: res.data.unreadMessageNumber,
        })
      }
    })
  }
  // 查看历史记录展开
  pushList = () => {
    let { allMessageList } = this.state
    this.setState({
      receiveMessageVOList: [...allMessageList],
      allListShow: true,
    })
  }
  // 查看历史记录收起
  popList = () => {
    let { unReadMessageList } = this.state
    this.setState({
      receiveMessageVOList: [...unReadMessageList],
      allListShow: false,
    })
  }
  // 查看记录已读,展开
  setNumber = () => {
    this.setState({
      unreadMessageNumber: 0,
    })
  }
  // 生成历史记录
  toList = (data, show) => {
    return (
      <>
        <div className="messagesList">
          {data.map((item, index) => {
            return (
              <div id="messageListDiv" key={index}>
                <div className="receiveTitleDiv">
                  <span className="spanTitle">{item.fromName}</span>
                  <span>{item.fromTime}</span>
                </div>
                <div>{item.message}</div>
                <Divider />
              </div>
            )
          })}
        </div>
        <div
          className="colorSpanBottom"
          onClick={show ? this.popList : this.pushList}
        >
          查看历史记录
          <svg className="icon_s iconMargin" aria-hidden="true">
            <use
              xlinkHref={show ? "#iconshouqilishijilu" : "#iconchakanlishijilu"}
            ></use>
          </svg>
        </div>
      </>
    )
  }
  render() {
    let { receiveMessageVOList, unreadMessageNumber, allListShow } = this.state
    return (
      <div>
        <Popover
          placement="bottomRight"
          title={false}
          content={() => this.toList(receiveMessageVOList, allListShow)}
          trigger="click"
        >
          <svg className="icon_m " aria-hidden="true" onClick={this.setNumber}>
            <use xlinkHref="#iconnotice"></use>
          </svg>
          {unreadMessageNumber ? (
            <div className="circleMessage">{unreadMessageNumber}</div>
          ) : null}
        </Popover>
      </div>
    )
  }
}
