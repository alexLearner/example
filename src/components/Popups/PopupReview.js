import React, { Component } from 'react'
import Popup from '../../mixins/popup.js'
import SVG from "../UI/SVG"
import Review from "../Details/Reviews/Review"
import { defineMessages } from 'react-intl';

const msg = defineMessages({
	next: {
		id: "popup.next_review",
		defaultMessage: "Следующий отзыв"
	},
	prev: {
		id: "popup.prev_review",
		defaultMessage: "Предыдущий отзыв"
	}
});

export default class PopupReview extends Popup {
	constructor( props ) {
		super ( props );

		this.reviews_count = this.props.popup.params.reviews_count;

		this.state = {prev: false};

		this.next = this.next.bind(this);
		this.back = this.back.bind(this);
		this.postHelpfulness = this.postHelpfulness.bind(this);
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

	back() {
		this.props.actions.showReview(this.back_id, {ids: this.params.ids}, false);
	}

	next() {
		this.props.actions.showReview(this.next_id, {ids: this.params.ids}, false);
	}

	render() {
		let review = this.body,
				btn_next_visible = !!this.next_id,
				btn_back_visible = !!this.back_id;

		const
			f = this.context.f,
			actions = this.props.actions;

		return (
			<div className="region_popup popup_review">
				<div
					className="popup_overlay"
					onClick={actions.closePopup} />

				<div className="popup">
					{this.returnClose()}
					<div className="popup_nav">
						{
							btn_back_visible
								? <div
										onClick={this.back}
										className="popup_nav_item"
									>
										<img src={SVG.prev} className="icon"  alt=""/>
										<span>{f(msg.prev)}</span>
									</div>
								: <div/>
						}
						{
							btn_next_visible
								? <div
									onClick={this.next}
									className="popup_nav_item"
									>
										<span>{f(msg.next)}</span>
										<img src={SVG.next} className="icon"  alt=""/>
									</div>
								: <div/>
						}
				</div>

					<Review
						onClickBtn={this.postHelpfulness}
						close={actions.closePopup}
						showDoctor={actions.showDoctor}
						{...review} />
				</div>
			</div>
		)
	}
};

PopupReview.contextTypes = {f: React.PropTypes.func};
