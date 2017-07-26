import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import {RatingList} from "../UI"

export default class Doctor extends PureComponent {
	constructor( props ) {
		super ( props );

		this.state = {mounted: false};
	}

	componentDidMount() {
		this.setState({mounted: true})
	}

	render() {
		let btn,
				ratingClassName = "search_place_rating";

		const
			{
				doctor,
				modifier,
				className,
				show,
				consultation,
				showOnBtn
			} = this.props,
			{pathnames: {s_host}} = this.context,
			{mounted} = this.state;

		btn = (
			<div className="search_place_btn">
				<FormattedMessage
					id="search.doctor.more"
					defaultMessage="Подробнее о специалисте" />
			</div>
		);

		if (modifier && modifier.indexOf("popup") + 1) {
			ratingClassName = "popup_rating";
			btn = (
				<div className="block_btns">
					<div onClick={showOnBtn} className="btn btn_gray">
						<FormattedMessage
							id="search.doctor.more"
							defaultMessage="Подробнее о специалисте" />
					</div>
					<div className="btn btn_red" onClick={consultation}>
						<FormattedMessage
							id="search.doctor.go_consultation"
							defaultMessage="Записаться на консультацию" />
					</div>
				</div>
			)
		}

		return (
			<a
				href={s_host + doctor.link}
				className={className || "search_place search_doctor"} 
				onClick={(e) => {e.preventDefault(); e.stopPropagation(); show ? show() : null}}
				>
				<div className="search_doctor_head">
					<span 
						style={
							mounted
								? {backgroundImage: "url(" + s_host + doctor.img+")"}
								: null
						}
						className="search_doctor_img" />
						
					<div className="search_doctor_head_info">
						<div className="block_title block_title_big black">
							{doctor.name}
						</div>

						{
							doctor.rating ? (
								<RatingList
									disabled={true}
									rating_5={true}
									rating={(doctor.rating).toFixed(1)}
									className={ratingClassName} />
							) : null
						}

						<div className="block_subtitle">{doctor.degree}</div>
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
											defaultMessage="лет" />
									</p>
								) : null
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

				{btn}
			</a>
		)
	}
}

Doctor.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};