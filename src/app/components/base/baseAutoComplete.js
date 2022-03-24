import styled from "styled-components"
import { AutoComplete } from "antd"

const BaseAutoComplete = styled(AutoComplete)`
  &.ant-select.ant-select-auto-complete {
    width: ${(props) => props.width + "px"};
    height: ${(props) => (props.height || 26) + "px"};
    line-height: ${(props) => (props.height || 26) + "px"};

    .ant-select-selector {
      width: ${(props) => props.width + "px"};
      height: ${(props) => (props.height || 26) + "px"};
      line-height: ${(props) => (props.height || 26) + "px"};

      .ant-select-selection-search {
        width: ${(props) => props.width + "px"};
        height: ${(props) => (props.height || 26) + "px"};
        line-height: ${(props) => (props.height || 26) + "px"};

        .ant-select-selection-search-input {
          width: ${(props) => props.width + "px"};
          height: ${(props) => (props.height || 26) + "px"};
          line-height: ${(props) => (props.height || 26) + "px"};
        }
      }
      .ant-select-selection-item {
        width: ${(props) => props.width + "px"};
        height: ${(props) => (props.height || 26) + "px"};
        line-height: ${(props) => (props.height || 26) + "px"};
      }
    }
  }
`
export default BaseAutoComplete
