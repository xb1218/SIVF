import React, { Component } from "react"
import styled from "styled-components"

const SpanFont = styled.span`
  vertical-align: middle;
  display: inline-block;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  line-height: 15px;
  text-align: left;
  text-indent: 10px;
  border-left: 2px solid rgba(89, 180, 244, 1);
  margin: 10px 0 20px 10px;
  width: ${(props) => (props.width ? props.width : "8%")};
`
const SpanLine = styled.span`
  display: inline-block;
  vertical-align: top;
  margin-top: 17px;
  width: 80%;
  hheight: 1px;
  border-bottom: 1px dashed rgba(89, 180, 244, 1);
`
const ButtonOpen = styled.button`
  vertical-align: middle;
  float: right;
  margin-right: 20px;
  margin-top: 4px;
  padding: 1px 6px;
  border-radius: 4px;
  border: none;
  border-style: solid;
  border-width: 1px;
  border-color: ;
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
    border-width: 1px;
    border-color: rgba(89, 180, 244, 0.2);
  }
  :focus {
    outline: 0;
  }
`

export default class StageTitle extends Component {
  ShadowDefault = () => {
    this.props.ShadowDefault()
  }
  render() {
    return (
      <div style={{ width: "100%" }}>
        <div>
          <SpanFont width={this.props.width}>{this.props.name}</SpanFont>
          <SpanLine></SpanLine>
          <ButtonOpen onClick={this.ShadowDefault}>
            {this.props.shadow}
          </ButtonOpen>
        </div>
        {this.props.shadow === "收起" ? <div>{this.props.children}</div> : null}
      </div>
    )
  }
}
