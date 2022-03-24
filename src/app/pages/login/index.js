import React, { Component } from "react"
import "./index.scss"
import loginImg from "@/app/styles/image/login.jpg"
import { Input, Button, message } from "antd"
import {
  UserOutlined,
  UnlockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons"
import styled from "styled-components"
import { inject, observer } from "mobx-react"

const BackgroundImg = styled.div`
  min-height: 100%;
  width: 100%;
  height: auto;
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  background-image: url(${loginImg});
  background-color: rgba(0, 0, 0, 0.3);
  -webkit-filter: blur(2px);
  -moz-filter: blur(2px);
  -ms-filter: blur(2px);
  -o-filter: blur(2px);
  filter: blur(2px);
`

const Content = styled.div`
  background-color: rgba(46, 134, 193, 0.7);
  width: 40%;
  min-height: 100%;
  height: auto;
  position: fixed;
  margin-left: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Title = styled.div`
  font-size: ${(props) => props.fontSize};
  font-weight: bold;
  color: #ffffff;
`

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  justify-content: space-around;
  height: 180px;
  width: 60%;
  background: #ffffff;
  border-radius: 6px;
  margin-top: 20px;
`

export default
@inject("auth")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: "",
      password: "",
    }
  }

  onInputChange = (e, field) => {
    this.setState({
      [field]: e.target.value,
    })
  }

  login = () => {
    const { userName, password } = this.state
    const { login } = this.props.auth
    if (!userName) {
      message.error("请输入账号")
      return
    }
    if (!password) {
      message.error("请输入密码")
      return
    }

    login(userName, password).then(
      () => {
        this.props.history.push({
          pathname: "/workbench",
        })
      },
      (err) => {
        if (!err.resolved) message.error(err.message)
      }
    )
  }

  render() {
    return (
      <>
        <BackgroundImg />
        <Content>
          {/* <Title fontSize={"30px"}>SIVF</Title> */}
          <Title fontSize={"22px"}>IVF延展跟踪数据系统</Title>
          <InputDiv>
            <Input
              onChange={(e) => this.onInputChange(e, "userName")}
              onPressEnter={this.login}
              id="username"
              placeholder="用户名"
              prefix={<UserOutlined />}
            />
            <Input.Password
              id="password"
              onPressEnter={this.login}
              onChange={(e) => this.onInputChange(e, "password")}
              placeholder="密码"
              prefix={<UnlockOutlined />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <Button id="submit" type="primary" onClick={this.login}>
              登录
            </Button>
          </InputDiv>
        </Content>
      </>
    )
  }
}
