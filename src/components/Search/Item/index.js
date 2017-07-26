import React, {PureComponent} from 'react';
import SearchGallery from '../Gallery';
import SearchTabs from '../Tabs';
import Transfer from '../../Places/Hotels';
import {Link} from 'react-router';
import {RatingList, Tooltip, SVG} from '../../UI';
import {FormattedMessage, defineMessages} from 'react-intl';
import SearchItemContent from './Content';
import SearchCountryBtn from './CountryBtn';
import SearchService from '../../../api/SearchService';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles.js';
import booking from '../../../assets-front/img/booking.png'
import fligth from '../../../assets-front/img/fligth.png'
import isEqual from "lodash/isEqual"

const
	API = new SearchService,
	rc = addElementFunc("search"),
	NavItem = tx([{ name: 'tabs_nav_item' }, rc])('li'),
	msg = defineMessages({
		info: {
			id: "search.nav.info",
			defaultMessage : "Описание"
		},
		reviews: {
			id: "search.nav.reviews",
			defaultMessage : "Отзывы"
		},
		test: {
			id: "search.nav.addkey",
			defaultMessage : "addkey"
		},
		doctors: {
			id: "search.nav.doctors",
			defaultMessage : "Специалисты"
		},
		diagnostics: {
			id: "search.nav.diagnostics",
			defaultMessage : "Стоимость услуг"
		},
		flights: {
			id: "search.nav.flights",
			defaultMessage : "Стоимость перелёта"
		},
		hotels: {
			id: "search.nav.hotels",
			defaultMessage : "Отели"
		},
		transfer_cost: {
			id: "search.nav.transfer_cost",
			defaultMessage : "Стоимость перелета"
		},
		transfers: {
			id: "search.nav.transfers",
			defaultMessage : "Перелёты"
		},
	});

