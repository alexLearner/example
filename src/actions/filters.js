import * as constants from '../constants';

export const filtersSetCountry = payload =>
	dispatch => [
		{type: constants.FILTER_SET_COUNTRY, payload},
		{}
	].forEach(dispatch);


export const filtersSetIllness = payload => ({type: constants.FILTER_SET_ILLNESS, payload});

export const filtersSetDirection = payload => ({type: constants.FILTER_SET_DIRECTION, payload});

export const filtersClear = () => ({type: constants.FILTER_CLEAR});

export const setFiltersAliases = payload => ({type: constants.FILTER_SET_ALIASES, payload});

const
	check = (elem, value, name) => !name
		? value == elem.id || value == elem.alias
		: value == elem[name]
	,
	findElem = (array, value) => array && value
		? array.find(elem => check(elem, value))
		: {};

export const setFilters = query =>
	(dispatch, getStore) => {
		let
			{
				directions,
				deepCountries: countries,
				deepProcedures: procedures,
				deepIllnesses: illnesses
			} = getStore().layout,
			{
				country,
				city,
				direction,
				illness,
				procedure
			} = query;

		let countryItem = findElem(countries, country) || {};

		if (!procedures) {
			procedures = getStore().layout.procedures;
		}

		dispatch({
			type: constants.FILTER_SET,
			payload: {
				country: countryItem,
				city: findElem(countryItem.cities, city),
				direction: findElem(directions, direction),
				procedure: findElem(procedures, procedure),
				illness: findElem(illnesses, illness),
			},
			query
		})
	};
