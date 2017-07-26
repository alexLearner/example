import React, {PureComponent} from 'react';
import {Review} from '../../Places';
import Slider from "../../UI/Slider"
import {defineMessages} from 'react-intl';

const msg = defineMessages({
	title: {
		id: "home.titles.reviews",
		defaultMessage: "Отзывы о лечении за рубежом"
	}
});

export default class HomeReviews extends PureComponent {
	constructor( props ) {
		super ( props );
		this.max = 10;
	}

	showReview(id) {
		const ids = this.ids;
		this.props.actions.showReview(id, {ids});
	}

	render() {
		let items = [];
		const
			{
				reviews,
				clinic: id,
			} = this.props,
			{f} = this.context,
			{
				fetched,
				data
			} = reviews;

		this.ids = fetched && data.map(item => item.id);
		items = fetched && data.map((review, i) =>
			i < this.max - 1 ? (
					<Review
						review={review}
						key={i}
						show={() => this.showReview(review.id)}
					/>
				) : null
		);

		return (
			<div className="search_reviews">
				<Slider
					slides={items}
					title={f(msg.title)}
				/>
			</div>
		)
	}
};

HomeReviews.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};




