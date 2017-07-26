import {defineMessages} from 'react-intl';

const searchMsg = defineMessages({
	popularity_dir_treatment: {
		defaultMessage: "Популярные методы лечения и диагностики {name}",
		id: "search.content.popularity_dir_treatment"
	},
	also_search_in_country: {
		defaultMessage: "Пациенты также ищут лечение {name} в странах:",
		id: "search.content.also_search_in_country"
	},
	search: {
		defaultMessage: "Чаще всего ищут:",
		id: "search.content.search"
	},
	lead_with: {
		defaultMessage: "{name} проводят при:",
		id: "search.content.lead_with"
	},
	choose_clinic_by_city: {
		defaultMessage: "Выбирайте клиники {name} по городам:",
		id: "search.content.choose_clinic_by_city"
	},
	aslo_search_in: {
		defaultMessage: "Чаще всего в {name} ищут:",
		id: "search.content.aslo_search_in"
	},
	popularity_dir: {
		defaultMessage: "Популярные медицинские направления {name}:",
		id: "search.content.popularity_dir"
	}
});

export default searchMsg;
