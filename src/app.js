import React, { PureComponent } from 'react'
import * as actions from './actions/layout'
import {setPopupBody} from "./actions/popup"
import { injectIntl } from 'react-intl';
import Header from './components/Header/header.js'
import Footer from './components/Footer/footer.js'
import LazilyLoad, {importLazy} from './components/LazilyLoad';
import DocumentMeta from "react-document-meta"
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import Cookie from "./functions/Cookie"
import "./sass/main.sass"
import store from "store"

class App extends PureComponent {
	constructor( props ) {
		super ( props );

		this.setFirstHistory = this.setFirstHistory.bind(this);
		this.clickOnVideo = this.clickOnVideo.bind(this);

		this.state = {isLoad: false};
	}

  getChildContext() {
		let
			prefix = this.props.params.prefix,
			s_host = this.props.serverData.s_host;

		if (prefix) {
			s_host += "/" + prefix;
			prefix += "/";
		}
		else {
			prefix = ""
		}

    return {
    	f: this.props.intl.formatMessage,
    	actions,
	    pathnames: {
		    clinics: prefix + "clinic",
		    search: prefix + "clinics",
		    home: prefix,
		    s_host
	    }
    };
  }

	static fetchData({dispatch}, location, serverData) {
		const {lang} = serverData;

		return Promise.all([
			dispatch(actions.setLang(lang)),
			dispatch(actions.layoutSetCurrentCountry(
				serverData.client_country_id ||
				serverData.client_geo_country_id,
				true
			)),
			dispatch(actions.getSEO(location.pathname)),
			dispatch(actions.setServerData({...serverData, country_code: serverData.client_country_id}))
		])
	}

	componentWillMount() {
		if (canUseDOM) {

			let getCountry = store.get("geo_country");
			let country_code = getCountry;
			let serverData = {};

			// this.props.actions.setLang(this.props.layout.lang);

			if (window.serverData) {
				serverData = window.serverData;
				this.props.setServerData({...serverData, country_code: country_code || serverData.client_country_id});
			}

			if (getCountry) {
				serverData.client_country_id = getCountry;
			}

			this.props.actions.layoutGetDeepDirections();

			this.props.actions.layoutGetCountries().then(() => {
				this.props.layoutSetCurrentCountry(
					serverData.client_country_id ||
					serverData.client_geo_country_id,
					true
				);

				this.props.layoutSetVisiblePhone();
			});

		}
	}

	componentWillReceiveProps(nextProps) {
		const nextPathname = nextProps.location.pathname;
		const pathname = this.props.location.pathname;

		if (nextPathname !== pathname) {
			this.props.getSEO(nextPathname)
		}
	}

	componentDidMount() {
		this.setState({isLoad: true});

		window.__IS__WINDOW__LOAD__ = true;
		window.s_host = this.props.serverData.s_host;

		this.setFirstHistory();
	}

	setFirstHistory() {
		let obj = {
			url: window.location.host + window.location.pathname,
			h1: this.props.seo.h1 || this.props.seo.title,
			time: Date.now()
		};

		Cookie.push("tracking_url_history", obj);
	}

	clickOnVideo(e) {
		const clickVideo = (e) => {
			const element = e.target.closest('.video');

			if (element) {
				e.preventDefault();
				e.stopPropagation();
				require.ensure([], (require) => {
					const $ = require('jquery');
					window.$ = $;
					window.jQuery = $;

					require('./vendors/jquery.fancybox.js');
					$(element)
						.fancybox()
						.trigger("click");
				})
			}
		};

		const clickContentBtn = (e) => {
			const element = e.target.closest('.cl-sh-btn');

			if (element) {
				this.props.setPopupBody(undefined, "get_cost");
			}
		};

		clickVideo(e);
		clickContentBtn(e);
	}


	render() {
		const seo = this.props.seo || {};

		return (
			<div
				onClick={this.clickOnVideo}
				className="wrapper">
				<Header />
				<DocumentMeta
					title={seo.title}
					meta={{
						name: {
							robots: seo.robots
						}
					}}
					description={seo.description} />

				<div className="layout">
					{this.props.default}
				</div>

				<Footer />		

				<LazilyLoad
					modules={{
						Popups: () => importLazy(import('./components/Popups/popups.js')),
					}}>
					{
						({Popups}) => <Popups/>
					}
				</LazilyLoad>
			</div>
		) 
	}
}

App.childContextTypes = {
  f: React.PropTypes.func,
  actions: React.PropTypes.object,
	pathnames: React.PropTypes.object
};

const AppConnect = connect(
	state => ({
		seo: state.layout.seo,
		layout: state.layout,
		serverData: state.layout.serverData,
	}),
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
		getSEO: bindActionCreators(actions.getSEO, dispatch),
		setPopupBody: bindActionCreators(setPopupBody, dispatch),
		layoutSetCurrentCountry: bindActionCreators(actions.layoutSetCurrentCountry, dispatch),
		setServerData: bindActionCreators(actions.setServerData, dispatch),
		layoutSetVisiblePhone: bindActionCreators(actions.layoutSetVisiblePhone, dispatch),
	})
)(App);

export default injectIntl(AppConnect, {intlPropName: "intl"})