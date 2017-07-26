import * as c from "../constants/index.js"
import defaultObject from "./vendors/defaultObject"
import transformDefaultObject from "./vendors/transformDefaultObject"

const initialState = {
	// data: undefined,
	// fetched: false,
	reviews: defaultObject,
	reviews_info: defaultObject,
	accommodation: defaultObject,
	doctors: defaultObject,
	procedures: defaultObject
};

export default function details( state = initialState, action ) {
	switch (action.type) {

		case c.DETAILS_GET_CLINIC:
			return {...state, fetched: true, data: action.payload };

		case c.DETAILS_GET_REVIEWS: {
			return transformDefaultObject(state, action, "reviews");
		}

		case c.DETAILS_CLEAR: {
			return initialState;
		}

		case c.DETAILS_GET_REVIEWS_INFO: {
			return transformDefaultObject(state, action, "reviews_info");
		}

		case c.DETAILS_GET_REVIEWS_MORE: {
			return transformDefaultObject(state, action, "reviews", true);
		}

		case c.DETAILS_GET_DOCTORS: {
			return transformDefaultObject(state, action, "doctors");
		}

		case c.DETAILS_GET_DOCTORS_MORE: {
			return transformDefaultObject(state, action, "doctors", true);
		}
		 
		case c.DETAILS_GET_ACCOMMODATION: {
			return transformDefaultObject(state, action, "accommodation");
		}

		case c.DETAILS_GET_PROCEDURES: {
			return transformDefaultObject(state, action, "procedures");
		}

		case c.DETAILS_GET_PROCEDURES_MORE: {
			return transformDefaultObject(state, action, "procedures", true);
		}
		 
		case c.DETAILS_POST_REVIEW: {
			return {...state, review_id: action.payload};
		}
		 
		default:{
			return state
		}
		
	}
}