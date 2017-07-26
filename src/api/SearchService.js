import API from './API.js';

export default class SearchService extends API {
	constructor() {
		super();
	}

	doctor(id, params, lang) {
		return this.get(`/doctors/${id}`, lang, params);
	}

	directions(params, lang) {
		return this.get(`/recommended/directions`, lang, {...params, expand: "illnesses"});
	}

	cities(params, lang) {
		return this.get(`/recommended/cities`, lang, params);
	}

	countries(params, lang) {
		return this.get(`/recommended/countries`, lang, params);
	}

	recommendedArticle(params, lang) {
		let _params = {...params};
		delete _params["city"];

		return this.get(`/recommended/articles`, lang, _params);
	}

	illnesses(params, lang) {
		return this.get(`/recommended/illnesses`, lang, params);
	}

	doctors(params, lang) {
		return this.get(`/doctors`, lang, params, true);
	}

	clinics(params, lang) {
		return this.get(`/clinics`, lang, params, true);
	} 

	search(string, lang) {
		return this.get(`/searches`, lang, {string});
	}

	callback(body, lang) {
		return this.post(`/request/callback`, body, lang)
	}

	getCost(body, lang) {
		return this.post(`/request/cost-of-treatment`, body, lang)
	}

	getConsultation(body, lang) {
		return this.post(`/request/consultation`, body, lang)
	}

	review(id, lang, params) {
		return this.get(`/reviews/${id}`, lang, {fields: "city,country,country_flag,date_nice,helpfulness,id,name,rating,snippet,type"})
	} 

	reviews(params, lang) {
		return this.get(`/reviews`, lang, params, true);
	} 

	compare(params, lang) {
		return this.get(`/countries/for-block-comparison`, lang, params)
	}

	procedures(params, lang) {
		return this.get(`/procedures`, lang, params, true)
	}

	procedure(id, params, lang) {
		return this.get(`/procedures/${id}`, lang, params)
	}

	hotels(id, lang) {
		return this.get(`/hotels/summary-for-clinics-list?clinic=${id}`, lang)
	}

	flights(params, lang) {
		return this.get(`/flights/summary-for-clinics-list`, lang, params);
	}

	recommended(params, lang) {
		return this.get(`/recommended/no-clinics`, lang, params)
	}

	article(params, lang) {
		return this.get(`/listing-article`, lang, params)
	}

	info(params, lang) {
		return this.get(`/listing-info`, lang, params)
	}

	articles(params, lang) {
		return this.get(`/articles/for-interesting-block`, lang, {...params, "per-page": 10})
	}
}
