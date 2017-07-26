import React, { Component } from 'react'
import Popup from '../../mixins/popup.js'
import { defineMessages } from 'react-intl';

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
	load_more: {
		defaultMessage: "Загрузить еще 5 диагностик",
		id: "popup.load_more_diagnostic",
	}
});

export default class PopupProcedures extends Popup {
	constructor( props ) {
		super ( props );

		this.more = this.more.bind(this);
		this.showItem = this.showItem.bind(this);
		this.consultation = this.consultation.bind(this);

		this.state = {max: 5};
	}

	consultation(procedure_id) {
		this.props.actions.setPopupBody(undefined, "get_cost", {
			procedure_id,
			id: this.params.clinic
		})
	}

	componentDidUpdate() {this.scrollUpdate()}

	showItem(id) {
		this.props.actions.showProcedure(id,
			{
				type: this.params.type,
				current_clinic: this.params.clinic
			},
			{
				type: this.params.type,
				clinic: this.params.clinic
			}
		)
	}

	render() {
		let diagnostics = this.body;

		if (!(diagnostics && diagnostics.length)) return null;

		const f = this.props.intlF.formatMessage;

		let items = diagnostics.map((diagnostic, index) => {

			return (
				<div className="popup_diagnostic popup_all_item"  key={index}>
					<div className="popup_diagnostic_head">
						{/*{*/}
							{/*diagnostic.images ? (*/}
								{/*<div*/}
									{/*style={{backgroundImage: `url(${__URL__}${diagnostic.images.name_s})`}} */}
									{/*onClick={() => this.showItem(index)}*/}
									{/*className="popup_diagnostic_img" />*/}
							{/*) : null*/}
						{/*}*/}

						<div className="popup_diagnostic_head_info">
							<p 
								className="block_title" 
								dangerouslySetInnerHTML={{__html: diagnostic.name}}
								onClick={() => this.showItem(diagnostic.id)} />
							<div className="block_content_info" dangerouslySetInnerHTML={{__html: diagnostic.texts.txt_short}} />
							<span className="block_cost">{diagnostic.price} </span>
						</div>
					</div>
					<div className="block_btns">
						<div 
							onClick={() => this.consultation(diagnostic.id)}
							className="btn btn_red">
							{f(msg.send_req)}
						</div>
						<div 
							onClick={() => this.showItem(diagnostic.id)}
							href="#" 
							className="btn btn_gray">
							{f(msg.about_procedure)}
						</div>
					</div>
				</div>
			)
		});

		return (
			<div className="region_popup popup_spec popup_spec_all" ref="container">
	    	<div className="popup_overlay" onClick={this.close}></div>
	    	<div className="popup">
	    		{this.returnClose()}

    			<div className="popup_spec_items">
    				{items}
    			</div>
    			{ 
    				this.isMore ? (
		  				<div onClick={() => this.more(this.link)} className="popup_btn">{f(msg.load_more, {count: 5}) }</div>
	    			) : null
	    		}
	    	</div>
			</div>
		)
	}
};
