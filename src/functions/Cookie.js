import Cookie from "cookies-js"
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";

export default {
	push: (name, value) => {
		if (canUseDOM) {
			let val = JSON.parse(Cookie.get(name,  { domain: ".bookimed.com", expires: 360 }) || '[]');
			Cookie.set(name, "", { domain: ".bookimed.com", expires: 360});

			if (isObject(value)) {
				value = [value];
			}

			if (!isArray(val)) {
				val = [val];
			}

			if (isArray(value)) {
				value = [ ...val, ...value];
			}
			else {
				val.push(value);
				value = val;
			}

			Cookie.set(name, JSON.stringify(value), { domain: ".bookimed.com", expires: 360});
		}
		else {
			return () => {}
		}
	},

	get: (name) => {
		if (canUseDOM) {
			let elem = Cookie.get(name, { domain: ".bookimed.com", expires: 360});
			return elem ? JSON.parse(elem) : null;
		}

		return;
	},
	remove: canUseDOM ? Cookie.remove: () => {},

	getTracking() {
		const NAMES = [
			"doctor_ids",
			"procedure_ids",
			"direction_ids",
			"url_history",
			"illness_ids",
			"procedure_ids",
			"country_ids",
			"city_ids",
			"clinic_ids",
		];

		let obj = {};

		NAMES.forEach((value) => {
			let item = this.get(`tracking_${value}`);

			if (item) {
				obj[value.replace("_ids", "")] = item;
			}
			else {
				obj[value.replace("_ids", "")] = []
			}
		});

		return obj;
	}
}