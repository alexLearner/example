import React, { Component } from 'react'
import { Link } from 'react-router'

export default class NavDropdown extends Component {
	constructor( props ) {
		super( props );

		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.toggle = this.toggle.bind(this);

		this.state = {
			active: false
		}
	}

	show() {
		this.setState({active: true});
	}

	hide() {
		this.setState({active: false});
	}

	toggle() {
		this.setState({active: !this.state.active});
	}


	render() {
		const className = this.state.active ? "active nav_item nav_dropdown" : "nav_item nav_dropdown";

		return (
			<div className={className}>
				<span className="nav_item_title" onClick={this.toggle}>
					{this.props.title}
					<i className="triangle_svg" />
				</span>
				<div className="nav_dropdown_overlay">
					<div className="nav_dropdown_overlay_close" onClick={this.hide} />
						<div hidden={!this.state.active} className="nav_dropdown_children">
							{ this.props.children }
						</div>
				</div>
			</div>
					
		)
	}
}