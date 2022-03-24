import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Spin } from "antd"
import { LoadingDiv } from "@/app/components/base/baseDiv"
// import apis from "@/app/utils/apis"
import config from "@/app/config.js"
import styled from "styled-components"

const IframeDiv = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
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
      showEdit: true, //是否显示编辑状态
    }
  }

  render() {
    let { historyUrl, visitFlag } = this.state
    return (
      <>
        {visitFlag ? (
          <>
            <IframeDiv>
              <iframe
                ref={(el) => (this.printRef = el)}
                src={`${config.backend}/${historyUrl}`}
                frameBorder={0}
                title="知情同意书"
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
      </>
    )
  }
}
