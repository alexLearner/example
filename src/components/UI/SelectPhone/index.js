import React, { Component } from 'react'
import InputMixin from '../../../mixins/input'
import cx from "classnames"
import isEqual from "lodash/isEqual"

// --
// Use React.createClass for formsy-react mixins;
// --

const SelectPhone = React.createClass({
	mixins: [InputMixin],

	contextTypes: {pathnames: React.PropTypes.object},

	getInitialState() {
		const value = "+ " + this.props.layout.current_country.tel_code;

		return {
			selected: 0,
			visible: false,
			items: [this.returnItemsObj(this.props.layout.current_country)],
			value,
			max: 16,
			mounted: false
		}
	},

	componentDidMount() {
		document.body.addEventListener("click", this.handleDocumentClick);
		this.buildItems(this.props);
	},

	shouldComponentUpdate(nextProps, nextState) {
		if (!isEqual(nextState, this.state)) {
			return true;
		}

		const {layout: {countries}} = nextProps;
		if (!isEqual(countries, this.props.layout.countries)) {
			this.buildItems(nextProps);
			return true;
		}

		return false;
	},

	returnItemsObj(item) {
		const s_host = this.context.pathnames.s_host;

		return {
			img: s_host + "/resize_25x16" + item.img,
			help: `${item.name}`,
			value: `+ ${item.tel_code}`,
			county_code: item.country_code
		}
	},

	buildItems(props) {
		let selected;
		let items = props.layout.countries.map((country, index) => {
			if (country.id === props.layout.current_country.id) {
				selected = index;
			}

			return this.returnItemsObj(country);
		});

		this.setState({mounted: true, items, selected});
	},

	componentWillUnmount() {
		document.body.removeEventListener("click", this.handleDocumentClick)
	},

	handleDocumentClick(event) {
		if (!this.refs.container.contains(event.target)) {
			this.hide();
		}
	},

	active(selected, event) {
		event.preventDefault();
		event.stopPropagation();	

		const items = this.state.items;
		const value = items[selected].value;

		this.setState({selected, value});
		this.hide();

		if (this.props.onChange) {
			this.props.onChange(items[selected].county_code, true);
		}
	},

	change() {
		const
			value = this.refs.input.value,
			pattern = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g,
			test = pattern.test(value);

		if (test || value === "") {
			this.changeValue();
		}
	},

	toggle(event) {
		event.preventDefault();
		event.stopPropagation();
		this.setState({visible: !this.state.visible})
	},
	
	hide() {
		this.setState({visible: false})
	},

	keyDown(event) {
		let
			key = event.keyCode,
			focus = this.state.focus,
			count = this.items.length;

		// TOP UP
		if (key === 40 && focus < count) {
			this.setState({focus: focus + 1})
		}
		// ENTERа
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
	},

	render() {
		let
			api = this.state.items,
			{mounted, visible, selected} = this.state,
			selectedObj = api[selected],
			className = this.returnInputClassName("select_phone_input input"),
			options = [];

		if (visible) {
			options = api.map((option, index) =>
				<li
					key={index}
					className="select_phone_list_item"
					onClick={e => this.active(index, e)} >
					<img
						src={mounted ? option.img : null}
						alt="" />

					{option.value}
					<span>&#160;&#160;&#160;{option.help}</span>
				</li>
			);
		}


		const selectedJSX = selectedObj ? (
			<div>
				<img src={selectedObj ? selectedObj.img : ""} alt="" />
				{selectedObj.value}
			</div>
		) : <div />;

		return (
			<div
				className="popup_callback_field_container"
				ref="container">
				{
					<div className="select_phone_list">
						<div
							className="select_phone_list_head"
							onClick={this.toggle} >
							{selectedJSX}
							<i className="triangle" />
						</div>
						<ul className={cx("select_phone_list_dropdown", {"active": visible})}>
							{visible ? options : null}
						</ul>
          </div>
				}

				<input
					type="tel"
					className={className}
					value={this.getValue()}
					onChange={this.change}
					placeholder="1234567890"
					ref="input"
					name="phone" />
			</div>
		)	
	}
});

export default SelectPhone;
