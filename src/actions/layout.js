import * as c from '../constants'
import {LayoutService} from '../api'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { updateIntl } from 'react-intl-redux';
import sortBy from "lodash/sortBy"
import isPlainObject from "lodash/isPlainObject"
import store from "store"

const
	LayoutAPI = new LayoutService,
	returnArray = (object, names, innerFieldName) => {

		let
			array = object[names[0]],
			innerArray = object[names[1]],
			result = [];

		// console.log(object)

		array.forEach(item => {
			if (isPlainObject(innerArray)) return result;

			item[names[1]] = innerArray.filter(
				({[innerFieldName]: id}) => id === item.id
			);

			// if (!(item[names[1]] && item[names[1]].length)) {
			// 	return null;
			// }

			result.push(item);
		});

		return result;
	},

	returnCountries = object => returnArray(object, ["countries", "cities"], "country_id"),
	returnDirections = (object) => returnArray(object, ["directions", "illnesses"], "direction_id"),

	buildAlphabet = (dispatch, getState, array) =>
		dispatch({
			type: c.LAYOUT_SET_FILTERS_ALPHABET,
			payload: [
				...getState().layout.filters_alphabet,
				...array.map(e => e.name.charAt(0).toUpperCase().trim())
			]
		});


export const setLang = name =>
	dispatch => {
		dispatch({
			type: c.LAYOUT_SET_LANG,
			payload: name
		});

		return LayoutAPI
			.getLang(name.toLowerCase(), name)
			.then(r => r.json)
			.then(json => dispatch(
				updateIntl({
					locale: name,
					messages: json,
				}))
			)
	};

export const getSEO = (pathname = "/", no_elements = 0) =>
	(dispatch, getState) => {
		let fullUrl = pathname;
		pathname = pathname.toLowerCase();

		console.log("GET")
		const lang = getState().layout.lang,
			test = /\/([a-z]{0,2})(\/[^\s]*)/.exec(pathname);

		if (test) {
			pathname = pathname.replace("/"+test[1], "")
		}

		return LayoutAPI
			.getSEO({
				pathname,
				no_elements
			}, lang)
			.then(r => r.json)
			.then(payload => payload.title && payload.title.length
				? dispatch({
					type: c.LAYOUT_GET_SEO,
					payload: {
						data: payload,
						pathname,
						fullUrl
					}
				})
				: null
			)
	};

export const layoutGetClinicsCount = (params, details = false) =>
	(dispatch, getState) => {
		if (details) {
			let
				details = getState().details.data,
				{
					country_id,
					city_id
				} = details;

			params = {...params, country: country_id, city: city_id};
			delete params.illness;
			delete params.direction;
			delete params.procedure;
		}

		return LayoutAPI
			.getClinicsCount(params, getState().layout.lang)
			.then(r => r.json)
			.then(payload =>
				dispatch({
					type: c.LAYOUT_GET_CLINICS_COUNT,
					payload
				})
			)
	};

export const layoutGetCountries = () =>
	(dispatch, getState) =>
		LayoutAPI
			.getCountries(getState().layout.lang)
			.then(r => r.json)
			.then(payload =>
				dispatch({
					type: c.LAYOUT_GET_COUNTRIES,
					payload: {countries: payload}
				})
			);


const addTypeToArray = (array, type) => array.map(i => {
	i.type = type;
	return i;
});

export function	layoutGetProcedures(params, value, cb) {
	let payloads = {};

	return (dispatch, getState) => {
		const
			lang = getState().layout.lang,
			getProcedure = (type, params) =>
				LayoutAPI
					.getProcedures({...params, fields: ",alias,name,name_komy", type}, lang)
					.then(r => r.json)
					.then(r => payloads[type] = r);

		return Promise
			.all([
				getProcedure("operation", params, lang),
				getProcedure("diagnostic", params, lang)
			])
			.then(() => {
				payloads.operation = addTypeToArray(payloads.operation, "operation");
				payloads.diagnostic = addTypeToArray(payloads.diagnostic, "diagnostic");
				const result = sortBy(
					[...payloads["operation"], ...payloads["diagnostic"]],
					[(e) => e.name]
				);

				if (cb) {
					cb(dispatch, getState, result)
				}

				dispatch({
					type: value || c.LAYOUT_GET_PROCEDURES,
					payload: result
				})
			})
	}
}

