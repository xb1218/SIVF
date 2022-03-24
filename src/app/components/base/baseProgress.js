import React from "react"
import styled from "styled-components"
import { Progress } from "antd"

const Content = styled.div`
  position: relative;
  height: ${(props) => props.height + "px"};
  margin: auto 0;
  .ant-progress {
    display: inline-block;
    position: absolute;
    left: 50%;
    margin-left: -60px;
  }
  .ant-progress-text {
    top: 50%;
    font-size: 20px;
  }
  .textp {
    position: absolute;
    width: 100%;
    bottom: 16%;
    text-align: center;
    color: #333;
  }
`

export default class BaseProgress extends React.Component {
  render() {
    return (
      <Content height={this.props.circleWidth}>
        <Progress
          type="circle"
          strokeColor={this.props.color}
          strokeWidth={10}
          width={this.props.circleWidth}
          percent={this.props.perNum}
          format={() => `${this.props.curNum}例`}
        />
      </Content>
    )
  }
}
