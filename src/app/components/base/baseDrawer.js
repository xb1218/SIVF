import React from "react"
import { Drawer } from "antd"
import styled from "styled-components"

const DrawerContent = styled(Drawer)`
  .ant-drawer-body {
    padding: 1em;
  }
`
const LeftBorder = styled.div`
  display: inline-block;
  height: 12px;
  padding-right: 10px;
  border-left: 2px solid #59b4f4;
`

export class BaseDrawer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { children, title, width, place, visible, onclose } = this.props
    return (
      <DrawerContent
        title={false}
        width={width || 580}
        placement={place || "right"}
        closable={false}
        onClose={() => onclose()}
        visible={visible}
      >
        {title ? (
          <>
            <LeftBorder />
            <span>{title}</span>
          </>
        ) : null}
        {children}
      </DrawerContent>
    )
  }
}
