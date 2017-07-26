import React,{Component} from 'react'
import scrollToElement from "../../../functions/scrollToElement";
import transformQuery, {CONSTANTS} from "./transformQuery";
import isArray from "lodash/isArray"
import msg from "../Tabs/msg"

export default class TabMixin extends Component {
	constructor(props) {
		super(props);

		this.tabComponentDidMount = this.tabComponentDidMount.bind(this)
		this.returnMoreButton = this.returnMoreButton.bind(this)
		this.search = this.search.bind(this);
		this.sorting = this.sorting.bind(this);
		this.loadMore = this.loadMore.bind(this);
		this.changeQuery = this.changeQuery.bind(this);
		this.transforQuery = this.transforQuery.bind(this);

		this.state = {
			query: {},
			history: {}
		};

		this.CONSTANTS = CONSTANTS;
		this["per-page"] = 10;
	}

	changeQuery(query) {
		this.setState({query})
	}

	transforQuery(q) {
		const result = transformQuery(q, this.name);
		result["per-page"] = this["per-page"];
		this.setState({history: result});
		return result;
	}

	tabComponentDidMount() {
		const
				isArray = (this.getFunctionName && this.getFunctionName.constructor === Array),
				props = this.props,
				queryFilters = this.transforQuery(props.filters.query),
				location = props.routing.locationBeforeTransitions,
				retunrFunc = (name) => props.actions[name](props.item.id, queryFilters);

		if (props.details[this.name] && !props.details[this.name].fetched) {
			if (isArray) {
				this.getFunctionName.map(name => retunrFunc(name))
			}
			else {
				retunrFunc(this.getFunctionName)
			}
		}
	}

	isMoreButton(pagination) {
		const {page, page_count} = pagination;

		if (!parseInt(page_count)) return false;
		return (page !== page_count);
	}

	returnMoreButton(pagination) {
		const f = this.context.f;
		const isMore = this.isMoreButton(pagination || {});
		let loadMoreText = f(msg.doctors_more);

		switch(this.name) {
		 	case this.CONSTANTS.procedures.name:
		 		loadMoreText = f(msg.procedures_more);
		 		break;
		 	case this.CONSTANTS.reviews.name:
		 		loadMoreText = f(msg.reviews_more);
		 		break;
		 }

		if (isMore) {
			return (
				<div 
					onClick={() => this.loadMore(pagination)}
					className="btn btn_no_border btn_more_details">
					{loadMoreText}
				</div>
			)
		}

		return null;
	}

	loadMore(pagination) {
		const 
			id = this.props.item.id,
			alias = this.props.item.alias,
			name = this.CONSTANTS[this.name].fn,
			query = this.state.query;

		let params = {};

		if (query) {
			params = {...query};
		}

		params["per-page"] = this["per-page"];
		params.page = parseInt(pagination.page) + 1;

		if (isArray(name)) {
			this.props.actions[name[0]](alias, params, true);
		}
		else {
			this.props.actions[name](alias, params, true)
		}
	}

	search(params) {
		const
				alias = this.props.item.alias,
				query = this.state.query,
				name = this.CONSTANTS[this.name].fn;

		this.props.actions[name](alias, {...params, ...query})
	}

	sorting(params) {
		const id = this.props.item.id;
		let name = this.CONSTANTS[this.name].fn;

		if (name.constructor === Array) {
			name = name[0];
		}

		params["per-page"] = this["per-page"];
		
		this.props.actions[name](id, params)
	}
} 

TabMixin.contextTypes = {
  f: React.PropTypes.func
};
