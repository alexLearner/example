import fetch from 'isomorphic-fetch';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import isEmpty from "lodash/isEmpty"
import forEach from "lodash/forEach"
import store from "store/storages/sessionStorage"

export default class API {

	constructor({ prefix = 'api/v1' } = {}) {
		this.prefix = prefix;

		this.URL = "https://api.bookimed.com";
		this.auth = "0";
	}

	setStorage(name, item) {
		// if (canUseDOM) {
		// 	store.write(name, JSON.stringify(item));
		// }
	}

	getStorage(name) {
		// if (canUseDOM) {
		// 	store.read(name);
		// }
	}

	fetch(url, obj = {}, lang) {
		// console.log(url, obj)
		obj.headers = {
			"X-Accepted-Language" : lang,
			"Authorization": this.auth,
		};

		// obj.mode = "no-cors";

		return fetch(url, obj);
	}

	post(url, body, lang) {
		if (__DEV__) {
			body.append("testing", 1);
		}

		return this
			.fetch(this.URL + url, {
				method: "POST",
				body
			}, lang)
			.then(r => {
				this.responseErrorHandle(r, url);
				return r.json()
			});
	}

	getPaginationObjet(headers) {
		return {
			count: headers.get("X-Pagination-Total-Count"),
			page: headers.get("X-Pagination-Current-Page"),
			total_page: headers.get("X-Pagination-Page-Count"),
			per_page: headers.get("X-Pagination-Per-Page"),
			page_count: headers.get("X-Pagination-Page-Count"),
		}
	}

	error(err, url, code) {
		if (canUseDOM) {
			ga('send', 'event', 'Error route', code, url);
		}
		else {
			// this.sendGa('Error route', code, url);
		}
	}

	sendGa(name, code, url) {
	 //
	}

	responseErrorHandle(response, url, json) {
		const status = response.status + "";
		const firstChar = status.charAt(0);

		if (firstChar !== "2" || json && isEmpty(json)) {
			this.error(undefined, url, status)
		}
	}

	get(url, lang, params, headers = false, absolute = false) {
		let
			resultUrl = url + this.params(params),
			store = this.getStorage(url),
			storeHeaders = this.getStorage(url+"_H");

		if (store) {
			return new Promise(r => {
				let obj = {json: JSON.parse(store)};

				if (headers) {
					obj.headers = JSON.parse(storeHeaders);
				}

				return r({obj});
			});
		}

		return this
			.fetch(!absolute ? this.URL + resultUrl : resultUrl, {}, lang)
			.then(r => {
				let
					json = r.json(),
					obj = {json},
					headersObj = {};

				if (headers) {
					headersObj = obj.headers = this.getPaginationObjet(r.headers);
					this.setStorage(url+"_H", headersObj);
				}

				json.then(json => {
					this.responseErrorHandle(r, resultUrl, json);
					this.setStorage(url, json);
				});

				return new Promise(r => r(obj))
			})
			.catch(err => this.error(err, resultUrl));

	}

	params(object) {
		if (!object && object !== 0) return "";

		let result = [];
		forEach(object, (val, key) =>
			val || val === 0
				? result.push(encodeURIComponent(key) + '=' + encodeURIComponent(val))
				: null
		);

		return "?" + result.join('&');
	}
}


