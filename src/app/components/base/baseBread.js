import { Breadcrumb } from "antd"
import styled from "styled-components"
import React from "react"

const BaseBreadcrumb = styled(Breadcrumb)`
  height: 40px;
  line-height: 40px;
  background: #eff2f5;
`

export default class BaseBread extends React.Component {
  render() {
    return (
      <BaseBreadcrumb>
        <Breadcrumb.Item>
          <span style={{ marginRight: "10px" }}>{this.props.icon}</span>
          <span>{this.props.first}</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{this.props.second}</Breadcrumb.Item>
        <Breadcrumb.Item>{this.props.third}</Breadcrumb.Item>
      </BaseBreadcrumb>
    )
  }
}
