import styled from 'styled-components'

const BaseTag = styled.div`

  color: rgb(16,144,255);
  padding: 3px 12px;
  border-radius: 4px;
  background-color: rgba(235, 246, 255, 1);

  &.ant-tag {
    color: ${(props) => {
      switch (props.themeColor) {
        case 'purple':
          return 'rgb(115, 91, 239)'
        default:
          return props.theme.primary
      }
    }};
    background: ${(props) => {
      switch (props.themeColor) {
        case 'purple':
          return 'rgb(240, 237, 255)'
        default:
          return 'rgb(237, 247, 255)'
      }
    }};
  }

  &:hover {
    opacity: 0.85;
  }

  cursor: pointer;
`

export default BaseTag
