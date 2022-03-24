import React from "react"
import "./index.scss"
import styled from "styled-components"

const CenterTitle = styled.div`
  text-align: center;
  font-size: 1.3em;
  color: ${(props) => props.color};
  margin-left: 1.3em;
`
export const DateTitleView = ({
  flag,
  style,
  title,
  selectOption,
  subtitle,
  children,
  name,
  select,
  range,
  centername,
  color,
}) => {
  return (
    <div id="workbench" style={style}>
      <div className="title">
        <div className="leftTitle">
          {flag ? null : <div className="flag" />}
          {title}
          <div className="selectOptions">{selectOption}</div>
          {name ? <div className="name">{name}</div> : null}
          <div className="range">{range}</div>
        </div>
        <CenterTitle color={color}>{centername}</CenterTitle>
        <div className="rightTitle">
          <div>{select}</div>
          <div>{subtitle}</div>
        </div>
      </div>
      <div className="title_content">{children}</div>
    </div>
  )
}
