import * as actions from '../../../actions/'
import transformQuery from "./transformQuery";

export default function tabFetchData(dispatch, params = {}, nameFunc, query, name) {
	const 
			isArray = nameFunc.constructor === Array,
			retunrFn = (name) => dispatch( actions.details[name](params.clinic, data) );

	let 
			fns,
			data = query || {};

	data = transformQuery(data, name);
	data["per-page"] = 10;

	if (!isArray) {
		fns = [ retunrFn(nameFunc) ]
	}
	else {
		fns = nameFunc.map(item => retunrFn(item));	
	}

  return Promise.all(fns);
}