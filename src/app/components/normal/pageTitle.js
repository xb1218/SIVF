import React from "react"
import styled from "styled-components"

const LeftBoderSpan = styled.span`
  display: inline-block;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  border-left: 2px solid #59b4f4;
  padding-left: 10px;
`
const TitleP = styled.div`
  height: 30px;
`

export default class Inedx extends React.Component {
  render() {
    return (
      <TitleP>
        <LeftBoderSpan>{this.props.name}</LeftBoderSpan>
      </TitleP>
    )
  }
}
