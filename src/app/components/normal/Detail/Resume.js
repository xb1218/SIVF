import React, { Component } from "react"
import { SpanTitle } from "@/app/components/base/baseSpan"
import styled from "styled-components"

const SrcollerDiv = styled.div.attrs({
  className: "ScrollDiv",
})`
  margin-top: 10px;
  height: calc(100vh - 114px);
  overflow-y: scroll;
  &.ScrollDiv::-webkit-scrollbar {
    display: none;
  }
`
const StageRow = styled.div`
  display: flex;
  align-items: center;
`
const Pstyle = styled.p`
  margin-bottom: 0;
  color: ${(props) => props.color};
`
const LineDiv = styled.div`
  height: 2.5em;
  margin-left: 20px;
  border-left: 1px dashed #cecece;
`
const CircleSpan = styled.span`
  width: 10px;
  height: 10px;
  margin-left: 15px;
  margin-right: 10px;
  border-radius: 50%;
  background: ${(props) => props.color};
  display: inline-block;
`

export default class FollowRecord extends Component {
  render() {
    return (
      <>
        <div>
          <SpanTitle>{this.props.title}</SpanTitle>
          <small className="textGrey">共({this.props.total})条</small>
        </div>
        <SrcollerDiv>
          {this.props.followRecords.map((item, index) => (
            <div key={index}>
              {index !== 0 ? <LineDiv></LineDiv> : null}
              <StageRow className="textGrey">
                <CircleSpan
                  color={item.abortion === "流产" ? "#FF405B" : "#59B4F4"}
                />
                <Pstyle color={item.abortion === "流产" ? "#FF405B" : null}>
                  {item.stage + " (" + item.followDate + ")"}
                </Pstyle>
              </StageRow>
            </div>
          ))}
        </SrcollerDiv>
      </>
    )
  }
}
