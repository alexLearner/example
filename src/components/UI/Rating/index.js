import React, { PureComponent } from 'react'
import { defineMessages } from 'react-intl';

const api = {
	speed: { 
		content: "Отвечает быстрее, чем остальные клиники (до 5 дней)",
		count: 0.5,
	},	
	qualification: { 
		content: "В клинике Ихилов работают специалисты с мировым именем",
		count: .4,
	},	
	service: { 
		content: "Лучшее оборудование в мире, включая Робот Да Винчи, True Beam",
		count: .4,	
	},	
	equipment: { 
		content: "Сервис в Ихилов на порядок ниже, чем в других клиниках",
		count: .9,
	},	
	popularity: { 
		content: "40 пациентов отзываются положительно",
		count: 1,
	}
}

const msg = defineMessages({
	rating_very_good: {
		defaultMessage: "Отлично",
		id: "rating.very_good"
	},
	rating_good: {
		defaultMessage: "Хорошо",
		id: "rating.good"
	},
	rating_medium: {
		defaultMessage: "Средне",
		id: "rating.medium"
	},
	rating_bad: {
		defaultMessage: "Плохо",
		id: "rating.bad"
	},
	rating_very_bad: {
		defaultMessage: "Очень плохо",
		id: "rating.very_bad"
	},
	speed: {
		id: "rating.speed",
		defaultMessage: "Оперативность ответа"
	},
	qualification: {
		id: "rating.qualification",
		defaultMessage: "Квалификация докторов"
	},
	service: {
		id: "rating.service",
		defaultMessage: "Оборудование"
	},
	general: {
		id: "rating.general",
		defaultMessage: "Общие"
	},
	popularity: {
		id: "rating.popularity",
		defaultMessage: "Сервис и комфорт"
	},
	equipment: {
		id: "rating.equipment",
		defaultMessage: "Популярность клиники"
	},
});

const rating_msg = {
	10 : "rating_very_good",
	9 : "rating_very_good",
	8 : "rating_good",
	7 : "rating_good",
	6 : "rating_medium",
	5 : "rating_medium",
	4 : "rating_bad",
	3 : "rating_bad",
	2 : "rating_very_bad",
	1 : "rating_very_bad" 
};

const colors = {
	10 : "#5A9F00",
	9 : "#7DB700",
	8 : "#97CC51",
	7 : "#C0DA00",
	6 : "#E1DC22",
	5 : "#F3B91B",
	4 : "#F1A21D",
	3 : "#EF8E2B",
	2 : "#F25424",
	1 : "#EE3535" 
};

const items = [
	"speed",
	"qualification",
	"service",
	"popularity",
	"general"
];

export default class Rating extends PureComponent {
	constructor( props ) {
		super ( props );
	}

	render() {	
		const f = this.context.f;
		let ratingItems = null;
		let medium_rate = this.props.rating;
		let className = this.props.className || "";
		className = className + " rating";
		let api = this.props.rating_bookimed;

		const isAllTimeVisible = this.props.rating_alltime_visible;

		if (this.props.rating_help) {
			ratingItems = items.map((item, index) => {
				const width = (api[item].count * 100).toFixed(1) + "%";
				const rating = (api[item].count * 10).toFixed(1) + "/10";
				const color = colors[Math.round(api[item].count * 10)];

				return (
					<div className="rating_item" key={index}>
						<div className="rating_title">
							<div>{f(msg[item])}</div>
							<span style={{color}}>{rating}</span>
						</div>
						<div className="rating_line_bg" />
						<div className="rating_line" style={{width, background: color}} />
					</div>
				)					
			})
		}

		if (medium_rate) {
			medium_rate = Math.round(medium_rate);
		}

		return (
			<div className={className}>
				{
					!isAllTimeVisible && medium_rate && this.props.rating_help ? (
						<div className="rating_msg">
							{f(msg[rating_msg[medium_rate]])}
						</div>
					) : null
				}
				{!isAllTimeVisible ? parseFloat(this.props.rating).toFixed(1) : null}
				<i className="sprite sprite-star" />
				{
					this.props.rating_help ? (
						<div className="rating_hidden">
							<i className="triangle" />
							{ratingItems}
						</div>
					) : null
				}
			</div>
		) 
	}
};

Rating.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};

