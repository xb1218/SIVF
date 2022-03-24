import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { observable } from "mobx"
import { Menu } from "antd"
import { Link } from "react-router-dom"
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons"
import styled from "styled-components"
import routeData from "@/app/utils/routeData"
import SiderIcon from "@/app/components/normal/Sidericon" // 图标
import SendMessage from "@/app/components/normal/SendMessage"
import "./index.scss"

const { SubMenu } = Menu

const NavDiv = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  top: 55px;
  z-index: 3;
  background: #fff;
  width: ${(props) => props.width};
  height: calc(100vh - 55px);
  .ant-menu-inline-collapsed:not(.ant-layout-sider-children > ul) {
    width: 50px;
  }
  .ant-menu-inline-collapsed {
    width: 50px;
  }
  .collapseBtn:hover {
    color: #59b4f4;
    cursor: pointer;
  }
`

@inject("store")
@observer
class Index extends Component {
  @observable navHeight = window.screen.height - 170
  state = {
    collapsed: true,
    currentHoverItem: "",
    current: "/",
    showMessage: false,
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    })
  }

  onMouseOver = (currentHoverItem) => {
    this.setState({
      currentHoverItem,
    })
  }

  onMouseOut = () => {
    this.setState({
      currentHoverItem: "",
    })
  }
  componentDidMount() {
    if (!this.props.pathname) {
      this.setState({
        current: this.props.pathname,
      })
    }
  }
  showSendMessage = () => {
    this.setState({
      showMessage: true,
    })
  }
  notShowMessage = () => {
    this.setState({
      showMessage: false,
    })
  }
  render() {
    let { showMessage } = this.state
    return (
      <NavDiv
        style={{ width: this.state.collapsed ? 50 : 160 }}
        height={this.navHeight}
      >
        <div
          onClick={this.toggleCollapsed}
          style={{
            height: "32px",
            lineHeight: "32px",
            background: "#fff",
            width: this.state.collapsed ? "49px" : "159px",
            paddingLeft: "20px",
            transition:
              "background 0.3s, width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s",
          }}
          className="collapseBtn"
        >
          {React.createElement(
            this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
          )}
        </div>
        <Menu mode="inline" inlineCollapsed={this.state.collapsed}>
          {routeData.map((item, index) => {
            const isActive =
              new RegExp(item.href).test(this.props.pathname) ||
              this.state.currentHoverItem === item.href
            if (item.nav) {
              return (
                <SubMenu
                  key={item.href}
                  title={item.title}
                  onMouseOver={(e) => this.onMouseOver(item.href)}
                  onMouseOut={this.onMouseOut}
                  icon={
                    <SiderIcon type={isActive ? item.activeIcon : item.icon} />
                  }
                >
                  {localStorage.getItem("isAdmin") === "0" &&
                  item.title === "管理"
                    ? item.subNomal.map((item, index) => {
                        return (
                          <Menu.Item
                            key={item.href}
                            onMouseOut={this.onMouseOut}
                            onMouseOver={(e) => this.onMouseOver(item.href)}
                          >
                            <Link to={item.href}>{item.title}</Link>
                          </Menu.Item>
                        )
                      })
                    : item.sub.map((item, index) => {
                        return (
                          <Menu.Item
                            key={item.href}
                            onMouseOut={this.onMouseOut}
                            onMouseOver={(e) => this.onMouseOver(item.href)}
                          >
                            <Link to={item.href}>{item.title}</Link>
                          </Menu.Item>
                        )
                      })}
                </SubMenu>
              )
            }
            return (
              <Menu.Item
                icon={
                  <SiderIcon type={isActive ? item.activeIcon : item.icon} />
                }
                onMouseOut={this.onMouseOut}
                onMouseOver={(e) => this.onMouseOver(item.href)}
                key={item.href}
              >
                <Link to={item.href}>{item.title}</Link>
              </Menu.Item>
            )
          })}
        </Menu>
        {/* 留言功能 */}
        <div className="circlepositon" onClick={this.showSendMessage}>
          <svg
            className="icon_m"
            aria-hidden="true"
            style={{ margin: "1px 0 0 1px" }}
          >
            <use xlinkHref="#iconliuyan" />
          </svg>
        </div>
        {showMessage ? (
          <SendMessage
            notShowMessage={this.notShowMessage}
            showMessage={showMessage}
          />
        ) : null}
      </NavDiv>
    )
  }
}
export default Index
