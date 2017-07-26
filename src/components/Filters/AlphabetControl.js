import React, { PureComponent } from 'react'
import tx from 'transform-props-with'
import addElementFunc from "../../functions/elementStyles"
const addElementStyles = addElementFunc("filters");
const Control = tx([{ name: 'control' }, addElementStyles])('ul');
const ControlItem = tx([{ name: 'control_item' }, addElementStyles])('li');

export default class Aplhabet extends PureComponent {
	constructor( props ) {
		super( props );

		this.state = {active: -1};

		this.change = this.change.bind(this);
		this.reset = this.reset.bind(this);
		this.keyDown = this.keyDown.bind(this);
	}

	change(item, index) {
		this.props.change(item, true);
		this.setState({active: index})
	}

	keyDown(event, item, index) {
		const keyCode = event.keyCode;

		if (keyCode === 13) {
			this.change(item, index);
		}
	}

	reset() {
		this.change("", -1);
	}

	render() {
		let	alphabet = [];

		alphabet = this.props.data.map((item, index) => (
			<ControlItem 
				key={index} 
				role="button"
				tabIndex="0"
				onKeyDown={e => this.keyDown(e, item, index)}
				active={this.state.active === index}
				onClick={() => this.change(item, index)}
				>
				{item}
			</ControlItem>
		))

		return <Control>{alphabet}</Control>
	}

}