export const layoutSetFiltersCountriesDeep = () => (dispatch, getState) => dispatch({
	type: c.LAYOUT_GET_FILTERS_COUNTRIES,
	payload: getState().layout.deepCountries
});

export const layoutGetFiltersCountries = (params, value, cb) =>
	(dispatch, getState) => {
		let payloads = {};
		const lang = getState().layout.lang;

		return Promise.all([
			LayoutAPI
				.getFiltersCountries(params, lang)
				.then(r => r.json)
				.then(payload => payloads["countries"] = payload)
			,
			LayoutAPI
				.getFiltersCities(params, lang)
				.then(r => r.json)
				.then(payload => {
					payloads["cities"] = payload;
					if (value) {
						dispatch({
							type: c.LAYOUT_GET_CITIES,
							payload
						})
					}
				})
		])
		.then(() => {
			let result = returnCountries(payloads);

			if (cb) {
				cb(dispatch, getState, result)
			}

			return dispatch({
				type: value || c.LAYOUT_GET_FILTERS_COUNTRIES,
				payload: result
			})
		})
	};

export const layoutSetCurrentCountry = payload =>
	(dispatch, getState) => {
		let
			countries = getState().layout.countries,
			obj = "id",
			index = 47,
			country;

		if (!parseInt(payload)) {
			obj = "country_code";
		}

		country = countries.find((c,i) => {
			if (c[obj] == payload) {
				index = i;
				return true;
			}
		}) || countries.find((c, i) => {
				if (c.country_code === "UA") {
					index = i;
					return true;
				}
			});

		if (canUseDOM) {
			store.set("geo_country", payload);
		}

		// if (countries.length === 1) {
		// 	country = countries[0];
		// }
		//
		// console.log("SET CURRENT COUNTY", {...country, index}, payload, countries)

		dispatch({
			type: c.LAYOUT_CHANGE_COUNTRY,
			payload: {...country, index}
		})
	};


export const layoutSetDirectionsDeep = () => (dispatch, getState) => dispatch({
	type: c.LAYOUT_GET_DIRECTION,
	payload: returnDirections({
		directions: getState().layout.deepDirections,
		illnesses: getState().layout.deepIllnesses,
	})
});

export const layoutSetProceduresDeep = () => (dispatch, getState) => dispatch({
	type: c.LAYOUT_GET_PROCEDURES,
	payload: getState().layout.deepProcedures
});


export const layoutGetDirections = (params, cb) =>
	(dispatch, getState) => {
		let
			payloads = {},
			lang = getState().layout.lang,
			mas = [
				LayoutAPI
					.getDirections(params, lang)
					.then(r => r.json)
					.then(payload => {
						payloads["directions"] = payload
					}),

				LayoutAPI
					.getIllnesses(params, lang)
					.then(r => r.json)
					.then(payload => payloads["illnesses"] = payload)
			];

		return Promise
			.all(mas)
			.then(() => {
				if (cb) {
					cb(dispatch, getState, payloads.directions);
					cb(dispatch, getState, payloads.illnesses);

					return dispatch({
						type: c.LAYOUT_GET_DEEP_DIRECTIONS,
						payload: {
							deepDirections: payloads.directions,
							deepIllnesses: payloads.illnesses,
						}
					})
				}

				return dispatch({
					type: c.LAYOUT_GET_DIRECTION,
					payload: returnDirections(payloads)
				});

			})
	};

export const layoutGetDeepDirections = () => layoutGetDirections({}, buildAlphabet);

export const layoutClearClinicsCount = () => ({type: c.LAYOUT_GET_CLINICS_COUNT});

export const setServerData = (payload = {}) => ({type: c.LAYOUT_SET_SERVER_DATA, payload});

export const layoutSetVisiblePhone = () => ({type: c.LAYOUT_SET_VISIBLE_PHONE});

export const layoutGetDeepCountries = () => layoutGetFiltersCountries({}, c.LAYOUT_GET_DEEP_COUNTRIES, buildAlphabet);

export const layoutSetWrapper = payload => ({type: c.LAYOUT_SET_WRAPPER, payload});

export const layoutGetDeepProcedures = () => layoutGetProcedures({}, c.LAYOUT_GET_DEEP_PROCEDURES, buildAlphabet);



