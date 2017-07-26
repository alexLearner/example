import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import cx from 'classnames';
import addElementFunc from '../../functions/elementStyles';
import {isMobile} from '../../functions/viewport';
import AlphabetControl from './AlphabetControl';
import SearchNoresultMsg from '../Search/SearchNoresult/SearchNoresultMsg';
import {browserHistory} from 'react-router';
import FiltersClose from './FiltersClose';
import FiltersChange from './FiltersChange';
import forEach from 'lodash/forEach';
import isString from 'lodash/isString';
import isEqual from 'lodash/isEqual';
import concat from 'lodash/concat';
import isEmpty from 'lodash/isEmpty';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import msg from "./FiltersMsg"
import SVG from "../UI/SVG"
import {FormattedMessage} from "react-intl"

const
		addElementStyles = addElementFunc("filters"),
		Overlay = tx([{ name: 'overlay', className: "popup_overlay" }, addElementStyles])('div'),
		Title = tx([{ name: 'title' }, addElementStyles])('div'),
		FilterLink = tx([{ name: 'link' }, addElementStyles])('span'),
		// Header = tx([{ name: 'header' }, addElementStyles])('span'),
		Clear = tx([{ name: 'clear' }, addElementStyles])('i'),
		// Input = tx([{ name: 'input', className: "input input_big" }, addElementStyles])('input'),
		Container = tx([{ name: 'container' }, addElementStyles])('div'),
		Lists = tx([{ name: 'lists' }, addElementStyles])('div'),
		ListsScroll = tx([{ name: 'lists_scroll' }, addElementStyles])('div'),
		List = tx([{ name: 'list' }, addElementStyles])('div'),
		Tabs = tx([{ name: 'tabs' }, addElementStyles])('ul'),
		TabItem = tx([{ name: 'tabs_item' }, addElementStyles])('li'),
		Footer = tx([{ name: 'footer' }, addElementStyles])('div');

const queryObjectByName = (obj, names) => {
	let result = {};

	names.forEach(name =>
		obj[name] ? result[name] = obj[name] : null
	);

	return result;
};

const
		TAB_TREATMENT = 0,
		TAB_PROCEDURES = 2,
		TAB_COUNTRY = 3,
		TAB_TREATMENT_OBJECT = {
			placeholder: msg.input_placeholder_treatment,
			names: "illnesses",
			query: ["direction", "illness"],
			secondName : "name_kogo",
			footerText : "Не нашли нужное заболевание?",
		},
		TAB_PROCEDURES_OBJECT = {
			placeholder: msg.input_placeholder_operation,
			names: ["diagnostics", "procedures"],
			query: ["direction", "procedure"],
			secondName : "name",
			footerText : "Не нашли нужную процедуру?",
		},
		TAB_COUNTRY_OBJECT = {
			placeholder: msg.input_placeholder_filters_countries,
			names: "cities",
			secondName : "name",
			query: ["country", "city"],
			footerText : "Не нашли нужную страну?",
		};


