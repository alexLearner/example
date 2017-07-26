import React, { PureComponent } from 'react'
import RatingList from "./index"
import { FormattedMessage, defineMessages } from 'react-intl';
import {Link} from "react-router"
import DetailsService from "../../../api/DetailsService"

const DetailsAPI = new DetailsService();

const array = new Array(1,2,3,4,5);
const length = array.length;

const msg = defineMessages({
	title: {
		id: "rating.tooltip.title",
		defaultMessage: "Оценка пациентов"
	},
	show_all: {
		id: "rating.tooltip.show_all",
		defaultMessage: "Смотреть все отзывы ({count})"
	}
});

export default class RatingTooltip extends PureComponent {
	constructor(props) {
		super(props);

		this.getData = this.getData.bind(this);

		this.state = {
			fetched: false,
			data: undefined
		};
	}

	componentWillMount() {
		this.getData();
	}

	getData() {
		DetailsAPI
			.reviewsInfo(this.props.id, undefined, this.props.lang)
			.then(r => r.json)
			.then(data => this.setState({
				data: data,
				fetched: true
			}));
	}

	render() {
		const
			f = this.context.f,
			{link} = this.props,
			{fetched, data} = this.state;
		let dataObj = {};

		if (!fetched) return <div className="preloader rating_tooltip"/>;
		const visible = !!data.values;

		if (!visible) return null;

		data.values.forEach(
			({value, count}) => dataObj[--value] = {value, count}
		);

		return (
				<div className="rating_tooltip rating_tooltip active">
					<div className="rating_tooltip_title">
						{f(msg.title)}
					</div>
					<div className="rating_tooltip_head">
						<RatingList
							rating_of_5={true}
							rating={data.medium.toFixed(1)}/>
					</div>

					<div className="rating_tooltip_container">
						{
							array.map((item, index) => (
									<div className="rating_tooltip_field" key={index}>
										<RatingList
											rating_5={true}
											small={true}
											rating={(length - index++).toFixed(1)}
										/>
										{
											!dataObj[length - index] ? "-" : (
												<Link className="link" to={link}>
													<FormattedMessage
														id="details.reviews"
														defaultMessage="отзывов"
														values={{
															count: dataObj[length - index].count
														}} />
												</Link>
											)
										}
									</div>
							))
						}

						<div className="rating_tooltip_footer">
							<Link className="link" to={link}>
								{f(msg.show_all, {count: data.count})}
							</Link>
						</div>
					</div>
				</div>
		)
	}
}

RatingTooltip.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};

