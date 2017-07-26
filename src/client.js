import "./config"
import React from 'react';
import ReactDOM from 'react-dom';
import { Router  } from 'react-router';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl-redux';
import {addLocaleData} from 'react-intl'
import history from './utils/history';
import configureStore from './stores/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';
import { match } from 'react-router';
import ruLocaleData from 'react-intl/locale-data/ru'
import transformPathname from "./functions/transformPathname"

const store = configureStore(window.APP_STATE);

addLocaleData([
  ...ruLocaleData,
]);

const newHistory = syncHistoryWithStore(history, store);

const scrollPositionsHistory = {};
if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

let onRenderComplete = function initialRenderComplete() {
  onRenderComplete = function renderComplete(location) {
    let scrollX = 0;
    let scrollY = 0;
    const pos = scrollPositionsHistory[location.key];
    if (pos) {
      scrollX = pos.scrollX;
      scrollY = pos.scrollY;
    } else {
      const targetHash = location.hash.substr(1);
      if (targetHash) {
        const target = document.getElementById(targetHash);
        if (target) {
          scrollY = window.pageYOffset + target.getBoundingClientRect().top;
        }
      }
    }

    window.scrollTo(scrollX, scrollY);

  };
};

// Make taps on links and buttons work fast on mobiles
// FastClick.attach(document.body);

let currentLocation = history.getCurrentLocation();
let routes = require('./routes').routes;

async function onLocationChange(location) {
  const newLocation = transformPathname(location.pathname)[1];

  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  };
  if (history.action === 'PUSH') {
    delete scrollPositionsHistory[location.key];
  }
  currentLocation = location;

  try {
    if (currentLocation.key !== location.key) {
      return;
    }

    let history = newHistory;

    match({ history, routes }, (error, redirectLocation, renderProps) => {
      ReactDOM.render(
        <Provider store={store}>
          <IntlProvider>
            <Router history={history}  {...renderProps} />
          </IntlProvider>
        </Provider>,
        document.getElementById('app'),
        () => onRenderComplete(location)
      );
    })
      
  } catch (err) {
    if (__DEV__) {
      throw err;
    }

    console.error(err); // eslint-disable-line no-console
    window.location.reload();
  }
}

// newHistory.listen((location) => onLocationChange(location))


// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/mjackson/history#readme
// history.listen(onLocationChange);
onLocationChange(currentLocation);
// store.subscribe(renderAll);


// // Enable Hot Module Replacement (HMR)
// if (module.hot) {
//   module.hot.accept('./routes', () => {
//
// 	  routes = require('./routes').default; // eslint-disable-line global-require
//     onLocationChange(currentLocation);
// 	  // renderAll()
//   });
// }

// export default store;
