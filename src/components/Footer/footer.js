import React, { PureComponent } from 'react'
import { browserHistory } from 'react-router'
import {defineMessages } from 'react-intl';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../actions/'
import {SelectSearch, SVG} from "../UI"
import isEqual from "lodash/isEqual"

const msg = defineMessages({
	about: {
		id: "footer.about",
		defaultMessage: "О проекте"
	},
	who: {
		id: "footer.who",
		defaultMessage: "Кто такие Bookimed"
	},
	mail: {
		id: "footer.mail",
		defaultMessage: "Электронная почта"
	},
	coordinators: {
		id: "footer.coordinators",
		defaultMessage: "Координаторы"
	},
	cost: {
		id: "footer.cost",
		defaultMessage: "Стоимость услуг Bookimed"
	},
	add_clinic: {
		id: "footer.add_clinic",
		defaultMessage: "Добавить свою клинику"
	},
	specialisation: {
		id: "footer.specialisation",
		defaultMessage: "Специализации"
	},
	all_spec: {
		id: "footer.all_spec",
		defaultMessage: "Все специализации"
	},
	countries: {
		id: "footer.countries",
		defaultMessage: "Страны"
	},
	all_countries: {
		id: "footer.all_countries",
		defaultMessage: "Все страны"
	},
	faq: {
		id: "footer.useful",
		defaultMessage: "Полезное"
	},
	how_to_choose: {
		id: "footer.how_choose",
		defaultMessage: "Как выбрать клинику"
	},
	contacts: {
		id: "footer.contacts",
		defaultMessage: "Контакты"
	},
	preparation: {
		id: "footer.preparation",
		defaultMessage: "Подготовка к поездке"
	},
	cost_for_help: {
		id: "footer.cost_for_help",
		defaultMessage: "Цены и оплата за лечение"
	},
	go_to_ask: {
		id: "footer.go_to_ask",
		defaultMessage: "Задать вопрос"
	},
	write: {
		id: "footer.write",
		defaultMessage: "Если у вас возникли вопросы, позвоните или напишите нам:"
	},
	please_contact: {
		id: "footer.please_contact",
		defaultMessage: "Свяжитесь с нами любым удобным способом:"
	},
	line: {
		id: "footer.line",
		defaultMessage: "Гарячая линия поддержки"
	},
	callback: {
		id: "footer.callback",
		defaultMessage: "Заказать звонок"
	},
	location: {
		id: "footer.location",
		defaultMessage: "Местоположение"
	},
	lang: {
		id: "footer.lang",
		defaultMessage: "Язык"
	},
	is_ask: {
		id: "footer.is_ask",
		defaultMessage: "Возникли вопросы?"
	},
	"header.lists.faq": {
		id: "header.lists.faq",
		defaultMessage: "Часто задаваемые вопросы",
	},
	"header.lists.rating": {
		id: "header.lists.rating",
		defaultMessage: "Рейтинг инновационных клиник мира",
	},
	"header.lists.money": {
		id: "header.lists.money",
		defaultMessage: "10 способов собрать деньги на лечение",
	},
	"title_treatment" : {
		id: "header.lists.title_treatment",
		defaultMessage: "Лечение за рубежом"
	},
	about: {
		id: "header.lists.about",
		defaultMessage: "О проекте"
	}	
});

const list_spec = [
	{direction: 10},
	{direction: 3},
	{direction: 2},
	{direction: 38},
	{direction: 13},
];

let list_countries = [
	{country: 22},
	{country: 1},
	{country: 34},
	{country: 46},
	{country: 50}
];

let list_other = [];

class Footer extends PureComponent {
	constructor( props, {pathnames: {s_host}} ) {
		super( props );

		list_other = [
			{
				id: "header.lists.faq",
				url: `${s_host}/doc/voprosy-otvety`
			},
			{
				id: "header.lists.rating",
				url: `${s_host}/article/top-most-advanced-hospitals-in-the-world/`
			},
			{
				id: "header.lists.money",
				url: `${s_host}/article/10-sposobov-sobrat-dengi-na-lechenie-za-granicej/`
			}
		];

		let countries = this.returnCountries(props);
		let current_country = countries[1];
		countries = countries[0];

		this.setCountry = this.setCountry.bind(this);
		this.returnLists = this.returnLists.bind(this);
		this.callback = this.callback.bind(this);

		this.state = {
			mounted: false,
			current_country,
			countries
		}
	}

