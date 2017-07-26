import React from 'react'

export default ({f, filters, text, reset}) => {
	const {direction, illness} = filters;
	let title;

	if (direction.name_komy) {
		title = `Лечение ${direction.name_komy}`
	}
	if (illness.name) {
		title = title + `, ${illness.name}`
	}

	return (
		<div className="details_filters_selected">
			{text}&#160;
			<span className="details_filters_selected_title">{title}</span>

			<span className="details_filters_selected_change">Изменить запрос</span>
		</div>
	)
}