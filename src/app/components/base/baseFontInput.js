import styled from "styled-components"
import { DatePicker, Input, Select } from "antd"

export const FontDate = styled(DatePicker).attrs({
  className: "dateinput",
})`
  &&.dateinput {
    background: transparent;
    dispaly: inline-block;
    font-weight: 500;
    height: 31px;
    width: 100%;
  }
  &&.dateinput input {
    text-align: left;
  }
`
export const FontInput = styled(Input)`
  border-radius: 4px;
  dispaly: inline-block;
  width: 100%;
  height: ${(props) => (props.height || 32) + "px"};
  vertical-align: middle;
  .ant-input-disabled {
    color: rgba(0, 0, 0, 1);
  }
`
export const FontSelect = styled(Select)`
  border-radius: 4px;
  width: 100%;
  vertical-align: middle;
  .ant-select {
    dispaly: inline-block;
  }
`
export const ButtonStyle = styled.button`
  vertical-align: middle;
  dispaly: inline-block;
  margin-right: 20px;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  border: none;
  border-style: solid;
  border-width: 1px;
  color: #59b4f4;
  background: rgba(89, 180, 244, 0.2);
  :hover {
    background: #4baef4;
    color: #fff;
    border: 1px solid #4baef4;
  }
  :active {
    border: none;
    border-style: solid;
    border-width: 2px;
    border-color: rgba(89, 180, 244, 0.2);
  }
  :focus {
    outline: 0;
  }
`
export const DashedButton = styled(ButtonStyle)`
  border: 1 px dashed #59b4f4;
  border-style: dashed;
  border-width: 1px;
  color: #59b4f4;
`
