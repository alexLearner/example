import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import {RatingList} from "../UI"
import {Link} from "react-router"
import youtube from "../../assets-front/img/icons/youtube.svg"
import photo from "../../assets-front/img/icons/photo.svg"
import msg from "../Details/Reviews/msg"

export default class Review extends PureComponent {
	render() {
		let isPopup;
		const 
			{
				review,
				modifier,
				show,
				className,
				showOnBtn
			} = this.props,
			{
				is_negative_max,
				is_positive_max
			} = review.helpfulness || {},
			{
				snippet,
				name,
				country_flag,
				city,
				country,
				type,
				rating,
				clinic_hidden,
				clinic,
				date_nice
			} = review,
			{f, pathnames: {clinics: route, s_host}} = this.context;

		if (modifier && ~modifier.indexOf("popup")) {
			isPopup = true;
		}

		return (
			<a
				href={`${s_host}/review/${review.id}/`}
				className={className || "search_place search_review"} 
				onClick={e => {e.preventDefault(); show(e)}}
				>
				{
					rating ? (
						<RatingList
							disabled={true}
							rating_5={true}
							rating={rating.toFixed(1)}
							className="search_place_reviews_rating" />
					) : null
				}

				<div
					className="search_review_content"
					dangerouslySetInnerHTML={{__html: snippet}} />
				
				{
					isPopup ? (
						<div
							className="popup_review_btn btn btn_gray"
							onClick={showOnBtn}>
							<FormattedMessage
								id="search.reviews.read_all_review"
								defaultMessage="Читать весь отзыв" />
						</div>
					) : null
				}

				<div className="search_place_footer search_reviews_footer">
					{
						//is_negative_max ? (
						//	<Status>
						//		<StatusImg className="negative" />
						//		{f(msg.best_negative_review)}
						//	</Status>
						//) : null
					}

					{
						//is_positive_max ? (
						//	<Status>
						//		<StatusImg className="positive" />
						//		{f(msg.best_positive_review)}
						//	</Status>
						//) : null
					}

					<div className="search_review_info">
						{
							clinic && clinic.name && !clinic_hidden ? (
								<div className="search_review_clinic">
									<Link
										to={`/${route}/${clinic.alias}/`}
										className="blue">
										{clinic.name}
									</Link>
								</div>
							) : null
						}

						<div className="block_title black">{name}</div>

						<div className="block_subtitle black">
							{
								country_flag
									? <img
											src={country_flag}
											alt=""
											className="icon_flag" />
									: null
							}
							{city ? `${city}, ` : null}
							{country}
						</div>				
						{
							type === "video" || type === "mix" ? (
								<img className="icon" src={youtube} alt="" />
							) : null
						}
						
						{
							type === "photo" ? (
								<img className="icon" src={photo} alt="" />
							) : null
						}
					</div>
				</div>

				{
					isPopup ? (
						<time className="block_time">{date_nice}</time>
					) : null
				}
			</a>
		)
	}
}

Review.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
};
