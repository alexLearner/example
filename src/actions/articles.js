import {SearchService} from '../api';
import defaultGetFactory from './vendors/defaultGetFactory';

let SearchAPI = new SearchService;
const get = defaultGetFactory(SearchAPI);

export const getArticles = (params, isMore = false) =>
	get("articles", "ARTICLES_GET", undefined, params, isMore);
