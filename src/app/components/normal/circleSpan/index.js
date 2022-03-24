import React, { Component } from "react"
import styled from "styled-components"
const CircleAgree = styled.span`
  display: inline-block;
  width: ${(props) => props.width || "20px"};
  height: ${(props) => props.width || "20px"};
  line-height: ${(props) => props.width || "20px"};
  color: ${(props) => props.color || "#fff"};
  background: ${(props) => props.bgcColor || "#FF9797"};
  border-radius: 50%;
  cursor: pointer;
`
export default class circleAgree extends Component {
  render() {
    let { color, bgcColor, width, title } = this.props
    return (
      <CircleAgree color={color} bgcColor={bgcColor} width={width}>
        {title}
      </CircleAgree>
    )
  }
}
