import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { myStore } from './store/myStore'
import { Router, Route, browserHistory, IndexRedirect } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Login from './Auth/components/Login'
import AppContainer from './Common/containers/AppContainer'
import IndexContainer from './Auth/containers/IndexContainer'
import './main.css'
import 'antd/dist/antd.css'

injectTapEventPlugin()
const store = myStore()
ReactDOM.render(
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={AppContainer}>
				<IndexRedirect to="/index" />
				<Route path="/index" component={IndexContainer} />
			</Route>
			<Route path="/login" component={Login} />
		</Router>
	</Provider>,
	document.getElementById('root')
)
