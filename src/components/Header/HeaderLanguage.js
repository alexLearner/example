import React, { PureComponent } from 'react'
import { Link } from 'react-router'

export default class Language extends PureComponent {
	constructor( props ) {
		super( props );

	}

	render() {
		return (
			<div className="language">
				<div className="language_head">
					<i className="language_icon sprite sprite-rus" />
					RUS
					<i className="triangle" />
				</div>

				<ul className="language_dropdown">
					<li className="language_dropdown_item">
						<i className="language_icon sprite sprite-rus" />
						RUS
					</li>
					<li className="language_dropdown_item">
						<i className="language_icon sprite sprite-rus" />
						RUS
					</li>
				</ul>
			</div>
		)
	}
}

