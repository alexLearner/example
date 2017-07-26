import React, {PureComponent} from 'react';
import {Review} from '../../Places';
import Slider from "../../UI/Slider"
import { defineMessages } from 'react-intl';

const msg = defineMessages({
	title: {
		defaultMessage: "Популярные отзывы",
		id: "search.reviews.title"
	},

	more: {
		defaultMessage: "Смотреть все отзывы",
		id: "search.reviews.more"
	}
});

export default class SearchReviews extends PureComponent {
	constructor( props ) {
		super ( props );
		this.max = 10;
	}

	showReview(id) {
		const {ids} = this.props;
		this.props.actions.showReview(id, {ids});
	}

	render() {
		let items;
		const
				{
					reviews,
					search,
		      clinic: id,
					showAllReviews
				} = this.props,
				{
					f,
					pathnames: {clinics: route}
				} = this.context;

		if (!reviews) return null;

		items = reviews.map((review, i) =>
			i < this.max - 1 ? (
				<Review
					review={review}
					clinic_hidden={true}
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
					more={f(msg.more)}
					moreAction={showAllReviews}
					moreLink={`/${route}/${id}/reviews${search}`}
				/>
			</div>
		) 
	}
};

SearchReviews.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};

