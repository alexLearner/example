import React, { Component } from 'react'
import Formsy from 'formsy-react'
import Popup from '../../mixins/popup.js'
import {SelectPhone} from "../UI"
import validateForm from "../../functions/validateForm"
import Cookie from "../../functions/Cookie"
import Textarea from "../Forms/Textarea"
import Input from "../Forms/Input"
import { defineMessages } from 'react-intl';
import price_check from "../../assets-front/img/icons/price-check.svg";
import fast_answer from "../../assets-front/img/icons/fast-answer.svg";
import free_program from "../../assets-front/img/icons/free-program.svg";
import consilium from "../../assets-front/img/icons/consilium.svg";
import forEach from "lodash/forEach"

const msg = defineMessages({
	close: {
		id: "popup.close",
		defaultMessage: "Закрыть"
	},	
	callback_doctor_title: {
		id: "popup.callback.callback_doctor_title",
		defaultMessage: "Опишите цель обращения в специалисту"
	},	
	we_ring_to_you: {
		id: "popup.callback.we_ring_to_you",
		defaultMessage: "Врач-координатор перезвонит Вам и ответит на все вопросы"
	},	
	order_ring: {
		id: "popup.callback.order_ring",
		defaultMessage: "Заказать звонок"
	},	
	we_build_program: {
		defaultMessage: "Получите индивидуальную программу лечения",
		id: "popup.callback.we_build_program"
	},
	read_about_target: {
		defaultMessage: "Опишите проблему как можно детальнее",
		id: "popup.callback.read_about_target"
	},
	placeholder_textarea: {
		defaultMessage: "Например: Какая стоимость лечения рака молочной железы на 4 стадии в мед. центре им. Сураски (Ихилов)? ",
		id: "popup.callback.placeholder_textarea"
	},
	default_placeholder_textarea: {
		defaultMessage: "Расскажите о Вашей проблеме чтобы мы подобрали лучшего специалиста ",
		id: "popup.callback.default_placeholder_textarea"
	},
	your_phone: {
		defaultMessage: "Ваш номер телефона",
		id: "popup.callback.your_phone"
	},
	doctor_ring_about_time: {
		defaultMessage: "Врач-координатор Bookimed перезвонит в течение часа.",
		id: "popup.callback.doctor_ring_about_time"
	},
	email: {
		defaultMessage: "Адрес электронной почты",
		id: "popup.callback.email"
	},
	text_send_on_email: {
		defaultMessage: "Сюда мы вышлем программу лечения после консилиума врачей (2-3 дня).",
		id: "popup.callback.text_send_on_email"
	},
	bookimed_check_cost: {
		defaultMessage: "Bookimed проверяет все цены клиник.",
		id: "popup.callback.bookimed_check_cost"
	},
	bookimed_check_your: {
		defaultMessage: "Мы следим за тем, чтобы Вы не переплачивали. ",
		id: "popup.callback.bookimed_check_your"
	},
	get_cost: {
		defaultMessage: "Получить стоимость лечения",
		id: "popup.callback.get_cost"
	},
	our_tel: {
		defaultMessage: "Наш телефон:",
		id: "popup.callback.our_phone"
	},
	validate_text: {
		defaultMessage: "* Все поля обязательны для заполнения",
		id: "popup.callback.validate_text"
	},
	text_1: {
		defaultMessage: "Врач-координатор свяжется с Вами в течение 1 часа",
		id: "popup.callback.text_1"
	},
	text_2: {
		defaultMessage: "Мы проверяем все цены клиник и следим, чтобы Вы не переплачивали",
		id: "popup.callback.text_2"
	},
	text_3: {
		defaultMessage: "Составление программы лечения и расчет стоимости бесплатные",
		id: "popup.callback.text_3"
	},
	text_4: {
		defaultMessage: "Программа лечения составляется на консилиуме врачей клиники",
		id: "popup.callback.text_4"
	}
});


let CONTENT = [];

export default class PopupCallback extends Popup {
	constructor( props, {f} ) {
		super ( props );

		this.params = {};
		this.state = {disabled: false};

		CONTENT = [
			{
				img: fast_answer,
				text: f(msg.text_1),
			},
			{
				img: price_check,
				text: f(msg.text_2)
			},
			{
				img: free_program,
				text: f(msg.text_3)
			},
			{
				img: consilium,
				text: f(msg.text_4)
			}
		];

		this.submit = this.submit.bind(this);
		this.customClose = this.customClose.bind(this);
	}

