import React, { PureComponent } from 'react'
import tx from 'transform-props-with'
import addElementFunc from "../../functions/elementStyles"
import {defineMessages} from 'react-intl';

const msg = defineMessages({
	you_look: {
		defaultMessage: "Вы просматриваете",
		id: "filters.you_look"
	},
	super_offer: {
		defaultMessage: "Суперпредложения (4-5 звезд)",
		id: "place.hotels.super_offer"
	},
	simple_race: {
		defaultMessage: "Прямым рейсом",
		id: "place.hotels.simple_race"
	},
	cheap: {
		defaultMessage: "Дешевые (3-4 звезды)",
		id: "place.hotels.cheap"
	},
	hotel_price: {
		defaultMessage: "от {price} / сутки",
		id: "place.hotels.hotel_price"
	},
	hard_race: {
		defaultMessage: "С пересадками",
		id: "place.hotels.hard_race"
	},
	price: {
		defaultMessage: "от {price}",
		id: "place.hotels.price"
	},
	bilets_on_gf: {
		defaultMessage: "Выбрать билеты на Google Flights",
		id: "place.hotels.bilets_on_gf"
	},
	bilets_on_b: {
		defaultMessage: "Выбрать отель на Booking.com",
		id: "place.hotels.bilets_on_b"
	},
});

const
	addElementStyles = addElementFunc("search_transfer"),
	Transfer = tx([{ className: 'search_transfer' }])('div'),
	Field = tx([{ name: 'field' }, addElementStyles])('a'),
	Title = tx([{ name: 'title' }, addElementStyles])('div'),
	Header = tx([{ name: 'head' }, addElementStyles])('header'),
	HeaderItem = tx([{ name: 'head_item' }, addElementStyles])('div'),
	Footer = tx([{ name: 'footer' }, addElementStyles])('footer'),
	Cost = tx([{ name: 'cost' }, addElementStyles])('span'),
	City = tx([{ name: 'city' }, addElementStyles])('div'),
	Icon = tx([{ name: 'icon' }, addElementStyles])('img');


export default class TransferClass extends PureComponent {
	constructor( props ) {
		super ( props );

		this.buildMasForSelect = this.buildMasForSelect.bind(this);

		const options = this.buildMasForSelect(props.options);

		this.state = {options};
	}

	buildMasForSelect(mas) {
		if (!mas) return [];

		let result = [];

		for (let key in mas) {
			let item = mas[key];

			result.push({
				value: item.params,
				label: item.name
			})
		}

		return result;
	}

	render() {
		const
			{
				img,
				link,
				innerTitle,
				city_to,
				city,
				innerIcon,
				city_from,
				country_name,
				cheap_price,
				country_from,
				promotional_price,
				flights,
				country_img
			} = this.props,
			f = this.context.f;

		return (
			<Transfer>
				<Title>
					{innerTitle}
				</Title>

				<Header>
					{
						innerIcon ? <Icon src={innerIcon} alt="" /> : null
					}

					{
						flights ? (
								<HeaderItem>
									<div>
										{country_from}
										<img src={img} alt=""/>
									</div>
									<span>{city_from}</span>
								</HeaderItem>
							): null
					}

					{flights ? <span>&#160;&#8212;&#160;</span> : null}

					<HeaderItem active={!flights}>
						<div>
							{!flights ? city + ", " : null }
							{country_name}
							<img src={country_img} alt=""/>
						</div>
						<span>{city_to}</span>
					</HeaderItem>
				</Header>

				{
					promotional_price ? !flights ? (
								<Field href={link}>
									<div>
										{f(msg.super_offer)}
									</div>
									<Cost>
										{f(msg.hotel_price, {price: promotional_price})}</Cost>
								</Field>
							) : (
								<Field href={link + "s=1"}>
									<div>
										{f(msg.simple_race)}
									</div>
									<Cost>{f(msg.price, {price: promotional_price})}</Cost>
								</Field>
							) : null
				}

				{
					cheap_price ? !flights ? (
						<Field href={link}>
							<div>
								{f(msg.cheap)}
							</div>
							<Cost>{f(msg.hotel_price, {price: cheap_price})}</Cost>
						</Field>
					) : (
						<Field href={link + "s=2"}>
							<div>
								{f(msg.hard_race)}
							</div>
							<Cost>{f(msg.price, {price: cheap_price})}</Cost>
						</Field>
					) : null
				}


				<Footer>
					<a href={link} className="link">
						{
							flights
								? f(msg.bilets_on_gf)
								: f(msg.bilets_on_b)
						}
					</a>
				</Footer>
			</Transfer>
		)
	}
};

TransferClass.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};
