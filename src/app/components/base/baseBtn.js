import styled from "styled-components"

export const BaseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: #168cf1;
  border-color: transparent;
  border-radius: 3px;
  padding: ${(props) => {
    switch (props.size) {
      case "middle":
        return "7px 14px"
      case "small":
        return "2px 8px"
      default:
        return "8px 20px"
    }
  }};
  // transition: ${(props) => props.theme.transitionBtn};
  cursor: pointer;
  outline: none;

  ${(props) =>
    props.type === "cancel" &&
    `
    background: rgb(243, 243, 243);
    color: #666;
  `}

  &[disabled] {
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    text-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    cursor: not-allowed;
  }
`

export const DashBtn = styled.button`
  border: 1px dashed #59b4f4;
  background-color: #edf6fd;
  color: #59b4f4;
  margin-right: 1em;
  padding: 0 0.5em;
  cursor: pointer;
  height: ${(props) => props.height + "px"};
`

export const RadiusBtn = styled.span`
display:inline-block;
width:70px;
height;24px;
line-height:24px;
text-align:center;
border-radius: 15px;
 margin-right:20px;
 border:1px solid #59B4F4;
`
export const FixedBtn = styled.button`
 border: none;
 color: #fff;
 width:32px;
 height:32px;
 border-radius: 16px;
 background-color:#59B4F4;
 　position:fixed;
　　left:150px;
　　bottom:30px;
  box-shadow:0 0 10px #607d8b;
  cursor:pointer;
  &:hover{
    color: #fff;
    background-color:#59B4F4;
    box-shadow:0 0 10px #59B4F4;
  }
}
`
