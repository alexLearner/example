export default function(query, store) {
	const
		{
			filters_countries: countries,
			directions,
			deepIllnesses: illnesses,
			deepProcedures: procedures
		} = store.getState().layout,
		alias = (array, name) => {
			if (!+query[name] && query[name]) {
				const elem = array && array.find(e => e.alias === query[name]);
				if (!elem) return null;
				query[name] = elem.id;
				return elem
			}
		};

	const country = alias(countries, "country") || {};

	alias(directions, "direction");
	alias(procedures, "procedure");
	alias(illnesses, "illness");
	alias(country.cities, "city");

	return query;
}