import * as c from "../constants"
import {SearchService, HomeService} from '../api'
import defaultGetFactory from "./vendors/defaultGetFactory"

const
	API = new SearchService,
	HOME = new HomeService,
	searchGet = defaultGetFactory(API),
	homeGet = defaultGetFactory(HOME);

export const getReviews = (params, isMore = false) =>
	searchGet("reviews", c.HOME_GET_REVIEWS, undefined, params, isMore);

export const getProcedures = (params, isMore = false) =>
	searchGet("procedures", c.HOME_GET_PROCEDURES, undefined, params, isMore);

export const getOperations = (params, isMore = false) =>
	searchGet("procedures", c.HOME_GET_OPERATIONS, undefined, {...params, type: "operation"}, isMore);

export const getDiagnotics = (params, isMore = false) =>
	searchGet("procedures", c.HOME_GET_DIAGNSOTICS, undefined, {...params, type: "diagnostic"}, isMore);

export const getClinics = (params, isMore = false) =>
	searchGet("clinics", c.HOME_GET_CLINICS, undefined, params, isMore);

export const getFaq = (params, isMore = false) =>
	homeGet("faq", c.HOME_GET_FAQ, undefined, params, isMore);

export const getDoctors = (params, isMore = false) =>
	homeGet("doctors", c.HOME_GET_DOCTORS, undefined, params, isMore);

export const getMedia = (params, isMore = false) =>
	homeGet("media", c.HOME_GET_MEDIA, undefined, params, isMore);

export const getCountries = (params, isMore = false) =>
	homeGet("countries", c.HOME_GET_COUNTRIES, undefined, params, isMore);

export const getCoordinators = (params, isMore = false) =>
	homeGet("coordinators", c.HOME_GET_COORDINATORS, undefined, params, isMore);

export const getDirections = (params, isMore = false) =>
	homeGet("directions", c.HOME_GET_DIRECTIONS, undefined, params, isMore);

export const callback = (params, isMore = false) =>
	homeGet("directions", c.HOME_GET_DIRECTIONS, undefined, params, isMore);
