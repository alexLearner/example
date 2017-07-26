import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { intlReducer } from 'react-intl-redux'
import search from './search'	
import filters from './filters'	
import header_search from './headerSearch'	
import popup from './popup'	
import layout from './layout'	
import articles from './articles'	
import details from './details'	
import home from './home'

export default combineReducers({
	routing: routerReducer,
	search,
	filters,
	header_search,
	popup,
	layout,
	home,
	articles,
	details,
	intl: intlReducer
})