	submit(model) {
		if (!validateForm(this.refs.form)) return;

		const
			tracking = {...Cookie.getTracking()},
			layout = this.props.layout;

		let
			fd = new FormData,
			phone = model.phone,
			phoneVal = this.refs.select.state.value,
			obj = {
				...model,
				procedure_id: this.params.procedure_id || tracking.procedure.pop(),
				...this.params,
				clinic_id: this.params.id || this.params.clinic_id || tracking.clinic.pop(),
				illness_id: tracking.illness.pop(),
				direction_id: tracking.direction.pop(),
				country_to_treat_id: tracking.country.pop(),
				city_id: tracking.city.pop(),
				...layout.serverData,
				history: JSON.stringify(tracking.url_history),
				tracking: JSON.stringify(tracking),
				url: window.location.href
			};

		this.setState({disabled: true});

		forEach(obj, (value, key) =>
			value
				? fd.append(key, key === "phone" ? phoneVal + value : value)
				: null
		);

		if (this.props.get_cost) {
			this.props.actions
				.getCost(fd, "Записаться на консультацию")
				.then(() => this.setState({disabled: false}));
			return;
		}
		if (this.props.get_consultation) {
			this.props.actions
				.getConsultation(fd, "Получить стоимость лечения")
				.then(() => this.setState({disabled: false}));
			return;
		}
		else {
			this.props.actions
				.callback(fd, "Заказать звонок")
				.then(() => this.setState({disabled: false}))
		}
	}

	renameObjectForPlaceholder(object, names) {
		let result = {...object};

		forEach(object, (value, key) => {
			if (~names.indexOf(key)) {
				delete result[key];
				result[key.replace("_id", "")] = value;
			}
		});

		return result;
	}

	componentWillMount(nextProps) {
		this.popupWillMount(nextProps);

		ga('send', 'event', 'Form',  'Form opened', window.location.pathname);

		let params = this.props.popup.params;
		params.type = this.props.get_cost ? "get_cost" : "get_consultation";

		if (params.title) {
			delete params.title;
		}

		let result = this.renameObjectForPlaceholder(params, ["doctor_id", "clinic_id", "procedure_id", "illness_id", "direction_id"]);

		if (result.id || result.clinic) {
			this.props.actions.getPlaceholder(result);
		}
	}

	customClose(e) {
		ga('send', 'event', 'Form',  'Form closed', window.location.host + window.location.pathname);
		this.close(e);
	}

	render() {
		const
			f = this.context.f,
			disabled = this.state.disabled,
			{
				get_cost,
				get_consultation
			} = this.props;
		let placeholder = this.props.popup.placeholder || f(msg.placeholder_textarea);
		let title;

		if (!get_cost) {
			placeholder = f(msg.default_placeholder_textarea);
		}

		this.phone = this.props.layout.current_phone[0];
		this.params = this.props.popup.params;

		title = this.params.title ? f(msg[this.params.title]) :  f(msg.read_about_target);

		return (
			<Formsy.Form 
				onSubmit={this.submit} 
				ref="form"
				className="region_popup region_popup_white_close">
				<div className="popup_overlay" onClick={this.customClose} />
				<div className="popup popup_callback">
					{this.returnWhiteClose(this.customClose)}

					<div className="popup_callback_left">
						{
							CONTENT.map(({img, text}, index) =>
								<div className="popup_callback_left_item" key={index}>
									<div className="popup_callback_left_img">
										<img src={img} alt=""/>
									</div>
									<p>{text}</p>
								</div>
							)
						}
					</div>

					<div className="popup_callback_right">
						<div className="popup_callback_head block_title block_title_big text">
							{get_cost ? f(msg.we_build_program) : f(msg.we_ring_to_you)}
						</div>

						<div className="popup_callback_form">
							<Textarea
								required
								className="popup_callback_field"
								name="msg"
								label={title}
								placeholder={placeholder}/>

							<div className="popup_callback_field">
								<label>
									{f(msg.your_phone)}
									<sup>*</sup>
								</label>
								<div>
									<SelectPhone
										ref="select"
										name="phone"
										{...this.props}
										required
									/>
								</div>
							</div>

							{
								get_cost || get_consultation ? (
									<Input
										required
										className="popup_callback_field"
										name="email"
										validations={{isEmail: true}}
										icon={true}
										placeholder="email@domain.com"
										label={f(msg.email)}
									/>
								) : null
							}

							<div className="popup_callback_footer">
								<button type="submit" disabled={disabled} className="btn btn_red">
									<span>{get_cost ? f(msg.get_cost) : f(msg.order_ring)}</span>
								</button>
							</div>
						</div>
					</div>

				</div>
			</Formsy.Form>
		)
	}
};

PopupCallback.contextTypes = {f: React.PropTypes.func};
