import React, {PureComponent} from 'react';
import SearchItem from './Item';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import SearchCompare from './Compare';
import SearchNoresult from './SearchNoresult';
import {FormattedMessage} from 'react-intl';
import * as actions from '../../actions/';
import {bindActionCreators} from 'redux';
import Filters from '../Filters/Filters';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import Articles from '../Widgets/Articles';
import queryObjectByName from "../../utils/queryObjectByName"
import Breadcrumbs from "../Widgets/Breadcrumbs"
import RecommendedArticle from '../Widgets/RecommendedArticle';
import isEqual from 'lodash/isEqual';
import transformParams from "../../functions/transformParams"
import Cookie from "../../functions/Cookie"
import forEach from "lodash/forEach"
import isEmpty from "lodash/isEmpty"
import Countries from "./Countries"
import msg from "./msg";
import Procedures from "../Home/Procedures"
import Directions from "../Home/Directions"

class Search extends PureComponent {
	constructor( props ) {
		super ( props );

		this.more = this.more.bind(this);
		this.update = this.update.bind(this);
		this.customRender = this.customRender.bind(this);
		this.buildSearch = this.buildSearch.bind(this);
		this.show = this.show.bind(this);
		this.saveScrollPosition = this.saveScrollPosition.bind(this);
	}

	static fetchData(store, {query, params}, serverData) {
		console.time(`SEARCH RESPONSE TIME ${serverData.pathname}`);
		const
			{
				client_country_id: country_code,
				pathname: url,
			} = serverData,
			d = store.dispatch,
			a = actions;

		query["per-page"] = query.page  * 10 || 10;
		query.flight_departure_country = country_code !== "EU" ? country_code : "UA";
		query = transformParams(params, query);

		let
			queryCountries = queryObjectByName(query, ["illness", "direction", "procedure"]),
			queryDirection = queryObjectByName(query, ["city", "country"]);

		query.page = 1;

		let mas = [
			a.layout.layoutGetDeepDirections(),
			a.layout.layoutGetDeepCountries(),
			a.layout.layoutGetDeepProcedures(),
			a.search.searchGetArticle(query),
			a.layout.layoutGetCountries(),
			a.search.searchGetCompare({
				current_country: query && query.country || 1,
				flight_departure_country: query.flight_departure_country || 47
			}),
			a.articles.getArticles(query),
			a.search.searchGetInfo(query),
			a.layout.layoutGetClinicsCount(query),
			a.search.getClinics({...query, expand: "similar_clinics"}),
		].map(e => d(e));

		if (!isEmpty(queryDirection)) {
			mas.push(d(a.layout.layoutGetProcedures(queryDirection)));
			mas.push(d(a.layout.layoutGetDirections(queryDirection)));
		}

		if (!isEmpty(queryCountries)) {
			mas.push(d(a.layout.layoutGetFiltersCountries(queryCountries)));
		}

		if (isEmpty(params)) {
			mas.push(d(a.search.searchGetCountries()))
		}

		if (query.country && query.illness) {
			mas.push(d(a.search.searchGetCountries(query)))
		}

		if (query.country) {
			mas.push(d(a.search.searchGetCities(query)));
		}

		if (query.country || query.city) {
			mas.push(d(a.search.searchGetDirections(query)));
		}

		if (query.direction || query.country || query.city || query.procedure) {
			mas.push(d(a.search.searchGetIllnesses(query)));
		}

		if (query.illness) {
			mas.push(d(a.search.searchGetOperations(query)));
			mas.push(d(a.search.searchGetDiagnotics(query)));
		}

		if (query.illness || query.direction || query.country) {
			mas.push(d(a.search.searchGetRecommendedArticle({...query, "per-page": 1})));
		}

		return Promise.all(mas).then(() => {
			if (isEmpty(queryDirection)) {
				d(a.layout.layoutSetProceduresDeep());
				d(a.layout.layoutSetDirectionsDeep());
			}

			if (isEmpty(queryCountries)) {
				d(a.layout.layoutSetFiltersCountriesDeep());
			}

			console.timeEnd(`SEARCH RESPONSE TIME ${serverData.pathname}`);

			return Promise.all([
				d(a.filters.setFilters(query)),
				d(a.filters.setFiltersAliases(query)),
				d(a.layout.layoutSetCurrentCountry(country_code))
			])
		}
		);
	}

