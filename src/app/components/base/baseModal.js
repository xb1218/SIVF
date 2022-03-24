import { Modal } from "antd"
import React from "react"
import styled from "styled-components"

//随访
export const UserModal = styled(Modal)`
  .ant-modal-title {
    text-align: center;
    font-size: 16px;
  }
  .ant-modal-header {
    border-bottom: 1px solid #fff;
  }
  .ant-modal-footer {
    background: white;
    border-top: 1px solid #fff;
    text-align: center;
    padding: 5px 0 10px 0;
  }
  .ant-modal-body {
    padding: 15px 0 10px 0;
  }
  .ant-row {
    margin-bottom: 20px;
    align-items: center;
  }
`
export const DetailModal = styled(Modal)`
  .ant-modal-title {
    text-align: center;
    font-size: 16px;
  }
  .ant-modal-header {
    border-bottom: 1px solid #fff;
  }
  .ant-modal-footer {
    background: white;
    border-top: 1px solid #fff;
    text-align: center;
    padding: 5px 0 20px 0;
  }
  .ant-modal-body {
    text-align: center;
    // padding: 20px 0 10 10px;
    padding: 10px 5px;
  }
  .ant-row {
    margin-bottom: 20px;
    align-items: center;
  }
`

const Weight = ({ className, footer, children, ...rest }) => (
  <Modal footer={footer} {...rest} className={className}>
    {children}
  </Modal>
)

export const BaseModal = styled(Weight)`
  &.ant-modal {
    .ant-modal-body {
      text-align: ${(props) => props.center || "left"};
      padding: 0 14px 0 14px;
    }

    .ant-modal-close {
      border: 0;
    }

    .ant-modal-close-x {
      color: white;
      line-height: 40px;
    }

    .ant-modal-footer {
      text-align: center;
      border-top: none;
      padding: 10px;
      border-top: 1px solid #ebebeb;
    }

    .ant-modal-header {
      padding: 9px 14px;
      background: #59b4f4;
      .ant-modal-title {
        color: #ffffff;
        font-size: 16px;
        line-height: 20px;
        font-family: PingFang-SC-Bold, PingFang-SC;
      }
    }

    .ant-modal-footer {
      text-align: center;
      border-top: none;
      padding: 10px;
      border-top: 1px solid #ebebeb;
      .cancel-btn {
        width: 80px;
        color: #59b4f4;
        height: 32px;
        line-height: 32px;
        border-radius: 3px;
        border: 1px solid #59b4f4;
        cursor: pointer;
      }

      .confirm-btn {
        width: 80px;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        background: #59b4f4;
        color: white;
        border-radius: 3px;

        &[disabled] {
          color: rgba(0, 0, 0, 0.25);
          background-color: #f5f5f5;
          border-color: #d9d9d9;
          text-shadow: none;
          -webkit-box-shadow: none;
          box-shadow: none;
          cursor: not-allowed;
        }
      }
    }
  }
`

//大弹框 宽1000， 中弹框宽820 ，小弹框 宽380，高100 （默认小弹框,正文局中）
export const NormalModal = styled(Modal)`
  &.ant-modal {
    .ant-modal-close-x {
      line-height: 42px;
      color: #fff;
    }
    .ant-modal-header {
      padding: 10px 20px;
      background: #59b4f4;
      .ant-modal-title {
        line-height: 22px;
        color: #fff;
      }
    }
    .ant-modal-body {
      padding: 0;
      text-align: ${(props) => props.centered || "center"};
    }
    .ant-modal-content {
      width: ${(props) => props.width || "380px"};
      min-height: ${(props) => props.height || null};
    }
    .ant-modal-footer {
      text-align: center;
    }
  }
`
