import React, { Component } from 'react'
import Popup from '../../mixins/popup.js'
import success from "../../assets-front/img/icons/success.png"
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

	close: {
		id: "popup.success.close",
		defaultMessage: "Закрыть"
	}
});

export default class PopupSuccess extends Popup {
	render() {
		const
			f = this.context.f,
			{
				title,
				subtitle
			} = this.props.popup.body;

		return (
			<div className="region_popup region_popup_white_close">
				<div className="popup_overlay" onClick={this.close} />
				<div id="popup_success" className="popup">
					{this.returnWhiteClose()}

					<img src={success} alt="" />
					<h2 id="popup_success_title">{title || f(msg.title)}</h2>
					{
						subtitle !== "false" ? (
							<div id="popup_success_subtitle">{subtitle || f(msg.subtitle)}</div>
						) : null
					}
				</div>
			</div>
		)
	}
};

PopupSuccess.contextTypes = {f: React.PropTypes.func};

