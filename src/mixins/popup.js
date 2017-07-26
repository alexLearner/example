import React, { Component } from 'react';
import { FormattedMessage, defineMessages, intlShape, injectIntl } from 'react-intl';
import {SVG} from "../components/UI"

const msg = defineMessages({
	cancel :{
		id: "popup.cancel",
		defaultMessage: "отмена"
	},
	close :{
		id: "popup.close",
		defaultMessage: "Закрыть"
	},

	back :{
		id: "popup.back",
		defaultMessage: "Назад"
	}
});

export default class Popup extends Component {
	constructor( props ) {
		super ( props );

		this.close = this.close.bind(this);
		this.show = this.show.bind(this);
		this.popupWillMount = this.popupWillMount.bind(this);
		this.controlReviews = this.controlReviews.bind(this);
		this.more = this.more.bind(this);
		this.keydown = this.keydown.bind(this);
		this.scrollUpdate = this.scrollUpdate.bind(this);
		this.body;
		this.params;
		this.isMore = true;
	}

	more(link) {
		this.props.actions.showPopupMore(link)
	}

	request(props, prev) {
		let object = {
			clinic_id: this.request.clinic_id,
			title: this.request.title || "callback_doctor_title" 
		};

		if (props) {
			object = Object.assign(object, props)
		}

		this.props.actions.showPopup(this.request.type || "get_cost");
		this.props.actions.setPopupParams(object);

		if (prev) {
			this.props.actions.setPrevPopup(prev);
		}
	}

	returnClose() {
		return this.returnWhiteClose();
	}

	returnWhiteClose(close) {
		const f = this.props.intlF.formatMessage;
		return ( 
			<div className="popup_close_white">
				{
					this.props.popup.history.length > 1 ? (
						<div onClick={this.props.actions.showPrevPopup} >
							<div className="icon" dangerouslySetInnerHTML={{__html: SVG.arrow_back}} />
							{f(msg.back)}
						</div>
					) : <div />
				}
				<div onClick={close || this.close}>
					{f(msg.close)}
					<div className="popup_close_icon"><i className="icon icon_close" /></div>
				</div>
			</div>
		)
	}

	returnFilterClose() {
		const f = this.props.intlF.formatMessage;
		return (
			<div type="button" className="popup_back_link" onClick={this.props.actions.showPrevPopup}>
				{f(msg.cancel)}
				<div className="popup_close_icon"><i className="icon icon_close" /></div>
			</div>
		)
	}

	keydown(event) {
		let key = event.keyCode;

		if (key === 27) {
			this.close();
		}
	}

	componentWillReceiveProps(nextProps){
		if (nextProps.popup) {
			if (this.body !== nextProps.popup.body) {
				this.body = nextProps.popup.body;
			}
			this.link = nextProps.popup.params.link;
			this.params = nextProps.popup.params;	

			if (this.params.page === this.params.total_page) {
				this.isMore = false;
			}

			this.controlReviews();
		}
	}

	componentWillUpdate() {
		if (this.refs.container) {
			this.height = this.refs.container.scrollHeight;
		}

	}

	popupWillMount() {
		this.show();

		if (this.props.popup) {
			this.body = this.props.popup.body;
			this.params = this.props.popup.params;
			this.link = this.props.popup.params.link;

			if (this.params.page === this.params.total_page) {
				this.isMore = false;
			}

			this.controlReviews();
		}

		document.body.addEventListener("keydown", this.keydown);
	}

	componentWillMount() {
		this.popupWillMount()
	}

	controlReviews() {
		if (this.params && this.params.ids) {
			let ids = this.params.ids;
			let max = ids.length - 1;

			ids.map((id, index) => {
				if (this.body.id === id) {
					if (index < max) {
						this.next_id = ids[index + 1];
					}
					else {
						this.next_id = undefined
					}

					if (index > 0) {
						this.back_id = ids[index - 1];
					}
					else {
						this.back_id = undefined
					}
				}
			})
		}
	}

	componentWillUnmount() {
		document.body.classList.remove("overflow");
		document.body.removeEventListener("keydown", this.keydown)
	}

	show() {
		document.body.classList.add("overflow");
	}

	scrollUpdate() {
		if (this.refs.container) {
			let height = this.refs.container.closest(".layout_popup").offsetHeight;

			this
				.refs
				.container
				.closest('.layout_popup')
				.scrollTop = Math.abs(this.height - height);
		}
	}

	close() {
		this.props.actions.closePopup();
		document.body.classList.remove("overflow");
	}

	openPrev() {
		this.props.actions.showPopup(this.props.popup.prev);
	}
}

Popup.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};