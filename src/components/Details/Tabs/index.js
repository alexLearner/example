import React, {PureComponent} from 'react';
import {isMobile} from '../../../functions/viewport';
import tx from 'transform-props-with';
import cx from "classnames";
import addElementFunc from '../../../functions/elementStyles';
import forEach from "lodash/forEach"
import scrollToElement from "../../../functions/scrollToElement";
import {Link} from "react-router"
import Accommodation from "../Accommodation"
import Doctors from "../Doctors"
import Reviews from "../Reviews"
import Procedures from "../Procedures"
import Info from "../Info"
import msg from "./msg"

const rc = addElementFunc("details_tabs");
const 
	Tabs = tx([{ className: "details_tabs" }])('div'),
	Nav = tx([{ name: 'nav' }, rc])('div'),
	Circle = tx([{ name: 'nav_circle' }, rc])('div'),
	// Link = tx([{ name: 'nav_item' }, rc])('a'),
	NavMobile = tx([{ name: 'nav_mobile' }, rc])('div'),
	Body = tx([{ name: 'body' }, rc])('div');

const
	INFO = "info",
	REVIEWS = "reviews",
	DOCTORS = "doctors",
	DIAGNOSTICS = "diagnostics",
	ACCOMMODATION = "accommodation",
	NAV_ELEMENTS = {
		[INFO]: <Info />,
		[DIAGNOSTICS]: <Procedures />,
		[DOCTORS]: <Doctors />,
		[REVIEWS]: <Reviews />,
		[ACCOMMODATION]: <Accommodation />,
	};

const navs = [INFO, DIAGNOSTICS, DOCTORS, REVIEWS, ACCOMMODATION];

export default class DetailsTabs extends PureComponent {
	constructor(props) {
		super(props);

		this.returnNav = this.returnNav.bind(this);
		this.scrollTo = this.scrollTo.bind(this);
		this.active = this.active.bind(this);

		this.state = {
			active: INFO
		}
	}

	active(e, active) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		this.setState({active});
		scrollToElement("#details_tabs");
	}

	scrollTop(nav) {
		if (!isMobile) return;
		
		const headerHeight = document.getElementById('header').offsetHeight;
		const className = `j-${nav}`;

    const top = document
    	.getElementsByClassName(className)[1]
      .offsetTop;

    window.scrollTo(0, top - headerHeight - 12);
	}

	componentDidUpdate(prevProps) {
		const props = this.props;
		const pathname = props.routing.locationBeforeTransitions.pathname;
		const prevPathname = prevProps.routing.locationBeforeTransitions.pathname;
		let currentNav = INFO;

		if (pathname !== prevPathname) {
			navs.map(nav => {
				if (pathname.indexOf(nav) + 1) {
					currentNav = nav
				}
			});

			this.scrollTop(currentNav);
		}
	}

	scrollTo(element) {
		if (isMobile) {
			const elem = document.getElementsByClassName(element)[1];
			const headerHeight = document.getElementById('header').offsetHeight;
			const top = elem ? elem.offsetTop : 0;

			window.scrollTo(0, top - headerHeight - 10)
		}
	}

	componentDidMount() {
		document
			.getElementById('details_tabs_nav')
			.classList
			.remove("fixed")
	}

	returnNav() {
		const
				{
					f,
					pathnames: {clinics: route}
				} = this.context,
				{item, scrolled} = this.props,
				{active} = this.state,
				{
					reviews_count,
					doctors_count,
					diagnostic_count,
					operation_count,
					alias,
				} = item,
				location = this.props.routing.locationBeforeTransitions,
				disabled = {
					reviews: !reviews_count || !reviews_count === "0",
					doctors: !doctors_count || !doctors_count === "0",
					diagnostics: !diagnostic_count && !operation_count 
				},
				counts = {
					reviews: reviews_count || null,
					doctors: doctors_count || null,
					diagnostics: diagnostic_count + operation_count
				};

		let 
			params = {};

		navs.map(nav => params[nav] = nav);

		return navs.map((nav, index) =>
			<Link
				className={cx("details_tabs_nav_item", {"active": nav === active})}
				to={`/${route}/${alias}/#tab-${nav}`}
				disabled={disabled[nav]}
				key={index}>
				{f(msg[nav])}
				<span>{counts[nav]}</span>
				<Circle><i className="triangle" /></Circle>
			</Link>
		)
	}

	render() {
		const
				{routing} = this.props,
				{active} = this.state,
				pathname =
					(routing && routing.locationBeforeTransitions !== null)
						? routing.locationBeforeTransitions.pathname
						: "",
				Children = React.cloneElement(NAV_ELEMENTS[active], {...this.props}),
				nav = this.returnNav();

		let
				navMobile = [],
				tabs = [],
				isIndex = false;

		navs.map(nav =>
			~pathname.indexOf(nav)
				? isIndex = true
				: undefined
		);

		forEach(NAV_ELEMENTS, (value, key) =>
			tabs.push(
				React.cloneElement(value, {...this.props, hidden: key !== active, key})
			)
		);

		if (nav && isMobile) {
			navMobile = nav.map((item, index) =>
				<div className="details_tabs_nav_wrap" key={index}>
					{item}
					<Body>{tabs[index]}</Body>
				</div>
			)
		}
		
		return (
			<Tabs id="details_tabs">
				<Nav id="details_tabs_nav">
					{nav}
				</Nav>

				<NavMobile>
					{navMobile}
				</NavMobile>

				{
					!isMobile ? (
						<Body>
							{tabs}
						</Body>
					) : null
				}
			</Tabs>
		)
	}
}

DetailsTabs.contextTypes = {
  f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};
