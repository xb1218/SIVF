import { Menu } from "antd"
import styled from "styled-components"

export const BaseMenu = styled(Menu)`
  &.ant-menu {
    line-height: 1;
    display: flex;
    align-items: center;
    height: 50px;
    border-bottom: none;
    font-size: 16px;
    .ant-menu-horizontal > .ant-menu-item, .ant-menu-horizontal > .ant-menu-submenu {
      position: relative;
      top: 0;
    }
    .ant-menu-item {
      color: rgb(51, 51, 51);
      padding: 3px 42px;
      line-height: 44px;
      border: none;
      color: white;
      background: rgb(49,141,246);
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

      &.ant-menu-item-selected {
        background: white;
        color: rgb(49,141,246);
      }
    };
        color: white;
        border: none;
      }

      &.ant-menu-item-selected:hover {
        border: none;
      }

      &:hover {
        border-bottom: none;
        border: none;
      }
    }
  }
`

export const SmallMenu = styled(BaseMenu)`
  &.ant-menu {
    padding-left: 0px;
    font-size: 12px;

    .ant-menu-item {
      margin-right: 4px;
      padding: 1px 12px;
      border-radius: 10px;
      line-height: 1.5;
      &.ant-menu-item-selected {
        background: ${(props) => props.theme.primary};
      }
    }
  }
`
