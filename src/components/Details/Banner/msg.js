import {defineMessages} from 'react-intl';

const DetailsBannerMsg = defineMessages({
	popularity_reviews: {
		defaultMessage: "Популярные отзывы",
		id: "details.popularity_reviews"
	},
	popularity_doctors: {
		defaultMessage: "Ведущие доктора клиники",
		id: "details.popularity_doctors"
	},
	reviews: {
		defaultMessage: "{count} отзывов",
		id: "details.reviews"
	},

	rating_avg: {
		id: "details.banner.rating_avg",
		defaultMessage: "Средняя оценка по отзывам"
	},

	rating_bookimed: {
		id: "details.banner.rating_bookimed",
		defaultMessage: "Независимая оценка Bookimed"
	},

	show_all_reviews: {
		id: "details.banner.show_all_reviews",
		defaultMessage: "Смотреть все отзывы"
	},

	show_all_doctors: {
		id: "details.banner.show_all_doctors",
		defaultMessage: "Смотреть всех докторов"
	}
});

export default DetailsBannerMsg;