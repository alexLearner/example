import React, {PureComponent} from 'react';
import {RatingList, Rating, Tooltip, SVG} from '../../UI';
import {Review, Doctor} from '../../Places';
import tx from 'transform-props-with';
import {Link} from "react-router"
import addElementFunc from '../../../functions/elementStyles';
import DetailsSlider from "../../UI/Slider"
import msg from "./msg"

const
	rc = addElementFunc("details_banner"),
	Banner = tx([{ className: "details_banner" }])('section'),
	Body = tx([{ name: 'body' }, rc])('div'),
	Header = tx([{ name: 'header' }, rc])('header'),
	Footer = tx([{ name: 'footer' }, rc])('footer'),
	Title = tx([{ name: 'title' }, rc])('div');

export default class DetailsBanner extends PureComponent {
	constructor(props) {
		super(props);

		this.showReview = this.showReview.bind(this);
		this.showDoctor = this.showDoctor.bind(this);
		this.reviews_ids = [];
	}

	showReview(id) {
		this.props.actions.showReview(id, {ids: this.reviews_ids});
	}

	showDoctor(index, id) {
		this.props.actions.showDoctor(
			id,
			undefined,
			{index: index, clinic_id: this.props.item.id}
		);
	}

	render() {
		let doctorsJSX, reviewsJSX;
		const
			{
				item,
				footer,
				search
			} = this.props,
			{f, pathnames: {clinics: route}} = this.context,
			{
				popularity_reviews,
				popularity_doctors,
				rating_bookimed,
				reviews_avg_rating,
				reviews_count,
				alias
			} = item,
			general = rating_bookimed ? rating_bookimed.general : {},
			rating_text = general.content,
			rating = general.count * 10;

		if (popularity_reviews && popularity_reviews.length) {
			reviewsJSX = popularity_reviews.map((review, index) => {
				this.reviews_ids.push(review.id);

				return <Review
					key={index}
					show={() => this.showReview(review.id)}
					review={review}
				/>
			});
		}
		else if (popularity_doctors && popularity_doctors.length) {
			doctorsJSX = popularity_doctors.map((doctor, index) => (
				<Doctor key={index} show={() => this.showDoctor(index, doctor.id)} doctor={doctor}/>
			));
		}

		return (
			<Banner>
				<Header>
					{
						reviews_avg_rating ? (
								<div className="size1of2">
									<Title>{f(msg.rating_avg)}</Title>
									<RatingList
										disabled
										rating_5={true}
										rating={reviews_avg_rating} />
									<Link
										to={`/${route}/${alias}/${search}#tab-reviews`}
										className="link">
										{f(msg.reviews, {count: reviews_count})}
									</Link>
								</div>
						) : null
					}

					{
						rating ? (
								<div className="size1of2 details_banner_right">
									<Title>{f(msg.rating_bookimed)}</Title>
									<Tooltip
										title={
											rating_text + " " + rating.toFixed(1)
										}
										className="tooltip_right tooltip_link">
										<Rating
											rating_alltime_visible={true}
											rating={rating_bookimed.general.count * 10}
											rating_bookimed={rating_bookimed}
											rating_help="true"
											className="search_item_head_rating rating_alltime_visible" />
									</Tooltip>
								</div>
							) : null
					}
				</Header>

					{
						reviewsJSX
							? <Body>
									<DetailsSlider
										more={f(msg.show_all_reviews)}
										moreLink={`/${route}/${alias}/${search}#tab-reviews`}
										title={f(msg.popularity_reviews)}
										slides={reviewsJSX}
									/>
								</Body>
							: doctorsJSX
								? <Body>
										<DetailsSlider
											more={f(msg.show_all_doctors)}
											moreLink={`/${route}/${alias}/${search}#tab-doctors`}
											title={f(msg.popularity_doctors)}
											slides={doctorsJSX}
										/>
									</Body>
								: null
					}

				{
					!reviewsJSX && !doctorsJSX
						? <div
								dangerouslySetInnerHTML={{__html: item.brief_title}}
								className="block_info block_info_search block_info_big" />
						: null
				}

				{
					!reviewsJSX && !doctorsJSX
						? <div
								className="search_content"
								dangerouslySetInnerHTML={{__html: item.brief_txt || item.texts && item.texts.txt_short}}/>
						: null
				}

				{footer}
			</Banner>
		)
	}
}

DetailsBanner.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};

