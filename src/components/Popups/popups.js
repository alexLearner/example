import React, {PureComponent} from 'react';
import {defineMessages, injectIntl} from 'react-intl';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../actions/';
import PopupFiltersCountry from './PopupFiltersCountry';
import PopupReview from './PopupReview';
import PopupReviews from './PopupReviews';
import PopupDoctor from './PopupDoctor';
import PopupDoctors from './PopupDoctors';
import PopupCallback from './PopupCallback';
import PopupProcedure from './PopupProcedure';
import PopupProcedures from './PopupProcedures';
import PopupSuccess from './PopupSuccess';
import PopupError from './PopupError';
import isEqual from "lodash/isEqual"

const msg = defineMessages({
	all_city : {
		id: "filters.all_city",
		defaultMessage: "По всем городам"
	},
	all_illness : {
		id: "filters.all_illness",
		defaultMessage: "По всем болезням"
	},
	all_direction : {
		id: "filters.all_direction",
		defaultMessage: "По всем направлениям"
	},
	placeholder_illness : {
		id: "filters.placeholder_illness",
		defaultMessage: "Выберите заболевание"
	},		
	placeholder_city: {
		id: "filters.placeholder_city",
		defaultMessage: "Выберите город"
	},
	placeholder_direction: {
		id: "filters.placeholder_direction",
		defaultMessage: "Выберите направление"
	}		
});

class Popups extends PureComponent {
	constructor( props ) {
		super ( props );

		this.filtersCitySubmit = this.filtersCitySubmit.bind(this);
		this.filtersSubmitIllness = this.filtersSubmitIllness.bind(this);
		this.filtersSubmitDirection = this.filtersSubmitDirection.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !isEqual(nextProps.popup, this.props.popup) || !isEqual(nextState, this.state);
	}

	componentWillReceiveProps() {
		this.refs.layout.scrollTop = 0;
	}

	filtersCitySubmit(items, focus) {
		let value = items[focus];

		this.props.actions.filtersSetCity(value);
		this.props.actions.showPrevPopup()
	}

	filtersSubmitIllness(items, focus) {
		let value = items[focus];

		if (!focus) {
			this.props.actions.showPrevPopup();
			this.props.actions.filtersSetIllness(value);
		}

		this.props.actions.filtersSetIllness(value);
		this.props.actions.showPopup("filters")
	}

	filtersSubmitDirection(items, focus){
		let value = items[focus];

		if (!focus) {
			this.props.actions.showPrevPopup();
			this.props.actions.filtersSetIllness(value);
		}

		this.props.actions.layoutGetIllness(value.id);
		this.props.actions.filtersSetDirection(value);
		this.props.actions.showPopup("filters_illness_inner")
	}

	render() {
		const f = this.props.intlF.formatMessage;
		let popup;
		let className = "layout_popup active";

		switch (this.props.popup.name) {
			case "filters_illness": 
				popup = <PopupFiltersCountry 
									submit={this.filtersSubmitDirection} 
									items={this.props.layout.directions}
									msg={f(msg.all_direction)} 
									placeholder={f(msg.placeholder_direction)}
									{...this.props} />
				break;


			case "filters_illness_inner": 
				popup = <PopupFiltersCountry 
									submit={this.filtersSubmitIllness} 
									items={this.props.layout.illness}
									illness={true}
									placeholder={f(msg.placeholder_illness)}
									msg={f(msg.all_illness)} 
									{...this.props} />;
				break;

			case "popup_lang": 
				popup = <PopupFiltersCountry type="language" {...this.props} />;
				break;

			case "popup_location": 
				popup = <PopupFiltersCountry type="location" {...this.props} />
				break;

			case "filters_city": 
				popup = <PopupFiltersCountry 
									submit={this.filtersCitySubmit} 
									items={this.props.layout.cities}
									placeholder={f(msg.placeholder_city)}
									msg={f(msg.all_city)} 
									{...this.props} />;
				break;

			case "filters_country": 
				popup = <PopupFiltersCountry {...this.props} />;
				break;

			case "reviews_all": 
				popup = <PopupReviews {...this.props} />;
				className="layout_popup active layout_popup_side";
				break;

			case "review": 
				popup = <PopupReview  {...this.props} />;
				className="layout_popup active layout_popup_side";
				break;

			case "doctor": 
				popup = <PopupDoctor {...this.props} />;
				className="layout_popup active layout_popup_side";
				break;

			case "doctors": 
				popup = <PopupDoctors  {...this.props} />;
				className="layout_popup active layout_popup_side";
				break;

			case "diagnostics_all": 
				popup = <PopupProcedures  {...this.props} />;
				className="layout_popup active layout_popup_side";
				break;

			case "diagnostic": 
				popup = <PopupProcedure  {...this.props} />;
				className="layout_popup active layout_popup_side";
				break;

			case "callback": 
				popup = <PopupCallback  {...this.props} />;
				break;

			case "get_cost": 
				popup = <PopupCallback get_cost={true}  {...this.props} />;
				break;

			case "get_consultation":
				popup = <PopupCallback get_consultation={true}  {...this.props} />;
				break;

			case "add_compare": 
				popup = <PopupFiltersCountry type="add_compare" {...this.props} />;
				break;

			case "success": 
				popup = <PopupSuccess {...this.props} />;
				break;

			case "error": 
				popup = <PopupError {...this.props} />;
				break;

			default:
				popup = undefined;
		}

		if ( popup ) {
			return (
				<div className={className} ref="layout">
					{popup}
				</div>
			)
		}
		else {
			return <div className="layout_popup" ref="layout" />
		}			
	}
};


const PopupsConnect = connect(
	(state, ownProps) => {
		return {
			popup: state.popup,
			search: state.search,
			filters: state.filters,
			layout: state.layout,
			routing: state.routing
		}
	},
	dispatch => {
		return {
			actions: bindActionCreators({
				...actions.search,
				...actions.filters,
				...actions.details,
				...actions.popup,
				...actions.layout
			}, dispatch)}
	}
)(Popups);

export default injectIntl(PopupsConnect, {
	intlPropName: "intlF"
})
