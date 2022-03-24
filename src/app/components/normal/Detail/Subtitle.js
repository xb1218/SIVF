// 随访详情基本信息
import React from "react"
import styled from "styled-components"

const SubTitle = styled.div`
  margin: 0 0 10px 15px;
  color: ${(props) => props.color};
`
const Sub = styled(SubTitle)`
  color: #333;
`

export default class Subs extends React.Component {
  render() {
    return (
      <div>
        {this.props.name === "并发症" ||
        this.props.name === "B超" ||
        this.props.name === "妊娠情况" ||
        this.props.name === "新生儿情况" ||
        this.props.name === "异位妊娠" ? (
          <SubTitle>{this.props.name}</SubTitle>
        ) : (
          <Sub>{this.props.name}</Sub>
        )}
      </div>
    )
  }
}
