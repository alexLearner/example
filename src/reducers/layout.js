import * as c from "../constants/index.js"
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import uniq from "lodash/uniq"
import Cookie from "../functions/Cookie"

let initialState = {
	country: [],
	countries: [],
	filters_countries: [],
	filters_alphabet: [],
	cities: [],
	illness: [],
	directions: [],
	history: [],
	wrapper: {},
	serverData: {}
};


export default function layout(state = initialState, action) {
	switch (action.type) {
		case c.LAYOUT_SET_COUNTRY:
			return {
				...state, 
				lang: action.payload.lang, 
				country_name: action.payload.country_name
			};

		case c.LAYOUT_SET_WRAPPER:
			return {...state, wrapper: action.payload};

		case c.LAYOUT_GET_DEEP_COUNTRIES:
			return {...state, deepCountries: action.payload};

		case c.LAYOUT_SET_LANG:
			return {...state, lang: action.payload};

		case c.LAYOUT_GET_SEO: {
			let history = [...state.history];
			const {
				title,
				h1
			} = action.payload.data;

			if (canUseDOM) {
				let elem = {
					url: window.location.host + action.payload.fullUrl,
					h1: h1 || title,
					time: Date.now()
				};
				history.push(elem);

				Cookie.push("tracking_url_history", elem);
			}

			return {...state, seo: action.payload.data, history}
		}

		case c.LAYOUT_GET_COUNTRIES:
			return {...state, countries: action.payload.countries};

		case c.LAYOUT_SET_SERVER_DATA:
			return {...state, serverData: action.payload, history: []};

		case c.LAYOUT_SET_VISIBLE_PHONE:
			return {...state, visiblePhone: true};

		case c.LAYOUT_GET_FILTERS_COUNTRIES:
			return {...state, filters_countries: action.payload};

		case c.LAYOUT_CHANGE_COUNTRY:
			return {
				...state,
				current_country: action.payload,
				current_phone: action.payload.tel_lines,
				current_country_id: action.payload.id,
				current_country_index: action.payload.index
			};

		case c.LAYOUT_GET_CLINICS_COUNT:
			return {...state, clinics_count: action.payload};

		case c.LAYOUT_CLEAR_CLINICS_COUNT:
			return {...state, clinics_count: undefined};

		case c.LAYOUT_GET_CITIES:
			return {...state, cities: action.payload };

		case c.LAYOUT_GET_PROCEDURES:
			return {...state, procedures: action.payload };

		case c.LAYOUT_GET_DEEP_PROCEDURES:
			return {...state, deepProcedures: action.payload };

		case c.LAYOUT_GET_ILLNESS:
			return {...state, illness: action.payload };

		case c.LAYOUT_SET_FILTERS_ALPHABET:
			return {...state, filters_alphabet: uniq(action.payload).sort() };

		case c.LAYOUT_GET_DIRECTION:
			return {...state, directions: action.payload };

		case c.LAYOUT_GET_DEEP_DIRECTIONS:
			return {...state, deepDirections: action.payload.deepDirections, deepIllnesses: action.payload.deepIllnesses }

		default:
			return state;
	}
}
