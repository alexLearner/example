import React from "react"
import {browserHistory} from "react-router"
import LazyImg from "../../UI/LazyImg"
import RatingList from "../../UI/RatingList"
import addElementFunc from '../../../functions/elementStyles';
import tx from 'transform-props-with';

const
	rc = addElementFunc("home_clinic"),
	pr = addElementFunc(""),
	Title = tx([{ name: 'title' }, rc])('div'),
	Subtitle = tx([{ name: 'subtitle' }, rc])('div'),
	Content = tx([{ name: 'content' }, rc])('div'),
	Location = tx([{ name: 'location' }, rc])('div'),
	Price = tx([{ name: 'price' }, rc])('div'),
	Clinic = tx([{ className: 'home_clinic search_place' }, pr])('a');

const HomeClinic = ({clinic, route, price, imagesObject}, {pathnames: {s_host}}) =>
	<Clinic
		href={`/${route}/${clinic.alias}/`}
		onClick={e => {
			e.preventDefault();
			browserHistory.push(`/${route}/${clinic.alias}/`)
		}}>
		<LazyImg
			src={imagesObject
				? s_host + "/resize_300x170" + clinic.images.name_b
				: s_host + "/resize_300x170" + clinic.images[0].name_b
			}
			alt=""
			className="home_clinic_img"/>
		<Content>
			<Title>
				{clinic.name}
			</Title>
			{
				clinic.reviews_avg_rating
					? <RatingList
						disabled
						link={`/${route}/${clinic.id}/#details_tabs`}
						id={clinic.id}
						rating_5={true}
						rating={clinic.reviews_avg_rating.toFixed(1)} />
					: <div/>
			}

			<Location>
				<i className="sprite sprite-location" />
				{clinic.city_name},&#160;{clinic.country_name}
			</Location>

			<Subtitle>{clinic.texts.brief_title}</Subtitle>

			{
				price ? <Price>{price}</Price> : null
			}
		</Content>
	</Clinic>;


HomeClinic.contextTypes = {pathnames: React.PropTypes.object};

export default HomeClinic