import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import Login from "@/app/pages/login"
import BigMedical from "@/app/pages/bigMedicalRecord"
import SignAgreen from "@/app/pages/signAgreen"
import MainLay from "@/app/components/MainLay"
import "./index.scss"
import "./iconfont.js"

function App({ match, history, location }) {
  return (
    <>
      <Switch>
        <Route path={`${match.url}/bigMedical`} component={BigMedical} />
        <Route path={`${match.url}/signAgreen`} component={SignAgreen} />
        <Route path={`${match.url}/login`} component={Login} />
        <Route path={`${match.url}/`} component={MainLay} />
      </Switch>
    </>
  )
}

export default () => {
  return (
    <Switch>
      <Route path="/public" component={App} />
      <Redirect from="*" to="/public" />
    </Switch>
  )
}
