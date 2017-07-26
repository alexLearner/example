import {defineMessages} from 'react-intl';

const DetailsReviewMsg = defineMessages({
	diagnostic: {
		defaultMessage: "Диагноз:",
		id: "details.review.diagnostic"
	},
	doctor: {
		defaultMessage: "Доктор:",
		id: "details.review.doctor"
	},
	clinic: {
		defaultMessage: "Клиника:",
		id: "details.review.clinic"
	},
	coordinator: {
		defaultMessage: "Координатор:",
		id: "details.review.coordinator"
	},
	best_positive_review: {
		defaultMessage: "Лучший позитивный отзыв",
		id: "details.review.best_positive_review"
	},
	best_negative_review: {
		defaultMessage: "Лучший негативный отзыв",
		id: "details.review.best_negative_review"
	},
	helpfulness: {
		defaultMessage: "{positive_count} из {count} человек считают этот отзыв полезным",
		id: "details.review.helpfulness"
	},
	no_helpfulness: {
		defaultMessage: "Этот отзыв пока никто не посчитал полезным",
		id: "details.review.no_helpfulness"
	},
	is_helpfulness: {
		defaultMessage: "Был ли отзыв Вам полезен?",
		id: "details.review.is_helpfulness"
	},

});

export default DetailsReviewMsg;