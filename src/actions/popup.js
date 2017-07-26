import * as c from '../constants'
import APIClass, {LayoutService} from '../api'

const
	API = new APIClass,
	LayoutAPI = new LayoutService,
	dispatchPlaceholder = payload => ({type: c.SET_POPUP_PLACEHOLDER, payload: payload.placeholder});

export const setPopupBody = (body, name, params, flag = true) => ({
	type: c.SET_POPUP_BODY,
	payload: {
		body,
		name,
		params,
		flag
	}
});

export const getPlaceholder = params =>
	(dispatch, getState) => {
		const
			query = getState().routing.locationBeforeTransitions.query,
			location = {...query, ...params};

		let resultLocation = {...location};
		delete resultLocation.id;

		if (!resultLocation.clinic) {
			resultLocation.clinic = location.id
		}

		LayoutAPI
			.getPlaceholder(resultLocation)
			.then(r => r.json)
			.then(r => dispatch(dispatchPlaceholder(r)))
	};

export const showPopupMore = link =>
	(dispatch, getState) => {
		let next_link, page;
		return API
			.get(link, getState().layout.lang, undefined, true, true)
			.then(r => {
				next_link = r.headers.next_link;
				page = r.headers.page;

				return r.json;
			})
			.then(body =>
				dispatch({
					type: c.SHOW_POPUP_MORE,
					payload: {
						body,
						link: next_link,
						page 
					}
				})
			)
	};

export const popupClearHistory = () => ({type: c.POPUP_CLEAR_HISTORY});

export const showPopup = name => ({type: c.SHOW_POPUP, payload: name});

export const showPrevPopup = () => ({type: c.SHOW_PREV_POPUP});

export const setPopupParams = payload => ({type: c.SET_PARAMS_POPUP, payload});

export const closePopup = () => ({type: c.CLOSE_POPUP, payload: false});
