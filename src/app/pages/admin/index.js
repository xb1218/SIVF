import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import UserManage from "./usermanage"
import Bizdata from "./bizdata"
import AdviceSetting from "@/app/pages/adminSettings/advice/index.js"
import InspectSetting from "@/app/pages/adminSettings/inspect/index.js"

export default ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}/usermanage`} component={UserManage} />
      <Route path={`${match.url}/bizdata`} component={Bizdata} />
      <Route path={`${match.url}/advice`} component={AdviceSetting} />
      <Route path={`${match.url}/inspect`} component={InspectSetting} />
      <Redirect from="*" to={`${match.url}/overview`} />
    </Switch>
  )
}
