import API from "./API.js"

export default class LayoutService extends API {
	constructor() {
		super();
	}

	getCountries(lang) {
		return this.get(`/countries`, lang, {filter: "show_hidden"})
	}

	getFiltersCountries(params, lang) {
		return this.get(`/countries`, lang, {...params, filter: "has_clinics"})
	}

	getFiltersCities(params, lang) {
		return this.get(`/cities`, lang, {...params, filter: "has_clinics"})
	}

	getPlaceholder(params, lang) {
		return this.get(`/placeholders`, lang, params)
	}

	getDirections(params, lang) {
		return this.get(`/directions`, lang, {...params, fields: "alias,id,name,name_exception,name_kogo", filter: "has_clinics"})
	}

	getIllnesses(params, lang) {
		return this.get(`/illnesses`, lang, {...params, fields: "alias,direction_id,name,name_exception,name_kogo", pagination: 0, filter: "has_clinics"});
	}

	getProcedures(params, lang) {
		return this.get(`/procedures`, lang, {...params, fields:"name,alias", pagination: 0, filter: "has_clinics"})
	}

	getLang(name, lang) {
		return this.get(`/dictionary`, lang)
	}

	getClinicsCount(params, lang) {
		return this.get(`/clinics-count`, lang, params)
	}

	getSEO(params, lang) {
		return this.get(`/page-seo`, lang, params)
	}
}
