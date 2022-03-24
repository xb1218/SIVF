import React from "react"
import styled from "styled-components"
import { Progress } from "antd"

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 80px;
  justify-content: space-around;
  margin: 0 20px;
  span {
    font-size: 20px;
    font-weight: 500;
    color: #000000;
    line-height: 25px;
    maring-left: 22px;
  }
  .ant-progress-inner {
    border-radius: 0;
    height: 12px !important;
  }
  .ant-progress-bg {
    height: 12px !important;
  }
`

export default class BaseLine extends React.Component {
  render() {
    return (
      <Content>
        <span>{this.props.total}%</span>
        <Progress
          type="line"
          showInfo={false}
          strokeColor={this.props.color}
          strokeLinecap="square"
          percent={this.props.total}
        />
      </Content>
    )
  }
}
