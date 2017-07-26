import * as c from "../../constants/index.js"

export default function defaultGetFactory(API_CLASS) {
	return function defaultDetailsGet(name, constName, id, params, isMore) {
		let pagination, func;
		const constNameInner = isMore ? constName+"_MORE" : constName;

		return (dispatch, getState) => {
			const lang = getState().layout.lang;

			if (id) {
				func = API_CLASS[name].bind(API_CLASS, id, params, lang)
			}
			else {
				func = API_CLASS[name].bind(API_CLASS, params, lang)
			}

			return func()
				.then(r => {
					pagination = r.headers;
					return r.json
				})
				.then(data => dispatch({
						type: c[constNameInner],
						payload: {
							pagination,
							data
						}
					})
				)
		}	
	}
}
