import styled from "styled-components"

// 筛选状态start
export const LeftSpan = styled.span`
  display: inline-block;
  width: 80px;
  height: 22px;
  margin: 0 0 0 10px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
`
export const RightSpan = styled.span`
  display: inline-block;
  line-height: 22px;
  padding: 0 20px;
  cursor: pointer;
  &:hover {
    color: #59b4f4;
  }
`
export const ItemSpans = styled.div`
  width: 100%;
  text-align: left;
  line-height: 32px;
  height: 32px;
  margin: 7px;
`
export const BaseDiv = styled.div`
  border-radius: 2px;
  margin-bottom: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.06);
`
// 筛选状态end

// 随访详情时期标题
export const Spanleft = styled.span`
  width: 40%;
  text-align: right;
  padding-right: 10px;
  display: inline-block;
  color: #333;
  line-height: 32px;
`
export const Spanright = styled(Spanleft)`
  color: #999999;
  width: 60%;
  // min-width:200px;
  line-height: 32px;
  text-align: left;
`
export const ItemSpan = styled.div`
  display: inline-block;
  padding: 0 2% 10px 2%;
  width: 33%;
  min-width: 300px;
  min-width: 33%;
`
export const ContentSpan = styled.span`
  display: inline-block;
  width: 50%;
`
export const Spanlist = styled.span`
  vertical-align: middle;
  display: inline-block;
  line-height: 20px;
  padding-left: 14px;
  margin-bottom: 20px;
`
//带左边框的标题
export const SpanTitle = styled.span`
  display: inline-block;
  font-weight: bold;
  line-height: 15px;
  padding: 0 10px;
  border-left: 2px solid #59b4f4;
`
