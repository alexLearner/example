import React, {Component} from 'react';
import {FormattedMessage, defineMessages, injectIntl} from 'react-intl';
import {SelectSearch} from '../UI';
import plain from '../../../assets-front/img/icons/plain.svg';
import cart from '../../../assets-front/img/icons/cart.svg';


const params = {
	hotels_rooms: {
		value: "group_adults",
		prefix: "",
		link_name: "hotels_link"
	},
	hotels_stars: {
		value: "nflt",
		prefix: "class%3D",
		link_name: "hotels_link"
	},
	flights_stars: {
		value: "nflt",
		prefix: "",
		link_name: "flights_link"
	},
	flights_transfer: {
		value: "nflt",
		prefix: "",
		link_name: "flights_link"
	}

}

const msg = defineMessages({
	star_label: {
		defaultMessage: "* отели",
		id: "search.transfer.star_label"
	},

	time_way: {
		defaultMessage: "Время в пути",
		id: "search.transfer.time_way"
	},
	check_bilet: {
		defaultMessage: "Выбрать билеты",
		id: "search.transfer.check_bilet"
	},
	hotels_around: {
		defaultMessage: "Отели рядом",
		id: "search.transfer.hotels_around"
	},
	hotels_armor_early: {
		defaultMessage: "Бронируйте номер заранее",
		id: "search.transfer.hotels_armor_early"
	},
	hotels_armor: {
		defaultMessage: "Забронировать номера	",
		id: "search.transfer.hotels_armor"
	},
	full_day: {
		defaultMessage: "сутки",
		id: "search.full_day"
	},

	room_0: {
		id: "search.transfer.room_0",
		defaultMessage: "room_0"
	},
	room_1: {
		id: "search.transfer.room_1",
		defaultMessage: "1-местный"
	},
	room_2: {
		id: "search.transfer.room_2",
		defaultMessage: "2-местный"
	},
	room_3: {
		id: "search.transfer.room_3",
		defaultMessage: "3-местный"
	},
	room_4: {
		id: "search.transfer.room_4",
		defaultMessage: "4-местный"
	},
	room_5: {
		id: "search.transfer.room_5",
		defaultMessage: "5-местный"
	},
})

class SearchTransport extends Component {
	constructor( props ) {
		super ( props );

		const f = this.props.intlF.formatMessage;

		this.selectChange = this.selectChange.bind(this)
		this.getLink = this.getLink.bind(this)

		this.state = {
			hotels_stars: [],
			mount: false,
			hotels_rooms: [],
			hotels_link: "",
			hotels_initial_link: "",
			flights_classes: [],
			flights_transfers_count: [],
			selected: {
				hotels_stars: null,
				hotels_rooms: null,
				flights_stars: null,
				flights_transfer: null
			}
		}

		this.msg_for_rooms = {
			0: f(msg.room_0),
			1: f(msg.room_1),
			2: f(msg.room_2),
			3: f(msg.room_3),
			4: f(msg.room_4),
			5: f(msg.room_5)
		}

	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		const f = this.props.intlF.formatMessage;
		// if (nextProps.flights || nextProps.hotels) {
		// 	console.log("GO")
		// 	this.setState({mount: true})
		// 	console.log(this.state)
		// }

		if (nextProps.hotels) {
			let selected = this.state.selected;
			let hotels = nextProps.hotels;
			let flights = nextProps.flights;

			// if (!flights || !hotels) return;

			let flights_classes = flights.available_classes;
			let flights_transfers_count = flights.available_transfers_count;
			let hotels_stars = hotels.available_hotel_stars;
			let hotels_rooms = hotels.available_rooms_persons_count;

			if (hotels_stars && hotels_stars !== null && hotels_stars[0]) {
				selected.hotels_stars = hotels_stars[0].id;
			}

			if (hotels_rooms && hotels_rooms !== null && hotels_rooms[0]) {
				selected.hotels_rooms = hotels_rooms[0].id;
			}

			this.setState({
				hotels_stars: hotels_stars ? this.buildMasForSelect(hotels_stars, f(msg.star_label)) : undefined,
				hotels_rooms: hotels_rooms ? this.buildMasForSelect(hotels_rooms, this.msg_for_rooms) : undefined,
				hotels_link: this.getLink("hotels_link", hotels.offers_link),
				hotels_initial_link: hotels.offers_link,
				flights_classes: this.buildMasForSelect(flights.flights_classes),
				flights_transfers_count: this.buildMasForSelect(flights.flights_transfers_count),
				flights_initial_link: flights.offers_link,
				flights_link: this.getLink("flights_link", flights.offers_link),
				// flights_initial_link: flights.offers_link
				// flights_initial_link: flights.offers_link
				selected
			})
		}
	}


