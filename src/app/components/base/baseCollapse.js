import { Collapse } from "antd"
import styled from "styled-components"

export const BaseCollapse = styled(Collapse)`
  &.ant-collapse {
    background: #fff;
    border-radius: 2px;
    // margin-bottom: 20px;
    border: 0px;
    color: rgba(0, 0, 0, 0.65);
    overflow: hidden;
  }

  &.ant-collapse > .ant-collapse-item > .ant-collapse-header {
    color: rgba(0, 0, 0, 0.65);
    text-align: left;
    padding: 5px;
    background: #f1f8fd;
    margin: 10px;
  }
  &.ant-collapse
    > .ant-collapse-item
    > .ant-collapse-header
    .ant-collapse-arrow {
    top: 0px;
    right: 10px;
    font-size: 14px;
    text-align: right;
    float: right;
    margin-top: 3px;
  }
  .ant-collapse-content-box {
    padding-top: 0px;
    padding-bottom: 0px;
  }
`
