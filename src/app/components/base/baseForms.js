import styled from "styled-components"
import { Tabs } from "antd"

export const TabsContent = styled.div`
  background: #fff;
  border-radius: 2px;
  margin-right: 10px;
  width: 190px;
  height: 550px;
  height: ${(props) => props.rightHeight + "px"};
  overflow: auto;
`
export const CheckContent = styled.div`
  background: #fff;
  border-radius: 2px;
  border-right: 10px;
  width: 100%;
`
export const BaseTitle = styled.div`
  height: 40px;
  line-height: 40px;
  font-weight: 500;

  .leftborder {
    vertical-align: middle;
    display: inline-block;
    margin: 0 10px;
    width: 2px;
    height: 14px;
    background-color: #59b4f4;
  }
`
export const SecondTitle = styled.div`
  height: 40px;
  line-height: 40px;
  color: #59b4f4;
  margin-left: 11px;
  text-align: left;
`
export const ThreeItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  text-align: left;
  > div {
    width: 33%;
    > span:first-child {
      width: ${(props) => props.width || "125px"};
      display: inline-block;
      text-align: right;
    }
    > span {
      display: inline-block;
      dispaly: flex;
    }
    .ant-picker,
    .ant-select,
    .ant-input {
      margin-left: 10px;
      width: 150px;
    }
    .ant-radio-wrapper {
      margin-left: 10px;
    }
    .span_underline {
      display: inline-block;
      min-width: 150px;
      margin-left: 10px;
      border-bottom: 1px solid #eee;
      text-align: center;
    }
  }
`
export const FlexItem = styled.div`
  display: flex;
  background: #fff;
  align-items: center;
  margin: 5px 0px 10px;
  line-height: 30px;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: ${(props) => props.content || "inherit"};
  > div {
    display: flex;
    margin-left: ${(props) => props.marginleft || "2em"};
    .ant-input,
    .ant-picker {
      margin-left: 10px;
      width: 130px;
    }
    .ant-select,
    .ant-switch,
    .ant-radio-group {
      margin-left: 10px;
    }
    .ant-radio-wrapper {
      line-height: 35px;
    }

    .span_underline {
      display: inline-block;
      width: ${(props) => props.width || "60px"};
      height: ${(props) => props.height || "30px"};
      border-bottom: 1px solid #bdbdbd;
      text-align: center;
    }
  }

  //后缀带单位的input样式修改
  .ant-input-group-wrapper {
    width: 90px;
    .ant-input,
    .ant-input-group {
      width: 50px;
    }
    .ant-input-group-addon {
      padding: 0 5px;
    }
  }
  .rightText {
    width: 80px;
    line-height: 32px;
  }
  .ant-switch {
    margin-top: 4px;
  }
`

export const FourItem = styled.div`
  display: flex;
  align-items: center;
  margin-left: 22px;
  height: 40px;
  margin-bottom: 5px;
  > div {
    width: 25%;
    display: flex;
    align-items: center;
    margin-bottom: 3px;
    > span:first-child {
      width: 90px;
      display: inline-block;
      text-align: right;
    }
    .ant-picker,
    .ant-select,
    .ant-input,
    .ant-input-number,
    .ant-radio-group {
      margin-left: 10px;
      width: 130px;
      text-align: left;
    }
    .ant-switch,
    .ant-input-group-wrapper {
      margin-left: 10px;
    }
    //单位有后缀的input
    .ant-input-group-wrapper {
      width: 70px;
      .ant-input {
        width: 50px;
      }
      .ant-input-group-addon {
        padding: 0 5px;
      }
    }
    .span_underline {
      display: inline-block;
      min-width: 70px;
      margin: 0 10px;
      border-bottom: 1px solid #999;
      text-align: center;
    }
  }
`
export const SecondTab = styled(Tabs)`
  .ant-tabs-tab {
    height: 30px;
    line-height: 30px;
    apdding: 0;
    margin: 0;
    margin-left: 10px;
  }
`
export const SpanBottomline = styled.span`
  display: inline-block;
  width: 100px;
  text-align: center;
  border-bottom: 1px solid #000;
  &:hover {
    cursor: text;
  }
`
export const SpanBottomlineHalf = styled.span`
  display: inline-block;
  width: 40px;
  border-bottom: 1px solid #000;
  text-align: center;
  &:hover {
    cursor: text;
  }
`

export const FlexChild = styled.div`
  width: ${(props) => props.width};
  min-width: ${(props) => props.width * 1000 + "px"};
  > span:first-child {
    width: 90px;
    display: inline-block;
    text-align: right;
  }
`
export const LeftBorder = styled.span`
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  width: 2px;
  height: 14px;
  background-color: #59b4f4;
`
