import API from './API.js';

export default class HomeService extends API {
	constructor() {
		super();
	}

	faq(params, lang) {
		return this.get(`/homepage/faq`, lang,  params)
	}

	media(params, lang) {
		return this.get(`/homepage/media`, lang, params)
	}

	coordinators(params, lang) {
		return this.get(`/homepage/coordinators`, lang, params)
	}

	directions(params, lang) {
		return this.get(`/homepage/directions-info`, lang, params)
	}

	doctors(params, lang) {
		return this.get(`/homepage/doctors-info`, lang, params)
	}

	countries(params, lang) {
		return this.get(`/homepage/countries-info`, lang, params)
	}
}