	returnCountries(props) {
		let current_country;
		return [props.layout.countries.map( country => {
			const {country_code, name} = country;

			if (name === props.layout.current_country.name) {
				current_country = country;
			}

			return {
				value: country_code,
				label: name
			}
		}), current_country]
	}

	
	componentWillReceiveProps(nextProps) {
		const value = this.props.layout.current_country.tel_lines[0];
		const nextValue = nextProps.layout.current_country.tel_lines[0];

		if (value !== nextValue) {
			this.setState({current_country: nextProps.layout.current_country});
		}

		if (!isEqual(nextProps.layout.countries, this.props.layout.countries)) {
			this.setState({countries: this.returnCountries(nextProps)[0]})
		}
	}

	shouldComponentUpdate({wrapperClassName, layout: {current_country, countries}}) {
		return (
			wrapperClassName !== this.props.wrapperClassName
			|| !isEqual(current_country, this.props.layout.current_country)
			|| !isEqual(countries, this.props.layout.countries)
		)
	}

	componentDidMount() {
		this.setState({mounted: true})
	}

	setCountry(val) {
 		this.props.actions.layoutSetCurrentCountry(val.value, true)
	}

	returnLists(mas) {
		const {
			f,
			pathnames: {search: route}
		} = this.context;

		const {
			countries: country,
			deepDirections: direction,
			deepIllnesses: illness,
			deepProcedures: procedure
		} = this.props.layout;

		const arrays = {country, direction, illness, procedure};

		return mas.map((item, index) => {
			if (item.url) {
				return (
					<li className="nav_dropdown_item" key={index}>
						<a
							href={item.url}>
							{f(msg[item.id])}
						</a>
					</li>
				)
			}

			const
				key = Object.keys(item)[0],
				id = item[key];

			if (!arrays[key]) return null;

			const
				elem = arrays[key].find(item => item.id === id),
				alias = elem && elem.alias || "";

			if (!elem) return null;

			return (
				<li className="nav_dropdown_item" key={index}>
					<a
						href={`/${route}/${key}=${alias}/`}
						onClick={(e) => {
							document.body.scrollTop = 0;
							e.preventDefault();
							browserHistory.push(`/${route}/${key}=${alias}/`)
						}}>
						{elem.name}
					</a>
				</li>
			)
		});
	}

	callback() {
		ga('send', 'event', 'Form',  'Button pressed', window.location.pathname);
		this.props.actions.showPopup("callback")
	}

