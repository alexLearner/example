import {defineMessages} from 'react-intl';

const DetailsTabsMsg = defineMessages({
	recommended: {
		defaultMessage: "Сначала рекомендованные",
		id: "details.tabs.sort.recommended"
	},
	popularity: {
		defaultMessage: "Сначала популярные",
		id: "details.tabs.sort.popularity"
	},
	expensive: {
		defaultMessage: "Сначала дорогие",
		id: "details.tabs.sort.expensive"
	},
	new: {
		defaultMessage: "Сначала новые",
		id: "details.tabs.sort.new"
	},
	by_alphabet: {
		defaultMessage: "Имена по алфавиту",
		id: "details.tabs.sort.by_alphabet"
	},
	cheap: {
		defaultMessage: "Сначала дешевые",
		id: "details.tabs.sort.cheap"
	},
	get_consultation: {
		defaultMessage: "Получить консультацию",
		id: "details.tabs.get_consultation"
	},
	procedures_with_cost: {
		defaultMessage: "Показывать только с ценами",
		id: "details.procedures.procedures_with_cost"
	},
	procedures_placeholder: {
		defaultMessage: "ПЭТ-КТ, консультация онколога, Кибер-нож",
		id: "details.procedures.placeholder"
	},
	is_not_sure_procedure: {
		defaultMessage: "Не уверены в выборе процедуры?",
		id: "details.procedures.sort.is_not_sure"
	},
	doctors_placeholder: {
		id: "details.doctors.placeholder",
		defaultMessage: "Введите имя доктора"
	},
	reviews_media: {
		id: "details.reviews.media",
		defaultMessage:"Отзывы с медиа"
	},
	doctors_more: {
		id: "details.doctors.more",
		defaultMessage:"Загрузить еще 10 специалистов"
	},
	procedures_more: {
		id: "details.procedures.more",
		defaultMessage:"Загрузить еще 10 процедур"
	},
	reviews_more: {
		id: "details.reviews.moe",
		defaultMessage:"Загрузить еще 10 процедур"
	},
	"info": {
		id: "details.nav.info",
		defaultMessage : "Обзор"
	},
	"reviews": {
		id: "details.nav.reviews",
		defaultMessage : "Отзывы пациентов"
	},
	"doctors": {
		id: "details.nav.doctors",
		defaultMessage : "Специалисты"
	},
	"diagnostics": {
		id: "details.nav.diagnostics",
		defaultMessage : "Процедуры и стоимость"
	},
	"accommodation": {
		id: "details.nav.accommodation",
		defaultMessage : "Условия размещения"
	},
});

export default DetailsTabsMsg;