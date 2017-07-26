import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './app'
// import { matchPattern } from 'url-matcher'
// import { string } from 'url-matcher'

const defaulURL = process.env.__URL__;

function cacheQueryParser(query) {
	let out = '';
	if (typeof query === 'string') {
		out = query.split(':').pop().replace(/^[^/]*/, '');
	}
	return out;
}

function intercepPath(next, replace) {
	if (next.location.pathname === '/search'
		&& next.location.query.q
		&& next.location.query.q.indexOf('cache') === 0
		&& next.location.query.q.indexOf(defaulURL) > -1) {
		replace(null, cacheQueryParser(next.location.query.q));
	}
};

const childRoutes = [
	require('./routes/Details'),
	require('./routes/Search'),
];
const getIndexRoute = (partialNextState, callback) => {
	require.ensure([], function (require) {
		callback(null, {
			component: require('./components/Home'),
		})
	})
};

export const routes = {
  childRoutes: [{
    path: '/',
	  onEnter: intercepPath,
	  component: App,
	  getIndexRoute,
	  childRoutes: [
		  {
			  childRoutes,
			  getIndexRoute,
		  },
	    {
		    path: ':prefix',
				childRoutes,
		    getIndexRoute,
	    },
		  require('./routes/NotFound')
	  ],
  }]
};

export const routes2 = (
  <Router
    routes={routes}
  />
)

export default store => routes;

