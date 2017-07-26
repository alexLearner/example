import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { defineMessages } from 'react-intl';

const msg = defineMessages({
	clinics: {
		id: "search.noresult.clinics",
		defaultMessage: "Клиники"
	},
	at_req: {
		id: "search.noresult.at_req",
		defaultMessage: "по запросу"
	},
	not_found: {
		id: "search.noresult.not_found",
		defaultMessage: "не найдены"
	},
	"in": {
		id: "in",
		defaultMessage: "в"
	}
});

const SearchNoresultMsg = (props, context) => {
	const filters = props.filters;
	const f = context.f;

	let req = f(msg.clinics);

	if (filters.illness && filters.illness.name || filters.direction && filters.direction.name) {
		req = `${req} ${f(msg.at_req)}`;
	}

	if (filters.illness && filters.illness.name) {
		req = `${req} ${filters.illness.name || filters.direction.name || ""}`;

		if (filters.country && filters.country.name) {
			req = `${req} ${f(msg.in)}`
		}
	}

	if (filters.country && filters.country.name) {
		req = `${req} ${filters.country.name_gde}`
	}  

	if (filters.city && filters.city.name) {
		req = `${req} (${filters.city.name})` 
	}

	req = `${req} ${f(msg.not_found)}`;

	return <span dangerouslySetInnerHTML={{__html: req}} />;
};

export default connect(
	state => ({filters: state.filters})
)(SearchNoresultMsg);

SearchNoresultMsg.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
	store: React.PropTypes.object
};
