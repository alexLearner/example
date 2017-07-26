import React, {PureComponent} from 'react';
import * as actions from '../../actions/';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ReviewForm, Breadcrumbs} from '../Widgets';
import DetailsContainer from './Container';
import transformParams from "../../functions/transformParams"
import transformQuery from "../../functions/transformQuery"
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import Cookie from "../../functions/Cookie"
import queryObjectByName from "../../utils/queryObjectByName"
import isEqual from "lodash/isEqual"

class Details extends PureComponent {
	constructor(props) {
		super(props);
		
		this.getClinicsCount = this.getClinicsCount.bind(this);
		this.scrollByHash = this.scrollByHash.bind(this)
	}

	static fetchData(store, {query, params}, {client_country_id: country_code}) {
		const
			dispatch = store.dispatch;

		let mas = [
			actions.layout.layoutGetDeepCountries(),
			actions.layout.layoutGetDeepProcedures(),
			actions.layout.layoutGetDeepDirections(),
			actions.layout.layoutGetCountries(),
			actions.details.getClinic(params.clinic),
			actions.details.detailsGetReviews(params.clinic, {"per-page": 10}),
			actions.details.detailsGetReviewsInfo(params.clinic, {"per-page": 10}),
			actions.details.detailsGetAccommodation(params.clinic, {"per-page": 10}),
			actions.details.detailsGetDoctors(params.clinic, {"per-page": 10}),
			actions.details.detailsGetProcedures(params.clinic),
		].map(e => dispatch(e));

		return Promise.all(mas).then(() => {
			query = transformParams(params, query);
			query = transformQuery(query, store);

			return Promise.all([
				dispatch(actions.layout.layoutSetFiltersCountriesDeep()),
				dispatch(actions.layout.layoutSetDirectionsDeep()),
				dispatch(actions.layout.layoutSetProceduresDeep()),
				dispatch(actions.layout.layoutSetCurrentCountry(country_code)),
				dispatch(actions.layout.layoutGetClinicsCount(params, true)),
				dispatch(actions.filters.setFilters(query))
			])
		})
	}

	getClinicsCount(params) {
		return this.props.actions.layoutGetClinicsCount(params, true);
	}

	componentWillMount() {
		if (canUseDOM) {
			window.scrollTo(0,0);
			this.props.actions.closePopup();
			this.props.actions.layoutGetDeepCountries();
 		}
	}

	shouldComponentUpdate(nextProps) {
		if (this.refs.container) {
			this.scrollByHash(this.props, nextProps);
		}

		return !isEqual(nextProps.details, this.props.details);
	}

	scrollByHash(props, nextProps) {
		let
			{hash} = props ? props.location : {},
			{hash: nextHash} = nextProps.location,
			indexOf = nextHash.indexOf("tab-");

		if (hash !== nextHash && ~indexOf) {
			nextHash = nextHash.replace("#tab-", "");
			this.refs.container && this.refs.container.goToTab(undefined, nextHash);
		}
	}

	componentDidMount(prevProps) {
		const params = this.props.params;
		if (window.__DETAILS__LOADED__ || !this.props.details.data) {
			this
				.props
				.actions
				.getClinic(this.props.routeParams.clinic)
				.then(() => {
					Cookie.push("tracking_clinic_ids", this.props.details.data.alias);

					let query = this.props.filters.query;
					query = transformParams(params, query);
					query = transformQuery(query, this.context.store);

					let obj = {
						procedure: query.procedure,
						direction: query.direction,
						city: query.city,
						country: query.country
					};

					if (query.illness) {
						obj.illness = query.illness
					}

					this.getClinicsCount(obj);
				})
		}
		else {
			Cookie.push("tracking_clinic_ids", this.props.details.data.alias);
		}
		
		window.__DETAILS__LOADED__ = true;
		this.scrollByHash(prevProps, this.props);
	}

	componentWillUnmount() {
		this.props.actions.layoutClearClinicsCount();
		this.props.actions.detailsClear()
	}

	render() {
		const
			{f} = this.context,
			{
				actions,
				location,
				layout,
				filters,
				details
			} = this.props,
			{fetched} = details;

		if (!fetched) return <div className="details_wrapper preloader"/>;
		const clinic = details.data;

		if (clinic && clinic.status == "404") {
			return (
				<div className="details_wrapper preloader active">
					<Breadcrumbs
						actions={actions}
						layout={layout}
						filters={filters}
						name={clinic.name} />

					<div>Клиника не найдена</div>

					<ReviewForm
						f={f}
						location={location}
						id={clinic.id}
						review_id={details.review_id}
						actions={actions} />
				</div>
			)
		}

		return (
			<div className="details_wrapper preloader active">
				<Breadcrumbs 
					actions={actions} 
					layout={layout}
					country_id={clinic.country_id}
					city_id={clinic.city_id}
					countriesBreadcrumbs={true}
					filters={filters} 
					name={clinic.name} />

				<DetailsContainer
					ref="container"
					item={clinic}
					{...this.props} />

				<ReviewForm 
					f={f}
					location={location}
					id={clinic.id} 
					review_id={details.review_id} 
					actions={actions} />
			</div>
		)
	}
}

Details.contextTypes = {
  f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
	store: React.PropTypes.object
};

export default connect(
	state => ({
		filters: state.filters,
		layout: state.layout,
		search: state.search,
		routing: state.routing,
		location: state.routing.locationBeforeTransitions,
		details: state.details,
	}),
	dispatch => ({
		actions: bindActionCreators({
			...actions.popup,
			...actions.search,
			...actions.filters,
			...actions.layout,
			...actions.details
		}, dispatch)
	})
)(Details)
