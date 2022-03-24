import React from "react"
import styled from "styled-components"

const Content = styled.div`
  text-align: center;
  color: #999;
  position: relative;
  > div {
    bottom: 20%;
    width: 100%;
    font-size: 12px;
    position: absolute;
    text-align: center;
  }
`
export const EmptyRemind = () => {
  return (
    <Content>
      <svg className="icon_empty" aria-hidden="true">
        <use xlinkHref="#iconzanwutixing"></use>
      </svg>
      <div>暂无历史记录</div>
    </Content>
  )
}
export const EmptyPatient = () => {
  return (
    <Content>
      <svg className="icon_empty" aria-hidden="true">
        <use xlinkHref="#iconzanwuhuanzhe"></use>
      </svg>
      <div>暂无历史记录</div>
    </Content>
  )
}
export const EmptyData = () => {
  return (
    <Content>
      <svg className="icon_empty" aria-hidden="true">
        <use xlinkHref="#iconzanwushujuyongyusuoyoudeshujuliebiao"></use>
      </svg>
      <div>暂无历史记录</div>
    </Content>
  )
}
export const EmptyMessage = () => {
  return (
    <Content>
      <svg className="icon_empty" aria-hidden="true">
        <use xlinkHref="#iconzanwuliuyanjilu"></use>
      </svg>
      <div>暂无历史记录</div>
    </Content>
  )
}
