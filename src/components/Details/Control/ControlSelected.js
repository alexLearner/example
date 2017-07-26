import React from 'react'
import forEach from "lodash/forEach"

export default ( {filters, onClick, active, queryLabels} ) => {
	const {direction, illness} = filters || {};

	let title = "";
	forEach(queryLabels, (value, key) => title = title + ` ${value},` );

	if (direction && direction.name) {
		title = title = title + ` ${direction.name},`
	}
	if (illness && illness.name) {
		title = title + ` ${illness.name},`
	}

	if (!title) return <div></div>;

	title = title.substring(0, title.length - 1);

	return (
		<div
			onClick={onClick} 
			className={ active ? "details_control_selected active" : "details_control_selected" }>
			{title}

			<div className="details_control_selected_close">
				<i className="icon_close"/>
			</div>
		</div>
	)
}
