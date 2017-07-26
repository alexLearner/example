import * as constants from "../constants/index.js"

const initialState = {
	country: {
		name: undefined 
	},
	city: {
		name: undefined
	},
	illness: {
		name: undefined
	},
	direction: {
		name: undefined
	},
	procedure: {
		name: undefined,
		type: undefined
	},
	active: 1,
	query: {},
	query_aliases: {}
};

export default function filters( state = initialState, action ) {
	switch (action.type) {

		case constants.FILTER_SET_ILLNESS: 
			return {...state, illness: action.payload};

		case constants.FILTER_SET_DIRECTION:
			return {...state, direction: action.payload};

		case constants.FILTER_SET_ALIASES: {
			return {...state, query_aliases: action.payload}
		}

		case constants.FILTER_CLEAR:
			return {
				...state,
				country: {name: undefined},
				city: {name: undefined},
				direction: {name: undefined},
				illness: {name: undefined},
				procedure: {name: undefined, type: undefined},
				query: {},
				active: true
			};

		case constants.FILTER_SET: {
			return {...state, ...action.payload, query: action.query, active: true}
		}

	  default:
	    return state;
  }
}