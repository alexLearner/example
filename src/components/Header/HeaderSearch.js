import React, { PureComponent } from 'react'
import { browserHistory } from 'react-router'
import SVG from "../UI/SVG/"
import cx from "classnames"
import forEach from "lodash/forEach"
import isEmpty from "lodash/isEmpty"
import isEqual from "lodash/isEqual"
import {defineMessages} from 'react-intl';

const msg = defineMessages({
	recent: {
		id: 'header_search.recent',
		defaultMessage: "Недавние запросы"
	},
	advanced: {
		defaultMessage: "header_search.advanced_search",
		id: "header_search.advanced_search"
	},
	result :{
		id: "header_search.result",
		defaultMessage: "Недавние запросы"
	},
	placeholder: {
		id: "header_search.placeholder",
		defaultMessage: 'Поиск по Bookimed',
	},
	illnesses: {
		id: "header_search.illnesses",
		defaultMessage: "Заболевания",
	},
	directions: {
		id: "header_search.directions",
		defaultMessage: "Направления",
	},
	procedures: {
		id: "header_search.procedures",
		defaultMessage: "Процедуры",
	},
	doctors: {
		id: "header_search.doctors",
		defaultMessage: "Врачи",
	},
	clinics: {
		id: "header_search.clinics",
		defaultMessage: "Клиники",
	}
});

let LINKS = {};

class Items extends PureComponent {
	constructor(props, {f}) {
		super(props);

		this.state = {
			more: false,
			max: 3
		};

		this.toggle = this.toggle.bind(this);
	}


	active(link, q, key, id) {
		if (key === "doctors") {
			this.props.action(id)
		}
		else {
			browserHistory.push(link);
		}

		this.props.active(q);
	}

	toggle() {
		this.setState({more: !this.state.more})
	}

	render() {
		const {title, data, q} = this.props;
		const {more, max} = this.state;
		if (!(data && data.length)) return null;

		return (
			<div className="header_search_items">
				<div className="header_search_title">
					{title}
				</div>
				<div className="header_search_links">
					{
						data.map((item, index) =>
							index < max && !more || more
								? <div
										key={index}
										className="header_search_item"
										onClick={
											() => this.active(`/${LINKS[q].route}/${LINKS[q].key}${item.alias}/`, item.name, q, item.id)
										}
								 		>
										{item.name}
									</div>
								: null
						)
					}

					{
						data.length > 3
							? <div
									onClick={this.toggle}
									className="header_search_more">
									Еще...
								</div>
							: null
					}
				</div>
			</div>
		)
	}
}

export default class HeaderSearch extends PureComponent {
	constructor( props, {f, pathnames} ) {
		super( props );

		const home = pathnames.home;

		this.timer = {};
		this.links = [
			{
				id: "advanced",
				url: "/advanced_search"
			},
		];

		LINKS = {
			illnesses: {
				route: home+"clinics",
				key: "illness=",
				title: f(msg.illnesses)
			},
			directions: {
				route: home+"clinics",
				key: "direction=",
				title: f(msg.directions)
			},
			procedures: {
				route: home+"clinics",
				key: "procedure=",
				title: f(msg.procedures)
			},
			doctors: {
				key: home+"doctor",
				title: f(msg.doctors),
				action: true
			},
			clinics: {
				key: "",
				route: home+"clinic",
				title: f(msg.clinics)
			}
		};

		this.change = this.change.bind(this);
		this.setFocus = this.setFocus.bind(this);
		this.focus = this.focus.bind(this);
		this.show = this.show.bind(this);
		this.toggle = this.toggle.bind(this);
		this.returnResult = this.returnResult.bind(this);

		this.state = {
			active: false,
			q: ""
		}
	}

	returnResult(array) {
		let result = [];

		forEach(array, (value, key) => {
			if (!isEmpty(value)) {
				result.push(
					<Items
						active={q => this.setState({q, active: false})}
						action={this.show}
						key={key}
						q={key}
						data={value}
						title={LINKS[key].title}
					/>
				)
			}
		});

		return result;
	}

	toggle() {
		this.setState({active: !this.state.active})
	}

	focus() {
		// const q = this.state.q;
		// if (q && q.length > 2) {
		// 	this.setState({active: true})
		// }
	}

	change(e) {
		let q = e.target.value;
		let obj = {q};
		let isCanVisible = q.length > 2;

		if (isCanVisible) {
			obj.active = true;
		}
		else {
			// if (!q.length) {
				// obj.active = false;
			// }
		}

		this.setState(obj, () => {
			this.props.actions.getSearch(q);
			// if (isCanVisible) {
			// 	clearTimeout(this.timer);
			// 	this.timer = setTimeout(this.props.actions.getSearch(q), 50);
			// }

		})

	}

	setFocus(e) {
		e.preventDefault();
		e.stopPropagation();
		this.refs.input.focus();
	}

	show(id) {
		this.props.actions.showDoctor(id, undefined);
	}

	render() {
		const f = this.context.f;
		const {active, q} = this.state;
		const {data} = this.props;
		let items = this.returnResult(data);

		return (
			<div className={
				cx(
					"header_search",
					[{"visibled active" : active}]
				)
			}>
				{ 
					active ? (
						<div className="header_search_overlay active" onClick={this.toggle} />
					) : <div className="header_search_overlay" />
				}

				<div className="header_search_head">
					<input 
						type="text" 
						onFocus={this.focus}
						value={q}
						className="header_search_input" 
						ref="input"
						onBlur={this.blur}
						onChange={this.change}
						placeholder={f(msg.placeholder)}/>
					<button
						onClick={this.toggle} 
						type="button" 
						className="header_search_btn">
						<i
							className="icon"
							dangerouslySetInnerHTML={{
								__html: SVG.search
							}}
						/>

					</button>
				</div>

				<div className={cx("header_search_hidden", {"active": active })}>
					{items}
				</div>
			</div>
		)
	}
}

HeaderSearch.contextTypes = Items.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
	store: React.PropTypes.object
};
