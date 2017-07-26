import React, { PureComponent } from 'react'
import addElementFunc from "../../../functions/elementStyles"
import tx from 'transform-props-with'
const rt = addElementFunc("tooltip");

const Title = tx([{ name: 'title' }, rt])('div');
const Container = tx([{ name: 'container' }, rt])('div');

export default class TooltipClass extends PureComponent {
	constructor( props ) {
		super ( props );

		this.toogle = this.toogle.bind(this);
		this.click = this.click.bind(this);

		this.state = {active: props.active || false}
	}

	click(event) {
		const tooltip = this.refs.tooltip;

		if (tooltip && !tooltip.contains(event.target)) {
			this.toogle();
		}
	}

	toogle(e) {
		if (e) {
			e.stopPropagation();
			e.preventDefault();
		}

		if (!this.state.active) {
			document.body.addEventListener("click", this.click)
		}
		else {
			document.body.removeEventListener("click", this.click)
		}

		this.setState({active: !this.state.active});
	}

	render() {
		const {
			title,
			children,
			icon,
			className,
			triangle
		} = this.props;

		return (
				<div className={`tooltip ${className ? className : ""}`} ref="tooltip">
					<Title onClick={this.toogle}>
						{
							triangle ? (
									<a href="#" onClick={this.toogle} className="triangle"/>
								) : null
						}
						{
							icon ? (
									<img className="icon" src={icon} alt=""/>
								) : null
						}
						<span>{title}</span>
					</Title>
					{
						this.state.active ? (
								<Container active={true}>
									<i className="triangle" />
									{children}
								</Container>
							) : <Container />
					}
				</div>
		)
	}
};
