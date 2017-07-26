import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions/';
import {bindActionCreators} from 'redux';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import tx from 'transform-props-with';
import addElementFunc from '../../functions/elementStyles';
import queryObjectByName from "../../utils/queryObjectByName"
import Banner from "./Banner"
import Steps from "./Steps"
import Section from "./Section"
import Countries from "./Countries"
import Clinics from "./Clinics"
import Directions from "./Directions"
import Doctors from "./Doctors"
import Reviews from "./Reviews"
import Procedures from "./Procedures"
import Coordinators from "./Coordinators"
import FAQ from "./FAQ"
import Articles from '../Widgets/Articles';
import msg from "./HomeMsg"

const
	pr = addElementFunc(""),
	Home = tx([{ className: 'home' }, pr])('div');

class HomeClass extends PureComponent {
	constructor( props ) {
		super ( props );

		this.show = this.show.bind(this);
	}

	getChildContext() {
		return {msg}
	}

	show(q, modifier) {
		this.refs.banner.show(q, modifier)
	}

	static fetchData({dispatch}, {query, params}, serverData) {
		query.flight_departure_country = serverData.client_country_id || "UA";

		const
			a = actions;

		let mas = [
			a.layout.layoutGetDeepCountries(),
			a.layout.layoutGetDeepProcedures(),
			a.layout.layoutGetDeepDirections(),
			a.layout.layoutGetCountries(),
			a.layout.layoutSetWrapper({header: "header_home", footer: "footer_home"}),
			a.articles.getArticles({
				"per-page": 10,
				sort: "popularity"
			}),
			a.home.getDoctors({
				"per-page": 10,
				...params,
				sort: "popularity",
			}),
			a.home.getReviews({
				"per-page": 10,
				fields: "id,name,country_flag,city,country,helpfulness,snippet,type,rating,clinic",
				sort: "newest"
			}),
			a.home.getDiagnotics({
				"per-page": 10,
				sort: "popularity",
				fields: "id,ame,alias,price"
			}),
			a.home.getOperations({
				"per-page": 10,
				sort: "popularity",
				fields: "id,name,alias,price"
			}),


			a.home.getClinics({
				"per-page": 10,
				sort: "popularity",
				fields: "name,alias,texts,city_name,country_name,images,rating_bookimed,reviews_avg_rating"
			}),
			a.home.getFaq(),
			a.home.getMedia(),
			a.home.getCoordinators(),
			a.home.getDirections(),
			a.home.getCountries()
		].map(e => dispatch(e));

		return Promise
			.all(mas)
			.then(() => {
				dispatch(a.layout.layoutSetFiltersCountriesDeep());
				dispatch(a.layout.layoutSetDirectionsDeep());
				dispatch(a.layout.layoutSetProceduresDeep());
				dispatch(a.layout.layoutSetCurrentCountry(serverData.client_country_id))
			});

	}

	componentWillMount() {
		const
			actions = this.props.actions,
			homeActions = this.props.homeActions,
			query = {...this.props.filters.query},
			fetched = this.props.home.clinics.fetched;

		actions.layoutSetWrapper({header: "header_home", footer: "footer_home"});
		actions.layoutSetWrapper({header: "header_home", footer: "footer_home"});

		if (!fetched) {
			actions.getArticles({sort: "popularity"});

			homeActions.getDoctors({"per-page": 10});
			homeActions.getReviews({"per-page": 10});
			homeActions.getDiagnotics({"per-page": 10, sort: "popularity"});
			homeActions.getOperations({"per-page": 10, sort: "popularity"});
			homeActions.getClinics({"per-page": 10, sort: "popularity"});
			homeActions.getFaq();
			homeActions.getMedia();
			homeActions.getCoordinators();
			homeActions.getDirections();
			homeActions.getCountries();
		}
	}

	componentWillUnmount() {
		this.props.actions.layoutSetWrapper({});

		window.scrollPositionsHistory = window.scrollPositionsHistory || {};
		window.scrollPositionsHistory['home'] = {
			scrollX: window.pageXOffset,
			scrollY: window.pageYOffset
		}
	}

	componentDidMount() {
		const action = this.props.location.action;
		if (window.scrollPositionsHistory && window.scrollPositionsHistory['home'] && action === "POP") {
			const {scrollX, scrollY} = window.scrollPositionsHistory['home'];

			window.scrollTo(scrollX, scrollY);
		}
	}

	render() {
		const
			{
				layout,
				actions,
				filters,
				articles,
				home: {
					doctors,
					reviews,
					clinics,
					operations,
					diagnostics,
					directions,
					media,
					faq,
					countries,
					coordinators
				}
			} = this.props,
			f = this.context.f;

		return (
			<Home>
				<Banner
					ref="banner"
					{...this.props} />
				<Steps
					layout={layout}
					filters={filters}
					changeCountry={actions.layoutSetCurrentCountry}
					showCallback={() => actions.showPopup("get_cost")}
					callback={actions.callback} />

				<Section>
					<Directions
						show={this.show}
						directions={directions}
						actions={actions} />
				</Section>

				<Section
					title={f(msg.t_countries)}>
					<Countries
						countries={countries} />
				</Section>

				<Section>
					<Clinics
						clinics={clinics} />
				</Section>

				<Section>
					<Doctors
						doctors={doctors}
						actions={actions} />
				</Section>

				<Section>
					<Reviews
						reviews={reviews}
						actions={actions} />
				</Section>

				<Section
					title={f(msg.t_procedures)}>
					<Procedures
						diagnostics={diagnostics}
						operations={operations}
						actions={actions} />
				</Section>

				<Articles
					className="section"
					title={f(msg.t_articles)}
					articles={articles}
				/>

				<Section
					title={f(msg.t_coordinators)}>
					<Coordinators
						coordinators={coordinators}
					  media={media} />
				</Section>

				<Section
					title={f(msg.t_faq)}>
					<FAQ faq={faq} />
				</Section>
			</Home>
		);
	}
}

HomeClass.childContextTypes = {
	msg: React.PropTypes.object
};

HomeClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
	store: React.PropTypes.object
};

export default connect(
	state => ({
		search: state.search,
		filters: state.filters,
		layout: state.layout,
		articles: state.articles.items,
		home: state.home,
		routing: state.routing,
	}),
	dispatch => ({
		actions: bindActionCreators({
			...actions.search,
			...actions.popup,
			...actions.articles,
			...actions.filters,
			...actions.layout
		}, dispatch),
		homeActions: bindActionCreators(actions.home, dispatch),
	})
)(HomeClass)
