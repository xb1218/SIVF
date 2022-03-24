import styled from "styled-components"
import { BaseInput, BaseTextArea } from "../base/formStyles"
import { BaseBtn } from "../base/baseBtn"
import BaseTag from "../base/baseTag"
import { Row, Badge } from "antd"

const InputArea = styled.div`
  padding: 23px 15px;
  position: relative;
  background-color: white;
  border-radius: 0 0 6px 6px;
  height: 160px;
`

const ChatArea = styled.div`
  flex-grow: 1;
  background: white;
  display: flex;
  flex-direction: column;
  height: 1px;
  border-radius: 3px;
  box-shadow: 0px 0px 4px 0px rgba(220, 223, 224, 0.5);
`

const Avatar = styled.div`
  background: ${(props) => `url(${props.avatar}) center / 100% no-repeat`};
  background-size: cover;
  width: 100%;
  height: 100%;
`

const ChatAvatar = styled.div`
  width: 36px;
  height: 36px;
  background: grey;
  flex-shrink: 0;
  border-radius: 3px;
  overflow: hidden;
`

const OtherAvatar = styled(ChatAvatar)`
  margin-right: 10px;
`

const MineAvatar = styled(ChatAvatar)`
  margin-left: 10px;
`

const ChatMessage = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-self: ${({ isSelf, isRevoked }) =>
    isRevoked ? "center" : isSelf ? "flex-end" : "flex-start"};
  flex-shrink: 0;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 2px;
  padding-right: 10px;
  border-radius: 3px 3px 0 0;
  background-color: rgb(250, 250, 250);
`

const NoMoreMessage = styled.div`
  align-self: center;
  padding: 4px 10px;
  background-color: #c6c6c6;
  border-radius: 5px;
  color: white;
`

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 6px 6px 0 0;
`

const Main = styled.div`
  padding: 16px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  border-radius: 6px 6px 0 0;
  border-bottom: 1px solid rgb(222, 222, 222);
  display: flex;
  flex-direction: column;
  flex-basis: 71.96%;
  background-color: white;
`

const InputAreaIcons = styled.div`
  position: absolute;
  top: 15px;
  left: 23px;
  display: flex;
`

const InputAreaIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 20px;
  cursor: pointer;
`

const InputSend = styled(BaseInput)`
  &.ant-input {
    resize: none;
    margin-top: 23px;
    border: 0;
    height: 100%;

    &:focus {
      box-shadow: none;
    }
  }
`

const TextAreaSend = styled(BaseTextArea)`
  &.ant-input {
    resize: none;
    margin-top: 23px;
    border: 0;
    height: 100%;

    &:focus {
      box-shadow: none;
    }
  }
`

const HiddenFileInput = styled.input`
  &[type="file"] {
    display: none;
  }
`

const FileIconWrap = styled.label`
  height: 24px;
`

const TimeTag = styled.div`
  align-self: center;
  padding: 4px 10px;
  background-color: #c6c6c6;
  border-radius: 5px;
  color: white;
  margin-bottom: 20px;
`

const FileInfo = styled.div`
  margin: 0 10px;
  display: flex;
  width: 130px;
  word-wrap: break-word;
  flex-direction: column;
  justify-content: center;
`

const FileName = styled.div`
  color: #333;
`

const FileSize = styled.div`
  color: #666;
`

const ImgMessageWrap = styled.div`
  width: 200px;
  ${"" /* height: ${200 / 16 * 9}px; */}
  overflow: hidden;
`

const ImgMessage = styled.img`
  width: 100%;
`

const ChatText = styled.div`
  max-width: 281px;
  box-shadow: 0 0 2px rgb(228, 228, 228, 0.5);
  border-radius: 4px;
  padding: 10px;
  position: relative;
  font-size: 14px;
  line-height: 22px;
  word-break: break-all; /* 适配中英文的换行 */
  white-space: pre-line; /* 把让换行符生效 */

  .emoji {
    width: 21px;
    height: 21px;
    margin-bottom: -4px;
    margin-left: 2px;
  }

  &::after {
    position: absolute;
    content: "";
    height: 0;
    width: 0;
    pointer-events: none;
    border: solid transparent;
    border-width: 6px;
    top: 15px;

    ${(props) => {
      if (props.isSelf) {
        return `
          right: -12px;
          border-left-color: rgb(177, 225, 255);
        `
      } else {
        return `
          left: -12px;
          border-right-color: rgba(240,240,240,1);
        `
      }
    }}
  }

  ${(props) => {
    if (props.isSelf) {
      return `
        background: rgb(177, 225, 255);
      `
    } else {
      return `
        background-color: rgba(240, 240, 240, 1);
        box-shadow: none;
      `
    }
  }}
