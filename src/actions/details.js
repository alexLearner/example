import * as c from "../constants"
import {DetailsService} from '../api'
import {setPopupBody, popupClearHistory} from "./popup.js"
import defaultGetFactory from "./vendors/defaultGetFactory"

const
	DetialsAPI = new DetailsService,
	get = defaultGetFactory(DetialsAPI);

export const detailsClear = () => ({type: c.DETAILS_CLEAR});

export const getClinic = id =>
	(dispatch, getState) =>
		DetialsAPI
			.clinic(id, getState().layout.lang)
			.then(r => r.json)
			.then(payload => dispatch({
				type: c.DETAILS_GET_CLINIC,
				payload
			}));

export const detailsPostHelpfulness = (id, body) =>
	(dispatch, getState) =>
		DetialsAPI
			.reviewPostHelpfulness(id, body, getState().layout.lang)
			.then(r => [
					{type: c.DETAILS_POST_HELPFULNESS},
					setPopupBody({
							title: r.title,
							subtitle: r.subtitle
						},
						"success"
					)
				].forEach(dispatch)
			);

export const detailsGetReviews = (id, params, isMore = false) =>
	get("reviews", "DETAILS_GET_REVIEWS", id, params, isMore);

export const detailsGetAccommodation = (id, params, isMore = false) =>
	get("accommodation", "DETAILS_GET_ACCOMMODATION", id, params, isMore);

export const detailsGetDoctors = (id, params, isMore = false) =>
	get("doctors", "DETAILS_GET_DOCTORS", id, params, isMore);

export const detailsGetProcedures = (id, params, isMore = false) =>
	get("procedures", "DETAILS_GET_PROCEDURES", id, params, isMore);

export const detailsGetReviewsInfo = (id, params, isMore = false) =>
	get("reviewsInfo", "DETAILS_GET_REVIEWS_INFO", id, params, isMore);

export const detailsPostReview = body =>
	(dispatch, getState) =>
		DetialsAPI
			.postReview(body, undefined, getState().layout.lang)
			.then(r => [
					popupClearHistory(),
					setPopupBody({
							title: r.title,
							subtitle: r.subtitle || "Мы обязательно прочитаем и сделаем выводы!"
						},
						"success"
					)
				].forEach(dispatch)
			)
			.catch(() => dispatch(setPopupBody({}, "error")));