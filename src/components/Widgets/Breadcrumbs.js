import React,{PureComponent} from 'react'
import {FormattedMessage, defineMessages} from 'react-intl';
import {Link} from 'react-router';
import {isMobile} from "../../functions/viewport";
import forEach from "lodash/forEach"
import isEqual from "lodash/isEqual"
import tx from 'transform-props-with'

const Breadcrumbs = tx([{ className: "breadcrumbs" }])('div');
const msg = defineMessages({
	back: {
		id: "breadcrumbs.back",
		defaultMessage: "Вернуться к клиникам по запросу "
	},
	treatment_in: {
		id: "breadcrumbs.treatment_in",
		defaultMessage: "Лечение в {name}"
	}
});

class BreadcrumbsClass extends PureComponent {
	constructor(props) {
		super(props);

		this.buildData = this.buildData.bind(this);
		this.buildDataDetails = this.buildDataDetails.bind(this);

		this.state = {mounted: false}
	}

	componentDidMount() {
		this.setState({mounted: true})
	}

	shouldComponentUpdate({layout: {clinics_count}, filters: {query}}) {
		return (
			!isEqual(clinics_count, this.props.layout.clinics_count)
			|| !isEqual(query, this.props.filters.query)
		)
	}

	buildDataDetails() {
		let
			params,
			// home = this.context.pathnames.home,
			result = [{
				name: "Bookimed",
				params: "/",
			}],
			obj = {},
			{
				country_id,
				city_id,
				layout: {
					clinics_count,
					deepCountries: countries
				}
			} = this.props,
			{f, pathnames: {search: route}} = this.context,
			NAMES = [
				'country',
				'city'
			];

		params = `/`;

		obj.country = countries.find(({id}) => id == country_id);
		if (obj.country) {
			obj.city = obj.country.cities.find(({id}) => id === city_id);
		}

		NAMES.map(nameField => {
			const {name_gde, alias} = obj[nameField] || {};
			const count = clinics_count ? clinics_count[nameField] : undefined;

			if (obj[nameField]) {
				params = params + `${nameField}=${alias}/`;

				result.push({
					name: f(msg.treatment_in, {name: name_gde}),
					alias,
					params,
					count
				})
			}
		});

		result.push({name: this.props.name});

		return result;
	}


	buildData() {
		const
			f = this.props.filters.query_aliases,
			OBJECT = {
				direction: {
					direction: f.direction
				},
				procedure: {
					procedure: f.procedure
				},
				illness: {
					illness: f.illness
				},
				country: {
					country: f.country,
					illness: f.illness,
					direction: f.direction,
					procedure: f.procedure,
				},
				city: {
					country: f.country,
					city: f.city,
					illness: f.illness,
					procedure: f.procedure,
					direction: f.direction,
				},
			},

			NAMES = [
				'country',
				'city',
				'direction',
				'illness',
				'procedure',
			],
			ORDER = [
				'direction',
				'illness',
				'procedure',
				'country',
				'city'
			],
			{filters} = this.props,
			home = this.context.pathnames.home,
			{clinics_count} = this.props.layout || {};

		const genLink = (object) => {
			let params = "/";

			forEach(object, (value, key) =>
				value
					? params = params + `${key}=${value}/`
					: null
			);

			return params;
		};

		let
			params = "/",
			result = [
				{
					name: "Bookimed",
					params: "/",
				}
			],
			obj = {};

		NAMES.map(nameField => {
			const {name, name_komy, name_kogo, id, alias} = filters[nameField] || {};
			const count = clinics_count ? clinics_count[nameField] : undefined;

			if (name) {
				params = genLink(OBJECT[nameField]);

				obj[nameField] = ({
					name,
					name_komy,
					name_kogo,
					alias,
					params,
					count
				})
			}
		});

		ORDER.map(n => {
			let item = obj[n];
			if (!item) return;

			result.push({...item})
		});

		if (result.length === 1) {
			result.push({name: this.props.name});
		}

		return result;
	}

	render() {
		const
			{
				f,
				pathnames: {home, search: route}
			}  = this.context,
			{
				search,
				countriesBreadcrumbs
			} = this.props,
			mounted = this.state.mounted,
			data = !countriesBreadcrumbs ? this.buildData() : this.buildDataDetails(),
			items = data.map(({params, name, name_komy, count}, index) =>
				!params
					? <span key={index} className="black">{name}</span>
					: <Link to={
								params === "/" ? "/" + home : "/" + route + params
							}
			        className="breadcrumbs_item"
			        key={index}
						>
							{isMobile && mounted ? f(msg.back) + " " : null}
							{isMobile && mounted ? name_komy || name : name}
							{
								count
									? <FormattedMessage defaultMessage="24 клиники" id="filters.clinics" values={{count}}/>
									: count === 0
										? <FormattedMessage defaultMessage="Нет клиник" id="filters.no_clinics" />
										: <FormattedMessage defaultMessage="Главная" id="filters.main" />
							}
							<i className="triangle" />
						</Link>
			),

			checkElements = search ? items.length > 3 : items.length > 2;

		return (
			<Breadcrumbs>
				<div className="block">
					<div className="desktop">
						{items}
					</div>
					<div className="mobile">
						{
							checkElements
								? items[search ? items.length - 3 : items.length - 2]
								:
									search
										? <Link to={"/" + home} className="breadcrumbs_item">
											<FormattedMessage
												tagName="div"
												defaultMessage="Вернуться на главную"
												id="breadcrumbs.main" />
												<i className="triangle" />
											</Link>
										: <Link to={`/${route}/`} className="breadcrumbs_item">
												<FormattedMessage
													tagName="div"
													defaultMessage="Вернуться к поиску"
													id="breadcrumbs.back_main" />

												<i className="triangle" />
											</Link>
						}
					</div>
				</div>
			</Breadcrumbs>
		)
	}
}

BreadcrumbsClass.contextTypes = {
  f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};

export default BreadcrumbsClass