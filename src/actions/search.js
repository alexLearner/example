import * as c from '../constants';
import {SearchService} from '../api';
import {setPopupBody, setPopupPagination} from './popup.js';
import defaultGetFactory from './vendors/defaultGetFactory';

const
	SearchAPI = new SearchService,
	get = defaultGetFactory(SearchAPI);

const showSearchPopup = (name, id, val, query, params) =>
	(dispatch, getState) => {
		let pagination = {};

		return SearchAPI[name]
			(id, query, getState().layout.lang)
			.then(r => {
				pagination = r.headers;
				return r.json;
			})
			.then(body =>
				dispatch(setPopupBody(body, val, {...params, ...pagination}))
			)
	};

export const showDoctor = (id, query, params) =>
	(dispatch, getState) => {
		let
			state = getState(),
			{
				direction,
				illness
			} = state.filters.query,
			{
				lang,
				directions
			} = state.layout;

		if (!direction && illness) {
			direction = (directions.find(direction =>
				!!direction.illnesses.find(i => i.id === illness)
			) || {}).id;
		}

		SearchAPI
			.doctor(id, {...query, direction}, lang)
			.then(r => r.json)
			.then(body => dispatch(setPopupBody(body, "doctor", params)))
	};

export const showDoctors = (id, query, params) =>
	showSearchPopup("doctors", id, "doctors", query, params);

export const showProcedure = (id, query, params) =>
	showSearchPopup("procedure", id, "diagnostic", query, params);

export const showProcedures = (query, params) =>
	(dispatch, getState) => {
		let pagination;

		SearchAPI
			.procedures(query, getState().layout.lang)
			.then(r => {
				pagination = r.headers;
				return r.json;
			})
			.then(body =>
				dispatch(setPopupBody(body, "diagnostics_all", {...params, ...pagination}))
			)
	};

export const showReview = (id, params, flag) =>
	(dispatch, getState) =>
		SearchAPI
			.review(id, getState().layout.lang)
			.then(r => r.json)
			.then(body =>
				dispatch(setPopupBody(body, "review", params, flag))
			);

export const showReviews = (query, params) =>
	(dispatch, getState) => {
		let pagination;
		SearchAPI
			.reviews(query, getState().layout.lang)
			.then(r => {
				pagination = r.headers;
				return r.json;
			})
			.then(body =>
				dispatch(setPopupBody(body, "reviews_all", {...params, ...pagination}))
			)
	};

export const getClinics = (body, update = false) =>
	(dispatch, getState) => {
		let pagination, lang = getState().layout.lang;

		dispatch({type: !update ? c.SEARCH_REQ_UPDATE : c.SEARCH_REQ});

		return SearchAPI
			.clinics(body, lang)
			.then(r => {
				pagination = r.headers;
				return r.json;
			})
			.then(payload => {
				if (!(payload && payload.length)) {
					return getRecommended(dispatch, lang, body);
				}

				dispatch({
					type: c.SEARCH_SUCCESS,
					payload: {
						results: payload,
						...pagination,
						update
					}
				});

				dispatch({type: c.CLOSE_POPUP});
		})
	};

const getRecommended = (dispatch, lang, body) =>
	SearchAPI
		.recommended(body, lang)
		.then(r => r.json)
		.then(payload => dispatch({
				type: c.SEARCH_GET_RECOMMENDED,
				payload
			})
		);

export const getRecommendedClinics = body =>
	(dispatch, getState) =>
		getRecommended(dispatch, getState().layout.lang, body);

export const getSearch = q => get("search", c.HEADER_SEARCH_SUCCESS, q);

export const searchGetCompare = params =>
	(dispatch, getState) =>
		SearchAPI
			.compare(params, getState().layout.lang)
			.then(r => r.json)
			.then(payload => dispatch({
				type: params && params.country ? c.SEARCH_COMPARE_ADD: c.SEARCH_COMPARE_SET,
				payload
			}));


export const searchRemoveCompare = payload => ({type: c.SEARCH_REMOVE_COMPARE, payload});

export const searchClear = () => ({type: c.SEARCH_CLEAR});

export const searchGetOperations = params =>
	get("procedures", c.SEARCH_GET_OPERATIONS, undefined, {...params, type: "operation"});

export const searchGetDirections = params =>
	get("directions", c.SEARCH_GET_DIRECTION, undefined, params);

export const searchGetCities = params =>
	get("cities", c.SEARCH_GET_CITIES, undefined, params);

export const searchGetCountries = params =>
	get("countries", c.SEARCH_GET_COUNTRIES, undefined, params);

export const searchGetIllnesses = params =>
	get("illnesses", c.SEARCH_GET_ILLNESSES, undefined, params);

export const searchGetRecommendedArticle = params =>
	get("recommendedArticle", c.SEARCH_GET_RECOMMENDED_ARTICLE, undefined, params);

export const searchGetDiagnotics = params =>
	get("procedures", c.SEARCH_GET_DIAGNSOTICS, undefined, {...params, type: "diagnostic"});

export const searchGetInfo = params =>
	get("info", "SEARCH_GET_INFO", undefined, params);

export const searchGetArticle = params =>
	get("article", "SEARCH_GET_ARTICLE", undefined, params);

// POST FORM
export const callback = (body, name) =>
	(dispatch, getState) => postForm({dispatch, getState}, "callback", body, name);

export const getCost = (body, name) =>
	(dispatch, getState) => postForm({dispatch, getState}, "getCost", body, name);

export const getConsultation = (body, name) =>
	(dispatch, getState) => postForm({dispatch, getState}, "getConsultation", body, name);

const showPopup = (dispatch, r) => [
	setPopupBody({title:r.title, subtitle: r.subtitle}),
	{type: c.SHOW_POPUP_NO_HISTORY, payload: "success"},
	() => {
		if (r.clkLink && r.clkLink.length) {
			setTimeout(() => {
				window.location = window.s_host + r.clkLink;
			}, 500)
		}
	}
].forEach(dispatch);

const showPopupError = dispatch => (dispatch({type: c.SHOW_POPUP, payload: "error"}));

function sendGA({pathaname, title, type, id}) {
	const url = pathaname || window.location.pathname;

	if(yaCounter25987165 != undefined) {
		yaCounter25987165.reachGoal('Order');
	} else {
		console.log('yandexCounter undefined');
	}

	ga('ec:addProduct', {
		'id': url,
		'name': title || document.title,
		'quantity': 1
	});
	ga('ec:setAction', 'purchase', {
		'id': id,
		'revenue': '50',
	});
	ga('send', 'event', 'Request form', type, url, {'nonInteraction': true});
}

const postForm = ({dispatch, getState}, name, body, type) =>
	SearchAPI
		[name](body, getState().layout.lang)
		.then(r => {
			sendGA({
				type,
				id: r.id
			});

			return showPopup(dispatch, r)
		})
		.catch(() => showPopupError(dispatch));
