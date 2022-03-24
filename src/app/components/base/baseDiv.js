import styled from "styled-components"

export const DivBetween = styled.div`
  margin: 0 10px 10px 0;
  width: 100%;
  background: #fff;
  height: 40px;
  border-radius: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    align-items: center;

    > div {
      height: ${(props) => props.btnheight};
      line-height: ${(props) => props.btnheight};
      width: ${(props) => props.pwidth};
      height: inherit;
      text-align: center;
    }
  }
`
export const BaseDiv = styled.div`
  width: ${(props) => props.width};
  background: #fff;
  height: ${(props) => props.height};
  border-radius: 2px;
  align-items: center;
  padding: 10px;
`
export const DivContent = styled.div`
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  height: ${(props) => props.height};
`
//自定义筛选tab
export const FilterDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  > div {
    width: ${(props) =>
      props.fontnum === 2 ? "56px" : props.fontnum === 3 ? "66px" : "80px"};
    height: 26px;
    line-height: 26px;
    vertical-align: middle;
    border: 1px solid #59b4f4;
    border-radius: ${(props) => (props.radius ? "13px" : "2px")};
    text-align: center;
    margin-left: 1em;
    cursor: pointer;
  }
`

export const SaveDiv = styled.div`
  text-align: center;
  margin: 20px 0;
`
export const LoadingDiv = styled.div`
  text-align: center;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
`
export const HospitalTitle = styled.div`
  text-align: center;
  display: flex;

  > div:first-child {
    font-weight: 500;
    font-size: 1.1em;
    width: 88%;
  }
  > div:nth-child(2) {
    width: 12%;
    min-width: 150px;
    .span_underline {
      display: inline-block;
      width: 80px;
      border-bottom: 1px solid #bdbdbd;
      text-align: center;
    }
  }
`
export const FlexBetween = styled.div`
  display: flex;
  margin: 0 1em 0 0;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  .span_underline {
    display: inline-block;
    width: 60px;
    height: 25px;
    line-height: 30px;
    border-bottom: 1px solid #bdbdbd;
    text-align: center;
  }
`
export const ContentRadius = styled.div`
  width: ${(props) => props.width};
  background: #fff;
  height: ${(props) => props.height};
  border-radius: 2px;
`
export const FloatDiv = styled.div`
  position: absolute;
  color: #59b4f4;
  right: ${(props) => props.right || "2em"};
  top: ${(props) => props.top || ""};

  &:hover {
    color: #408ecf;
    cursor: pointer;
    border-bottom: 1px solid #408ecf;
  }
`
