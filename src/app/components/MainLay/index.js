import React, { Component } from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import MainContent from "@/app/components/common/MainContent"
import Header from "@/app/components/common/Header"
import Sider from "@/app/components/common/Sider"
import Patients from "@/app/pages/patients"
import Schedule from "@/app/pages/schedule"
import Dashboard from "@/app/pages/dashboard"
import Reservation from "@/app/pages/appointment"
import Follow from "@/app/pages/follow"
import FrozenRenewal from "@/app/pages/frozenRenew"
import Admin from "@/app/pages/admin"
export default class MainLay extends Component {
  render() {
    const {
      match,
      location: { pathname },
    } = this.props
    return (
      <div className="salt-pagelayout">
        <Header />
        <Sider pathname={pathname} />
        <MainContent key="mainContent" id="contentTop">
          <Switch>
            <Route path={`${match.url}/patients`} component={Patients} />
            <Route path={`${match.url}/reservation`} component={Reservation} />
            <Route path={`${match.url}/schedule`} component={Schedule} />
            <Route path={`${match.url}/follow`} component={Follow} />
            <Route path={`${match.url}/dashboard`} component={Dashboard} />
            <Route path={`${match.url}/renewal`} component={FrozenRenewal} />
            <Route path={`${match.url}/admin`} component={Admin} />
            <Redirect from="*" to={`${match.url}/patients`} />
          </Switch>
        </MainContent>
      </div>
    )
  }
}
