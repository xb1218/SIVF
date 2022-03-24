import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { BizData } from "dfinfo-common-components"
import apis from "@/app/utils/apis"
import "../index.scss"
export default
@inject("auth")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="adminComponent">
        <BizData apis={apis.Admin} systemName="SIVF"></BizData>
      </div>
    )
  }
}
