import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import FollowList from "./followList"
import FollowDetail from "./details"
import { Provider } from "mobx-react"
import FollwStore from "@/app/stores/follow"
const follow = new FollwStore()
export default ({ match }) => {
  return (
    <Provider follow={follow}>
      <Switch>
        <Route exact path={`${match.url}/followList`} component={FollowList} />
        <Route
          exact
          path={`${match.url}/followDetail`}
          component={FollowDetail}
        />
        <Redirect from="*" to={`${match.url}/followList`} />
      </Switch>
    </Provider>
  )
}
