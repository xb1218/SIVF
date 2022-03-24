import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Overview from './overview'
import Manage from './manage'
import Review from './review'

export default ({ match }) => {
	return (
		<Switch>
			<Route path={`${match.url}/overview`} component={Overview} />
			<Route path={`${match.url}/manage`} component={Manage} />
			<Route path={`${match.url}/review`} component={Review} />
			<Redirect from="*" to={`${match.url}/overview`} />
		</Switch>
	)
}
