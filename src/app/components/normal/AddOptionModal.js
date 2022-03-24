import React from "react"
import { observer, inject } from "mobx-react"
import { Row, Modal, Button } from "antd"
import styled from "styled-components"

const ProjectModal = styled(Modal)`
  &.ant-modal {
    .ant-modal-body {
      padding: 20px 10px;
    }
    .ant-modal-footer {
      background: white;
      border-top: 1px solid #fff;
      padding: 15px 0;
    }
    .ant-modal-body {
      padding: 20px 10px 0 10px;
    }
  }
`
@inject("moredetail")
@observer
class AddOptionModal extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    const { onOk, onCancel, visible, children, rest, width } = this.props

    return (
      <ProjectModal
        visible={visible}
        onCancel={onCancel}
        width={width}
        onOk={onOk}
        title={
          <Row
            type="flex"
            align="middle"
            style={{
              marginLeft: "10px",
              marginRight: "30px",
              fontSize: "14px",
            }}
          >
            自定义添加
          </Row>
        }
        footer={
          <Row type="flex" align="middle" justify="center">
            <Button style={{ marginRight: "10px" }} onClick={() => onCancel()}>
              取消
            </Button>
            <Button type="primary" onClick={() => onOk()}>
              确定
            </Button>
          </Row>
        }
      >
        <div {...rest} style={{ textAlign: "center" }}>
          {children}
        </div>
      </ProjectModal>
    )
  }
}

export default AddOptionModal
