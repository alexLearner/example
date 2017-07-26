import React, { Component } from 'react'
import Popup from '../../mixins/popup.js'
import error from "../../assets-front/img/icons/error.png"
import { defineMessages } from 'react-intl';

const msg = defineMessages({
	title: {
		id: "popup.success.title",
		defaultMessage: "Ваша заявка отправлена!"
	},	
	
	subtitle: {
		id: "popup.success.subtitle",
		defaultMessage: "Вы будете перенаправлены в личный кабинет…"
	},

	move: {
		id: "popup.success.move",
		defaultMessage: "Перейти сейчас"
	},

	error: {
		id: "popup.success.error",
		defaultMessage: "Возникла какая-то ошибка!"
	},

	close: {
		id: "popup.success.close",
		defaultMessage: "Закрыть"
	}
});

export default class PopupError extends Popup {
	render() {
		const f = this.context.f;

		return (
			<div className="region_popup region_popup_white_close">
				<div
					className="popup_overlay"
					onClick={this.close} />

				<div
					id="popup_success"
					className="popup">
					{this.returnWhiteClose()}

					<img src={error} alt="" className="popup_error_img"/>
					<h2 id="popup_success_title">{f(msg.error)}</h2>

				</div>
			</div>
		)
	}
};

PopupError.contextTypes = {f: React.PropTypes.func};