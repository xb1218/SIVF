import React, { Component } from "react"
import styled from "styled-components"

const AddCheck = styled.div`
  width: 150px;
  position: absolute;
  bottom: 10px;
  box-shadow: 0px 0px 4px 0px rgba(191, 191, 191, 0.6);
  z-index: 99;
  border: 1px dashed #59b4f4;
  color: #59b4f4;
  background: #def0fd;
  text-align: center;
`

export default class BaseAddCheck extends Component {
  render() {
    let { openModal } = this.props
    return (
      <AddCheck onClick={openModal}>
          <svg
            className="icon_svg"
            aria-hidden="true"
          >
            <use xlinkHref="#iconjiahao1"></use>
          </svg>
      </AddCheck>
    )
  }
}
