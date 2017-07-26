import * as c from "../constants"

const initialState = {
	name: false,
	params: {
		id: "",
		id_doctor: "",
		title: ""
	},
	body: null,
	history: [],
	placeholder: ""
};


export default function popup( state = initialState, action ) {
	switch (action.type) {
		case c.SHOW_POPUP: {
			let history = state.history;
			history.push({name: action.payload});

			return { ...state, name: action.payload, history }
		}

		case c.SHOW_POPUP_NO_HISTORY:
			return { ...state, name: action.payload, history: [] };

		case c.POPUP_CLEAR_HISTORY:
			return { ...state, history: [] };

		case c.SHOW_POPUP_MORE: {
			let params = state.params;
			params.link = action.payload.link;
			params.page = action.payload.page;

			let body = [...state.body, ...action.payload.body]

			return {...state, body, params};
		}

		case c.SHOW_PREV_POPUP: {
			let history = state.history,
				body;

			if (!history.length || history.length === 1) return {...state, name: null};

			history.pop();
			body = history[history.length - 1];

			return {...state, ...body}
		}

		case c.CLOSE_POPUP:
			return { ...state, name: null, history: [] };

		case c.SET_PARAMS_POPUP:
			return { ...state, params: action.payload };

		case c.SET_POPUP_PLACEHOLDER:
			return {...state, placeholder: action.payload};

		case c.SET_POPUP_BODY: {
			let
				name = action.payload.name || state.name,
				params = action.payload.params || state.params,
				body = action.payload.body,
				history = state.history;

			if (action.payload.flag) {
				history.push({
					name,
					body,
					params
				})
			}

			return { ...state, body, name, params, history }
		}

		default:
			return state;
	}
}