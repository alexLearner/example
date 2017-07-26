import React, {PureComponent} from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import next from '../../../assets-front/img/icons/next.svg';
import SVG from '../../UI/SVG/';
import {browserHistory} from 'react-router';
import isEqual from "lodash/isEqual"
import isArray from "lodash/isArray"

const msg = defineMessages({
	price: {
		id: "search.compare.price",
		defaultMessage: "от {price}"
	}
});

export default class SearchCompare extends PureComponent {
	shouldComponentUpdate(nextProps) {
		const
			props = this.props,
			index = props.layout.current_country_index,
			nextIndex = nextProps.layout.current_country_index,
			nextQuery = nextProps.filters.query,
			query = props.filters.query;

		return (
			index !== nextIndex ||
			nextQuery.country !== query.country ||
			!isEqual(props.search.compare, nextProps.search.compare)
		)
	}

	returnCompare(items, current) {
		const
			length = items.length,
			{actions} = this.props,
			{f, pathnames: {search: route}} = this.context;

		return items.map((item, index) => {
			let cost = [];
			if (!item) return null;
			if (!current)
				delete item.current;
			else
				item.current = true;

			for (let i=0; i < 5; i++) {
				cost.push(
					<li
						key={i}
						className={item.price > i
							? "search_compare_cost_item active"
							: "search_compare_cost_item"
						}
			    />
				)
			}
			
			return (
				<div className="search_compare_item" key={index}>
					{
						length > 2 ? (
							<div 
								onClick={() => actions.searchRemoveCompare(++index)}
								className="search_compare_remove">
								<i className="icon_close"/>
							</div>
						) : null
					}
					<div className="search_compare_head">
						{item.name}
						{
							item.current ? (
								<FormattedMessage
									id="search.compare.current_text"
									defaultMessage="Текущая страна" />
							) : null
						}
					</div>
					<div className="search_compare_body">
						<div className="search_compare_field">
							<i className="sprite sprite-icon_cost" />
							<FormattedMessage
								tagName="p"
								id="search.compare.cost_services"
								defaultMessage="Стоимость услуг" />
							<div className="search_compare_cost">
								{cost}
							</div>
						</div>
						
						{
							item.hotels_min_price && item.hotels_min_price !== "null" ? (
								<div className="search_compare_field">
									<img
										className="sprite"
										src={SVG.acomodation}
										alt="Отели"/>
									<FormattedMessage
										tagName="p"
										id="search.compare.cost_hotel"
										defaultMessage="Проживание в отеле" />
									<div>
										от&#160;{item.hotels_min_price}{item.currency}&#160;/&#160;
										<FormattedMessage
											id="search.compare.day"
											defaultMessage="сутки" />
									</div>
								</div>
							) : null
						}

						{ 
							item.transfer_min_price ? (
								<div className="search_compare_field">
									<i className="sprite sprite-icon_plain" />
									<FormattedMessage
										tagName="p"
										id="search.compare.cost_transfer"
										defaultMessage="Стоимость перелета" />
									<div>
										{f(msg.price, {price: item.transfer_min_price})}
									</div>
								</div>
							) : null 
						}
						
					</div>

					{
						item.clinics_count ? (
							<a
								onClick={() => browserHistory.push(`/${route}/country=${item.alias}/`)}
								href={`/${route}/country=${item.alias}/`}
								className="search_compare_count search_place_btn">
								<FormattedMessage
									id="search.compare.clinics_in"
									values={{count: item.clinics_count}}
									defaultMessage="{count} клиники в " />&#160;
								{item.name_gde}
							</a>
						) : null
					}

				</div>
			)			
		})
	}

	render() {
		const
			{compare} = this.props.search,
			{query} = this.props.location;

		if (!compare || !isArray(compare)) return null;

		let
				mas = [...compare],
				firstElem = mas.shift(),
				items = this.returnCompare(mas),
				currentItem = this.returnCompare([firstElem], !!query.country);

		return (
			<div className="search_compare">
				<h2 className="search_compare_title section_title">
					<FormattedMessage 
						id="search.compare.cost_in_other_country"
						defaultMessage="Цены на лечение в других странах"/>
				</h2>
				<div className="search_compare_container">
					<div className="search_compare_current">
						{currentItem}
					</div>
					<div className="search_compare_items">
						{items}
						<div
							className="search_tab_nav"
							onClick={() => this.props.actions.showPopup("add_compare")}>
							<img src={next} alt=""/>
							<FormattedMessage
								tagName="p"
								id="search.compare.add_country"
								defaultMessage="Добавить страны" />
							<FormattedMessage
								id="search.compare.for_compare"
								defaultMessage="для сравнения" />
						</div>
					</div>
				</div>
			</div>
		) 
	}
};

SearchCompare.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object
};