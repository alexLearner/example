import React, {PureComponent} from 'react';
import { Link } from "react-router"
import { defineMessages } from 'react-intl';

const msg = defineMessages({
	treatment: {
		defaultMessage: "лечение",
		id: "treatment"
	},
	look: {
		defaultMessage: "Просмотреть",
		id: "search.country_btn.look"
	},
	profile: {
		defaultMessage: "по профилю ",
		id: "search.country_btn.profile"
	},
	in: {
		defaultMessage: "в",
		id: "in"
	},
	clinics: {
		defaultMessage: "{count} {count, plural, one {клиника} few {клиник} many {клиник} other {клиники}}",
		id: "search.item.clinics"
	}
});

export default class CountryBtn extends PureComponent {
	render() {
		const
			{f, pathnames: {search}} = this.context,
			{
				filters,
				country_id,
				filters_countries,
				count
			} = this.props,
			{
				illness = {},
				procedure = {},
				direction = {}
			} = filters;

		let
			country,
			link,
			text = " " + f(msg.treatment);

		if (filters.query.country || filters.query.procedure) return null;

		country = filters_countries.find(i => i.id === country_id) || {};
		link = `/${search}/country=${country.alias}/`;

		if (illness.name) {
			text = ` ${f(msg.treatment)} ` + illness.name_kogo.toLowerCase();
			link += `illness=${illness.alias}/`
		}
		else if (direction.name) {
			text =  " " + direction.name.toLowerCase();
			link += `direction=${direction.alias}/`
		}
		else if (procedure.name) {
			text =  " " + procedure.name.toLowerCase();
			link += `procedure=${procedure.alias}/`
		}

		return (
			<Link
				className="search_item_btn"
				to={link}>
					{f(msg.look)}&#160;
					<span>{f(msg.clinics, {count})}</span>
					&#160;{f(msg.profile)} -
					{text}
					&#160;{f(msg.in)}&#160;
					{country.name_gde}
			</Link>
		)
	}
}

CountryBtn.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};