export default class FiltersClass extends PureComponent {
	constructor( props, {f} ) {
		super( props );

		this.toogle = this.toogle.bind(this);
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.changeModifier = this.changeModifier.bind(this);
		this.setNewData = this.setNewData.bind(this);
		this.change = this.change.bind(this);
		this.active = this.active.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.submit = this.submit.bind(this);
		this.blur = this.blur.bind(this);
		this.createArray = this.createArray.bind(this);
		this.returnItems = this.returnItems.bind(this);
		this.focus = this.focus.bind(this);
		this.reset = this.reset.bind(this);
		this.toogleDiagnostic = this.toogleDiagnostic.bind(this);
		this.resetAlphabet = this.resetAlphabet.bind(this);
		this.updateData = this.updateData.bind(this);

		TAB_TREATMENT_OBJECT.footerText = f(msg.treatment_footer);
		TAB_PROCEDURES_OBJECT.footerText = f(msg.procedures_footer);
		TAB_COUNTRY_OBJECT.footerText = f(msg.country_footer);

		let {
			filters_countries,
			directions,
			procedures
		} = props.layout;

		if (!(directions && directions.length)) {
			directions = props.layout.deepDirections;
		}

		let
			modifier = TAB_TREATMENT,
			activeItems = this.createArray(directions, TAB_TREATMENT_OBJECT);

		if (props.filters.query_aliases.procedure) {
			modifier = TAB_PROCEDURES;
			let modifierObject = modifier === TAB_TREATMENT ? TAB_TREATMENT_OBJECT
				: modifier === TAB_PROCEDURES
					? TAB_PROCEDURES_OBJECT
					: TAB_COUNTRY_OBJECT;
			activeItems = this.createArray(procedures, modifierObject, true)
		}

		this.state = {
			active: false,
			activeItems,
			items: undefined,
			q: undefined,
			data: undefined,
			footerText: f(msg.treatment_footer),
			placeholder: msg.input,
			modifier,
			hidden: undefined,
			object: undefined,
			elems: {
				[TAB_PROCEDURES]: procedures,
				[TAB_COUNTRY]: filters_countries,
				[TAB_TREATMENT]: directions,
			},
			reset: false,
			result: true,
			cache: {},
			firstInit: false,
			focused: false,
			headerElement: undefined,
			resetVisible: true,
			diagnostic: !!props.location.query.diagnostic
		}
	}

	initialCache({filters}) {
		let cache = {};
		const NAMES = {
			"direction": TAB_TREATMENT,
			"illness": TAB_TREATMENT,
			"procedure": TAB_PROCEDURES,
			"country": TAB_COUNTRY,
			"city": TAB_COUNTRY,
		};

		forEach(NAMES, (value, key) => {
			if (filters && filters[key] && filters[key].name) {
				cache[value] = filters[key].name;
			}
		});

		return cache;
	}

	reset() {
		this.props.actions.filtersClear();
		this.change("");
		this.setState({resetVisible: false, q: "", reset: true});
		this.updateData();
	}

	shouldComponentUpdate(nextProps, nextState) {
		const
			p = this.props,
			{filters, layout} = nextProps;

		if (!isEqual(filters.query_aliases, p.filters && p.filters.query_aliases)) {
			this.updateData(nextProps);
			return true;
		}

		return (
			!isEqual(layout.filters_countries, p.layout.filters_countries)
			|| !isEqual(layout.cities, p.layout.cities)
			|| !isEqual(layout.directions, p.layout.directions)
			// || !isEqual(nextProps.routing, p.routing)
			|| !isEqual(nextState, this.state)
		)
	}


	updateData(nextProps) {
		let props = this.props;

		if (!nextProps || isEmpty(nextProps.filters.query)) {
			props.actions.layoutGetFiltersCountries();
			props.actions.layoutGetDirections();
			props.actions.layoutGetProcedures();
			return;
		}

		let
			nextQuery = nextProps.filters.query,
			query = props.filters.query;

		if (
			nextQuery.illness !== query.illness
			|| nextQuery.direction !== query.direction
			|| nextQuery.procedure !== query.procedure
		) {
			const queryDirection = queryObjectByName(nextQuery, ["illness", "direction", "procedure"]);
			props.actions.layoutGetFiltersCountries(queryDirection)
		}

		if (
			nextQuery.city !== query.city
			|| nextQuery.country !== query.country
		) {
			const queryCountries = queryObjectByName(nextQuery, ["city", "country"]);
			props.actions.layoutGetProcedures(queryCountries)
			props.actions.layoutGetDirections(queryCountries)
		}
	}

	toogleDiagnostic() {
		this.setState({diagnostic: !this.state.diagnostic})
	}

