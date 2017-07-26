import React, {PureComponent} from 'react';
import tx from 'transform-props-with';
import addElementFunc from '../../../functions/elementStyles';
import {FormattedMessage} from 'react-intl';
import LazyImg from "../../UI/LazyImg"
import {browserHistory} from "react-router"
import Slider from "../../UI/Slider"
import {isTabletSm} from "../../../functions/viewport"
import Content from "../Content"

const rc = addElementFunc("home_countries");
const pr = addElementFunc("");

const
	Countries = tx([{ className: 'home_countries preloader' }, pr])('div'),
	// Content = tx([{ name: 'content', className: "content" }, rc])('div'),
	Item = tx([{ name: 'item', className: "search_place" }, rc])('div'),
	ItemContent = tx([{ name: 'item_content' }, rc])('div'),
	ItemTitle = tx([{ name: 'item_title' }, rc])('div'),
	Flag = tx([{ name: 'item_flag' }, rc])('img'),
	ItemFooter = tx([{ name: 'item_footer' }, rc])('div'),
	Container = tx([{ name: 'container' }, rc])('div');

const ItemClass = ({name, alias, img, clinics_count, reviews_count, flag, route}, {pathnames: {s_host}}) =>
	<Item
		onClick={() => browserHistory.push(`/${route}/country=${alias}/`)}>
		<LazyImg
			src={s_host + img}
			alt={img}
			className="home_countries_item_img" />
		<ItemContent>
			<ItemTitle>
				{name}
				<Flag
					src={s_host + flag}
					alt="" />
			</ItemTitle>
			<ItemFooter>
				<a
					onClick={e => e.preventDefault()}
					href={`/${route}/country=${alias}/`}
					className="link">
					<FormattedMessage
						defaultMessage="{count} клиник"
						values={{count: clinics_count}}
						id="home.countries.clinics"/>
				</a>
				<FormattedMessage
					defaultMessage="{count} отзыва о лечении"
					values={{count: reviews_count}}
					id="home.countries.reviews"/>
			</ItemFooter>
		</ItemContent>
	</Item>;

ItemClass.contextTypes = {pathnames: React.PropTypes.object};

export default class HomeCountries extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {mounted: false}
	}

	componentDidMount() {
		this.setState({mounted: true});
	}

	render() {
		let items = [];
		const
			{
				countries
			} = this.props,
			route = this.context.pathnames.search,
			mounted = this.state.mounted;

		if (!countries.fetched) return <Countries />;

		const {
			data: {
				content,
				countries: array
			}
		} = countries;

		items = array && array.map((item, index) =>
			<ItemClass {...item} key={index} route={route} />
		);

		return (
			<Countries active={true}>
				<Content
					className="home_countries_content"
					content={content} />
				<Container>
					{
						!isTabletSm
							? items
							: mounted ? <Slider slides={items}/> : items
					}
				</Container>
			</Countries>
		)
	}
}

HomeCountries.contextTypes = {
	f: React.PropTypes.func,
	pathnames: React.PropTypes.object,
};