	buildMasForSelect(mas, msg) {
		const hotels = this.props.hotels;

		if (!mas) return [];
		if (typeof mas === "object") return [];

		return mas.map((elem, index) => {
			let label = elem.name;
			if (typeof msg === "string") {
				label = label + " " + msg;
			}

			if (typeof msg === "object") {
				label = msg[elem.id];
			}


			return {
				value: elem.id,
				label
			}
		})
	}

	getLink(name, initial_link) {
		let selected = this.state.selected; 
		let link = initial_link;

		for (let option in selected) {
			let param = params[option].value;
			let prefix = params[option].prefix;
			let value = selected[option];

			link = link + `&${param}=${prefix}${value}`
		}

		return link;
	}

	selectChange(name, val) {
		let selected = this.state.selected; 
		let hotels_link = this.getLink("hotels_link", this.state.hotels_initial_link);

		selected[name] = val.value;

		this.setState({ 
			selected,
			hotels_link
		});
	}

	render() {
		const f = this.props.intlF.formatMessage;
		const hotels = this.props.hotels;
		const flights = this.props.flights;

		return (
			(hotels || flights) ? (
				<div className="search_transports">
					{
						flights ? (
							<div className="search_transport search_place noactive">
								<div className="search_transport_title">
									{flights.country_from_name} - {flights.city_to_name}
									<div className="search_transport_icon blue">
										<img src={plain} alt="" className="icon" />
									</div>
								</div>

								<div className="search_transport_content">

									<a href={flights.offers_link}>
										<FormattedMessage 
											id="search.offers_count"
											defaultMessage="{count} предложений на"
											values = {{
												count: flights.offers_count
											}} />
											&#160;
										 	{flights.offers_service}
									</a>

									<div className="search_transport_selects"></div>
									{
									// <div className="search_transport_selects">
									// 	<div className="search_transport_select">
									// 		<SelectSearch 
									// 			name="flights_transfer"
									// 			options={ this.state.flights_classes }
									// 			value = { this.state.selected }
									// 			selectChange={this.selectChange}
									// 		/>
									// 	</div>
									// 	<div className="search_transport_select">
									// 		<SelectSearch 
									// 			name="flights_transfer"
									// 			options={ this.state.flights_transfers_count }
									// 			value = { this.state.selected }
									// 			selectChange={this.selectChange}
									// 		/>
									// 	</div> 
									// </div>
										
									}
									<div className="search_transport_cost">от {flights.min_price +" "+ flights.currency}</div>	
									<div className="search_transport_time">{f(msg.time_way)}</div>
								</div>

								<div className="search_place_btn">
									{f(msg.check_bilet)}
								</div>
							</div>
						) : null
					}
						{ 
							hotels ? (
							<div className="search_transport search_place noactive">
								<div className="search_transport_title">
									{f(msg.hotels_around)}
									<div className="search_transport_icon orange">
										<img src={cart} alt="" className="icon" />
									</div>
								</div>
								<div className="search_transport_content">
									<a href={hotels.offers_link}>
										<FormattedMessage 
											id="search.offers_count"
											defaultMessage="{count} предложений на"
											values = {{
												count: hotels.offers_count
											}} />
											&#160;
										 	{hotels.offers_service}
									</a>
									<div className="search_transport_selects">
										{
											this.state.hotels_stars && this.state.hotels_stars[0] ? (
												<div className="search_transport_select">
													<SelectSearch 
														name="hotels_stars"
														searchable= {false}
														options={ this.state.hotels_stars }
														value = { this.state.selected.hotels_stars }
														selectChange={this.selectChange}
													/>
												</div>
											) : null
										}
										{ 
											this.state.hotels_rooms && this.state.hotels_rooms[0] ? (
												<div className="search_transport_select">
													<SelectSearch 
														name="hotels_rooms"
														searchable= {false}
														options={ this.state.hotels_rooms }
														value = { this.state.selected.hotels_rooms }
														selectChange={this.selectChange}
													/>
												</div>
											) : null
										}
									</div>
									{ 
										hotels.min_price ? (
											<div className="search_transport_cost">
												от {hotels.min_price +" "+ hotels.currency + " / " + f(msg.full_day)}							 
											</div>	
										) : null
									}
									
									<div className="search_transport_time">
										{f(msg.hotels_armor_early)}
									</div>
								</div>
								<a href={this.state.hotels_link} className="search_place_btn">
									{f(msg.hotels_armor)}
								</a>
							</div>
							) : null
						}		
				</div>
			) : <div className="search_transports" />
		) 
	}
};

export default injectIntl(SearchTransport, {
	intlPropName: "intlF"
})
