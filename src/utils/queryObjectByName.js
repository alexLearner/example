export default (obj, names) => {
	let result = {};

	names.forEach(name =>
		obj[name] ? result[name] = obj[name] : null
	);

	return result;
};