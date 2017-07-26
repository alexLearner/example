import * as c from "../constants/index.js"
import defaultObject from "./vendors/defaultObject"
import transformDefaultObject from "./vendors/transformDefaultObject"

const initialState = {items: defaultObject};

export default function articles( state = initialState, action ) {
	switch (action.type) {

		case c.ARTICLES_GET:
			return transformDefaultObject(state, action, "items");

		default:
			return state
	}
}