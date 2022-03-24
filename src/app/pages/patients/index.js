import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import Workbench from "./workbench"
import SetVisitRoom from "./setVisitRoom"
import PatientMore from "./patientmore"
import PatientMoreDetail from "./patientmoreDetail"
import { Provider } from "mobx-react"
import Moredetail from "@/app/stores/patients/moredetail.js"
import FollwStore from "@/app/stores/follow"
const follow = new FollwStore()
const moredetail = new Moredetail()
export default ({ match }) => {
  return (
    <Provider moredetail={moredetail} follow={follow}>
      <Switch>
        <Route exact path={`${match.url}/workbench`} component={Workbench} />
        <Route exact path={`${match.url}/more`} component={PatientMore} />
        <Route
          exact
          path={`${match.url}/detail`}
          component={PatientMoreDetail}
        />
        <Route
          exact
          path={`${match.url}/setconsultingroom`}
          component={SetVisitRoom}
        />
        <Redirect from="*" to={`${match.url}/workbench`} />
      </Switch>
    </Provider>
  )
}
