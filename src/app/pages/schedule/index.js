import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import { Provider } from "mobx-react"
import ET from "./et"
import OPU from "./opu"
import IUI from "./iui"
import ScheduleStore from "@/app/stores/schedule"
import Moredetail from "@/app/stores/patients/moredetail"

const schedule = new ScheduleStore()
const moredetail = new Moredetail()
export default ({ match }) => {
  return (
    <Provider schedule={schedule} moredetail={moredetail}>
      <Switch>
        <Route path={`${match.url}/et`} component={ET} />
        <Route path={`${match.url}/opu`} component={OPU} />
        <Route path={`${match.url}/iui`} component={IUI} />
        <Redirect from="*" to={`${match.url}/opu`} />
      </Switch>
    </Provider>
  )
}
