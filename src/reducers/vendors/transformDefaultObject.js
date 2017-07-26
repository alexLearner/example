export default (state, {payload}, name, isMore = false) => {
	const object = {
		fetched: 1,
		data: payload.data,
		pagination: payload.pagination 
	};

	if (isMore) {
		object.data = [...state[name].data, ...payload.data];
	}

	return {
		...state, [name]: object, fetched: true
	}
}
