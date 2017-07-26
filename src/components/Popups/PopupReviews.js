import React, { Component } from 'react'
import Popup from '../../mixins/popup.js'
import {defineMessages} from 'react-intl';
import Review from "../Details/Reviews/Review"

const msg = defineMessages({
	load_more: {
		defaultMessage: "Загрузить еще 5 отзывов",
		id: "popup.load_more_reviews",
	}
});

export default class PopupRewievs extends Popup {
	constructor( props ) {
		super ( props );

		this.postHelpfulness = this.postHelpfulness.bind(this);
	}

	componentDidUpdate() {
		this.scrollUpdate()
	}

	showReview(id) {
		const {ids} = this.props.popup.params;
		this.props.actions.showReview(id, ids);
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

	render() {
		const f = this.props.intlF.formatMessage;
		let reviews = this.body;

		if (reviews && !reviews.length) return null;

		reviews = reviews.map((review, index) =>
			<Review
				onClickBtn={this.postHelpfulness}
				{...review}
				showDoctor={this.props.actions.showDoctor}
				key={index}/>
		);

		return (
			<div className="region_popup">
	    	<div className="popup_overlay" onClick={this.props.actions.closePopup}></div>
	    	<div className="popup">
	    		{this.returnClose()}
	    		
	    		<div className="popup_reviews" ref="container">
	    			{reviews}
	    		</div>
    			{ 
    				this.isMore ? (
		  				<div
							  onClick={() => this.more(this.link)}
							  className="popup_btn">
							  {f(msg.load_more, {count: 5})}
						  </div>
	    			) : null
	    		}
	    	</div>
			</div>
		)
	}
};
