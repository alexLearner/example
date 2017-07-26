import * as c from '../constants/index.js';
import defaultObject from './vendors/defaultObject';
import transformDefaultObject from './vendors/transformDefaultObject';

const initialState = {
	// fetch: false,
	// error: false,
	max: 5,
	count: 1,
	loaded: 0,
	// fetched: false,
	// fetch_more: false,
	// results: null,
	// recommended: undefined,
	// compare: null,
	// page: null,
	// per_page: null,
	headerSearch: defaultObject,
	operations: defaultObject,
	recommendedArticle: defaultObject,
	countries: defaultObject,
	directions: defaultObject,
	diagnostics: defaultObject,
	illnesses: defaultObject,
	info: defaultObject,
	cities: defaultObject,
	article: defaultObject,
	articles: defaultObject
};


export default function search( state = initialState, action ) {
	switch (action.type) {

		case c.SEARCH_GET_INFO:
			return transformDefaultObject(state, action, "info");

		case c.HEADER_SEARCH_SUCCESS:
			return transformDefaultObject(state, action, "headerSearch");
			
		case c.SEARCH_CLEAR:
			return {...state, results: undefined, recommended: undefined};

		case c.SEARCH_GET_ARTICLE:
			return transformDefaultObject(state, action, "article");

		case c.SEARCH_GET_COUNTRIES:
			return transformDefaultObject(state, action, "countries");

		case c.SEARCH_GET_CITIES:
			return transformDefaultObject(state, action, "cities");

		case c.SEARCH_GET_DIRECTION:
			return transformDefaultObject(state, action, "directions");

		case c.SEARCH_GET_ILLNESSES:
			return transformDefaultObject(state, action, "illnesses");

		case c.SEARCH_GET_RECOMMENDED_ARTICLE:
			return transformDefaultObject(state, action, "recommendedArticle");

		case c.SEARCH_GET_DIAGNSOTICS:
			return transformDefaultObject(state, action, "diagnostics");

		case c.SEARCH_GET_OPERATIONS:
			return transformDefaultObject(state, action, "operations");

		case c.SEARCH_REQ:
			return {...state, fetch: true };

		case c.SEARCH_REQ_UPDATE:
			return {...state, fetch_more: true };

		case c.SEARCH_SUCCESS: {
			let results = state.results;
			let loaded = 1;

			if (results && results !== null && !action.payload.update) {
				results = [...results, ...action.payload.results];
				loaded = ++loaded;
			}
			else {
				results = action.payload.results
			}
			
			return {
				...state, 
				results,
				fetch: false,
				fetch_more: false,
				fetched: true,
				count: action.payload.count,  
				page_count: action.payload.page_count,
				per_page: action.payload.per_page,
				page: action.payload.page,
				loaded
			}
		}

		case c.SEARCH_COMPARE_SET: {
			if (action.payload && action.payload.length) {
				return {...state, compare: action.payload }
			}
			return state;
		}

		case c.SEARCH_COMPARE_ADD: {
			const MAX = 4;

			let compare = [...state.compare],
					item = action.payload[0],
					temp = !compare.find(e => item.country_id === e.country_id);

			if (temp) {
				if (compare.length < MAX) {
					compare.push(item);
				}
				else {
					compare[MAX - 1] = item;
				}
				return {...state, compare }
			}

			return state
		}

		case c.SEARCH_REMOVE_COMPARE: {
			let compare = [...state.compare];
			compare.splice(action.payload, 1);

			return {...state, compare};
		}

		case c.SEARCH_MORE_SUCCESS: {
			let body = [...state.results, ...action.payload.results];
			const loaded = state.loaded + 1;

			return {...state, results: body, page: action.payload.page, fetch: false, loaded }
		}

		case c.SEARCH_GET_RECOMMENDED:
			return {...state, recommended: action.payload, results: undefined, fetch: false};

		default:
			return state

	}
}
