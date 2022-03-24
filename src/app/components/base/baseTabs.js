import { Tabs } from "antd"
import styled from "styled-components"

export const StyledTabs = styled(Tabs)`
  &.ant-tabs.ant-tabs-card {
    .ant-tabs-nav::before {
      border-bottom: none;
    }

    .ant-tabs-nav {
      margin-bottom: 0;
      padding: ${(props) => props.radius || "10px 0"};
      margin: ${(props) => props.radius || "10px 0"};
      .ant-tabs-nav-wrap {
        display: flex;
        align-items: center;
        background: #fff;
        height: 30px;
      }

      .ant-tabs-tab {
        width: ${(props) => props.width || "80px"};
        padding: 0;
        height: 26px;
        line-height: 26px;
        border: 1px solid #59b4f4;
        border-radius: ${(props) => props.radius || "13px"};
        text-align: center;
        cursor: pointer;

        &.ant-tabs-tab-active {
          background: #59b4f4;
          border-color: #59b4f4;
          .ant-tabs-tab-btn {
            color: white;
          }
        }
      }
    }
  }
`

export const NavTabs = styled(Tabs)`
  &.ant-tabs-content-holder::-webkit-scrollbar {
    display: none;
  }
  //tab 栏样式修改
  .ant-tabs-nav {
    background: #fff;
    border-radius: 2px;
    margin: 10px 0;
    padding: 0 10px;
  }

  .ant-tabs-tab {
    display: inline-block;
    text-align: center;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    margin: 0 15px;
    // width: 100px;
  }

  .ant-tabs-tab-active {
    background-color: #edf6fd;
  }

  .ant-select-selection-placeholder {
    color: rgba(0, 0, 0, 0.65);
  }

  .ant-select-selection-item:hover {
    color: #59b4f4;
  }
`
