import "./config"
import LANGUAGES from "./configLanguage"
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import {render} from "rapscallion";
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import { IntlProvider } from 'react-intl-redux'
import assets from './assets.json';
import { port, auth } from './config';
import Html from './components/Html.js'
import {addLocaleData} from 'react-intl'
import { match, RouterContext, RoutingContext } from 'react-router'
import { Provider } from 'react-redux';
import fetchComponentsData from './utils/fetchComponentsData';
import getCookie from './utils/getCookie';
import configureStore from "./stores/configureStore.js"
import ruLocaleData from 'react-intl/locale-data/ru'
import mcache from "memory-cache";
import {routes} from "./routes"
import HtmlError from "./components/HtmlError"
import bluebird from "bluebird"

global.Promise = bluebird;

const cacheOptions = {cacheSettings: {"maxAge": 2592000}};

addLocaleData([...ruLocaleData]);

const app = express();

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('*', async (req, res, next) => {
	let
		duration = 86400,
		key = '__express__' + req.url,
		LANG = "en",
		cachedBody = mcache.get(key),
		cachedStatus = mcache.get(key+"_s"),
		s_host = "https://bookimed.com",
		prefix = LANGUAGES.default,
		path = req._parsedOriginalUrl.path,
		test = /\/([a-z]{0,2})(\/[^\s]*)/.exec(path),
		initialState = {
			intl: {
				defaultLocale: LANG,
				locale: LANG,
				messages: {
					'__NO_USE_THIS__' : 1
				}
			}
		};

	// console.log(req.path);

	if (req.path.charAt(req.path.length - 1) !== "/") {
		return res.redirect(req.url.replace(req.path, req.path + "/"));
	}

	if (
		~req.headers.host.indexOf("ru")
		|| ~req.headers.host.indexOf("test")
		|| __DEV__
	) {
		s_host = "https://ru.bookimed.com";
		LANG = "ru"
	}


	if (test) {
		// LANG = "en";
		LANG = LANG + "-" + test[1].toUpperCase();
		// LANG = "en";
		if (test[1] !== prefix) {
			return res.redirect(`/${prefix}${test[2]}`)
		}
	}


	let cookie = {};
	let countryCode = req.headers['cf-ipcountry'] || "UA";
	let serverData = {
		ip: req.headers["cf-connecting-ip"] || -1,
		client_country_id: countryCode,
		client_geo_country_id: countryCode,
		pathname: req.url,
		host: req.headers.host,
		lang: LANG,
		s_host
	};

	if (req.headers.cookie) {
		cookie.country = getCookie("country-code", req.headers.cookie);
		cookie.url_history = getCookie("url_history", req.headers.cookie)
	}

	if (cookie.country) {
		serverData.client_country_id = cookie.country.trim();
		serverData.url_history = cookie.url_history;
	}


	if (cachedBody) {
		res.status(cachedStatus);
		res.send(cachedBody + `<script>serverData = ${JSON.stringify(serverData)}<\/script>`);
		return;
	}

	const store  = configureStore(initialState);

	try {
		match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
			if (error) {
				res.status(500).send(error)
			} else if (redirectLocation) {
				res.redirect(302, redirectLocation.pathname + redirectLocation.search)
			} else if (renderProps) {

				try {
					function renderView() {
						const state = store.getState();

						let data = {
							state,
							// style: css._getCss(),
							scripts : [
								assets.vendor.js,
								assets.client.js,
							]
						};

						return render(
							<Html {...data}>
								<Provider store={store}>
									<IntlProvider>
										<RouterContext {...renderProps} />
									</IntlProvider>
								</Provider>
							</Html>
						).includeDataReactAttrs(false);
					}

				let
					isNotFound = renderProps.routes.filter(route => route.status === 404).length > 0;

					fetchComponentsData(
						store,
						renderProps,
						serverData
					).then(renderView)
						.then(r => r.toPromise())
						.then(html => {
							if (~req.url.indexOf("/clinics/")) {
								const result = store.getState().search.results;
								if (!(result && result.length)) {
									isNotFound = true;
								}
							}

							const body = `<!doctype html>${html}`;
							const status = isNotFound ? 404 : 200;

							mcache.put(key, body, duration);
							mcache.put(key+"_s", status, duration);
							res.status(status);
							res.send(body);
						})
						.catch(err => next(err));
				}
				catch(err) {
					next(err)
				}
			} else {
				res.status(404).send('Not found')
			}
		})
	} catch (err) {
		next(err);
	}


});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
	console.log(pe.render(err));
	const html = ReactDOM.renderToStaticMarkup(
		<HtmlError/>
	);
	res.status(err.status || 500);
	res.send(`<!doctype html>${html}`);
});

app.listen(port, () => {
	console.log(`The server is running at http://localhost:${port}/`);
});