	createArray(array, object, procedures) {
		let result = [];

		if (procedures) {
			return [concat(
				[{
					name: "",
					alias: "",
				}],
				array
			)]
		};

		const
				isStringObject = isString(object.names),
				titleName = object.query[0],
				innerName = object.query[1],
				names = object.names,
				titleObject = (item) => ({
					name: item.name,
					title: true,
					id: item.id,
					query: {
						[titleName]: item.alias
					},
				}),
				innerObject = (item, innerItem) => {
					let obj = {
						name: innerItem.name,
						id: innerItem.id,
						query: {
							[titleName]: item.alias,
							[innerName]: innerItem.alias
						},
					};

					if (titleName === "direction") {
						delete obj.query[titleName];
					}

					return obj;
				};

		if (isStringObject) {
			result = array.map(item =>
				concat(
					[titleObject(item)],
					item[names].map(innerItem => innerObject(item, innerItem))
				)
			)
		}

		else {
			forEach(names, key =>
				result = concat(
					result, 
					array.map(item =>
						concat(
							[titleObject(item)],
							item[key]
								? item[key].map( innerItem => innerObject(item, innerItem))
								: []
						)
					)
				)
			)
		}

		return result;
	}

	show(q, _modifier) {
		let modifier = _modifier;

		document.body.addEventListener("click", this.handleClick);
		document.body.classList.add("overflow");

		modifier = modifier ? modifier : TAB_TREATMENT;

		let obj = {
			active: true,
			modifier,
			q,
			reset: false,
			firstShow: true,
		};

		this.setState(obj, () => {
			document.getElementById("filters_container").scrollTop = 0;
			if (q) {
				this.change(q);
			}
		});
	}

	hide(reset = true) {
		document.body.classList.remove("overflow");
		document.body.removeEventListener("click", this.handleClick);
		const route = this.context.pathnames.search;

		if (this.state.reset && reset) {
			browserHistory.push(`/${route}/`)
		}

		this.setState({active: false, q: ""});
	}

	toogle() {
		this[!this.state.active ? "show" : "hide"]();
	}

	setNewData(modifier, fieldsObject, q) {
		let elem;
		const {
			filters_countries,
			directions,
			procedures
		} = this.props.layout;

		switch (modifier) {
			case TAB_PROCEDURES: {
				elem = procedures;
				break;
			}
			case TAB_TREATMENT: {
				elem = directions;
				break;
			}
			case TAB_COUNTRY: {
				elem = filters_countries;
				break;
			}
		}

		let activeItems = this.createArray(elem, fieldsObject, modifier === TAB_PROCEDURES);

		let obj = {
			activeItems,
			items: activeItems,
			object: fieldsObject,
			headerElement: undefined,
			...fieldsObject,
			modifier,
			q: !this.state.cache[modifier] ? "" : q
		};

		this.setState(obj)
	}

	changeModifier(modifier = TAB_TREATMENT, q) {
		if (this.refs.alphabet) {
			this.refs.alphabet.reset();
		}

		if (canUseDOM) {
			this.show(q, modifier);
		}

		switch (modifier) {
			case TAB_TREATMENT: {
				this.setNewData(TAB_TREATMENT, TAB_TREATMENT_OBJECT, q);
				break;
			}

			case TAB_PROCEDURES: {
				this.setNewData(TAB_PROCEDURES, TAB_PROCEDURES_OBJECT, q);
				break;
			}

			case TAB_COUNTRY: {
				this.setNewData(TAB_COUNTRY, TAB_COUNTRY_OBJECT, q);
				break;
			}
		}
	}

	submit(e) {
		e.preventDefault();
		this.refs.input.blur();
	}

	blur() {
		this.setState({focused: false});
	}

	active(e, link, {name: q}) {
		e.preventDefault();
		let cache = {...this.state.cache};

		delete cache[TAB_PROCEDURES];
		delete cache[TAB_TREATMENT];
		cache[this.state.modifier] = q;

		this.setState({resetVisible: true, cache});
		browserHistory.push(link);
		this.hide(false);
	}

	change(initialValue = "", alphabet = false) {
		FiltersChange
			.bind(this)
			(initialValue, alphabet);
	}

	handleClick(event) {
		const container = document.getElementById("filters_container");
		const block = document.getElementById("filters_header");

		if (!container.contains(event.target) && !block.contains(event.target)) {
      this.toogle();
    }
	}