`

const FileText = styled.div`
  display: flex;
  justify-content: space-around;
  width: 206px;
  padding: 10px 0;
  border-radius: 2px;
  border: 1px solid #b1e1ff;
  position: relative;

  &::before {
    position: absolute;
    content: "";
    height: 0;
    width: 0;
    pointer-events: none;
    border: solid transparent;
    border-width: 7px;
    top: 11px;
    right: -13px;
    border-left-color: #fff;
    z-index: 1;
  }

  &::after {
    position: absolute;
    content: "";
    height: 0;
    width: 0;
    pointer-events: none;
    border: solid transparent;
    border-width: 8px;
    top: 10px;
    right: -16px;
    border-left-color: #b1e1ff;
    z-index: 0;
  }
`

const ChatBubble = styled.div`
  width: 76px;
  height: 42px;
  box-shadow: 0 0 2px rgb(228, 228, 228, 0.5);
  border-radius: 4px;
  padding: 10px;
  position: relative;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
  word-break: break-all; /* 适配中英文的换行 */
  white-space: pre-line; /* 把让换行符生效 */

  .emoji {
    width: 21px;
    height: 21px;
    margin-bottom: -4px;
    margin-left: 2px;
  }

  &::after {
    position: absolute;
    content: "";
    height: 0;
    width: 0;
    pointer-events: none;
    border: solid transparent;
    border-width: 6px;
    top: 15px;

    ${(props) => {
      if (props.isSelf) {
        return `
        right: -12px;
        border-left-color: rgb(177, 225, 255);
      `
      } else {
        return `
        left: -12px;
        border-right-color: rgba(240,240,240,1);
      `
      }
    }}
  }

  ${(props) => {
    if (props.isSelf) {
      return `
      background: rgb(177, 225, 255);
    `
    } else {
      return `
      background-color: rgba(240, 240, 240, 1);
      box-shadow: none;
    `
    }
  }}
`

const RecallHandler = styled.img`
  cursor: pointer;
  align-self: center;
`

const OperatorWrapper = styled(Row)`
  display: flex;
  align-self: stretch;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 10px;
  padding-right: 7px;
`

const HuaShuBtn = styled(BaseBtn)`
  margin-right: 12px;
  padding: 3px 12px;
  border-radius: 3px;
  background-color: #21d3a4;
  margin-bottom: 12px;
  box-shadow: 0px 2px 4px 0px rgba(204, 204, 204, 0.5);
`

const QuestionTag = styled(BaseTag)`
  margin-bottom: 12px;
`

const CardMessageWrap = styled.div`
  max-width: 281px;
  box-shadow: 0 0 2px rgb(228, 228, 228, 0.5);
  border-radius: 4px;
  padding: 10px;
  position: relative;
  font-size: 14px;
  line-height: 22px;
  word-break: break-all;
  white-space: pre-line;
  display: flex;
  align-items: center;
  cursor: pointer;

  &::after {
    position: absolute;
    content: "";
    height: 0;
    width: 0;
    pointer-events: none;
    border: solid transparent;
    border-width: 6px;
    top: 15px;

    ${(props) => {
      if (props.isSelf) {
        return `
          right: -12px;
          border-left-color: rgb(177, 225, 255);
        `
      } else {
        return `
          left: -12px;
          border-right-color: rgba(240,240,240,1);
        `
      }
    }}
  }
  ${(props) => {
    if (props.isSelf) {
      return `
        background: rgb(177, 225, 255);
      `
    } else {
      return `
        background-color: rgba(240, 240, 240, 1);
        box-shadow: none;
      `
    }
  }}
`

const CardName = styled.div`
  margin-left: 10px;
`

const CardContentWrap = styled.div``

const CardContent = styled.div`
  margin-left: 10px;
`

const AvatarWrap = styled.div`
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  background: rgba(91,173,245,1);
  color: white;
  font-size: 18px;
  border-radius: 6px;
  background-size: cover;
  overflow: hidden;
}
`

const UnreadBadge = styled(Badge)`
  position: relative;
  top: -5px;
  left: 2px;
  font-size: 12px;
  transform: scale(0.9);

  .ant-badge-count {
    padding: 0 2px;
    min-width: 14px;
    height: 14px;
    line-height: 14px;
    font-size: 12px;
  }

  .ant-scroll-number-only {
    p {
      font-size: 12px;
      transform: scale(0.9);
    }
  }
`

export {
  InputArea,
  ChatArea,
  Avatar,
  ChatAvatar,
  OtherAvatar,
  MineAvatar,
  ChatMessage,
  Title,
  Main,
  Wrap,
  InputAreaIcons,
  InputAreaIcon,
  InputSend,
  TextAreaSend,
  HiddenFileInput,
  FileIconWrap,
  NoMoreMessage,
  TimeTag,
  FileInfo,
  FileName,
  FileSize,
  ImgMessageWrap,
  ImgMessage,
  ChatText,
  FileText,
  ChatBubble,
  RecallHandler,
  OperatorWrapper,
  HuaShuBtn,
  QuestionTag,
  CardMessageWrap,
  AvatarWrap,
  CardContentWrap,
  CardName,
  CardContent,
  UnreadBadge,
}
