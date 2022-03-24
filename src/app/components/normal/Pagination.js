import { Pagination } from "antd"
import React from "react"
import styled from "styled-components"

const DivStyle = styled.div`
  text-align: right;
  display: flex;
  flex-direction: row-reverse;
`
const Pagin = styled(Pagination)`
  .ant-pagination-item a {
    padding: 0 !important;
  }
  .ant-pagination-prev .ant-pagination-item-link,
  .ant-pagination-next .ant-pagination-item-link,
  .ant-pagination-options-quick-jumper input {
    border-radius: 3px;
  }
  li {
    padding: 0 !important;
    border-radius: 3px;
  }
  margin-top: 20px;
`
const ButtonStyle = styled.button`
  min-width: 32px;
  height: 32px;
  background-color: #fff;
  border-radius: 3px;
  border: 1px solid #d9d9d9;
  margin: 19px 0 7px 10px;
`

export default class Pagintion extends React.Component {

  render() {
    const { total, current,  onChange, pageSize, ...rest} = this.props
    return (
      <DivStyle>
        <ButtonStyle
        >
          确定
       </ButtonStyle>
        <Pagin
          total={total}
          pageSize={pageSize}
          defaultCurrent={1}
          current={current}
          onChange={onChange}
          showQuickJumper
          {...rest}
        />
      </DivStyle>
    )
  }
}
