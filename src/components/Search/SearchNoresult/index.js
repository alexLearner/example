import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FormattedMessage, defineMessages, intlShape, injectIntl } from 'react-intl';
import * as actions from '../../../actions/'
import { bindActionCreators } from 'redux'

import SearchNoresultMsg from "./SearchNoresultMsg"

const msg = defineMessages({
	similar: {
		id: "search.noresult.similar",
		defaultMessage: "Выберите один из похожих запросов, или воспользуйтесь поиском"
	},
	all_country : {
		id: "filters.all_country",
		defaultMessage: "По всем странам"
	},
	all_city : {
		id: "filters.all_city",
		defaultMessage: "По всем городам"
	},
	all_illness : {
		id: "filters.all_illness",
		defaultMessage: "По всем болезням"
	},
	more_often : {
		id: "filters.more_often",
		defaultMessage: "Чаще всего ищут"
	},	
});

class SearchNoresult extends PureComponent {
	constructor( props ) {
		super ( props );

		this.getLink = this.getLink.bind(this);
	}

	componentDidMount() {
		if (!this.props.recommended) {
			this.props.actions.getRecommendedClinics(this.props.query);
		}
	}

	getLink(item, index, first = false) {
		const route = this.context.pathnames.search;

		return (
			<p key={index}>
				<Link
					to={first ? `/${route}/${item.params}/` : item.params}
					className="link">
					{item.text}&#160;
				</Link>
				<FormattedMessage
					defaultMessage="24 клиники"
					id="filters.clinics"
					values={{count: item.clinics_count}}
				/>
			</p>
		)
	}

	render() {
		let
			f = this.context.f,
			recommended = this.props.recommended,
			more_often_links = [],
			recommended_links = [];

		if (recommended && recommended.more_often && recommended.recommended) {
			more_often_links = recommended.more_often.map((e,i) => this.getLink(e,i));
			recommended_links = recommended.recommended.map((e,i) => this.getLink(e,i,true));
		}

		return (
			<div id="search_noresult">
				<div className="block">
					<h1 className="h1"><SearchNoresultMsg /></h1>
					<h2 className="h2">{f(msg.similar)}</h2>
					<div id="search_noresult_links">
						{recommended_links}

						{
							more_often_links ? (
								<div id="search_noresult_moreoften">
									<h4>{f(msg.more_often)}</h4>
									{more_often_links}
								</div>
							) : null  
						}
					</div>
				</div>
			</div>
		)
	}
};

export default connect(
	state => ({
		recommended: state.search.recommended,
		query: state.filters.query,
	}),
	dispatch => ({
		actions: bindActionCreators({
			...actions.popup,
			...actions.search
		}, dispatch)
	})
)(SearchNoresult)

SearchNoresult.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
	store: React.PropTypes.object
};