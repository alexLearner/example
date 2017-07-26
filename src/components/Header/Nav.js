import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import NavDropdown from "./NavDropdown"
import {SVG} from "../UI"
import { FormattedMessage, defineMessages } from 'react-intl';

const msg = defineMessages({
	location: {
		id: "footer.location",
		defaultMessage: "Местоположение"
	},
	lang: {
		id: "footer.lang",
		defaultMessage: "Язык"
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
		defaultMessage: "О нас"
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


export default class Nav extends Component {
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

		this.state = {visibled: false};

		this.handleClick = this.handleClick.bind(this);
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this)
	}

	componentDidMount() {
		window.addEventListener("touchstart", this.handleClick);
		window.addEventListener("click", this.handleClick);
		this.setState({mounted: true});
	}
	componentWillUnmount() {
		window.removeEventListener("touchstart", this.handleClick);
		window.removeEventListener("click", this.handleClick);
	}

	returnLists(mas) {
		const
			{
				f,
				pathnames: {search: route}
			} = this.context,
			{
				countries: country,
				deepDirections: direction,
				deepIllnesses: illness,
				deepProcedures: procedure
			} = this.props.layout,
			arrays = {country, direction, illness, procedure};

		return mas.map((item, index) => {
			if (item.url) {
				return (
					<li className="nav_dropdown_item" key={index}>
						<a href={item.url}>
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
							this.refs.dropdown.hide();
							browserHistory.push(`/${route}/${key}=${alias}/`)
						}}>
						{elem.name}
					</a>
				</li>
			)
		});
	}

	handleClick(event) {
		if (!this.refs.nav.contains(event.target)) {
      this.hide();
    }
	}

	componentWillReceiveProps(next){
		const props = this.props;

		if (next.routing.locationBeforeTransitions.query !== props.routing.locationBeforeTransitions.query) {
			this.hide();		
		}
	}

	show() {
		this.setState({visibled: true});
	}

	hide() {
		this.setState({visibled: false});
	}

	render() {
		const
				{
					f,
					pathnames: {s_host, home}
				} = this.context,
				className = this.state.visibled ? "nav_container active" : "nav_container",
				indexCountry = this.props.layout.current_country_index,
				{countries, current_phone} = this.props.layout,
				mounted = this.state.mounted;


		let countriesJSX = this.returnLists(list_countries),
				spec = this.returnLists(list_spec),
				other = this.returnLists(list_other);

		this.phone = current_phone ? current_phone[0] : null;

		return (
			<nav className="nav" ref="nav">
				<div
					className="nav_title_wrap"
					onClick={this.show}>
					<span className="nav_title" />
				</div>
				<div className={className}>
					<div className="nav_logo">
						<Link
							to={"/" + home}
							className="icon"
							dangerouslySetInnerHTML={{__html: SVG.logo}}
						/>
					</div>
					<div className="nav_container_lists">
						<NavDropdown
							ref="dropdown"
							title={f(msg.title_treatment)}>
							<div className="nav_dropdown_container">
								<ul className="nav_dropdown_list">
									<li className="nav_dropdown_title">
										<FormattedMessage
											id="header.lists.specialization"
											defaultMessage="Специализации" />
									</li>
									{spec}
									<li className="nav_dropdown_all">
										<a href={`${s_host}/directions/`}>
											<FormattedMessage
												id="header.lists.all_specialization"
												defaultMessage="Смотреть все специализации" />
										</a>
									</li>
								</ul>
								<ul className="nav_dropdown_list">
									<li className="nav_dropdown_title">
										<FormattedMessage
											id="header.lists.country"
											defaultMessage="Страны" />
									</li>
									{countriesJSX}
									<li className="nav_dropdown_all">
										<a href={`${s_host}/countries/`}>
											<FormattedMessage
												id="header.lists.all_country"
												defaultMessage="Смотреть все страны" />
										</a>
									</li>
								</ul>

								<ul className="nav_dropdown_list">
									<li className="nav_dropdown_title">
										<FormattedMessage
											id="footer.useful"
											defaultMessage="Полезное" />
									</li>
									{other}
									<li className="nav_dropdown_all">
										<a href={`${s_host}/articles`}>
											<FormattedMessage
												id="header.lists.go_ask"
												defaultMessage="Задать вопрос" />
										</a>
									</li>
								</ul>

							</div>
						</NavDropdown>
						<a href={`${s_host}/doc/o-proekte`} className="nav_item">
							<span className="nav_item_title">{f(msg.about)}</span>
						</a>
					</div>

					{
						mounted ? (
								<div className="nav_footer">
									<div className="nav_footer_head">
										<FormattedMessage
											tagName="p"
											defaultMessage="Гарячая линия поддержки"
											id="footer.line"/>
										<a
											href={`tel:${this.phone}`}
											className="link_tel">
											{this.phone}
										</a>
										<div
											onClick={() => this.props.actions.showPopup("callback")}
											className="btn btn_red"
										>
											<div className="icon"
											     dangerouslySetInnerHTML={{
												     __html: SVG.phone
											     }}
											/>
											<FormattedMessage
												defaultMessage="Перезвоните мне"
												id="footer.callback"/>
										</div>
									</div>

									<div className="nav_footer_bottom">
										<div
											onClick={() => this.props.actions.showPopup("popup_location")}
											className="nav_footer_select_field">
											{f(msg.location)} -&#160;
											{countries[indexCountry] && countries[indexCountry].name}
										</div>
									</div>

								</div>
							) : null
					}
				</div>
				<div
					className="nav_overlay mobile"
					onClick={this.hide}/>
			</nav>
		)
	}
}

Nav.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};