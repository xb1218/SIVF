import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import { Provider } from "mobx-react"

import Frozen from "./frozen"
import Renewal from "./renewal"

import FrozenRenewal from "@/app/stores/frozenRenewal"
import Store from "@/app/stores"
const frozenRenewal = new FrozenRenewal()
const store = new Store()

export default ({ match }) => {
  return (
    <Provider frozenRenewal={frozenRenewal} store={store}>
      <Switch>
        <Route exact path={`${match.url}/frozen`} component={Frozen} />
        <Route exact path={`${match.url}/renewal`} component={Renewal} />
        <Redirect from="*" to={`${match.url}/frozen`} />
      </Switch>
    </Provider>
  )
}