	componentWillReceiveProps(nextProps) {
		const
			props = this.props,
			{
				location,
			} = props,
			currentPage = parseInt(location.query.page || 1),
			params = nextProps.params,
			nextQuery = {...nextProps.location.query},
			nextPage = parseInt(nextQuery.page),
			isNextPage = nextPage && currentPage !== nextPage;

		if (
			!isEqual(params, props.params)
			|| isNextPage
		) {

			const action = this.props.location.action;

			if (action === "PUSH" && !isNextPage) {
				this.props.actions.searchClear();
			}

			this.update(nextProps, isNextPage, true);
		}
	}

	update(nextProps = {}, update = false, updateAble = false) {
		let query =  nextProps.routing ? nextProps.routing.locationBeforeTransitions.query : {};

		const
			{params, actions: a} = nextProps,
			{page} = query,
			{recommended} = nextProps.search,
			search = nextProps.search.results;

		query['per-page'] = 10;
		if (!query.page) {
			query.page = 1;
		}

		if (updateAble || !(search && search.length || recommended)) {
			query = transformParams(params, query);
			let queryAlises = {...query};

			this.setCookie(query);

			if (update) {
				return a.getClinics({...query, expand: "similar_clinics"})
			}

			a.getClinics({...query, expand: "similar_clinics"}, true);

			a.layoutGetClinicsCount({
				illness: query.illness,
				procedure: query.procedure,
				direction: query.direction,
				city: query.city,
				country: query.country
			});

			a.searchGetCompare({
				current_country: query.country || 1,
				flight_departure_country: "ua"
			});

			if (isEmpty(params)) {
				a.searchGetCountries();
			}

			if (query.illness && query.country) {
				a.searchGetCountries(query);
			}

			if (query.country) {
				a.searchGetCities(query);
			}

			if (query.country || query.city) {
				a.searchGetDirections(query);
			}

			if (query.direction || query.country || query.city || query.procedure) {
				a.searchGetIllnesses(query)
			}

			if (query.illness) {
				a.searchGetOperations(query);
				a.searchGetDiagnotics(query);
			}

			if (query.illness || query.direction || query.country) {
				a.searchGetRecommendedArticle({...query, "per-page": 1});
			}

			a.getArticles(query);
			a.searchGetArticle(query);
			a.searchGetInfo(query);
			a.filtersClear();
			a.setFilters(query);
			a.setFiltersAliases(queryAlises);

			window.scrollTo(0,0);
		}
	}

	setCookie(query) {
		forEach(query, (value, key) =>
			Cookie.push("tracking_"+key+"_ids", value)
		);
	}

	more() {
		const location = this.props.location;
		let
			{pathname, query: {page}} = location,
			query = {};

		query.page = +page + 1 || 2;
		browserHistory.push({pathname, query});
	}

	show(q, modifier) {
		if (modifier) {
			this.refs.filter.changeModifier(modifier, q);
		}
		else {
			this.refs.filter.show(q)
		}
	}

	componentWillMount() {
		if (!canUseDOM) return;

		const isPush = this.props.location.action === "PUSH";

		this.update(this.props, false, isPush);
	}

	componentWillUnmount() {
		this.saveScrollPosition();
	}

	componentDidMount() {
		this.scrollPrev(this.props)
	}

	saveScrollPosition() {
		window.scrollPositionsHistory = window.scrollPositionsHistory || {};
		window.scrollPositionsHistory['search'] = {
			scrollX: window.pageXOffset,
			scrollY: window.pageYOffset
		}
	}