	render() {
		const
			{f, pathnames: {s_host}} = this.context,
			className = this.props.wrapperClassName,
			{
				mounted,
				current_country = {},
				countries
			} = this.state,
			{layout} = this.props;
		let countriesJSX = this.returnLists(list_countries),
				spec = this.returnLists(list_spec),
				other = this.returnLists(list_other);

		// if (!current_country) return null;
		let phone = layout.current_country.tel_lines[0];

		if (className === "footer_home") {
			return (
				<footer id="footer" className={className}>
					<div className="footer_home_top block">
						<div className="footer_top_title">
							{f(msg.is_ask)}
						</div>
						<div className="footer_top_subtitle">
							{f(msg.please_contact)}
						</div>
					</div>

					<div className="footer_home_body block">
						<div className="footer_col">
							{f(msg.mail)}
							<a href="mailto:info@bookimed.com" className="link link_mail">info@bookimed.com</a>
						</div>

						<div className="footer_col">
							<p>{f(msg.line)}</p>
							<a href={`tel:${phone.replace(/[)(-]/g, "")}`} className="link_tel">{
								phone
									.replace("(", " (")
									.replace(")", ") " )
							}</a>
						</div>

						<div className="footer_col">
							<div
								onClick={() => this.props.actions.showPopup("callback")}
								className="btn btn_red">
								{f(msg.callback)}
							</div>
						</div>
					</div>


					{
						mounted ? (
							<div className="footer_bottom footer_home_bottom block">
								<div className="footer_left">
									<div className="footer_select_field mobile">
										{f(msg.location)} -
										<span
											onClick={() => this.props.actions.showPopup("popup_location")}>
										{" "+this.props.layout.country_name}
									</span>
									</div>

									<div className="footer_select_field">
										<p>{f(msg.location)}</p>
										<SelectSearch
											options={countries}
											className="select_bottom"
											value={current_country.country_code}
											searchable={true}
											onChange={this.setCountry}
										/>
									</div>
								</div>
								<div className="footer_right">
								</div>
							</div>

						) : null
					}
				</footer>
			)
		}

		return (
			<footer id="footer" className={className}>

				{
					mounted ? (
						<div className="footer_top">
							<div className="block">
								<ul className="nav_dropdown_list footer_list">
									<li className="nav_dropdown_title footer_list_title">
										<a href={`${s_host}/doc/about`}>
											<i className="triangle mobile" />
											{f(msg.about)}
										</a>
									</li>
									<li className="nav_dropdown_item">
										<a href={`${s_host}/doc/o-proekte`}>{f(msg.who)}</a>
									</li>
									<li className="nav_dropdown_item">
										<a href={`${s_host}/doc/contacts`}>{f(msg.contacts)}</a>
									</li>
									<li className="nav_dropdown_all">
										<a href={`${s_host}/LK/registration/`}>{f(msg.add_clinic)}</a>
									</li>
								</ul>
								<ul className="nav_dropdown_list footer_list">
									<li className="nav_dropdown_title footer_list_title">
										<i className="triangle mobile" />
										{f(msg.specialisation)}
									</li>
									{spec}
									<li className="nav_dropdown_all">
										<a href={`${s_host}/directions/`}>{f(msg.all_spec)}</a>
									</li>
								</ul>
								<ul className="nav_dropdown_list footer_list">
									<li className="nav_dropdown_title footer_list_title">
										<i className="triangle mobile" />
										{f(msg.countries)}
									</li>
									{countriesJSX}
									<li className="nav_dropdown_all">
										<a href={`${s_host}/countries/`}>
											{f(msg.all_countries)}
										</a>
									</li>
								</ul>
								<ul className="nav_dropdown_list footer_list">
									<li className="nav_dropdown_title footer_list_title">
										<i className="triangle mobile" />
										{f(msg.faq)}
									</li>
									{other}
									<li className="nav_dropdown_all">
										<a href={`${s_host}/articles`}>{f(msg.go_to_ask)}</a>
									</li>
								</ul>
							</div>
						</div>
					) : null
				}

				<div className="footer_body">
					<div className="block">
						<div className="footer_left">
							<p className="footer_help">{f(msg.write)}</p>
							<a href="mailto:info@bookimed.com" className="link link_mail">info@bookimed.com</a>
						</div>

						<div className="footer_right">
							<p>{f(msg.line)}</p>
							<a href={`tel:${phone.replace(/[)(-]/g, "")}`} className="link_tel">{
								phone
									.replace("(", " (")
									.replace(")", ") " )
							}</a>
							<div
								onClick={this.callback}
								className="btn btn_red">
								<i 
									className="icon icon_phone"
									dangerouslySetInnerHTML={{
										__html: SVG.phone
									}}
								/>
								{f(msg.callback)}
							</div>
						</div>  
					</div>
				</div>

				{
					mounted ? (
						<div className="footer_bottom">
							<div className="block">
								<div className="footer_left">

									<div className="footer_select_field mobile">
										{f(msg.location)} -
										<span
											onClick={() => this.props.actions.showPopup("popup_location")}>
											{" "+this.props.layout.country_name}
										</span>
									</div>

									<div className="footer_select_field">
										<p>{f(msg.location)}</p>
										<SelectSearch
											options={countries}
											className="select_bottom"
											value={current_country.country_code}
											searchable={true}
											onChange={this.setCountry}
										/>
									</div>
								</div>
								<div className="footer_right" />
							</div>
						</div>
					) : null
				}
			</footer>
		)
	}
}

export default connect(
	state => ({
		wrapperClassName: state.layout.wrapper.footer,
		layout: state.layout
	}),
	dispatch => ({
		actions: bindActionCreators({
			...actions.popup,
			...actions.layout
		}, dispatch)
	})
)(Footer)

Footer.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};