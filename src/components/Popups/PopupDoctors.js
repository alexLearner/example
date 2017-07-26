import React, { Component } from 'react'
import Popup from '../../mixins/popup.js'
import { defineMessages } from 'react-intl';
import {Doctor} from "../Places"

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
		id: "popup.reviews",
		defaultMessage: "Отзывы"
	},
	more : {
		id: "search.doctor.more",
		defaultMessage: "Подробнее"
	},
	consultation : {
		id: "search.doctor.consultation",
		defaultMessage: "Консультация"
	},
	specs : {
		id: "search.doctor.other",
		defaultMessage: "Специалисты в других клиниках"
	},
	all_spec: {
		id: "search.doctor.all",
		defaultMessage: "Все специалисты"
	},
	load_more: {
		defaultMessage: "Загрузить еще {count} специалистов",
		id: "search.doctor.load_more",
	}
});

export default class PopupDoctors extends Popup {
	constructor( props ) {
		super ( props );

		this.height;
		this.showDoctor = this.showDoctor.bind(this);
		this.consultation = this.consultation.bind(this);

		this.state = {};
	}

	showDoctor(id, index) {
		this.props.actions.showDoctor(id, index);
	}

	consultation(e, id) {
		e.stopPropagation();
		e.preventDefault();
		ga('send', 'event', 'Form',  'Button pressed', window.location.host + window.location.pathname);

		this.props.actions.setPopupBody(
			undefined,
			"get_consultation",
			{id, title: "callback_doctor_title"}
		);
	}

	componentDidUpdate() {
		this.scrollUpdate()
	}

	render() {
		const
			f = this.context.f,
			title = this.params.text_title;

		let items = this.body.map((doctor, index) =>
			<Doctor
				doctor={doctor}
				key={index}
				modifier="popup"
				className="popup_all_item"
				showOnBtn={() => this.showDoctor(doctor.id, index)}
				consultation={e => this.consultation(e, doctor.id)}
			/>
		);

		return (
			<div
				className="region_popup popup_spec popup_spec_all"
				ref="container">
				<div
					className="popup_overlay"
					onClick={this.close}
					/>
				<div className="popup">
					{this.returnClose()}
					{
						title ? (
							<div className="popup_head">
								<p>{f(msg.all_spec)}</p>
								<span>{title}</span>
							</div>
						) : null
					}

					<div className="popup_spec_items">
						{items}
					</div>
					{ 
						this.isMore ? (
							<div
								onClick={() => this.more(this.link)}
								className="popup_btn">
								{f(msg.load_more, {count: 5}) }
							</div>
						) : null
					}
				</div>
			</div>
		)
	}
};

PopupDoctors.contextTypes = {f: React.PropTypes.func};