	returnItems(items, firstInit = false, hiddenItems = false) {
		let
			{modifier, diagnostic} = this.state,
			filters = this.props.filters,
			search,
			query = {...filters.query_aliases},
			{pathnames: {search: route}} = this.context;

		if (this.props.routing.locationBeforeTransitions) {
			search = this.props.routing.locationBeforeTransitions.search
		}
		else {
			search = ""
		}

		const deleteQuery = names => forEach(names, name => delete query[name]);

		if (!items.length) {
			return (
				<div className="filters_not_found">
					<FormattedMessage
						defaultMessage="Ничего не найдено"
						id="filters.not_found"
					/>
				</div>
			)
		}

		deleteQuery([
			"per-page",
			"page",
			"flight_departure_country"
		]);

		if (firstInit) {
			let
				mas = [],
				q = items[0] && items[0][1] && items[0][1].query || {},
				isCountry = q.country,
				isCity = q.city,
				isProcedures = items[0] && items[0][1] && items[0][1].query === undefined,
				isIllness = q.illness,
				isDirection = q.direction;

			if (isProcedures || isIllness || isDirection) {
				mas = [
					"procedure",
					"illness",
					"direction",
				]
			}

			if (isProcedures) {
				modifier = TAB_PROCEDURES
			}

			if (isCity || isCountry) {
				mas = [
					"city",
					"country",
				]
			}

			deleteQuery(mas)
		}

		if (diagnostic) {
			query.diagnostic = true;
		}

		if (modifier === TAB_TREATMENT || modifier === TAB_PROCEDURES) {
			deleteQuery([
				"procedure",
				"illness",
				"direction",
			])
		}

		if (modifier === TAB_COUNTRY) {
			deleteQuery([
				"city",
				"country",
			])
		}

		const KEYS = [
			"country",
			"city",
			"direction",
			"illness",
			"procedure"
		];

		const renderElems = (innerItem, i, item, index) => {
			let itemQuery = {...innerItem.query, ...query};
			let link = `/${route}`;

			KEYS.forEach(key => itemQuery[key]
				? link = link + `/${key}=${itemQuery[key]}`
				: null
			);

			if (innerItem.alias) {
				link = link + `/procedure=${innerItem.alias || filters.query_aliases.procedure}`;
			}

			return (
				<a
					key={`${index}_${i}`}
					hidden={innerItem.hidden && !item[0].replace}
					onClick={e => this.active(e, link + "/" + search, innerItem)}
					href={link + "/" + search}
					className={!hiddenItems ? cx("filters_list_item", {"filters_list_item_title" : innerItem.title}) : null}
					dangerouslySetInnerHTML={{__html: innerItem.name}}
				/>
			)
		};

		return items.map((item, index) =>
			<List key={index}>
				{
					item.length && item.map((e, i) => renderElems(e, i, item, index))
				}
			</List>
		)
	}

	focus() {
		this.resetAlphabet();
		this.setState({focused: true});
	}

	resetAlphabet() {
		const active = this.refs.alphabet.state.active;

		if (active !== -1) {
			this.refs.alphabet.reset()
		}
	}

