import API from "./API.js"

export default class DetailsService extends API {
	constructor() {
		super();
	}

	clinic(id, lang) {
		return this.get(`/clinics/${encodeURI(id)}`, lang)
	}

	reviews(id, params, lang) {
		return this.get(`/clinics/${encodeURI(id)}/reviews`, lang, params, true);
	} 

	doctors(id, params, lang) {
		return this.get(`/clinics/${encodeURI(id)}/doctors`, lang, params, true);
	} 

	accommodation(id, params, lang) {
		return this.get(`/clinics/${encodeURI(id)}/conditions`, lang, params);
	}

	procedures(id, params, lang) {
		return this.get(`/clinics/${encodeURI(id)}/procedures`, lang, params, true);
	}

	reviewsInfo(id, params, lang) {
		return this.get(`/clinics/${encodeURI(id)}/reviews-details-info`, lang, params, true);
	}

	postReview(body, id, lang) {
		return this.post('/page-reviews', body, lang)
	}

	reviewPostHelpfulness(id, body, lang) {
		return this.post(`/reviews/${encodeURI(id)}/add-helpfulness`, body, lang);
	}
}
