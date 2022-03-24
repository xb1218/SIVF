import styled from "styled-components"
import { Input, Row } from "antd"

const { TextArea } = Input

export const BaseInput = styled(Input)`
  &.ant-input {
    font-size: 12px;
    resize: none;
    width: ${(props) => props.width + "px"};
    height: ${(props) => (props.height || 30) + "px"};
  }

  ::-webkit-input-placeholder {
    color: #999999;
  }
  ::-moz-placeholder {
    color: #999999;
  }
`

export const BaseLabel = styled.div`
  flex-shrink: 0;
  height: ${(props) => (props.height || 30) + "px"};
  display: flex;
  align-items: center;
  align-self: flex-start;
  font-size: 14px;
  font-family: ${(props) => props.theme.light};
  width: ${(props) => props.width + "px"};
  justify-content: flex-end;

  &::after {
    content: "：";
  }
`

export const BaseTextArea = styled(TextArea)`
  &.ant-input {
    font-size: 12px;
    resize: none;
    padding: 7px 10px 10px 10px;
    width: ${(props) => props.width + "px"};
    height: ${(props) => (props.height || 36) + "px"};
  }

  ::-webkit-input-placeholder {
    color: #999999;
  }
  ::-moz-placeholder {
    color: #999999;
  }
`

export const BaseFormItem = styled(Row)`
  &.ant-row {
    margin-bottom: 15px;
    flex-wrap: nowrap;
  }

  &:last-child {
    margin-bottom: 0;
  }
  .icon_posision {
    position: absolute;
    left: 400px;
    top: 394px;
  }
`

export const BaseItem = styled(Row)`
  &.ant-row-flex {
    margin-top: 12px;
    margin-left: -14px;
    flex-wrap: nowrap;
  }

  &:last-child {
    margin-bottom: 0;
  }
`
