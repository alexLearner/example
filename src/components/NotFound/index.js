import React, { PureComponent } from 'react'
import { Link } from 'react-router'
import { defineMessages } from 'react-intl';
import * as actions from '../../actions/'
import queryObjectByName from "../../utils/queryObjectByName"

const msg = defineMessages({
	title: {
		id: "not_found.title",
		defaultMessage: "К сожалению, такой страницы не существует"
	},
	search_apply: {
		id: "not_found.search_apply",
		defaultMessage: "Воспользуйтесь,"
	},
	search_move: {
		id: "not_found.search_move",
		defaultMessage: "Перейдите на"
	},
	main: {
		id: "not_found.main",
		defaultMessage: "главную"
	}
});

export default class NotFound extends PureComponent {
	constructor( props ) {
		super ( props );
	}


	static fetchData({dispatch}, {query, params}, {client_country_id}) {
		const
			queryCountries = queryObjectByName(query, ["illness", "direction", "procedure"]),
			queryDirection = queryObjectByName(query, ["city", "country"]),
			a = actions;

		let mas = [
			a.layout.layoutGetFiltersCountries(queryCountries),
			a.layout.layoutGetDeepCountries(),
			a.layout.layoutGetDeepProcedures(),
			a.layout.layoutGetDeepDirections(),
			a.layout.layoutGetDirections(queryDirection),
			a.layout.layoutGetProcedures(queryDirection),
			a.layout.layoutGetCountries(),
			a.layout.layoutGetDirections(),
			a.layout.layoutGetProcedures()
		].map(e => dispatch(e));

		return Promise
			.all(mas)
			.then(() =>
				Promise.all([
					dispatch(a.filters.setFilters(query)),
					dispatch(a.layout.layoutSetCurrentCountry(client_country_id)),
				])
			)
	}

	componentDidMount() {
		if (ga) {
			ga('send', 'event', 'Error page', 404, window.location.pathname);
		}

		window.scrollTo(0,0);
		document
			.getElementById('header')
			.classList
			.remove("hide")
	}

	render() {
		const
			{ f, pathnames: {search: route} } = this.context;

		return (
			<div id="p_404">
				<h1 id="p_404_number">404</h1>
				<h2 id="p_404_title">{f(msg.title)}</h2>
				<h3 id="p_404_subtitle">
					{f(msg.search_move)}
					&#160;
					<Link to="/" className="link">{f(msg.main)}</Link>
				</h3>
			</div>
		) 
	}
};

NotFound.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};