import API from "./API.js"
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import forEach from "lodash/forEach";

import SearchService from "./SearchService";
import LayoutService from "./LayoutService";
import DetailsService from "./DetailsService";
import HomeService from "./HomeService";

export default API
export {SearchService, LayoutService, DetailsService, HomeService}
