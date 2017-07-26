import * as c from "../constants/index.js"
import defaultObject from "./vendors/defaultObject"
import transformDefaultObject from "./vendors/transformDefaultObject"

const initialState = {
	reviews: defaultObject,
	doctors: defaultObject,
	procedures: defaultObject,
	clinics: defaultObject,
	diagnostics: defaultObject,
	operations: defaultObject,
	faq: defaultObject,
	media: defaultObject,
	coordinators: defaultObject,
	directions: defaultObject,
	countries: defaultObject,
};

export default function details( state = initialState, action ) {
	switch (action.type) {
		case c.HOME_GET_REVIEWS:
			return transformDefaultObject(state, action, "reviews");

		case c.HOME_GET_CLINICS:
			return transformDefaultObject(state, action, "clinics");

		case c.HOME_GET_DOCTORS:
			return transformDefaultObject(state, action, "doctors");

		case c.HOME_GET_PROCEDURES:
			return transformDefaultObject(state, action, "procedures");

		case c.HOME_GET_OPERATIONS:
			return transformDefaultObject(state, action, "operations");

		case c.HOME_GET_DIAGNSOTICS:
			return transformDefaultObject(state, action, "diagnostics");

		case c.HOME_GET_FAQ:
			return transformDefaultObject(state, action, "faq");

		case c.HOME_GET_MEDIA:
			return transformDefaultObject(state, action, "media");

		case c.HOME_GET_COORDINATORS:
			return transformDefaultObject(state, action, "coordinators");

		case c.HOME_GET_COUNTRIES:
			return transformDefaultObject(state, action, "countries");

		case c.HOME_GET_DIRECTIONS:
			return transformDefaultObject(state, action, "directions");

		default:
			return state
	}
}