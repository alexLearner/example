import forEach from 'lodash/forEach';

export default function(params, query) {
	forEach(params, (value, key) => {
		if (~value.indexOf("=")) {
			value = value.split("=");
			query[value[0]] = value[1]
		}
	});

	return {...query};
}