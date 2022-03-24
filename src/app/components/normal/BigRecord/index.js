import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Spin, Modal } from "antd"
import { FullscreenOutlined } from "@ant-design/icons"
import { LoadingDiv } from "@/app/components/base/baseDiv"
import ReactToPrint from "react-to-print"
import apis from "@/app/utils/apis"
import config from "@/app/config.js"
import styled from "styled-components"

const ModalBase = styled(Modal)`
  .ant-modal-body {
    height: 98vh;
  }
`
const IframeDiv = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
`
const IframeButton = styled.button`
  background: #ffa25c;
  color: #fff;
  border: none;
  margin: 5px 0px;
  padding: 2px 6px;
  cursor: pointer;
`
export default
@inject("store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      historyUrl: "",
      visitFlag: false,
      bigShow: false, //是否放大看大病历
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.init()
  }
  init = () => {
    let select_one = JSON.parse(localStorage.getItem("patient"))
    let data = {
      cycleNumber: select_one.cycleNumber,
      femalePid: select_one.patientPid,
      cycleType: select_one.treatStage,
    }
    this.setState({
      historyUrl: "",
      visitFlag: false,
    })
    setTimeout(() => {
      apis.Patients_history.getBigHistory(data).then((res) => {
        if (res.code === 200) {
          this.setState({
            historyUrl: res.data,
            visitFlag: true,
          })
        }
      })
    }, 1)
  }
  render() {
    let { historyUrl, visitFlag, bigShow } = this.state
    let { name } = this.props
    return (
      <>
        {visitFlag ? (
          <>
            <FullscreenOutlined
              style={{
                color: " #59b4f4",
                fontSize: "20px",
                position: "absolute",
                top: name === "edit" ? "7%" : "18%",
                left: name === "edit" ? "4%" : "7%",
              }}
              onClick={() => {
                this.setState({
                  bigShow: true,
                })
              }}
            />
            <ReactToPrint
              trigger={() => (
                <IframeButton size="small" type="primary">
                  打印
                </IframeButton>
              )}
              content={() => this.printRef}
            />
            <IframeDiv>
              <iframe
                ref={(el) => (this.printRef = el)}
                src={`${config.backend}/${historyUrl}`}
                frameBorder={0}
                title="大病历"
                id="iframeId"
                width="100%"
                height="7500px"
              />
            </IframeDiv>
          </>
        ) : (
          <LoadingDiv>
            <Spin />
          </LoadingDiv>
        )}
        {bigShow ? (
          <ModalBase
            visible={bigShow}
            centered
            width="98vw"
            footer={null}
            onClose={false}
            onCancel={() =>
              this.setState({
                bigShow: false,
              })
            }
          >
            <iframe
              title="大病历"
              id="iframeId"
              src={`${config.backend}/${historyUrl}`}
              style={{ width: "98%", height: "98%", cursor: "pointer" }}
            />
          </ModalBase>
        ) : null}
      </>
    )
  }
}
