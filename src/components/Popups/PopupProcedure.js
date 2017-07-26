import React, {Component} from 'react';
import Popup from '../../mixins/popup.js';
import {According} from '../UI';
import {defineMessages} from 'react-intl';
import Clinic from "../Home/Clinics/Clinic";
import Cookie from "../../functions/Cookie"

const msg = defineMessages({
	close: {
		id: "popup.close",
		defaultMessage: "Закрыть"
	},
	send_req: {
		defaultMessage: "Отправить запрос",
		id: "popup.send_req"
	},
	about_procedure: {
		defaultMessage: "Подробнее о процедуре",
		id: "popup.about_procedure"
	},
	description_procedure: {
		defaultMessage: "Описание процедуры",
		id: "popup.description_procedure"
	},
	similar_procedures: {
		defaultMessage: "Где еще проводят эту процедуру",
		id: "popup.similar_procedures"
	},
	default_price: {
		defaultMessage: "Стоимость процедуры в этой клинике уточняйте",
		id: "popup.price_specify"
	}
});

export default class PopupProcedure extends Popup {
	constructor( props ) {
		super ( props );

		this.clinic = this.props.popup.params.clinic;
		this.state = {
			according_index: 0
		};
		
		this.consultation = this.consultation.bind(this);
	}

	consultation(id = this.props.popup.params.clinic) {
		this.props.actions.setPopupBody(undefined, "get_cost", {
			procedure_id: this.body.alias,
			clinic_id: id
		})
	}

	componentDidMount() {
		Cookie.push("tracking_procedure_ids", this.body.alias);
	}

	render() {
		const {f, pathnames: {s_host, clinics: route}} = this.context;
		let
			diagnostic = this.body,
			disabled = [],
			list = [
				f(msg.description_procedure),
				`${f(msg.similar_procedures)}<span>${diagnostic.clinics && diagnostic.clinics.length}</span>`
			];

		const clinics = diagnostic.clinics.map((item, index) =>
			<Clinic
				clinic={item}
				imagesObject={true}
				price={item.price === undefined || item.price === "0" ? f(msg.default_price) : item.price}
				key={index}
				route={route} />
		);

		if (!diagnostic.texts.txt_info) {
			disabled.push(0)
		}

		let tabs = [
			<div
				dangerouslySetInnerHTML={{__html: diagnostic.texts.txt_info}}
				className="block_content content nostyles" />,
			clinics
		];

		return (
			<div className="region_popup popup_spec_all popup_spec">
				<div className="popup_overlay" onClick={this.close}></div>
				<div className="popup popup_diagnostic">
					{this.returnClose()}
					<div className="popup_diagnostic">
						<div className="popup_diagnostic_head">
							{/*<span*/}
								{/*style={{backgroundImage: `url(${s_host}${diagnostic.images.name_s})`}}*/}
								{/*className="popup_diagnostic_img" />*/}

							<div className="popup_diagnostic_head_info">
								<p className="block_title black" dangerouslySetInnerHTML={{__html: diagnostic.name}} />
								<div className="block_content_info" dangerouslySetInnerHTML={{__html: diagnostic.texts.txt_short}} />
								<span className="block_cost">{diagnostic.price} </span>
							</div>
						</div>

						<div className="block_btns">
							<a onClick={() => this.consultation()} className="btn btn_red">{f(msg.send_req)}</a>
							<a href={s_host + diagnostic.clinics_link} className="btn btn_gray">{f(msg.about_procedure)}</a>
						</div>

						<According list={list} tabs={tabs} disabled={disabled} />
					</div>
				</div>
			</div>
		)
	}
};

PopupProcedure.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};
