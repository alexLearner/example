import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers/'
import thunk from 'redux-thunk'
import { Router, Route, browserHistory } from 'react-router'
import { routerMiddleware, push } from 'react-router-redux'

// Apply the middleware to the store
const middleware = routerMiddleware(browserHistory)

export default function configureStore( initialState ) {
	const store = createStore( 
		rootReducer, 
		initialState,
		applyMiddleware(thunk, middleware) 
	)

	if (module.hot) {
		module.hot.accept('../reducers', () => {
			const nextRootReducer = require('../reducers')
			store.replaceReducer(nextRootReducer)
		})
	}

	return store
}