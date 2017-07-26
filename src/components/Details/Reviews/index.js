import React,{PureComponent} from 'react'
import ReviewDesktop from "./Review"
import Control from "../Control"
import TabsMixin from "../TabsMixin"
import isEqual from "lodash/isEqual"
import Review from "../../Places/Review"
import tx from 'transform-props-with';
import addElementFunc from "../../../functions/elementStyles";
import {isMobileSm} from "../../../functions/viewport";
import msg from "../Tabs/msg"
import {FormattedMessage} from "react-intl"

const
	pr = addElementFunc(""),
	Reviews = tx([{ className: "details_reviews details_tabs_block preloader" }, pr])('div'),
  Footer = tx([{ className: 'details_tabs_footer'}])('div'),
  Body = tx([{ className: 'details_tabs_body'}])('div');

export default class DetailsReviews extends TabsMixin {
	constructor(props, {f}) {
		super(props);

    this.showReview = this.showReview.bind(this);
    this.postHelpfulness = this.postHelpfulness.bind(this);

		this.sortingList = [
			{
				value: "recommended",
				label: f(msg.recommended)
			},
			{
				value: "popularity",
				label: f(msg.popularity)
			},
			{
				value: "new",
				label: f(msg.new)
			},
		];

    this.name = this.CONSTANTS.reviews.name;
    this.getFunctionName = this.CONSTANTS.reviews.fn;
    this.reviews_ids = [];
	}

	shouldComponentUpdate(nextProps) {
		return (
			nextProps.hidden !== this.props.hidden ||
			!isEqual(this.props.details.reviews, nextProps.details.reviews) ||
			!isEqual(this.props.details.reviews_info, nextProps.details.reviews_info)
		)
	}

  componentDidMount() {
    this.tabComponentDidMount();
  }

  postHelpfulness(id, value, canceled = false) {
    let fd = new FormData();
    if (canceled) {
      fd.append("canceled", true)
    }
    else {
      fd.append("value", value)
    }
    this.props.actions.detailsPostHelpfulness(id, fd);
  }

  showReview(id) {
    this.props.actions.showReview(id, {ids: this.reviews_ids});
  }

	render() {
		const
      {
        layout,
        filters,
	      hidden,
        showGallery
      } = this.props,
			f = this.context.f,
		  {
        filters_countries,
      } = layout,
      {reviews, reviews_info} = this.props.details,
      {data, fetched, pagination} = reviews || {};

    const more = this.returnMoreButton(pagination);

    if (!fetched || !data) return <Reviews active={false} />;

    this.reviews_ids = [];

		const items = data.map((review, index) => {
      this.reviews_ids.push(review.id);

      if (!isMobileSm) {
        return (
    			<ReviewDesktop
            onClickBtn={this.postHelpfulness}
            key={index}
            clinic_hidden={true}
            showDoctor={this.props.actions.showDoctor}
            showGallery={showGallery}
            {...review}
            countries={filters_countries} />
        )
      }

      else {
        return (
          <Review
            review={review}
            key={index}
            clinic_hidden={true}
            showDoctor={this.props.actions.showDoctor}
            show={() => this.showReview(review.id)}
          />
        )
      }
    });

		return (
			<Reviews active={true} hidden={hidden}>
				<div className="size6of8">
          <Body>
            {
              items && items.length ? items : (
                <div>
	                <FormattedMessage id="deatils.not_found" defaultMessage="Ничего не найдено" />
                </div>
              )
            }
          </Body>

          <Footer>
            {more}
          </Footer>
				</div>

				<div className="size2of8">
          <Control
            sorting={this.sortingList}
            changeQuery={this.changeQuery}
            sortingChange={this.sorting}
            filteringChange={this.sorting}
            filters_data={filters}
            reviews_info={reviews_info}
            afterFitlerCheckbox={{text: f(msg.reviews_media), name: "media"}}
            rating={true}/>
				</div>
			</Reviews>
		)
	}
}

DetailsReviews.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};

