import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { UserManage } from "dfinfo-common-components"
import "dfinfo-common-components/lib/dfinfo-common-components.css"
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
        <UserManage apis={apis.Admin} systemName="SIVF"></UserManage>
      </div>
    )
  }
}
