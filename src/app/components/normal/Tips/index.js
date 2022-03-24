import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Popover } from "antd"
import styled from "styled-components"

const OneSpan = styled.span`
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
`
const ItemContent = styled.span`
  display: inline-block;
  width: 36px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: #edf6fd;
  border-radius: 1px;
  margin-right: 4px;
`

const ItemContentMark = styled.span`
  display: inline-block;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: #edf6fd;
  border-radius: 1px;
  margin-right: 4px;
`
export default
@inject("store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    let { positiveTag, tips } = this.props
    const PositiveTagcontent = (
      <div style={{ minWidth: "40px", maxWidth: "80px" }}>
        {positiveTag &&
          positiveTag.map((item, index) => {
            return <ItemContent key={index}>{item}</ItemContent>
          })}
      </div>
    )
    const Tipscontent = (
      <div style={{ minWidth: "40px" }}>
        {tips &&
          tips.map((item, index) => {
            return <ItemContentMark key={index}>{item}</ItemContentMark>
          })}
      </div>
    )
    return (
      <>
        {positiveTag && positiveTag.length > 0 ? (
          <Popover content={PositiveTagcontent} placement="bottom">
            <OneSpan>
              <svg aria-hidden="true" className="icon_s">
                <use xlinkHref="#iconpositive"></use>
              </svg>
            </OneSpan>
          </Popover>
        ) : null}
        {tips && tips.length > 0 ? (
          <Popover content={Tipscontent} placement="bottom">
            <span style={{ cursor: "pointer" }}>
              <svg aria-hidden="true" className="icon_s">
                <use xlinkHref="#iconSpecialconditiontips"></use>
              </svg>
            </span>
          </Popover>
        ) : null}
      </>
    )
  }
}
