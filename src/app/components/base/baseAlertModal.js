import { Row } from "antd"
import alertIcon from "@/app/styles/image/alert-1.svg"
import React from "react"
import { BaseBtn } from "./baseBtn"
import styled from "styled-components"
import { BaseModal } from "./baseModal"

const ModalStyled = styled(BaseModal)`
  &.ant-modal {
    .ant-modal-close {
      top: -5px;
    }

    .ant-modal-body {
      padding: 0 20px;
      padding-bottom: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .alert-icon {
      width: 60px;
      margin: 30px 0 30px 0;
    }

    .alert-text {
      margin-bottom: 30px;
      color: rgb(102, 102, 102);
      font-size: 14px;
    }

    .confirm,
    .cancel {
      font-size: 14px;
      padding: 7px 42px;
    }

    .confirm {
      margin-right: 24px;
      background: #1090ff;
    }
  }
`

export default class MyComponent extends React.Component {
  render() {
    const {
      title,
      action,
      closeModal,
      confirmBtnText = "删除",
      cancelBtnText = "取消",
      alertText,
      hideCancelBtn = false,
    } = this.props

    return (
      <ModalStyled
        width={340}
        className="base-alert-modal"
        visible={true}
        action={() => {
          action().then((res) => closeModal())
        }}
        title={title}
        footer={false}
        onCancel={closeModal}
      >
        <img className="alert-icon" src={alertIcon} alt="" />
        <div className="alert-text">{alertText}</div>

        <Row type="flex" align="middle">
          <BaseBtn
            onClick={() => {
              action().then((res) => {
                closeModal()

                return Promise.resolve(res)
              })
            }}
            className="confirm"
          >
            {confirmBtnText}
          </BaseBtn>
          {!hideCancelBtn && (
            <BaseBtn className="cancel" type="cancel" onClick={closeModal}>
              {cancelBtnText}
            </BaseBtn>
          )}
        </Row>
      </ModalStyled>
    )
  }
}
