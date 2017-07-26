import React, {PureComponent} from 'react';
import DetailsGallery from '../Gallery';
import DetailsBanner from '../Banner';
import DetailsTabs from '../Tabs';
import {Link} from "react-router"
import {SVG, RatingList} from '../../UI';
import {isMobile, isTablet} from '../../../functions/viewport';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import msg from "./msg"
import isEqual from "lodash/isEqual"

const
	rc = addElementFunc("details"),
	Details = tx([{ className: "details" }])('section'),
	Header = tx([{ name: 'header' }, rc])('header'),
	HeaderRight = tx([{ name: 'header_right' }, rc])('div'),
	HeaderLeft = tx([{ name: 'header_left' }, rc])('div'),
	Title = tx([{ name: 'title' }, rc])('h1'),
	SubTitle = tx([{ name: 'subtitle' }, rc])('div'),
	Body = tx([{ name: 'body' }, rc])('div');

export default class DetailsContainer extends PureComponent {
	constructor(props) {
		super(props);

		this.consultation = this.consultation.bind(this);
		this.scrollBody = this.scrollBody.bind(this);
		this.goToTab = this.goToTab.bind(this);

		this.state = {scrolled: false}
	}

	goToTab(e, active) {
		this.refs.tab.active(e, active);
	}

	shouldComponentUpdate({details}) {
		return !isEqual(details, this.props.details)
	}

	consultation() {
		let object = {id: this.props.item.alias};

		ga('send', 'event', 'Form',  'Button pressed', window.location.pathname);
		this.props.actions.setPopupBody(undefined, "get_cost", object)
	}

	componentDidMount() {
		this.scrollBodyClass = this.scrollBody();
		this.scrollBodyClass.init();
		this.scrollBodyClass.addEvent();
	}

	componentWillUnmount() {
		this.scrollBodyClass.remove();
	}

	scrollBody() {
		let cache = {};

		const scroll = () => {
			if (isMobile) return;
			const 
					scrollTop = document.body.scrollTop,
					detailsHeader = document.getElementById('details_header'),
					detailsHeaderHeight = detailsHeader.offsetHeight,
					detailHeaderTop = detailsHeader.offsetTop,
					header = document.getElementById('header'),
					headerHeight = header.offsetHeight,
					nav = document.getElementById('details_tabs_nav'),
					navHeight = nav.offsetHeight,
					navTop = nav.offsetTop,
					top = cache.top || detailHeaderTop - headerHeight + detailsHeaderHeight,
					topToNav = cache.topToNav || navTop - headerHeight + navHeight

			if (scrollTop > top) {
				cache.top = top;
				detailsHeader.classList.add("fixed");
				header.classList.add("hide");

				if (!isTablet) {
					if (scrollTop > topToNav) {
						cache.topToNav = topToNav;
						nav.classList.add("fixed");
						detailsHeader.classList.add("hide");

						if (!this.state.scrolled) {
							this.setState({scrolled: true})
						}
					} 
					else if (cache.topToNav) {
						delete cache.topToNav;
						nav.classList.remove("fixed");
						detailsHeader.classList.remove("hide");

						if (!this.state.scrolled) {
							this.setState({scrolled: false})
						}
					}
				}
			} 
			else if (cache.top) {
				delete cache.top;
				detailsHeader.classList.remove("fixed");
				header.classList.remove("hide");
			}
		};

		const scrollEvent = () => {
			scroll();
		};

		return {
			addEvent: () => window.addEventListener("scroll", scrollEvent),
			init: () => scroll(),
			remove: () => window.removeEventListener("scroll", scrollEvent)
		}
	}

	render() {
		const
				{
					filters, 
					layout,
					actions, 
					routing, 
					item,
					details
				} = this.props,
				{
					f,
					pathnames: {clinics: route}
				} = this.context,
				h1 = layout.seo && layout.seo.h1,
				{
					name,
					city_name,
					country_name,
					images,
					address,
					alias,
					is_jsc,
					reviews_avg_rating,
					reviews_count,
					requests,
				} = item,
				footer = (
					<div className="details_header_btn">
						<div
							onClick={this.consultation}
							className="btn btn_red_shadow">
							{f(msg.get_cost)}
						</div>
						<span>{f(msg.deals, {count: requests})}</span>
					</div>
				);

		let
				search = routing.locationBeforeTransitions && routing.locationBeforeTransitions.search || "";

		return (
			<Details>
				<div className="block">
					<Header id="details_header">
						<HeaderLeft>
							<Title>
								{h1 || name}
								{is_jsc ? <img className="icon" src={SVG.JCI} alt=""/> : null}
							</Title>
							<SubTitle>
								<i className="sprite sprite-location" />
								{country_name ? country_name + ", " : null}
								{city_name ? city_name + ", " : null}
								{address}&#160;
								<Link
									to={`/${route}/${alias}/${search}#tab-accommodation`}
									className="link">
									{f(msg.more_about_location)}
								</Link>
							</SubTitle>

							{
								reviews_avg_rating ? (
									<div className="details_header_hidden">
										<RatingList
											disabled
											rating_5={true}
											rating={reviews_avg_rating} />
										<Link
											to={`/${route}/${alias}/${search}#tab-reviews`}
											className="link">
											{f(msg.reviews, {count: reviews_count})}
										</Link>
									</div>
								) : null
							}
						</HeaderLeft>

						<HeaderRight>{footer}</HeaderRight>

					</Header>

					<Body>
						<div className="size3of8">
							<DetailsGallery images={images}/>
						</div>
						<div className="size5of8">
							<DetailsBanner 
								f={f}
								footer={footer}
								goToTab={this.goToTab}
								search={search}
								actions={actions}
								consultation={this.props.consultation} 
								layout={layout} 
								item={item} />
						</div>
					</Body>

					<DetailsTabs
						actions={actions}
						layout={layout}
						ref="tab"
						scrolled={this.state.scrolled}
						details={details}
						filters={filters}
						routing={routing}
						search={search}
						item={item} />
				</div>
			</Details>
		)
	}
}

DetailsContainer.contextTypes = {
  f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};