	render() {
		const
			{f} = this.context,
			count = this.props.search.count,
			layout = this.props.layout,
			{
				active,
				q,
				diagnostic,
				items,
				activeItems,
				modifier,
				result,
				resetVisible
			} = this.state,
			{filters_alphabet} = layout;
		let
			nextModifier = TAB_TREATMENT,
			{
				city = {},
				direction = {},
				country = {},
				illness = {},
				procedure = {},
			} = this.props.filters,
			treatment = illness.name ? !illness.name_exception : direction.name ? direction.name_exception : true ,
			country_title = f(msg.vector_country),
			city_title = city && city.name ? ` ${city.name_gde}, ` : "",
			suffix = !diagnostic && treatment ? f(msg.treatment) + " " : "" ,
			field = "name",
			fieldTitle = direction,
			direction_title;

		if (procedure.name) {
			suffix = "";
			field = "name";
			fieldTitle = procedure;
			nextModifier = TAB_PROCEDURES
		}

		if (country.name) {
			country_title =  city.name ? `${country.name} ` : `${country.name_gde} `;
		}

		if (direction.name) {
			field = treatment ? "name_kogo" : "name";
		}

		if (illness.name) {
			fieldTitle = illness;
			field = treatment ? "name_kogo" : "name";
		}

		direction_title = fieldTitle && fieldTitle[field] ? `${suffix}${fieldTitle[field]}` : f(msg.vector);

		const newItems = this.returnItems(
			items || activeItems,
			true
		);

		let hiddenItems = [];

		if (modifier === TAB_PROCEDURES) {
			hiddenItems.push(this.createArray(layout.filters_countries, TAB_COUNTRY_OBJECT));
			hiddenItems.push(this.createArray(layout.directions, TAB_TREATMENT_OBJECT));
		}
		else {
			hiddenItems.push(this.createArray(layout.filters_countries, TAB_COUNTRY_OBJECT));
			hiddenItems.push(this.createArray(layout.procedures, TAB_PROCEDURES_OBJECT, true))
		}

		hiddenItems = hiddenItems.map(value => this.returnItems(value, true, true));

		return (
			<div
				ref="filter"
				className={cx('filters', [
					{"active": active},
					{"filters_country": modifier === TAB_COUNTRY},
					{"filters_procedures": modifier === TAB_PROCEDURES}
				])
				}>
				<div className="block" id="filters_header">
					<FiltersClose close={this.hide} />
					
					{
						count && count !== "0" ? (
								<Title className="fitlers_title">
									{f(msg.i_find)}&#160;
									<FilterLink
										className="dotted"
										onClick={() => this.changeModifier(nextModifier)}
										>
										{direction_title}
									</FilterLink>
									&#160;
									<br />
									{f(msg.in)}
									&#160;
									<FilterLink
										className="dotted"
										onClick={() => this.changeModifier(TAB_COUNTRY)}
										>
										{city_title}
										{country_title}
									</FilterLink>
								</Title>
							) : <Title><SearchNoresultMsg /></Title>
					}
				
				</div>
				
				<Overlay active={active}/>

					<div hidden="hidden">
						{hiddenItems}
					</div>

					<Container id="filters_container" active={active}>
						{
							modifier !== TAB_COUNTRY ? (
									<Tabs>
										<TabItem
											onClick={() => this.changeModifier(TAB_TREATMENT)}
											active={modifier === TAB_TREATMENT}>
											{f(msg.illness)}
										</TabItem>
										<TabItem
											onClick={() => this.changeModifier(TAB_PROCEDURES)}
											active={modifier === TAB_PROCEDURES}>
											{f(msg.nav_procedure)}
										</TabItem>
									</Tabs>
								) : null
						}

						<form onSubmit={this.submit} className="relative">
							<input
								value={q}
								type="search"
								name="search"
								className="input input_big filters_input"
								ref="input"
								onBlur={this.blur}
								onFocus={this.focus}
								onChange={this.change}
								placeholder={f(this.state.placeholder)}
							/>

							<Clear
							  onClick={this.reset}
							  hidden={!resetVisible}
								>
								<img src={SVG.clear} alt="" />
							</Clear>
						</form>

						<AlphabetControl ref="alphabet" data={filters_alphabet} change={this.change} />

						<ListsScroll id="filters_lists_scroll">
							<Lists>
								{newItems}
								{
									!result ?
										<div className="filters_not_found">
											<FormattedMessage id="filters.not_found" defaultMessage="Ничего не найдено" />
										</div> : null
								}
							</Lists>
							<Footer>
								<span>{this.state.footerText}</span>
								<div
									onClick={() => this.props.actions.showPopup("callback")}
									className="btn btn_red"
									>
									{f(msg.ask_doctor)}
								</div>
							</Footer>
						</ListsScroll>
					</Container>
			</div>
		);
	}
}

FiltersClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
	store: React.PropTypes.object,
};
