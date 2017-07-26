import React, {Component} from 'react';
import SearchReviews from '../Reviews';
import SearchProcedures from '../Procedures';
import SearchDoctor from '../Doctor';
import next from '../../../assets-front/img/icons/next.svg';
import {Link} from 'react-router';
import {FormattedMessage, defineMessages, injectIntl} from 'react-intl';
import tx from 'transform-props-with';
import cx from 'classnames';
import addElementFunc from '../../../functions/elementStyles';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

const
	rc = addElementFunc("search_tabs"),
	rt = addElementFunc(""),
	Tabs = tx([{ className: "search_tabs" }])('div'),
	Tab = tx([{ className: "search_tab" }, rt])('div'),
	NavItem = tx([{ name: 'nav_item mobile' }, rc])('div');

const msg = defineMessages({
	more: {
		id: "search.tabs.more",
		defaultMessage: "Читать дальше"
	},
	more_on_clinic: {
		id: "search.tabs.more_on_clinic",
		defaultMessage: "Читать больше на странице клиники"
	},
	"info": { 
		id: "search.nav.info",
		defaultMessage : "Описание" 
	},
	"in": {
		id: "in",
		defaultMessage: "в"
	},
	"reviews": { 
		id: "search.nav.reviews",
		defaultMessage : "Отзывы" 
	},
	"doctors": { 
		id: "search.nav.doctors",
		defaultMessage : "Специалисты" 
	},
	"diagnostics": { 
		id: "search.nav.diagnostics",
		defaultMessage : "Стоимость услуг"
	},
	"flights": { 
		id: "search.nav.flights",
		defaultMessage : "Стоимость перелёта"
	}
});

export default class SearchTabs extends Component {
	constructor( props ) {
		super ( props );

		this.showDoctors = this.showDoctors.bind(this);
		this.isVisibleMore = this.isVisibleMore.bind(this);
		this.showAllReviews = this.showAllReviews.bind(this);
		this.clickOnLink = this.clickOnLink.bind(this);
		this.more = this.more.bind(this);

		this.tabs = [
			{ 
				name: "info",
				title : "Описание" 
			},
			{ 
				name: "reviews",
				title : "Отзывы" 
			},
			{ 
				name: "doctors",
				title : "Специалисты" 
			},
			{ 
				name: "diagnostics",
				title : "Стоимость услуг"
				 },
			{ 
				name: "flights",
				title : "Стоимость перелёта"
			}
		];

		this.state = {
			isMounted: false,
			more: true,
			isVisibleMore: false,
		}
	}

	componentDidMount() {
		this.setState({isMounted: true});
		this.isVisibleMore();
	}

	clickOnLink({target: {tagName, href}}) {
		if (tagName === "A" && ~href.indexOf("#")) {
			this.setState({more: true})
		}
	}


	more() {
		this.setState({more: !this.state.more})
	}

	showDoctors() {
		this.props.actions.showDoctors({
			clinic: this.props.item.id,
			direction_on_top: this.props.filters.direction.id,
			procedure_on_top: this.props.filters.procedure.id,
			procedure_on_top_type: this.props.filters.procedure.type,
		}, {text_title: this.props.item.name_kogo});
	}

	showAllReviews() {
		const {id: clinic, review_ids: ids} = this.props.item;

		this.props.actions.showReviews(
			{clinic},
			{clinic, ids}
		)
	}

	isVisibleMore() {
		if (canUseDOM) {
			const content = this.refs.content;
			if (content.offsetHeight > 160) {
				this.setState({isVisibleMore: true, more: false})
			}
		}
		else {
			return false;
		}
	}
	
	active(name) {
		this.props.funcActive(this.props.active === name ? "" : name);
	}

	render() {
		let info = this.props.item.texts.txt_short;

		const
			{
				f,
				pathnames: {clinics: route}
			} = this.context,
			{
				item,
				preloader,
				active,
				filters,
				actions,
				searchHistory: search,
				data
			} = this.props,
			{
				diagnostic_count,
				operation_count,
				id,
				alias,
				review_ids,
				reviews_count,
				doctors_count
			} = item,
			{
				more,
				isVisibleMore
			} = this.state,
			{
				popularity_doctors: doctors,
				popularity_reviews: reviews,
				popularity_diagnostics: diagnostics,
				popularity_operations: operations,
			} = item;

		return (
			<div className= { preloader ? "search_tabs preloader " : "search_tabs preloader active"} >
				<div className="search_tabs_container">
					<NavItem
						active={active === "info"}
						onClick={() => this.active("info")}>
						{f(msg["info"])}
						<i className="triangle" />
					</NavItem>

					<Tab active={active === "info"}>
						<div
							className={cx(
								"search_place search_place_content noactive search_tabs_info",
								{"hidden": !more}
							)}
						>
							<div
								className="content"
								onClick={this.clickOnLink}
								ref="content"
								dangerouslySetInnerHTML= {{__html: info }} />

							<div
								className={
								cx("search_tabs_info_footer", {hidden: isVisibleMore})}>
								{
									!more
									  ? <div
											className="search_place_btn"
											onClick={this.more}
											>
												{f(msg.more)}
											</div>
										:	<Link
												className="search_place_btn"
												to={`/${route}/${alias}/${search}`}>
												{f(msg.more_on_clinic)}
											</Link>
								}
							</div>
						</div>
						<Link
							to={`/${route}/${alias}/${search}`}
							className="search_tab_nav">
							<img src={next} alt=""/>
							<p>{f(msg.more)}</p>
							<FormattedMessage id="search.nav.on_page" defaultMessage="на странице клиники" />
						</Link>
					</Tab>

					{ 
						reviews_count ? (
							<NavItem
								active={active === "reviews"}
								onClick={this.showAllReviews}>
								{f(msg["reviews"])}
								<i className="triangle" />
							</NavItem>
						) : null
					}

					<Tab active={active === "reviews"}>
						<SearchReviews
							id={id}
							search={search}
							actions={actions}
							ids={review_ids}
							showAllReviews={this.showAllReviews}
							reviews={reviews} />
					</Tab>

					{
						doctors_count ? (
							<NavItem
								active={active === "doctors"}
								onClick={this.showDoctors}>
								{f(msg["doctors"])}
								<i className="triangle" />
							</NavItem>
						) : null
					}

					<Tab active={"doctors" === active}>
						<SearchDoctor
							actions={actions}
							clinic={id}
							showDoctors={this.showDoctors}
							search={search}
							doctors={doctors} />
					</Tab>

					<NavItem
						active={active === "diagnostics"}
						onClick={() => this.active("diagnostics")}>
						{f(msg["diagnostics"])}
						<i className="triangle" />
					</NavItem>

					<Tab active={active === "diagnostics"}>
						<SearchProcedures
							id={id}
							diagnostic_count={diagnostic_count}
							operation_count={operation_count}
							filters={filters}
							actions={actions}
							diagnostics={diagnostics}
							operations={operations} />
					</Tab>
				</div>
			</div>
		) 
	}
};

SearchTabs.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
	store: React.PropTypes.object
};
