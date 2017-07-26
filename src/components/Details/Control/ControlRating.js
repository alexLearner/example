import React,{PureComponent} from 'react'
import tx from 'transform-props-with';
import addElementFunc from "../../../functions/elementStyles";
import msg from "./msg"

const rc = addElementFunc("details_control");

const 
	RatingBar = tx([{ name: 'rating_bar' }, rc])('div'),
	RatingField = tx([{ name: 'rating_field' }, rc])('div');
	
export default ( props ) => {
	const
		data = props.data.data || {},
		countItem = data.count,
		{
			reset,
			rating,
			f
		} = props;

	if (rating) {
		return (
			<div
				onClick={reset}
				className="details_control_selected details_control_rating_selected active">
				{f(msg.reviews_rating_with, {value: rating})}
				<div className="details_control_selected_close">
					<i className="icon_close" />
				</div>
			</div>
		)
	}

	if (!(data.values && data.values.length)) return null;

	const items = data.values.map(({value, count}, index) => {
		const proc = (Math.abs(count/countItem) * 100).toFixed(0);
		return (
			<RatingField key={index}>
				<div>
					<p
						className="blue"
						onClick={() => props.onClick({value})}
						>
						{f(msg.reviews_rating_with, {value})}
					</p>
					<span>{proc ? proc + "%" : "-"}</span>
				</div>
				<RatingBar style={{width: proc + "%"}} />
			</RatingField>
		)
	});

	return (
		<div>
			{items}
		</div>
	)
}
