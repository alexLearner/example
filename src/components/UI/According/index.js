import React, { Component } from 'react'
import Popup from '../../../mixins/popup.js'
import cx from "classnames"

export default class According extends Popup {
	constructor( props ) {
		super ( props );

		let according_index = 0;
		if (~props.disabled && ~props.disabled.indexOf(0)) {
			according_index = 1;
			if (~this.props.disabled.indexOf(1)) {
				according_index = 2;
			}
		}

		this.state = {according_index};
		this.according_show = this.according_show.bind(this);
	}

	according_show(index) {
		this.setState({according_index: index === this.state.according_index ? -1 : index});
	}

	render() {
		let {list, tabs, disabled} = this.props;
		const {according_index} = this.state;

		list = list.map((item, index) => {
			return (
				<li 
					key={index}
					className={
						cx("according_list_item", [
							{"active" : according_index === index},
							{"disabled" : disabled && ~disabled.indexOf(index)}
						])
					}
					onClick={() => this.according_show(index)}
					>
					<div dangerouslySetInnerHTML={{__html: item}} />
					<i className="triangle" />
				</li>
			)
		});

		tabs = tabs.map((item, index) => {
			return (
				<div key={index} className={cx("according_tab", {"active": index === according_index})}>
					{list[index]}
					{item}
				</div>
			)
		});

		return (
			<div className="according">
				<ul className="according_list">
					{list}
				</ul>

				<div className="according_tabs">
					{tabs}
				</div>
			</div>
		)
	}
};