	scrollPrev(props) {
		if (!props) {
			props = this.props;
		}

		const action = props.location.action;
		window.__SEARCH__LOADED__ = true;

		document
			.getElementById('header')
			.classList
			.remove("hide");


		if (window.scrollPositionsHistory && window.scrollPositionsHistory['search'] && action === "POP") {
			const {scrollX, scrollY} = window.scrollPositionsHistory['search'];

			window.scrollTo(scrollX, scrollY);
		}
		else {
			window.scrollTo(0,0);
		}
	}

	buildSearch(noGen) {
		const {pathnames: {search: route}} = this.context;
		const queryAliases = {...this.props.filters.query_aliases};
		let link = ``;

		["page", "per-page", "flight_departure_country"].forEach(n =>
			delete queryAliases[n]
		);

		forEach(queryAliases, (value, key) =>
			!noGen.includes(key)
				? link = link + `${key}=${value}/`
				: null
		);

		return link;
	}

	customRender() {
		let
			directionTitle,
			countryTitle,
			illnessTitle,
			illnessSearch = this.buildSearch(["illness", "direction", "procedure"]),
			isOneLoad,
			procedureTitle,
			citiesTitle,
			search_text = "",
			illnessText;
		const
			{f, pathnames: {search: route}} = this.context,
			{
				layout,
				actions,
				search,
				filters,
				params,
			} = this.props,
			{
				fetch,
				results,
				fetch_more,
				page,
				page_count,
				info: search_info,
				diagnostics,
				operations,
				countries,
				recommended,
				directions,
				cities,
				illnesses,
				recommendedArticle,
				article: search_article
			} = search,
			{
				illness,
				query,
				direction,
				country,
				city,
				procedure
			} = filters;

		let
			isIllnessPage = !!query.illness,
			isDirectionPage = !!query.direction,
			isCountryPage = !!query.country,
			isCityPage = !!query.city,
			isProcedurePage = !!query.procedure,
			isRootPage = isEmpty(params);

		if (isIllnessPage) {
			illnessText = f(msg.popularity_dir_treatment, {name: illness.name_kogo});

			// console.log(illness, this.props.filters);
			if (isCountryPage) {
				countryTitle = f(msg.also_search_in_country, {name: illness.name_kogo});
			}
		}

		if (isDirectionPage) {
			illnessTitle = f(msg.search);
		}

		if (isProcedurePage) {
			procedureTitle = f(msg.lead_with, {name: procedure.name});
		}

		// console.log(country, city, direction);

		if (isCountryPage) {
			citiesTitle = f(msg.choose_clinic_by_city, {name: country.name_kogo});
			illnessTitle = f(msg.aslo_search_in, {name: country.name_gde});
			search_text = `country=${country.alias}/`;

			if (isCityPage) {
				search_text = search_text + `city=${city.alias}/`;
				directionTitle = f(msg.popularity_dir, {name: city.name_kogo});
				illnessTitle = f(msg.aslo_search_in, {name: city.name_gde});
			}

			else {
				directionTitle = f(msg.popularity_dir, {name: country.name_kogo});
			}
		}

		isOneLoad = ["illnesses", "countries", "cities", "recommendedArticle"]
			.find(elem => !isEmpty(search[elem].data));
		isOneLoad = (isOneLoad && (isCountryPage || isIllnessPage || isCityPage || isRootPage));

		let
			info = search_info.data,
			seo = this.props.seo,
			article = search_article.data;

		if (!recommended && (fetch || !results || !results.length)) {
			return (
				<div id="search">
					<Filters ref="filter" {...this.props} />

					<Breadcrumbs
						actions={actions}
						layout={layout}
						filters={filters}
						search={true}
						name="" />

					<div className="block">
						<div id="search_items" className="preloader"/>
					</div>
				</div>
			)
		}

		let
			length = results.length,
			items = results.map((item, index) =>
				<SearchItem
					item={item}
					key={index}
					layout={layout}
					filters={filters}
					actions={actions} />
			);

		if (info && info.data) {
			items.splice(3, 0,
				<div
					key="key"
					className="search_banner old_content">
					<div dangerouslySetInnerHTML={{__html: info.data}}/>
				</div>
			);
		}

		return (
			<div id="search">
				<Filters ref="filter" {...this.props} />

				<Breadcrumbs
					actions={actions}
					layout={layout}
					filters={filters}
					search={true}
					name="Поиск клиник" />

				<div className="block">
					<h1 className="search_h1">{seo && seo.h1}</h1>

					{
						article && article.data
							? <div
								className="search_header clinic-header-top content_old"
								dangerouslySetInnerHTML={{__html: article.data}}
							/>
							: null
					}

					{
						isOneLoad ? (
								<div className="countries section widget section_search">
									{
										isRootPage
											? <Countries {...countries} route={route} />
											: null
									}

									{
										isIllnessPage && isCountryPage
											? <Countries
												title={countryTitle}
												endSearch={`illness=${illness.alias}/`}
												{...countries}
												route={route} />
											: null
									}

									{
										!isIllnessPage && (isCountryPage || isCityPage)
										|| (isIllnessPage && !isCountryPage)
											? <Countries
												title={illnessTitle}
												{...illnesses}
												search={illnessSearch}
												name={procedureTitle ? "name_kogo" : undefined}
												param="illness"
												route={route} />
											: null
									}

									{
										isIllnessPage || isDirectionPage || isCountryPage
											?	<RecommendedArticle {...recommendedArticle} route={route} />
											: null
									}

									{
										isCountryPage ? (
												<Countries
													param="city"
													search={`country=${country.alias}/`}
													endSearch={isDirectionPage ? `direction=${direction.alias}/` : ""}
													title={citiesTitle}
													{...cities}
													route={route} />
											) : null
									}
								</div>
							) : null
					}

					<div
						id="search_items"
						className="preloader active">
						{items}
					</div>

					<div
						id="search_more"
						className={fetch_more ? "preloader" : "preloader active"} />

					{
						+page < +page_count
							? <div className="search_more" onClick={this.more}>
								<FormattedMessage
									id="search.load_more"
									defaultMessage="Загрузить еще {count} клиник"
									values={{count: 10}} />
							</div>
							: null
					}

					{
						isIllnessPage && (!isEmpty(diagnostics.data) && !isEmpty(operations.data))
							? <div
								className="section section_search">
								<div className="section_title">{illnessText}</div>
								<Procedures
									diagnostics={diagnostics}
									operations={operations}
									actions={actions}/>
							</div>
							: null
					}

					{
						isProcedurePage ? (
								<div className="countries section widget section_search">
									<Countries
										title={procedureTitle}
										{...illnesses}
										search={illnessSearch}
										name="name_kogo"
										column={true}
										param="illness"
										route={route} />
								</div>
							) : null
					}

					{
						(isCountryPage || isCityPage) && !(isIllnessPage || isDirectionPage)
							? <div className="section section_search">
								<div className="section_title">{illnessText}</div>
								<Directions
									search={search_text}
									title={directionTitle}
									show={this.show}
									directions={directions}
									actions={actions} />
							</div>
							: null
					}

					<SearchCompare {...this.props} />

					<Articles
						className="section section_search"
						articles={this.props.articles}
					/>


				</div>
			</div>
		)
	}

	render() {
		const {layout, filters, actions} = this.props;

		try {
			return this.customRender()
		}
		catch (e) {
			console.log(e);
			return (
				<div id="search">
					<Filters ref="filter" {...this.props} />

					<Breadcrumbs
						actions={actions}
						layout={layout}
						filters={filters}
						search={true}
						name="" />

					<SearchNoresult />
				</div>
			)
		}
	}
}

Search.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
	store: React.PropTypes.object
};

export default connect(
	state => ({
		search: {...state.search, headerSearch: undefined},
		filters: state.filters,
		articles: state.articles.items,
		layout: state.layout,
		routing: state.routing,
		seo: state.layout.seo,
	}),
	dispatch => ({
		actions: bindActionCreators({
			...actions.search,
			...actions.articles,
			...actions.popup,
			...actions.filters,
			...actions.layout
		}, dispatch)
	})
)(Search)