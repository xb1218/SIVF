// 随访详情基本信息
import React from "react"
import styled from "styled-components"

const ItemSpan = styled.span`
  display: inline-block;
  margin: 0 0 10px 19px;
  width: ${(props) => props.width};
  span:nth-child(2) {
    padding-left: 10px;
  }
`
const SpanStyle = styled.span`
  display: inline-block;
  color: ${(props) => props.color};
  line-height: 22px;
`

export default class Items extends React.Component {
  render() {
    return (
      <ItemSpan width={this.props.width}>
        <SpanStyle color="#999">{this.props.name}</SpanStyle>
        <SpanStyle color="#333">{this.props.value}</SpanStyle>
      </ItemSpan>
    )
  }
}
