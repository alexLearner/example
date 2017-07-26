export default function (pathname, query = {}) {
	const array = pathname.split("/");
	let url;

	if (array[1] === "clinics") {
		array.forEach((item, index) => {
			if (index === 0) return;
			const [key, value] = item.split("=");

			if (key && value) {
				query[key] = value;
			}
		});

		url = "/" + array[1] + "?";
		for (let key in query) {
			url = url + key + "=" + query[key] + "&";
		}

		url = url.slice(0, -1);
	}
	else {
		url = pathname;
	}

	return [query, url];
}