export default class SearchItem extends PureComponent {
	constructor( props, {f} ) {
		super ( props );

		this.state = {
			active: "info",
			active_content: false,
			data: {},
			payload: {
				hotels: {},
				flights: {}
			}
		};

		this.active = this.active.bind(this);
		this.getCost = this.getCost.bind(this);
		this.returnNav = this.returnNav.bind(this);
		this.toggleContent = this.toggleContent.bind(this);
		this.getHotelsAndTransfer = this.getHotelsAndTransfer.bind(this);

		this.tabs = {
			info: f(msg["info"]),
			reviews: f(msg["reviews"]),
			doctors: f(msg["doctors"]),
			diagnostics: f(msg["diagnostics"]),
			flights: f(msg["flights"])
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !isEqual(nextState, this.state);
	}

	componentDidMount() {
		this.getHotelsAndTransfer();
	}

	getHotelsAndTransfer() {
		let
			data = {},
			flight_departure_country = this.props.layout.serverData.client_geo_country_id,
			lang = this.props.layout.lang,
			{id} = this.props.item;

		Promise
			.all([
				API
					.hotels(id, lang)
					.then(r => r.json)
					.then(r => data.hotels = r),
				API
					.flights({clinic: id, flight_departure_country}, lang)
					.then(r => r.json)
					.then(r => data.flights = r),
			])
			.then(() => this.setState({payload: data}))
	}

	active(active) {
		this.setState({active})
	}

	getCost() {
		this.props.actions.setPopupParams({
			id: this.props.item.id
		});
		this.props.actions.showPopup("get_cost")
	}

	toggleContent() {
		this.setState({active_content: !this.state.active_content})
	}

	returnNav() {
		const
			navs = ["info", "reviews", "doctors", "diagnostics"],
			item = this.props.item,
			{
				reviews_count,
				doctors_count,
				diagnostic_count,
				operation_count
			} = item,
			disabled = {
				reviews: !reviews_count || !reviews_count === "0",
				doctors: !doctors_count || !doctors_count === "0",
				diagnostics: !diagnostic_count && !operation_count
			},
			counts = {
				reviews: reviews_count || null,
				doctors: doctors_count || null,
			};

		return navs.map((nav, index) => (
			<NavItem
				key={index}
				disabled={disabled[nav]}
				active={nav === this.state.active}
				onClick={() => this.active(nav)}
				>
				{this.tabs[nav]}
				<span>{counts[nav]}</span>
			</NavItem>
		))
	}

	render() {
		let
				img,
				isHotelsVisible,
				isFlightsVisible,
				nav = this.returnNav(),
				country_from,
				linkToClinic,
				search = "";

		const
				{
					f,
					pathnames: {clinics: route, s_host}
				} = this.context,
				{
					payload: {
						hotels,
						flights
					},
					active,
					preloader,
					data
				} = this.state,
				{
					images,
					rating_bookimed,
					name,
					city_name,
					country_name,
					brief_title,
					requests,
					reviews_count,
					texts,
					id,
					alias,
					country_id,
				} = this.props.item,
				{
					item, 
					actions,
					filters,
					layout
				} = this.props,
				{
					countries,
					current_country,
					current_country_index
				} = layout,
				info_text = item.texts.txt_short,
				rating = item.reviews_avg_rating,
				country_ = countries.find(e => e.id == country_id) || {},
				country_img = s_host + country_.img;
				// country_img = current_country && s_host + current_country.img;

		if (flights.cheap_price && flights.promotional_price) {
			isFlightsVisible = true;
		}

		if (hotels.cheap_price || hotels.promotional_price) {
			isHotelsVisible = true;
		}

		if (countries) {
			img = s_host + current_country.img;
			country_from = current_country.name
		}

		linkToClinic = `/${route}/${alias}/${search}`;

		return (
			<div className="search_item">
				<div className="search_item_head">
					<SearchGallery
						link={linkToClinic}
						images={images} />

					<div className="search_info">
						<div className="search_info_left">
							<div
								className="search_title black">
								<Link
									className="black"
									to={linkToClinic}>
									{name}
								</Link>
								{
									rating
										? <RatingList
												disabled
												lang={layout.lang}
												link={`/${route}/${alias}/#tab-reviews`}
												tooltip={!!reviews_count}
												id={id}
												rating_5={true}
												rating={rating.toFixed(1)} />
										: <div/>
								}

							</div>
							<div className="search_subtitles">
								<div className="search_location">
									<i className="sprite sprite-location" />
									{city_name},&#160;{country_name}
								</div>

								{
									isFlightsVisible ? (
										<Tooltip
											icon={SVG.flights}
											className="circle"
											title={f(msg.transfers)}>
											<Transfer
												innerIcon={fligth}
												innerTitle={f(msg.transfer_cost)}
												country_from={country_from}
												country_name={country_name}
												country_img={country_img}
												noselect={true}
												img={img}
												flights={true}
												{...flights}
												onClick={() => this.props.actions.showPopup("popup_location")} />
										</Tooltip>
									) : null
								}

								{
									isHotelsVisible ? (
										<Tooltip
											icon={SVG.acomodation}
											className="circle"
											title={f(msg.hotels)}>
											<Transfer
												options={hotels.available_hotel_types}
												innerIcon={booking}
												country_name={country_name}
												country_img={country_img}
												innerTitle={f(msg.hotels)}
												hotels={true}
												{...hotels}
										 	/>
										</Tooltip>
									) : null
								}
							</div>

							<SearchItemContent
								toggleContent = {this.toggleContent}
								brief_title = {brief_title}
								active_content={this.state.active_content}
								info_text = {info_text}
								id={id}
								actions={actions}
								texts={texts}
							/>
						</div>

						<div className="search_info_right">
							<div className="btn btn_red" onClick={this.getCost}>
								<FormattedMessage
									id="search.get_cost"
									defaultMessage="Получить стоимость лечения" />
							</div>
							<FormattedMessage
								tagName="p"
								id="details.deals"
								values={{count: requests}}
								defaultMessage="{count} обращений"/>
						</div>
					</div>
				</div>
				<ul className="search_tabs_nav">
					{ nav }
				</ul>

				<SearchTabs
					preloader={preloader}
					active={active}
					funcActive = {this.active}
					data={data}
					searchHistory={search}
					{...this.props}
				/>

				<SearchCountryBtn
					filters_countries={layout.filters_countries}
					country_id={item.country_id}
					count={item.similar_clinics}
				  filters={filters}
				/>

			</div>
		)
	}
};

SearchItem.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};