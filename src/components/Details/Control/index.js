import React,{PureComponent} from 'react'
import {RatingList, SelectSearch, Checkbox} from "../../UI"
import ControlRating from "./ControlRating"
import ControlSelected from "./ControlSelected"
import tx from 'transform-props-with';
import {isTablet} from "../../../functions/viewport";
import addElementFunc from "../../../functions/elementStyles";
import msg from "./msg"

const rc = addElementFunc("details_control");

const 
	Control = tx([{ className: "details_control" }])('div'),
	Field = tx([{ name: 'field' }, rc])('div'),
	Header = tx([{ name: 'header' }, rc])('div'),
	Link = tx([{ name: 'link' }, rc])('a'),
	Overlay = tx([{ name: 'overlay' }, rc])('div');


let rating_filters = [];
for (let i = 1; i < 6; i++) {
	const label = i ? `Рейтинг ${i}` : "По всем";

	rating_filters.push({
		label,
		value: i
	})
}

function getElementByValue(value) {
	return rating_filters.find(item => item.value === value) || {};
}

export default class ControlClass extends PureComponent {
	constructor(props) {
		super(props);

		this.sorting = this.sorting.bind(this);
		this.submit = this.submit.bind(this);
		this.toogle = this.toogle.bind(this);
		this.toogleReset = this.toogleReset.bind(this);
		this.filtering = this.filtering.bind(this);
		this.filteringRating = this.filteringRating.bind(this);
		this.clickRating = this.clickRating.bind(this);
		this.reset = this.reset.bind(this);
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
		this.getQuery = this.getQuery.bind(this);
		this.resetRating = this.resetRating.bind(this);
		this.setQueryLabels = this.setQueryLabels.bind(this);

		this.selects = [];

		this.state = {
			active: false,
			history: true,
			query: {},
			tabletSubmit: false,
			rating: undefined,
			queryNames: {}
		}
	}

	setQueryLabels(name, label) {
		return {...this.state.queryLabels, [name]: label};
	}

	getQuery() {
		const
				{query, history} = this.state,
				queryHistory = this.props.history;

		if (history) {
			return {...query, ...queryHistory}
		} 

		return query;
	}

	sorting({value, label}, name) {
		let query = this.getQuery();
		query.sort = value;

		this.setState({
			query,
			queryLabels: this.setQueryLabels(name, label)
		});

		if (!isTablet) {
			this.props.changeQuery(query);
			this.props.sortingChange(query);
		}
	}

	filtering({name, value, label}, nameQuery) {
		let query = this.getQuery();
		query[name] = value;

		this.setState({
			query,
			queryLabels: this.setQueryLabels(nameQuery, label || name)
		});

		if (!isTablet) {
			this.props.changeQuery(query);
			this.props.filteringChange(query)
		}
	}

	clickRating(rating) {
		if (rating.value) {
			rating.label = getElementByValue(rating.value).label;
		}
		else {
			rating.label = "По всем"
		};
		
		this.setState({rating});		
	}

	filteringRating({value, label}) {
		this.filtering({name: "rating", value, label}, "rating");
	}

	resetRating() {
		this.filteringRating({});
	};

	reset() {
		this.setState({
			query: {},
			queryLabels: {},
			tabletSubmit: false,
			reset: true
		}, () => {
			this.setState({reset: false});
			this.submit();
		})
	}

	submit() {
		let query = this.getQuery();
		this.props.changeQuery(query);
		this.props.filteringChange(query);
		this.props.sortingChange(query);
		this.setState({active: false, tabletSubmit: true});
	}

	toogleReset() {
		this.setState({
			history: !this.state.history,
			queryLabels: {},
			reset: true,
			tabletSubmit: false,
		}, () => {
			this.setState({reset: false});
			if (isTablet) {
				this.submit();
			};
		});
	}

	toogle(e) {
		e.preventDefault();
		this.setState({active: !this.state.active})
	}

	componentDidMount() {
		document.body.addEventListener("click", this.handleDocumentClick)
	}

	componentWillUnmount() {
		document.body.removeEventListener("click", this.handleDocumentClick)
	}

	handleDocumentClick(e) {
		const container = this.refs.container;

		if (!container.contains(e.target) && this.state.active) {
      this.toogle(e);
    }
	}

	render() {
		const {
			rating,
			sorting, 
			filters,
			noReviewsHeader,
			filters_data,
			lastCheckbox, 
			afterFitlerCheckbox,
			reviews_info
		} = this.props,
		{f} = this.context,
		data = reviews_info ? reviews_info.data : {},
		{count, medium} = data || {},
		{queryLabels, tabletSubmit, query} = this.state;

		return (
			<Control>
				<Header>
					{ 
						!noReviewsHeader ? (
							<ControlSelected
								f={f}
								onClick={this.toogleReset}
								filters={filters_data}
								queryLabels={tabletSubmit ? queryLabels : {}}
								active={this.state.history}
							/>
						) : <div></div>
					}

					<Link 
						onClick={this.toogle}>
						{f(msg.filter)}
					</Link>

				</Header>
				<Overlay active={this.state.active}>
					<div className="details_control_container" ref="container">
						<Link 
							onClick={this.reset}>
							{f(msg.reset)}
						</Link>					
						{ 
							rating && count ? (
								<Field modifier="rating_title">
									<p>{f(msg.avrg_rating, {count})}</p>
									<RatingList
										rating={medium}
										disabled={true}
										rating_of_5={true} />
								</Field>
							) : null 
						}

						{ 
							rating ? (
								<Field modifier="rating">
									<ControlRating
										f={f}
										rating={query.rating}
										reset={this.resetRating}
										data={reviews_info}
										onClick={this.clickRating} />
								</Field>
							) : null
						}

						{
							rating ? (
								<Field hidden>
									<p>{f(msg.filter_by_rating)}</p>
									<SelectSearch
										reset={this.state.reset}
										options={rating_filters}
										ref={(element) => this.selects.push(element)}
										changedValue={this.state.rating}
										value={rating_filters[0]}
										onChange={this.filteringRating}
									/>
								</Field>
							) : null
						}						

						{
							filters ? (
								<Field>
									<p>{f(msg.filter)}</p>
									<SelectSearch
										reset={this.state.reset}
										ref={(element) => this.selects.push(element)}
										options={filters}
										value={filters[0]}
									/>
								</Field>
							) : null
						}

						{	
							afterFitlerCheckbox ? (
								<Checkbox
									{...afterFitlerCheckbox}
									change={item => this.filtering(item, "first_checkbox")}
								/>
							) : null					
						}				

						{
							sorting ? (
								<Field>
									<p>{f(msg.sort)}</p>
									<SelectSearch
										reset={this.state.reset}
										options={sorting}
										value={sorting[0]}
										onChange={i => this.sorting(i, "sorting")}
									/>
								</Field>
							) : null
						}

						{	
							lastCheckbox ? (
								<Checkbox
									{...lastCheckbox}
									change={item => this.filtering(item, "last_checkbox")}
								/>
							) : null					
						}

						<div onClick={this.submit} className="btn btn_solid_green">
							{f(msg.submit)}
						</div>
					</div>
				</Overlay>
			</Control>
		)
	}
}

ControlClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
	store: React.PropTypes.object
};