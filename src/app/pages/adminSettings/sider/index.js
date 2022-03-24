import React, { Component } from "react"
import { Input, message, Menu } from "antd"
import { PlusCircleOutlined } from "@ant-design/icons"
import { observer, inject } from "mobx-react"
import apis from "@/app/utils/apis"
import "../index.scss"

const { SubMenu } = Menu

export default 
@inject("moredetail", "store")
@observer
class advice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      review: 1, //0未审核，1已审核
      unreview: [], //未审核的套餐
      reviewed: [], //已审核的套餐
      outList: [], //门诊套餐
      cycleList: [], //进周期套餐
      checkUid: null, //选中的套餐的uid
      checkItem: null,
      packageName: null, //查询套餐的名字
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.getList()
    this.afterGetUid()
  }
  //获取套餐中的首项
  getFirstUid = () => {
    let { outList } = this.state
    this.props.store.adminAdviceUid = outList.length > 0 ? outList[0].uid : null
  }
  //延时动态获取默认项
  afterGetUid = () => {
    setTimeout(() => {
      this.getFirstUid()
    }, 1000)
  }
  // 套餐列表初始化
  getList = (mealType, uid) => {
    let { review } = this.state
    let { type } = this.props
    apis.AdminSet.getSetList(mealType ? mealType : type).then((res) => {
      if (res.code === 200) {
        this.setState({
          unreview: res.data.unreview,
          reviewed: res.data.reviewed,
        })
        if (uid) {
          this.setState({
            checkUid: uid,
          })
          this.props.checkItem(uid)
        } else {
          this.setState({
            checkUid:
              res.data.reviewed.length > 0 ? res.data.reviewed[0].uid : null,
          })
          if (res.data.reviewed.length > 0) {
            this.props.checkItem(res.data.reviewed[0].uid)
          }
        }

        if (review) {
          this.sortList(res.data.reviewed) //已审核的列表
        } else {
          this.sortList(res.data.unreview)
        }
      }
    })
  }
  // 将套餐进行分类，进周期或门诊
  sortList = (data) => {
    let { outList, cycleList } = this.state
    outList = []
    cycleList = []
    data.forEach((item, index) => {
      // 已审核
      if (item.clinicTag) {
        cycleList.push(item)
      } else {
        outList.push(item)
      }
    })
    this.setState({
      outList,
      cycleList,
    })
    this.afterGetUid()
  }
  // 切换是否评审套餐
  changeReview = (val) => {
    let { unreview, reviewed } = this.state
    this.setState({
      review: val,
    })
    if (val) {
      this.sortList(reviewed)
    } else {
      this.sortList(unreview)
    }
  }
  // 添加套餐显示页面
  addsetMeal = () => {
    this.props.addIcon()
  }
  // 搜索套餐
  searchSet = (e) => {
    this.setState({
      packageName: e.target.value,
    })
  }
  // 搜索套餐点击按下
  searchMeal = (e) => {
    let { packageName, review } = this.state
    let { type } = this.props
    let obj = {
      packageName: e ? e.target.value : packageName,
      typeTag: type,
    }
    apis.AdminSet.searchMeal(obj).then((res) => {
      if (res.code === 200) {
        if (review) {
          this.sortList(res.data.reviewed) //已审核的列表
          this.setState({
            checkUid:
              res.data.reviewed.length > 0 ? res.data.reviewed[0].uid : null,
          })
          if (res.data.reviewed.length > 0) {
            this.props.checkItem(res.data.reviewed[0].uid)
          }
        } else {
          this.sortList(res.data.unreview)
        }
      }
    })
  }
  // 删除套餐
  deleteSet = (uid) => {
    apis.AdminSet.deleteSet(uid).then((res) => {
      if (res.code === 200) {
        this.getList()
        message.destroy()
        message.success(res.data)
      } else {
        message.error(res.message)
      }
    })
  }
  // 选择哪个套餐
  checkItem = (uid) => {
    this.setState({
      checkUid: uid,
    })
    this.props.checkItem(uid)
  }
  // 鼠标移入
  onMouseOver = (uid) => {
    this.setState({
      checkItem: uid,
    })
  }
  // 鼠标移出
  onMouseOut = () => {
    this.setState({
      checkItem: "",
    })
  }
  render() {
    let { review, outList, cycleList, checkUid, checkItem } = this.state
    return (
      <>
        <div className="setMeal">
          <div>
            <span
              className={review ? "blueCol" : "advicepad"}
              onClick={() => this.changeReview(1)}
            >
              套餐
            </span>
            /
            <span
              className={review ? "advicepad" : "blueCol"}
              onClick={() => this.changeReview(0)}
            >
              待审
            </span>
          </div>
          <div>
            <PlusCircleOutlined className="iconset" onClick={this.addsetMeal} />
          </div>
        </div>
        <div className="searchSet">
          <Input
            className="inputSet"
            placeholder="搜索"
            onClick={this.searchSet}
            onPressEnter={(e) => this.searchMeal(e)}
          />
        </div>
        <div className="showList">
          <div className="listCount">
            <Menu
              style={{ width: "100%" }}
              selectedKeys={checkUid}
              defaultOpenKeys={["sub1"]}
              mode="inline"
            >
              <SubMenu
                key="sub1"
                title={
                  <>
                    <span>门诊</span>
                    <span style={{ marginLeft: "15px" }}>{outList.length}</span>
                  </>
                }
              >
                {outList.map((item, index) => {
                  return (
                    <Menu.Item
                      key={item.uid}
                      className="listItem"
                      onMouseOver={(e) => this.onMouseOver(item.uid)}
                      onMouseOut={this.onMouseOut}
                      onClick={() => this.checkItem(item.uid)}
                      style={{ paddingLeft: "30px" }}
                    >
                      <span>{item.packageName}</span>
                      <svg
                        className="icon_s cursorIcon"
                        aria-hidden="true"
                        onClick={() => this.deleteSet(item.uid)}
                      >
                        <use
                          xlinkHref={
                            checkUid === item.uid || checkItem === item.uid
                              ? "#icondelete"
                              : "#icondelete1"
                          }
                        />
                      </svg>
                    </Menu.Item>
                  )
                })}
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <>
                    <span>周期 </span>
                    <span style={{ marginLeft: "15px" }}>
                      {cycleList.length}
                    </span>
                  </>
                }
              >
                {cycleList.map((item, index) => {
                  return (
                    <Menu.Item
                      key={item.uid}
                      onMouseOver={(e) => this.onMouseOver(item.uid)}
                      onMouseOut={this.onMouseOut}
                      className="listItem"
                      onClick={() => this.checkItem(item.uid)}
                      style={{ paddingLeft: "30px" }}
                    >
                      <span>{item.packageName}</span>
                      <svg
                        className="icon_s cursorIcon"
                        aria-hidden="true"
                        onClick={() => this.deleteSet(item.uid)}
                      >
                        <use
                          xlinkHref={
                            checkUid === item.uid || checkItem === item.uid
                              ? "#icondelete"
                              : "#icondelete1"
                          }
                        />
                      </svg>
                    </Menu.Item>
                  )
                })}
              </SubMenu>
            </Menu>
          </div>
        </div>
      </>
    )
  }
}
