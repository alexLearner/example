import forEach from "lodash/forEach"

export const CONSTANTS = {
	doctors: {
		fn: "detailsGetDoctors",
		name: "doctors"
	},
	reviews: {
		fn: ["detailsGetReviews", "detailsGetReviewsInfo"],
		name: "reviews"
	},
	accommodation: {
		fn: "detailsGetAccommodation",
		name: "accommodation"
	},
	procedures: {
		fn: "detailsGetProcedures",
		name: "procedures"
	}
};

const NAMES = [
 "direction",
 "procedure",
 "procedure_type",
	"illness"
];

export default function transformQuery(q, name) {
	let 
			query = q,
			newQuery = {};

	switch(name) {
		case CONSTANTS.doctors.name:
			forEach(query, (item, key) => {
				if (NAMES.includes(key) && item) {
					newQuery[key+"_on_top"] = item;
				}
			});
			break;

		case CONSTANTS.procedures.name: {
			forEach(query, (item, key) => {
				if (NAMES.includes(key) && item && item.name) {
					newQuery[key] = item;
				}
			});
			break;
		}
	}

	return newQuery;
}