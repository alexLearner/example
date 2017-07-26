import React, { Component } from 'react'
import Popup from '../../mixins/popup.js'
import {Rating, RatingList, According} from "../UI/"
import { FormattedMessage, defineMessages } from 'react-intl';
import youtube from "../../assets-front/img/icons/youtube.svg"
import photo from "../../assets-front/img/icons/youtube.svg"
import {Doctor} from "../Places"
import Cookie from "../../functions/Cookie"

const msg = defineMessages({
	close: {
		id: "popup.close",
		defaultMessage: "Закрыть"
	},
	info : {
		id: "search.doctor.info",
		defaultMessage: "Общая информация"
	},
	reviews : {
		id: "search.doctor.reviews",
		defaultMessage: "Отзывы"
	},
	specs : {
		id: "search.doctor.other",
		defaultMessage: "Специалисты в других клиниках"
	},
	spec: {
		id: "search.doctor.direction",
		defaultMessage: "Специализация"
	}
});

export default class PopupDoctor extends Popup {
	constructor( props ) {
		super ( props );

		this.showReview = this.showReview.bind(this);
		this.showOtherDoctor = this.showOtherDoctor.bind(this);
		this.consultation = this.consultation.bind(this);
	}

	componentDidMount() {
		Cookie.push("tracking_doctor_ids", this.body.alias);
	}

	consultation(e, index) {
		e.stopPropagation();
		e.preventDefault();
		ga('send', 'event', 'Form',  'Button pressed', window.location.pathname);
		let doctor_id = this.body.id;
		let clinic_id = this.props.popup.params.clinic_id;

		if (index) {
			doctor_id = this.body.other_doctors[index].id;
			clinic_id = this.body.other_doctors[index].clinic_id;
		}

		let object = {
			doctor_id,
			clinic_id,
			title: "callback_doctor_title"
		};

		this.props.actions.setPopupBody(undefined, "get_consultation", object);
	}

	showReview(id) {
		this.props.actions.showReview(id)
	}

	showOtherDoctor(id, index, alias) {
		Cookie.push("tracking_doctor_ids", alias);
		this.props.actions.showDoctor(id, index, true);
	}

	render() {
		const {
			f,
			pathnames: {s_host}
		} = this.context;
		if (!this.body) return null;

		let doctor = this.body,
				reviews = [],
				disabled = [],
				other = [],
				illnesses_kinds = "";

		doctor.directions.map(direction =>
			illnesses_kinds = illnesses_kinds + direction.name + ", "
		);
		illnesses_kinds = illnesses_kinds.slice(0, illnesses_kinds.length - 2);

		let list = [
			f(msg.info),
			f(msg.reviews),
			f(msg.specs)
		];

		if (doctor.reviews) {
			if (doctor.reviews.length === 0) {
				disabled.push(1);
			}	

			reviews = doctor.reviews.map((review, index) => {
				return (
					<div
						className="search_place search_review"
						onClick={() => this.showReview(review.id)}
						key={index}>
						<div className="block_title block_title_rating black">{review.name}</div>
						<Rating
							rating={review.rating}
							className="popup_rating" />
						<div className="block_subtitle">
							{review.city},&#160;
							{review.country}
						</div>
						<div className="search_review_content">{review.snippet}</div>
						<div className="search_place_footer">
							{
								review.type === "video" || review.type === "mix" ? (
									<a href={review.video_html} className="search_place_link">
										<img className="icon" src={youtube} alt="" />
										<FormattedMessage id="search.reviews.video" defaultMessage="Видео-отзыв"/>
									</a>
								) : null
							}
							
							{
								review.type === "photo" ? (
									<a href={review.link_photo} className="search_place_link">
										<img className="icon" src={photo} alt="" />
										<FormattedMessage id="search.reviews.photo" defaultMessage="Фото-отзыв" />
									</a>
								) : null
							}
							<time className="block_time">{review.dateNice}</time>
						</div>

						<div className="search_place_btn">
							<FormattedMessage id="search.reviews.read_all_review" defaultMessage="Читать весь отзыв" />
						</div>
					</div>
				)
			})
		}

		if (doctor.other_doctors) {
			other = doctor.other_doctors.map((doctor, index) => {
				if (doctor.other_doctors && doctor.other_doctors.length === 0) {
					disabled.push(2);
					return;
				}	

				return (
					<Doctor 
						doctor={doctor} 
						key={index} 
						modifier="popup" 
						show={() => this.showOtherDoctor(doctor.id, index, doctor.alias)}
						consultation={(e) => this.consultation(e, index)} 
					/>
				)
			})
		}
		else {
			disabled.push(2);
		}

		if (!doctor.texts.txt_info && !doctor.texts.txt_descr) {
			disabled.push(0);
		}

		let tabs = [
			<div
				className="block_content content nostyles"
				dangerouslySetInnerHTML={{__html: doctor.texts.txt_info || doctor.texts.txt_descr}} />,

			<div>{reviews}</div>,

			<div className="popup_other">
				<div className="popup_other_container">
					{other}
				</div>
			</div>
		];

		return (
			<div className="region_popup popup_spec">
	    	<div
			    className="popup_overlay"
			    onClick={this.close} />
	    	<div className="popup">
		    	{this.returnClose()}
					<div className="search_doctor_head">
						<div
							style={{backgroundImage: "url(" + s_host + doctor.img+")"}}
							className="search_doctor_img" />

						<div className="search_doctor_head_info">
							<div className="block_title text">{doctor.name}</div>

							{
								doctor.rating ? (
									<RatingList
										rating_5={true}
										disabled={disabled}
										rating={doctor.rating.toFixed(1)} />
								) : null
							}

							<div className="block_subtitle">
								{doctor.degree}
							</div>
							<div className="search_doctor_content">
								{
									doctor.experience && doctor.experience !== "0" ? (
										<p>
											<FormattedMessage
												id="search.doctor.degree"
												defaultMessage="Стаж" />&#160;
											{doctor.experience}&#160;
											<FormattedMessage
												id="search.doctor.year"
												defaultMessage="лет" />&#160;
										</p>
									):null
								}
								{ 
									doctor.consultation_price && doctor.consultation_price > 0 ? (
										<p>
											<FormattedMessage
												id="search.doctor.cost"
												defaultMessage="Стоимость консультации" />&#160;
											{doctor.consultation_price}$
										</p>
									) : null
								}
							</div>
						</div>
					</div>

					<div
						className="block_info"
						dangerouslySetInnerHTML={{__html: doctor.texts.txt_descr}} />

					<div className="block_btns">
						<div className="btn btn_red" onClick={e => this.consultation(e)}>
							<FormattedMessage
								id="search.doctor.go_consultation"
								defaultMessage="Записаться на консультацию" />
						</div>

						<a href={ s_host + doctor.link} className="btn btn_gray">
							<FormattedMessage
								id="search.doctor.more"
								defaultMessage="Подробнее о специалисте" />
						</a>
					</div>

					<According list={list} tabs={tabs} disabled={disabled} />
	    	</div>
			</div>
		)
	}
};