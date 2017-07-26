import React, { Component } from 'react'
import Popup from '../../mixins/popup.js'
import { defineMessages } from 'react-intl';
import cx from "classnames"

export default class PopupFiltersClass extends Popup {
	constructor( props ) {
		super ( props );

		this.keyDown = this.keyDown.bind(this);
		this.submit = this.submit.bind(this);
		this.change = this.change.bind(this);
		this.more = this.more.bind(this);
		this.returnItems = this.returnItems.bind(this);
		this.items = [];

		this.msg = defineMessages({
			cancel : {
				id: "popup.cancel",
				defaultMessage: "Отмена"
			},	
			choose_country : {
				id: "filters.choose_country",
				defaultMessage: "Выберите страну"
			}
		});

		this.state = {
			focus: -1,
			value: "",
		}
	}

	componentDidMount() {
		this.refs.input.focus();
	}

	keyDown(event) {
		let
			key = event.keyCode,
			focus = this.state.focus,
			count = this.items.length;

		// TOP UP
		if (key === 40 && focus < count) {
			this.setState({focus: focus + 1})
		}
		// ENTER
		if ( key === 13 ) {
			if (this.items[focus]) {
				this.submit(focus);
			}
			event.preventDefault();
			event.stopPropagation();
		}
		// ESC
		if ( key === 27 ) {
			this.setState({value: ""});
		}
		// BOT UP
		if (key === 38 && focus > 0) {
			this.setState({focus: focus - 1})
		}
	}

	change() {
		let
			value = this.refs.input.value,
			q = value.trim().toLowerCase(),
			sortItems = value
				? this.items.filter(elem => !!(~elem.name.toLowerCase().indexOf(q)))
				: undefined;

		this.setState({value, sortItems});
	}

	submit(focus) {
		let value = this.items[focus];

		this.props.actions.filtersSetCountry(value);
		this.props.actions.showPrevPopup()
	}

	returnItems(items, cb) {
		const
			{focus} = this.state,
			{pathnames: {s_host}} = this.context;

		return items.map((elem, index) =>
			<li
				className={cx("popup_country_item", {"focus": focus === index})}
				key={index}
				onClick={cb || (() => this.submit(index))}>
				{
					elem.img ? (
						<img
							src={s_host + elem.img}
							className="popup_country_item_img"
							alt="" />
					) : null
				}
				{elem.name && elem.name.length ? elem.name : elem.no_name}
				<span>{elem.clinics_count || ""}</span>
			</li>
		)
	}

};

