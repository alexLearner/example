import {defineMessages} from "react-intl"

const DetailControlMsg = defineMessages({
	filter: {
		defaultMessage: "Фильтр",
		id: "details.control.filter"
	},
	reset: {
		defaultMessage: "Сбросить",
		id: "details.control.reset"
	},
	avrg_rating: {
		defaultMessage: "Средняя оценка по {count} отзывам пациентов",
		id: "details.control.avrg_rating"
	},
	filter_by_rating: {
		defaultMessage: "Фильтровать по рейтингу",
		id: "details.control.filter_by_rating"
	},
	sort: {
		defaultMessage: "Сортировать",
		id: "details.control.sort"
	},
	submit: {
		defaultMessage: "Применить",
		id: "details.control.submit"
	},
	reviews_rating_with: {
		defaultMessage: "Отзывы с оценкой {value}",
		id: "details.control.reviews_rating_with"
	},
});

export default DetailControlMsg;