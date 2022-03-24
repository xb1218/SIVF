import React, { Component } from "react"
import { Anchor } from "antd"
import styled from "styled-components"
const { Link } = Anchor

const AnchorItem = styled(Anchor)`
  width: 50px;
  position: absolute;
  left: 100px;
  top: 20vh;
  box-shadow: 0px 0px 4px 0px rgba(191, 191, 191, 0.6);
  z-index: 99;
  border-radius: 2px;
`

export default class BaseAnchor extends Component {
  render() {
    const { children, inspectionType } = this.props
    return (
      <div>
        <AnchorItem affix={false} showInkInFixed={false}>
          {inspectionType
            ? inspectionType.map((item, index) => {
                return (
                  <Link
                    href={`#${item.inspectionType.substring(0, 1)}`}
                    title={item.inspectionType.substring(0, 1)}
                    key={index}
                  />
                )
              })
            : null}
        </AnchorItem>
        <div>{children}</div>
      </div>
    )
  }
}
