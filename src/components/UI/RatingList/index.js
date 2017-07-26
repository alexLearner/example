import React, { PureComponent } from 'react'
import SVG from '../SVG'
import cx from 'classnames'
import Tooltip from "../Tooltip"
import RatingTooltip from "./RatingTooltip"

export default class RatingList extends PureComponent {
	constructor( props ) {
		super( props );

		this.click = this.click.bind(this);

		this.max = 5;
		this.state = {}
	}

	click(rating) {
		this.setState({rating});
	}

	render() {
		let items = [];
		let width;
		const {
			rating,
			rating_of_5,
			lang,
			disabled,
			rating_5,
			tooltip,
			link,
			small,
			id
		} = this.props;

		width = (rating / 10 * 100) + "%";
		if (rating_of_5) {
			width = (rating / 5 * 100) + "%"
		}
		if (rating_5) {
			width = (rating / 5 * 100) + "%"
		}
		
		for (let i=1; i <= this.max; i++) {
			items.push(
				<li
					key={i}
					className="rating_list_item"
					onClick={() => {!disabled ? this.click(i) : null}}
					dangerouslySetInnerHTML={{__html: SVG.star}}
				/>
			)
		}

		return (
			<div className={cx(
					"rating_list",
					{
						["disabled"]: disabled,
						["small"]: small
					}
			)}>
				<div className="rating_list_container">
					<ul>
						{ items }
					</ul>
					<ul className="rating_list_active"
						style={{width}}>
						{items}
					</ul>
				</div>
				<span className="rating_list_text">
					{
						tooltip ? (
								<Tooltip className="tooltip_rating" triangle={true}>
									<RatingTooltip lang={lang} id={id} rating={rating} link={link}/>
								</Tooltip>
								) : null
					}
					{rating}
					{rating_of_5 ? ` из 5` : null}
				</span>
			</div>
		)
	}

}
