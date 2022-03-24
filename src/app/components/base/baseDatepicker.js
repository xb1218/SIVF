import styled from "styled-components"
import { DatePicker } from "antd"

const BaseDatePicker = styled(DatePicker)`
  &.ant-picker {
    background: transparent;
    height: ${(props) => (props.height || 36) + "px"};
    line-height: ${(props) => (props.height || 36) + "px"};
  }
  &.ant-picker-focused {
    outline: none;
    box-shadow: 0;
  }
`

export default BaseDatePicker
