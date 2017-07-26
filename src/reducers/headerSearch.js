import * as constants from "../constants/index.js"

const initialState = {
  fetch: false,
	results: undefined
};

export default function header_search( state = initialState, action ) {
  switch (action.type) {
    case constants.HEADER_SEARCH_SUCCESS:
      return {...state, results: action.payload, fetch: false };

    default:
      return state
  }
}