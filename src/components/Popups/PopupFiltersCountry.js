import React, {Component} from 'react';
import PopupFiltersClass from './PopupFiltersClass';

export default class PopupFiltersCountry extends PopupFiltersClass {
	constructor( props ) {
		super ( props );

		this.submitLocation = this.submitLocation.bind(this);
		this.submitCompare = this.submitCompare.bind(this);
		this.disabledCompare = this.disabledCompare.bind(this);
	}

	componentWillMount() {
		const {
			items,
			type,
			layout
		} = this.props;

		this.items = items ? [...items] : [...layout.deepCountries];

		if (type === "location") {
			this.items = [...layout.countries];
		}

		if (type === "add_compare") {
			this.disabledCompare()
		}
	}

	disabledCompare() {
		const {compare: c} = this.props.search;

		this.items = this.items.filter(({id}) => !c.find( ({country_id}) => country_id === id));
	}

	submitLocation(focus) {
		let items = this.state.sortItems || this.items;
		let val = items[focus];
 		this.props.actions.layoutSetCurrentCountry(val.id, true);
 		this.props.actions.closePopup();
	}

	submitCompare(focus) {
		let items = this.state.sortItems || this.items;
		let value = items[focus];

		const code = this.props.layout.current_country.country_code;

		this.props.actions.searchGetCompare({
			country: value.alias,
			current_country: this.props.filters.country.alias || 1,
			flight_departure_country: code || "ua"
		});

		this.props.actions.closePopup();
	}

	submit(focus) {
		const {type, submit} = this.props;

		if (submit) {
			submit(this.items, focus);
			return;
		}

		switch (type) {
			case "location":
				return this.submitLocation(focus);

			case "add_compare":
				return this.submitCompare(focus);

			case "language":
				return this.submitLanguage(focus);
		}
	}

	render() {
		const
			f = this.context.f,
			{value, sortItems} = this.state,
			items = this.returnItems(sortItems || this.items);

		return (
			<div className="region_popup">
	    	<div
			    className="popup_overlay"
			    onClick={this.props.actions.closePopup} />

	    	<div className="popup popup_filters">
	    		<div className="popup_container">
	    			<div className="popup_filters_head popup_filters_head_input">
	    				<input 
	    					type="text" 
	    					onChange={this.change} 
	    					ref="input"
	    					onKeyDown={this.keyDown}
	    					value={value}
	    					placeholder={this.props.placeholder || f(this.msg.choose_country)} 
	    					className="popup_filters_input" />

	    				{this.returnFilterClose()}	    					
	    			</div>

	    			<ul className="popup_country_list">
	    				{items}
	    			</ul>

	    		</div> 
	    	</div>
			</div>
		)
	}
};
